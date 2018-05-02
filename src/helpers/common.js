module.exports = class Common {
  constructor(client, channel) {
    this.client = client;
  }

  get generalChat() {
    return this.client.channels.find(item => {
      return item.type === 'text' && item.name === 'general';
    })
  }

  isJeuely(userId) {
    return parseInt(userId) === 201180011317690369;
  }

  isBot() {
    return parseInt(userId) === 434765029816926218;
  }

  logError(err) {
    console.error(err);
    this.channel.send('ERROR: ' + err.message);
  }
}
