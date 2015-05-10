define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var type=function(){var _1=require('./type');return _1.hasOwnProperty("type")?_1.type:_1.hasOwnProperty("default")?_1.default:_1}();
var HtmlComponent=function(){var _2=require('./HtmlComponent');return _2.hasOwnProperty("HtmlComponent")?_2.HtmlComponent:_2.hasOwnProperty("default")?_2.default:_2}();
var uid=function(){var _3=require('./uid');return _3.hasOwnProperty("uid")?_3.uid:_3.hasOwnProperty("default")?_3.default:_3}();
var clone=function(){var _4=require('./clone');return _4.hasOwnProperty("clone")?_4.clone:_4.hasOwnProperty("default")?_4.default:_4}();

!function(){var _5=Object.create(Event.prototype);_5.constructor=Component;Component.prototype=_5}();
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
          data=[].slice.call(arguments, 0);cb.apply(this,[].concat(function(){var _6=[],_7,_8=data[Symbol.iterator]();while(!(_7=_8.next()).done)_6.push(_7.value);return _6}()));
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

    self.__htmlComponent = null;
    self.__element = null;
    self.__parent = null;
    self.__id = uid();

    self.on(Event.DOM, self.__onDom);
    self.on(Event.DATA, self.__onData);
  }
  //需要被子类覆盖
  Component.prototype.render = function() {
    var props = clone(this.props);
    props['migi-name'] = this.name;
    this.__element = new (Function.prototype.bind.apply(HtmlComponent, [null,'div',props].concat(function(){var _9=[],_10,_11=this.children[Symbol.iterator]();while(!(_10=_11.next()).done)_9.push(_10.value);return _9}())))();
    return this.element;
  }
  Component.prototype.toString = function() {
    this.__htmlComponent = this.render();
    this.htmlComponent.parent = this;
    return this.htmlComponent.toString();
  }

  var _12={};_12.name={};_12.name.get =function() {
    return this.__name;
  }
  _12.props={};_12.props.get =function() {
    return this.__props;
  }
  _12.props.set =function(v) {
    this.__props = v;
    this.emit(Event.DATA, 'props');
  }
  _12.children={};_12.children.get =function() {
    return this.__children;
  }
  _12.childMap={};_12.childMap.get =function() {
    return this.__childMap;
  }
  _12.htmlComponent={};_12.htmlComponent.get =function() {
    return this.__htmlComponent;
  }
  _12.element={};_12.element.get =function() {
    return this.__element;
  }
  _12.parent={};_12.parent.get =function() {
    return this.__parent;
  }
  _12.id={};_12.id.get =function() {
    return this.__id;
  }

  Component.prototype.__onDom = function() {
    var self = this;
    self.htmlComponent.emit(Event.DOM);
    self.__element = self.htmlComponent.element;
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
  Component.prototype.__onData = function(target, k) {
    if(this.htmlComponent) {
      this.htmlComponent.emit(Event.DATA, target, k);
    }
    this.children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DATA, target, k);
      }
    });
  }
Object.keys(_12).forEach(function(k){Object.defineProperty(Component.prototype,k,_12[k])});Object.keys(Event).forEach(function(k){Component[k]=Event[k]});

exports.default=Component;});