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
  //@overwrite
  bind(target, include, exclude) {
    var self = this;
    if(target == this) {
      throw new Error('can not bind self: ' + self.name);
    }
    self.on(Event.CACHE_DATA, function(k) {
      //变更时设置对方不更新，防止闭环
      target.__flag = true;
      if(Array.isArray(k)) {
        k.forEach(function(k) {
          if(!include || include.indexOf(k) > -1) {
            if(!exclude || exclude.indexOf(k) == -1) {
              target[k] = self[k];
            }
          }
        });
      }
      else {
        if(!include || include.indexOf(k) > -1) {
          if(!exclude || exclude.indexOf(k) == -1) {
            target[k] = self[k];
          }
        }
      }
      target.__flag = false;
    });
    target.on(Event.CACHE_DATA, function(k) {
      self.__flag = true;
      if(Array.isArray(k)) {
        k.forEach(function(k) {
          if(!include || include.indexOf(k) > -1) {
            if(!exclude || exclude.indexOf(k) == -1) {
              self[k] = target[k];
            }
          }
        });
      }
      else {
        if(!include || include.indexOf(k) > -1) {
          if(!exclude || exclude.indexOf(k) == -1) {
            self[k] = target[k];
          }
        }
      }
      self.__flag = false;
    });
  }
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