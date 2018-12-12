define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _CacheModel = require('./CacheModel');

var _CacheModel2 = _interopRequireDefault(_CacheModel);

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _VirtualDom = require('./VirtualDom');

var _VirtualDom2 = _interopRequireDefault(_VirtualDom);

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

var _match = require('./match');

var _match2 = _interopRequireDefault(_match);

var _matchHash = require('./matchHash');

var _matchHash2 = _interopRequireDefault(_matchHash);

var _attr = require('./attr');

var _attr2 = _interopRequireDefault(_attr);

var _selfClose = require('./selfClose');

var _selfClose2 = _interopRequireDefault(_selfClose);

var _dev = require('./dev');

var _dev2 = _interopRequireDefault(_dev);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var migi = {
  uid: 0,
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
    element.preString();
    return element.emit(_Event2.default.DOM);
  },
  createCp: function createCp(cp, props, children) {
    return _hash2.default.set(new cp([this.uid++, null, props, children]));
  },
  createVd: function createVd(name, props, children) {
    if (name == 'style' || name == 'script') {
      throw new Error('can not create VirtualDom of: ' + name);
    }
    return _hash2.default.set(_cachePool2.default.index ? _cachePool2.default.get().__reset(this.uid++, name, props, children) : new _VirtualDom2.default(this.uid++, name, props, children));
  },

  Event: _Event2.default,
  Model: _Model2.default,
  CacheModel: _CacheModel2.default,
  eventBus: new _Event2.default(),
  Element: _Element2.default,
  Component: _Component2.default,
  CacheComponent: _CacheComponent2.default,
  VirtualDom: _VirtualDom2.default,
  Obj: _Obj2.default,
  Cb: _Cb2.default,
  util: _util2.default,
  browser: _browser2.default,
  sort: _sort2.default,
  hash: _hash2.default,
  match: _match2.default,
  matchHash: _matchHash2.default,
  attr: _attr2.default,
  selfClose: _selfClose2.default,
  name: function name(Class, _name) {
    if (_Component2.default.prototype.isPrototypeOf(Class.prototype)) {
      Class.__migiName = _name;
    }
  },
  resetUid: function resetUid(n) {
    this.uid = n || 0;
  },
  clone: function clone() {
    var clone = Object.create(migi);
    clone.uid = 0;
    return clone;
  },
  dev: _dev2.default,
  // 供JSON.stringify编码用
  encode: function encode(s) {
    if (s === null || s === undefined) {
      return '';
    }
    return s.replace(/&/g, '&amp;').replace(new RegExp('[<' + String.fromCharCode(8232) + ']', 'g'), function ($0) {
      if ($0 === '<') {
        return '&lt;';
      }
      return '&#8232;';
    });
  }
};

if (typeof window != 'undefined') {
  window.migi = migi;
} else if (typeof global != 'undefined') {
  global.migi = migi;
}

exports.default = migi;});