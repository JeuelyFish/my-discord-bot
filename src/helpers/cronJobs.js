import { CronJob, CronTime } from 'cron';
import { random, range, includes, get, sample } from 'lodash';
import { getGeneralChat, getRandomUser } from './common.js';
import { purge } from './admin/commands.js';
import { complimentRandomUser } from './compliments.js';
import moment from 'moment';
import * as firebase from 'firebase';
import { getFireBaseComplimentTime, setFireBaseComplimentTime } from './fire.js';

export const checker = () => {
  const checkerCron = new CronJob({
    cronTime: '0 59 * * * *',
    onTick() {
      console.log('ping', (new Date()).getTime());
    },
    start: false,
    timeZone: 'America/Los_Angeles',
  });
  return checkerCron;
};

export const dailyPurge = (client, timeOfLastPurge) => {
  const purgeCron = new CronJob({
    cronTime: '0 0 7 * * *',
    onTick() {
      purge(getGeneralChat(client), timeOfLastPurge);
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
      // get the current hour
      const now = moment(new Date(), 'PST');
      const currentHour = now.hour();
      // get the compliment hour
      getFireBaseComplimentTime().then((complimentTime) => {
        const timeValue = complimentTime.val();
        const complimentMoment = moment(new Date(timeValue), 'PST');
        const complimentHour = complimentMoment.hour();
        // if they are the same
        if (currentHour == complimentHour) {
          // compliment a random user
          complimentRandomUser(getGeneralChat(client));
          // and set a new compliment time
          setFireBaseComplimentTime(new Date());
        }
      });
    },
    onComplete() {
      console.log('JOB HAS ENDED'); // this should never happen,
      this.start(); //  but heroku can be broke-ku
    },
    start: false,
    timeZone: 'America/Los_Angeles',
  });
  return compliment;
};
