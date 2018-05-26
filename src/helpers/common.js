export const getGeneralChat = client => client.channels.find(item => item.type === 'text' && item.name === 'general');

export const isBot = user => parseInt(user.id) === 434765029816926218;

export const isJeuely = user => parseInt(user.id) === 201180011317690369;

export const notJeuelyOrBot = (user) => {
  const userId = parseInt(user.id);
  return (userId !== 201180011317690369) && (userId !== 434765029816926218);
};

export const isBezzaton = user => parseInt(user.id) === 294996871896760321;

export const isLoarf = user => parseInt(user.id) === 185957145253117952;


export const getRandomUser = channel => channel.members.filter(member => notJeuelyOrBot(member)).random(1);

export const logSuccess = (response, channel) => {
  console.info(response);
  if (channel) {
    channel.send(`SUCCESS: ${response}`);
  }
};

export const logError = (err, channel) => {
  console.error(err);
  if (channel) {
    channel.send(`ERROR: ${err.message}`);
  }
};
