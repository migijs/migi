var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var util=function(){var _2=require('./util');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var browser=function(){var _3=require('./browser');return _3.hasOwnProperty("default")?_3["default"]:_3}();

!function(){var _4=Object.create(Component.prototype);_4.constructor=CachedComponent;CachedComponent.prototype=_4}();
  function CachedComponent(data) {
    data=[].slice.call(arguments, 0);Component.apply(this,[].concat(Array.from(data)));
    this.__handler = {};
    this.__bridgeHandler = {};
    this.__ccb = null;
    this.__bcb = null;
    this.__flag = false;

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiCC = true;
      return this.__hackLie(CachedComponent);
    }
  }

  //@overwrite
  CachedComponent.prototype.__onData = function(k) {
    var _5=this;var self = this;
    if(self.__flag) {
      self.__bridgeData(k);
      return;
    }
    if(self.__handler.hasOwnProperty(k)) {
      return;
    }
    self.__handler[k] = true;
    if(!self.__ccb) {
      self.__ccb = true;
      setTimeout(function() {
        var keys = Object.keys(self.__handler);
        self.__handler = {};
        self.__ccb = null;
        keys = keys.length > 1 ? keys : keys[0];
        Component.prototype.__onData.call(_5,keys);
        self.emit(Event.CACHE_DATA, keys);
      }, 1);
    }
  }
  CachedComponent.prototype.__bridgeData = function(k) {
    var _6=this;var self = this;
    if(self.__bridgeHandler.hasOwnProperty(k)) {
      return;
    }
    self.__bridgeHandler[k] = true;
    if(!self.__bcb) {
      self.__bcb = true;
      setTimeout(function() {
        var keys = Object.keys(self.__bridgeHandler);
        self.__handler = {};
        self.__bcb = null;
        keys = keys.length > 1 ? keys : keys[0];
        Component.prototype.__onData.call(_6,keys);
      }, 1);
    }
  }

  //逻辑和Component复用，代码有点交叉的味道
  //bind{}
  //bridge{}
Object.keys(Component).forEach(function(k){CachedComponent[k]=Component[k]});

exports["default"]=CachedComponent;