define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var util=function(){var _2=require('./util');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var browser=function(){var _3=require('./browser');return _3.hasOwnProperty("default")?_3["default"]:_3}();

!function(){var _4=Object.create(Component.prototype);_4.constructor=CachedComponent;CachedComponent.prototype=_4}();
  function CachedComponent(data) {
    data=[].slice.call(arguments, 0);Component.apply(this,[].concat(Array.from(data)));
    this.__handler = {}; //普通状态下缓存data key的hash
    this.__bridgeHandler = {}; //flag为true时的hash
    this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识
    this.__bcb = false; //flag为true时的缓存时间内状态标识
    this.__flag = false; //被数据流桥接的数据分发到时，标识true，不走普通逻辑，进入另外一个缓存时间逻辑

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiCC = true;
      return this.__hackLie(CachedComponent);
    }
  }

  //@overwrite
  CachedComponent.prototype.__onData = function(k, caller) {
    var _5=this;var self = this;
    if(self.__flag) {
      self.__bridgeData(k);
      return;
    }
    //被桥接的数据缓存作废
    delete self.__bridgeHandler[k];
    if(self.__handler.hasOwnProperty(k)) {
      return;
    }
    self.__handler[k] = true;
    if(!self.__ccb) {
      self.__ccb = true;
      setTimeout(function() {
        var keys = Object.keys(self.__handler);
        self.__handler = {};
        self.__ccb = false;
        //可能被清空
        if(!keys.length) {
          return;
        }
        keys = keys.length > 1 ? keys : keys[0];
        Component.prototype.__onData.call(_5,keys);
        self.emit(Event.CACHE_DATA, keys, caller);
      }, 1);
    }
  }
  CachedComponent.prototype.__bridgeData = function(k) {
    var _6=this;var self = this;
    //之前非桥接的数据缓存作废
    delete self.__handler[k];
    if(self.__bridgeHandler.hasOwnProperty(k)) {
      return;
    }
    self.__bridgeHandler[k] = true;
    if(!self.__bcb) {
      self.__bcb = true;
      setTimeout(function() {
        var keys = Object.keys(self.__bridgeHandler);
        self.__bcb = false;
        //可能被清空
        if(!keys.length) {
          return;
        }
        keys = keys.length > 1 ? keys : keys[0];
        Component.prototype.__onData.call(_6,keys);
        //fake来源，来自于桥接bridge
        self.emit(Event.CACHE_DATA, keys, self.__brcb);
      }, 1);
    }
  }

  //逻辑和Component复用，代码有点交叉的味道
  //bind{}
  //bridge{}
Object.keys(Component).forEach(function(k){CachedComponent[k]=Component[k]});

exports["default"]=CachedComponent;});