import { parseInt } from 'lodash';
import { logError } from '../common';
import { setFireBasePurgeTime, getFireBasePurgeTime } from '../fire';

export const purge = (channel, setNewPurgeTime) => {
  Promise.all([getFireBasePurgeTime(),
      channel.fetchMessages({
        limit: 100
      })
    ])
    .then(([timeOfLastPurge, messages]) => {
      const purgeUtc = parseInt(timeOfLastPurge.val());
      const filteredByDate = messages.filter(msg => msg.createdTimestamp > purgeUtc);
      return {
        promises: filteredByDate.deleteAll(),
        dateString: (new Date(purgeUtc)).toDateString(),
      };
    })
    .then(obj => Promise.all(obj.promises).then((purged) => {
      console.info(`deleted ${purged.length} messages created since ${obj.dateString}`);
      channel.send(`deleted ${purged.length} messages created since ${obj.dateString}`);
      if (setNewPurgeTime) {
        setFireBasePurgeTime(new Date());
      }
    }))
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
