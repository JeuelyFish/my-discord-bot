import moment from 'moment';
import { random } from 'lodash';

import * as firebase from "firebase";

export const setFireBaseComplimentTime = (runTime, addDay) => {
    const database = firebase.database();
    const momentObj = (moment(runTime, 'PST'));
    const nextDay = momentObj.clone().add( addDay ? 1 : 0, 'day').startOf('day');
    const addHours = nextDay.clone().add(random(8, 15), 'hours');
    const utcTime = addHours.toDate().getTime();
    console.log("setting this UTC Time: ", utcTime);
    database.ref('nextComplimentTime').set(utcTime);
}

export const getFireBaseComplimentTime = () => {
    // return a promise
    const database = firebase.database();
    // const promiseValue = new Promise(function(resolve, reject) {
    //   resolve (database.ref('nextComplimentTime').once('value'));
    // });
    // return promiseValue;
    return database.ref('nextComplimentTime').once('value');
}

export const getFireBaseConfig = () => {
    return {
      apiKey: process.env.FIREBASE_APIKEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.FIREBASE_DATABASEURL,
      projectId: process.env.FIREBASE_PROJECTID,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID
    };
}
