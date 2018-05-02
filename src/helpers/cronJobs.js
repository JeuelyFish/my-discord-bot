import { CronJob } from 'cron';

export const makeChecker = () => {
  const checker = new CronJob('59 0 * * * *', () => {
    console.log('ping');
  });
  return checker;
}

export const makeDaily = (cronFunction) => {
  const daily = new CronJob('0 0 7 * * *', cronFunction,
    () => {
      console.info('DAILY JOB HAS STOPPED!')
    },
    false,
    'America/Los_Angeles'
  );
  return daily;
}
