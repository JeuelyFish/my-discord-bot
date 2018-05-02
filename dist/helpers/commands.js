'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkDelete = exports.defaultDelete = exports.purge = undefined;

var _common = require('./common.js');

var purge = exports.purge = function purge(channel, timeOfLastPurge) {
  channel.fetchMessages({
    limit: 100
  }).then(function (messages) {
    var filteredByDate = messages.filter(function (msg) {
      return msg.createdTimestamp > timeOfLastPurge;
    });
    var filteredByAuthor = filteredByDate.filter(function (msg) {
      return msg.author.username != 'deletor';
    });
    return {
      promises: filteredByAuthor.deleteAll(),
      originalSize: filteredByDate.array().length
    };
  }).then(function (obj) {
    return Promise.all(obj.promises).then(function (values) {
      var dateObj = new Date(timeOfLastPurge);
      var dateString = dateObj.toDateString();
      return 'Collected ' + obj.originalSize + ' messages since ' + dateString + ' and then deleted ' + values.length + ' of them.';
    });
  }).then(function (msgString) {
    return channel.send(msgString);
  }).then(function (msg) {
    return console.info('Sent msg: ' + msg.content);
  }).catch(function (err) {
    return (0, _common.logError)(channel, err);
  });
};

var defaultDelete = exports.defaultDelete = function defaultDelete(channel) {
  channel.fetchMessages({
    limit: 5
  }).then(function (messages) {
    var filtered = messages.filter(function (msg) {
      return msg.author.username != 'deletor';
    });
    return {
      promises: filtered.deleteAll(),
      originalSize: filtered.array().length
    };
  }).then(function (obj) {
    return Promise.all(obj.promises).then(function (values) {
      console.info('default delete successfull: ' + obj.originalSize + ' deleted');
      channel.send('I deleted ' + obj.originalSize + ' messages.');
    });
  }).catch(function (err) {
    return (0, _common.logError)(channel, err);
  });
};

var bulkDelete = exports.bulkDelete = function bulkDelete(channel, splitMsg) {
  var int = parseInt(splitMsg[1]);
  if (typeof int === "number") {
    channel.bulkDelete(int).then(function (response) {
      console.info('Bulk deleted ' + response.size + ' messages');
      channel.send('Bulk deleted ' + response.size + ' messages');
    }).catch(function (err) {
      return (0, _common.logError)(channel, err);
    });
  }
};