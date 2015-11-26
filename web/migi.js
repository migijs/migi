define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var EventBus=function(){var _2=require('./EventBus');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var Model=function(){var _3=require('./Model');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var CacheModel=function(){var _4=require('./CacheModel');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var Component=function(){var _5=require('./Component');return _5.hasOwnProperty("default")?_5["default"]:_5}();
var VirtualDom=function(){var _6=require('./VirtualDom');return _6.hasOwnProperty("default")?_6["default"]:_6}();
var NonVisualComponent=function(){var _7=require('./NonVisualComponent');return _7.hasOwnProperty("default")?_7["default"]:_7}();
var CacheComponent=function(){var _8=require('./CacheComponent');return _8.hasOwnProperty("default")?_8["default"]:_8}();
var util=function(){var _9=require('./util');return _9.hasOwnProperty("default")?_9["default"]:_9}();
var Obj=function(){var _10=require('./Obj');return _10.hasOwnProperty("default")?_10["default"]:_10}();
var Cb=function(){var _11=require('./Cb');return _11.hasOwnProperty("default")?_11["default"]:_11}();
var cachePool=function(){var _12=require('./cachePool');return _12.hasOwnProperty("default")?_12["default"]:_12}();
var util=function(){var _13=require('./util');return _13.hasOwnProperty("default")?_13["default"]:_13}();
var browser=function(){var _14=require('./browser');return _14.hasOwnProperty("default")?_14["default"]:_14}();
var sort=function(){var _15=require('./sort');return _15.hasOwnProperty("default")?_15["default"]:_15}();
var mix=function(){var _16=require('./mix');return _16.hasOwnProperty("default")?_16["default"]:_16}();
var hash=function(){var _17=require('./hash');return _17.hasOwnProperty("default")?_17["default"]:_17}();
var Fastclick=function(){var _18=require('./Fastclick');return _18.hasOwnProperty("default")?_18["default"]:_18}();

var migi = {
  render:function(element, dom) {
    if(dom) {
      element.appendTo(dom);
    }
    return element;
  },
  createCp:function(cp, props, children) {
    return hash.set(new cp(props, children));
  },
  createVd:function(name, props, children) {
    if({ script: true, style: true, svg: true }.hasOwnProperty(name.toLowerCase())) {
      throw new Error('can not create VirtualDom of: ' + name);
    }
    return hash.set(cachePool.index ? cachePool.get().__reset(name, props, children) : new VirtualDom(name, props, children));
  },
  Event:Event,
  Model:Model,
  CacheModel:CacheModel,
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
  sort:sort,
  mix:mix,
  hash:hash,
  Fastclick:Fastclick
};

if(typeof window != 'undefined') {
  window.migi = migi;
  Fastclick.attach(document.body);
}

exports["default"]=migi;});