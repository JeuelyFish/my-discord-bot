const CronJob = require('cron').CronJob;
const Discord = require('discord.js');
const client = new Discord.Client();
const common = require('./helpers/common.js');
const commands = require('./helpers/commands.js');
const crons = require('./helpers/cronJobs.js');

//
//
let timeOfLastPurge = 1524257854000;

//
//
const handleCommand = (message) => {
  const msgContent = message.content;
  const author = message.author;

  if (!common.isJeuely(author.id)) {
    message.reply('NO! YOU BAD!');
    return;
  }

  if (msgContent.indexOf('!purge') === 0) {
    commands.purge(client, timeOfLastPurge);
  }

  if (msgContent.indexOf('!delete') === 0) {
    const splitMsg = msgContent.split(' ');
    if (splitMsg.length === 1) {
      commands.defaultDelete(client);
    } else {
      commands.bulkDelete(client, splitMsg);
    }
  }
}

client.on('ready', () => {
  console.log('Ready!');
  const daily = crons.makeDaily(timeOfLastPurge);
  const checker = crons.makeChecker();
  daily.start();
  checker.start();
});

client.on('message', message => {
  if (message.content.indexOf('!') === 0) {
    handleCommand(message)
  }
  if (message.isMentioned('434765029816926218') && !common.isJeuely(message.author.id)) {
    message.reply(`Don't talk to me right now!`);
  }
});

client.login(process.env.BOT_TOKEN);
