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
import eventBus from './eventBus';

var migi = {
  render(element, dom) {
    if(dom) {
      element.inTo(dom);
    }
    return element;
  },
  createCp(name, props, children) {
    return new name(props, children);
  },
  createVd(name, props, children) {
    return cachePool.index ? cachePool.get().__reset(name, props, children) : new VirtualDom(name, props, children);
  },
  Event,
  eventBus,
  Element,
  Component,
  NonVisualComponent,
  CacheComponent,
  VirtualDom,
  Obj,
  Cb
};

!function() {
  this.migi = migi;
}.call();

export default migi;