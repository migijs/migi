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

function getDom(dom) {
  if (_util2.default.isString(dom)) {
    return document.querySelector(dom);
  } else if (dom instanceof Element) {
    return dom.element;
  }
  return dom;
}
function arr2hash(arr) {
  var hash = {};
  for (var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    if (Array.isArray(item)) {
      hash[item[0]] = item[1];
    } else {
      for (var list = Object.keys(item), j = list.length - 1; j >= 0; j--) {
        var k = list[j];
        hash[k] = item[k];
      }
    }
  }
  return hash;
}
function hash2arr(hash) {
  var arr = [];
  for (var list = Object.keys(hash), i = 0, len = list.length; i < len; i++) {
    var k = list[i];
    arr.push([k, hash[k]]);
  }
  return arr;
}
function spread(arr) {
  for (var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    if (!Array.isArray(item)) {
      var temp = [];
      for (var list = Object.keys(item), j = 0, len = list.length; j < len; j++) {
        var k = list[j];
        temp.push([k, item[k]]);
      }
      arr.splice.apply(arr, [i, 1].concat(temp));
    }
  }
  return arr;
}

var Element = function (_Event) {
  _inherits(Element, _Event);

  function Element(name, props, children) {
    _classCallCheck(this, Element);

    var _this = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this));

    _this.__reset(name, props, children);
    return _this;
  }

  _createClass(Element, [{
    key: '__reset',
    value: function __reset(name, props, children) {
      this.uid = uid++;
      this.__name = name;
      //构建工具中都是arr，手写可能出现hash情况
      if (Array.isArray(props)) {
        this.props = arr2hash(props);
        this.__props = spread(props);
      } else {
        this.props = props;
        this.__props = hash2arr(props);
      }
      this.children = children;

      this.__element = null; //真实DOM引用
      this.__parent = null; //父vd或cp引用
      this.__top = null; //最近父cp引用
      this.__style = null; //样式中间生成代码
      this.__dom = false; //是否被添加到真实DOM标识
      this.__cache = {}; //缓存计算好的props

      this.once(_Event3.default.DOM, this.__onDom);
    }
    //防止多次插入后重复，清除上次，永远只存在一个实例

  }, {
    key: 'clean',
    value: function clean() {
      if (this.__dom) {
        var elem = this.element;
        if (elem && elem.parentNode) {
          elem.parentNode.removeChild(elem);
        }
        this.__element = null;
        this.__parent = null;
        this.__top = null;
        this.__style = null;
        this.__dom = false;
        this.__cache = {};
        this.once(_Event3.default.DOM, this.__onDom);
      }
    }
  }, {
    key: '__onDom',
    value: function __onDom() {
      this.__dom = true;
      this.__saveRef();
    }
  }, {
    key: '__saveRef',
    value: function __saveRef() {
      //ref快速引用
      if (this.props.ref) {
        var top = this.top;
        if (top) {
          var k = this.props.ref;
          var exist = top.ref[k];
          if (Array.isArray(exist)) {
            exist.push(this);
          } else if (exist) {
            top.ref[k] = [exist, this];
          } else {
            top.ref[k] = this;
          }
        }
      }
    }
  }, {
    key: 'inTo',
    value: function inTo(dom) {
      this.clean();
      var s = this.toString();
      getDom(dom).innerHTML = s;
      this.emit(_Event3.default.DOM);
    }
  }, {
    key: 'appendTo',
    value: function appendTo(dom) {
      this.clean();
      var s = this.toString();
      dom = getDom(dom);
      dom.insertAdjacentHTML('beforeend', s);
      this.emit(_Event3.default.DOM);
    }
  }, {
    key: 'prependTo',
    value: function prependTo(dom) {
      this.clean();
      var s = this.toString();
      dom = getDom(dom);
      dom.insertAdjacentHTML('afterbegin', s);
      this.emit(_Event3.default.DOM);
    }
  }, {
    key: 'before',
    value: function before(dom) {
      this.clean();
      var s = this.toString();
      dom = getDom(dom);
      dom.insertAdjacentHTML('beforebegin', s);
      this.emit(_Event3.default.DOM);
    }
  }, {
    key: 'after',
    value: function after(dom) {
      this.clean();
      var s = this.toString();
      dom = getDom(dom);
      dom.insertAdjacentHTML('afterend', s);
      this.emit(_Event3.default.DOM);
    }
  }, {
    key: 'replace',
    value: function replace(dom) {
      this.clean();
      var s = this.toString();
      dom = getDom(dom);
      dom.insertAdjacentHTML('afterend', s);
      dom.parentNode.removeChild(dom);
      this.emit(_Event3.default.DOM);
    }
  }, {
    key: 'top',
    get: function get() {
      if (!this.__top && this.parent) {
        if (this.parent instanceof migi.Component) {
          this.__top = this.parent;
        } else {
          this.__top = this.parent.top;
        }
      }
      return this.__top;
    }
  }, {
    key: 'parent',
    get: function get() {
      return this.__parent;
    }
  }, {
    key: 'name',
    get: function get() {
      return this.__name;
    }
  }, {
    key: 'dom',
    get: function get() {
      return this.__dom;
    }
  }], [{
    key: 'resetUid',
    value: function resetUid() {
      uid = 0;
    }
  }]);

  return Element;
}(_Event3.default);

exports.default = Element;});