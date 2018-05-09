import { Client } from 'discord.js';
import { getGeneralChat, isJeuely, isBot, logError, getRandomUser } from './helpers/common.js';
import { bulkDelete, defaultDelete, purge } from './helpers/commands.js';
import { complimentUser } from './helpers/compliments.js';
import { denyCommand, giveReply } from './helpers/replies.js';


import { makeChecker, makeDaily } from './helpers/cronJobs.js';

//
//
const client = new Client();
let timeOfLastPurge = 1525149600000; //time for crons

client.on('ready', () => {
    const generalChat = getGeneralChat(client);
  // set up crons
  const purgeAndUpdateTime = () => {
    purge(generalChat, timeOfLastPurge);
    timeOfLastPurge = new Date().getTime();
  }
  const daily = makeDaily(purgeAndUpdateTime);
  const checker = makeChecker();
  daily.start();
  checker.start();

  // complimentUser(generalChat)
  // and say hello
  console.log("Hello World!")
});


//
//
const handleCommand = (message) => {
  const msgContent = message.content;
  const author = message.author;
  const channel = getGeneralChat(client);

  if (!isJeuely(author)) {
    denyCommand(message);
    return;
  }

  if (msgContent.indexOf('!purge') === 0) {
    purge(channel, timeOfLastPurge);
  }

  if (msgContent.indexOf('!delete') === 0) {
    const splitMsg = msgContent.split(' ');
    if (splitMsg.length === 1) {
      defaultDelete(channel);
    } else {
      bulkDelete(channel, splitMsg);
    }
  }
}

//
//
client.on('message', message => {
  if (message.content.indexOf('!') === 0) {
    handleCommand(message)
  }
  message.mentions.users
  if (message.isMentioned('434765029816926218') && !isJeuely(message.author)) {
    giveReply(message);
    return;
  }
});

client.login(process.env.BOT_TOKEN);
