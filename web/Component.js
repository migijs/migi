define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var type=function(){var _1=require('./type');return _1.hasOwnProperty("type")?_1.type:_1.hasOwnProperty("default")?_1.default:_1}();
var HtmlComponent=function(){var _2=require('./HtmlComponent');return _2.hasOwnProperty("HtmlComponent")?_2.HtmlComponent:_2.hasOwnProperty("default")?_2.default:_2}();
var uid=function(){var _3=require('./uid');return _3.hasOwnProperty("uid")?_3.uid:_3.hasOwnProperty("default")?_3.default:_3}();
var clone=function(){var _4=require('./clone');return _4.hasOwnProperty("clone")?_4.clone:_4.hasOwnProperty("default")?_4.default:_4}();

!function(){var _5=Object.create(Event.prototype);_5.constructor=Component;Component.prototype=_5}();
  function Component(name, props, children) {
    if(props===void 0)props={};children=[].slice.call(arguments, 2);Event.call(this);
    var self = this;
    self.name = name;
    self.props = props;
    self.children = children;
    self.childrenMap = {};
    children.forEach(function(child) {
      if(child instanceof Component) {
        if(self.childrenMap.hasOwnProperty(child.name)) {
          var temp = self.childrenMap[child.name];
          if(Array.isArray(temp)) {
            temp.push(child);
          }
          else {
            self.childrenMap[child.name] = [temp, child];
          }
        }
        else {
          self.childrenMap[child.name] = child;
        }
      }
    });
    self.htmlComponent = null;
    self.element = null;
    self.parent = null;
    self.id = uid();

    self.on(Event.DOM, self.__onDom);
    self.on(Event.DATA, self.__onData);
  }
  //需要被子类覆盖
  Component.prototype.render = function() {
    var props = clone(this.props);
    props['migi-name'] = this.name;
    this.element = new (Function.prototype.bind.apply(HtmlComponent, [null,'div',props].concat(function(){var _6=[],_7,_8=this.children[Symbol.iterator]();while(!(_7=_8.next()).done)_6.push(_7.value);return _6}())))();
    return this.element;
  }
  Component.prototype.toString = function() {
    this.htmlComponent = this.render();
    this.htmlComponent.parent = this;
    return this.htmlComponent.toString();
  }
  Component.prototype.closestHtml = function(name) {
    var parent = this.parent;
    while(parent) {
      if(parent instanceof Component == false) {
        if(name && parent.name == name) {
          return parent;
        }
        return parent;
      }
      parent = parent.parent;
    }
    return document.body;
  }
  Component.prototype.closeset = function(name) {
    var parent = this.parent;
    while(parent) {
      if(parent instanceof Component) {
        if(name && parent.name == name) {
          return parent;
        }
        return parent;
      }
      parent = parent.parent;
    }
  }

  Component.prototype.__onDom = function() {
    var self = this;
    self.htmlComponent.emit(Event.DOM);
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
Object.keys(Event).forEach(function(k){Component[k]=Event[k]});

exports.default=Component;});