var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var util=function(){var _2=require('./util');return _2.hasOwnProperty("default")?_2["default"]:_2}();

!function(){var _3=Object.create(Component.prototype);_3.constructor=CachedComponent;CachedComponent.prototype=_3}();
  function CachedComponent(data) {
    data=[].slice.call(arguments, 0);Component.apply(this,[].concat(Array.from(data)));
    this.__handler = {};
    this.__cb = null;
    this.__flag = false;
  }

  CachedComponent.prototype.__onData = function(k) {
    var _4=this;var self = this;
    if(self.__flag) {
      Component.prototype.__onData.call(_4,k);
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
        Component.prototype.__onData.call(_4,keys);
        self.emit(Event.CACHE_DATA, keys);
      }, 1);
    }
  }
  //@overwrite
  CachedComponent.prototype.bind = function(target, include, exclude) {
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
  CachedComponent.prototype.bridge = function(target, datas) {
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
Object.keys(Component).forEach(function(k){CachedComponent[k]=Component[k]});

exports["default"]=CachedComponent;