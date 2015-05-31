var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("util")?_1.util:_1.hasOwnProperty("default")?_1.default:_1}();

var uid = 0;

var TEMP_NODE = document.createElement('div');

function getDom(dom) {
  if(util.isString(dom)) {
    return document.querySelector(dom);
  }
  return dom;
}

!function(){var _2=Object.create(Event.prototype);_2.constructor=Element;Element.prototype=_2}();
  function Element(name, props, children) {
    if(props===void 0)props={};children=[].slice.call(arguments, 2);Event.call(this);
    this.__name = name;
    this.__props = props;
    this.__children = children;

    this.__uid = uid++;
    this.__element = null;
    this.__parent = null;
    this.__style = null;
    this.__dom = false;

    this.on(Event.DOM, this.__onDom);
    this.on(Event.DATA, this.__onData);
  }

  Element.prototype.__onDom = function() {
    this.__dom = true;
  }
  //@abstract
  //__onData() {}

  var _3={};_3.name={};_3.name.get =function() {
    return this.__name;
  }
  _3.props={};_3.props.get =function() {
    return this.__props;
  }
  _3.children={};_3.children.get =function() {
    return this.__children;
  }
  _3.parent={};_3.parent.get =function() {
    return this.__parent;
  }
  _3.uid={};_3.uid.get =function() {
    return this.__uid;
  }
  _3.dom={};_3.dom.get =function() {
    return this.__dom;
  }
  _3.html={};_3.html.get =function() {
    return this.element.innerHTML;
  }
  _3.html.set =function(v) {
    this.element.innerHTML = v;
  }
  _3.text={};_3.text.get =function() {
    return this.element.textContent;
  }
  _3.text.set =function(v) {
    this.element.innerHTML = util.encodeHtml(v);
  }

  Element.prototype.inTo = function(dom) {
    var s = this.toString();
    getDom(dom).innerHTML = s;
    this.emit(Event.DOM);
  }
  Element.prototype.appendTo = function(dom) {
    var s = this.toString();
    dom = getDom(dom);
    if(dom.lastChild) {
      TEMP_NODE.innerHTML = s;
      dom.appendChild(TEMP_NODE.firstChild);
    }
    else {
      dom.innerHTML = s;
    }
    this.emit(Event.DOM);
  }
  Element.prototype.prependTo = function(dom) {
    var s = this.toString();
    dom = getDom(dom);
    if(dom.firstChild) {
      TEMP_NODE.innerHTML = s;
      dom.insertBefore(TEMP_NODE.firstChild, dom.firstChild);
    }
    else {
      dom.innerHTML = s;
    }
    this.emit(Event.DOM);
  }
  Element.prototype.before = function(dom) {
    var s = this.toString();
    TEMP_NODE.innerHTML = s;
    dom = getDom(dom);
    dom.parentNode.insertBefore(TEMP_NODE.firstChild, dom);
    this.emit(Event.DOM);
  }
  Element.prototype.after = function(dom) {
    var s = this.toString();
    TEMP_NODE.innerHTML = s;
    dom = getDom(dom);
    var next = dom.nextSibling;
    if(next) {
      dom.parentNode.insertBefore(TEMP_NODE.firstChild, next);
    }
    else {
      dom.parentNode.appendChild(TEMP_NODE.firstChild);
    }
    this.emit(Event.DOM);
  }
  Element.prototype.replace = function(dom) {
    var s = this.toString();
    TEMP_NODE.innerHTML = s;
    dom = getDom(dom);
    dom.parentNode.replaceChild(div.firstChild, dom);
    this.emit(Event.DOM);
  }
Object.keys(_3).forEach(function(k){Object.defineProperty(Element.prototype,k,_3[k])});Object.keys(Event).forEach(function(k){Element[k]=Event[k]});

exports.default=Element;