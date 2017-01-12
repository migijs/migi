define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var VirtualDom=function(){var _2=require('./VirtualDom');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var EventBus=function(){var _4=require('./EventBus');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var Model=function(){var _5=require('./Model');return _5.hasOwnProperty("default")?_5["default"]:_5}();
var Stream=function(){var _6=require('./Stream');return _6.hasOwnProperty("default")?_6["default"]:_6}();
var Fastclick=function(){var _7=require('./Fastclick');return _7.hasOwnProperty("default")?_7["default"]:_7}();
var array=function(){var _8=require('./array');return _8.hasOwnProperty("default")?_8["default"]:_8}();

var STOP = ['click', 'dblclick', 'focus', 'blur', 'change', 'contextmenu', 'mousedown', 'mousemove', 'mouseover',
  'mouseup', 'mouseout', 'mousewheel', 'resize', 'scroll', 'select', 'submit', 'DOMActivate', 'DOMFocusIn',
  'DOMFocusOut', 'keydown', 'keypress', 'keyup', 'drag', 'dragstart', 'dragover', 'dragenter', 'dragleave',
  'dragend', 'drop', 'formchange', 'forminput', 'input', 'cut', 'paste', 'reset', 'touchstart',
  'touchmove', 'touchend', 'touchcancel', 'MSGestureEnd', 'MSPointerDown', 'pointerdown', 'MSPointerMove', 'pointermove',
  'MSPointerUp', 'pointerup', 'MSPointerCancel', 'pointercancel'];

!function(){var _9=Object.create(Element.prototype);_9.constructor=Component;Component.prototype=_9}();
  function Component(props, children) {
    //fix循环依赖
    if(props===void 0)props=[];if(children===void 0)children=[];if(Model.hasOwnProperty('default')) {
      Model = Model['default'];
    }

    var self = this;
    var name = self.constructor.__migiName;
    Element.call(this,name, props, children);

    self.__virtualDom = null; //根节点vd引用
    self.__ref = {}; //以ref为attr的vd快速访问引用
    self.__stop = null; //停止冒泡的fn引用
    self.__model = null; //数据模型引用
    self.__allowPropagation = true; //默认是否允许冒泡
    self.__bridgeHash = {}; //桥接记录
    self.__stream = null; //桥接过程中传递的stream对象
    self.__canData = false; //防止添加至DOM前触发无谓的数据更新
    self.__bindHash = {}; //缩略语法中是否设置过默认值

    self.__props.forEach(function(item) {
      var k = item[0];
      var v = item[1];
      self.__init(k, v);
    });

    self.on(Event.DATA, self.__onData);
  }
  Component.prototype.__init = function(k, v) {
    var self = this;
    if(/^on[a-zA-Z]/.test(k)) {
      var name = k.slice(2).toLowerCase();
      self.once(Event.DOM, function() {
        self.virtualDom.__addEvt(name, v);
      });
    }
    else if(k == 'model') {
      self.model = v;
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
    if(!this.__virtualDom) {
      throw new Error('render must return a VirtualDom: ' + this.name);
    }
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
  Component.prototype.find = function(selector) {
    return this.__virtualDom ? this.__virtualDom.find(selector) : null;
  }
  Component.prototype.findAll = function(selector) {
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
    //fastclick处理移动点击点透
    Fastclick.attach(elem);
  }
  Component.prototype.__data = function(k) {
    var self = this;
    //set触发数据变更时，若已DOM则打开开关
    if(self.dom) {
      self.__canData = true;
    }
    self.emit(Event.DATA, k);
    
    if(!Array.isArray(k)) {
      k = [k];
    }
    k.forEach(function(k) {
      //分析桥接
      var bridge = self.__bridgeHash[k];
      if(bridge) {
        var stream = self.__stream || new Stream(self.uid);
        var v = self[k];
        bridge.forEach(function(item) {
          var target = item.target;
          var name = item.name;
          var middleware = item.middleware;
          if(!stream.has(target.uid)) {
            stream.add(target.uid);
            if(target instanceof EventBus) {
              target.emit(Event.DATA, name, middleware ? middleware.call(self, v) : v, stream);
            }
            //先设置桥接对象数据为桥接模式，修改数据后再恢复
            else {
              target.__stream = stream;
              target[name] = middleware ? middleware.call(self, v) : v;
              target.__stream = null;
            }
          }
        });
      }
    });
  }
  //@overwrite
  Component.prototype.__onData = function(k) {
    //未DOM或开关时不触发更新
    if(!this.dom || !this.canData) {
      return;
    }
    if(this.virtualDom) {
      this.virtualDom.__onData(k);
    }
    this.children.forEach(function(child) {
      if(child instanceof VirtualDom) {
        child.__onData(k);
      }
    });
  }
  Component.prototype.__destroy = function() {
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
  Component.prototype.__initBind = function(name) {
    if(this.__bindHash.hasOwnProperty(name)) {
      return false;
    }
    this.__bindHash[name] = true;
    return true;
  }
  Component.prototype.__getBind = function(name) {
    return this[name + '__'];
  }
  Component.prototype.__setBind = function(name, v) {
    this.__bindHash[name] = true;
    this[name + '__'] = v;
    this.__array(name, v);
  }
  Component.prototype.__array = function(name, v) {
    var self = this;
    //检查array类型，替换并侦听array的原型方法
    if(Array.isArray(v) && v.__proto__ != array) {
      v.__proto__ = array;
      v.__ob__ = function() {
        self[name] = self[name];
      }
    }
  }

  var _10={};_10.allowPropagation={};_10.allowPropagation.get =function() {
    return this.__allowPropagation;
  }
  _10.allowPropagation.set =function(v) {
    this.__allowPropagation = v;
  }
  _10.element={};_10.element.get =function() {
    return this.virtualDom ? this.virtualDom.element : null;
  }
  _10.style={};_10.style.get =function() {
    return this.__style;
  }
  _10.style.set =function(v) {
    this.__style = v;
  }
  _10.model={};_10.model.get =function() {
    return this.__model;
  }
  _10.model.set =function(v) {
    if(!(v instanceof Model)) {
      throw new Error('can not set model to a non Model: ' + v);
    }
    this.__model = v;
    v.__add(this);
  }
  _10.virtualDom={};_10.virtualDom.get =function() {
    return this.__virtualDom;
  }
  _10.ref={};_10.ref.get =function() {
    return this.__ref;
  }
  _10.canData={};_10.canData.get =function() {
    return this.__canData;
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
Object.keys(_10).forEach(function(k){Object.defineProperty(Component.prototype,k,_10[k])});Object.keys(Element).forEach(function(k){Component[k]=Element[k]});

//完全一样的桥接数据流方法，复用
['__record', '__unRecord', 'bridgeTo', 'unBridge', 'unBridgeTo'].forEach(function(k) {
  Component.prototype[k] = EventBus.prototype[k];
});

exports["default"]=Component;
});