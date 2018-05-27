import { Client } from 'discord.js';
import { sample, startsWith, includes } from 'lodash';
import * as firebase from 'firebase';
import { getGeneralChat, isJeuely, notJeuelyOrBot } from './helpers/common.js';
import { bulkDelete, defaultDelete, purge } from './helpers/admin/commands.js';
import { complimentMentionedUsers } from './helpers/admin/responses.js';
import { complimentRandomUser } from './helpers/compliments.js';
import { denyCommand, giveReply } from './helpers/replies.js';
import { checker, dailyPurge, dailyCompliment } from './helpers/cronJobs.js';
import { getFireBaseConfig, setFireBaseComplimentTime } from './helpers/fire.js';

//
//
const client = new Client();
const timeOfLastPurge = 1526592764000;


client.on('ready', () => {
  // start fireBase
  firebase.initializeApp(getFireBaseConfig());
  console.log('Init Time: ', (new Date()).getTime());
  // setFireBaseComplimentTime(new Date());

  // set up crons
  const purgeCron = dailyPurge(client, timeOfLastPurge);
  const complimentCron = dailyCompliment(client);
  const checkerCron = checker(dailyCompliment);
  purgeCron.start();
  complimentCron.start();
  checkerCron.start();

  console.log(purgeCron.running, complimentCron.running, checkerCron.running);
  // and say hello
  console.log('Hello World!');
});


//
// Do something with a command
const handleCommand = (message) => {
  const msgContent = message.content;
  const author = message.author;
  const channel = getGeneralChat(client);

  if (startsWith(message.content, '!purge')) {
    purge(channel, timeOfLastPurge);
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
  const msgContent = message.content;
  const channel = getGeneralChat(client);

  if (includes(message.content, 'compliment')) {
    complimentMentionedUsers(message, channel);
  }
};


//
// Listen to every message
client.on('message', (message) => {
  // message is a command
  if (startsWith(message.content, '!') && isJeuely(message.author)) {
    handleCommand(message);
  }
  // message mentions bot
  if (message.isMentioned('434765029816926218')) {
    if (notJeuelyOrBot(message.author)) {
      giveReply(message);
    } else if (isJeuely(message.author)) {
      handleResponse(message);
    }
  }
});

client.login(process.env.BOT_TOKEN);
