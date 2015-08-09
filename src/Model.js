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

  __brcb() {}
  bridge(target, datas) {
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self);
    }
    if(!target
      || !(target instanceof EventBus)
        && !(target instanceof Component)
        && (browser.lie && !target.__migiCP && !target.__migiMD)) {
      throw new Error('can only bridge to EventBus/Component: ' + self);
    }
    self.on(Event.DATA, function(keys, origin) {

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