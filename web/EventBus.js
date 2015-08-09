define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var browser=function(){var _2=require('./browser');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var bridgeStream=function(){var _3=require('./bridgeStream');return _3.hasOwnProperty("default")?_3["default"]:_3}();

var uid = 0;

!function(){var _4=Object.create(Event.prototype);_4.constructor=EventBus;EventBus.prototype=_4}();
  function EventBus() {
    Event.call(this);
    this.uid = 'e' + uid++; //为数据流历史记录hack
    this.__listener = {};
    this.on(Event.DATA, this.__brcb);
  }
  EventBus.prototype.__brcb = function(k, v) {
    if(this.__listener.hasOwnProperty(k)) {
      var item = this.__listener[k];
      for(var i = 0, len = item.length; i < len; i++) {
        var value = item[i];
        var target = value.target;
        var stream = value.v;
        target.__flag = true;
        //同名无需name，直接function作为middleware
        if(util.isFunction(stream)) {
          v = stream(v);
          target[k] = v;
          if(browser.lie && target.__migiNode && target.__migiNode.nodeName) {
            target.__migiNode[k] = v;
          }
        }
        //只有name说明无需数据处理
        else if(util.isString(stream)) {
          target[stream] = v;
          if(browser.lie && target.__migiNode && target.__migiNode.nodeName) {
            target.__migiNode[stream] = v;
          }
        }
        else if(stream.name) {
          var v2 = stream.middleware ? stream.middleware.call(this, v) : v;
          target[stream.name] = v2;
          if(browser.lie && target.__migiNode && target.__migiNode.nodeName) {
            target.__migiNode[stream.name] = v;
          }
        }
        target.__flag = false;
      }
    }
  }
  EventBus.prototype.bridge = function(target, datas) {
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self);
    }
    if(!target
      || !(target instanceof migi.Component)
        && !(target instanceof migi.Model)
        && (browser.lie && !target.__migiCP && !target.__migiMD)) {
      throw new Error('can only bridge to Component/Model: ' + self);
    }
    //记录桥接单向数据流关系
    bridgeStream.record(self, target, datas);
    //数据流以事件形式流经自己，存储好两个对象的引用
    Object.keys(datas).forEach(function(k) {
      self.__listener[k] = self.__listener[k] || [];
      self.__listener[k].push({
        target:target,
        v: datas[k]
      });
    });
  }
  EventBus.prototype.bridgeTo = function(target, datas) {
    target.bridge(this, datas);
  }
Object.keys(Event).forEach(function(k){EventBus[k]=Event[k]});

exports["default"]=EventBus;});