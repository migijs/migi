define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("util")?_1.util:_1.hasOwnProperty("default")?_1["default"]:_1}();

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

!function(){var _2=Object.create(Event.prototype);_2.constructor=Element;Element.prototype=_2}();
  function Element(name, props, children) {
    if(props===void 0)props={};children=[].slice.call(arguments, 2);Event.call(this);
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
  _3.id={};_3.id.get =function() {
    return this.__id;
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
      var div = tempNode();
      div.innerHTML = s;
      dom.appendChild(div.firstChild);
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
      var div = tempNode();
      div.innerHTML = s;
      dom.insertBefore(div.firstChild, dom.firstChild);
    }
    else {
      dom.innerHTML = s;
    }
    this.emit(Event.DOM);
  }
  Element.prototype.before = function(dom) {
    var s = this.toString();
    var div = tempNode();
    div.innerHTML = s;
    dom = getDom(dom);
    dom.parentNode.insertBefore(div.firstChild, dom);
    this.emit(Event.DOM);
  }
  Element.prototype.after = function(dom) {
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
  Element.prototype.replace = function(dom) {
    var s = this.toString();
    var div = tempNode();
    div.innerHTML = s;
    dom = getDom(dom);
    dom.parentNode.replaceChild(div.firstChild, dom);
    this.emit(Event.DOM);
  }
Object.keys(_3).forEach(function(k){Object.defineProperty(Element.prototype,k,_3[k])});Object.keys(Event).forEach(function(k){Element[k]=Event[k]});

exports["default"]=Element;});