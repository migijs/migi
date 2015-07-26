define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var VirtualDom=function(){var _2=require('./VirtualDom');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var browser=function(){var _4=require('./browser');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var EventBus=function(){var _5=require('./EventBus');return _5.hasOwnProperty("default")?_5["default"]:_5}();

var bridgeOrigin = {};

!function(){var _6=Object.create(Element.prototype);_6.constructor=Component;Component.prototype=_6}();
  function Component(props, children) {
    if(props===void 0)props={};if(children===void 0)children=[];var self = this;
    var name = self.constructor.toString();
    name = /^function\s+([\w$]+)/.exec(name)[1];
    Element.call(this,name, props, children);

    self.__virtualDom = null; //根节点vd引用
    self.__ref = {}; //以ref为attr的vd快速访问引用

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
    });

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiCp = true;
      this.__migiNode = {
        __gs: gs
      };
    }

    self.on(Event.DATA, self.__onData);
  }
  //需要被子类覆盖
  //@abstract
  Component.prototype.render = function() {
    return new VirtualDom('div', this.$props, this.$children);
  }
  //@override
  Component.prototype.toString = function() {
    this.__virtualDom = this.render();
    this.$virtualDom.__parent = this;
    if(this.__style) {
      this.$virtualDom.$style = this.__style;
    }
    return this.$virtualDom.toString();
  }
  Component.prototype.$findChild = function(name) {
    return this.$findChildren(name, true)[0];
  }
  Component.prototype.$findChildren = function(name, first) {
    var res = [];
    for(var i = 0, len = this.$children.length; i < len; i++) {
      var child = this.$children[i];
      if(child instanceof Element) {
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
  Component.prototype.$find = function(name) {
    return this.$findAll(name, true)[0];
  }
  Component.prototype.$findAll = function(name, first) {
    return this.$virtualDom.$findAll(name, first);
  }
  Component.prototype.__brcb = function(target, keys, datas) {
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
  Component.prototype.$bridge = function(target, datas) {
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self.$name);
    }
    if(!(target instanceof EventBus) && !(target instanceof Component) && (browser.lie && !target.__migiCp)) {
      throw new Error('can only bridge to EventBus/Component: ' + self.$name);
    }
    self.on(self instanceof migi.CacheComponent ? Event.CACHE_DATA : Event.DATA, function(keys, origin) {
      //来源不是__brcb则说明不是由bridge触发的，而是真正数据源，记录uid
      if(origin != self.__brcb && origin != target.__brcb) {
        bridgeOrigin = {};
        bridgeOrigin[self.$uid] = true;
      }
      self.__brcb(target, keys, datas);
    });
  }
  Component.prototype.$bridgeTo = function(target, datas) {
    target.$bridge(this, datas);
  }

  var _7={};_7.$virtualDom={};_7.$virtualDom.get =function() {
    return this.__virtualDom;
  }
  //@overwrite
  _7.$element={};_7.$element.get =function() {
    return this.$virtualDom ? this.$virtualDom.$element : null;
  }
  _7.$style={};_7.$style.get =function() {
    return this.__style;
  }
  _7.$style.set =function(v) {
    this.__style = v;
  }
  _7.$ref={};_7.$ref.get =function() {
    return this.__ref;
  }

  //@overwrite
  Component.prototype.__onDom = function(fake) {
    Element.prototype.__onDom.call(this);
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
        e.stopPropagation();
      }
    }
    //仅考虑用户事件，媒体等忽略
    ['click', 'dblclick', 'focus', 'blur', 'change', 'contextmenu', 'mousedown', 'mousemove', 'mouseover',
      'mouseup', 'mouseout', 'mousewheel', 'resize', 'scroll', 'select', 'submit', 'DOMActivate', 'DOMFocusIn',
      'DOMFocusOut', 'keydown', 'keypress', 'keyup', 'drag', 'dragstart', 'dragover', 'dragenter', 'dragleave',
      'dragend', 'drop', 'formchange', 'forminput', 'input', 'cut', 'paste', 'reset', 'touch', 'touchstart',
      'touchmove', 'touchend'].forEach(function(name) {
        self.$element.addEventListener(name, stopPropagation);
      });
  }
  //@overwrite
  Component.prototype.__onData = function(k, caller) {
    if(this.$virtualDom) {
      this.$virtualDom.__onData(k);
    }
    this.$children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DATA, k, caller);
      }
      else if(child instanceof VirtualDom) {
        child.__onData(k);
      }
    });
  }
  Component.prototype.__destroy = function() {
    this.emit(Event.DESTROY);
    this.__hash = {};
    return this.$virtualDom.__destroy();
  }

  Component.fakeDom=function(child) {
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
Object.keys(_7).forEach(function(k){Object.defineProperty(Component.prototype,k,_7[k])});Object.keys(Element).forEach(function(k){Component[k]=Element[k]});

//hack ie8，clone get/set in Element&Component
var gs = {
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
  },
  $top: {
    get: function() {
      if(!this.__top && this.$parent) {
        if(this.$parent instanceof migi.Component) {
          this.__top = this.$parent;
        }
        else {
          this.__top = this.$parent.$top;
        }
      }
      return this.__top;
    }
  }
};
['name', 'props', 'children', 'ref', 'parent', 'virtualDom', 'uid', 'dom'].forEach(function(item) {
  gs['$' + item] = {
    get: function() {
      return this['__' + item];
    }
  };
});

exports["default"]=Component;});