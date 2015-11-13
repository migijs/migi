import Event from './Event';
import EventBus from './EventBus';
import util from './util';
import browser from './browser';
import Component from './Component';
import Stream from './Stream';

var uid = 0;

class Model extends Event {
  constructor() {
    super();
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
}
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

export default Model;