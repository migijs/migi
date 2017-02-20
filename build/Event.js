'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = function () {
  function Event() {
    _classCallCheck(this, Event);

    this.__hash = {};
  }

  _createClass(Event, [{
    key: 'on',
    value: function on(id, handle) {
      var self = this;
      if (Array.isArray(id)) {
        id.forEach(function (item) {
          self.on(item, handle);
        });
      } else if (handle) {
        if (!self.__hash.hasOwnProperty(id)) {
          self.__hash[id] = [];
        }
        //遍历防止此handle被侦听过了
        for (var i = 0, item = self.__hash[id], len = item.length; i < len; i++) {
          if (item[i] === handle) {
            return self;
          }
        }
        self.__hash[id].push(handle);
      }
      return self;
    }
  }, {
    key: 'once',
    value: function once(id, handle) {
      var self = this;
      if (Array.isArray(id)) {
        id.forEach(function (item) {
          self.once(item, handle);
        });
      } else if (handle) {
        var _cb = function _cb() {
          for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
            data[_key] = arguments[_key];
          }

          handle.apply(this, data);
          self.off(id, _cb);
        };

        self.on(id, _cb);
      }
      return this;
    }
  }, {
    key: 'off',
    value: function off(id, handle) {
      var self = this;
      if (Array.isArray(id)) {
        id.forEach(function (item) {
          self.off(item, handle);
        });
      } else if (self.__hash.hasOwnProperty(id)) {
        if (handle) {
          for (var i = 0, item = self.__hash[id], len = item.length; i < len; i++) {
            if (item[i] === handle) {
              item.splice(i, 1);
              break;
            }
          }
        }
        //未定义为全部清除
        else {
            delete self.__hash[id];
          }
      }
      return this;
    }
  }, {
    key: 'emit',
    value: function emit(id) {
      for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        data[_key2 - 1] = arguments[_key2];
      }

      var self = this;
      if (Array.isArray(id)) {
        id.forEach(function (item) {
          self.emit(item, data);
        });
      } else {
        if (self.__hash.hasOwnProperty(id)) {
          var list = self.__hash[id].slice();
          list.forEach(function (item) {
            item.apply(self, data);
          });
        }
      }
      return this;
    }
  }], [{
    key: 'mix',
    value: function mix() {
      for (var _len3 = arguments.length, obj = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        obj[_key3] = arguments[_key3];
      }

      obj.forEach(function (o) {
        var event = new Event();
        o.__hash = {};
        var fns = ['on', 'once', 'off', 'emit'];
        fns.forEach(function (fn) {
          o[fn] = event[fn];
        });
      });
    }
  }]);

  return Event;
}();

Event.DOM = 'DOM';
Event.DESTROY = 'DESTROY';
Event.DATA = 'DATA';

exports.default = Event;