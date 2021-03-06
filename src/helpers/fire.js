import moment from 'moment';
import { random } from 'lodash';
import * as firebase from 'firebase';

//
// Purge Time
export const setFireBasePurgeTime = (runTime) => {
  const database = firebase.database();
  const purgeUtcTime = moment(runTime, 'PST').subtract(1 , 'hour').valueOf();
  database.ref('purgeTime').set(purgeUtcTime);
};

export const getFireBasePurgeTime = () => {
  const database = firebase.database();
  return database.ref('purgeTime').once('value');
};

//
// Compliment Time
export const setFireBaseComplimentTime = (runTime) => {
  const database = firebase.database();
  const momentObj = (moment(runTime, 'PST'));
  const nextUtcTime = momentObj.clone()
    .add(1, 'day')
    .startOf('day')
    .add(random(8, 15), 'hours')
    .valueOf();
  database.ref('nextComplimentTime').set(nextUtcTime);
};

export const getFireBaseComplimentTime = () => {
  const database = firebase.database();
  return database.ref('nextComplimentTime').once('value');
};

//
//  Config
export const getFireBaseConfig = () => ({
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
});
