import {CronJob} from 'cron';

module.exports = {
  makeChecker: () => {
    const checker = new CronJob('59 0 * * * *', () => {
      console.log('ping');
    });
    return checker;
  },
  makeDaily: (cronFunction) => {
    const daily = new CronJob('0 0 7 * * *', cronFunction,
      () => {
        console.info('DAILY JOB HAS STOPPED!')
      },
      false,
      'America/Los_Angeles'
    );
    return daily;
  }
};
