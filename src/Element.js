import Event from './Event';
import util from './util';

var uid = 0;

function getDom(dom) {
  if(util.isString(dom)) {
    return document.querySelector(dom);
  }
  return dom;
}
function tempNode() {
  return document.createElement('div');
}

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
    this.__dom = false;

    this.on(Event.DOM, this.__onDom);
    this.on(Event.DATA, this.__onData);
  }

  __onDom() {
    this.__dom = true;
  }
  //@abstract
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
  get dom() {
    return this.__dom;
  }

  inTo(dom) {
    var s = this.toString();
    getDom(dom).innerHTML = s;
    this.emit(Event.DOM);
  }
  appendTo(dom) {
    var s = this.toString();
    dom = getDom(dom);
    if(dom.lastChild) {
      var div = tempNode();
      div.innerHTML = s;
      dom.appendChild(div.firstChild);
    }
    else {
      dom.innerHTML = s;
    }
    this.emit(Event.DOM);
  }
  prependTo(dom) {
    var s = this.toString();
    dom = getDom(dom);
    if(dom.firstChild) {
      var div = tempNode();
      div.innerHTML = s;
      dom.insertBefore(div.firstChild, dom.firstChild);
    }
    else {
      dom.innerHTML = s;
    }
    this.emit(Event.DOM);
  }
  before(dom) {
    var s = this.toString();
    var div = tempNode();
    div.innerHTML = s;
    dom = getDom(dom);
    dom.parentNode.insertBefore(div.firstChild, dom);
    this.emit(Event.DOM);
  }
  after(dom) {
    var s = this.toString();
    var div = tempNode();
    div.innerHTML = s;
    dom = getDom(dom);
    var next = dom.nextSibling;
    if(next) {
      dom.parentNode.insertBefore(div.firstChild, next);
    }
    else {
      dom.parentNode.appendChild(div.firstChild);
    }
    this.emit(Event.DOM);
  }
  replace(dom) {
    var s = this.toString();
    var div = tempNode();
    div.innerHTML = s;
    dom = getDom(dom);
    dom.parentNode.replaceChild(div.firstChild, dom);
    this.emit(Event.DOM);
  }
}

export default Element;