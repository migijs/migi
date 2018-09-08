import Event from './Event';
import Element from './Element';
import Model from './Model';
import CacheModel from './CacheModel';
import Component from './Component';
import VirtualDom from './VirtualDom';
import CacheComponent from './CacheComponent';
import Obj from './Obj';
import Cb from './Cb';
import cachePool from './cachePool';
import util from './util';
import browser from './browser';
import sort from './sort';
import hash from './hash';
import match from './match';
import matchHash from './matchHash';
import attr from './attr';
import selfClose from './selfClose';
import dev from './dev';

var migi = {
  uid: 0,
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
    element.preString();
    return element.emit(Event.DOM);
  },
  createCp(cp, props, children) {
    if(Array.isArray(cp)) {
      [cp, props, children] = [...cp];
    }
    return hash.set(new cp(this.uid++, props, children));
  },
  createVd(name, props, children) {
    if(Array.isArray(name)) {
      [name, props, children] = [...name];
    }
    if(name == 'style' || name == 'script') {
      throw new Error('can not create VirtualDom of: ' + name);
    }
    return hash.set(cachePool.index ? cachePool.get().__reset(this.uid++, name, props, children) : new VirtualDom(this.uid++, name, props, children));
  },
  Event,
  Model,
  CacheModel,
  eventBus: new Event,
  Element,
  Component,
  CacheComponent,
  VirtualDom,
  Obj,
  Cb,
  util,
  browser,
  sort,
  hash,
  match,
  matchHash,
  attr,
  selfClose,
  name: function(Class, name) {
    if(Component.prototype.isPrototypeOf(Class.prototype)) {
      Class.__migiName = name;
    }
  },
  resetUid: function(n) {
    this.uid = n || 0;
  },
  clone: function() {
    var clone = Object.create(migi);
    clone.uid = 0;
    return clone;
  },
  dev,
};

if(typeof window != 'undefined') {
  window.migi = migi;
}
else if(typeof global != 'undefined') {
  global.migi = migi;
}

export default migi;
