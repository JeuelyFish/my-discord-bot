import moment from 'moment';
import { random } from 'lodash';

import * as firebase from "firebase";

export const setFireBaseComplimentTime = (runTime) => {
    const database = firebase.database();
    const momentObj = (moment(runTime, 'PST'));
    const nextDay = momentObj.clone().add(1, 'day').startOf('day');
    const addHours = nextDay.clone().add(random(8, 15), 'hours');
    database.ref('nextComplimentTime').set(addHours.toDate().getTime());
}

export const getFireBaseComplimentTime = () => {
    // return a promise
    const database = firebase.database();
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
