import Event from './Event';
import util from './util';
import browser from './browser';
import Component from './Component';
import bridgeStream from './bridgeStream';

var uid = 0;

class Model extends Event {
  constructor() {
    super();
    this.__uid = 'm' + uid++;
    this.__ref = [];
    this.on(Event.DATA, this.__onData);

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiMD = this;
      return this.__hackLie(Model, GS);
    }
  }

  __onData(k, caller) {
    k = 'model.' + k;
    this.__ref.forEach(function(cp) {
      cp.emit(Event.DATA, k, caller);
    });
  }

  __add(cp) {
    if(this.__ref.indexOf(cp) == -1) {
      this.__ref.push(cp);
    }
  }
  __del(cp) {
    var i = this.__ref.indexOf(cp);
    if(i > -1) {
      this.__ref.splice(i, 1);
    }
  }

  __brcb(target, keys, datas) {
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
  bridge(target, datas) {
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
  bridgeTo(target, datas) {
    target.bridge(this, datas);
  }
}

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

export default Model;