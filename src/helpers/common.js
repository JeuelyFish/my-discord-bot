export const getGeneralChat = (client) => {
  return client.channels.find(item => {
    return item.type === 'text' && item.name === 'general';
  })
}

export const isJeuely = (user) => {
  return parseInt(user.id) === 201180011317690369;
};


export const isBezzaton = (user) => {
  return parseInt(user.id) === 294996871896760321;
};

export const isLoarf = (user) => {
  return parseInt(user.id) === 185957145253117952;
};
export const isBot = (user) => {
  return parseInt(user.id) === 434765029816926218;
};

export const getRandomUser = (channel) => {
    return channel.members.random(1);
};

export const logSuccess = (response) => {
  console.info(response);
  this.channel.send('SUCCESS: ' + response);
};

export const logError = (err) => {
  console.error(err);
  this.channel.send('ERROR: ' + err.message);
};
