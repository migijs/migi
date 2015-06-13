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
  createCp(name, props, children) {
    return new name(props, children);
  },
  createVd(name, props, children) {
    return cachePool.index ? cachePool.get().__init(name, props, children) : new VirtualDom(name, props, children);
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

if(typeof window != 'undefined') {
  window.migi = migi;
}

export default migi;