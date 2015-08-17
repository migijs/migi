define(function(require, exports, module){var browser=function(){var _0=require('./browser');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var mix=function(){var _1=require('./mix');return _1.hasOwnProperty("default")?_1["default"]:_1}();


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
          return self;
        }
      }
      self.__hash[id].push(handle);
    }
    return self;
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
        data=[].slice.call(arguments, 0);handle.apply(this, data);
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
          //hack ie8，Component有get/set时会返回__migiNode的DOM元素，比较是否等于自己便可判别是否返回的是个DOM元素
          if(browser.lie && self instanceof migi.Component && self.__migiNode == self && self.__migiCP) {
            item.apply(self.__migiNode, data);
          }
          else {
            item.apply(self, data);
          }
        });
      }
    }
    return this;
  }

  Event.prototype.__hackLie = function(cons, GS) {
    this.__migiGS = mix.gs({}, this.__migiGS, GS);
    if(this.constructor == cons) {
      var a = document.createElement('a');
      this.__migiNode = a.__migiNode = a;
      this.$ = a;
      mix.ref(this, a, this.__migiGS);
      Object.defineProperties(a, this.__migiGS);
      return a;
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


Event.DOM = '__0';
Event.DESTROY = '__1';
Event.DATA = '__2';
Event.CACHE_DATA = '__3';

exports["default"]=Event;});