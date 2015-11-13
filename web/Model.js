define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var EventBus=function(){var _1=require('./EventBus');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var util=function(){var _2=require('./util');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var browser=function(){var _3=require('./browser');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var Component=function(){var _4=require('./Component');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var Stream=function(){var _5=require('./Stream');return _5.hasOwnProperty("default")?_5["default"]:_5}();

var uid = 0;

!function(){var _6=Object.create(Event.prototype);_6.constructor=Model;Model.prototype=_6}();
  function Model() {
    Event.call(this);
    this.$ = this.$$ = this;
    this.uid = 'm' + uid++;
    this.__name = this.constructor.__migiName;
    this.__ref = [];
    this.__bridgeHash = {};

    this.on(Event.DATA, this.__onData);

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiMD = this;
      return this.__hackLie(Model, GS);
    }
  }

  Model.prototype.__onData = function(k, caller) {
    k = 'model.' + k;
    this.__ref.forEach(function(cp) {
      cp.emit(Event.DATA, k, caller);
    });
  }

  Model.prototype.__add = function(cp) {
    if(this.__ref.indexOf(cp) == -1) {
      this.__ref.push(cp);
    }
  }
  Model.prototype.__del = function(cp) {
    var i = this.__ref.indexOf(cp);
    if(i > -1) {
      this.__ref.splice(i, 1);
    }
  }
Object.keys(Event).forEach(function(k){Model[k]=Event[k]});
//完全一样的桥接数据流方法，复用
['__data', '__record', 'bridge', 'bridgeTo', '__unRecord', 'unBridge', 'unBridgeTo'].forEach(function(k) {
  Model.prototype[k] = Component.prototype[k];
});

var GS = {};
['name'].forEach(function(item) {
  GS[item] = {
    get: function() {
      return this['__' + item];
    }
  };
});
if(!browser.lie) {
  Object.defineProperties(Model.prototype, GS);
}

exports["default"]=Model;});