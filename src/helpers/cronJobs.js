import { CronJob, CronTime } from 'cron';
import { random, range, includes, get, sample } from 'lodash';
import { getGeneralChat, getRandomUser } from './common.js';
import { purge } from './admin/commands.js';
import { complimentRandomUser } from './compliments.js';
import moment from 'moment'


const createSemiRandomTime = (anchorDate, increment) => {
    const monthInt = anchorDate.month();
    const dayInt = anchorDate.date();
    const hourInt = anchorDate.hours();

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

    const semiRandomHour = (hourInt < 18 && hourInt > 8) ? random(hourInt, 19) : random(8, 19);
    timeArray.unshift(semiRandomHour); // add hours
    timeArray.unshift(random(0, 59)); // add minutes
    timeArray.unshift(0); // add seconds
    return timeArray.join(' ');
}

export const checker = () => {
  var checkerCron = new CronJob({cronTime: '0 59 * * * *',
    onTick: function() {
      console.log("ping")
    },
    start: false,
    timeZone: 'America/Los_Angeles',
  });
  return checkerCron;
}

export const dailyPurge = (client, timeOfLastPurge) => {
  var purgeCron = new CronJob({cronTime: '0 0 7 * * *',
    onTick: function() {
      purge(getGeneralChat(client), timeOfLastPurge)
    },
    start: false,
    timeZone: 'America/Los_Angeles',
  });
  return purgeCron;
}


export const dailyCompliment = (client) => {
  const initTime = moment(new Date, 'PST');
  const firstCronTime = createSemiRandomTime(initTime);
  console.log("FIRST run time at: ", firstCronTime);

  var compliment = new CronJob({
    cronTime: firstCronTime,
    onTick: function() {
      // first compliment a random user in general chat
      complimentRandomUser(getGeneralChat(client));
      // make a cronString for the next day
      const tickTime = moment(new Date, 'PST');
      const cronTimeString = createSemiRandomTime(tickTime, true);
      // and set it
      console.log("NEXT run time at: " + cronTimeString);
      this.setTime(new CronTime(cronTimeString));
    },
    onComplete: function() {
      console.log("JOB HAS ENDED")
      this.start();
    },
    start: false,
    timeZone: 'America/Los_Angeles',
    // runOnInit: true
  });
  return compliment;
}
