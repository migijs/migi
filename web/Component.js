define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var type=function(){var _1=require('./type');return _1.hasOwnProperty("type")?_1.type:_1.hasOwnProperty("default")?_1.default:_1}();
var HtmlComponent=function(){var _2=require('./HtmlComponent');return _2.hasOwnProperty("HtmlComponent")?_2.HtmlComponent:_2.hasOwnProperty("default")?_2.default:_2}();
var uid=function(){var _3=require('./uid');return _3.hasOwnProperty("uid")?_3.uid:_3.hasOwnProperty("default")?_3.default:_3}();

!function(){var _4=Object.create(Event.prototype);_4.constructor=Component;Component.prototype=_4}();
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
    this.element = new HtmlComponent(this.name);
    return this.element;
  }
  Component.prototype.toString = function() {
    this.htmlComponent = this.render();
    this.htmlComponent.parent = this;
    return this.htmlComponent.toString();
  }

  Component.prototype.__onDom = function() {
    this.htmlComponent.emit(Event.DOM);
    this.children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DOM);
      }
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