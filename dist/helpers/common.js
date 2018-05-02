'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Common(client, channel) {
    _classCallCheck(this, Common);

    this.client = client;
  }

  _createClass(Common, [{
    key: 'isJeuely',
    value: function isJeuely(userId) {
      return parseInt(userId) === 201180011317690369;
    }
  }, {
    key: 'isBot',
    value: function isBot() {
      return parseInt(userId) === 434765029816926218;
    }
  }, {
    key: 'logError',
    value: function logError(err) {
      console.error(err);
      this.channel.send('ERROR: ' + err.message);
    }
  }, {
    key: 'generalChat',
    get: function get() {
      return this.client.channels.find(function (item) {
        return item.type === 'text' && item.name === 'general';
      });
    }
  }]);

  return Common;
}();