import { Client } from 'discord.js';
import { getGeneralChat, isJeuely, isBot, logError } from './helpers/common.js';
import { bulkDelete, defaultDelete, purge } from './helpers/commands.js';
import { makeChecker, makeDaily } from './helpers/cronJobs.js';

//
//
const client = new Client();
let timeOfLastPurge = 1525149600000; //time for crons

client.on('ready', () => {
  // set up crons
  const purgeAndUpdateTime = () => {
    purge(getGeneralChat(client), timeOfLastPurge);
    timeOfLastPurge = new Date().getTime();
  }
  const daily = makeDaily(purgeAndUpdateTime);
  const checker = makeChecker();
  daily.start();
  checker.start();

  // and say hello
  console.log("Hello World!")
});


//
//
const handleCommand = (message) => {
  const msgContent = message.content;
  const author = message.author;
  const channel = getGeneralChat(client);

  if (!isJeuely(author.id)) {
    message.reply('I love you');
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
  if (message.isMentioned('434765029816926218') && !isJeuely(message.author.id)) {
    message.reply(`You are an amazing person and I'm glad to know you!`);
  }
});

client.login(process.env.BOT_TOKEN);
