var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var browser=function(){var _2=require('./browser');return _2.hasOwnProperty("default")?_2["default"]:_2}();

var uid = 0;

!function(){var _3=Object.create(Event.prototype);_3.constructor=EventBus;EventBus.prototype=_3}();
  function EventBus() {
    Event.call(this);
    this.uid = 'e' + uid++; //为数据流历史记录hack
    this.__listener = {};
    this.on(Event.DATA, this.__brcb);
  }
  EventBus.prototype.__brcb = function(k, v, stream) {
    if(this.__listener.hasOwnProperty(k)) {
      var arr = this.__listener[k];
      for(var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i];
        var target = item.target;
        var name = item.name;
        var middleware = item.middleware;
        if(!stream.has(target.uid)) {
          stream.add(target.uid);
          target.__stream = stream;
          target[name] = middleware ? middleware.call(target, v) : v;
          target.__stream = null;
        }
      }
    }
  }
  EventBus.prototype.__record = function(target, src, name, middleware) {
    var self = this;
    var arr = this.__listener[src] = this.__listener[src] || [];
    //防止重复桥接
    arr.forEach(function(item) {
      if(item.target == target && item.name == name) {
        throw new Error('duplicate bridge: ' + self.name + '.' + src + ' -> ' + target.name + '.' + name);
      }
    });
    //记录桥接单向数据流关系
    arr.push({
      target:target,
      name:name,
      middleware:middleware
    });
  }
  EventBus.prototype.bridge = function(target, src, name, middleware) {
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
    //重载
    if(arguments.length == 2) {
      if(util.isString(src)) {
        self.__record(target, src, src);
      }
      else {
        Object.keys(src).forEach(function(k) {
          var o = src[k];
          if(util.isString(o)) {
            self.__record(target, k, o);
          }
          else if(o.name) {
            self.__record(target, k, o.name, o.middleware);
          }
        });
      }
    }
    else if(arguments.length == 3) {
      if(util.isString(name)) {
        self.__record(target, src, name);
      }
      else {
        middleware = name;
        self.__record(target, src, src, middleware);
      }
    }
    else if(arguments.length == 4) {
      self.__record(target, src, name, middleware);
    }
  }
  EventBus.prototype.bridgeTo = function(target, datas) {
    datas=[].slice.call(arguments, 1);target.bridge.apply(target,[this].concat(Array.from(datas)));
  }
Object.keys(Event).forEach(function(k){EventBus[k]=Event[k]});

exports["default"]=EventBus;