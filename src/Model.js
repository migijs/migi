import Event from './Event';
import EventBus from './EventBus';
import util from './util';
import browser from './browser';
import Component from './Component';
import bridgeStream from './bridgeStream';

var uid = 0;

class Model extends Event {
  constructor() {
    super();
    this.__uid = 'm' + uid++;
    this.__name = this.constructor.__migiName;
    this.__ref = [];
    this.__bridgeHash = null;

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
['__record', 'bridge', 'bridgeTo', '__brcb'].forEach(function(k) {
  Model.prototype[k] = Component.prototype[k];
});

var GS = {
  $: {
    get: function() {
      if(browser.lie && this.__migiNode) {
        return this.__migiNode;
      }
      return this;
    }
  },
  $$: {
    get: function() {
      if(browser.lie && this.__migiMD) {
        return this.__migiMD;
      }
      return this;
    }
  }
};
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

export default Model;