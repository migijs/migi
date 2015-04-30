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
      if(dom.charAt(0) == '#') {
        document.getElementById(dom.slice(1)).innerHTML = s;
      }
      else {
        document.querySelector(dom).innerHTML = s;
      }
    }
    else {
      throw new Error('migi.render missing dom!');
    }
    component.emit(Event.ON_DOM);
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

export default migi;