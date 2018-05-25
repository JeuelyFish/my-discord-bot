import moment from 'moment';
import { random } from 'lodash';
import * as firebase from "firebase";

export const setFireBaseComplimentTime = (runTime, addDay) => {
    const database = firebase.database();
    const momentObj = (moment(runTime, 'PST'));
    const nextUtcTime = momentObj.clone()
      .add( addDay ? 1 : 0, 'day')
      .startOf('day')
      .add(random(8, 15), 'hours')
      .toDate()
      .getTime();
    console.log("setting this UTC Time: ", nextUtcTime);
    database.ref('nextComplimentTime').set(nextUtcTime);
}

export const getFireBaseComplimentTime = () => {
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
