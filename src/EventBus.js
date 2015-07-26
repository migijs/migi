import Event from './Event';
import util from './util';
import browser from './browser';

class EventBus extends Event {
  constructor() {
    super();
    this.uid = -1; //为数据流历史记录hack
    this.__listener = {};
    this.on(Event.DATA, this.__brcb);
  }
  __brcb(k, v) {
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
  $bridge(target, datas) {
    var self = this;
    Object.keys(datas).forEach(function(k) {
      self.__listener[k] = self.__listener[k] || [];
      self.__listener[k].push({
        target,
        v: datas[k]
      });
    });
  }
  $bridgeTo(target, datas) {
    target.$bridge(this, datas);
  }
}

export default EventBus;