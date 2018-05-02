'use strict';

var _cron = require('cron');

module.exports = {
  makeChecker: function makeChecker() {
    // const checker = new CronJob('59 0 * * * *', () => {
    var checker = new _cron.CronJob('* * * * * *', function () {
      console.log('ping');
    });
    return checker;
  },
  makeDaily: function makeDaily(cronFunction) {
    var daily = new _cron.CronJob('0 0 7 * * *', cronFunction, function () {
      console.info('DAILY JOB HAS STOPPED!');
    }, false, 'America/Los_Angeles');
    return daily;
  }
}; // const CronJob = require('cron').CronJob;