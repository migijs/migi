import Event from './Event';
import Element from './Element';
import Component from './Component';
import VirtualDom from './VirtualDom';
import NonVisualComponent from './NonVisualComponent';
import CacheComponent from './CacheComponent';
import util from './util';
import Obj from './Obj';
import Cb from './Cb';
import cachePool from './cachePool';

var migi = {
  render(component, dom) {
    if(dom) {
      component.inTo(dom);
    }
    return component;
  },
  createElement(name, props, children) {
    if(util.isString(name)) {
      if(cachePool.index) {
        return cachePool.get().__init(name, props, children);
      }
      return new VirtualDom(name, props, children);
    }
    else {
      return new name(props, children);
    }
  },
  Event,
  eventBus: Event.mix({}),
  Element,
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