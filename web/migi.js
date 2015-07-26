define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var EventBus=function(){var _2=require('./EventBus');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var Component=function(){var _3=require('./Component');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var VirtualDom=function(){var _4=require('./VirtualDom');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var NonVisualComponent=function(){var _5=require('./NonVisualComponent');return _5.hasOwnProperty("default")?_5["default"]:_5}();
var CacheComponent=function(){var _6=require('./CacheComponent');return _6.hasOwnProperty("default")?_6["default"]:_6}();
var util=function(){var _7=require('./util');return _7.hasOwnProperty("default")?_7["default"]:_7}();
var Obj=function(){var _8=require('./Obj');return _8.hasOwnProperty("default")?_8["default"]:_8}();
var Cb=function(){var _9=require('./Cb');return _9.hasOwnProperty("default")?_9["default"]:_9}();
var cachePool=function(){var _10=require('./cachePool');return _10.hasOwnProperty("default")?_10["default"]:_10}();
var util=function(){var _11=require('./util');return _11.hasOwnProperty("default")?_11["default"]:_11}();
var browser=function(){var _12=require('./browser');return _12.hasOwnProperty("default")?_12["default"]:_12}();
var sort=function(){var _13=require('./sort');return _13.hasOwnProperty("default")?_13["default"]:_13}();

var migi = {
  render:function(element, dom) {
    if(dom) {
      element.$inTo(dom);
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
  EventBus:EventBus,
  eventBus: new EventBus,
  Element:Element,
  Component:Component,
  NonVisualComponent:NonVisualComponent,
  CacheComponent:CacheComponent,
  VirtualDom:VirtualDom,
  Obj:Obj,
  Cb:Cb,
  util:util,
  browser:browser,
  sort:sort
};

if(typeof window != 'undefined') {
  window.migi = migi;
}

exports["default"]=migi;});