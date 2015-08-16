define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var VirtualDom=function(){var _2=require('./VirtualDom');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var browser=function(){var _4=require('./browser');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var EventBus=function(){var _5=require('./EventBus');return _5.hasOwnProperty("default")?_5["default"]:_5}();
var Model=function(){var _6=require('./Model');return _6.hasOwnProperty("default")?_6["default"]:_6}();
var bridgeStream=function(){var _7=require('./bridgeStream');return _7.hasOwnProperty("default")?_7["default"]:_7}();

var STOP = ['click', 'dblclick', 'focus', 'blur', 'change', 'contextmenu', 'mousedown', 'mousemove', 'mouseover',
  'mouseup', 'mouseout', 'mousewheel', 'resize', 'scroll', 'select', 'submit', 'DOMActivate', 'DOMFocusIn',
  'DOMFocusOut', 'keydown', 'keypress', 'keyup', 'drag', 'dragstart', 'dragover', 'dragenter', 'dragleave',
  'dragend', 'drop', 'formchange', 'forminput', 'input', 'cut', 'paste', 'reset', 'touch', 'touchstart',
  'touchmove', 'touchend'];

!function(){var _8=Object.create(Element.prototype);_8.constructor=Component;Component.prototype=_8}();
  function Component(props, children) {
    //fix循环依赖
    if(props===void 0)props={};if(children===void 0)children=[];if(Model.hasOwnProperty('default')) {
      Model = Model['default'];
    }

    var self = this;
    var name = self.constructor.__migiName;
    Element.call(this,name, props, children);

    self.__virtualDom = null; //根节点vd引用
    self.__ref = {}; //以ref为attr的vd快速访问引用
    self.__stop = null; //停止冒泡的fn引用
    self.__model = null; //数据模型引用
    self.__bridgeHash = null; //桥接记录

    Object.keys(props).forEach(function(k) {
      if(/^on[A-Z]/.test(k)) {
        var name = k.slice(2).replace(/[A-Z]/g, function(Up) {
          return Up.toLowerCase();
        });
        var cb = props[k];
        self.on(name, function(data) {
          data=[].slice.call(arguments, 0);cb.apply(this,[].concat(Array.from(data)));
        });
      }
      else if(k == 'model') {
        self.model = props[k];
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
  Component.prototype.render = function() {
    return new VirtualDom('div', this.props, this.children);
  }
  //@override
  Component.prototype.toString = function() {
    this.__virtualDom = this.render();
    this.__virtualDom.__parent = this;
    if(this.__style) {
      this.__virtualDom.style = this.__style;
    }
    return this.__virtualDom.toString();
  }
  Component.prototype.findChild = function(name) {
    return this.findChildren(name, true)[0];
  }
  Component.prototype.findChildren = function(name, first) {
    var res = [];
    for(var i = 0, len = this.__children.length; i < len; i++) {
      var child = this.__children[i];
      if(child instanceof Element || browser.lie && child && child.__migiEL) {
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
  Component.prototype.find = function(name) {
    return this.findAll(name, true)[0];
  }
  Component.prototype.findAll = function(name, first) {
    return this.__virtualDom ? this.__virtualDom.findAll(name, first) : [];
  }
  Component.prototype.__brcb = function(keys) {
    //CacheComponent可能会一次性变更多个数据，Component则只会一个，统一逻辑
    if(!Array.isArray(keys)) {
      keys = [keys];
    }
    //遍历变更数据项
    for(var i = 0, len = keys.length; i < len; i++) {
      var k = keys[i];
      if(this.__bridgeHash.hasOwnProperty(k)) {
        var arr = this.__bridgeHash[k];
        for(var j = 0, len2 = arr.length; j < len2; j++) {
          var stream = arr[j];
          var target = stream.target;
          var name = stream.name;
          var middleware = stream.middleware;
          if(!bridgeStream.pass(target, name)) {
            //eventBus作为中间数据透传
            if(target instanceof EventBus) {
              target.emit(Event.DATA, name, middleware ? middleware.call(this, this[k]) : this[k]);
            }
            //Model和Component数据模型
            else {
              //变更时设置对方CacheComponent不更新，防止闭环
              if(target instanceof migi.CacheComponent || browser.lie && target.__migiCC) {
                target.__flag = true;
              }
              target[name] = middleware ? middleware.call(this, this[k]) : this[k];
              //关闭开关
              if(target instanceof migi.CacheComponent || browser.lie && target.__migiCC) {
                target.__flag = false;
              }
            }
          }
        }
      }
    }
  }
  Component.prototype.__record = function(target, src, name, middleware) {
    //记录桥接单向数据流关系
    bridgeStream.record(this.uid, target.uid, src, name);
    this.__bridgeHash = this.__bridgeHash || {};
    this.__bridgeHash[src] = this.__bridgeHash[src] || [];
    this.__bridgeHash[src].push({
      target:target,
      name:name,
      middleware:middleware
    });
  }
  //bridge(target, String, String, Function)
  //bridge(target, String, Function)
  //bridge(target, String, String)
  //bridge(target, String)
  //bridge(target, Object<String:String>)
  //bridge(target, Object<String:Function>)
  //bridge(target, Object<String:Object<name:String,middleware:Function>>)
  Component.prototype.bridge = function(target, src, name, middleware) {
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
        && !(target instanceof Model)
        && (browser.lie && !target.__migiCP && !target.__migiMD)) {
      throw new Error('can only bridge to EventBus/Component/Model: ' + self.name);
    }
    var first = !this.__bridgeHash;
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
    //发生数据变更时，判断来源，从关系记录中判别闭环
    if(first) {
      self.on(self instanceof migi.CacheComponent || browser.lie && self.__migiCC
        ? Event.CACHE_DATA : Event.DATA, function (keys, origin) {
        //来源不是__brcb则说明不是由bridge触发的，而是真正数据源，生成一个新的记录数据流的对象
        if(origin != self.__brcb && origin != target.__brcb) {
          bridgeStream.gen(self.uid, keys);
        }
        self.__brcb(keys);
      });
    }
  }
  Component.prototype.bridgeTo = function(target, datas) {
    datas=[].slice.call(arguments, 1);target.bridge.apply(target,[this].concat(Array.from(datas)));
  }

  //@overwrite
  Component.prototype.__onDom = function(fake) {
    Element.prototype.__onDom.call(this);
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
        if(browser.lie) {
          e.cancelBubble = true;
        }
        e.stopPropagation && e.stopPropagation();
      }
    }
    self.__stop = stopPropagation;
    //仅考虑用户事件，媒体等忽略
    STOP.forEach(function(name) {
        if(browser.lie && elem.attachEvent) {
          elem.attachEvent('on' + name, stopPropagation);
        }
        else {
          elem.addEventListener(name, stopPropagation);
        }
      });
  }
  //@overwrite
  Component.prototype.__onData = function(k, caller) {
    if(this.virtualDom) {
      this.virtualDom.__onData(k);
    }
    this.children.forEach(function(child) {
      if(child instanceof Component || browser.lie && child && child.__migiCP) {
        child.emit(Event.DATA, k, caller);
      }
      else if(child instanceof VirtualDom || browser.lie && child && child.__migiVD) {
        child.__onData(k);
      }
    });
  }
  Component.prototype.__destroy = function() {
    var self = this;
    self.emit(Event.DESTROY);
    self.__hash = {};
    if(self.__stop) {
      var elem = self.element;
      STOP.forEach(function(name) {
        if(browser.lie && elem.attachEvent) {
          elem.detachEvent('on' + name, self.__stop);
        }
        else {
          elem.removeEventListener(name, self.__stop);
        }
      });
    }
    if(self.model) {
      self.model.__del(self);
      bridgeStream.del(self.uid);
    }
    return self.virtualDom.__destroy();
  }

  Component.fakeDom=function(child) {
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
Object.keys(Element).forEach(function(k){Component[k]=Element[k]});

//hack ie8，clone get/set in Element
var GS = {
  element: {
    get: function() {
      return this.virtualDom ? this.virtualDom.element : null;
    }
  },
  style: {
    get: function() {
      return this.__style;
    },
    set: function(v) {
      this.__style = v;
    }
  },
  model: {
    get: function() {
      return this.__model;
    },
    set: function(v) {
      if(!(v instanceof Model) || browser.lie && !v.__migiMD) {
        throw new Error('can not set model to a non Model: ' + v);
      }
      this.__model = v;
      v.__add(this);
    }
  }
};
['virtualDom', 'ref'].forEach(function(item) {
  GS[item] = {
    get: function() {
      return this['__' + item];
    }
  };
});
if(!browser.lie) {
  Object.defineProperties(Component.prototype, GS);
}

exports["default"]=Component;});