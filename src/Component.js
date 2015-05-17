import Event from './Event';
import VirtualDom from './VirtualDom';
import util from './util';

class Component extends Event {
  constructor(name, props = {}, ...children) {
    super();
    var self = this;
    self.__name = name;
    self.__props = props;
    self.__style = null;
    Object.keys(props).forEach(function(k) {
      if(/^on[A-Z]/.test(k)) {
        var name = k.slice(2).replace(/[A-Z]/g, function(Up) {
          return Up.toLowerCase();
        });
        var cb = props[k];
        self.on(name, function(...data) {
          cb(...data);
        });
      }
    });

    self.__children = children;
    self.__virtualDom = null;
    self.__element = null;
    self.__parent = null;
    self.__id = util.uid();

    self.on(Event.DOM, self.__onDom);
    self.on(Event.DATA, self.__onData);
  }
  //需要被子类覆盖
  render() {
    return new VirtualDom('div', this.props, ...this.children);
  }
  toString() {
    this.__virtualDom = this.render();
    this.virtualDom.__parent = this;
    return this.virtualDom.toString();
  }
  inTo(dom) {
    var s = this.toString();
    if(util.isString(dom)) {
      document.querySelector(dom).innerHTML = s;
    }
    else if(dom) {
      dom.innerHTML = s;
    }
  }
  find(name) {
    return this.findAll(name)[0];
  }
  findAll(name) {
    var res = [];
    for(var i = 0, len = this.children.length; i < len; i++) {
      var child = this.children[i];
      if(child instanceof Component || child instanceof VirtualDom) {
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
    }
    if(this.virtualDom) {
      res = res.concat(this.virtualDom.findAll(name));
    }
    return res;
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
  get virtualDom() {
    return this.__virtualDom;
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
    self.virtualDom.emit(Event.DOM);
    self.__element = self.virtualDom.element;
    self.element.setAttribute('migi-name', this.name);
    self.children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DOM);
      }
    });
    //将所有组件DOM事件停止冒泡，形成shadow特性，但不能阻止捕获
    function stopPropagation(e) {
      if(e.target != self.element) {
        e.stopPropagation();
      }
    }
    ['click', 'dblclick', 'focus', 'blur', 'change', 'abort', 'error', 'load', 'mousedown', 'mousemove', 'mouseover',
      'mouseup', 'mouseout', 'reset', 'resize', 'scroll', 'select', 'submit', 'unload', 'DOMActivate',
      'DOMFocusIn', 'DOMFocusOut'].forEach(function(name) {
        self.element.addEventListener(name, stopPropagation);
      });
  }
  __onData(k) {
    if(this.virtualDom) {
      this.virtualDom.emit(Event.DATA, k);
    }
  }
}

export default Component;