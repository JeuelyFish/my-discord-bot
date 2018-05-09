export const getGeneralChat = (client) => {
  return client.channels.find(item => {
    return item.type === 'text' && item.name === 'general';
  })
}

export const isJeuely = (user) => {
  return parseInt(user.id) === 201180011317690369;
};


export const isChownk = (user) => {
  return parseInt(user.id) === 434765029816926218;
};

export const isLoarf = (user) => {
  return parseInt(user.id) === 434765029816926218;
};
export const isBot = (user) => {
  return parseInt(user.id) === 434765029816926218;
};

export const getRandomUser = (channel) => {
    return channel.members.random(1);
};

export const logError = (err) => {
  console.error(err);
  this.channel.send('ERROR: ' + err.message);
};
