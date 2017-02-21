class Event {
  constructor() {
    this.__hash = {};
  }
  on(id, handle) {
    var self = this;
    if(Array.isArray(id)) {
      for(var i = 0, len = id.length; i < len; i++) {
        self.on(id[i], handle);
      }
    }
    else if(handle) {
      if(!self.__hash.hasOwnProperty(id)) {
        self.__hash[id] = [];
      }
      //遍历防止此handle被侦听过了
      for(var i = 0, item = self.__hash[id], len = item.length; i < len; i++) {
        if(item[i] === handle) {
          return self;
        }
      }
      self.__hash[id].push(handle);
    }
    return self;
  }
  once(id, handle) {
    var self = this;
    if(Array.isArray(id)) {
      for(var i = 0, len = id.length; i < len; i++) {
        self.once(id[i], handle);
      }
    }
    else if(handle) {
      function cb(...data) {
        handle.apply(this, data);
        self.off(id, cb);
      }
      self.on(id, cb);
    }
    return this;
  }
  off(id, handle) {
    var self = this;
    if(Array.isArray(id)) {
      for(var i = 0, len = id.length; i < len; i++) {
        self.off(id[i], handle);
      }
    }
    else if(self.__hash.hasOwnProperty(id)) {
      if(handle) {
        for(var i = 0, item = self.__hash[id], len = item.length; i < len; i++) {
          if(item[i] === handle) {
            item.splice(i, 1);
            break;
          }
        }
      }
      //未定义为全部清除
      else {
        delete self.__hash[id];
      }
    }
    return this;
  }
  emit(id, ...data) {
    var self = this;
    if(Array.isArray(id)) {
      for(var i = 0, len = id.length; i < len; i++) {
        self.emit(id[i], data);
      }
    }
    else {
      if(self.__hash.hasOwnProperty(id)) {
        var list = self.__hash[id];
        if(list.length) {
          list = list.slice();
          for(var i = 0, len = list.length; i < len; i++) {
            list[i].apply(self, data);
          }
        }
      }
    }
    return this;
  }

  static mix(...obj) {
    for(var i = obj.length - 1; i >= 0; i--) {
      var o = obj[i];
      var event = new Event();
      o.__hash = {};
      var fns = ['on', 'once', 'off', 'emit'];
      for(var j = fns.length - 1; j >= 0; j--) {
        var fn = fns[j];
        o[fn] = event[fn];
      }
    }
  }
}

Event.DOM = 'DOM';
Event.DESTROY = 'DESTROY';
Event.DATA = 'DATA';

export default Event;
