import Event from './Event';
import Element from './Element';
import VirtualDom from './VirtualDom';
import util from './util';
import Obj from './Obj';
import Cb from './Cb';
import Model from './Model';
import FastClick from './FastClick';
import array from './array';

const STOP = ['click', 'dblclick', 'focus', 'blur', 'change', 'contextmenu', 'mousedown', 'mousemove', 'mouseover',
  'mouseup', 'mouseout', 'mousewheel', 'resize', 'scroll', 'select', 'submit', 'DOMActivate', 'DOMFocusIn',
  'DOMFocusOut', 'keydown', 'keypress', 'keyup', 'drag', 'dragstart', 'dragover', 'dragenter', 'dragleave',
  'dragend', 'drop', 'formchange', 'forminput', 'input', 'cut', 'paste', 'reset', 'touchstart',
  'touchmove', 'touchend', 'touchcancel', 'MSGestureEnd', 'MSPointerDown', 'pointerdown', 'MSPointerMove', 'pointermove',
  'MSPointerUp', 'pointerup', 'MSPointerCancel', 'pointercancel'];

class Component extends Element {
  constructor(uid, props = [], children = []) {
    super(uid, null, props, children);

    var self = this;
    self.__name = self.constructor.__migiName;
    self.__virtualDom = null; //根节点vd引用
    self.__ref = {}; //以ref为attr的vd快速访问引用
    self.__stop = null; //停止冒泡的fn引用
    self.__model = null; //数据模型引用
    self.__allowPropagation = true; //默认是否允许冒泡
    // self.__canData = false; //防止添加至DOM前触发无谓的数据更新
    self.__bindHash = {}; //缩略语法中是否设置过默认值
    self.__ob = []; //被array们的__ob__引用
    self.__bindProperty = {}; //@property语法，出现在组件属性上时联动父层@bind值更新

    self.__props.forEach(function(item, index) {
      var k = item[0];
      var v = item[1];
      self.__init(k, v, index);
    });
  }
  __init(k, v, index) {
    var self = this;
    if(/^on[a-zA-Z]/.test(k)) {
      var name = k.slice(2).toLowerCase();
      self.once(Event.DOM, function() {
        self.virtualDom.__addEvt(name, v);
      });
    }
    else if(/^on-[a-zA-Z\d_]/.test(k)) {
      var name = k.slice(3);
      self.on(name, function(...data) {
        if(v instanceof Cb) {
          if(util.isFunction(v.cb)) {
            v.cb.call(v.context, ...data);
          }
        }
        else if(util.isFunction(v)) {
          v(...data);
        }
      });
    }
    else if(k == 'model') {
      self.model = v;
    }
    else if(v instanceof Obj) {
      self.__props[index] = v.v;
      self.props[k] = v.v;
      self.__bindProperty[v.k] = [k, v];
    }
  }
  //需要被子类覆盖
  //@abstract
  render() {
    return new VirtualDom(this.__uid, 'div', this.__props, this.__children);
  }
  //@override
  toString() {
    this.__virtualDom = this.render();
    if(!this.__virtualDom) {
      throw new Error('render must return a VirtualDom: ' + this.__name);
    }
    this.__virtualDom.__parent = this;
    if(this.__style) {
      this.__virtualDom.style = this.__style;
    }
    return this.__virtualDom.toString();
  }
  //@override
  preString() {
    this.toString();
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

  //@overwrite
  __onDom(fake) {
    super.__onDom();
    var self = this;
    self.virtualDom.emit(Event.DOM, fake);
    var elem = self.element;
    if(self.name) {
      elem.setAttribute('migi-name', self.name);
    }
    //无覆盖render时渲染标签的children；有时渲染render的children
    //标签的children没被添加到DOM上但父级组件DOM已构建完，因此以参数区分触发fake的DOM事件
    if(!fake && self.children != self.virtualDom.children) {
      Component.fakeDom(self.children);
    }
    //指定不允许冒泡，默认是全部冒泡
    if(self.props.allowPropagation == 'true') {
      return;
    }
    else if(self.props.allowPropagation != 'false' && self.allowPropagation) {
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
    //FastClick处理移动点击点透
    FastClick.attach(elem);
  }
  __data(k, opt) {
    var self = this;
    //set触发数据变更时，若已DOM则打开开关
    if(self.dom) {
      self.__canData = true;
    }
    self.__onData(k, opt);
    self.emit(Event.DATA, k);
  }
  //@overwrite
  __onData(k, opt) {
    //未DOM或开关时不触发更新
    if(!this.__dom || !this.__canData) {
      return;
    }
    if(this.virtualDom) {
      this.virtualDom.__onData(k, opt);
    }
    for(var i = 0, len = this.children.length; i < len; i++) {
      var child = this.children[i];
      if(child instanceof VirtualDom) {
        child.__onData(k, opt);
      }
    }
  }
  __notifyBindProperty(k) {
    if(this.__bindProperty.hasOwnProperty(k)) {
      var arr = this.__bindProperty[k];
      var bindProperty = arr[0];
      let obj = arr[1];
      if(obj.update(obj.v)) {
        this[bindProperty] = obj.v;
      }
    }
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
    //侦听array里面的引用需删除
    self.__ob.forEach(function(arr) {
      var i = arr.__ob__.indexOf(self);
      if(i > -1) {
        arr.__ob__.splice(i, 1);
        arr.__cb__.splice(i, 1);
      }
    });
    var vd = self.virtualDom.__destroy();
    self.emit(Event.DESTROY);
    self.__hash = {};
    self.__bindProperty = null;
    return vd;
  }
  __initBind(name) {
    return !this.__bindHash.hasOwnProperty(name);
  }
  __getBind(name) {
    return this.__bindHash[name];
  }
  __setBind(name, v) {
    this.__bindHash[name] = v;
    this.__array(name, v);
  }
  __array(name, v) {
    var self = this;
    //检查array类型，替换并侦听array的原型方法
    if(Array.isArray(v)) {
      v.__proto__ = array;
      v.__ob__ = v.__ob__ || [];
      v.__cb__ = v.__cb__ || [];
      if(v.__ob__.indexOf(self) == -1) {
        self.__ob.push(v);
        v.__ob__.push(self);
        v.__cb__.push(function(opt) {
          self.__data(name, opt);
        });
      }
    }
  }

  get allowPropagation() {
    return this.__allowPropagation;
  }
  set allowPropagation(v) {
    this.__allowPropagation = v;
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

export default Component;
