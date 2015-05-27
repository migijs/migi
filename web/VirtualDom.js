define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("Element")?_1.Element:_1.hasOwnProperty("default")?_1.default:_1}();
var Component=function(){var _2=require('./Component');return _2.hasOwnProperty("Component")?_2.Component:_2.hasOwnProperty("default")?_2.default:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("util")?_3.util:_3.hasOwnProperty("default")?_3.default:_3}();
var Obj=function(){var _4=require('./Obj');return _4.hasOwnProperty("Obj")?_4.Obj:_4.hasOwnProperty("default")?_4.default:_4}();
var Cb=function(){var _5=require('./Cb');return _5.hasOwnProperty("Cb")?_5.Cb:_5.hasOwnProperty("default")?_5.default:_5}();
var match=function(){var _6=require('./match');return _6.hasOwnProperty("match")?_6.match:_6.hasOwnProperty("default")?_6.default:_6}();
var sort=function(){var _7=require('./sort');return _7.hasOwnProperty("sort")?_7.sort:_7.hasOwnProperty("default")?_7.default:_7}();

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

!function(){var _8=Object.create(Element.prototype);_8.constructor=VirtualDom;VirtualDom.prototype=_8}();
  function VirtualDom(name, props, children) {
    //fix循环依赖
    if(props===void 0)props={};children=[].slice.call(arguments, 2);if(Component.hasOwnProperty('default')) {
      Component = Component['default'];
    }
    //自闭合标签不能有children
    if(SELF_CLOSE.hasOwnProperty(name) && children.length) {
      throw new Error('self-close tag can not has chilren nodes: ' + name);
    }
    Element.apply(this,[name,props].concat(Array.from(children)));
    var self = this;
    self.__cache = {};
    self.__names = [];
    self.__classes = null;
    self.__ids = null;
    self.__inline = null;
    self.__selfClose = SELF_CLOSE.hasOwnProperty(name);
    self.__hover = false;
    self.__active = false;
    children.forEach(function(child) {
      child.__parent = self;
    });
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
        var s = self.__renderProp(prop);
        //使用jaw导入样式时不输出class属性
        if(self.__style) {
          switch(prop) {
            case 'class':
            case 'id':
              s = ' ' + 'migi-' + s.slice(1);
              break;
          }
        }
        res += s;
      }
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
        var s = v.toString();
        if(self.__style) {
          self.__cache[prop] = s;
        }
        return ' ' + prop + '="' + s + '"';
      }
      else if(!!v.v) {
        if(self.__style) {
          self.__cache[prop] = s;
        }
        return ' ' + prop;
      }
    }
    else {
      var s = v.toString();
      if(self.__style) {
        self.__cache[prop] = s;
      }
      return ' ' + prop + '="' + s + '"';
    }
  }
  VirtualDom.prototype.__renderChild = function(child, unEscape) {
    var self = this;
    if(child instanceof Element || child instanceof Obj) {
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
    self.__onDom();
  }

  var _9={};_9.element={};_9.element.get =function() {
    this.__element = this.__element || document.querySelector('[migi-uid="' + this.uid + '"]');
    return this.__element;
  }
  _9.names={};_9.names.get =function() {
    return this.__names;
  }
  _9.style={};_9.style.set =function(v) {
    var self = this;
    self.__style = v;
    if(self.parent instanceof VirtualDom) {
      self.__names = self.parent.names.slice(0);
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

  VirtualDom.prototype.__onDom = function() {
    Element.prototype.__onDom.call(this);
    var self = this;
    var length = self.children.length;
    self.children.forEach(function(child, index) {
      if(child instanceof Element) {
        child.emit(Event.DOM);
      }
      //初始化时插入空文本的占位节点，更新时方便索引，包括动态文本和静态文本
      else if(child instanceof Obj && child.type == Obj.TEXT && child.empty || !child.toString()) {
        //前后如有非空文本节点，无需插入
        if(index) {
          for(var i = index - 1; i >=0; i--) {
            var prev = self.children[i];
            if(!(prev instanceof Element)) {
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
          if(!(next instanceof Element)) {
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
        case Obj.ELEMENT:
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
    else if(first instanceof Element) {
      first.emit(Event.DATA, k);
      start++;
    }
    for(var index = 1, len = self.children.length; index < len; index++) {
      var child = self.children[index];
      var prev = self.children[index - 1];
      if(child instanceof Obj) {
        var ot = child.type;
        //当Component和VirtualDom则++，且前面是非空文本节点时再++，因为有2个节点
        if(ot == Obj.ELEMENT) {
          start++;
          //静态文本节点
          if(!(prev instanceof Element)) {
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
        if(!(prev instanceof Element)) {
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
        //使用了jaw内联解析css
        if(this.__style) {
          this.__cache[k] = v;
          this.__updateStyle();
        }
        break;
      case 'id':
      case 'class':
        if(this.__style) {
          this.element.setAttribute('migi-' + k, v);
          this.__cache[k] = v;
          this.__updateStyle();
          break;
        }
      default:
        this.element.setAttribute(k, v);
        if(this.__style) {
          this.__cache[k] = v;
          this.__updateStyle();
        }
        break;
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
  VirtualDom.prototype.__match = function(first) {
    this.__inline = this.__cache.style || '';
    if(this.parent instanceof VirtualDom) {
      this.__classes = this.parent.__classes.slice(0);
      this.__ids = this.parent.__ids.slice(0);
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
      this.__ids.push(id);
    }
    else {
      this.__ids.push('');
    }
    //TODO: 属性、伪类
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
Object.keys(_9).forEach(function(k){Object.defineProperty(VirtualDom.prototype,k,_9[k])});Object.keys(Element).forEach(function(k){VirtualDom[k]=Element[k]});

exports.default=VirtualDom;});