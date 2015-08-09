define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var EventBus=function(){var _1=require('./EventBus');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var util=function(){var _2=require('./util');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var browser=function(){var _3=require('./browser');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var Component=function(){var _4=require('./Component');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var bridgeStream=function(){var _5=require('./bridgeStream');return _5.hasOwnProperty("default")?_5["default"]:_5}();

var uid = 0;

!function(){var _6=Object.create(Event.prototype);_6.constructor=Model;Model.prototype=_6}();
  function Model() {
    Event.call(this);
    this.__uid = 'm' + uid++;
    this.__name = this.constructor.__migiName;
    this.__ref = [];
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

  Model.prototype.__brcb = function(target, keys, datas) {
    ////变更时设置对方CacheComponent不更新，防止闭环
    if(target.hasOwnProperty('__flag')) {
      target.__flag = true;
    }
    //CacheComponent可能会一次性变更多个数据，Component则只会一个，统一逻辑
    if(!Array.isArray(keys)) {
      keys = [keys];
    }
    //遍历变更数据项
    for(var i = 0, len = keys.length; i < len; i++) {
      var k = keys[i];
      if(datas.hasOwnProperty(k)) {
        var stream = datas[k];
        //eventBus作为中间数据透传
        if(target instanceof EventBus) {
          //同名无需name，直接function作为middleware
          if(util.isFunction(stream)) {
            if(!bridgeStream.pass(target, k)) {
              target.emit(Event.DATA, k, stream(this[k]));
            }
          }
          //只有name说明无需数据处理
          else if(util.isString(stream)) {
            if(!bridgeStream.pass(target, stream)) {
              target.emit(Event.DATA, stream, this[k]);
            }
          }
          else if(stream && stream.name) {
            if(!bridgeStream.pass(target, stream.name)) {
              var v = stream.middleware ? stream.middleware.call(this, this[k]) : this[k];
              target.emit(Event.DATA, stream.name, v);
            }
          }
        }
        else {
          //同名无需name，直接function作为middleware
          if(util.isFunction(stream)) {
            if(!bridgeStream.pass(target, k)) {
              target[k] = stream(this[k]);
            }
          }
          //只有name说明无需数据处理
          else if(util.isString(stream)) {
            if(!bridgeStream.pass(target, stream)) {
              target[stream] = this[k];
            }
          }
          else if(stream && stream.name) {
            if(!bridgeStream.pass(target, stream.name)) {
              var v = stream.middleware ? stream.middleware.call(this, this[k]) : this[k];
              target[stream.name] = v;
            }
          }
        }
      }
    }
    //关闭开关
    if(target.hasOwnProperty('__flag')) {
      target.__flag = false;
    }
  }
  Model.prototype.bridge = function(target, datas) {
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self);
    }
    if(!target
      || !(target instanceof EventBus)
        && !(target instanceof Component)
        && !(target instanceof Model)
        && (browser.lie && !target.__migiCP && !target.__migiMD)) {
      throw new Error('can only bridge to EventBus/Component/Model: ' + self);
    }
    //记录桥接单向数据流关系
    bridgeStream.record(self, target, datas);
    //发生数据变更时，判断来源，从关系记录中判别闭环
    self.on(Event.DATA, function(keys, origin) {
      //来源不是__brcb则说明不是由bridge触发的，而是真正数据源，生成一个新的记录数据流的对象
      if(origin != self.__brcb && origin != target.__brcb) {
        bridgeStream.gen(self.uid, keys);
      }
      self.__brcb(target, keys, datas);
    });
  }
  Model.prototype.bridgeTo = function(target, datas) {
    target.bridge(this, datas);
  }
Object.keys(Event).forEach(function(k){Model[k]=Event[k]});

var GS = {};
['name', 'uid'].forEach(function(item) {
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