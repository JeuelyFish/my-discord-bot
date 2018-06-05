import { CronJob } from 'cron';
import { isEqual } from 'lodash';
import moment from 'moment';
import { getGeneralChat } from './common';
import { purge } from './admin/commands';
import { complimentRandomUser } from './compliments';
import { getFireBaseComplimentTime, setFireBaseComplimentTime } from './fire';

export const checker = () => {
  const checkerCron = new CronJob({
    cronTime: '0 59 * * * *',
    onTick() {
      console.info('ping', (new Date()).getTime());
    },
    start: false,
    timeZone: 'America/Los_Angeles',
  });
  return checkerCron;
};

export const dailyPurge = (client) => {
  const purgeCron = new CronJob({
    cronTime: '0 0 7 * * *',
    onTick() {
      purge(getGeneralChat(client), true);
    },
    start: false,
    timeZone: 'America/Los_Angeles',
  });
  return purgeCron;
};


export const dailyCompliment = (client) => {
  const compliment = new CronJob({
    cronTime: '0 0 * * * *', // every hour
    onTick() {
      // get the current hour & date
      const now = moment(new Date(), 'PST');
      const currentHour = now.hour();
      const currentDate = now.date();

      // get the compliment hour & date
      getFireBaseComplimentTime().then((complimentTime) => {
        const timeValue = complimentTime.val();
        const complimentMoment = moment(new Date(timeValue), 'PST');
        const complimentHour = complimentMoment.hour();
        const complimentDate = complimentMoment.date();
        // if they are the same
        if (isEqual(currentHour, complimentHour) && isEqual(currentDate, complimentDate)) {
          // compliment a random user
          complimentRandomUser(getGeneralChat(client));
          // and set a new compliment time
          setFireBaseComplimentTime(new Date());
        }
      });
    },
    onComplete() {
      console.warn('JOB HAS ENDED'); // this should never happen,
      this.start(); //  but heroku can be broke-ku
    },
    start: false,
    timeZone: 'America/Los_Angeles',
  });
  return compliment;
};
