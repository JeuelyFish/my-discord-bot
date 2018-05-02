'use strict';

var Discord = require('discord.js');
var client = new Discord.Client();
var crons = require('./helpers/cronJobs.js');
var Common = require('./helpers/common.js');
var Commands = require('./helpers/commands.js');

//
//
var timeOfLastPurge = 1524198050000; //time for crons
var cmn = new Common(client); //common helpers
var cmd = void 0; //commands

client.on('ready', function () {
  // set up commands
  cmd = new Commands(cmn.generalChat, cmn.logError);

  // set up crons
  var purgeAndUpdateTime = function purgeAndUpdateTime() {
    cmd.purge(timeOfLastPurge);
    timeOfLastPurge = new Date().getTime();
  };
  var daily = crons.makeDaily(purgeAndUpdateTime);
  var checker = crons.makeChecker();
  daily.start();
  checker.start();

  // and say hello
  console.log("Hello World!");
});

//
//
var handleCommand = function handleCommand(message) {
  var msgContent = message.content;
  var author = message.author;

  if (!cmn.isJeuely(author.id)) {
    message.reply('NO! YOU BAD!');
    return;
  }

  if (msgContent.indexOf('!purge') === 0) {
    cmd.purge(timeOfLastPurge);
  }

  if (msgContent.indexOf('!delete') === 0) {
    var splitMsg = msgContent.split(' ');
    if (splitMsg.length === 1) {
      cmd.defaultDelete();
    } else {
      cmd.bulkDelete(splitMsg);
    }
  }
};

//
//
client.on('message', function (message) {
  if (message.content.indexOf('!') === 0) {
    handleCommand(message);
  }
  if (message.isMentioned('434765029816926218') && !cmn.isJeuely(message.author.id)) {
    message.reply('Don\'t talk to me right now!');
  }
});

client.login(process.env.BOT_TOKEN);