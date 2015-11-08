import Event from './Event';
import Element from './Element';
import EventBus from './EventBus';
import Model from './Model';
import Component from './Component';
import VirtualDom from './VirtualDom';
import NonVisualComponent from './NonVisualComponent';
import CacheComponent from './CacheComponent';
import util from './util';
import Obj from './Obj';
import Cb from './Cb';
import cachePool from './cachePool';
import util from './util';
import browser from './browser';
import sort from './sort';
import mix from './mix';
import hash from './hash';

var migi = {
  render(element, dom) {
    if(dom) {
      element.inTo(dom);
    }
    return element;
  },
  createCp(cp, props, children) {
    return hash.set(new cp(props, children));
  },
  createVd(name, props, children) {
    if({ script: true, style: true }.hasOwnProperty(name.toLowerCase())) {
      throw new Error('can not create style/script VirtualDom: ' + name);
    }
    return hash.set(cachePool.index ? cachePool.get().__reset(name, props, children) : new VirtualDom(name, props, children));
  },
  Event,
  Model,
  EventBus,
  eventBus: new EventBus,
  Element,
  Component,
  NonVisualComponent,
  CacheComponent,
  VirtualDom,
  Obj,
  Cb,
  util,
  browser,
  sort,
  mix
};

if(typeof window != 'undefined') {
  window.migi = migi;
}

export default migi;