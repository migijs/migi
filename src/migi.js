import Component from './Component';
import Event from './Event';
import type from './type';

var migi = {
  render: function(component, dom) {
    var s = component.render();
    if(type.isDom(dom)) {
      dom.innerHTML = s;
    }
    else if(type.isString(dom)) {
      document.querySelector(dom).innerHTML = s;
    }
    else {
      throw new Error('migi.render missing dom target!');
    }
    component.emit(Event.DOM);
    return s;
  },
  createElement: function(name, props, ...chilren) {
    if(type.isString(name)) {
      return new Component(name, props, ...chilren);
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new Klass(name, props, ...chilren);
    }
  },
  eventBus: Event.mix({}),
  Component: Component
};

if(typeof window !== 'undefined') {
  window.migi = migi;
}

export default migi;