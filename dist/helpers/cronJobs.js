'use strict';

var CronJob = require('cron').CronJob;

module.exports = {
  makeChecker: function makeChecker() {
    var checker = new CronJob('59 0 * * * *', function () {
      console.log('ping');
    });
    return checker;
  },
  makeDaily: function makeDaily(cronFunction) {
    var daily = new CronJob('0 0 7 * * *', cronFunction, function () {
      console.info('DAILY JOB HAS STOPPED!');
    }, false, 'America/Los_Angeles');
    return daily;
  }
};