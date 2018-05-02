'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getGeneralChat = exports.getGeneralChat = function getGeneralChat(client) {
    return client.channels.find(function (item) {
        return item.type === 'text' && item.name === 'general';
    });
};

var isJeuely = exports.isJeuely = function isJeuely(userId) {
    return parseInt(userId) === 201180011317690369;
};

var isBot = exports.isBot = function isBot(userId) {
    return parseInt(userId) === 434765029816926218;
};

var logError = exports.logError = function logError(err) {
    console.error(err);
    undefined.channel.send('ERROR: ' + err.message);
};