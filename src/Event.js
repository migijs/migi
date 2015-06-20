class Event {
  constructor() {
    this.__hash = {};
  }
  on(id, handle) {
    var self = this;
    if(Array.isArray(id)) {
      id.forEach(function(item) {
        self.on(item, handle);
      });
    }
    else if(handle) {
      if(!self.__hash.hasOwnProperty(id)) {
        self.__hash[id] = [];
      }
      //遍历防止此handle被侦听过了
      for(var i = 0, item = self.__hash[id], len = item.length; i < len; i++) {
        if(item[i] === handle) {
          return this;
        }
      }
      self.__hash[id].push(handle);
    }
    return this;
  }
  once(id, handle) {
    var self = this;
    if(Array.isArray(id)) {
      id.forEach(function(item) {
        self.once(item, handle);
      });
    }
    else if(handle) {
      self.on(id, function(...data) {
        handle.apply(self, data);
        self.off(id, arguments.callee);
      });
    }
    return this;
  }
  off(id, handle) {
    var self = this;
    if(Array.isArray(id)) {
      id.forEach(function(item) {
        self.off(item, handle);
      });
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
      id.forEach(function(item) {
        self.emit(item, data);
      });
    }
    else {
      if(self.__hash.hasOwnProperty(id)) {
        var list = self.__hash[id].slice();
        list.forEach(function(item) {
          item.apply(self, data);
        });
      }
    }
    return this;
  }
  static mix(...obj) {
    obj.forEach(function(o) {
      var event = new Event();
      o.__hash = {};
      var fns = ['on', 'once', 'off', 'emit'];
      fns.forEach(function(fn) {
        o[fn] = event[fn];
      });
    });
    return this;
  }
}

Event.DOM = '__0';
Event.DATA = '__1';

export default Event;