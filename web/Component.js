define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var type=function(){var _1=require('./type');return _1.hasOwnProperty("type")?_1.type:_1.hasOwnProperty("default")?_1.default:_1}();
var HtmlComponent=function(){var _2=require('./HtmlComponent');return _2.hasOwnProperty("HtmlComponent")?_2.HtmlComponent:_2.hasOwnProperty("default")?_2.default:_2}();
var uid=function(){var _3=require('./uid');return _3.hasOwnProperty("uid")?_3.uid:_3.hasOwnProperty("default")?_3.default:_3}();

!function(){var _4=Object.create(Event.prototype);_4.constructor=Component;Component.prototype=_4}();
  function Component(name, props, children) {
    if(props===void 0)props={};children=[].slice.call(arguments, 2);Event.call(this);
    this.name = name;
    this.props = props;
    this.children = children;
    this.htmlComponent = null;
    this.element = null;
    this.parent = null;
    this.id = uid();

    this.on(Event.DOM, this.onDom);
    this.on(Event.DATA, this.onData);
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

  Component.prototype.onDom = function() {
    this.htmlComponent.emit(Event.DOM);
  }
  Component.prototype.onData = function(target, k) {
    this.htmlComponent.emit('data', target, k);
  }
Object.keys(Event).forEach(function(k){Component[k]=Event[k]});

exports.default=Component;});