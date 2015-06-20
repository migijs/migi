define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();

var uid = 0;

function getDom(dom) {
  if(util.isString(dom)) {
    return document.querySelector(dom);
  }
  return dom;
}

!function(){var _2=Object.create(Event.prototype);_2.constructor=Element;Element.prototype=_2}();
  function Element(name, props, children) {
    Event.call(this);
    this.__init(name, props, children);
  }
  Element.prototype.__init = function(name, props, children) {
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
  //防止多次插入后重复，清除上次，永远只存在一个实例
  Element.prototype.__clean = function() {
    if(this.dom) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  Element.prototype.__onDom = function() {
    this.__dom = true;
    //触发后就移除
    this.off(Event.DOM, this.__onDom);
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
  _3.element={};_3.element.get =function() {
    return this.__element || (this.__element = document.querySelector(this.name + '[migi-uid="' + this.uid + '"]'));
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
    return util.lie ? this.element.innerText : this.element.textContent;
  }
  _3.text.set =function(v) {
    this.element.innerHTML = util.encodeHtml(v);
  }

  Element.prototype.inTo = function(dom) {
    this.__clean();
    var s = this.toString();
    getDom(dom).innerHTML = s;
    this.emit(Event.DOM);
  }
  Element.prototype.appendTo = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    if(dom.lastChild) {
      var node = util.getParent(this.name);
      node.innerHTML = s;
      dom.appendChild(node.firstChild);
    }
    else {
      dom.innerHTML = s;
    }
    this.emit(Event.DOM);
  }
  Element.prototype.prependTo = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    if(dom.firstChild) {
      var node = util.getParent(this.name);
      node.innerHTML = s;
      dom.insertBefore(node.firstChild, dom.firstChild);
    }
    else {
      dom.innerHTML = s;
    }
    this.emit(Event.DOM);
  }
  Element.prototype.before = function(dom) {
    this.__clean();
    var s = this.toString();
    var node = util.getParent(this.name);
    node.innerHTML = s;
    dom = getDom(dom);
    dom.parentNode.insertBefore(node.firstChild, dom);
    this.emit(Event.DOM);
  }
  Element.prototype.after = function(dom) {
    this.__clean();
    var s = this.toString();
    var node = util.getParent(this.name);
    node.innerHTML = s;
    dom = getDom(dom);
    var next = dom.nextSibling;
    if(next) {
      dom.parentNode.insertBefore(node.firstChild, next);
    }
    else {
      dom.parentNode.appendChild(node.firstChild);
    }
    this.emit(Event.DOM);
  }
  Element.prototype.replace = function(dom) {
    this.__clean();
    var s = this.toString();
    var node = util.getParent(this.name);
    node.innerHTML = s;
    dom = getDom(dom);
    dom.parentNode.replaceChild(node.firstChild, dom);
    this.emit(Event.DOM);
  }
  Element.clean=function() {
    uid = 0;
  }
Object.keys(_3).forEach(function(k){Object.defineProperty(Element.prototype,k,_3[k])});Object.keys(Event).forEach(function(k){Element[k]=Event[k]});

exports["default"]=Element;});