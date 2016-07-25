define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var Component=function(){var _2=require('./Component');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var Obj=function(){var _4=require('./Obj');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var Cb=function(){var _5=require('./Cb');return _5.hasOwnProperty("default")?_5["default"]:_5}();
var range=function(){var _6=require('./range');return _6.hasOwnProperty("default")?_6["default"]:_6}();
var match=function(){var _7=require('./match');return _7.hasOwnProperty("default")?_7["default"]:_7}();
var domDiff=function(){var _8=require('./domDiff');return _8.hasOwnProperty("default")?_8["default"]:_8}();
var type=function(){var _9=require('./type');return _9.hasOwnProperty("default")?_9["default"]:_9}();
var fixEvent=function(){var _10=require('./fixEvent');return _10.hasOwnProperty("default")?_10["default"]:_10}();
var attr=function(){var _11=require('./attr');return _11.hasOwnProperty("default")?_11["default"]:_11}();
var hash=function(){var _12=require('./hash');return _12.hasOwnProperty("default")?_12["default"]:_12}();
var touch=function(){var _13=require('./touch');return _13.hasOwnProperty("default")?_13["default"]:_13}();
var delegate=function(){var _14=require('./delegate');return _14.hasOwnProperty("default")?_14["default"]:_14}();
var matchUtil=function(){var _15=require('./matchUtil');return _15.hasOwnProperty("default")?_15["default"]:_15}();

var SELF_CLOSE = {
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

var TOUCH = {
  'swipe': true,
  'swipeleft': true,
  'swiperight':true,
  'swipeup': true,
  'swipedown': true,
  'longtap': true,
  'doubletap': true
};

function convertSelector(selector) {
  if(selector instanceof Element) {
    return selector.name + '[migi-uid="' + selector.uid + '"]';
  }
  return selector.replace(/(^|\s|,|])([A-Z][\w$]*)\b/, '$1[migi-name="$2"]');
}

function find(name, children) {
  return findAll(name, children, true)[0] || null;
}
function findAll(name, children, first) {
  return __findAll(name, children, [], first);
}
function __findAll(name, children, res, first) {
  for(var i = 0, len = children.length; i < len; i++) {
    var child = children[i];
    if(child instanceof Element) {
      res = __findEq(name, child, res, first);
    }
    else if(child instanceof Obj) {
      child = child.v;
      if(Array.isArray(child)) {
        res = __findAll(name, child, res, first);
      }
      else if(child instanceof Element) {
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
  if(child instanceof Component) {
    if(child instanceof name) {
      res.push(child);
    }
  }
  //vd递归
  else {
    if(child instanceof name) {
      res.push(child);
      if(first) {
        return res;
      }
    }
    res = res.concat(child.findAll(name, first));
  }
  return res;
}

!function(){var _16=Object.create(Element.prototype);_16.constructor=VirtualDom;VirtualDom.prototype=_16}();
  function VirtualDom(name, props, children) {
    //fix循环依赖
    if(props===void 0)props=[];if(children===void 0)children=[];if(Component.hasOwnProperty('default')) {
      Component = Component['default'];
    }
    //自闭合标签不能有children
    if(SELF_CLOSE.hasOwnProperty(name) && children.length) {
      throw new Error('self-close tag can not has chilren: ' + name);
    }
    Element.call(this,name, props, children);

    var self = this;
    self.__names = null; //从Component根节点到自己的tagName列表，以便css计算
    self.__classes = null; //同上，class列表
    self.__ids = null; //同上，id列表
    self.__inline = null; //昏村本身props的style属性
    self.__hover = false; //是否处于鼠标hover状态
    self.__active = false; //是否处于鼠标active状态
    self.__listener = null; //添加的event的cb引用，remove时使用
    self.__init(name, children);
  }

  //@override
  VirtualDom.prototype.toString = function() {
    var self = this;
    var res = '<' + self.name;
    //处理属性
    self.__props.forEach(function(item) {
      var s = self.__renderProp(item[0], item[1]);
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

  //始终以缓存的props属性为准，哪怕更改了真实DOM的属性
  VirtualDom.prototype.isFirst = function(children) {
    //本身就是Component的唯一节点
    if(this.parent instanceof Component) {
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
      else if(child instanceof VirtualDom) {
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
  VirtualDom.prototype.isLast = function(children) {
    //本身就是Component的唯一节点
    if(this.parent instanceof Component) {
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
      else if(child instanceof VirtualDom) {
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
  VirtualDom.prototype.isEmpty = function() {
    return childEmpty(this.children);
  }
  VirtualDom.prototype.isEnabled = function() {
    return !this.__cache.disabled;
  }
  VirtualDom.prototype.isDisabled = function() {
    return this.__cache.disabled;
  }
  VirtualDom.prototype.isChecked = function() {
    return this.__cache.checked;
  }
  VirtualDom.prototype.prev = function() {
    var res = {};
    getPrev(this.parent.children, this, res, function(child) {
      res.prev = child;
    });
    return res.prev;
  }
  VirtualDom.prototype.prevAll = function(sel) {
    var res = {
      prev: []
    };
    getPrev(this.parent.children, this, res, function(child) {
      if(sel && !matchUtil.nci(sel, child) || !sel) {
        res.prev.push(child);
      }
    });
    return res.prev;
  }
  VirtualDom.prototype.next = function() {
    var res = {};
    getNext(this.parent.children, this, res, function(child) {
      res.next = child;
      res.done = true;
    });
    return res.next;
  }
  VirtualDom.prototype.nextAll = function(sel) {
    var res = {
      next: []
    };
    getNext(this.parent.children, this, res, function(child) {
      if(sel && !matchUtil.nci(sel, child) || !sel) {
        res.next.push(child);
      }
    });
    return res.next;
  }
  VirtualDom.prototype.isOnly = function() {
    return this.siblings().length == 1;
  }
  VirtualDom.prototype.isOnlyOfType = function(sel) {
    var self = this;
    var all = self.siblings();
    for(var i = 0, len = all.length; i < len; i++) {
      var item = all[i];
      if(item != self && !matchUtil.nci(sel, item)) {
        return false;
      }
    }
    return true;
  }
  VirtualDom.prototype.isFirstOfType = function(sel) {
    var prevAll = this.prevAll(sel);
    for(var i = 0, len = prevAll.length; i < len; i++) {
      if(!matchUtil.nci(sel, prevAll[i])) {
        return false;
      }
    }
    return true;
  }
  VirtualDom.prototype.isLastOfType = function(sel) {
    var nextAll = this.nextAll(sel);
    for(var i = 0, len = nextAll.length; i < len; i++) {
      if(!matchUtil.nci(sel, nextAll[i])) {
        return false;
      }
    }
    return true;
  }
  VirtualDom.prototype.siblings = function() {
    var parent = this.parent;
    var all = allChildren(parent.children);
    return all;
  }
  VirtualDom.prototype.getIdx = function(reverse) {
    var siblings = this.siblings();
    var i = siblings.indexOf(this);
    if(i > -1) {
      return reverse ? siblings.length - i - 1 : i;
    }
    return -1;
  }
  VirtualDom.prototype.getIdxOfType = function(sel, reverse) {
    var siblings = reverse ? this.nextAll(sel) : this.prevAll(sel);
    if(reverse) {
      siblings.unshift(this);
    }
    else {
      siblings.push(this);
    }
    var i = siblings.indexOf(this);
    if(i > -1) {
      return reverse ? siblings.length - i - 1 : i;
    }
    return -1;
  }

  VirtualDom.prototype.__renderProp = function(k, v) {
    var self = this;
    var res = '';
    //onxxx侦听处理
    if(/^on[a-zA-Z]/.test(k)) {
      self.once(Event.DOM, function(fake) {
        //防止fake未真实添加DOM
        if(fake) {
          return;
        }
        var name = k.slice(2).toLowerCase();
        self.__addListener(name, function(e) {
          fixEvent(e);
          var target = e.target;
          var uid = target.getAttribute('migi-uid');
          var tvd = hash.get(uid);
          if(v instanceof Cb) {
            v.cb.call(v.context, e, self, tvd);
          }
          else if(util.isFunction(v)) {
            v(e, self, tvd);
          }
          else if(Array.isArray(v)) {
            v.forEach(function(item) {
              var cb = item[1];
              var res = delegate(e, item[0], self);
              if(res[0]) {
                if(cb instanceof Cb) {
                  cb.cb.call(cb.context, e, self, res[1], tvd);
                }
                else if(util.isFunction(cb)) {
                  cb(e, self, res[1], tvd);
                }
              }
            });
          }
        });
      });
    }
    //Obj类型绑定处理
    else if(v instanceof Obj) {
      var s = v.toString(true);
      //特殊html不转义
      if(k == 'dangerouslySetInnerHTML') {
        self.once(Event.DOM, function() {
          self.element.innerHTML = s;
        });
        return '';
      }
      if(k == 'className') {
        k = 'class';
      }
      else if(k == 'htmlFor') {
        k = 'for';
      }
      self.__cache[k] = s;
      //特殊属性根据类型输出或是在DOM后设置prop
      var special = attr.special(self.name, k);
      switch(special) {
        case attr.RENDER_EXIST:
          if(v.v) {
            res = ' ' + k + '="' + s + '"';
          }
          break;
        case attr.RENDER_DOM:
          self.once(Event.DOM, function() {
            self.__updateAttr(k, v);
          });
          break;
        default:
          res = ' ' + k + '="' + s + '"';
          break;
      }
    }
    else {
      var s = Array.isArray(v) ? util.joinArray(v) : util.stringify(v);
      if(k == 'dangerouslySetInnerHTML') {
        self.once(Event.DOM, function() {
          self.element.innerHTML = s;
        });
        return '';
      }
      if(k == 'className') {
        k = 'class';
      }
      else if(k == 'htmlFor') {
        k = 'for';
      }
      self.__cache[k] = s;
      //特殊属性根据类型输出或是在DOM后设置prop
      var special = attr.special(self.name, k);
      switch(special) {
        case attr.RENDER_EXIST:
          if(v) {
            res = ' ' + k + '="' + util.encodeHtml(s, true) + '"';
          }
          break;
        case attr.RENDER_DOM:
          self.once(Event.DOM, function() {
            self.__updateAttr(k, v);
          });
          break;
        default:
          res = ' ' + k + '="' + util.encodeHtml(s, true) + '"';
          break;
      }
    }
    //使用jaw导入样式时不输出class和id，以migi-class和migi-id取代之
    if(self.__style) {
      switch(k) {
        case 'class':
        case 'id':
          res = ' ' + 'migi-' + res.slice(1);
          break;
      }
    }
    return res;
  }
  VirtualDom.prototype.__renderChildren = function() {
    var self = this;
    var res = '';
    self.children.forEach(function(child) {
      res += renderChild(child);
    });
    return res;
  }
  VirtualDom.prototype.__checkListener = function() {
    var self = this;
    if(self.name == 'input') {
      if(self.props.hasOwnProperty('value')) {
        var item = self.props.value;
        if(item instanceof Obj) {
          self.once(Event.DOM, function() {
            function cb(e) {
              fixEvent(e);
              var v = e.target.value;
              item.setV(v);
              var key = item.k;
              if(key.indexOf('model.') == 0) {
                item.context.model[key.slice(6)] = v;
              }
              else {
                item.context[key] = v;
              }
            }
            var type = self.__cache.type || '';
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
              fixEvent(e);
              var v = e.target.value;
              item.setV(v);
              var key = item.k;
              if(key.indexOf('model.') == 0) {
                item.context.model[key.slice(6)] = v;
              }
              else {
                item.context[key] = v;
              }
            }
            self.__addListener('change', cb);
          });
        }
      }
    }
    //textarea的value在标签的childNodes里，这里只处理单一child情况
    //children有多个其中一个是text有歧义，忽视
    else if(self.name == 'textarea') {
      if(self.children.length == 1) {
        var child = self.children[0];
        if(child instanceof Obj) {
          self.once(Event.DOM, function() {
            function cb(e) {
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
  VirtualDom.prototype.__addListener = function(name, cb) {
    var self = this;
    if(Array.isArray(name)) {
      name.forEach(function(n) {
        self.__addListener(n, cb);
      });
    }
    else {
      //一般没有event，也就不生成对象防止diff比对
      self.__listener = self.__listener || [];
      if(name == 'tap') {
        name = 'click';
      }
      var elem = self.element;
      //touch特殊对待
      if(TOUCH.hasOwnProperty(name)) {
        touch(this, name, cb, self.__listener);
        return;
      }
      //记录下来留待清除
      self.__listener.push([name, cb]);
      elem.addEventListener(name, cb);
    }
  }
  VirtualDom.prototype.__removeListener = function() {
    var self = this;
    if(self.__listener) {
      var elem = self.element;
      self.__listener.forEach(function(arr) {
        elem.removeEventListener(arr[0], arr[1]);
      });
    }
  }

  VirtualDom.prototype.find = function(selector) {
    if(util.isFunction(selector)) {
      return find(selector, this.children);
    }
    if(this.element) {
      var node = this.element.querySelector(convertSelector(selector));
      var uid = node.getAttribute('migi-uid');
      return hash.get(uid) || null;
    }
    return null;
  }
  VirtualDom.prototype.findAll = function(selector) {
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
            res.push(vd);
          }
        }
      });
    }
    return res;
  }

  //@override
  VirtualDom.prototype.__onDom = function(fake) {
    Element.prototype.__onDom.call(this);
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
  VirtualDom.prototype.__domChild = function(child, index, len, option) {
    var self = this;
    //防止空数组跳过逻辑，它被认为是个空字符串
    if(Array.isArray(child) && child.length) {
      child.forEach(function(item) {
        self.__domChild(item, index, len, option);
      });
    }
    else if(child instanceof Element && !(child instanceof migi.NonVisualComponent)) {
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
      if(child instanceof migi.NonVisualComponent) {
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
  VirtualDom.prototype.__insertBlank = function(start) {
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
  VirtualDom.prototype.__onData = function(k) {
    var self = this;
    //尚未添加到dom时无效
    if(!self.dom) {
      return;
    }
    //联动属性值
    self.__props.forEach(function(item) {
      var key = item[0];
      item = item[1];
      if(item instanceof Obj) {
        var change = false;
        var vk = Array.isArray(k) ? 1: 0;
        var ok = Array.isArray(item.k) ? 2 : 0;
        switch(vk + ok) {
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
            k.forEach(function(item) {
              hash[item] = true;
            });
            for(var temp = item.k, i = 0, len = temp.length; i < len; i++) {
              if(hash.hasOwnProperty(temp[i])) {
                change = true;
                break;
              }
            }
            break;
        }
        if(change) {
          var ov = item.v;
          if(item.update(ov)) {
            self.__updateAttr(key, item.v);
          }
        }
      }
    });
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
  //option.first标明是否第一个，因为child为数组时会展开，当child不是第1个时其展开项都有prev
  VirtualDom.prototype.__checkObj = function(k, child, ranges, option, history) {
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
          domDiff.diff(this.element, ov, child.v, ranges, option, history, this);
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
    else if(child instanceof Element) {
      delete option.t2d;
      delete option.d2t;
      if(child instanceof VirtualDom) {
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
  VirtualDom.prototype.__updateAttr = function(k, v) {
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
  VirtualDom.prototype.__match = function(first) {
    this.__inline = this.__cache.style || '';
    //预处理class和id，class分为数组形式，id判断#开头
    this.__initCI();
    var matches = match(this.__names, this.__classes, this.__ids, this.__style || { default:{} }, this, first);
    //本身的inline最高优先级追加到末尾
    return matches + this.__inline;
  }
  VirtualDom.prototype.__initCI = function() {
    var p = this.parent;
    if(p instanceof VirtualDom) {
      this.__classes = p.__classes.slice();
      this.__ids = p.__ids.slice();
    }
    else {
      this.__classes = [];
      this.__ids = [];
    }
    //预处理class和id，class分为数组形式，id判断#开头
    this.__classes.push(matchUtil.splitClass(this.__cache['class']));
    this.__ids.push(matchUtil.preId(this.__cache.id));
  }
  VirtualDom.prototype.__updateStyle = function(first) {
    var s = this.__match(first);
    if(this.element.getAttribute('style') != s) {
      this.element.setAttribute('style', s);
    }
    //diff调用初始化nvd时自上而下，忽略children
    if(first) {
      return;
    }
    this.children.forEach(function(child) {
      if(child instanceof VirtualDom) {
        child.__updateStyle();
      }
    });
  }

  VirtualDom.prototype.__init = function(name, children) {
    var self = this;
    self.__selfClose = SELF_CLOSE.hasOwnProperty(name);
    childParent(children, self);
  }
  //@overwrite
  VirtualDom.prototype.__reset = function(name, props, children) {
    if(props===void 0)props=[];if(children===void 0)children=[];Element.prototype.__reset.call(this,name, props, children);
    this.__init(name, children);
    this.__hasDes = false;
    return this;
  }
  VirtualDom.prototype.__destroy = function() {
    if(this.__onHover || this.__outHover) {
      if(this.element) {
        this.element.removeEventListener('mouseenter', this.__onHover);
        this.element.removeEventListener('mouseleave', this.__outHover);
      }
    }
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

  var _17={};_17.names={};_17.names.get =function() {
    return this.__names || (this.__names = []);
  }
  _17.element={};_17.element.get =function() {
    return this.__element || (this.__element = document.querySelector(this.name + '[migi-uid="' + this.uid + '"]'));
  }
  _17.style={};_17.style.get =function() {
    return this.__style;
  }
  _17.style.set =function(v) {
    var self = this;
    self.__style = v;
    if(self.parent instanceof VirtualDom) {
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
Object.keys(_17).forEach(function(k){Object.defineProperty(VirtualDom.prototype,k,_17[k])});Object.keys(Element).forEach(function(k){VirtualDom[k]=Element[k]});

//静态文本节点，包括空、undefined、null、空数组
function isEmptyText(item) {
  return item === void 0 || item === null || !item.toString();
}
function renderChild(child) {
  if(child instanceof Element || child instanceof Obj) {
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
  else if(child instanceof Element) {
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
  else if(child instanceof VirtualDom) {
    child.style = style;
  }
  else if(child instanceof Obj) {
    childStyle(child.v, style);
  }
}
function childEmpty(child) {
  var res = true;
  if(Array.isArray(child)) {
    for(var i = 0, len = child.length; i < len; i++) {
      res = childEmpty(child[i]);
      if(!res) {
        break;
      }
    }
  }
  else if(child instanceof Element) {
    res = false;
  }
  else if(child instanceof Obj) {
    res = childEmpty(child.v);
  }
  else {
    res = isEmptyText(child);
  }
  return res;
}
function getPrev(child, target, res, cb) {
  if(Array.isArray(child)) {
    for(var i = 0, len = child.length; i < len; i++) {
      getPrev(child[i], target, res, cb);
      if(res.done) {
        break;
      }
    }
  }
  else if(child instanceof Element) {
    if(target == child) {
      res.done = true;
      return;
    }
    cb(child);
  }
  else if(child instanceof Obj) {
    getPrev(child.v, target, res, cb);
  }
}
function getNext(child, target, res, cb) {
  if(Array.isArray(child)) {
    for(var i = 0, len = child.length; i < len; i++) {
      getNext(child[i], target, res, cb);
      if(res.done) {
        break;
      }
    }
  }
  else if(child instanceof Element) {
    if(target == child) {
      res.start = true;
    }
    else if(res.start) {
      cb(child);
    }
  }
  else if(child instanceof Obj) {
    getNext(child.v, target, res, cb);
  }
}
function allChildren(child, res) {
  if(res===void 0)res=[];if(Array.isArray(child)) {
    for(var i = 0, len = child.length; i < len; i++) {
      allChildren(child[i], res);
    }
  }
  else if(child instanceof Element) {
    res.push(child);
  }
  else if(child instanceof Obj) {
    allChildren(child.v, res);
  }
  return res;
}

exports["default"]=VirtualDom;
});