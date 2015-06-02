import Event from './Event';
import Element from './Element';
import Component from './Component';
import util from './util';
import Obj from './Obj';
import Cb from './Cb';
import match from './match';
import sort from './sort';

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
  'track': true
};

const TEMP_NODE = document.createElement('div');

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
    self.__cache = {};
    self.__names = [];
    self.__classes = null;
    self.__ids = null;
    self.__inline = null;
    self.__selfClose = SELF_CLOSE.hasOwnProperty(name);
    self.__hover = false;
    self.__active = false;
    children.forEach(function(child) {
      if(child !== void 0) {
        child.__parent = self;
      }
    });
  }

  toString() {
    var self = this;
    var res = '<' + self.name;
    Object.keys(self.props).forEach(function(prop) {
      if(/^on[A-Z]/.test(prop)) {
        self.on(Event.DOM, function() {
          self.off(Event.DOM, arguments.callee);
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
        //使用jaw导入样式时不输出class和id，以migi-class和migi-id取代之
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
      if(self.props.hasOwnProperty('value')){
        var item = self.props.value;
        self.on(Event.DOM, function(){
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
            self.on(Event.DOM, arguments.callee);
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
    self.children.forEach(function(child) {
      res += self.__renderChild(child);
    });
    res +='</' + self.name + '>';
    return res;
  }

  isFirst() {
    //本身就是Component的唯一节点
    if(this.parent instanceof Component) {
      return true;
    }
    var children = this.parent.children;
    for(var i = 0, len = children.length; i < len; i++) {
      var child = children[i];
      if(child == this) {
        return true;
      }
      else if(child instanceof VirtualDom) {
        return false;
      }
      else if(child instanceof Obj && child.type == Obj.ELEMENT) {
        return false;
      }
    }
  }
  isLast() {
    //本身就是Component的唯一节点
    if(this.parent instanceof Component) {
      return true;
    }
    var children = this.parent.children;
    for(var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      if(child == this) {
        return true;
      }
      else if(child instanceof VirtualDom) {
        return false;
      }
      else if(child instanceof Obj && child.type == Obj.ELEMENT) {
        return false;
      }
    }
  }

  __renderProp(prop) {
    var self = this;
    var v = self.props[prop];
    if(v instanceof Obj) {
      if(util.isString(v.v)) {
        var s = v.toString();
        if(prop == 'dangerouslySetInnerHTML') {
          self.on(Event.DOM, function() {
            self.off(Event.DOM, arguments.callee);
            self.element.innerHTML = s;
          });
          return '';
        }
        if(self.__style) {
          self.__cache[prop] = s;
        }
        return ' ' + prop + '="' + util.encodeHtml(s, true) + '"';
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
      if(prop == 'dangerouslySetInnerHTML') {
        self.on(Event.DOM, function() {
          self.off(Event.DOM, arguments.callee);
          self.element.innerHTML = s;
        });
        return '';
      }
      if(self.__style) {
        self.__cache[prop] = s;
      }
      return ' ' + prop + '="' + util.encodeHtml(s, true) + '"';
    }
  }
  __renderChild(child) {
    var self = this;
    if(child instanceof Element) {
      return child.toString();
    }
    else if(child instanceof Obj) {
      var s = child.toString();
      return child.type == Obj.TEXT ? util.encodeHtml(s) : s;
    }
    else if(Array.isArray(child)) {
      var res = '';
      child.forEach(function(item) {
        res += self.__renderChild(item);
      });
      return res;
    }
    else if(child === void 0) {
      return '';
    }
    else {
      return util.encodeHtml(child.toString());
    }
  }
  __reRender() {
    var self = this;
    var res = '';
    self.children.forEach(function(child) {
      res += self.__renderChild(child);
    });
    self.element.innerHTML = res;
    //重新触发DOM
    self.__onDom();
  }

  find(name) {
    return this.findAll(name, true)[0];
  }
  findAll(name, first) {
    var res = [];
    for(var i = 0, len = this.children.length; i < len; i++) {
      var child = this.children[i];
      if(child instanceof Element) {
        if(child instanceof Component) {
          if(child.name == name) {
            res.push(child);
            if(first) {
              break;
            }
          }
        }
        else {
          if(child.name == name) {
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

  get element() {
    this.__element = this.__element || document.querySelector('[migi-uid="' + this.uid + '"]');
    return this.__element;
  }
  get names() {
    return this.__names;
  }
  set style(v) {
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

  __onDom() {
    super.__onDom();
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
        //类型一旦发生变化，或者变化前后类型为ELEMENT，直接父层重绘
        if(ot != first.type || first.type != Obj.TEXT) {
          self.__reRender();
          return;
        }
        //记录真实索引和child索引
        range.push({ start, index: 0 });
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
          //TODO:性能优化
          if(ot != child.type || child.type != Obj.TEXT) {
            self.__reRender();
            return;
          }
          //记录真实索引和child索引
          range.push({ start, index });
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
        var now = util.lie ? textNode.innerText : textNode.textContent;
        if(res != now) {
          //textContent自动转义，保留空白，但显式时仍是合并多个空白，故用临时节点的innerHTML再replace代替
          //但当为innerHTML空时，没有孩子节点，所以特殊判断
          if(res) {
            TEMP_NODE.innerHTML = res;
            self.element.replaceChild(TEMP_NODE.firstChild, textNode);
          }
          else if(util.lie) {
            textNode.innerText = '';
          }
          else {
            textNode.textContent = '';
          }
        }
      });
    }
  }
  __updateChild(child) {
    var ov = child.v;
    var nv = child.cb.call(child.context);
    if(!util.equal(ov, nv)) {
      child.v = nv;
      return true;
    }
    return false;
  }
  __updateAttr(k, v) {
    if(k == 'dangerouslySetInnerHTML') {
      this.element.innerHTML = v;
      return;
    }
    switch(k) {
      case 'value':
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
        this.element[k] = v;
        break;
      case 'id':
      case 'class':
        if(this.__style) {
          this.element.setAttribute('migi-' + k, v);
          break;
        }
      default:
        this.element.setAttribute(k, v);
        break;
    }
    //使用了jaw内联解析css
    if(this.__style) {
      this.__cache[k] = v;
      this.__updateStyle();
    }
  }
  __merge(range) {
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
  __match(first) {
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
      if(child instanceof VirtualDom) {
        child.__updateStyle();
      }
    });
  }
}

export default VirtualDom;