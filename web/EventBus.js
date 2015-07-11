define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();

!function(){var _2=Object.create(Event.prototype);_2.constructor=EventBus;EventBus.prototype=_2}();
  function EventBus() {
    Event.call(this);
    this.uid = -1; //为数据流历史记录hack
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
          target[k] = stream(v);
        }
        //只有name说明无需数据处理
        else if(util.isString(stream)) {
          target[stream] = v;
        }
        else if(stream.name) {
          var v2 = stream.middleware ? stream.middleware.call(this, v) : v;
          target[stream.name] = v2;
        }
        target.__flag = false;
      }
    }
  }
  EventBus.prototype.$bridge = function(target, datas) {
    var self = this;
    Object.keys(datas).forEach(function(k) {
      self.__listener[k] = self.__listener[k] || [];
      self.__listener[k].push({
        target:target,
        v: datas[k]
      });
    });
  }
  EventBus.prototype.$bridgeTo = function(target, datas) {
    target.$bridge(this, datas);
  }
Object.keys(Event).forEach(function(k){EventBus[k]=Event[k]});

exports["default"]=EventBus;});