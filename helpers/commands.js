const common = require('./common.js');

module.exports = {
  purge: function(client, timeOfLastPurge) {
    const channel = common.getGeneralChat(client);
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
          return `collected ${obj.originalSize} messages since ${dateString} and then deleted ${values.length} of them.`;
        })
      })
      .then(msgString => channel.send(msgString))
      .then(msg => console.log(`Sent msg: ${msg.content}`))
      .catch(err => common.logError(err, channel));
  },
  defaultDelete: function(client) {
    const channel = common.getGeneralChat(client);
    channel.fetchMessages({
        limit: 5
      })
      .then(messages => {
        const filtered = messages.filter(msg => msg.author.username != 'deletor')
        const deleted = filtered.deleteAll();
        channel.send(`collected ${messages.size} messages and then deleted ${filtered.array().length}`);
      })
      .catch(err => common.logError(err, channel));
  },
  bulkDelete: function(client, splitMsg) {
    const channel = common.getGeneralChat(client);
    const int = parseInt(splitMsg[1])
    if (typeof int === "number") {
      channel.bulkDelete(int)
        .then(response => {
          console.log(`Bulk deleted ${response.size} messages`)
          channel.send(`Bulk deleted ${response.size} messages`);
        })
        .catch(err => common.logError(err, channel));
    }
  }
};
