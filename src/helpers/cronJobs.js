import { CronJob, CronTime } from 'cron';
import { random, range, includes, get, sample } from 'lodash';
import { getGeneralChat, getRandomUser } from './common.js';
import { purge } from './admin/commands.js';
import { complimentRandomUser } from './compliments.js';


const createSemiRandomTime = (dayInt, monthInt, increment) => {
    const timeArray = ['*'];
    const monthsWith30Days = [3, 5, 8];
    const monthsWith31Days = [0, 2, 4, 6, 7, 9, 10, 11]
    const endOf30DayMonth = includes(monthsWith30Days, monthInt) && dayInt === 30;
    const endOf31DayMonth = includes(monthsWith31Days, monthInt) && dayInt === 31;
    const endOf28DayMonth = (monthInt === 1 && dayInt === 28);

    if(increment){ // if you need to increment, check Months and days
      if (endOf31DayMonth && monthInt === 11){
          timeArray.unshift(0, 1)
      } else if (endOf30DayMonth || endOf31DayMonth || endOf28DayMonth){
          timeArray.unshift(monthInt + 1)
          timeArray.unshift(1)
      }  else {
          timeArray.unshift(monthInt)
          timeArray.unshift(dayInt + 1)
      }
    } else { // else just shove in the day and month
      timeArray.unshift(monthInt);
      timeArray.unshift(dayInt);
    }

    timeArray.unshift(random(8, 14)); // add hours
    timeArray.unshift(random(0, 59)); // add minutes
    timeArray.unshift(0); // add seconds
    return timeArray.join(' ');
}



export const checker = () => {
  const checkerCron = new CronJob('0 59 * * * *',
  function() {
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
  const now = new Date;
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const firstCronTime = createSemiRandomTime(currentDay, currentMonth);
  console.log("FIRST run time at: ", firstCronTime);

  var compliment = new CronJob({
    cronTime: firstCronTime,
    onTick: function() {
      console.log(this.cronTime)
      console.log('*****************')
      console.log(this.cronTime.source)

      const nextRunTime = this.nextDates().toDate();
      const nextMonth = nextRunTime.getMonth();
      const nextDay = nextRunTime.getDate();

      complimentRandomUser(getGeneralChat(client));
      const cronTimeString = createSemiRandomTime(nextDay, nextMonth, true);
      console.log("NEXT run time at: " + cronTimeString);
      this.setTime(new CronTime(cronTimeString));
    },
    onComplete: function() {
      console.log("JOB HAS ENDED")
      this.start();
    },
    start: false,
    timeZone: 'America/Los_Angeles',
    runOnInit: true
  });
  return compliment;
}
