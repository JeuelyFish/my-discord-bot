import { Client } from 'discord.js';
import { startsWith, includes } from 'lodash';
import * as firebase from 'firebase';
import { getGeneralChat, isJeuely, notJeuelyOrBot } from './helpers/common';
import { bulkDelete, defaultDelete, purge } from './helpers/admin/commands';
import { complimentMentionedUsers } from './helpers/admin/responses';
import { giveReply } from './helpers/replies';
import { checker, dailyPurge, dailyCompliment } from './helpers/cronJobs';
import { getFireBaseConfig } from './helpers/fire';

//
//
const client = new Client();

client.on('ready', () => {
  // start fireBase
  firebase.initializeApp(getFireBaseConfig());
  console.info('Init Time: ', (new Date()).getTime());

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
  const channel = getGeneralChat(client);

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
