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
          return;
        }
      }
      self.__hash[id].push(handle);
    }
  }
  Event.prototype.once = function(id, handle) {
    var self = this;
    if(handle) {
      self.on(id, function(data) {
        data=[].slice.call(arguments, 0);handle.apply(self, data);
        self.off(id, handle);
      });
    }
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
        self.__hash[id].forEach(function(item) {
          item.apply(self, data);
        });
      }
      //侦听*的为所有
      if(self.__hash.hasOwnProperty('*')) {
        self.__hash['*'].forEach(function(item) {
          item.apply(self, data);
        });
      }
    }
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


Event.DOM = 'DOM';
Event.DATA = 'DATA';

exports["default"]=Event;});