import Event from './Event';
import Element from './Element';
import VirtualDom from './VirtualDom';
import util from './util';
import eventBus from './eventBus';

var bindOrigin = {};
var bridgeOrigin = {};

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
  find(name) {
    return this.findAll(name, true)[0];
  }
  findAll(name, first) {
    return this.virtualDom.findAll(name, first);
  }
  __bicb(target, keys, include, exclude) {
    //对比来源uid是否出现过，防止闭环死循环
    if(bindOrigin.hasOwnProperty(target.uid)) {
      return;
    }
    bindOrigin[target.uid] = true;
    //变更时设置对方CacheComponent不更新，防止闭环
    target.__flag = true;
    //CacheComponent可能会一次性变更多个数据，Component则只会一个，统一逻辑
    if(!Array.isArray(keys)) {
      keys = [keys];
    }
    //不能用foreach，会干扰origin的caller判断
    for(var i = 0, len = keys.length; i < len; i++) {
      var k = keys[i];
      if(!include || include.indexOf(k) > -1) {
        if(!exclude || exclude.indexOf(k) == -1) {
          target[k] = this[k];
        }
      }
    }
    //关闭开关
    target.__flag = false;
  }
  bind(target, include, exclude) {
    var self = this;
    if(target == this) {
      throw new Error('can not bind self: ' + self.name);
    }
    if(target != eventBus && !(target instanceof Component)) {
      throw new Error('can only bind to eventBus/Component: ' + self.name);
    }
    //Componenet和CacheComponent公用逻辑，设计有点交叉的味道，功能却正确
    //CacheComponent有个__handler用以存储缓存数据变更，以此和Componenet区分
    self.on(self.__handler ? Event.CACHE_DATA : Event.DATA, function(keys, origin) {
      //来源不是bicb则说明不是由bind触发的，而是真正数据源，记录uid
      if(origin != self.__bicb) {
        bindOrigin = {};
        bindOrigin[self.uid] = true;
      }
      self.__bicb(target, keys, include, exclude);
    });
    target.on(target.__handler ? Event.CACHE_DATA : Event.DATA, function(keys, origin) {
      //来源不是bicb则说明不是由bind触发的，而是真正数据源，记录uid
      if(origin != target.__bicb) {
        bindOrigin = {};
        bindOrigin[target.uid] = true;
      }
      target.__bicb(self, keys, include, exclude);
    });
  }
  bindTo(target, include, exclude) {
    target.bind(this, include, exclude);
  }
  __brcb(target, keys, datas) {
    //对比来源uid是否出现过，防止闭环死循环
    if(bridgeOrigin.hasOwnProperty(target.uid)) {
      return;
    }
    bridgeOrigin[target.uid] = true;
    //变更时设置对方CacheComponent不更新，防止闭环
    target.__flag = true;
    //CacheComponent可能会一次性变更多个数据，Component则只会一个，统一逻辑
    if(!Array.isArray(keys)) {
      keys = [keys];
    }
    //遍历变更数据项
    for(var i = 0, len = keys.length; i < len; i++) {
      var k = keys[i];
      if(datas.hasOwnProperty(k)) {
        var stream = datas[k];
        //eventBus作为中间数据透传
        if(target == eventBus) {
          //同名无需name，直接function作为middleware
          if(util.isFunction(stream)) {
            target.emit(Event.DATA, k, stream(this[k]));
          }
          //只有name说明无需数据处理
          else if(util.isString(stream)) {
            target.emit(Event.DATA, stream, this[k]);
          }
          else if(stream.name) {
            var v = stream.middleware ? stream.middleware.call(this, this[k]) : this[k];
            target.emit(Event.DATA, stream.name, v);
          }
        }
        else {
          //同名无需name，直接function作为middleware
          if(util.isFunction(stream)) {
            target[k] = stream(this[k]);
          }
          //只有name说明无需数据处理
          else if(util.isString(stream)) {
            target[stream] = this[k];
          }
          else if(stream.name) {
            var v = stream.middleware ? stream.middleware.call(this, this[k]) : this[k];
            target[stream.name] = v;
          }
        }
      }
    }
    //打开开关
    target.__flag = false;
  }
  bridge(target, datas) {
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self.name);
    }
    if(target != eventBus && !(target instanceof Component)) {
      throw new Error('can only bridge to eventBus/Component: ' + self.name);
    }
    self.on(self.__handler ? Event.CACHE_DATA : Event.DATA, function(keys, origin) {
      //来源不是__brcb则说明不是由bridge触发的，而是真正数据源，记录uid
      if(origin != self.__brcb && origin != eventBus.__brcb) {
        bridgeOrigin = {};
        bridgeOrigin[self.uid] = true;
      }
      self.__brcb(target, keys, datas);
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

  //@overwrite
  __onDom() {
    super.__onDom();
    var self = this;
    self.virtualDom.emit(Event.DOM);
    self.element.setAttribute('migi-name', this.name);
    self.children.forEach(function(child) {
      if(child instanceof Element) {
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
  //@overwrite
  __onData(k) {
    if(this.virtualDom) {
      this.virtualDom.emit(Event.DATA, k);
    }
    this.children.forEach(function(child) {
      child.emit(Event.DATA, k);
    });
  }
  __destroy() {
    return this.virtualDom.__destroy();
  }
}

export default Component;