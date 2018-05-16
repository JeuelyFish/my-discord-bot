import { CronJob, CronTime } from 'cron';
import { random } from 'lodash';
import { getGeneralChat, getRandomUser } from './common.js';
import { purge } from './admin/commands.js';
import { complimentRandomUser } from './compliments.js';


export const checker = () => {
  const checkerCron = new CronJob('3 * * * * *',
  function() {
    // console.log('ping');
    // console.log(this.cronTime.source);
    // console.log(this.nextDates());
    //
    // if(this.cronTime.source != '* * * * * *'){
    //   this.setTime(new CronTime('* * * * * *'));
    // }
  },
  function() {
    // console.log("JOB ENDED")
    // this.start();
  }

  );
  return checkerCron;
}

export const dailyPurge = (client, timeOfLastPurge) => {
  const purgeCron = new CronJob('0 0 7 * * *', () => {
      purge(getGeneralChat(client), timeOfLastPurge)
  })
  return purgeCron;
}

export const dailyCompliment = (client) => {
  // const compliment = new CronJob('0 0 7 * * *', () => {
  //     setTimeout(function() {
  //         complimentRandomUser(getGeneralChat(client));
  //     }, random(3600000, 43200000));
  // });
  var compliment = new CronJob({
  cronTime: '0 0 7 * * *',
  onTick: function() {
    /*
     * Runs every weekday (Monday through Friday)
     * at 11:30:00 AM. It does not run on Saturday
     * or Sunday.
     */
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();
  return compliment;
}
