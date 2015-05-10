define(function(require, exports, module){var Event=function(){var _1=require('./Event');return _1.hasOwnProperty("Event")?_1.Event:_1.hasOwnProperty("default")?_1.default:_1}();
var VirtualDom=function(){var _2=require('./VirtualDom');return _2.hasOwnProperty("VirtualDom")?_2.VirtualDom:_2.hasOwnProperty("default")?_2.default:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("util")?_3.util:_3.hasOwnProperty("default")?_3.default:_3}();

!function(){var _4=Object.create(Event.prototype);_4.constructor=Component;Component.prototype=_4}();
  function Component(name, props, children) {
    if(props===void 0)props={};children=[].slice.call(arguments, 2);Event.call(this);
    var self = this;
    self.__name = name;
    self.__props = props;
    Object.keys(props).forEach(function(k) {
      if(/^on[A-Z]/.test(k)) {
        var name = k.slice(2).replace(/[A-Z]/g, function(Up) {
          return Up.toLowerCase();
        });
        var cb = props[k];
        self.on(name, function(data) {
          data=[].slice.call(arguments, 0);cb.apply(this,[].concat(function(){var _5=[],_6,_7=data[Symbol.iterator]();while(!(_6=_7.next()).done)_5.push(_6.value);return _5}()));
        });
      }
    });

    self.__children = children;
    self.__childMap = {};
    children.forEach(function(child) {
      if(child instanceof Component) {
        if(self.childMap.hasOwnProperty(child.name)) {
          var temp = self.childMap[child.name];
          if(Array.isArray(temp)) {
            temp.push(child);
          }
          else {
            self.childMap[child.name] = [temp, child];
          }
        }
        else {
          self.childMap[child.name] = child;
        }
      }
    });

    self.__virtualDom = null;
    self.__element = null;
    self.__parent = null;
    self.__id = util.uid();

    self.on(Event.DOM, self.__onDom);
    self.on(Event.DATA, self.__onData);
  }
  //需要被子类覆盖
  Component.prototype.render = function() {
    var _0=this;var props = util.clone(this.props);
    props['migi-name'] = this.name;
    return new (Function.prototype.bind.apply(VirtualDom, [null,'div',props].concat(function(){var _8=[],_9,_10=_0.children[Symbol.iterator]();while(!(_9=_10.next()).done)_8.push(_9.value);return _8}())))();
  }
  Component.prototype.toString = function() {
    this.__virtualDom = this.render();
    this.virtualDom.__parent = this;
    return this.virtualDom.toString();
  }

  var _11={};_11.name={};_11.name.get =function() {
    return this.__name;
  }
  _11.props={};_11.props.get =function() {
    return this.__props;
  }
  _11.props.set =function(v) {
    this.__props = v;
    this.emit(Event.DATA, 'props');
  }
  _11.children={};_11.children.get =function() {
    return this.__children;
  }
  _11.childMap={};_11.childMap.get =function() {
    return this.__childMap;
  }
  _11.virtualDom={};_11.virtualDom.get =function() {
    return this.__virtualDom;
  }
  _11.element={};_11.element.get =function() {
    return this.__element;
  }
  _11.parent={};_11.parent.get =function() {
    return this.__parent;
  }
  _11.id={};_11.id.get =function() {
    return this.__id;
  }

  Component.prototype.__onDom = function() {
    var self = this;
    self.virtualDom.emit(Event.DOM);
    self.__element = self.virtualDom.element;
    self.children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DOM);
      }
    });
    //将所有组件DOM事件停止冒泡，形成shadow特性，但不能阻止捕获
    function stopPropagation(e) {
      e.stopPropagation();
    }
    ['click', 'dblclick', 'focus', 'blur', 'change', 'abort', 'error', 'load', 'mousedown', 'mousemove', 'mouseover',
      'mouseup', 'mouseout', 'reset', 'resize', 'scroll', 'select', 'submit', 'unload', 'DOMActivate',
      'DOMFocusIn', 'DOMFocusOut'].forEach(function(name) {
        self.element.addEventListener(name, stopPropagation);
      });
  }
  Component.prototype.__onData = function(k) {
    if(this.virtualDom) {
      this.virtualDom.emit(Event.DATA, k);
    }
    this.children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DATA, k);
      }
    });
  }
Object.keys(_11).forEach(function(k){Object.defineProperty(Component.prototype,k,_11[k])});Object.keys(Event).forEach(function(k){Component[k]=Event[k]});

exports.default=Component;});