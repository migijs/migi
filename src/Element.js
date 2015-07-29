import Event from './Event';
import util from './util';
import browser from './browser';

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
    this.__uid = uid++;
    this.__reset(name, props, children);
  }
  __reset(name, props, children) {
    this.__name = name;
    this.__props = props;
    this.__children = children;

    this.__element = null; //真实DOM引用
    this.__parent = null; //父vd或cp引用
    this.__top = null; //最近父cp引用
    this.__style = null; //样式中间生成代码
    this.__dom = false; //是否被添加到真实DOM标识
    this.__cache = {}; //缓存计算好的props

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiElem = true;
    }

    this.once(Event.DOM, this.__onDom);
  }
  //防止多次插入后重复，清除上次，永远只存在一个实例
  __clean() {
    if(this.$dom) {
      this.$element.parentNode.removeChild(this.$element);
    }
  }

  __onDom() {
    this.__dom = true;
  }
  __saveRef() {
    //ref快速引用
    if(this.__cache['ref']) {
      var top = this.$top;
      if(top) {
        var exist = top.$ref[this.$name];
        if(Array.isArray(exist)) {
          exist.push(this);
        }
        else if(exist) {
          top.$ref[this.$name] = [exist, this];
        }
        else {
          top.$ref[this.$name] = this;
        }
      }
    }
  }

  get $name() {
    return this.__name;
  }
  get $props() {
    return this.__props;
  }
  get $children() {
    return this.__children;
  }
  get $parent() {
    return this.__parent;
  }
  get $top() {
    if(!this.__top && this.$parent) {
      if(this.$parent instanceof migi.Component || this.$parent && this.$parent.__migiCp) {
        this.__top = this.$parent;
      }
      else {
        this.__top = this.$parent.$top;
      }
    }
    return this.__top;
  }
  get $uid() {
    return this.__uid;
  }
  get $element() {
    return this.__element || (this.__element = document.querySelector(this.$name + '[migi-uid="' + this.$uid + '"]'));
  }
  get $dom() {
    return this.__dom;
  }

  $inTo(dom) {
    this.__clean();
    var s = this.toString();
    getDom(dom).innerHTML = s;
    this.emit(Event.DOM);
  }
  $appendTo(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('beforeend', s);
    this.emit(Event.DOM);
  }
  $prependTo(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterbegin', s);
    this.emit(Event.DOM);
  }
  $before(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('beforebegin', s);
    this.emit(Event.DOM);
  }
  $after(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterend', s);
    this.emit(Event.DOM);
  }
  $replace(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterend', s);
    dom.parentNode.removeChild(dom);
    this.emit(Event.DOM);
  }
  static __clean() {
    uid = 0;
  }
}

export default Element;