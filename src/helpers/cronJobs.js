import { CronJob, CronTime } from 'cron';
import { random, range, includes, get, sample } from 'lodash';
import { getGeneralChat, getRandomUser } from './common.js';
import { purge } from './admin/commands.js';
import { complimentRandomUser } from './compliments.js';
import moment from 'moment';
import * as firebase from "firebase";
import {getFireBaseComplimentTime, setFireBaseComplimentTime} from './fire.js'

export const checker = (targetCron) => {
  var checkerCron = new CronJob({cronTime: '0 59 * * * *',
    onTick: function() {
        console.log("ping", targetCron.cronTime.source)
      console.log("status:", targetCron.running)
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

  var compliment = new CronJob({
    cronTime: '0 0 * * * *', //every hour
    onTick: function() {
         // get the current hour
        const now = moment(new Date, 'PST');
        const currentHour = now.hour();
        // get the compliment hour
        const nextComplimentTime = getFireBaseComplimentTime();
        getFireBaseComplimentTime.then(
            function(complimentTime) {
                const complimentMoment = moment(complimentTime, 'PST');
                const complimentHour = nextComplimentTime.hour();
                console.log(complimentMoment.isValid());
                // if they are the same
                if(currentHour == nextComplimentHour) {
                    // compliment a random user
                    complimentRandomUser(getGeneralChat(client));
                    // and set a new compliment time
                    setFireBaseComplimentTime(new Date, true);
                }
        });
    },
    onComplete: function() {
      console.log("JOB HAS ENDED") // this should never happen,
      this.start(); //  but heroku can be broke-ku
    },
    start: false,
    timeZone: 'America/Los_Angeles',
  });
  return compliment;
}
