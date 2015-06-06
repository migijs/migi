import Event from './Event';
import util from './util';

var uid = 0;

function getDom(dom) {
  if(util.isString(dom)) {
    return document.querySelector(dom);
  }
  return dom;
}

class Element extends Event {
  constructor(name, props, children) {
    super();
    this.__name = name;
    this.__props = props;
    this.__children = children;

    //TODO: 大数处理
    this.__uid = uid++;
    this.__element = null;
    this.__parent = null;
    this.__style = null;
    this.__dom = false;

    this.on(Event.DOM, this.__onDom);
    this.on(Event.DATA, this.__onData);
  }

  __onDom() {
    var self = this;
    self.__dom = true;
    //触发后就移除
    self.off(Event.DOM, self.__onDom);
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
  get uid() {
    return this.__uid;
  }
  get dom() {
    return this.__dom;
  }
  get html() {
    return this.element.innerHTML;
  }
  set html(v) {
    this.element.innerHTML = v;
  }
  get text() {
    return util.lie ? this.element.innerText : this.element.textContent;
  }
  set text(v) {
    this.element.innerHTML = util.encodeHtml(v);
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
      util.NODE.innerHTML = s;
      dom.appendChild(util.NODE.firstChild);
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
      util.NODE.innerHTML = s;
      dom.insertBefore(util.NODE.firstChild, dom.firstChild);
    }
    else {
      dom.innerHTML = s;
    }
    this.emit(Event.DOM);
  }
  before(dom) {
    var s = this.toString();
    util.NODE.innerHTML = s;
    dom = getDom(dom);
    dom.parentNode.insertBefore(util.NODE.firstChild, dom);
    this.emit(Event.DOM);
  }
  after(dom) {
    var s = this.toString();
    util.NODE.innerHTML = s;
    dom = getDom(dom);
    var next = dom.nextSibling;
    if(next) {
      dom.parentNode.insertBefore(util.NODE.firstChild, next);
    }
    else {
      dom.parentNode.appendChild(util.NODE.firstChild);
    }
    this.emit(Event.DOM);
  }
  replace(dom) {
    var s = this.toString();
    util.NODE.innerHTML = s;
    dom = getDom(dom);
    dom.parentNode.replaceChild(div.firstChild, dom);
    this.emit(Event.DOM);
  }
}

export default Element;