define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var Component=function(){var _2=require('./Component');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var Obj=function(){var _4=require('./Obj');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var Cb=function(){var _5=require('./Cb');return _5.hasOwnProperty("default")?_5["default"]:_5}();
var range=function(){var _6=require('./range');return _6.hasOwnProperty("default")?_6["default"]:_6}();
var match=function(){var _7=require('./match');return _7.hasOwnProperty("default")?_7["default"]:_7}();
var sort=function(){var _8=require('./sort');return _8.hasOwnProperty("default")?_8["default"]:_8}();
var domDiff=function(){var _9=require('./domDiff');return _9.hasOwnProperty("default")?_9["default"]:_9}();
var cachePool=function(){var _10=require('./cachePool');return _10.hasOwnProperty("default")?_10["default"]:_10}();
var type=function(){var _11=require('./type');return _11.hasOwnProperty("default")?_11["default"]:_11}();

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
  'track': true
};

var SPECIAL_PROP = {
  'checked': true,
  'selected': true,
  'selectedIndex': true,
  'readOnly': true,
  'multiple': true,
  'defaultValue': true,
  'autofocus': true,
  'async': true,
  'tagName': true,
  'nodeName': true,
  'nodeType': true
};

!function(){var _12=Object.create(Element.prototype);_12.constructor=VirtualDom;VirtualDom.prototype=_12}();
  function VirtualDom(name, props, children) {
    //fix循环依赖
    if(props===void 0)props={};if(children===void 0)children=[];if(Component.hasOwnProperty('default')) {
      Component = Component['default'];
    }
    //自闭合标签不能有children
    if(SELF_CLOSE.hasOwnProperty(name) && children.length) {
      throw new Error('self-close tag can not has chilren nodes: ' + name);
    }
    Element.call(this,name, props, children);
    var self = this;
    self.__cache = {};
    self.__names = null;
    self.__classes = null;
    self.__ids = null;
    self.__inline = null;
    self.__hover = false;
    self.__active = false;
    self.__init(name, children);
  }

  //@override
  VirtualDom.prototype.toString = function() {
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
    //input和select这种:input要侦听数据绑定
    if(self.name == 'input') {
      if(self.props.hasOwnProperty('value')) {
        var item = self.props.value;
        self.on(Event.DOM, function() {
          self.off(Event.DOM, arguments.callee);
          function cb() {
            item.v = this.value;
            var key = item.k;
            item.context[key] = this.value;
          }
          switch(self.__cache.type) {
            //一些无需联动
            case 'button':
            case 'hidden':
            case 'image':
            case 'file':
            case 'reset':
            case 'submit':
              break;
            //只需侦听change
            case 'checkbox':
            case 'radio':
            case 'range':
              self.element.addEventListener('change', cb);
              break;
            //其它无需change，但input等
            default:
              self.element.addEventListener('input', cb);
              self.element.addEventListener('paste', cb);
              self.element.addEventListener('cut', cb);
              break;
          }
        });
      }
    }
    else if(self.name == 'select') {
      if(self.props.hasOwnProperty('value')) {
        var item = self.props.value;
        self.on(Event.DOM, function() {
          self.off(Event.DOM, arguments.callee);
          function cb() {
            item.v = this.value;
            var key = item.k;
            item.context[key] = this.value;
          }
          self.element.addEventListener('change', cb);
        });
      }
    }
    //自闭合标签特殊处理
    if(self.__selfClose) {
      return res + '/>';
    }
    res += '>';
    //textarea的value在标签的childNodes里
    if(self.name == 'textarea') {
      self.children.forEach(function(child) {
        if(child instanceof Obj) {
          self.on(Event.DOM, function() {
            self.off(Event.DOM, arguments.callee);
            function cb(e) {
              child.v = this.value;
              var key = child.k;
              child.context[key] = this.value;
            }
            self.element.addEventListener('input', cb);
            self.element.addEventListener('paste', cb);
            self.element.addEventListener('cut', cb);
          });
        }
      });
    }
    //渲染children
    res += self.__renderChildren();
    res +='</' + self.name + '>';
    return res;
  }

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

  VirtualDom.prototype.__renderProp = function(prop) {
    var self = this;
    var v = self.props[prop];
    var res = '';
    //onXxx侦听处理
    if(/^on[A-Z]/.test(prop)) {
      self.on(Event.DOM, function() {
        self.off(Event.DOM, arguments.callee);
        var name = prop.slice(2).replace(/[A-Z]/g, function(up) {
          return up.toLowerCase();
        });
        self.element.addEventListener(name, function(event) {
          var item = self.props[prop];
          if(item instanceof Cb) {
            item.cb.call(item.context, event);
          }
          else {
            item(event);
          }
        });
      });
    }
    //Obj类型绑定处理
    else if(v instanceof Obj) {
      var s = v.toString();
      //特殊html不转义
      if(prop == 'dangerouslySetInnerHTML') {
        self.on(Event.DOM, function() {
          self.off(Event.DOM, arguments.callee);
          self.element.innerHTML = s;
        });
        return '';
      }
      self.__cache[prop] = s;
      if(!SPECIAL_PROP.hasOwnProperty(prop) || !!v.v) {
        res = ' ' + prop + '="' + util.encodeHtml(s, true) + '"';
      }
    }
    else {
      var s = Array.isArray(v) ? util.joinArray(v) : (v === void 0 || v === null ? '' : v.toString());
      if(prop == 'dangerouslySetInnerHTML') {
        self.on(Event.DOM, function() {
          self.off(Event.DOM, arguments.callee);
          self.element.innerHTML = s;
        });
        return '';
      }
      if(prop == 'className') {
        prop = 'class';
      }
      self.__cache[prop] = s;
      if(!SPECIAL_PROP.hasOwnProperty(prop) || !!v) {
        res = ' ' + prop + '="' + util.encodeHtml(s, true) + '"';
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
  VirtualDom.prototype.__renderChildren = function() {
    var self = this;
    var res = '';
    self.children.forEach(function(child) {
      res += VirtualDom.renderChild(child);
    });
    return res;
  }

  VirtualDom.prototype.find = function(name) {
    return this.findAll(name, true)[0];
  }
  VirtualDom.prototype.findAll = function(name, first) {
    var res = [];
    for(var i = 0, len = this.children.length; i < len; i++) {
      var child = this.children[i];
      if(child instanceof Element) {
        if(child instanceof Component) {
          //传入的可能是个class或者string
          if(child.name == name || util.isFunction(name) && child instanceof name) {
            res.push(child);
            if(first) {
              break;
            }
          }
        }
        else {
          if(child.name == name || util.isFunction(name) && child instanceof name) {
            res.push(child);
            if(first) {
              break;
            }
          }
          res = res.concat(child.findAll(name));
          if(first && res.length) {
            break;
          }
        }
      }
    }
    return res;
  }

  var _13={};_13.names={};_13.names.get =function() {
    return this.__names || (this.__names = []);
  }
  _13.style={};_13.style.set =function(v) {
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
      if(child instanceof VirtualDom) {
        child.style = v;
      }
    });
  }

  //@override
  VirtualDom.prototype.__onDom = function() {
    Element.prototype.__onDom.call(this);
    var self = this;
    //start标明真实DOM索引，因为相邻的文本会合并为一个text节点
    var option = { start: 0, first: true };
    for(var index = 0, len = self.children.length; index < len; index++) {
      var child = self.children[index];
      self.__domChild(child, index, len, option);
    }
    //可能最后一个是空白text，需特殊判断下插入
    if(option.empty) {
      self.__insertBlank(option);
    }
  }
  //index和i结合判断首个，因为child为数组时会展开，当child不是第1个时其展开项都有prev
  VirtualDom.prototype.__domChild = function(child, index, len, option, i) {
    var self = this;
    //防止空数组跳过逻辑，它被认为是个空字符串
    if(Array.isArray(child) && child.length) {
      child.forEach(function(item, i) {
        //第1个同时作为children的第1个要特殊处理
        self.__domChild(item, index, len, option, i);
      });
    }
    else if(child instanceof Element) {
      //前面的连续的空白节点需插入一个空TextNode
      if(option.empty) {
        self.__insertBlank(option);
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
      self.__domChild(child.v, index, len, option, i);
    }
    else if(VirtualDom.isEmptyText(child)) {
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
  VirtualDom.prototype.__insertBlank = function(option) {
    var blank = document.createTextNode('');
    var elem = this.element;
    var cns = elem.childNodes;
    //可能仅一个空文本节点，或最后一个空文本节点
    var length = cns.length;
    if(!length || option.start >= length) {
      elem.appendChild(blank);
    }
    //插入
    else {
      elem.insertBefore(blank, cns[option.start]);
    }
  }
  //@override
  VirtualDom.prototype.__onData = function(k) {
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
          var nv = item.cb.call(item.context);
          if(ov != nv) {
            item.v = nv;
            self.__updateAttr(key, nv);
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
      self.__checkObj(k, child, index, len, ranges, option, history);
    }
    range.merge(ranges);
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
  VirtualDom.prototype.__checkObj = function(k, child, index, len, ranges, option, history) {
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
      }
    }
    //递归通知，增加索引
    else if(child instanceof Element) {
      delete option.t2d;
      delete option.d2t;
      child.emit(Event.DATA, k);
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
          self.__checkObj(k, item, index, len, ranges, option, history);
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
  VirtualDom.prototype.__updateAttr = function(k, v) {
    if(k == 'dangerouslySetInnerHTML') {
      this.element.innerHTML = v || '';
      return;
    }
    switch(k) {
      case 'value':
        this.element[k] = v || '';
        break;
      case 'checked':
      case 'selected':
      case 'selectedIndex':
      case 'readOnly':
      case 'multiple':
      case 'defaultValue':
      case 'autofocus':
      case 'async':
      case 'tagName':
      case 'nodeName':
      case 'nodeType':
        this.element[k] = v || false;
        break;
      case 'className':
        k = 'class';
      case 'id':
      case 'class':
        if(this.__style) {
          if(v === null || v === void 0) {
            this.element.removeAttribute('migi-' + k);
          }
          else{
            this.element.setAttribute('migi-' + k, v);
          }
          break;
        }
      default:
        if(v === null || v === void 0) {
          this.element.removeAttribute(k);
        }
        else{
          this.element.setAttribute(k, v);
        }
        break;
    }
    this.__cache[k] = v;
    //使用了jaw内联解析css
    if(this.__style) {
      this.__updateStyle();
    }
  }
  VirtualDom.prototype.__match = function(first) {
    this.__inline = this.__cache.style || '';
    if(this.parent instanceof VirtualDom) {
      this.__classes = this.parent.__classes.slice();
      this.__ids = this.parent.__ids.slice();
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
  VirtualDom.prototype.__updateStyle = function() {
    var s = this.__match();
    if(this.element.getAttribute('style') != s) {
      this.element.setAttribute('style', s);
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
    children.forEach(function(child) {
      if(child instanceof Element) {
        child.__parent = self;
      }
    });
  }
  //@overwrite
  VirtualDom.prototype.__reset = function(name, props, children) {
    if(props===void 0)props={};if(children===void 0)children=[];Element.prototype.__reset.call(this,name, props, children);
    this.__init(name, children);
    this.__hasDes = false;
    return this;
  }
  VirtualDom.prototype.__destroy = function() {
    this.__cache = {};
    this.__names = null;
    this.__classes = null;
    this.__ids = null;
    this.__inline = null;
    this.__hover = false;
    this.__active = false;
    this.__hasDes = true;
    return this;
  }

  VirtualDom.isEmptyText=function(item) {
    //静态文本节点，包括空、undefined、null、空数组
    return item === void 0 || item === null || !item.toString();
  }
  VirtualDom.renderChild=function(child) {
    if(child === void 0 || child === null) {
      return '';
    }
    if(child instanceof Element) {
      return child.toString();
    }
    if(child instanceof Obj) {
      return child.toString();
    }
    if(Array.isArray(child)) {
      var res = '';
      child.forEach(function(item) {
        res += VirtualDom.renderChild(item);
      });
      return res;
    }
    return util.encodeHtml(child.toString());
  }
Object.keys(_13).forEach(function(k){Object.defineProperty(VirtualDom.prototype,k,_13[k])});Object.keys(Element).forEach(function(k){VirtualDom[k]=Element[k]});

exports["default"]=VirtualDom;});