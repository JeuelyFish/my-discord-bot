import { Client } from 'discord.js';
import { startsWith, includes, sortBy, reverse, forEach, isEqual, find, lowerCase, head, parseInt } from 'lodash';
import * as firebase from 'firebase';
import moment from 'moment';
import { getGeneralChat, isJeuely, isBot, notJeuelyOrBot } from './helpers/common';
import { bulkDelete, defaultDelete, purge } from './helpers/admin/commands';
import { complimentMentionedUsers } from './helpers/compliments';
import { giveSmilieReply, giveMuteReply } from './helpers/replies';
import { checker, dailyPurge, dailyCompliment } from './helpers/cronJobs';
import { getFireBaseConfig } from './helpers/fire';

//
//
const client = new Client();
const currentReminders = []

client.on('ready', () => {
  // start fireBase
  firebase.initializeApp(getFireBaseConfig());
  console.info('Init Time: ', (new Date()).getTime());

  // set up reminders
  forEach(client.users.array(), function(user){
      currentReminders.push( {username: user.username, id: user.id, reminder: null })
  })

  // set up crons
  const purgeCron = dailyPurge(client);
  const complimentCron = dailyCompliment(client);
  const checkerCron = checker(dailyCompliment);
  purgeCron.start();
  complimentCron.start();
  checkerCron.start();

  // log all running crons
  console.info(purgeCron.running, complimentCron.running, checkerCron.running);
});


//
// Do something with a command
const handleCommand = (message) => {
  const msgContent = message.content;
  const msgAuthor = message.author;
  const channel = getGeneralChat(client);

  if(!isJeuely(msgAuthor)) {
      denyCommand(message);
      return;
  }

  if (startsWith(message.content, '!purge')) {
    purge(channel);
  }

  if (startsWith(message.content, '!delete')) {
    const splitMsg = msgContent.split(' ');
    if (splitMsg.length === 1) {
      defaultDelete(channel);
    } else {
      bulkDelete(channel, splitMsg);
    }
  }
};

//
// Respond in some way to a user
const handleResponse = (message) => {
    const channel = getGeneralChat(client);

    if (includes(message.content, 'compliment')) {
        complimentMentionedUsers(message, channel);
    } else {
        giveSmilieReply(message);
    }
};
const handleDirectMessage = (message) => {
  if (includes(message.content, 'remind ') &&
    includes(message.content, 'in ') &&
    includes(message.content, 'to ')) {
    let originalMsgTxt = lowerCase(message.content);
    const sortedArray = sortBy([{
      type: 'toAction',
      targetStr: 'to ',
      idx: message.content.indexOf('to ')
    }, {
      type: 'inDuration',
      targetStr: 'in ',
      idx: message.content.indexOf('in ')
    }, {
      type: 'remindTarget',
      targetStr: 'remind ',
      idx: message.content.indexOf('remind ')
    }], (reminderObj) => {
      return reminderObj.idx
    })
    reverse(sortedArray)

    forEach(sortedArray, function(itemObj) {
      const stringVal = originalMsgTxt.slice(itemObj.idx);
      itemObj.responseStr = originalMsgTxt.slice(itemObj.idx)
        .replace(itemObj.targetStr, '')
        .trim();
      originalMsgTxt = originalMsgTxt.replace(stringVal, '');
    });

    const reminderAction = find(sortedArray, (o) => isEqual(o.type, 'toAction') );
    const reminderTime = find(sortedArray, (o) => isEqual(o.type, 'inDuration') );
    const reminderTarget = find(sortedArray, (o) => isEqual(o.type, 'remindTarget') );


    const authorsReminder = find(currentReminders, (obj) => (obj.id === message.author.id));
    if(authorsReminder.reminder === null){
        authorsReminder.reminderAction = reminderAction;
        message.reply(`Ok, I will remind you to "${reminderAction.responseStr}" in about ${reminderTime.responseStr}`);
        setReminderTimeOutMsg(reminderTime.responseStr, reminderAction.responseStr, message, authorsReminder);
    } else {
        message.reply(`You already have a reminder set for "${authorsReminder.reminderAction.responseStr}"!`);
    }


  } else {
    giveMuteReply(message);
  }
}

const setReminderTimeOutMsg = (reminderString, actionString, message, authorsReminder) => {
  const containsHour = includes(reminderString, 'hour');
    // if user did not specify time metric, assume it is minutes
  let containsMinute = !containsHour || includes(reminderString, 'minute');

  if(containsMinute && containsHour) {
    message.reply(`This time format is kinda.... weird... 🤔`);
    return;
  }

  const regexNumPattern = /\d+/g;
  const number = parseInt(head(reminderString.match( regexNumPattern )))
  let milliseconds = 0;
  if(containsHour){
    milliseconds = (number * 3600000);
  }
  if(containsMinute) {
    milliseconds = (number * 60000);
  }


  authorsReminder.reminder = setTimeout(() => {
    message.reply(`Hey ${message.author}, you should "${actionString}"!`);
    clearTimeout(authorsReminder.reminder);
    authorsReminder.reminder = null;
  }, milliseconds);
}


//
// Listen to every message
client.on('message', (message) => {
    if(isBot(message.author)){ // if the message the bot talking
      return; // ignore it
    }

    if (message.channel.type === 'dm') { // message is a private DM message
        handleDirectMessage(message);
    } else if (startsWith(message.content, '!')) { // message is a command
        handleCommand(message);
    } else if (message.isMentioned('434765029816926218')) { // message mentions bot (is not DM or command)
        handleResponse(message);
    }
});

client.login(process.env.BOT_TOKEN);
