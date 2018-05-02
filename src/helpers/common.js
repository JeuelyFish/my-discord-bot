export const getGeneralChat = (client) => {
  return client.channels.find(item => {
    return item.type === 'text' && item.name === 'general';
  })
}

export const isJeuely = (userId) => {
  return parseInt(userId) === 201180011317690369;
};


export const isBot = (userId) => {
  return parseInt(userId) === 434765029816926218;
};

export const logError = (err) => {
  console.error(err);
  this.channel.send('ERROR: ' + err.message);
};
