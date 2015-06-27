var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("default")?_1["default"]:_1}();

!function(){var _2=Object.create(Component.prototype);_2.constructor=CachedComponent;CachedComponent.prototype=_2}();
  function CachedComponent(data) {
    data=[].slice.call(arguments, 0);Component.apply(this,[].concat(Array.from(data)));
    this.__handler = {};
  }

  CachedComponent.prototype.__onData = function(k) {
    var self = this;
    if(self.__handler.hasOwnProperty(k)) {
      return;
    }
    self.__handler[k] = true;
    setTimeout(function() {
      var keys = Object.keys(self.__handler);
      self.__handler = {};
      self.virtualDom.emit(Event.DATA, keys);
      self.children.forEach(function(child) {
        if(child instanceof Component) {
          child.emit(Event.DATA, keys);
        }
      });
    }, 1);
  }
Object.keys(Component).forEach(function(k){CachedComponent[k]=Component[k]});

exports["default"]=CachedComponent;