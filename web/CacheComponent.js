define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("default")?_1["default"]:_1}();

!function(){var _2=Object.create(Component.prototype);_2.constructor=CachedComponent;CachedComponent.prototype=_2}();
  function CachedComponent(data) {
    data=[].slice.call(arguments, 0);Component.apply(this,[].concat(Array.from(data)));
    this.__handler = {};
    this.__cb = null;
  }

  CachedComponent.prototype.__onData = function(k) {
    var _3=this;var self = this;
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
        Component.prototype.__onData.call(_3,keys);
      }, 1);
    }
  }
Object.keys(Component).forEach(function(k){CachedComponent[k]=Component[k]});

exports["default"]=CachedComponent;});