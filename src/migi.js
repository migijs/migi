import lefty from 'lefty';
import jaw from 'jaw';
import Event from './Event';
import Component from './Component';
import VirtualDom from './VirtualDom';
import NonVisualComponent from './NonVisualComponent';
import CacheComponent from './CacheComponent';
import util from './util';
import Obj from './Obj';
import Cb from './Cb';

var migi = {
  render(component, dom) {
    component.inTo(dom);
    return component;
  },
  createElement(name, props, ...children) {
    if(util.isString(name)) {
      return new VirtualDom(name, props, ...children);
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new Klass(name, props, ...children);
    }
  },
  Event,
  eventBus: Event.mix({}),
  Component,
  NonVisualComponent,
  CacheComponent,
  VirtualDom,
  Obj,
  Cb
};

if(!util.isUndefined(window)) {
  window.migi = migi;
}

export default migi;