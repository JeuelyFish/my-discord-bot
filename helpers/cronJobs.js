const CronJob = require('cron').CronJob;

module.exports = {
  makeChecker: (client) => {
    // const checker = new CronJob('* * * * * *', () => {
    const checker = new CronJob('59 0 * * * *', () => {
      console.log('ping');
    });
    return checker;
  },
  makeDaily: (timeOfLastPurge) => {
    const daily = new CronJob('0 0 7 * * *', () => {
        handlePurge();
        timeOfLastPurge = new Date().getTime();
      },
      () => {
        console.log('DAILY JOB HAS STOPPED!');
      },
      false, /* Start the job right now */
      'America/Los_Angeles' /* Time zone of this job. */
    );
    return daily;
  }
};
