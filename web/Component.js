define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var VirtualDom=function(){var _1=require('./VirtualDom');return _1.hasOwnProperty("VirtualDom")?_1.VirtualDom:_1.hasOwnProperty("default")?_1.default:_1}();
var util=function(){var _2=require('./util');return _2.hasOwnProperty("util")?_2.util:_2.hasOwnProperty("default")?_2.default:_2}();

!function(){var _3=Object.create(Event.prototype);_3.constructor=Component;Component.prototype=_3}();
  function Component(name, props, children) {
    if(props===void 0)props={};children=[].slice.call(arguments, 2);Event.call(this);
    var self = this;
    self.__name = name;
    self.__props = props;
    self.__style = null;
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

    self.__children = children;
    self.__virtualDom = null;
    self.__element = null;
    self.__parent = null;
    self.__id = util.uid();

    self.on(Event.DOM, self.__onDom);
    self.on(Event.DATA, self.__onData);
  }
  //需要被子类覆盖
  Component.prototype.render = function() {
    return new (Function.prototype.bind.apply(VirtualDom, [null,'div',this.props].concat(Array.from(this.children))));
  }
  Component.prototype.toString = function() {
    this.__virtualDom = this.render();
    this.virtualDom.__parent = this;
    if(this.__style) {
      this.virtualDom.style = this.__style;
    }
    return this.virtualDom.toString();
  }
  Component.prototype.inTo = function(dom) {
    var s = this.toString();
    if(util.isString(dom)) {
      document.querySelector(dom).innerHTML = s;
    }
    else if(dom) {
      dom.innerHTML = s;
    }
  }
  Component.prototype.find = function(name) {
    return this.findAll(name)[0];
  }
  Component.prototype.findAll = function(name) {
    var res = [];
    for(var i = 0, len = this.children.length; i < len; i++) {
      var child = this.children[i];
      if(child instanceof Component || child instanceof VirtualDom) {
        if(child instanceof Component) {
          if(child.name == name) {
            res.push(child);
          }
        }
        else if(child instanceof VirtualDom) {
          if(child.name == name) {
            res.push(child);
            res = res.concat(child.findAll(name));
          }
        }
      }
    }
    if(this.virtualDom) {
      res = res.concat(this.virtualDom.findAll(name));
    }
    return res;
  }

  var _4={};_4.name={};_4.name.get =function() {
    return this.__name;
  }
  _4.props={};_4.props.get =function() {
    return this.__props;
  }
  _4.children={};_4.children.get =function() {
    return this.__children;
  }
  _4.virtualDom={};_4.virtualDom.get =function() {
    return this.__virtualDom;
  }
  _4.element={};_4.element.get =function() {
    return this.__element;
  }
  _4.parent={};_4.parent.get =function() {
    return this.__parent;
  }
  _4.id={};_4.id.get =function() {
    return this.__id;
  }
  _4.style={};_4.style.set =function(v) {
    this.__style = v;
  }

  Component.prototype.__onDom = function() {
    var self = this;
    self.virtualDom.emit(Event.DOM);
    self.__element = self.virtualDom.element;
    self.element.setAttribute('migi-name', this.name);
    self.children.forEach(function(child) {
      if(child instanceof Component) {
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
  Component.prototype.__onData = function(k) {
    if(this.virtualDom) {
      this.virtualDom.emit(Event.DATA, k);
    }
  }
Object.keys(_4).forEach(function(k){Object.defineProperty(Component.prototype,k,_4[k])});Object.keys(Event).forEach(function(k){Component[k]=Event[k]});

exports.default=Component;});