define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _Element2 = require('./Element');

var _Element3 = _interopRequireDefault(_Element2);

var _VirtualDom = require('./VirtualDom');

var _VirtualDom2 = _interopRequireDefault(_VirtualDom);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _Obj = require('./Obj');

var _Obj2 = _interopRequireDefault(_Obj);

var _Cb = require('./Cb');

var _Cb2 = _interopRequireDefault(_Cb);

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _Stream = require('./Stream');

var _Stream2 = _interopRequireDefault(_Stream);

var _FastClick = require('./FastClick');

var _FastClick2 = _interopRequireDefault(_FastClick);

var _array = require('./array');

var _array2 = _interopRequireDefault(_array);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STOP = ['click', 'dblclick', 'focus', 'blur', 'change', 'contextmenu', 'mousedown', 'mousemove', 'mouseover', 'mouseup', 'mouseout', 'mousewheel', 'resize', 'scroll', 'select', 'submit', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'keydown', 'keypress', 'keyup', 'drag', 'dragstart', 'dragover', 'dragenter', 'dragleave', 'dragend', 'drop', 'formchange', 'forminput', 'input', 'cut', 'paste', 'reset', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'MSGestureEnd', 'MSPointerDown', 'pointerdown', 'MSPointerMove', 'pointermove', 'MSPointerUp', 'pointerup', 'MSPointerCancel', 'pointercancel'];

var Component = function (_Element) {
  _inherits(Component, _Element);

  function Component(uid) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, Component);

    var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, uid, null, props, children));

    var self = _this;
    self.__name = self.constructor.__migiName;
    self.__virtualDom = null; //根节点vd引用
    self.__ref = {}; //以ref为attr的vd快速访问引用
    self.__stop = null; //停止冒泡的fn引用
    self.__model = null; //数据模型引用
    self.__allowPropagation = true; //默认是否允许冒泡
    // self.__bridgeHash = {}; //桥接记录，延迟初始化
    self.__stream = null; //桥接过程中传递的stream对象
    self.__canData = false; //防止添加至DOM前触发无谓的数据更新
    self.__bindHash = {}; //缩略语法中是否设置过默认值
    self.__ob = []; //被array们的__ob__引用
    self.__bindProperty = {}; //@property语法，出现在组件属性上时联动父层@bind值更新

    self.__props.forEach(function (item, index) {
      var k = item[0];
      var v = item[1];
      self.__init(k, v, index);
    });
    return _this;
  }

  _createClass(Component, [{
    key: '__init',
    value: function __init(k, v, index) {
      var self = this;
      if (/^on[a-zA-Z]/.test(k)) {
        var name = k.slice(2).toLowerCase();
        self.once(_Event2.default.DOM, function () {
          self.virtualDom.__addEvt(name, v);
        });
      } else if (/^on-[a-zA-Z\d_]/.test(k)) {
        var name = k.slice(3);
        self.on(name, function () {
          for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
            data[_key] = arguments[_key];
          }

          if (v instanceof _Cb2.default) {
            if (_util2.default.isFunction(v.cb)) {
              var _v$cb;

              (_v$cb = v.cb).call.apply(_v$cb, [v.context].concat(data));
            }
          } else if (_util2.default.isFunction(v)) {
            v.apply(undefined, data);
          }
        });
      } else if (k == 'model') {
        self.model = v;
      } else if (v instanceof _Obj2.default) {
        self.__props[index] = v.v;
        self.props[k] = v.v;
        self.__bindProperty[v.k] = [k, v];
      }
    }
    //需要被子类覆盖
    //@abstract

  }, {
    key: 'render',
    value: function render() {
      return new _VirtualDom2.default(this.__uid, 'div', this.__props, this.children);
    }
    //@override

  }, {
    key: 'toString',
    value: function toString() {
      this.__virtualDom = this.render();
      if (!this.__virtualDom) {
        throw new Error('render must return a VirtualDom: ' + this.name);
      }
      this.__virtualDom.__parent = this;
      if (this.__style) {
        this.__virtualDom.style = this.__style;
      }
      return this.__virtualDom.toString();
    }
    //@override

  }, {
    key: 'preString',
    value: function preString() {
      this.toString();
    }
  }, {
    key: 'findChild',
    value: function findChild(name) {
      return this.findChildren(name, true)[0];
    }
  }, {
    key: 'findChildren',
    value: function findChildren(name, first) {
      var res = [];
      for (var i = 0, len = this.children.length; i < len; i++) {
        var child = this.children[i];
        if (child instanceof _Element3.default) {
          if (child instanceof Component) {
            if (child.name == name || _util2.default.isFunction(name) && child instanceof name) {
              res.push(child);
              if (first) {
                break;
              }
            }
          } else {
            if (child.name == name || _util2.default.isFunction(name) && child instanceof name) {
              res.push(child);
              if (first) {
                break;
              }
            }
            res = res.concat(child.findAll(name));
            if (first && res.length) {
              break;
            }
          }
        }
      }
      return res;
    }
  }, {
    key: 'find',
    value: function find(selector) {
      return this.__virtualDom ? this.__virtualDom.find(selector) : null;
    }
  }, {
    key: 'findAll',
    value: function findAll(selector) {
      return this.__virtualDom ? this.__virtualDom.findAll(selector) : [];
    }
    /*
     * bridge(target, String, String, Function)
     * bridge(target, String, Function)
     * bridge(target, String, String)
     * bridge(target, String)
     * bridge(target, Object<String:String>)
     * bridge(target, Object<String:Function>)
     * bridge(target, Object<String:Object<name:String,middleware:Function>>)
    */

  }, {
    key: 'bridge',
    value: function bridge(target, src, name, middleware) {
      var self = this;
      if (target == this) {
        throw new Error('can not bridge self: ' + self.name);
      }
      if (!target || !(target instanceof _EventBus2.default) && !(target instanceof Component) && !(target instanceof _Model2.default)) {
        throw new Error('can only bridge to EventBus/Component/Model: ' + self.name);
      }
      //使用桥接时才创建对象
      self.__bridgeHash = self.__bridgeHash || {};
      //重载
      if (arguments.length == 2) {
        if (_util2.default.isString(src)) {
          self.__record(target, src, src);
        } else {
          Object.keys(src).forEach(function (k) {
            var o = src[k];
            if (_util2.default.isString(o)) {
              self.__record(target, k, o);
            } else if (_util2.default.isFunction(o)) {
              self.__record(target, k, k, o);
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

    //@overwrite

  }, {
    key: '__onDom',
    value: function __onDom(fake) {
      _get(Component.prototype.__proto__ || Object.getPrototypeOf(Component.prototype), '__onDom', this).call(this);
      var self = this;
      self.virtualDom.emit(_Event2.default.DOM, fake);
      var elem = self.element;
      if (self.name) {
        elem.setAttribute('migi-name', self.name);
      }
      //无覆盖render时渲染标签的children；有时渲染render的children
      //标签的children没被添加到DOM上但父级组件DOM已构建完，因此以参数区分触发fake的DOM事件
      if (!fake && self.children != self.virtualDom.children) {
        Component.fakeDom(self.children);
      }
      //指定不允许冒泡，默认是全部冒泡
      if (self.props.allowPropagation == 'true') {
        return;
      } else if (self.props.allowPropagation != 'false' && self.allowPropagation) {
        return;
      }
      //将所有组件DOM事件停止冒泡，形成shadow特性，但不能阻止捕获
      function stopPropagation(e) {
        e = e || window.event;
        if (e.target != elem && e.srcElement != elem) {
          e.cancelBubble = true;
          e.stopPropagation && e.stopPropagation();
        }
      }
      self.__stop = stopPropagation;
      //仅考虑用户事件，媒体等忽略
      STOP.forEach(function (name) {
        elem.addEventListener(name, stopPropagation);
      });
      //FastClick处理移动点击点透
      _FastClick2.default.attach(elem);
    }
  }, {
    key: '__data',
    value: function __data(k, opt) {
      var self = this;
      //set触发数据变更时，若已DOM则打开开关
      if (self.dom) {
        self.__canData = true;
      }
      self.__onData(k, opt);
      self.emit(_Event2.default.DATA, k);

      if (self.__bridgeHash) {
        if (!Array.isArray(k)) {
          k = [k];
        }
        k.forEach(function (k) {
          //分析桥接
          var bridge = self.__bridgeHash[k];
          if (bridge) {
            var stream = self.__stream || new _Stream2.default(self.__uid);
            var v = self[k];
            bridge.forEach(function (item) {
              var target = item.target;
              var name = item.name;
              var middleware = item.middleware;
              if (!stream.has(target.__uid)) {
                stream.add(target.__uid);
                if (target instanceof _EventBus2.default) {
                  target.emit(_Event2.default.DATA, name, middleware ? middleware.call(self, v) : v, stream);
                }
                //先设置桥接对象数据为桥接模式，修改数据后再恢复
                else {
                    target.__stream = stream;
                    target[name] = middleware ? middleware.call(self, v) : v;
                    target.__stream = null;
                  }
              }
            });
          }
        });
      }
    }
    //@overwrite

  }, {
    key: '__onData',
    value: function __onData(k, opt) {
      //未DOM或开关时不触发更新
      if (!this.dom || !this.canData) {
        return;
      }
      if (this.virtualDom) {
        this.virtualDom.__onData(k, opt);
      }
      for (var i = 0, len = this.children.length; i < len; i++) {
        var child = this.children[i];
        if (child instanceof _VirtualDom2.default) {
          child.__onData(k, opt);
        }
      }
    }
  }, {
    key: '__notifyBindProperty',
    value: function __notifyBindProperty(k) {
      if (this.__bindProperty.hasOwnProperty(k)) {
        var arr = this.__bindProperty[k];
        var bindProperty = arr[0];
        var obj = arr[1];
        if (obj.update(obj.v)) {
          this[bindProperty] = obj.v;
        }
      }
    }
  }, {
    key: '__destroy',
    value: function __destroy() {
      var self = this;
      if (self.__stop) {
        var elem = self.element;
        STOP.forEach(function (name) {
          elem.removeEventListener(name, self.__stop);
        });
      }
      if (self.model) {
        self.model.__del(self);
      }
      //侦听array里面的引用需删除
      self.__ob.forEach(function (arr) {
        var i = arr.__ob__.indexOf(self);
        if (i > -1) {
          arr.__ob__.splice(i, 1);
          arr.__cb__.splice(i, 1);
        }
      });
      var vd = self.virtualDom.__destroy();
      self.emit(_Event2.default.DESTROY);
      self.__hash = {};
      self.__bridgeHash = null;
      self.__bindProperty = null;
      return vd;
    }
  }, {
    key: '__initBind',
    value: function __initBind(name) {
      return !this.__bindHash.hasOwnProperty(name);
    }
  }, {
    key: '__getBind',
    value: function __getBind(name) {
      return this.__bindHash[name];
    }
  }, {
    key: '__setBind',
    value: function __setBind(name, v) {
      this.__bindHash[name] = v;
      this.__array(name, v);
    }
  }, {
    key: '__array',
    value: function __array(name, v) {
      var self = this;
      //检查array类型，替换并侦听array的原型方法
      if (Array.isArray(v)) {
        v.__proto__ = _array2.default;
        v.__ob__ = v.__ob__ || [];
        v.__cb__ = v.__cb__ || [];
        if (v.__ob__.indexOf(self) == -1) {
          self.__ob.push(v);
          v.__ob__.push(self);
          v.__cb__.push(function (opt) {
            self.__data(name, opt);
          });
        }
      }
    }
  }, {
    key: 'allowPropagation',
    get: function get() {
      return this.__allowPropagation;
    },
    set: function set(v) {
      this.__allowPropagation = v;
    }
  }, {
    key: 'element',
    get: function get() {
      return this.virtualDom ? this.virtualDom.element : null;
    }
  }, {
    key: 'style',
    get: function get() {
      return this.__style;
    },
    set: function set(v) {
      this.__style = v;
    }
  }, {
    key: 'model',
    get: function get() {
      return this.__model;
    },
    set: function set(v) {
      if (!(v instanceof _Model2.default)) {
        throw new Error('can not set model to a non Model: ' + v);
      }
      this.__model = v;
      v.__add(this);
    }
  }, {
    key: 'virtualDom',
    get: function get() {
      return this.__virtualDom;
    }
  }, {
    key: 'ref',
    get: function get() {
      return this.__ref;
    }
  }, {
    key: 'canData',
    get: function get() {
      return this.__canData;
    }
  }], [{
    key: 'fakeDom',
    value: function fakeDom(child) {
      if (Array.isArray(child)) {
        child.forEach(function (item) {
          Component.fakeDom(item);
        });
      } else if (child instanceof Component) {
        child.emit(_Event2.default.DOM, true);
      } else if (child instanceof _VirtualDom2.default) {
        child.emit(_Event2.default.DOM, true);
      }
    }
  }]);

  return Component;
}(_Element3.default);

//完全一样的桥接数据流方法，复用


['__record', '__unRecord', 'bridgeTo', 'unBridge', 'unBridgeTo'].forEach(function (k) {
  Component.prototype[k] = _EventBus2.default.prototype[k];
});

exports.default = Component;});