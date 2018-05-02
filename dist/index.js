'use strict';

var _discord = require('discord.js');

var _common = require('./helpers/common.js');

var _commands = require('./helpers/commands.js');

var crons = require('./helpers/cronJobs.js');

//
//
var client = new _discord.Client();
var timeOfLastPurge = 1524198050000; //time for crons

client.on('ready', function () {
  // set up crons
  var purgeAndUpdateTime = function purgeAndUpdateTime() {
    (0, _commands.purge)((0, _common.getGeneralChat)(client), timeOfLastPurge);
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
  var channel = (0, _common.getGeneralChat)(client);

  if (!(0, _common.isJeuely)(author.id)) {
    message.reply('NO! YOU BAD!');
    return;
  }

  if (msgContent.indexOf('!purge') === 0) {
    (0, _commands.purge)(channel, timeOfLastPurge);
  }

  if (msgContent.indexOf('!delete') === 0) {
    var splitMsg = msgContent.split(' ');
    if (splitMsg.length === 1) {
      (0, _commands.defaultDelete)(channel);
    } else {
      (0, _commands.bulkDelete)(channel, splitMsg);
    }
  }
};

//
//
client.on('message', function (message) {
  if (message.content.indexOf('!') === 0) {
    handleCommand(message);
  }
  if (message.isMentioned('434765029816926218') && !(0, _common.isJeuely)(message.author.id)) {
    message.reply('Don\'t talk to me right now!');
  }
});

client.login(process.env.BOT_TOKEN);