import Event from './Event';
import Element from './Element';
import VirtualDom from './VirtualDom';
import util from './util';
import EventBus from './EventBus';
import Model from './Model';
import Stream from './Stream';
import Fastclick from './Fastclick';

const STOP = ['click', 'dblclick', 'focus', 'blur', 'change', 'contextmenu', 'mousedown', 'mousemove', 'mouseover',
  'mouseup', 'mouseout', 'mousewheel', 'resize', 'scroll', 'select', 'submit', 'DOMActivate', 'DOMFocusIn',
  'DOMFocusOut', 'keydown', 'keypress', 'keyup', 'drag', 'dragstart', 'dragover', 'dragenter', 'dragleave',
  'dragend', 'drop', 'formchange', 'forminput', 'input', 'cut', 'paste', 'reset', 'touchstart',
  'touchmove', 'touchend', 'touchcancel', 'MSGestureEnd', 'MSPointerDown', 'pointerdown', 'MSPointerMove', 'pointermove',
  'MSPointerUp', 'pointerup', 'MSPointerCancel', 'pointercancel'];

class Component extends Element {
  constructor(props = [], children = []) {
    //fix循环依赖
    if(Model.hasOwnProperty('default')) {
      Model = Model['default'];
    }

    var self = this;
    var name = self.constructor.__migiName;
    super(name, props, children);

    self.__virtualDom = null; //根节点vd引用
    self.__ref = {}; //以ref为attr的vd快速访问引用
    self.__stop = null; //停止冒泡的fn引用
    self.__model = null; //数据模型引用
    self.__bridgeHash = {}; //桥接记录
    self.__stream = null; //桥接过程中传递的stream对象
    self.state = {}; //兼容rc

    self.__props.forEach(function(item) {
      var k = item[0];
      var v = item[1];
      self.__init(k, v);
    });

    self.on(Event.DATA, self.__onData);
  }
  __init(k, v) {
    if(/^on[a-zA-Z]/.test(k)) {
      var name = k.slice(2);
      this.on(name, function(...data) {
        v(...data);
      });
    }
    else if(k == 'model') {
      this.model = v;
    }
  }
  //需要被子类覆盖
  //@abstract
  render() {
    return new VirtualDom('div', this.props, this.children);
  }
  //@override
  toString() {
    this.__virtualDom = this.render();
    if(!this.__virtualDom) {
      throw new Error('render must return a VirtualDom: ' + this.name);
    }
    this.__virtualDom.__parent = this;
    if(this.__style) {
      this.__virtualDom.style = this.__style;
    }
    return this.__virtualDom.toString();
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
  find(selector) {
    return this.__virtualDom ? this.__virtualDom.find(selector) : null;
  }
  findAll(selector) {
    return this.__virtualDom ? this.__virtualDom.findAll(selector) : [];
  }
  /*
   * bridge(target, String, String, Function)
   * bridge(target, String, Function)
   * bridge(target, String, String)
   * bridge(target, String)
   * bridge(target, Object<String:String>)
   * bridge(target, Object<String:Function>)
   * bridge(target, Object<String:Object<name:String,middleware:Function>>)
  */
  bridge(target, src, name, middleware) {
    //fix循环依赖
    if(Model.hasOwnProperty('default')) {
      Model = Model['default'];
    }
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self.name);
    }
    if(!target
      || !(target instanceof EventBus)
        && !(target instanceof Component)
        && !(target instanceof Model)) {
      throw new Error('can only bridge to EventBus/Component/Model: ' + self.name);
    }
    //重载
    if(arguments.length == 2) {
      if(util.isString(src)) {
        self.__record(target, src, src);
      }
      else {
        Object.keys(src).forEach(function(k) {
          var o = src[k];
          if(util.isString(o)) {
            self.__record(target, k, o);
          }
          else if(util.isFunction(o)) {
            self.__record(target, k, k, o);
          }
          else if(o.name) {
            self.__record(target, k, o.name, o.middleware);
          }
        });
      }
    }
    else if(arguments.length == 3) {
      if(util.isString(name)) {
        self.__record(target, src, name);
      }
      else {
        middleware = name;
        self.__record(target, src, src, middleware);
      }
    }
    else if(arguments.length == 4) {
      self.__record(target, src, name, middleware);
    }
  }

  //@overwrite
  __onDom(fake) {
    super.__onDom();
    var self = this;
    self.virtualDom.emit(Event.DOM, fake);
    var elem = self.element;
    elem.setAttribute('migi-name', self.name);
    //无覆盖render时渲染标签的children；有时渲染render的children
    //标签的children没被添加到DOM上但父级组件DOM已构建完，因此以参数区分触发fake的DOM事件
    if(!fake && self.children != self.virtualDom.children) {
      Component.fakeDom(self.children);
    }
    //指定允许冒泡
    if(self.props.allowPropagation) {
      return;
    }
    //将所有组件DOM事件停止冒泡，形成shadow特性，但不能阻止捕获
    function stopPropagation(e) {
      e = e || window.event;
      if(e.target != elem && e.srcElement != elem) {
        e.cancelBubble = true;
        e.stopPropagation && e.stopPropagation();
      }
    }
    self.__stop = stopPropagation;
    //仅考虑用户事件，媒体等忽略
    STOP.forEach(function(name) {
      elem.addEventListener(name, stopPropagation);
    });
    //fastclick处理移动点击点透
    Fastclick.attach(this.element);
  }
  __data(k) {
    var self = this;
    self.emit(Event.DATA, k);
    var bridge = self.__bridgeHash[k];
    if(bridge) {
      var stream = self.__stream || new Stream(self.uid);
      bridge.forEach(function(item) {
        var target = item.target;
        var name = item.name;
        var middleware = item.middleware;
        if(!stream.has(target.uid)) {
          stream.add(target.uid);
          if(target instanceof EventBus) {
            target.emit(Event.DATA, name, middleware ? middleware.call(self, self[k]) : self[k], stream);
          }
          //先设置桥接对象数据为桥接模式，修改数据后再恢复
          else {
            target.__stream = stream;
            target[name] = middleware ? middleware.call(self, self[k]) : self[k];
            target.__stream = null;
          }
        }
      });
    }
  }
  //@overwrite
  __onData(k) {
    if(this.virtualDom) {
      this.virtualDom.__onData(k);
    }
    this.children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DATA, k);
      }
      else if(child instanceof VirtualDom) {
        child.__onData(k);
      }
    });
  }
  __destroy() {
    var self = this;
    if(self.__stop) {
      var elem = self.element;
      STOP.forEach(function(name) {
        elem.removeEventListener(name, self.__stop);
      });
    }
    if(self.model) {
      self.model.__del(self);
    }
    var vd = self.virtualDom.__destroy();
    self.emit(Event.DESTROY);
    self.__hash = {};
    return vd;
  }

  setState(state) {
    this.state = state;
    this.__data('state');
  }

  get element() {
    return this.virtualDom ? this.virtualDom.element : null;
  }
  get style() {
    return this.__style;
  }
  set style(v) {
    this.__style = v;
  }
  get model() {
    return this.__model;
  }
  set model(v) {
    if(!(v instanceof Model)) {
      throw new Error('can not set model to a non Model: ' + v);
    }
    this.__model = v;
    v.__add(this);
  }
  get virtualDom() {
    return this.__virtualDom;
  }
  get ref() {
    return this.__ref;
  }

  static fakeDom(child) {
    if(Array.isArray(child)) {
      child.forEach(function(item) {
        Component.fakeDom(item);
      });
    }
    else if(child instanceof Component) {
      child.emit(Event.DOM, true);
    }
    else if(child instanceof VirtualDom) {
      child.emit(Event.DOM, true);
    }
  }
}

//完全一样的桥接数据流方法，复用
['__record', '__unRecord', 'bridgeTo', 'unBridge', 'unBridgeTo'].forEach(function(k) {
  Component.prototype[k] = EventBus.prototype[k];
});

export default Component;