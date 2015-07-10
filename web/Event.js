define(function(require, exports, module){
  function Event() {
    this.__hash = {};
  }
  Event.prototype.on = function(id, handle) {
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
  Event.prototype.once = function(id, handle) {
    var self = this;
    if(Array.isArray(id)) {
      id.forEach(function(item) {
        self.once(item, handle);
      });
    }
    else if(handle) {
      self.on(id, function(data) {
        data=[].slice.call(arguments, 0);handle.apply(self, data);
        self.off(id, arguments.callee);
      });
    }
    return this;
  }
  Event.prototype.off = function(id, handle) {
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
  Event.prototype.emit = function(id, data) {
    data=[].slice.call(arguments, 1);var self = this;
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
  Event.mix=function(obj) {
    obj=[].slice.call(arguments, 0);obj.forEach(function(o) {
      var event = new Event();
      o.__hash = {};
      var fns = ['on', 'once', 'off', 'emit'];
      fns.forEach(function(fn) {
        o[fn] = event[fn];
      });
    });
  }


Event.DOM = '__0';
Event.DATA = '__1';
Event.CACHE_DATA = '__2';

exports["default"]=Event;});