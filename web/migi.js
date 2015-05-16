define(function(require, exports, module){var lefty=function(){var _0=require('lefty');return _0.hasOwnProperty("lefty")?_0.lefty:_0.hasOwnProperty("default")?_0.default:_0}();
var jaw=function(){var _1=require('jaw');return _1.hasOwnProperty("jaw")?_1.jaw:_1.hasOwnProperty("default")?_1.default:_1}();
var Event=function(){var _2=require('./Event');return _2.hasOwnProperty("Event")?_2.Event:_2.hasOwnProperty("default")?_2.default:_2}();
var Component=function(){var _3=require('./Component');return _3.hasOwnProperty("Component")?_3.Component:_3.hasOwnProperty("default")?_3.default:_3}();
var VirtualDom=function(){var _4=require('./VirtualDom');return _4.hasOwnProperty("VirtualDom")?_4.VirtualDom:_4.hasOwnProperty("default")?_4.default:_4}();
var NonVisualComponent=function(){var _5=require('./NonVisualComponent');return _5.hasOwnProperty("NonVisualComponent")?_5.NonVisualComponent:_5.hasOwnProperty("default")?_5.default:_5}();
var CacheComponent=function(){var _6=require('./CacheComponent');return _6.hasOwnProperty("CacheComponent")?_6.CacheComponent:_6.hasOwnProperty("default")?_6.default:_6}();
var util=function(){var _7=require('./util');return _7.hasOwnProperty("util")?_7.util:_7.hasOwnProperty("default")?_7.default:_7}();
var Obj=function(){var _8=require('./Obj');return _8.hasOwnProperty("Obj")?_8.Obj:_8.hasOwnProperty("default")?_8.default:_8}();
var Cb=function(){var _9=require('./Cb');return _9.hasOwnProperty("Cb")?_9.Cb:_9.hasOwnProperty("default")?_9.default:_9}();

var migi = {
  render:function(component, dom) {
    component.append(dom);
    component.emit(Event.DOM);
    return component;
  },
  createElement:function(name, props, children) {
    children=[].slice.call(arguments, 2);if(util.isString(name)) {
      return new (Function.prototype.bind.apply(VirtualDom, [null,name,props].concat(Array.from(children))));
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new (Function.prototype.bind.apply(Klass, [null,name,props].concat(Array.from(children))));
    }
  },
  Event:Event,
  eventBus: Event.mix({}),
  Component:Component,
  NonVisualComponent:NonVisualComponent,
  CacheComponent:CacheComponent,
  VirtualDom:VirtualDom,
  Obj:Obj,
  Cb:Cb
};

if(typeof window !== 'undefined') {
  window.migi = migi;
}

exports.default=migi;});