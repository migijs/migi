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

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _Obj = require('./Obj');

var _Obj2 = _interopRequireDefault(_Obj);

var _Cb = require('./Cb');

var _Cb2 = _interopRequireDefault(_Cb);

var _range = require('./range');

var _range2 = _interopRequireDefault(_range);

var _match = require('./match');

var _match2 = _interopRequireDefault(_match);

var _domDiff = require('./domDiff');

var _domDiff2 = _interopRequireDefault(_domDiff);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _fixEvent = require('./fixEvent');

var _fixEvent2 = _interopRequireDefault(_fixEvent);

var _attr = require('./attr');

var _attr2 = _interopRequireDefault(_attr);

var _hash = require('./hash');

var _hash2 = _interopRequireDefault(_hash);

var _touch = require('./touch');

var _touch2 = _interopRequireDefault(_touch);

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _matchUtil = require('./matchUtil');

var _matchUtil2 = _interopRequireDefault(_matchUtil);

var _eventCaseName = require('./eventCaseName');

var _eventCaseName2 = _interopRequireDefault(_eventCaseName);

var _selfClose = require('./selfClose');

var _selfClose2 = _interopRequireDefault(_selfClose);

var _dev = require('./dev');

var _dev2 = _interopRequireDefault(_dev);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TOUCH = {
  'swipe': true,
  'swipeleft': true,
  'swiperight': true,
  'swipeup': true,
  'swipedown': true,
  'longtap': true,
  'doubletap': true
};

function convertSelector(selector) {
  if (selector instanceof _Element3.default) {
    return selector.name + '[migi-uid="' + selector.__uid + '"]';
  }
  return selector.replace(/(^|\s|,|])([A-Z][\w$]*)\b/, '$1[migi-name="$2"]');
}

function _find(name, children) {
  return _findAll(name, children, true)[0] || null;
}
function _findAll(name, children, first) {
  return __findAll(name, children, [], first);
}
function __findAll(name, children, res, first) {
  for (var i = 0, len = children.length; i < len; i++) {
    var child = children[i];
    if (child instanceof _Element3.default) {
      res = __findEq(name, child, res, first);
    } else if (child instanceof _Obj2.default) {
      child = child.v;
      if (Array.isArray(child)) {
        res = __findAll(name, child, res, first);
      } else if (child instanceof _Element3.default) {
        res = __findEq(name, child, res, first);
      }
    } else if (Array.isArray(child)) {
      res = __findAll(name, child, res, first);
    }
    if (first && res.length) {
      break;
    }
  }
  return res;
}
function __findEq(name, child, res, first) {
  // cp不递归
  if (child instanceof _Component2.default) {
    if (child instanceof name) {
      res.push(child);
    }
  }
  // vd递归
  else {
      if (child instanceof name) {
        res.push(child);
        if (first) {
          return res;
        }
      }
      res = res.concat(child.findAll(name, first));
    }
  return res;
}

var VirtualDom = function (_Element) {
  _inherits(VirtualDom, _Element);

  function VirtualDom(uid, name, props, children) {
    _classCallCheck(this, VirtualDom);

    // 自闭合标签不能有children
    if (_selfClose2.default.hasOwnProperty(name) && children && children.length) {
      throw new Error('self-close tag can not has children: ' + name);
    }

    var _this = _possibleConstructorReturn(this, (VirtualDom.__proto__ || Object.getPrototypeOf(VirtualDom)).call(this, uid, name, props, children));

    var self = _this;
    self.__names = null; // 从Component根节点到自己的tagName列表，以便css计算
    self.__classes = null; // 同上，class列表
    self.__ids = null; // 同上，id列表
    // self.__hover = false; // 是否处于鼠标hover状态
    // self.__active = false; // 是否处于鼠标active状态
    // self.__listener = null; // 添加的event的cb引用，remove时使用
    // self.__init(name, children);
    return _this;
  }

  // @override


  _createClass(VirtualDom, [{
    key: 'toString',
    value: function toString() {
      var self = this;
      var res = '<' + self.__name;
      // 处理属性
      for (var i = 0, len = self.__props.length; i < len; i++) {
        var item = self.__props[i];
        var s = self.__renderProp(item[0], item[1]);
        res += s;
      }
      // 使用jaw内联css需解析
      if (self.__style) {
        var s = self.__match(true);
        if (s) {
          if (res.indexOf(' style="') > 1) {
            res = res.replace(/ style="[^"]*"/, ' style="' + s + '"');
          } else {
            res = res + ' style="' + s + '"';
          }
        }
      }
      res += ' migi-uid="' + self.__uid + '"';
      // :input要侦听数据绑定
      self.__checkListener();
      // 自闭合标签特殊处理
      if (self.__selfClose) {
        return res + '/>';
      }
      res += '>';
      // 有dangerouslySetInnerHTML直接返回
      if (self.props.dangerouslySetInnerHTML) {
        var s = self.props.dangerouslySetInnerHTML;
        if (s instanceof _Obj2.default) {
          s = s.toSourceString();
        } else if (Array.isArray(s)) {
          s = _util2.default.joinSourceArray(s);
        } else {
          s = _util2.default.stringify(s);
        }
        res += s;
      }
      // 渲染children
      else {
          res += self.__renderChildren();
        }
      res += '</' + self.__name + '>';
      return res;
    }
    // @override

  }, {
    key: 'preString',
    value: function preString() {
      var self = this;
      // 处理属性
      for (var i = 0, len = self.__props.length; i < len; i++) {
        var item = self.__props[i];
        self.__renderProp(item[0], item[1]);
      }
      // 使用jaw内联css需解析
      if (self.__style) {
        self.__match(true);
      }
      // :input要侦听数据绑定
      self.__checkListener();
      // 渲染children
      self.__renderChildren();
    }

    // 始终以缓存的props属性为准，哪怕更改了真实DOM的属性

  }, {
    key: 'isFirst',
    value: function isFirst(children) {
      // 本身就是Component的唯一节点
      if (this.parent instanceof _Component2.default) {
        return true;
      }
      children = children || this.parent.children;
      for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];
        if (Array.isArray(child) && child.length) {
          return this.isFirst(child);
        } else if (child == this) {
          return true;
        } else if (child instanceof VirtualDom) {
          return false;
        } else if (child instanceof _Obj2.default) {
          child = child.v;
          if (Array.isArray(child) && child.length) {
            return this.isFirst(child);
          }
        }
      }
    }
  }, {
    key: 'isLast',
    value: function isLast(children) {
      // 本身就是Component的唯一节点
      if (this.parent instanceof _Component2.default) {
        return true;
      }
      children = children || this.parent.children;
      for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];
        if (Array.isArray(child) && child.length) {
          return this.isLast(child);
        } else if (child == this) {
          return true;
        } else if (child instanceof VirtualDom) {
          return false;
        } else if (child instanceof _Obj2.default) {
          child = child.v;
          if (Array.isArray(child) && child.length) {
            return this.isLast(child);
          }
        }
      }
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return childEmpty(this.children);
    }
  }, {
    key: 'isEnabled',
    value: function isEnabled() {
      return !this.__cache.disabled;
    }
  }, {
    key: 'isDisabled',
    value: function isDisabled() {
      return this.__cache.disabled;
    }
  }, {
    key: 'isChecked',
    value: function isChecked() {
      return this.__cache.checked;
    }
  }, {
    key: 'prev',
    value: function prev() {
      var res = {};
      getPrev(this.parent.children, this, res, function (child) {
        res.prev = child;
      });
      return res.prev;
    }
  }, {
    key: 'prevAll',
    value: function prevAll(sel) {
      var res = {
        prev: []
      };
      getPrev(this.parent.children, this, res, function (child) {
        if (sel && !_matchUtil2.default.nci(sel, child) || !sel) {
          res.prev.push(child);
        }
      });
      return res.prev;
    }
  }, {
    key: 'next',
    value: function next() {
      var res = {};
      getNext(this.parent.children, this, res, function (child) {
        res.next = child;
        res.done = true;
      });
      return res.next;
    }
  }, {
    key: 'nextAll',
    value: function nextAll(sel) {
      var res = {
        next: []
      };
      getNext(this.parent.children, this, res, function (child) {
        if (sel && !_matchUtil2.default.nci(sel, child) || !sel) {
          res.next.push(child);
        }
      });
      return res.next;
    }
  }, {
    key: 'isOnly',
    value: function isOnly() {
      return this.siblings().length == 1;
    }
  }, {
    key: 'isOnlyOfType',
    value: function isOnlyOfType(sel) {
      var self = this;
      var all = self.siblings();
      for (var i = 0, len = all.length; i < len; i++) {
        var item = all[i];
        if (item != self && !_matchUtil2.default.nci(sel, item)) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'isFirstOfType',
    value: function isFirstOfType(sel) {
      var prevAll = this.prevAll(sel);
      for (var i = 0, len = prevAll.length; i < len; i++) {
        if (!_matchUtil2.default.nci(sel, prevAll[i])) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'isLastOfType',
    value: function isLastOfType(sel) {
      var nextAll = this.nextAll(sel);
      for (var i = 0, len = nextAll.length; i < len; i++) {
        if (!_matchUtil2.default.nci(sel, nextAll[i])) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'siblings',
    value: function siblings() {
      var parent = this.parent;
      var all = allChildren(parent.children);
      return all;
    }
  }, {
    key: 'getIdx',
    value: function getIdx(reverse) {
      var siblings = this.siblings();
      var i = siblings.indexOf(this);
      if (i > -1) {
        return reverse ? siblings.length - i - 1 : i;
      }
      return -1;
    }
  }, {
    key: 'getIdxOfType',
    value: function getIdxOfType(sel, reverse) {
      var siblings = reverse ? this.nextAll(sel) : this.prevAll(sel);
      if (reverse) {
        siblings.unshift(this);
      } else {
        siblings.push(this);
      }
      var i = siblings.indexOf(this);
      if (i > -1) {
        return reverse ? siblings.length - i - 1 : i;
      }
      return -1;
    }
  }, {
    key: 'closest',
    value: function closest(sel) {
      var cur = this;
      while (cur && cur != this.top) {
        if (_matchUtil2.default.nci(sel, cur)) {
          cur = cur.parent;
          continue;
        }
        return cur;
      }
    }
  }, {
    key: '__renderProp',
    value: function __renderProp(k, v) {
      var self = this;
      var res = '';
      // onxxx侦听处理
      if (/^on[a-zA-Z]/.test(k)) {
        self.__renderPropEventDelay = self.__renderPropEventDelay || [];
        self.__renderPropEventDelay.push({ k: k.slice(2).toLowerCase(), v: v });
      }
      // Obj类型绑定处理
      else if (v instanceof _Obj2.default) {
          // 特殊html不转义
          if (k == 'dangerouslySetInnerHTML') {
            return '';
          }
          var s = v.toString(true);
          if (k == 'className') {
            k = 'class';
          } else if (k == 'htmlFor') {
            k = 'for';
          }
          self.__cache[k] = s;
          // 特殊属性根据类型输出或是在DOM后设置prop
          var special = _attr2.default.special(self.__name, k);
          switch (special) {
            case _attr2.default.RENDER_EXIST:
              if (v.v) {
                res = ' ' + k + '="' + s + '"';
              }
              break;
            case _attr2.default.RENDER_DOM:
              self.once(_Event2.default.DOM, function () {
                self.__updateAttr(k, v.v);
              });
              break;
            default:
              res = ' ' + k + '="' + s + '"';
              break;
          }
        } else {
          var s = Array.isArray(v) ? _util2.default.joinSourceArray(v) : _util2.default.stringify(v);
          if (k == 'dangerouslySetInnerHTML') {
            return '';
          }
          if (k == 'className') {
            k = 'class';
          } else if (k == 'htmlFor') {
            k = 'for';
          }
          self.__cache[k] = s;
          // 特殊属性根据类型输出或是在DOM后设置prop
          var special = _attr2.default.special(self.__name, k);
          switch (special) {
            case _attr2.default.RENDER_EXIST:
              if (v) {
                res = ' ' + k + '="' + _util2.default.encodeHtml(s, true) + '"';
              }
              break;
            case _attr2.default.RENDER_DOM:
              self.once(_Event2.default.DOM, function () {
                self.__updateAttr(k, v);
              });
              break;
            default:
              res = ' ' + k + '="' + _util2.default.encodeHtml(s, true) + '"';
              break;
          }
        }
      // 使用jaw导入样式时不输出class和id，以migi-class和migi-id取代之
      if (self.__style) {
        switch (k) {
          case 'class':
          case 'id':
            res = ' ' + 'migi-' + res.slice(1);
            break;
        }
      }
      return res;
    }
  }, {
    key: '__renderChildren',
    value: function __renderChildren() {
      var self = this;
      var res = '';
      for (var i = 0, len = self.children.length; i < len; i++) {
        res += renderChild(self.children[i]);
      }
      return res;
    }
  }, {
    key: '__checkListener',
    value: function __checkListener() {
      var self = this;
      if (self.__name == 'input') {
        if (self.props.hasOwnProperty('value')) {
          var item = self.props.value;
          if (item instanceof _Obj2.default && item.vBind) {
            self.once(_Event2.default.DOM, function () {
              var type = (self.__cache.type || '').toLowerCase();
              function cb(e) {
                (0, _fixEvent2.default)(e);
                var v = e.target.value;
                if (type == 'number') {
                  v = parseFloat(v);
                }
                item.vBind(v);
              }
              switch (type) {
                // 一些无需联动
                // case 'button':
                // case 'hidden':
                // case 'image':
                // case 'file':
                // case 'reset':
                // case 'submit':
                //  break;
                // 只需侦听change
                case 'checkbox':
                case 'radio':
                case 'range':
                case 'color':
                  self.__addListener('change', cb);
                  break;
                // 其它无需change，但input等
                default:
                  self.__addListener(['input', 'paste', 'cut', 'change'], cb);
                  break;
              }
            });
          }
        } else if (self.props.hasOwnProperty('checked')) {
          var item = self.props.checked;
          if (item instanceof _Obj2.default && item.vBind) {
            self.once(_Event2.default.DOM, function () {
              function cb(e) {
                (0, _fixEvent2.default)(e);
                var v = e.target.checked;
                item.vBind(v);
              }
              var type = self.__cache.type || '';
              switch (type.toLowerCase()) {
                case 'checkbox':
                case 'radio':
                  self.__addListener('change', cb);
                  break;
              }
            });
          }
        }
      } else if (self.__name == 'option') {
        if (self.props.hasOwnProperty('selected')) {
          var item = self.props.selected;
          if (item instanceof _Obj2.default && item.vBind) {
            self.once(_Event2.default.DOM, function () {
              function cb(e) {
                (0, _fixEvent2.default)(e);
                var v = e.target.selected;
                item.vBind(v);
              }
              self.__addListener('change', cb);
            });
          }
        }
      }
      // textarea的value在标签的childNodes里，这里只处理单一child情况
      // children有多个其中一个是text有歧义，忽视
      else if (self.__name == 'textarea') {
          if (self.children.length == 1) {
            var child = self.children[0];
            if (child instanceof _Obj2.default && child.vBind) {
              self.once(_Event2.default.DOM, function () {
                function cb(e) {
                  (0, _fixEvent2.default)(e);
                  var v = e.target.value;
                  child.vBind(v);
                }
                self.__addListener(['input', 'paste', 'cut', 'change'], cb);
              });
            }
          }
        }
      if (self.__renderPropEventDelay) {
        self.__renderPropEventDelay.forEach(function (item) {
          self.once(_Event2.default.DOM, function () {
            self.__addEvt(item.k, item.v);
          });
        });
        self.__renderPropEventDelay = null;
      }
    }
  }, {
    key: '__addEvt',
    value: function __addEvt(name, v) {
      var self = this;
      self.__addListener(name, function (e) {
        (0, _fixEvent2.default)(e);
        var target = e.target;
        var uid = target.getAttribute('migi-uid');
        var tvd = _hash2.default.get(uid);
        if (v instanceof _Cb2.default && _util2.default.isFunction(v.cb)) {
          return v.cb.call(v.context, e, self, tvd);
        } else if (_util2.default.isFunction(v)) {
          return v(e, self, tvd);
        } else if (Array.isArray(v)) {
          var ret;
          v.forEach(function (item, i) {
            var cb = item[1];
            var res = (0, _delegate2.default)(e, item[0], self);
            if (res[0]) {
              if (cb instanceof _Cb2.default && _util2.default.isFunction(cb.cb)) {
                if (i) {
                  cb.cb.call(cb.context, e, self, res[1], tvd);
                } else {
                  ret = cb.cb.call(cb.context, e, self, res[1], tvd);
                }
              } else if (_util2.default.isFunction(cb)) {
                if (i) {
                  cb(e, self, res[1], tvd);
                } else {
                  ret = cb(e, self, res[1], tvd);
                }
              }
            }
          });
          return ret;
        }
      });
    }
  }, {
    key: '__addListener',
    value: function __addListener(name, cb) {
      var self = this;
      if (Array.isArray(name)) {
        for (var i = 0, len = name.length; i < len; i++) {
          self.__addListener(name[i], cb);
        }
      } else {
        // 一般没有event，也就不生成对象防止diff比对
        self.__listener = self.__listener || [];
        if (name == 'tap') {
          name = 'click';
        }
        var elem = self.element;
        // touch特殊对待
        if (TOUCH.hasOwnProperty(name)) {
          (0, _touch2.default)(this, name, cb, self.__listener);
          return;
        }
        // 记录下来留待清除
        self.__listener.push([name, cb]);
        elem.addEventListener(_eventCaseName2.default[name] || name, cb);
        // onLoad可能因为缓存不发生
        if (name == 'load' && elem.complete) {
          var event = document.createEvent('Event');
          event.initEvent('load', true, true);
          elem.dispatchEvent(event);
        }
      }
    }
  }, {
    key: '__removeListener',
    value: function __removeListener() {
      var self = this;
      if (self.__listener) {
        var elem = self.element;
        for (var i = self.__listener.length - 1; i >= 0; i--) {
          var arr = self.__listener[i];
          elem.removeEventListener(arr[0], arr[1]);
        }
        self.__listener = null;
      }
    }
  }, {
    key: 'find',
    value: function find(selector) {
      if (_util2.default.isFunction(selector)) {
        return _find(selector, this.children);
      }
      if (this.element) {
        var node = this.element.querySelector(convertSelector(selector));
        var uid = node.getAttribute('migi-uid');
        return _hash2.default.get(uid) || null;
      }
      return null;
    }
  }, {
    key: 'findAll',
    value: function findAll(selector) {
      if (_util2.default.isFunction(selector)) {
        return _findAll(selector, this.children);
      }
      var res = [];
      if (this.element) {
        var nodes = this.element.querySelectorAll(convertSelector(selector));
        Array.from(nodes).forEach(function (node) {
          if (node) {
            var uid = node.getAttribute('migi-uid');
            var vd = _hash2.default.get(uid) || null;
            if (vd) {
              res.push(vd);
            }
          }
        });
      }
      return res;
    }

    // @override

  }, {
    key: '__onDom',
    value: function __onDom() {
      _get(VirtualDom.prototype.__proto__ || Object.getPrototypeOf(VirtualDom.prototype), '__onDom', this).call(this);
      var self = this;
      // start标明真实DOM索引，因为相邻的文本会合并为一个text节点
      var option = { start: 0, first: true };
      self.__checkBlank(self.children, option);
      // 可能最后一个是空白text，或没有children，需特殊判断下插入
      if (option.empty || option.first) {
        self.__insertBlank(option.start);
      }
    }
  }, {
    key: '__checkBlank',
    value: function __checkBlank(item, option) {
      var self = this;
      if (Array.isArray(item) && item.length) {
        for (var i = 0, len = item.length; i < len; i++) {
          self.__checkBlank(item[i], option);
        }
      } else if (_util2.default.isDom(item)) {
        // 前面的连续的空白节点需插入一个空TextNode
        if (option.empty) {
          self.__insertBlank(option.start);
        }
        // 递归通知DOM事件，增加start索引
        option.start++;
        // 前方文本节点需再增1次，因为文本节点自身不涉及start索引逻辑
        if (option.prev == _type2.default.TEXT) {
          option.start++;
        }
        option.prev = _type2.default.DOM;
        option.empty = false;
        option.first = false;
        item.emit(_Event2.default.DOM);
      } else if (item instanceof _Obj2.default) {
        self.__checkBlank(item.v, option);
      } else if (isEmptyText(item)) {
        // 前方如有兄弟文本节点，无需插入，否则先记录empty，等后面检查是否有非空text出现，再插入空白节点
        if (option.prev == _type2.default.TEXT) {
          return;
        }
        option.empty = true;
        option.prev = _type2.default.TEXT;
        option.first = false;
      }
      // 一旦是个非空text，之前记录的空text将无效，因为相邻的text会合并为一个text节点
      else {
          option.empty = false;
          option.prev = _type2.default.TEXT;
          option.first = false;
        }
    }
  }, {
    key: '__insertBlank',
    value: function __insertBlank(start) {
      var blank = document.createTextNode('');
      var elem = this.element;
      var cns = elem.childNodes;
      // 可能仅一个空文本节点，或最后一个空文本节点
      var length = cns.length;
      if (!length || start >= length) {
        elem.appendChild(blank);
      }
      // 插入
      else {
          elem.insertBefore(blank, cns[start]);
        }
    }
    // @override

  }, {
    key: '__onData',
    value: function __onData(k, opt) {
      var self = this;
      // 尚未添加到dom时无效
      if (!self.dom) {
        return;
      }
      // 联动属性值
      for (var i = 0, len = self.__props.length; i < len; i++) {
        var item = self.__props[i];
        var key = item[0];
        item = item[1];
        if (item instanceof _Obj2.default) {
          var change = false;
          var vk = Array.isArray(k) ? 1 : 0;
          var ok = Array.isArray(item.k) ? 2 : 0;
          switch (vk | ok) {
            case 0:
              change = k == item.k;
              break;
            case 1:
              change = k.indexOf(item.k) > -1;
              break;
            case 2:
              change = item.k.indexOf(k) > -1;
              break;
            case 3:
              var hash = {};
              for (var j = k.length - 1; j >= 0; j--) {
                hash[k[j]] = true;
              }
              for (var temp = item.k, j = 0, len = temp.length; j < len; j++) {
                if (hash.hasOwnProperty(temp[j])) {
                  change = true;
                  break;
                }
              }
              break;
          }
          if (change) {
            var ov = item.v;
            if (item.update(ov)) {
              self.__updateAttr(key, item.v);
            }
          }
        }
      }
      // 利用索引更新，子节点可能为文本、Component、VirtualDom，以及数组
      // 其中只有文本节点需要自己更新，记录其索引，组件和VirtualDom递归通知更新
      // 由于渲染时相邻的文本变量和String文本同为一个文本节点，因此start为真实DOM的索引，history和record为vd索引
      // 当文本节点时start不更新
      // Obj类型的判断type和count，及为文本时是否为空
      var record = { start: 0, range: [], history: [], first: true };
      var children = self.children;
      for (var index = 0, len = children.length; index < len; index++) {
        var child = children[index];
        record.index = [index];
        self.__checkObj(k, child, record, opt);
      }
      if (record.range.length) {
        // textarea特殊判断
        if (self.__name == 'textarea') {
          self.__updateAttr('value', _range2.default.value(record.range[0], self.children));
          return;
        }
        for (var i = 0, len = record.range.length; i < len; i++) {
          _range2.default.update(record.range[i], self.children, self.element);
        }
      }
    }
    // record.first标明是否第一个，因为child为数组时会展开，当child不是第1个时其展开项都有prev

  }, {
    key: '__checkObj',
    value: function __checkObj(k, child, record, opt) {
      var self = this;
      // 当Component和VirtualDom则start++，且前面是非空文本节点时再++，因为有2个节点
      // 文本节点本身不会增加索引，因为可能有相邻的
      if (child instanceof _Obj2.default) {
        // 可能Obj的关联是个列表，触发的变量name也是列表
        var change = false;
        var vk = Array.isArray(k) ? 1 : 0;
        var ok = Array.isArray(child.k) ? 2 : 0;
        switch (vk | ok) {
          case 0:
            change = k == child.k;
            break;
          case 1:
            change = k.indexOf(child.k) > -1;
            break;
          case 2:
            change = child.k.indexOf(k) > -1;
            break;
          case 3:
            var hash = {};
            for (var i = k.length - 1; i >= 0; i--) {
              hash[k[i]] = true;
            }
            for (var temp = child.k, i = 0, len = temp.length; i < len; i++) {
              if (hash.hasOwnProperty(temp[i])) {
                change = true;
                break;
              }
            }
            break;
        }
        // 当可能发生变化时才进行比对
        if (change) {
          var ov = child.v;
          // 对比是否真正发生变更
          if (child.update(ov)) {
            _domDiff2.default.diff(this, this.element, ov, child.v, record, _dev2.default.optimizeArrayDiff && child.single && opt);
          } else {
            self.__checkObj(k, child.v, record, opt);
          }
        } else {
          self.__checkObj(k, child.v, record, opt);
        }
      }
      // 递归通知，增加索引
      else if (_util2.default.isDom(child)) {
          if (child instanceof VirtualDom) {
            child.__onData(k, opt);
          }
          // bindProperty #37
          else {
              child.__notifyBindProperty(k);
            }
          record.start++;
          // 前面的文本再加一次索引
          if (!record.first && record.prev == _type2.default.TEXT) {
            record.start++;
          }
          record.state = _type2.default.DOM_TO_DOM;
          record.prev = _type2.default.DOM;
        } else if (Array.isArray(child)) {
          if (child.length) {
            // 数组类型记得递归记录history索引，结束后出栈
            record.index.push(0);
            for (var i = 0, len = child.length; i < len; i++) {
              var item = child[i];
              record.index[record.index.length - 1] = i;
              // 第1个同时作为children的第1个要特殊处理
              self.__checkObj(k, item, record, opt);
            }
            record.index.pop();
          }
          // 注意空数组算text类型
          else {
              _domDiff2.default.checkText(this.element, child, record);
              if (record.first || record.prev == _type2.default.DOM) {
                _domDiff2.default.recordRange(record);
              }
              record.state = _type2.default.TEXT_TO_TEXT;
              record.prev = _type2.default.TEXT;
            }
        }
        // 其它情况为文本节点或者undefined忽略
        else {
            _domDiff2.default.checkText(this.element, child, record);
            if (record.first || record.prev == _type2.default.DOM) {
              _domDiff2.default.recordRange(record);
            }
            record.state = _type2.default.TEXT_TO_TEXT;
            record.prev = _type2.default.TEXT;
          }
      record.first = false;
    }
    // TODO: 一个神奇的现象，实体字符作为attr在初始化时作为String拼接和在setAttribute中表现不一致
    // 如&nbsp;会成为charCode 160的Non-breaking space，而非32的Normal space
    // 但是setAttribute会保留实体字符形式

  }, {
    key: '__updateAttr',
    value: function __updateAttr(k, v) {
      if (k == 'dangerouslySetInnerHTML') {
        if (v === null || v === undefined) {
          v = '';
        }
        this.element.innerHTML = _util2.default.stringify(v);
        // 清空后创建空字符节点
        this.__insertBlank(0);
        return;
      }
      _attr2.default.update(this.__name, this.element, k, v, this.__style);
      this.__cache[k] = v;
      // 使用了jaw内联解析css
      if (this.__style) {
        this.__updateStyle();
      }
    }
  }, {
    key: '__match',
    value: function __match(first) {
      var inline = this.__cache.style || '';
      // 预处理class和id，class分为数组形式，id判断#开头
      this.__initCI();
      var matches = (0, _match2.default)(this.__names, this.__classes, this.__ids, this.__style || { default: {} }, this, first);
      // 本身的inline最高优先级追加到末尾
      return matches + inline;
    }
  }, {
    key: '__initCI',
    value: function __initCI() {
      var p = this.parent;
      if (p instanceof VirtualDom) {
        this.__classes = p.__classes.slice();
        this.__ids = p.__ids.slice();
      } else {
        this.__classes = [];
        this.__ids = [];
      }
      // 预处理class和id，class分为数组形式，id判断#开头
      this.__classes.push(_matchUtil2.default.splitClass(this.__cache['class']));
      this.__ids.push(_matchUtil2.default.preId(this.__cache.id));
    }
  }, {
    key: '__updateStyle',
    value: function __updateStyle(first) {
      var s = this.__match(first);
      if (this.element.getAttribute('style') != s) {
        this.element.setAttribute('style', s);
      }
      // diff调用初始化nvd时自上而下，忽略children
      if (first) {
        return;
      }
      for (var i = this.children.length - 1; i >= 0; i--) {
        var child = this.children[i];
        if (child instanceof VirtualDom) {
          child.__updateStyle();
        }
      }
    }
  }, {
    key: '__init',
    value: function __init(name, children) {
      var self = this;
      self.__selfClose = _selfClose2.default.hasOwnProperty(name);
      childParent(children, self);
    }
    // @Overwrite

  }, {
    key: '__reset',
    value: function __reset(uid, name) {
      var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var children = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      _get(VirtualDom.prototype.__proto__ || Object.getPrototypeOf(VirtualDom.prototype), '__reset', this).call(this, uid, name, props, children);
      this.__init(name, children);
      this.__hasDes = false;
      return this;
    }
  }, {
    key: '__destroy',
    value: function __destroy() {
      if (this.__onHover || this.__outHover) {
        if (this.element) {
          this.element.removeEventListener('mouseenter', this.__onHover);
          this.element.removeEventListener('mouseleave', this.__outHover);
        }
      }
      this.__hash = {};
      this.__cache = null;
      this.__names = null;
      this.__classes = null;
      this.__ids = null;
      this.__hover = false;
      this.__active = false;
      this.__listener = null;
      this.__parent = null;
      this.__top = null;
      this.__dom = false;
      this.__style = null;
      this.__element = null;
      this.__renderPropEventDelay = null;
      return this;
    }
    // @Overwrite

  }, {
    key: 'clean',
    value: function clean() {
      _get(VirtualDom.prototype.__proto__ || Object.getPrototypeOf(VirtualDom.prototype), 'clean', this).call(this);
      this.__renderPropEventDelay = null;
      this.__removeListener();
      this.__names = null;
      this.__classes = null;
      this.__ids = null;
      this.__hover = false;
      this.__active = false;
    }
  }, {
    key: 'names',
    get: function get() {
      return this.__names || (this.__names = []);
    }
  }, {
    key: 'element',
    get: function get() {
      return this.__element || (this.__element = document.querySelector(this.__name + '[migi-uid="' + this.__uid + '"]'));
    }
  }, {
    key: 'style',
    get: function get() {
      return this.__style;
    },
    set: function set(v) {
      var self = this;
      self.__style = v;
      if (self.parent instanceof VirtualDom) {
        self.__names = self.parent.names.slice();
      } else {
        self.__names = [];
      }
      self.__names.push(self.__name);
      for (var i = 0, len = self.children.length; i < len; i++) {
        childStyle(self.children[i], v);
      }
    }
  }]);

  return VirtualDom;
}(_Element3.default);

// 静态文本节点，包括空、undefined、null、空数组


function isEmptyText(item) {
  return item === undefined || item === null || !item.toString();
}
function renderChild(child) {
  if (child instanceof _Element3.default || child instanceof _Obj2.default) {
    return child.toString();
  }
  if (Array.isArray(child)) {
    var res = '';
    for (var i = 0, len = child.length; i < len; i++) {
      res += renderChild(child[i]);
    }
    return res;
  }
  return _util2.default.encodeHtml(_util2.default.stringify(child));
}
function childParent(child, parent) {
  if (Array.isArray(child)) {
    for (var i = 0, len = child.length; i < len; i++) {
      childParent(child[i], parent);
    }
  } else if (child instanceof _Element3.default) {
    child.__parent = parent;
  } else if (child instanceof _Obj2.default) {
    childParent(child.v, parent);
  }
}
function childStyle(child, style) {
  if (Array.isArray(child)) {
    for (var i = 0, len = child.length; i < len; i++) {
      childStyle(child[i], style);
    }
  } else if (child instanceof VirtualDom) {
    child.style = style;
  } else if (child instanceof _Obj2.default) {
    childStyle(child.v, style);
  }
}
function childEmpty(child) {
  var res = true;
  if (Array.isArray(child)) {
    for (var i = 0, len = child.length; i < len; i++) {
      res = childEmpty(child[i]);
      if (!res) {
        break;
      }
    }
  } else if (child instanceof _Element3.default) {
    res = false;
  } else if (child instanceof _Obj2.default) {
    res = childEmpty(child.v);
  } else {
    res = isEmptyText(child);
  }
  return res;
}
function getPrev(child, target, res, cb) {
  if (Array.isArray(child)) {
    for (var i = 0, len = child.length; i < len; i++) {
      getPrev(child[i], target, res, cb);
      if (res.done) {
        break;
      }
    }
  } else if (child instanceof _Element3.default) {
    if (target == child) {
      res.done = true;
      return;
    }
    cb(child);
  } else if (child instanceof _Obj2.default) {
    getPrev(child.v, target, res, cb);
  }
}
function getNext(child, target, res, cb) {
  if (Array.isArray(child)) {
    for (var i = 0, len = child.length; i < len; i++) {
      getNext(child[i], target, res, cb);
      if (res.done) {
        break;
      }
    }
  } else if (child instanceof _Element3.default) {
    if (target == child) {
      res.start = true;
    } else if (res.start) {
      cb(child);
    }
  } else if (child instanceof _Obj2.default) {
    getNext(child.v, target, res, cb);
  }
}
function allChildren(child) {
  var res = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (Array.isArray(child)) {
    for (var i = 0, len = child.length; i < len; i++) {
      allChildren(child[i], res);
    }
  } else if (child instanceof _Element3.default) {
    res.push(child);
  } else if (child instanceof _Obj2.default) {
    allChildren(child.v, res);
  }
  return res;
}

exports.default = VirtualDom;});