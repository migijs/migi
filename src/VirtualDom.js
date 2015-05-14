import Event from './Event';
import Component from './Component';
import util from './util';
import Obj from './Obj';
import single from './single';

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

class VirtualDom extends Event {
  constructor(name, props = {}, ...children) {
    //fix循环依赖
    if(Component.hasOwnProperty('default')) {
      Component = Component.default;
    }
    //自闭和标签不能有children
    if(SELF_CLOSE.hasOwnProperty(name) && children.length) {
      throw new Error('self-close tag can not has chilren nodes: ' + name);
    }
    super();
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
  toString() {
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
            item.cb.call(item.context, event);
          });
        });
      }
      else {
        res += self.__renderProp(prop);
      }
    });
    res += ' migi-id="' + self.id + '"';
    //自闭和标签特殊处理
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
            self.element.addEventListener('input', cb, true);
            self.element.addEventListener('paste', cb, true);
            self.element.addEventListener('cut', cb, true);
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
  __renderProp(prop) {
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
  __renderChild(child, noEscape) {
    if(child instanceof VirtualDom || child instanceof Obj || child instanceof Component) {
      return child.toString(noEscape);
    }
    else {
      return noEscape ? child.toString() : util.escape(child.toString());
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
    __childrenDom();
  }

  append(dom) {
    var s = this.toString();
    if(util.isString(dom)) {
      document.querySelector(dom).innerHTML = s;
    }
    else if(dom) {
      dom.innerHTML = s;
    }
  }

  get name() {
    return this.__name;
  }
  get props() {
    return this.__props;
  }
  get children() {
    return this.__children;
  }
  get element() {
    return this.__element;
  }
  get parent() {
    return this.__parent;
  }
  get id() {
    return this.__id;
  }

  __onDom() {
    this.__element = document.body.querySelector('[migi-id="' + this.id + '"]');
    this.__childrenDom();
  }
  __childrenDom() {
    this.children.forEach(function(child) {
      if(child instanceof VirtualDom || child instanceof Component) {
        child.emit(Event.DOM);
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
    //利用索引更新，子节点只可能为：文本（包括变量）、组件、VirtualDom
    //其中只有文本节点需要自己更新，记录其索引，组件和VirtualDom递归通知更新
    //由于渲染时相邻的文本变量和String文本同为一个文本节点，因此start为真实DOM的索引
    var start = 0;
    var range = [];
    for(var index = 0, len = self.children.length; index < len; index++) {
      var child = self.children[index];
      //节点变量，可能为文本，也可能为VirtualDom，以及混合的数组
      if(child instanceof Obj) {
        var change = false;
        var ot = child.type;
        if(ot == Obj.VIRTUALDOM) {
          start++;
        }
        else if(index > 0
          && (self.children[index - 1] instanceof VirtualDom
          || self.children[index - 1] instanceof Obj
          && self.children[index - 1].type == Obj.VIRTUALDOM)) {
          start++;
        }
        if(Array.isArray(child.k)) {
          change = child.k.indexOf(k) > -1;
        }
        else if(k == child.k) {
          change = true;
        }
        //当可能发生变化时进行比对
        if(change && self.__updateChild(child)) {
          //类型一旦发生变化，直接父层重绘
          if(ot != child.type || child.type == Obj.VIRTUALDOM) {
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
      }
      //else其它情况为普通静态文本节点忽略
    }
    if(range.length && self.element) {
      self.__merge(range);
      range.forEach(function(item) {
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
          res += self.__renderChild(self.children[i], true);
        }
        var textNode = self.element.childNodes[item.start];
        //当仅有1个变量节点且变量为空时DOM无节点
        if(!textNode) {
          textNode = document.createTextNode('');
          self.element.appendChild(textNode);
          //TODO:可能不是第一个
        }
        var now = textNode.textContent;
        if(res != now) {
          textNode.textContent = res;
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
  __merge(range) {
    //合并相邻更新的文本节点
    for(var i = 0, len = range.length; i < len; i++) {
      var now = range[i];
      var next = range[i + 1];
      if(next && now.start == next.start && now.index == next.index - 1) {
        range.splice(i, 1);
        i--;
      }
    }
  }
}

export default VirtualDom;