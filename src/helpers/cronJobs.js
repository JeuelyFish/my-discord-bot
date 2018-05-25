import { CronJob, CronTime } from 'cron';
import { random, range, includes, get, sample } from 'lodash';
import { getGeneralChat, getRandomUser } from './common.js';
import { purge } from './admin/commands.js';
import { complimentRandomUser } from './compliments.js';
import moment from 'moment';
import * as firebase from "firebase";
import {getFireBaseComplimentTime, setFireBaseComplimentTime} from './fire.js'

export const checker = () => {
  var checkerCron = new CronJob({cronTime: '0 59 * * * *',
    onTick: function() {
      console.log("ping", new Date)
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
        console.log("nowMoment is valid:", now.isValid());
        // get the compliment hour
        getFireBaseComplimentTime().then(
            function(complimentTime) {
                const timeValue = complimentTime.val();
                console.log("timeValue: ", timeValue)
                const complimentMoment = moment(timeValue, 'PST');
                const complimentHour = complimentMoment.hour();
                console.log("complimentMoment is valid:", complimentMoment.isValid());

                console.log("I compare", currentHour, complimentHour)
                // if they are the same
                if(currentHour == complimentHour) {
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
