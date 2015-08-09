var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var browser=function(){var _2=require('./browser');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var Component=function(){var _3=require('./Component');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var bridgeStream=function(){var _4=require('./bridgeStream');return _4.hasOwnProperty("default")?_4["default"]:_4}();

var uid = 0;

!function(){var _5=Object.create(Event.prototype);_5.constructor=Model;Model.prototype=_5}();
  function Model() {
    Event.call(this);
    this.__uid = 'm' + uid++;
    this.__ref = [];
    this.on(Event.DATA, this.__onData);

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiMD = this;
      return this.__hackLie(Model, GS);
    }
  }

  Model.prototype.__onData = function(k, caller) {
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

  Model.prototype.__brcb = function() {}
  Model.prototype.bridge = function(target, datas) {
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self);
    }
    if(!target
      || !(target instanceof EventBus)
        && !(target instanceof Component)
        && (browser.lie && !target.__migiCP && !target.__migiMD)) {
      throw new Error('can only bridge to EventBus/Component: ' + self);
    }
    self.on(Event.DATA, function(keys, origin) {

    });
  }
  Model.prototype.bridgeTo = function(target, datas) {
    target.bridge(this, datas);
  }
Object.keys(Event).forEach(function(k){Model[k]=Event[k]});

var GS = {};
['uid'].forEach(function(item) {
  GS[item] = {
    get: function() {
      return this['__' + item];
    }
  };
});
if(!browser.lie) {
  Object.defineProperties(Model.prototype, GS);
}

exports["default"]=Model;