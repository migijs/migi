define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("Component")?_1.Component:_1.hasOwnProperty("default")?_1.default:_1}();
var util=function(){var _2=require('./util');return _2.hasOwnProperty("util")?_2.util:_2.hasOwnProperty("default")?_2.default:_2}();
var Obj=function(){var _3=require('./Obj');return _3.hasOwnProperty("Obj")?_3.Obj:_3.hasOwnProperty("default")?_3.default:_3}();
var Cb=function(){var _4=require('./Cb');return _4.hasOwnProperty("Cb")?_4.Cb:_4.hasOwnProperty("default")?_4.default:_4}();

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

!function(){var _5=Object.create(Event.prototype);_5.constructor=VirtualDom;VirtualDom.prototype=_5}();
  function VirtualDom(name, props, children) {
    //fix循环依赖
    if(props===void 0)props={};children=[].slice.call(arguments, 2);if(Component.hasOwnProperty('default')) {
      Component = Component.default;
    }
    //自闭合标签不能有children
    if(SELF_CLOSE.hasOwnProperty(name) && children.length) {
      throw new Error('self-close tag can not has chilren nodes: ' + name);
    }
    Event.call(this);
    var self = this;
    self.__name = name;
    self.__props = props;
    self.__children = children;
    children.forEach(function(child) {
      child.__parent = self;
    });
    self.__parent = null;
    self.__id = util.uid();
    self.__element = null;
    self.__selfClose = SELF_CLOSE.hasOwnProperty(name);

    self.on(Event.DOM, self.__onDom);
    self.on(Event.DATA, self.__onData);
  }
  VirtualDom.prototype.find = function(name) {
    return this.findAll(name)[0];
  }
  VirtualDom.prototype.findAll = function(name) {
    var res = [];
    for(var i = 0, len = this.children.length; i < len; i++) {
      var child = this.children[i];
      if(child instanceof Component) {
        if(child.name == name) {
          res.push(child);
        }
      }
      else if(child instanceof VirtualDom) {
        if(child.name == name) {
          res.push(child);
          res = res.concat(child.findAll(name));
        }
      }
    }
    return res;
  }
  VirtualDom.prototype.toString = function() {
    var self = this;
    var res = '<' + self.name;
    Object.keys(self.props).forEach(function(prop) {
      if(/^on[A-Z]/.test(prop)) {
        self.on(Event.DOM, function() {
          var name = prop.slice(2).replace(/[A-Z]/g, function(Up) {
            return Up.toLowerCase();
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
      else {
        res += self.__renderProp(prop);
      }
    });
    res += ' migi-id="' + self.id + '"';
    //自闭合标签特殊处理
    if(self.__selfClose) {
      return res + '/>';
    }
    res += '>';
    if(self.name == 'textarea') {
      self.children.forEach(function(child) {
        if(child instanceof Obj) {
          self.on(Event.DOM, function() {
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
    self.children.forEach(function(child) {
      res += self.__renderChild(child);
    });
    res +='</' + self.name + '>';
    return res;
  }
  VirtualDom.prototype.__renderProp = function(prop) {
    var self = this;
    var v = self.props[prop];
    if(prop == 'value' && self.name == 'input' && self.props[prop] instanceof Obj) {
      var item = self.props[prop];
      self.on(Event.DOM, function() {
        function cb() {
          item.v = this.value;
          var key = item.k;
          item.context[key] = this.value;
        }
        self.element.addEventListener('input', cb);
        self.element.addEventListener('paste', cb);
        self.element.addEventListener('cut', cb);
      });
    }
    if(v instanceof Obj) {
      if(util.isString(v.v)) {
        return ' ' + prop + '="' + v.toString() + '"';
      }
      else if(!!v.v) {
        return ' ' + prop;
      }
    }
    else {
      return ' ' + prop + '="' + v.toString() + '"';
    }
  }
  VirtualDom.prototype.__renderChild = function(child, unEscape) {
    var self = this;
    if(child instanceof VirtualDom || child instanceof Obj || child instanceof Component) {
      return child.toString(unEscape);
    }
    else if(Array.isArray(child)) {
      var res = '';
      child.forEach(function(item) {
        res += self.__renderChild(item, unEscape);
      });
      return res;
    }
    else {
      //TODO: 空变量
      //TODO: encode/decode
      return unEscape ? child.toString() : util.escape(child.toString());
    }
  }
  VirtualDom.prototype.__reRender = function() {
    var self = this;
    var res = '';
    self.children.forEach(function(child) {
      res += self.__renderChild(child);
    });
    self.element.innerHTML = res;
    //重新触发DOM
    self.__childrenDom();
  }

  VirtualDom.prototype.inTo = function(dom) {
    var s = this.toString();
    if(util.isString(dom)) {
      document.querySelector(dom).innerHTML = s;
    }
    else if(dom) {
      dom.innerHTML = s;
    }
  }

  var _6={};_6.name={};_6.name.get =function() {
    return this.__name;
  }
  _6.props={};_6.props.get =function() {
    return this.__props;
  }
  _6.children={};_6.children.get =function() {
    return this.__children;
  }
  _6.element={};_6.element.get =function() {
    return this.__element;
  }
  _6.parent={};_6.parent.get =function() {
    return this.__parent;
  }
  _6.id={};_6.id.get =function() {
    return this.__id;
  }

  VirtualDom.prototype.__onDom = function() {
    this.__element = document.body.querySelector('[migi-id="' + this.id + '"]');
    this.__childrenDom();
  }
  VirtualDom.prototype.__childrenDom = function() {
    var self = this;
    var length = self.children.length;
    self.children.forEach(function(child, index) {
      if(child instanceof VirtualDom || child instanceof Component) {
        child.emit(Event.DOM);
      }
      //初始化时插入空文本的占位节点，更新时方便索引，包括动态文本和静态文本
      else if(child instanceof Obj && child.type == Obj.TEXT && child.empty || !child.toString()) {
        //前后如有非空文本节点，无需插入
        if(index) {
          for(var i = index - 1; i >=0; i--) {
            var prev = self.children[i];
            if(!(prev instanceof VirtualDom) && !(prev instanceof Component)) {
              if(prev instanceof Obj) {
                if(prev.type == Obj.TEXT && !prev.empty) {
                  return;
                }
              }
              else if(!!prev.toString()) {
                return;
              }
            }
            else {
              break;
            }
          }
        }
        for(var i = index + 1; i < length; i++) {
          var next = self.children[i];
          if(!(next instanceof VirtualDom) && !(next instanceof Component)) {
            if(next instanceof Obj) {
              if(next.type == Obj.TEXT && !next.empty) {
                return;
              }
            }
            else if(!!next.toString()) {
              return;
            }
          }
          else {
            break;
          }
        }
        var blank = document.createTextNode('');
        //可能仅一个空文本节点，或最后一个空文本节点
        if(!self.element.childNodes.length || index >= self.element.length) {
          self.element.appendChild(blank);
        }
        //插入
        else {
          self.element.insertBefore(blank, self.element.childNodes[index]);
        }
      }
    });
  }
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
    //利用索引更新，子节点可能为文本、Component、VirtualDom，以及混合的数组
    //其中只有文本节点需要自己更新，记录其索引，组件和VirtualDom递归通知更新
    //由于渲染时相邻的文本变量和String文本同为一个文本节点，因此start为真实DOM的索引
    //当文本节点时start不更新
    //混合类型时取Obj的count，且需判断混合类型的first和last类型，及为文本时是否为空
    var start = 0;
    var range = [];
    //第一个特殊处理
    var first = self.children[0];
    if(first instanceof Obj) {
      switch(first.type) {
        case Obj.VIRTUALDOM:
        case Obj.COMPONENT:
          start = first.count;
          break;
      }
      var change = false;
      if(Array.isArray(first.k)) {
        change = first.k.indexOf(k) > -1;
      }
      else if(k == first.k) {
        change = true;
      }
      //当可能发生变化时进行比对
      var ot = first.type;
      if(change && self.__updateChild(first)) {
        //类型一旦发生变化，或者变化前后类型为VIRTUAlDOM或COMPLEX，直接父层重绘
        if(ot != first.type || first.type != Obj.TEXT) {
          self.__reRender();
          return;
        }
        //记录真实索引和child索引
        range.push({ start:start, index: 0 });
      }
    }
    else if(first instanceof VirtualDom || first instanceof Component) {
      first.emit(Event.DATA, k);
      start++;
    }
    for(var index = 1, len = self.children.length; index < len; index++) {
      var child = self.children[index];
      var prev = self.children[index - 1];
      if(child instanceof Obj) {
        var ot = child.type;
        //当Component和VirtualDom则++，且前面是非空文本节点时再++，因为有2个节点
        if(ot == Obj.VIRTUALDOM || ot == Obj.COMPONENT) {
          start++;
          //静态文本节点
          if(!prev instanceof VirtualDom && !prev instanceof Component) {
            start++;
          }
          //动态文本节点
          else if(prev instanceof Obj && prev.type == Obj.TEXT) {
            start++;
          }
        }
        var change = false;
        if(Array.isArray(child.k)) {
          change = child.k.indexOf(k) > -1;
        }
        else if(k == child.k) {
          change = true;
        }
        //当可能发生变化时进行比对
        if(change && self.__updateChild(child)) {
          //类型一旦发生变化，或者变化前后类型为VIRTUAlDOM或COMPLEX，直接父层重绘
          if(ot != child.type || child.type != Obj.TEXT) {
            self.__reRender();
            return;
          }
          //记录真实索引和child索引
          range.push({ start:start, index:index });
        }
      }
      //递归通知，增加索引
      else if(child instanceof VirtualDom) {
        child.emit(Event.DATA, k);
        start++;
        //静态文本节点
        if(!prev instanceof VirtualDom && !prev instanceof Component) {
          start++;
        }
        //动态文本节点
        else if(prev instanceof Obj && prev.type == Obj.TEXT) {
          start++;
        }
      }
      //else其它情况为普通静态文本节点忽略
    }
    if(range.length && self.element) {
      //相邻的TEXT节点合并更新
      self.__merge(range);
      range.forEach(function(item, index) {
        //利用虚拟索引向前向后找文本节点，拼接后更新到真实索引上
        for(var first = item.index; first > 0; first--) {
          var prev = self.children[first - 1];
          if(!util.isString(prev)
            && (!prev instanceof Obj
              || prev.type != Obj.TEXT)) {
            break;
          }
        }
        for(var last = item.index, len = self.children.length; last < len - 1; last++) {
          var next = self.children[last + 1];
          if(!util.isString(next)
            && (!next instanceof Obj
              || next.type != Obj.TEXT)) {
            break;
          }
        }
        var res = '';
        for(var i = first; i <= last; i++) {
          res += self.__renderChild(self.children[i]);
        }
        var textNode = self.element.childNodes[item.start];
        var now = textNode.textContent;
        if(res != now) {
          textNode.textContent = res;
        }
      });
    }
  }
  VirtualDom.prototype.__updateChild = function(child) {
    var ov = child.v;
    var nv = child.cb.call(child.context);
    if(!util.equal(ov, nv)) {
      child.v = nv;
      return true;
    }
    return false;
  }
  VirtualDom.prototype.__updateAttr = function(k, v) {
    switch(k) {
      case 'value':
      case 'checked':
      case 'selected':
        this.element[k] = v;
        break;
      case 'class':
        this.element.className = v;
      default:
        this.element.setAttribute(k, v);
    }
  }
  VirtualDom.prototype.__merge = function(range) {
    //合并相邻更新的文本节点
    for(var i = 0, len = range.length; i < len; i++) {
      var now = range[i];
      var next = range[i + 1];
      if(next && now.start == next.start) {
        range.splice(i, 1);
        i--;
      }
    }
  }
Object.keys(_6).forEach(function(k){Object.defineProperty(VirtualDom.prototype,k,_6[k])});Object.keys(Event).forEach(function(k){VirtualDom[k]=Event[k]});

exports.default=VirtualDom;});