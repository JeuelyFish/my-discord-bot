// const Discord = require('discord.js');

module.exports = {
    getGeneralChat: (client) => {
        return client.channels.find(item => {
            return item.type === 'text' && item.name === 'general';
        })
    },
    isJeuely: (userId) => {
        return parseInt(userId) === 201180011317690369;
    },
    isBot: (userId) => {
        return parseInt(userId) === 434765029816926218;
    },
    logError: (err, channel) => {
        console.error(err);
        channel.send('ERROR: ' + err.message);
    }
};
