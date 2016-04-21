define(function(require, exports, module){var Model=function(){var _0=require('./Model');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var CacheComponent=function(){var _1=require('./CacheComponent');return _1.hasOwnProperty("default")?_1["default"]:_1}();

!function(){var _2=Object.create(Model.prototype);_2.constructor=CacheModel;CacheModel.prototype=_2}();
  function CacheModel() {
    Model.call(this);
    this.__handler = {}; //普通状态下缓存data key的hash
    this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识
    this.__handler2 = {}; //handler的副本，每次handler被重置为空后保留缓存值
    this.__timeout;
    this.__timecb;
  }
Object.keys(Model).forEach(function(k){CacheModel[k]=Model[k]});

CacheModel.prototype.__data = CacheComponent.prototype.__data;

exports["default"]=CacheModel;
});