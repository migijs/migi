import Event from './Event';
import util from './util';

var uid = 0;

class Element extends Event {
  constructor(name, props = {}, ...children) {
    super();
    this.__name = name;
    this.__props = props;
    this.__children = children;

    this.__id = uid++;
    this.__element = null;
    this.__parent = null;
    this.__style = null;

    this.on(Event.DOM, this.__onDom);
    this.on(Event.DATA, this.__onData);
  }

  //@abstract
  //__onDom() {}
  //__onData() {}

  get name() {
    return this.__name;
  }
  get props() {
    return this.__props;
  }
  get children() {
    return this.__children;
  }
  get parent() {
    return this.__parent;
  }
  get id() {
    return this.__id;
  }

  inTo(dom) {
    var s = this.toString();
    if(util.isString(dom)) {
      document.querySelector(dom).innerHTML = s;
    }
    else if(dom) {
      dom.innerHTML = s;
    }
    this.emit(Event.DOM);
  }
  appendTo(dom) {
    var s = this.toString();
    if(util.isString(dom)) {
      document.querySelector(dom).innerHTML += s;
    }
    else if(dom) {
      dom.innerHTML += s;
    }
    this.emit(Event.DOM);
  }
  before(dom) {
    var s = this.toString();
    var div = document.createElement('div');
    div.innerHTML = s;
    if(util.isString(dom)) {
      dom = document.querySelector(dom);
    }
    dom.parentNode.insertBefore(div.firstChild, dom);
    this.emit(Event.DOM);
  }
  after(dom) {
    var s = this.toString();
    var div = document.createElement('div');
    div.innerHTML = s;
    if(util.isString(dom)) {
      dom = document.querySelector(dom);
    }
    var next = dom.nextSibling;
    if(next) {
      dom.parentNode.insertBefore(div.firstChild, next);
    }
    else {
      dom.parentNode.appendChild(div.firstChild);
    }
    this.emit(Event.DOM);
  }
  insertBefore(dom) {
    var s = this.toString();
    var div = document.createElement('div');
    div.innerHTML = s;
    if(util.isString(dom)) {
      dom = document.querySelector(dom);
    }
    dom.parentNode.insertBefore(div.firstChild, dom);
    this.emit(Event.DOM);
  }
  replace(dom) {
    var s = this.toString();
    var div = document.createElement('div');
    div.innerHTML = s;
    if(util.isString(dom)) {
      dom = document.querySelector(dom);
    }
    dom.parentNode.replaceChild(div.firstChild, dom);
    this.emit(Event.DOM);
  }
}

export default Element;