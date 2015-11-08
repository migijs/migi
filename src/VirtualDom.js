import Event from './Event';
import Element from './Element';
import Component from './Component';
import browser from './browser';
import util from './util';
import Obj from './Obj';
import Cb from './Cb';
import range from './range';
import match from './match';
import sort from './sort';
import domDiff from './domDiff';
import type from './type';
import fixEvent from './fixEvent';
import attr from './attr';
import hash from './hash';

const SELF_CLOSE = {
  'img': true,
  'meta': true,
  'link': true,
  'br': true,
  'basefont': true,
  'base': true,
  'col': true,
  'embed': true,
  'frame': true,
  'hr': true,
  'input': true,
  'keygen': true,
  'area': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
};

function convertSelector(selector) {
  if(selector instanceof Element || browser.lie && selector && selector.__migiEL) {
    return selector.name + '[migi-uid="' + selector.uid + '"]';
  }
  return selector.replace(/\b([A-Z][\w$]*)\b/, '[migi-name="$1"]');
}

function find(name, children) {
  return findAll(name, true)[0] || null;
}
function findAll(name, children, first) {
  return __findAll(name, children, [], first);
}
function __findAll(name, children, res, first) {
  for(var i = 0, len = children.length; i < len; i++) {
    var child = children[i];
    if(child instanceof Element || browser.lie && child && child.__migiEL) {
      res = __findEq(name, child, res, first);
    }
    else if(child instanceof Obj) {
      child = child.v;
      if(Array.isArray(child)) {
        res = __findAll(name, child, res, first);
      }
      else if(child instanceof Element || browser.lie && child && child.__migiEL) {
        res = __findEq(name, child, res, first);
      }
    }
    else if(Array.isArray(child)) {
      res = __findAll(name, child, res, first);
    }
    if(first && res.length) {
      break;
    }
  }
  return res;
}
function __findEq(name, child, res, first) {
  //cp不递归
  if(child instanceof Component || browser.lie && child && child.__migiCP) {
    if(child instanceof name
      || browser.lie && child.__migiCP && child.__migiCP instanceof name) {
      res.push(child);
    }
  }
  //vd递归
  else {
    if(child instanceof name
      || browser.lie && child.__migiVD && child.__migiVD instanceof name) {
      res.push(child);
      if(first) {
        return res;
      }
    }
    res = res.concat(child.findAll(name, first));
  }
  return res;
}

class VirtualDom extends Element {
  constructor(name, props = {}, children = []) {
    //fix循环依赖
    if(Component.hasOwnProperty('default')) {
      Component = Component['default'];
    }
    //自闭合标签不能有children
    if(SELF_CLOSE.hasOwnProperty(name) && children.length) {
      throw new Error('self-close tag can not has chilren nodes: ' + name);
    }
    super(name, props, children);

    var self = this;
    self.__names = null; //从Component根节点到自己的tagName列表，以便css计算
    self.__classes = null; //同上，class列表
    self.__ids = null; //同上，id列表
    self.__inline = null; //昏村本身props的style属性
    self.__hover = false; //是否处于鼠标hover状态
    self.__active = false; //是否处于鼠标active状态
    self.__listener = null; //添加的event的cb引用，remove时使用
    self.__init(name, children);

    if(browser.lie) {
      self.__migiVD = this;
      return self.__hackLie(VirtualDom, GS);
    }
  }

  //@override
  toString() {
    var self = this;
    var res = '<' + self.name;
    //处理属性
    Object.keys(self.props).forEach(function(prop) {
      var s = self.__renderProp(prop);
      res += s;
    });
    //使用jaw内联css需解析
    if(self.__style) {
      var s = self.__match(true);
      if(s) {
        if(res.indexOf(' style="') > 1) {
          res = res.replace(/ style="[^"]*"/, ' style="' + s + '"');
        }
        else {
          res = res + ' style="' + s + '"';
        }
      }
    }
    res += ' migi-uid="' + self.uid + '"';
    //:input要侦听数据绑定
    self.__checkListener();
    //自闭合标签特殊处理
    if(self.__selfClose) {
      return res + '/>';
    }
    res += '>';
    //渲染children
    res += self.__renderChildren();
    res +='</' + self.name + '>';
    return res;
  }

  isFirst(children) {
    //本身就是Component的唯一节点
    if(this.parent instanceof Component || browser.lie && this.parent && this.parent.__migiCP) {
      return true;
    }
    children = children || this.parent.children;
    for(var i = 0, len = children.length; i < len; i++) {
      var child = children[i];
      if(Array.isArray(child) && child.length) {
        return this.isFirst(child);
      }
      else if(child == this) {
        return true;
      }
      else if(child instanceof VirtualDom || browser.lie && child && child.__migiVD) {
        return false;
      }
      else if(child instanceof Obj) {
        child = child.v;
        if(Array.isArray(child) && child.length) {
          return this.isFirst(child);
        }
      }
    }
  }
  isLast(children) {
    //本身就是Component的唯一节点
    if(this.parent instanceof Component || browser.lie && this.parent && this.parent.__migiCP) {
      return true;
    }
    children = children || this.parent.children;
    for(var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      if(Array.isArray(child) && child.length) {
        return this.isLast(child);
      }
      else if(child == this) {
        return true;
      }
      else if(child instanceof VirtualDom || browser.lie && child && child.__migiVD) {
        return false;
      }
      else if(child instanceof Obj) {
        child = child.v;
        if(Array.isArray(child) && child.length) {
          return this.isLast(child);
        }
      }
    }
  }

  __renderProp(prop) {
    var self = this;
    var v = self.props[prop];
    var res = '';
    //onXxx侦听处理
    if(/^on[A-Z]/.test(prop)) {
      self.once(Event.DOM, function(fake) {
        //防止fake未真实添加DOM
        if(fake) {
          return;
        }
        var name = prop.slice(2).replace(/[A-Z]/g, function(up) {
          return up.toLowerCase();
        });
        self.__addListener(name, function(e) {
          e = e || window.event;
          fixEvent(e);
          var item = self.props[prop];
          if(item instanceof Cb) {
            item.cb.call(item.context, e);
          }
          else {
            item(e);
          }
        });
      });
    }
    //Obj类型绑定处理
    else if(v instanceof Obj) {
      var s = v.toString(true);
      //特殊html不转义
      if(prop == 'dangerouslySetInnerHTML') {
        self.once(Event.DOM, function() {
          self.element.innerHTML = s;
        });
        return '';
      }
      if(prop == 'className') {
        prop = 'class';
      }
      self.__cache[prop] = s;
      //特殊属性根据类型输出或是在DOM后设置prop
      var special = attr.special(self.name, prop);
      switch(special) {
        case attr.RENDER_EXIST:
          if(v.v) {
            res = ' ' + prop + '="' + s + '"';
          }
          break;
        case attr.RENDER_DOM:
          self.once(Event.DOM, function() {
            self.__updateAttr(prop, v);
          });
          break;
        default:
          res = ' ' + prop + '="' + s + '"';
          break;
      }
    }
    else {
      var s = Array.isArray(v) ? util.joinArray(v) : util.stringify(v);
      if(prop == 'dangerouslySetInnerHTML') {
        self.once(Event.DOM, function() {
          self.element.innerHTML = s;
        });
        return '';
      }
      if(prop == 'className') {
        prop = 'class';
      }
      self.__cache[prop] = s;
      //特殊属性根据类型输出或是在DOM后设置prop
      var special = attr.special(self.name, prop);
      switch(special) {
        case attr.RENDER_EXIST:
          if(v) {
            res = ' ' + prop + '="' + util.encodeHtml(s, true) + '"';
          }
          break;
        case attr.RENDER_DOM:
          self.once(Event.DOM, function() {
            self.__updateAttr(prop, v);
          });
          break;
        default:
          res = ' ' + prop + '="' + util.encodeHtml(s, true) + '"';
          break;
      }
    }
    //使用jaw导入样式时不输出class和id，以migi-class和migi-id取代之
    if(self.__style) {
      switch(prop) {
        case 'class':
        case 'id':
          res = ' ' + 'migi-' + res.slice(1);
          break;
      }
    }
    return res;
  }
  __renderChildren() {
    var self = this;
    var res = '';
    self.children.forEach(function(child) {
      res += renderChild(child);
    });
    return res;
  }
  __checkListener() {
    var self = this;
    if(self.name == 'input') {
      if(self.props.hasOwnProperty('value')) {
        var item = self.props.value;
        if(item instanceof Obj) {
          self.once(Event.DOM, function() {
            function cb(e) {
              e = e || window.event;
              fixEvent(e);
              var v = e.target.value;
              item.setV(v);
              var key = item.k;
              item.context[key] = v;
            }
            var type = self.__cache.type;
            if(type === void 0 || type === null) {
              type = '';
            }
            switch(type.toLowerCase()) {
              //一些无需联动
              //case 'button':
              //case 'hidden':
              //case 'image':
              //case 'file':
              //case 'reset':
              //case 'submit':
              //  break;
              //只需侦听change
              case 'checkbox':
              case 'radio':
              case 'range':
              case 'color':
                self.__addListener('change', cb);
                break;
              //其它无需change，但input等
              default:
                self.__addListener(['input', 'paste', 'cut', 'change'], cb);
                break;
            }
          });
        }
      }
    }
    else if(self.name == 'select') {
      if(self.props.hasOwnProperty('value')) {
        var item = self.props.value;
        if(item instanceof Obj) {
          self.once(Event.DOM, function() {
            function cb(e) {
              e = e || window.event;
              fixEvent(e);
              var v = e.target.value;
              item.setV(v);
              var key = item.k;
              item.context[key] = v;
            }
            self.__addListener('change', cb);
          });
        }
      }
    }
    //textarea的value在标签的childNodes里，这里只处理单一child情况
    //TODO: textarea的children有多个其中一个是text该怎么办？有歧义
    else if(self.name == 'textarea') {
      if(self.children.length == 1) {
        var child = self.children[0];
        if(child instanceof Obj) {
          self.once(Event.DOM, function() {
            function cb(e) {
              e = e || window.event;
              fixEvent(e);
              var v = e.target.value;
              child.setV(v);
              var key = child.k;
              child.context[key] = v;
            }
            self.__addListener(['input', 'paste', 'cut', 'change'], cb);
          });
        }
      }
    }
  }
  __addListener(name, cb) {
    var self = this;
    if(Array.isArray(name)) {
      name.forEach(function(n) {
        self.__addListener(n, cb);
      });
    }
    else {
      //一般没有event，也就不生成对象防止diff比对
      self.__listener = self.__listener || {};
      if(self.__listener.hasOwnProperty(name)) {
        var temp = self.__listener[name];
        if(Array.isArray(temp)) {
          temp.push(cb);
        }
        else {
          self.__listener[name] = [temp, cb];
        }
      }
      else {
        self.__listener[name] = cb;
      }
      var elem = self.element;
      if(name == 'tap') {
        name = 'click';
      }
      if(browser.lie && elem.attachEvent) {
        //ie8没有input
        if(name == 'input') {
          name = 'keyup';
        }
        elem.attachEvent('on' + name, cb);
      }
      else {
        elem.addEventListener(name, cb);
      }
    }
  }
  __removeListener() {
    var self = this;
    if(self.__listener) {
      var elem = self.element;
      Object.keys(self.__listener).forEach(function(name) {
        var item = self.__listener[name];
        if(Array.isArray(item)) {
          item.forEach(function(cb) {
            if(browser.lie && elem.attachEvent) {
              elem.detachEvent('on' + name, cb);
            }
            else {
              elem.removeEventListener(name, cb);
            }
          });
        }
        else {
          if(browser.lie && elem.attachEvent) {
            //ie8没有input
            if(name == 'input') {
              name = 'keyup';
            }
            elem.detachEvent('on' + name, item);
          }
          else {
            elem.removeEventListener(name, item);
          }
        }
      });
    }
  }

  find(selector) {
    if(util.isFunction(selector)) {
      return find(selector, this.children);
    }
    if(this.element) {
      var node = this.element.querySelector(convertSelector(selector));
      var uid = node.getAttribute('migi-uid');
      var vd = hash.get(uid) || null;
      if(findCp && vd) {
        return vd.top;
      }
      return vd;
    }
    return null;
  }
  findAll(selector) {
    if(util.isFunction(selector)) {
      return findAll(selector, this.children);
    }
    var res = [];
    if(this.element) {
      var nodes = this.element.querySelectorAll(convertSelector(selector));
      Array.from(nodes).forEach(function(node) {
        if(node) {
          var uid = node.getAttribute('migi-uid');
          var vd = hash.get(uid) || null;
          if(vd) {
            if(findCp) {
              res.push(vd.top);
            }
            else {
              res.push(vd);
            }
          }
        }
      });
    }
    return res;
  }

  //@override
  __onDom(fake) {
    super.__onDom();
    var self = this;
    //fake无需插入空白节点，直接递归通知
    if(fake) {
      Component.fakeDom(self.children);
      return;
    }
    //start标明真实DOM索引，因为相邻的文本会合并为一个text节点
    var option = { start: 0, first: true };
    for(var index = 0, len = self.children.length; index < len; index++) {
      var child = self.children[index];
      self.__domChild(child, index, len, option);
    }
    //可能最后一个是空白text，需特殊判断下插入
    if(option.empty) {
      self.__insertBlank(option.start);
    }
  }
  //index和i结合判断首个，因为child为数组时会展开，当child不是第1个时其展开项都有prev
  __domChild(child, index, len, option) {
    var self = this;
    //防止空数组跳过逻辑，它被认为是个空字符串
    if(Array.isArray(child) && child.length) {
      child.forEach(function(item) {
        self.__domChild(item, index, len, option);
      });
    }
    else if(child instanceof Element && !(child instanceof migi.NonVisualComponent)
      || browser.lie && child && child.__migiEL && !child.__migiNV) {
      //前面的连续的空白节点需插入一个空TextNode
      if(option.empty) {
        self.__insertBlank(option.start);
        option.empty = false;
      }
      //递归通知DOM事件，增加start索引
      child.emit(Event.DOM);
      option.start++;
      //前方文本节点需再增1次，因为文本节点自身不涉及start索引逻辑
      if(!option.first) {
        if(option.prev == type.TEXT) {
          option.start++;
        }
      }
      option.prev = type.DOM;
    }
    else if(child instanceof Obj) {
      self.__domChild(child.v, index, len, option);
    }
    else if(isEmptyText(child)) {
      if(child instanceof migi.NonVisualComponent || browser.lie && child && child.__migiNV) {
        child.emit(Event.DOM);
      }
      //前方如有兄弟文本节点，无需插入，否则先记录empty，等后面检查是否有非空text出现，再插入空白节点
      if(!option.first) {
        if(option.prev == type.TEXT) {
          return;
        }
      }
      option.empty = true;
      option.prev = type.TEXT;
    }
    //一旦是个非空text，之前记录的空text将无效，因为相邻的text会合并为一个text节点
    else {
      option.empty = false;
      option.prev = type.TEXT;
    }
    option.first = false;
  }
  __insertBlank(start) {
    var blank = document.createTextNode('');
    var elem = this.element;
    var cns = elem.childNodes;
    //可能仅一个空文本节点，或最后一个空文本节点
    var length = cns.length;
    if(!length || start >= length) {
      elem.appendChild(blank);
    }
    //插入
    else {
      elem.insertBefore(blank, cns[start]);
    }
  }
  //@override
  __onData(k) {
    var self = this;
    //联动属性值
    for(var key in self.props) {
      var item = self.props[key];
      if(item instanceof Obj) {
        var change = false;
        if(Array.isArray(item.k)) {
          change = item.k.indexOf(k) > -1;
        }
        else if(k == item.k) {
          change = true;
        }
        if(change) {
          var ov = item.v;
          if(item.update(ov)) {
            self.__updateAttr(key, item.v);
          }
        }
      }
    }
    //利用索引更新，子节点可能为文本、Component、VirtualDom，以及数组
    //其中只有文本节点需要自己更新，记录其索引，组件和VirtualDom递归通知更新
    //由于渲染时相邻的文本变量和String文本同为一个文本节点，因此start为真实DOM的索引
    //当文本节点时start不更新
    //Obj类型的判断type和count，及为文本时是否为空
    var ranges = [];
    var option = { start: 0, record: [], first: true };
    var history;
    var children = self.children;
    for(var index = 0, len = children.length; index < len; index++) {
      var child = children[index];
      //history记录着当前child索引，可能它是个数组，递归记录
      history = [index];
      self.__checkObj(k, child, ranges, option, history);
    }
    if(ranges.length) {
      //textarea特殊判断
      if(self.name == 'textarea') {
        self.__updateAttr('value', range.value(ranges[0], self.children));
        return;
      }
      ranges.forEach(function(item) {
        range.update(item, self.children, self.element);
      });
    }
  }
  //first标明是否第一个，因为child为数组时会展开，当child不是第1个时其展开项都有prev
  __checkObj(k, child, ranges, option, history) {
    var self = this;
    //当Component和VirtualDom则start++，且前面是非空文本节点时再++，因为有2个节点
    //文本节点本身不会增加索引，因为可能有相邻的
    if(child instanceof Obj) {
      //可能Obj的关联是个列表，触发的变量name也是列表
      var change = false;
      var vk = Array.isArray(k) ? 1 : 0;
      var ok = Array.isArray(child.k) ? 2 : 0;
      switch(vk + ok) {
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
          k.forEach(function(item) {
            hash[item] = true;
          });
          for(var temp = child.k, i = 0, len = temp.length; i < len; i++) {
            if(hash.hasOwnProperty(temp[i])) {
              change = true;
              break;
            }
          }
          break;
      }
      //当可能发生变化时才进行比对
      if(change) {
        var ov = child.v;
        //对比是否真正发生变更
        if(child.update(ov)) {
          domDiff.diff(this.element, ov, child.v, ranges, option, history);
        }
        else {
          self.__checkObj(k, child.v, ranges, option, history);
        }
      }
      else {
        self.__checkObj(k, child.v, ranges, option, history);
      }
    }
    //递归通知，增加索引
    else if(child instanceof Element || browser.lie && child && child.__migiEL) {
      delete option.t2d;
      delete option.d2t;
      if(child instanceof VirtualDom || browser.lie && child && child.__migiVD) {
        child.__onData(k);
      }
      option.start++;
      //前面的文本再加一次
      if(!option.first && option.prev == type.TEXT) {
        option.start++;
      }
      option.prev = type.DOM;
    }
    else if(Array.isArray(child)) {
      if(child.length) {
        //数组类型记得递归记录history索引，结束后出栈
        history.push(0);
        child.forEach(function(item, i) {
          history[history.length - 1] = i;
          //第1个同时作为children的第1个要特殊处理
          self.__checkObj(k, item, ranges, option, history);
        });
        history.pop();
      }
      //注意空数组算text类型
      else {
        domDiff.check(option, this.element, child, ranges, history);
        range.record(history, option);
        option.prev = type.TEXT;
      }
    }
    //else其它情况为文本节点或者undefined忽略
    else {
      domDiff.check(option, this.element, child, ranges, history);
      range.record(history, option);
      option.prev = type.TEXT;
    }
    option.first = false;
  }
  //TODO: 一个神奇的现象，实体字符作为attr在初始化时作为String拼接和在setAttribute中表现不一致
  //如&nbsp;会成为charCode 160的Non-breaking space，而非32的Normal space
  //但是setAttribute会保留实体字符形式
  __updateAttr(k, v) {
    if(k == 'dangerouslySetInnerHTML') {
      if(v === null || v === void 0) {
        v = '';
      }
      this.element.innerHTML = util.stringify(v);
      return;
    }
    attr.update(this.name, this.element, k, v, this.__style);
    this.__cache[k] = v;
    //使用了jaw内联解析css
    if(this.__style) {
      this.__updateStyle();
    }
  }
  __match(first) {
    this.__inline = this.__cache.style || '';
    var p = this.parent;
    if(p instanceof VirtualDom || browser.lie && p && p.__migiVD) {
      this.__classes = p.__classes.slice();
      this.__ids = p.__ids.slice();
    }
    else {
      this.__classes = [];
      this.__ids = [];
    }
    var klass = (this.__cache['class'] || '').trim();
    if(klass) {
      klass = klass.split(/\s+/);
      sort(klass, function(a, b) {
        return a < b;
      });
      this.__classes.push('.' + klass.join('.'));
    }
    else {
      this.__classes.push('');
    }
    var id = (this.__cache.id || '').trim();
    if(id) {
      this.__ids.push('#' + id);
    }
    else {
      this.__ids.push('');
    }
    //TODO: css3伪类
    var matches = match(this.__names, this.__classes, this.__ids, this.__style, this, first);
    //本身的inline最高优先级追加到末尾
    return matches + this.__inline;
  }
  __updateStyle() {
    var s = this.__match();
    if(this.element.getAttribute('style') != s) {
      this.element.setAttribute('style', s);
    }
    this.children.forEach(function(child) {
      if(child instanceof VirtualDom || browser.lie && child && child.__migiVD) {
        child.__updateStyle();
      }
    });
  }

  __init(name, children) {
    var self = this;
    self.__selfClose = SELF_CLOSE.hasOwnProperty(name);
    childParent(children, this);
  }
  //@overwrite
  __reset(name, props = {}, children = []) {
    super.__reset(name, props, children);
    this.__init(name, children);
    this.__hasDes = false;
    return this;
  }
  __destroy() {
    this.__hash = {};
    this.__cache = {};
    this.__names = null;
    this.__classes = null;
    this.__ids = null;
    this.__inline = null;
    this.__hover = false;
    this.__active = false;
    this.__listener = null;
    this.__parent = null;
    this.__top = null;
    this.__dom = false;
    this.__style = null;
    this.__element = null;
    return this;
  }
}

var GS = {
  names: {
    get: function() {
      return this.__names || (this.__names = []);
    }
  },
  style: {
    get: function() {
      return this.__style;
    },
    set: function(v) {
      var self = this;
      self.__style = v;
      if(self.parent instanceof VirtualDom || browser.lie && self.parent && self.parent.__migiVD) {
        self.__names = self.parent.names.slice();
      }
      else {
        self.__names = [];
      }
      self.__names.push(self.name);
      self.children.forEach(function(child) {
        childStyle(child, v);
      });
    }
  }
};
if(!browser.lie) {
  Object.defineProperties(VirtualDom.prototype, GS);
}

//静态文本节点，包括空、undefined、null、空数组
function isEmptyText(item) {
  return item === void 0 || item === null || !item.toString();
}
function renderChild(child) {
  if(child instanceof Element || child instanceof Obj || browser.lie && child.__migiEL) {
    return child.toString();
  }
  if(Array.isArray(child)) {
    var res = '';
    child.forEach(function(item) {
      res += renderChild(item);
    });
    return res;
  }
  return util.encodeHtml(util.stringify(child));
}
function childParent(child, parent) {
  if(Array.isArray(child)) {
    child.forEach(function(item) {
      childParent(item, parent);
    });
  }
  else if(child instanceof Element || browser.lie && child && child.__migiEL) {
    child.__parent = parent;
  }
  else if(child instanceof Obj) {
    childParent(child.v, parent);
  }
}
function childStyle(child, style) {
  if(Array.isArray(child)) {
    child.forEach(function(item) {
      childStyle(item, style);
    });
  }
  else if(child instanceof VirtualDom || browser.lie && child && child.__migiVD) {
    child.style = style;
  }
  else if(child instanceof Obj) {
    childStyle(child.v, style);
  }
}

export default VirtualDom;