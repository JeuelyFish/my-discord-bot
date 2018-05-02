const Discord = require('discord.js');
const client = new Discord.Client();
const crons = require('./helpers/cronJobs.js');
const Common = require('./helpers/common.js');
const Commands = require('./helpers/commands.js');

//
//
let timeOfLastPurge = 1524198050000; //time for crons
let cmn = new Common(client); //common helpers
let cmd; //commands

client.on('ready', () => {
  // set up commands
  cmd = new Commands(cmn.generalChat, cmn.logError);

  // set up crons
  const purgeAndUpdateTime = () => {
    cmd.purge(timeOfLastPurge);
    timeOfLastPurge = new Date().getTime();
  }
  const daily = crons.makeDaily(purgeAndUpdateTime);
  const checker = crons.makeChecker();
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

  if (!cmn.isJeuely(author.id)) {
    message.reply('NO! YOU BAD!');
    return;
  }

  if (msgContent.indexOf('!purge') === 0) {
    cmd.purge(timeOfLastPurge);
  }

  if (msgContent.indexOf('!delete') === 0) {
    const splitMsg = msgContent.split(' ');
    if (splitMsg.length === 1) {
      cmd.defaultDelete();
    } else {
      cmd.bulkDelete(splitMsg);
    }
  }
}

//
//
client.on('message', message => {
  if (message.content.indexOf('!') === 0) {
    handleCommand(message)
  }
  if (message.isMentioned('434765029816926218') && !cmn.isJeuely(message.author.id)) {
    message.reply(`Don't talk to me right now!`);
  }
});

client.login(process.env.BOT_TOKEN);
