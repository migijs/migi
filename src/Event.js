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
          return;
        }
      }
      self.__hash[id].push(handle);
    }
  }
  once(id, handle) {
    var self = this;
    if(handle) {
      self.on(id, function(...data) {
        handle.apply(self, data);
        self.off(id, handle);
      });
    }
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
        self.__hash[id].forEach(function(item) {
          item.apply(self, data);
        });
      }
    }
  }
  mix(...obj) {
    var self = this;
    obj.forEach(function(o) {
      var event = new Event();
      var fns = ['on', 'once', 'off', 'emit'];
      fns.forEach(function(fn) {
        o[fn] = function(...data) {
          event[fn].apply(event, data);
        }
      });
    });
  }
}

export default Event;