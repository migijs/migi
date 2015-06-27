import Event from './Event';
import Element from './Element';
import VirtualDom from './VirtualDom';
import util from './util';

class Component extends Element {
  constructor(props = {}, children = []) {
    var self = this;
    var name = self.constructor.toString();
    name = /^function\s+([\w$]+)/.exec(name)[1];
    super(name, props, children);

    self.__virtualDom = null;

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
  }
  //需要被子类覆盖
  //@abstract
  render() {
    return new VirtualDom('div', this.props, this.children);
  }
  //@override
  toString() {
    this.__virtualDom = this.render();
    this.virtualDom.__parent = this;
    if(this.__style) {
      this.virtualDom.style = this.__style;
    }
    return this.virtualDom.toString();
  }
  findChild(name) {
    return this.findChildren(name, true)[0];
  }
  findChildren(name, first) {
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
  find(name) {
    return this.findAll(name, true)[0];
  }
  findAll(name, first) {
    return this.virtualDom.findAll(name, first);
  }
  bind(target, include, exclude) {
    var self = this;
    if(target == this) {
      throw new Error('can not bind self: ' + self.name);
    }
    function cb1(k, origin) {
      if(origin == cb2) {
        return;
      }
      if(!include || include.indexOf(k) > -1) {
        if(!exclude || exclude.indexOf(k) == -1) {
          target[k] = self[k];
        }
      }
    }
    function cb2(k, origin) {
      if(origin == cb1) {
        return;
      }
      if(!include || include.indexOf(k) > -1) {
        if(!exclude || exclude.indexOf(k) == -1) {
          self[k] = target[k];
        }
      }
    }
    self.on(Event.DATA, cb1);
    target.on(Event.DATA, cb2);
  }
  bindTo(target, include, exclude) {
    target.bind(this, include, exclude);
  }
  __cb(target, k, o, origin) {
    if(origin == target.__cb) {
      return;
    }
    //同名无需name，直接function作为middleware
    if(util.isFunction(o)) {
      target[k] = o(this[k]);
    }
    //只有name说明无需数据处理
    else if(util.isString(o)) {
      target[o] = this[k];
    }
    else if(o.name) {
      var v = o.middleware ? o.middleware.call(this, this[k]) : this[k];
      target[o.name] = v;
    }
  }
  bridge(target, datas) {
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self.name);
    }
    self.on(Event.DATA, function(k, origin) {
      if(datas.hasOwnProperty(k)) {
        var o = datas[k];
        self.__cb(target, k, o, origin);
      }
    });
  }
  bridgeTo(target, datas) {
    target.bridge(this, datas);
  }

  get virtualDom() {
    return this.__virtualDom;
  }
  //@overwrite
  get element() {
    return this.virtualDom ? this.virtualDom.element : null;
  }
  set style(v) {
    this.__style = v;
  }

  //@override
  __onDom() {
    super.__onDom();
    var self = this;
    self.virtualDom.emit(Event.DOM);
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
  //@override
  __onData(k) {
    if(this.virtualDom) {
      this.virtualDom.emit(Event.DATA, k);
    }
  }
}

export default Component;