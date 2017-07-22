import Event from './Event';
import Element from './Element';
import EventBus from './EventBus';
import Model from './Model';
import CacheModel from './CacheModel';
import Component from './Component';
import VirtualDom from './VirtualDom';
import NonVisualComponent from './NonVisualComponent';
import CacheComponent from './CacheComponent';
import Obj from './Obj';
import Cb from './Cb';
import cachePool from './cachePool';
import util from './util';
import browser from './browser';
import sort from './sort';
import hash from './hash';
import Fastclick from './Fastclick';

var migi = {
  render(element, dom) {
    if(dom) {
      element.appendTo(dom);
    }
    return element;
  },
  // 提前或服务器端渲染，仅输出，不触发DOM事件
  preRender(element) {
    return element.toString();
  },
  preExist(element) {
    element.toString();console.log(element)
    return element.emit(Event.DOM);
  },
  createCp(cp, props, children) {
    return hash.set(new cp(props, children));
  },
  createVd(name, props, children) {
    if(name == 'style' || name == 'script') {
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
  hash,
  Fastclick,
  name: function(Class, name) {
    if(Component.prototype.isPrototypeOf(Class.prototype)) {
      Class.__migiName = name;
    }
  }
};

if(typeof window != 'undefined') {
  window.migi = migi;
  if(document.body) {
    Fastclick.attach(document.body);
  }
  else {
    document.addEventListener('DOMContentLoaded', function() {
      Fastclick.attach(document.body);
    });
  }
}

export default migi;
