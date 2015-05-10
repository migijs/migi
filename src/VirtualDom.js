import Event from './Event';
import util from './util';
import Obj from './Obj';

class VirtualDom extends Event {
  constructor(name, props = {}, ...children) {
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

    self.on(Event.DOM, self.__onDom);
    self.on(Event.DATA, self.__onData);
  }
  toString() {
    var self = this;
    var res = '<' + self.name;
    Object.keys(self.props).forEach(function(k) {
      if(/^on[A-Z]/.test(k)) {
        self.on(Event.DOM, function() {
          var name = k.slice(2).replace(/[A-Z]/g, function(Up) {
            return Up.toLowerCase();
          });
          self.element.addEventListener(name, function(event) {
            var item = self.props[k];
            item.cb.call(item.context, event);
          });
        });
      }
      else {
        res += ' ' + k + '="' + self.props[k].toString() + '"';
        if(k == 'value' && self.name == 'input' && self.props[k] instanceof Obj) {
          var item = self.props[k];
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
      }
    });
    res += ' migi-id="' + self.id + '"';
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
      res += self.renderChild(child);
    });
    res +='</' + self.name + '>';
    return res;
  }
  renderChild(child) {
    var self = this;
    if(child instanceof VirtualDom || child instanceof Obj) {
      return child.toString();
    }
    else if(util.isArray(child)) {
      var res = '';
      child.forEach(function(item) {
        res += self.renderChild(item);
      });
      return res;
    }
    else {
      return child.toString();
    }
  }

  get name() {
    return this.__name;
  }
  get props() {
    return this.__props;
  }
  set props(v) {
    this.__props = v;
    this.emit(Event.DATA, 'props');
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
    var self = this;
    self.__element = document.body.querySelector('[migi-id="' + self.id + '"]');
    self.children.forEach(function(child) {
      if(!util.isString(child) && child instanceof Event) {
        child.emit(Event.DOM);
      }
    });
  }
  __onData(target, k) {
    var self = this;
    //联动属性值
    for(var key in self.props) {
      var item = self.props[key];
      if(item instanceof Obj) {
        if(Array.isArray(item.k)) {
          var i = item.k.indexOf(k);
          if(i > -1) {
            var ov = item.v;
            var nv = item.cb.call(target);
            if(ov != nv) {
              if(key == 'value') {
                self.element.value = nv;
              }
              else {
                self.element.setAttribute(key, nv);
              }
            }
          }
        }
        else if(k == item.k) {
          var ov = item.v;
          var nv = item.cb.call(target);
          if(ov != nv) {
            if(key == 'value') {
              self.element.value = nv;
            }
            else {
              self.element.setAttribute(key, nv);
            }
          }
        }
      }
    }
    //联动html和子节点
    //利用索引更新，子节点只可能为：文本（包括变量）、组件、html
    //其中只有文本节点需要自己更新，记录其索引
    //由于渲染时变量和文本同为一个文本节点，因此start为真实DOM的索引
    var start = 0;
    var change = [];
    self.children.forEach(function(child, i) {
      //文本节点变量
      if(child instanceof Obj) {
        if(Array.isArray(child.k)) {
          var j = child.k.indexOf(k);
          if(j > -1) {
            var res = self.__updateChild(child, target);
            if(res) {
              change.push({
                start: start,
                index: i
              });
            }
          }
        }
        else if(k == child.k) {
          var res = self.__updateChild(child, target);
          if(res) {
            change.push({
              start: start,
              index: i
            });
          }
        }
      }
      //递归通知，增加索引
      else if(child instanceof VirtualDom) {
        child.emit(Event.DATA, target, k);
        start++;
      }
      //else其它情况为普通文本节点忽略
    });
    if(change.length && self.element) {
      change.forEach(function(item) {
        //利用虚拟索引向前向后找文本节点，拼接后更新到真实索引上
        for(var first = item.index; first > 0; first--) {
          var prev = self.children[first - 1];
          if(!util.isString(prev) && !prev instanceof Obj) {
            break;
          }
        }
        for(var last = item.index, len = self.children.length; last < len - 1; last++) {
          var next = self.children[last + 1];
          if(!util.isString(next) && !next instanceof Obj) {
            break;
          }
        }
        var res = '';
        for(var i = first; i <= last; i++) {
          res += self.renderChild(self.children[i]);
        }
        var textNode = self.element.childNodes[item.start];
        //当仅有1个变量节点且变量为空时DOM无节点
        if(!textNode) {
          textNode = document.createTextNode('');
          self.element.appendChild(textNode);
        }
        var now = textNode.textContent;
        if(res != now) {
          textNode.textContent = res;
        }
      });
    }
  }
  __updateChild(child, target) {
    var ov = child.v;
    var nv = child.cb.call(target).toString();
    if(ov != nv) {
      child.v = nv;
      return true;
    }
    return false;
  }
}

export default VirtualDom;