import Event from './Event';
import util from './util';
import browser from './browser';
import bridgeStream from './bridgeStream';

var uid = 0;

class EventBus extends Event {
  constructor() {
    super();
    this.uid = 'e' + uid++; //为数据流历史记录hack
    this.__listener = {};
    this.on(Event.DATA, this.__brcb);
  }
  __brcb(k, v) {
    if(this.__listener.hasOwnProperty(k)) {
      var arr = this.__listener[k];
      for(var i = 0, len = arr.length; i < len; i++) {
        var stream = arr[i];
        var target = stream.target;
        var name = stream.name;
        var middleware = stream.middleware;
        if(!bridgeStream.pass(target, name)) {
          if(target.hasOwnProperty('__flag')) {
            target.__flag = true;
          }
          target.$[name] = middleware ? middleware.call(target, v) : v;
          if(target.hasOwnProperty('__flag')) {
            target.__flag = false;
          }
        }
      }
    }
  }
  __record(target, src, name, middleware) {
    //记录桥接单向数据流关系
    bridgeStream.record(this.uid, target.uid, src, name);
    this.__listener[src] = this.__listener[src] || [];
    this.__listener[src].push({
      target,
      name,
      middleware
    });
  }
  bridge(target, src, name, middleware) {
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
  bridgeTo(target, ...datas) {
    target.bridge(this, ...datas);
  }
}

export default EventBus;