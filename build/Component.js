var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();

!function(){var _1=Object.create(Event.prototype);_1.constructor=Component;Component.prototype=_1}();
  function Component() {
    Event.call(this);
  }
  Component.prototype.render = function() {
    //
  }
Object.keys(Event).forEach(function(k){Component[k]=Event[k]});

exports.default=Component;