define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();

var eventBus = new Event();
eventBus.uid = -1;

var hash = {};

eventBus.__brcb = function(k, v) {
  if(hash.hasOwnProperty(k)) {
    var item = hash[k];
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
};

eventBus.on(Event.DATA, eventBus.__brcb);

eventBus.bridge = function(target, datas) {
  Object.keys(datas).forEach(function(k) {
    hash[k] = hash[k] || [];
    hash[k].push({
      target:target,
      v: datas[k]
    });
  });
};

eventBus.bridgeTo = function(target, datas) {
  target.bridge(this, datas);
};

exports["default"]=eventBus;});