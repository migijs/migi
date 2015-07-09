define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var VirtualDom=function(){var _2=require('./VirtualDom');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var EventBus=function(){var _4=require('./EventBus');return _4.hasOwnProperty("default")?_4["default"]:_4}();

var bindOrigin = {};
var bridgeOrigin = {};

!function(){var _5=Object.create(Element.prototype);_5.constructor=Component;Component.prototype=_5}();
  function Component(props, children) {
    if(props===void 0)props={};if(children===void 0)children=[];var self = this;
    var name = self.constructor.toString();
    name = /^function\s+([\w$]+)/.exec(name)[1];
    Element.call(this,name, props, children);

    self.__virtualDom = null;

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
  }
  //需要被子类覆盖
  //@abstract
  Component.prototype.render = function() {
    return new VirtualDom('div', this.props, this.children);
  }
  //@override
  Component.prototype.toString = function() {
    this.__virtualDom = this.render();
    this.virtualDom.__parent = this;
    if(this.__style) {
      this.virtualDom.style = this.__style;
    }
    return this.virtualDom.toString();
  }
  Component.prototype.findChild = function(name) {
    return this.findChildren(name, true)[0];
  }
  Component.prototype.findChildren = function(name, first) {
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
  Component.prototype.find = function(name) {
    return this.findAll(name, true)[0];
  }
  Component.prototype.findAll = function(name, first) {
    return this.virtualDom.findAll(name, first);
  }
  Component.prototype.__bicb = function(target, keys, include, exclude) {
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
  Component.prototype.bind = function(target, include, exclude) {
    var self = this;
    if(target == this) {
      throw new Error('can not bind self: ' + self.name);
    }
    if(!(target instanceof EventBus) && !(target instanceof Component)) {
      throw new Error('can only bind to EventBus/Component: ' + self.name);
    }
    //Componenet和CacheComponent公用逻辑，设计有点交叉的味道，功能却正确
    //CacheComponent有个__handler用以存储缓存数据变更，以此和Componenet区分
    self.on(self instanceof migi.CacheComponent ? Event.CACHE_DATA : Event.DATA, function(keys, origin) {
      //来源不是bicb则说明不是由bind触发的，而是真正数据源，记录uid
      if(origin != self.__bicb) {
        bindOrigin = {};
        bindOrigin[self.uid] = true;
      }
      self.__bicb(target, keys, include, exclude);
    });
    target.on(target instanceof migi.CacheComponent ? Event.CACHE_DATA : Event.DATA, function(keys, origin) {
      //来源不是bicb则说明不是由bind触发的，而是真正数据源，记录uid
      if(origin != target.__bicb) {
        bindOrigin = {};
        bindOrigin[target.uid] = true;
      }
      target.__bicb(self, keys, include, exclude);
    });
  }
  Component.prototype.bindTo = function(target, include, exclude) {
    target.bind(this, include, exclude);
  }
  Component.prototype.__brcb = function(target, keys, datas) {
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
  Component.prototype.bridge = function(target, datas) {
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self.name);
    }
    if(!(target instanceof EventBus) && !(target instanceof Component)) {
      throw new Error('can only bridge to EventBus/Component: ' + self.name);
    }
    self.on(self instanceof migi.CacheComponent ? Event.CACHE_DATA : Event.DATA, function(keys, origin) {
      //来源不是__brcb则说明不是由bridge触发的，而是真正数据源，记录uid
      if(origin != self.__brcb && origin != target.__brcb) {
        bridgeOrigin = {};
        bridgeOrigin[self.uid] = true;
      }
      self.__brcb(target, keys, datas);
    });
  }
  Component.prototype.bridgeTo = function(target, datas) {
    target.bridge(this, datas);
  }

  var _6={};_6.virtualDom={};_6.virtualDom.get =function() {
    return this.__virtualDom;
  }
  //@overwrite
  _6.element={};_6.element.get =function() {
    return this.virtualDom ? this.virtualDom.element : null;
  }
  _6.style={};_6.style.set =function(v) {
    this.__style = v;
  }

  //@overwrite
  Component.prototype.__onDom = function() {
    Element.prototype.__onDom.call(this);
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
  Component.prototype.__onData = function(k) {
    if(this.virtualDom) {
      this.virtualDom.emit(Event.DATA, k);
    }
    this.children.forEach(function(child) {
      child.emit(Event.DATA, k);
    });
  }
  Component.prototype.__destroy = function() {
    return this.virtualDom.__destroy();
  }
Object.keys(_6).forEach(function(k){Object.defineProperty(Component.prototype,k,_6[k])});Object.keys(Element).forEach(function(k){Component[k]=Element[k]});

exports["default"]=Component;});