import { CronJob } from 'cron';
import { random } from 'lodash';
import { getGeneralChat, getRandomUser } from './common.js';
import { purge } from './admin/commands.js';
import { complimentRandomUser } from './compliments.js';


export const checker = () => {
  const checkerCron = new CronJob('59 0 * * * *', () => {
    console.log('ping');
  });
  return checkerCron;
}

export const dailyPurge = (client, timeOfLastPurge) => {
  const purgeCron = new CronJob('0 0 7 * * *', () => {
      purge(getGeneralChat(client), timeOfLastPurge)
  })
  return purgeCron;
}

export const dailyCompliment = (client) => {
  const compliment = new CronJob('0 0 7 * * *', () => {
      setTimeout(function() {
          complimentRandomUser(getGeneralChat(client));
      }, random(3600000, 43200000));
  });
  return compliment;
}
