var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var Component=function(){var _2=require('./Component');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var VirtualDom=function(){var _3=require('./VirtualDom');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var NonVisualComponent=function(){var _4=require('./NonVisualComponent');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var CacheComponent=function(){var _5=require('./CacheComponent');return _5.hasOwnProperty("default")?_5["default"]:_5}();
var util=function(){var _6=require('./util');return _6.hasOwnProperty("default")?_6["default"]:_6}();
var Obj=function(){var _7=require('./Obj');return _7.hasOwnProperty("default")?_7["default"]:_7}();
var Cb=function(){var _8=require('./Cb');return _8.hasOwnProperty("default")?_8["default"]:_8}();
var cachePool=function(){var _9=require('./cachePool');return _9.hasOwnProperty("default")?_9["default"]:_9}();
var eventBus=function(){var _10=require('./eventBus');return _10.hasOwnProperty("default")?_10["default"]:_10}();

var migi = {
  render:function(element, dom) {
    if(dom) {
      element.inTo(dom);
    }
    return element;
  },
  createCp:function(name, props, children) {
    return new name(props, children);
  },
  createVd:function(name, props, children) {
    return cachePool.index ? cachePool.get().__reset(name, props, children) : new VirtualDom(name, props, children);
  },
  Event:Event,
  eventBus:eventBus,
  Element:Element,
  Component:Component,
  NonVisualComponent:NonVisualComponent,
  CacheComponent:CacheComponent,
  VirtualDom:VirtualDom,
  Obj:Obj,
  Cb:Cb
};

if(typeof window != 'undefined') {
  window.migi = migi;
}

exports["default"]=migi;