var Component=function(){var _0=require('./Component');return _0.hasOwnProperty("Component")?_0.Component:_0.hasOwnProperty("default")?_0.default:_0}();
var Event=function(){var _1=require('./Event');return _1.hasOwnProperty("Event")?_1.Event:_1.hasOwnProperty("default")?_1.default:_1}();

var migi = {
  render: function(component, dom) {
    //TODO
  },
  createElement: function(data) {
    return new Component(data);
  },
  eventBus: {},
  Component: Component
};

Event.mix(migi.eventBus);

exports.default=migi;