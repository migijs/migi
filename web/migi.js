define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _CacheModel = require('./CacheModel');

var _CacheModel2 = _interopRequireDefault(_CacheModel);

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _VirtualDom = require('./VirtualDom');

var _VirtualDom2 = _interopRequireDefault(_VirtualDom);

var _NonVisualComponent = require('./NonVisualComponent');

var _NonVisualComponent2 = _interopRequireDefault(_NonVisualComponent);

var _CacheComponent = require('./CacheComponent');

var _CacheComponent2 = _interopRequireDefault(_CacheComponent);

var _Obj = require('./Obj');

var _Obj2 = _interopRequireDefault(_Obj);

var _Cb = require('./Cb');

var _Cb2 = _interopRequireDefault(_Cb);

var _cachePool = require('./cachePool');

var _cachePool2 = _interopRequireDefault(_cachePool);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

var _sort = require('./sort');

var _sort2 = _interopRequireDefault(_sort);

var _hash = require('./hash');

var _hash2 = _interopRequireDefault(_hash);

var _Fastclick = require('./Fastclick');

var _Fastclick2 = _interopRequireDefault(_Fastclick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var migi = {
  render: function render(element, dom) {
    if (dom) {
      element.appendTo(dom);
    }
    return element;
  },

  // 提前或服务器端渲染，仅输出，不触发DOM事件
  preRender: function preRender(element) {
    return element.toString();
  },
  preExist: function preExist(element) {
    element.toString();
    return element.emit(_Event2.default.DOM);
  },
  createCp: function createCp(cp, props, children) {
    return _hash2.default.set(new cp(props, children));
  },
  createVd: function createVd(name, props, children) {
    if (name == 'style' || name == 'script') {
      throw new Error('can not create VirtualDom of: ' + name);
    }
    return _hash2.default.set(_cachePool2.default.index ? _cachePool2.default.get().__reset(name, props, children) : new _VirtualDom2.default(name, props, children));
  },

  Event: _Event2.default,
  Model: _Model2.default,
  CacheModel: _CacheModel2.default,
  EventBus: _EventBus2.default,
  eventBus: new _EventBus2.default(),
  Element: _Element2.default,
  Component: _Component2.default,
  NonVisualComponent: _NonVisualComponent2.default,
  CacheComponent: _CacheComponent2.default,
  VirtualDom: _VirtualDom2.default,
  Obj: _Obj2.default,
  Cb: _Cb2.default,
  util: _util2.default,
  browser: _browser2.default,
  sort: _sort2.default,
  hash: _hash2.default,
  Fastclick: _Fastclick2.default,
  name: function name(Class, _name) {
    if (_Component2.default.prototype.isPrototypeOf(Class.prototype)) {
      Class.__migiName = _name;
    }
  }
};

if (typeof window != 'undefined') {
  window.migi = migi;
  if (document.body) {
    _Fastclick2.default.attach(document.body);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      _Fastclick2.default.attach(document.body);
    });
  }
}

exports.default = migi;});