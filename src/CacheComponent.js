import Event from './Event';
import Component from './Component';
import util from './util';

class CachedComponent extends Component {
  constructor(...data) {
    super(...data);
    this.__handler = {};
    this.__cb = null;
    this.__flag = false;
  }

  __onData(k) {
    var self = this;
    if(self.__flag) {
      super.__onData(k);
      return;
    }
    if(self.__handler.hasOwnProperty(k)) {
      return;
    }
    self.__handler[k] = true;
    if(!self.__cb) {
      self.__cb = true;
      setTimeout(function() {
        var keys = Object.keys(self.__handler);
        self.__handler = {};
        self.__cb = null;
        keys = keys.length > 1 ? keys : keys[0];
        super.__onData(keys);
        self.emit(Event.CACHE_DATA, keys);
      }, 1);
    }
  }
  //逻辑和Component复用，代码有点交叉的味道
  //bind{}
  //@overwrite
  bridge(target, datas) {
    var self = this;
    if(target == this) {
      throw new Error('can not bridge self: ' + self.name);
    }
    self.on(Event.CACHE_DATA, function(k) {
      //变更时设置对方不更新，防止闭环
      target.__flag = true;
      if(!Array.isArray(k)) {
        k = [k];
      }
      k.forEach(function(k) {
        if(datas.hasOwnProperty(k)) {
          var o = datas[k];
          self.__bcb(target, k, o);
        }
      });
      target.__flag = false;
    });
  }
}

export default CachedComponent;