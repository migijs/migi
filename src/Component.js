import Event from './Event';
import Element from './Element';
import VirtualDom from './VirtualDom';
import util from './util';
import browser from './browser';
import EventBus from './EventBus';

var bridgeOrigin = {};

class Component extends Element {
  constructor(props = {}, children = []) {
    var self = this;
    var name = self.constructor.toString();
    name = /^function\s+([\w$]+)/.exec(name)[1];
    super(name, props, children);

    self.__virtualDom = null; //根节点vd引用
    self.__ref = {}; //以ref为attr的vd快速访问引用

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

    self.on(Event.DATA, self.__onData);

    //ie8的对象识别hack
    if(browser.lie) {
      self.__migiCP = this;
      return self.__hackLie(Component, GS);
    }
  }
  //需要被子类覆盖
  //@abstract
  render() {
    return new VirtualDom('div', this.$props, this.$children);
  }
  //@override
  toString() {
    this.__virtualDom = this.render();
    this.$virtualDom.__parent = this;
    if(this.__style) {
      this.$virtualDom.$style = this.__style;
    }
    return this.$virtualDom.toString();
  }
  $findChild(name) {
    return this.$findChildren(name, true)[0];
  }
  $findChildren(name, first) {
    var res = [];
    for(var i = 0, len = this.$children.length; i < len; i++) {
      var child = this.$children[i];
      if(child instanceof Element || browser.lie && child && child.__migiEL) {
        if(child instanceof Component) {
          if(child.$name == name || util.isFunction(name) && child instanceof name) {
            res.push(child);
            if(first) {
              break;
            }
          }
        }
        else {
          if(child.$name == name || util.isFunction(name) && child instanceof name) {
            res.push(child);
            if(first) {
              break;
            }
          }
          res = res.concat(child.$findAll(name));
          if(first && res.length) {
            break;
          }
        }
      }
    }
    return res;
  }
  $find(name) {
    return this.$findAll(name, true)[0];
  }
  $findAll(name, first) {
    return this.$virtualDom.$findAll(name, first);
  }
  __brcb(target, keys, datas) {
    //对比来源uid是否出现过，防止闭环死循环
    if(bridgeOrigin.hasOwnProperty(target.$uid)) {
      return;
    }
    bridgeOrigin[target.$uid] = true;
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
        if(target instanceof EventBus) {
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
  $bridge(target, datas) {
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self.$name);
    }
    if(!(target instanceof EventBus)
      && !(target instanceof Component)
      && (browser.lie && !target.__migiCP)) {
      throw new Error('can only bridge to EventBus/Component: ' + self.$name);
    }
    self.on(self instanceof migi.CacheComponent && browser.lie && self.__migiCC
      ? Event.CACHE_DATA : Event.DATA, function(keys, origin) {
      //来源不是__brcb则说明不是由bridge触发的，而是真正数据源，记录uid
      if(origin != self.__brcb && origin != target.__brcb) {
        bridgeOrigin = {};
        bridgeOrigin[self.$uid] = true;
      }
      self.__brcb(target, keys, datas);
    });
  }
  $bridgeTo(target, datas) {
    target.$bridge(this, datas);
  }
  $(k, v) {
    if(browser.lie && this.__migiNode == this) {
      if(arguments.length > 1) {
        this.__migiNode[k] = v;
      }
      return this.__migiNode[k];
    }
    if(arguments.length > 1) {
      this[k] = v;
    }
    return this[k];
  }

  //@overwrite
  __onDom(fake) {
    super.__onDom();
    var self = this;
    self.$virtualDom.emit(Event.DOM, fake);
    self.$element.setAttribute('migi-name', this.$name);
    //无覆盖render时渲染标签的$children；有时渲染render的$children
    //标签的$children没被添加到DOM上但父级组件DOM已构建完，因此以参数区分触发fake的DOM事件
    if(!fake && this.$children != this.$virtualDom.$children) {
      Component.fakeDom(this.$children);
    }
    //指定允许冒泡
    if(self.$props.allowPropagation) {
      return;
    }
    //将所有组件DOM事件停止冒泡，形成shadow特性，但不能阻止捕获
    function stopPropagation(e) {
      e = e || window.event;
      if(e.target != self.$element && e.srcElement != self.$element) {
        if(browser.lie) {
          e.cancelBubble = true;
        }
        e.stopPropagation && e.stopPropagation();
      }
    }
    //仅考虑用户事件，媒体等忽略
    ['click', 'dblclick', 'focus', 'blur', 'change', 'contextmenu', 'mousedown', 'mousemove', 'mouseover',
      'mouseup', 'mouseout', 'mousewheel', 'resize', 'scroll', 'select', 'submit', 'DOMActivate', 'DOMFocusIn',
      'DOMFocusOut', 'keydown', 'keypress', 'keyup', 'drag', 'dragstart', 'dragover', 'dragenter', 'dragleave',
      'dragend', 'drop', 'formchange', 'forminput', 'input', 'cut', 'paste', 'reset', 'touch', 'touchstart',
      'touchmove', 'touchend'].forEach(function(name) {
        if(browser.lie && self.$element.attachEvent) {
          self.$element.attachEvent('on' + name, stopPropagation);
        }
        else {
          self.$element.addEventListener(name, stopPropagation);
        }
      });
  }
  //@overwrite
  __onData(k, caller) {
    if(this.$virtualDom) {
      this.$virtualDom.__onData(k);
    }
    this.$children.forEach(function(child) {
      if(child instanceof Component || browser.lie && child && child.__migiCP) {
        child.emit(Event.DATA, k, caller);
      }
      else if(child instanceof VirtualDom || browser.lie && child && child.__migiVD) {
        child.__onData(k);
      }
    });
  }
  __destroy() {
    this.emit(Event.DESTROY);
    this.__hash = {};
    return this.$virtualDom.__destroy();
  }

  static fakeDom(child) {
    if(Array.isArray(child)) {
      child.forEach(function(item) {
        Component.fakeDom(item);
      });
    }
    else if(child instanceof Component || browser.lie && child && child.__migiCP) {
      child.emit(Event.DOM, true);
    }
    else if(child instanceof VirtualDom || browser.lie && child && child.__migiVD) {
      child.emit(Event.DOM, true);
    }
  }
}

//hack ie8，clone get/set in Element
var GS = {
  $element: {
    get: function() {
      return this.$virtualDom ? this.$virtualDom.$element : null;
    }
  },
  $style: {
    get: function() {
      return this.__style;
    },
    set: function(v) {
      this.__style = v;
    }
  }
};
['virtualDom'].forEach(function(item) {
  GS['$' + item] = {
    get: function() {
      return this['__' + item];
    }
  };
});
if(!browser.lie) {
  Object.defineProperties(Component.prototype, GS);
}

export default Component;