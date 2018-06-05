import { parseInt } from 'lodash';
import { logError } from '../common';

export const purge = (channel, timeOfLastPurge) => {
  channel.fetchMessages({
    limit: 100,
  })
    .then((messages) => {
      const filteredByDate = messages.filter(msg => msg.createdTimestamp > timeOfLastPurge);
      return {
        promises: filteredByDate.deleteAll(),
        originalSize: filteredByDate.array().length,
      };
    })
    .then(obj => Promise.all(obj.promises).then((values) => {
      const dateObj = new Date(timeOfLastPurge);
      const dateString = dateObj.toDateString();
      return `Collected ${obj.originalSize} messages since ${dateString} and then deleted ${values.length} of them.`;
    }))
    .then(msgString => channel.send(msgString))
    .then(msg => console.info(`Sent msg: ${msg.content}`))
    .catch(err => logError(err, channel));
};

export const defaultDelete = (channel) => {
  channel.fetchMessages({
    limit: 5,
  })
    .then(messages => messages.deleteAll())
    .then(promiseArray => Promise.all(promiseArray).then((values) => {
      console.info(`deleted ${values.length} messages`);
      channel.send(`deleted ${values.length} messages`);
    }))
    .catch(err => logError(err, channel));
};


export const bulkDelete = (channel, splitMsg) => {
  const int = parseInt(splitMsg[1]);
  if (typeof int === 'number') {
    channel.bulkDelete(int)
      .then((response) => {
        console.info(`Bulk deleted ${response.size} messages`);
        channel.send(`Bulk deleted ${response.size} messages`);
      })
      .catch(err => logError(err, channel));
  }
};
