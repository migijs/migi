define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("Component")?_1.Component:_1.hasOwnProperty("default")?_1.default:_1}();
var VirtualDom=function(){var _2=require('./VirtualDom');return _2.hasOwnProperty("VirtualDom")?_2.VirtualDom:_2.hasOwnProperty("default")?_2.default:_2}();
var NonVisualComponent=function(){var _3=require('./NonVisualComponent');return _3.hasOwnProperty("NonVisualComponent")?_3.NonVisualComponent:_3.hasOwnProperty("default")?_3.default:_3}();
var CacheComponent=function(){var _4=require('./CacheComponent');return _4.hasOwnProperty("CacheComponent")?_4.CacheComponent:_4.hasOwnProperty("default")?_4.default:_4}();
var util=function(){var _5=require('./util');return _5.hasOwnProperty("util")?_5.util:_5.hasOwnProperty("default")?_5.default:_5}();
var Obj=function(){var _6=require('./Obj');return _6.hasOwnProperty("Obj")?_6.Obj:_6.hasOwnProperty("default")?_6.default:_6}();
var Cb=function(){var _7=require('./Cb');return _7.hasOwnProperty("Cb")?_7.Cb:_7.hasOwnProperty("default")?_7.default:_7}();

var migi = {
  render:function(component, dom) {
    if(dom) {
      component.inTo(dom);
    }
    return component;
  },
  createElement:function(name, props, children) {
    children=[].slice.call(arguments, 2);if(util.isString(name)) {
      return new (Function.prototype.bind.apply(VirtualDom, [null,name,props].concat(Array.from(children))));
    }
    else {
      return new (Function.prototype.bind.apply(name, [null,props].concat(Array.from(children))));
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

if(!util.isUndefined(window)) {
  window.migi = migi;
}

exports.default=migi;});