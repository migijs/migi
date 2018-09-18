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

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _array = require('./array');

var _array2 = _interopRequireDefault(_array);

var _fixEvent = require('./fixEvent');

var _fixEvent2 = _interopRequireDefault(_fixEvent);

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
    var proto = Object.getPrototypeOf(self);
    ['on', 'once', 'emit', 'off', 'clean', 'inTo', 'appendTo', 'prependTo', 'before', 'after', 'replace', 'top', 'parent', 'children', 'dom', 'toString', 'preString', 'findChild', 'findChildren', 'find', 'findAll', 'stopPropagation', 'element', 'style', 'model', 'virtualDom', 'ref'].forEach(function (key) {
      if (proto.hasOwnProperty(key)) {
        throw new Error('cannot overwrite method of \'' + key + '\'');
      }
    });

    if (self.constructor.__migiName) {
      self.__name = self.constructor.__migiName;
    }
    self.__virtualDom = null; // 根节点vd引用
    self.__ref = {}; // 以ref为attr的vd快速访问引用
    // self.__stop = null; // 停止冒泡的fn引用
    // self.__model = null; // 数据模型引用
    // self.__stopPropagation = false; // 默认允许冒泡
    // self.__canData = false; // 防止添加至DOM前触发无谓的数据更新
    self.__bindHash = {}; // 缩略语法中是否设置过默认值
    self.__ob = []; // 被array们的__ob__引用
    self.__bindProperty = {}; // @property语法，出现在组件属性上时联动父层@bind值更新

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
    // 需要被子类覆盖
    // @abstract

  }, {
    key: 'render',
    value: function render() {
      return new _VirtualDom2.default(this.__uid, 'div', this.__props, this.__children);
    }
    // @override

  }, {
    key: 'toString',
    value: function toString() {
      this.__virtualDom = this.render();
      if (!this.__virtualDom) {
        throw new Error('render must return a VirtualDom: ' + this.__name);
      }
      this.__virtualDom.__parent = this;
      if (this.__style) {
        this.__virtualDom.style = this.__style;
      }
      return this.__virtualDom.toString();
    }
    // @override

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
            if (child.__name == name || _util2.default.isFunction(name) && child instanceof name) {
              res.push(child);
              if (first) {
                break;
              }
            }
          } else {
            if (child.__name == name || _util2.default.isFunction(name) && child instanceof name) {
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

    // @overwrite

  }, {
    key: '__onDom',
    value: function __onDom() {
      _get(Component.prototype.__proto__ || Object.getPrototypeOf(Component.prototype), '__onDom', this).call(this);
      var self = this;
      self.virtualDom.emit(_Event2.default.DOM);
      var elem = self.element;
      if (self.__name) {
        elem.setAttribute('migi-name', self.__name);
      }
      // 无覆盖render时渲染标签的children；有时渲染render的children
      // 指定不允许冒泡，默认是全部冒泡
      if (self.props.stopPropagation === true || self.props.stopPropagation === 'true') {
        // stop
      } else if (self.props.stopPropagation === false || self.props.stopPropagation === 'false') {
        return;
      } else if (!self.stopPropagation) {
        return;
      }
      // 将所有组件DOM事件停止冒泡，形成shadow特性，但不能阻止捕获
      function stopPropagation(e) {
        e = e || window.event;
        (0, _fixEvent2.default)(e);
        if (e.target != elem && e.srcElement != elem) {
          e.cancelBubble = true;
          e.stopPropagation && e.stopPropagation();
        }
      }
      self.__stop = stopPropagation;
      // 仅考虑用户事件，媒体等忽略
      STOP.forEach(function (name) {
        elem.addEventListener(name, stopPropagation);
      });
    }
  }, {
    key: '__data',
    value: function __data(k, opt) {
      var self = this;
      // set触发数据变更时，若已DOM则打开开关
      if (self.dom) {
        self.__canData = true;
      }
      self.__onData(k, opt);
      self.emit(_Event2.default.DATA, k, self[k]);
    }
    // @overwrite

  }, {
    key: '__onData',
    value: function __onData(k, opt) {
      // 未DOM或开关时不触发更新
      if (!this.__dom || !this.__canData) {
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
      // 侦听array里面的引用需删除
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
      // 检查array类型，替换并侦听array的原型方法
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
    key: 'stopPropagation',
    get: function get() {
      return this.__stopPropagation;
    },
    set: function set(v) {
      this.__stopPropagation = v;
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
  }]);

  return Component;
}(_Element3.default);

exports.default = Component;});