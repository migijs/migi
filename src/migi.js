import Component from './Component';
import Event from './Event';

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

export default migi;