define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event2 = require('./Event');

var _Event3 = _interopRequireDefault(_Event2);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var uid = 0;

var EventBus = function (_Event) {
  _inherits(EventBus, _Event);

  function EventBus() {
    _classCallCheck(this, EventBus);

    var _this = _possibleConstructorReturn(this, (EventBus.__proto__ || Object.getPrototypeOf(EventBus)).call(this));

    _this.uid = 'e' + uid++; //为数据流历史记录hack
    _this.__bridgeHash = {};
    _this.on(_Event3.default.DATA, _this.__brcb);
    return _this;
  }

  _createClass(EventBus, [{
    key: '__brcb',
    value: function __brcb(k, v, stream) {
      if (this.__bridgeHash.hasOwnProperty(k)) {
        var arr = this.__bridgeHash[k];
        for (var i = 0, len = arr.length; i < len; i++) {
          var item = arr[i];
          var target = item.target;
          var name = item.name;
          var middleware = item.middleware;
          if (!stream.has(target.uid)) {
            stream.add(target.uid);
            //必须大于桥接对象的sid才生效
            var tItem = migi.CacheComponent.getSid(target);
            if (stream.sid > tItem) {
              //先设置桥接对象数据为桥接模式，修改数据后再恢复
              target.__stream = stream;
              target[name] = middleware ? middleware.call(target, v) : v;
              target.__stream = null;
            }
          }
        }
      }
    }
  }, {
    key: '__record',
    value: function __record(target, src, name, middleware) {
      var self = this;
      var arr = this.__bridgeHash[src] = this.__bridgeHash[src] || [];
      //防止重复桥接
      arr.forEach(function (item) {
        if (item.target == target && item.name == name) {
          throw new Error('duplicate bridge: ' + self + '.' + src + ' -> ' + target + '.' + name);
        }
      });
      //记录桥接单向数据流关系
      arr.push({
        target: target,
        name: name,
        middleware: middleware
      });
    }
  }, {
    key: '__unRecord',
    value: function __unRecord(target, src, name) {
      var self = this;
      var arr = self.__bridgeHash[src] || [];
      for (var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i];
        if (item.target == target && item.name == name) {
          arr.splice(i, 1);
          return;
        }
      }
    }
  }, {
    key: 'bridge',
    value: function bridge(target, src, name, middleware) {
      var self = this;
      if (target == this) {
        throw new Error('can not bridge self: ' + self);
      }
      if (!target || !(target instanceof migi.Component) && !(target instanceof migi.Model)) {
        throw new Error('can only bridge to Component/Model: ' + self);
      }
      //重载
      if (arguments.length == 2) {
        if (_util2.default.isString(src)) {
          self.__record(target, src, src);
        } else {
          Object.keys(src).forEach(function (k) {
            var o = src[k];
            if (_util2.default.isString(o)) {
              self.__record(target, k, o);
            } else if (o.name) {
              self.__record(target, k, o.name, o.middleware);
            }
          });
        }
      } else if (arguments.length == 3) {
        if (_util2.default.isString(name)) {
          self.__record(target, src, name);
        } else {
          middleware = name;
          self.__record(target, src, src, middleware);
        }
      } else if (arguments.length == 4) {
        self.__record(target, src, name, middleware);
      }
    }
  }, {
    key: 'bridgeTo',
    value: function bridgeTo(target) {
      for (var _len = arguments.length, datas = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        datas[_key - 1] = arguments[_key];
      }

      target.bridge.apply(target, [this].concat(datas));
    }
  }, {
    key: 'unBridge',
    value: function unBridge(target, src, name) {
      var self = this;
      //重载
      if (arguments.length == 2) {
        if (_util2.default.isString(src)) {
          self.__unRecord(target, src, src);
        } else {
          Object.keys(src).forEach(function (k) {
            var o = src[k];
            if (_util2.default.isString(o)) {
              self.__unRecord(target, k, o);
            } else if (_util2.default.isFunction(o)) {
              self.__unRecord(target, k, k);
            } else if (o.name) {
              self.__unRecord(target, k, o.name);
            }
          });
        }
      } else {
        self.__unRecord(target, src, name);
      }
    }
  }, {
    key: 'unBridgeTo',
    value: function unBridgeTo(target) {
      for (var _len2 = arguments.length, datas = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        datas[_key2 - 1] = arguments[_key2];
      }

      target.unBridge.apply(target, [this].concat(datas));
    }
  }]);

  return EventBus;
}(_Event3.default);

exports.default = EventBus;});