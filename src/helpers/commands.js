import { logError } from './common.js';

export const purge = (channel, timeOfLastPurge) => {
  channel.fetchMessages({
      limit: 100
    })
    .then(messages => {
      const filteredByDate = messages.filter(msg => msg.createdTimestamp > timeOfLastPurge);
      const filteredByAuthor = filteredByDate.filter(msg => msg.author.username != 'deletor')
      return {
        promises: filteredByAuthor.deleteAll(),
        originalSize: filteredByDate.array().length
      }
    })
    .then(obj => {
      return Promise.all(obj.promises).then(values => {
        const dateObj = new Date(timeOfLastPurge);
        const dateString = dateObj.toDateString();
        return `Collected ${obj.originalSize} messages since ${dateString} and then deleted ${values.length} of them.`;
      })
    })
    .then(msgString => channel.send(msgString))
    .then(msg => console.info(`Sent msg: ${msg.content}`))
    .catch(err => logError(channel, err));
}

export const defaultDelete = (channel) => {
  channel.fetchMessages({
      limit: 5
    })
    .then(messages => {
      const filtered = messages.filter(msg => msg.author.username != 'deletor')
      return {
        promises: filtered.deleteAll(),
        originalSize: filtered.array().length
      }
    })
    .then(obj => {
      return Promise.all(obj.promises).then(values => {
        console.info(`default delete successfull: ${obj.originalSize} deleted`)
        channel.send(`I deleted ${obj.originalSize} messages.`);
      })
    })
    .catch(err => logError(channel, err));
}


export const bulkDelete = (channel, splitMsg) => {
  const int = parseInt(splitMsg[1])
  if (typeof int === "number") {
    channel.bulkDelete(int)
      .then(response => {
        console.info(`Bulk deleted ${response.size} messages`)
        channel.send(`Bulk deleted ${response.size} messages`);
      })
      .catch(err => logError(channel, err));
  }
}
