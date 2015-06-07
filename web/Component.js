define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var VirtualDom=function(){var _2=require('./VirtualDom');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();

!function(){var _4=Object.create(Element.prototype);_4.constructor=Component;Component.prototype=_4}();
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
          if(child.name == name) {
            res.push(child);
            if(first) {
              break;
            }
          }
        }
        else {
          if(child.name == name) {
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

  var _5={};_5.virtualDom={};_5.virtualDom.get =function() {
    return this.__virtualDom;
  }
  _5.element={};_5.element.get =function() {
    return this.__element;
  }
  _5.style={};_5.style.set =function(v) {
    this.__style = v;
  }

  //@override
  Component.prototype.__onDom = function() {
    Element.prototype.__onDom.call(this);
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
  //@override
  Component.prototype.__onData = function(k) {
    if(this.virtualDom) {
      this.virtualDom.emit(Event.DATA, k);
    }
  }
Object.keys(_5).forEach(function(k){Object.defineProperty(Component.prototype,k,_5[k])});Object.keys(Element).forEach(function(k){Component[k]=Element[k]});

exports["default"]=Component;});