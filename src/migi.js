import Event from './Event';
import Element from './Element';
import EventBus from './EventBus';
import Model from './Model';
import CacheModel from './CacheModel';
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
import Fastclick from './Fastclick';

var migi = {
  render(element, dom) {
    if(dom) {
      element.appendTo(dom);
    }
    return element;
  },
  createCp(cp, props, children) {
    return hash.set(new cp(props, children));
  },
  createVd(name, props, children) {
    if({ script: true, style: true, canvas: true, svg: true }.hasOwnProperty(name.toLowerCase())) {
      throw new Error('can not create VirtualDom of: ' + name);
    }
    return hash.set(cachePool.index ? cachePool.get().__reset(name, props, children) : new VirtualDom(name, props, children));
  },
  Event,
  Model,
  CacheModel,
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
  mix,
  hash,
  Fastclick
};

if(typeof window != 'undefined') {
  window.migi = migi;
  Fastclick.attach(document.body);
}

export default migi;