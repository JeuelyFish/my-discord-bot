'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Common = require('./common.js');

module.exports = function () {
  function Commands(channel, errorLogger) {
    _classCallCheck(this, Commands);

    this.channel = channel;
    this.errorLogger = errorLogger;
  }

  _createClass(Commands, [{
    key: 'purge',
    value: function purge(timeOfLastPurge) {
      var _this = this;

      var channel = this.channel;
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
        return _this.errorLogger(err, channel);
      });
    }
  }, {
    key: 'defaultDelete',
    value: function defaultDelete() {
      var _this2 = this;

      var channel = this.channel;
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
        return _this2.errorLogger(err, channel);
      });
    }
  }, {
    key: 'bulkDelete',
    value: function bulkDelete(splitMsg) {
      var _this3 = this;

      var channel = this.channel;
      var int = parseInt(splitMsg[1]);
      if (typeof int === "number") {
        channel.bulkDelete(int).then(function (response) {
          console.info('Bulk deleted ' + response.size + ' messages');
          channel.send('Bulk deleted ' + response.size + ' messages');
        }).catch(function (err) {
          return _this3.errorLogger(err, channel);
        });
      }
    }
  }]);

  return Commands;
}();