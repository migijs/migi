define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _Stream = require('./Stream');

var _Stream2 = _interopRequireDefault(_Stream);

var _CacheModel = require('./CacheModel');

var _CacheModel2 = _interopRequireDefault(_CacheModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CacheComponent = function (_Component) {
  _inherits(CacheComponent, _Component);

  function CacheComponent() {
    var _ref;

    _classCallCheck(this, CacheComponent);

    for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
      data[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = CacheComponent.__proto__ || Object.getPrototypeOf(CacheComponent)).call.apply(_ref, [this].concat(data)));

    _this.__handler = {}; //缓存data key的hash
    _this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识
    _this.__handler2 = {}; //handler的副本，每次handler被重置为空后保留缓存值
    _this.__timeout;
    _this.__timecb;
    return _this;
  }

  //@overwrite


  _createClass(CacheComponent, [{
    key: '__data',
    value: function __data(k) {
      var self = this;
      //set触发数据变更时，若已DOM则打开开关
      if (self.dom) {
        self.__canData = true;
      }

      if (!Array.isArray(k)) {
        k = [k];
      }
      //没有缓存根据是否桥接模式赋予stream对象或生成sid
      k.forEach(function (k) {
        if (!self.__handler.hasOwnProperty(k)) {
          self.__handler[k] = self.__stream || _Stream2.default.gen();
        } else {
          var item = self.__handler[k];
          //新stream的sid必须大于老stream的sid或sid才能覆盖
          if (self.__stream) {
            if (item instanceof _Stream2.default) {
              if (item.sid < self.__stream.sid) {
                self.__handler[k] = self.__stream;
              }
            } else if (item < self.__stream.sid) {
              self.__handler[k] = self.__stream;
            }
          }
          //非stream触发更新即主动数据更新
          //当缓存是bridge时，Stream当前的sid>=缓存的sid即说明是发生在bridge之后的
          else {
              var now = _Stream2.default.now();
              if (item instanceof _Stream2.default) {
                if (item.sid <= now) {
                  self.__handler[k] = now;
                }
              } else if (item < now) {
                self.__handler[k] = now;
              }
            }
        }
      });
      if (!self.__ccb) {
        self.__ccb = true;
        //1ms后触发数据变更并重设状态
        self.__timeout = setTimeout(self.__timecb = function () {
          self.__ccb = false;
          var temp = self.__handler;
          var keys = Object.keys(temp);
          self.__handler = {};
          //赋值更新状态的sid到缓存
          keys.forEach(function (key) {
            var item = temp[key];
            self.__handler2[key] = item.sid || item;
          });
          //可能被清空
          if (keys.length) {
            self.__onData(keys);
            self.emit(_Event2.default.DATA, keys.length > 1 ? keys : keys[0]);
            keys.forEach(function (key) {
              var stream = temp[key];
              //被桥接触发记录的是stream
              if (stream instanceof _Stream2.default) {
                if (self.__bridgeHash) {
                  var bridge = self.__bridgeHash[key];
                  if (bridge) {
                    bridge.forEach(function (item) {
                      var target = item.target;
                      var name = item.name;
                      var middleware = item.middleware;
                      if (!stream.has(target.__uid)) {
                        stream.add(target.__uid);
                        //必须大于桥接对象的sid才生效
                        var tItem = CacheComponent.getSid(target, name);
                        if (stream.sid > tItem) {
                          //先设置桥接对象数据为桥接模式，修改数据后再恢复
                          target.__stream = stream;
                          target[name] = middleware ? middleware.call(self, self[key]) : self[key];
                          target.__stream = null;
                        }
                      }
                    });
                  }
                }
              } else if (self.__bridgeHash) {
                var bridge = self.__bridgeHash[key];
                if (bridge) {
                  stream = new _Stream2.default(self.__uid, temp[key]);
                  bridge.forEach(function (item) {
                    var target = item.target;
                    var name = item.name;
                    var middleware = item.middleware;
                    //作为主动发起数据变更方，第一位无需检查重复
                    stream.add(target.__uid);
                    if (target instanceof _EventBus2.default) {
                      target.emit(_Event2.default.DATA, name, middleware ? middleware.call(self, self[key]) : self[key], stream);
                    } else {
                      //必须大于桥接对象的sid才生效
                      var tItem = CacheComponent.getSid(target, name);
                      if (stream.sid > tItem) {
                        //先设置桥接对象数据为桥接模式，修改数据后再恢复
                        target.__stream = stream;
                        target[name] = middleware ? middleware.call(self, self[key]) : self[key];
                        target.__stream = null;
                      }
                    }
                  });
                }
              }
            });
          }
        }, 0);
      }
    }
  }, {
    key: 'flush',
    value: function flush() {
      if (this.__timeout) {
        clearTimeout(this.__timeout);
        this.__ccb = false;
        this.__timecb();
      }
    }
  }], [{
    key: 'getSid',
    value: function getSid(target, name) {
      if (target instanceof CacheComponent || target instanceof _CacheModel2.default) {
        var tItem = target.__handler[name] || target.__handler2[name] || 0;
        return tItem.sid || tItem;
      }
      return 0;
    }
  }]);

  return CacheComponent;
}(_Component3.default);

exports.default = CacheComponent;});