import Event from './Event';
import util from './util';

function getDom(dom) {
  if(util.isString(dom)) {
    let o = document.querySelector(dom);
    if(!o) {
      throw new Error('can not find dom of selector: ' + dom);
    }
    return o;
  }
  else if(dom instanceof Element) {
    return dom.element;
  }
  return dom;
}
function arr2hash(arr) {
  var hash = {};
  for(var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    if(Array.isArray(item)) {
      hash[item[0]] = item[1];
    }
    else {
      for(var list = Object.keys(item), j = list.length - 1; j >= 0; j--) {
        var k = list[j];
        hash[k] = item[k];
      }
    }
  }
  return hash;
}
function hash2arr(hash) {
  var arr = [];
  for(var list = Object.keys(hash), i = 0, len = list.length; i < len; i++) {
    var k = list[i];
    arr.push([k, hash[k]]);
  }
  return arr;
}
function spread(arr) {
  for(var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    if(!Array.isArray(item)) {
      var temp = [];
      for(var list = Object.keys(item), j = 0, len = list.length; j < len; j++) {
        var k = list[j];
        temp.push([k, item[k]]);
      }
      arr.splice(i, 1, ...temp);
    }
  }
  return arr;
}

class Element extends Event {
  constructor(uid, name, props, children) {
    super();
    if(Array.isArray(uid)) {
      [uid, name, props, children] = [...uid];
    }
    props = props || [];
    children = children || [];
    this.__reset(uid, name, props, children);
  }
  __reset(uid, name, props, children) {
    this.__uid = uid;
    this.__name = name;
    // 构建工具中都是arr，手写可能出现hash情况
    if(Array.isArray(props)) {
      this.props = arr2hash(props);
      this.__props = spread(props);
    }
    else {
      this.props = props;
      this.__props = hash2arr(props);
    }
    this.__children = children;

    this.__element = null; // 真实DOM引用
    this.__parent = null; // 父vd或cp引用
    this.__top = null; // 最近父cp引用
    this.__style = null; // 样式中间生成代码
    this.__dom = false; // 是否被添加到真实DOM标识
    this.__cache = {}; // 缓存计算好的props

    this.once(Event.DOM, this.__onDom);
  }
  // 防止多次插入后重复，清除上次，永远只存在一个实例
  clean() {
    if(this.__dom) {
      var elem = this.element;
      if(elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
      this.__element = null;
      this.__parent = null;
      this.__top = null;
      this.__style = null;
      this.__dom = false;
      this.__cache = {};
      this.once(Event.DOM, this.__onDom);
    }
  }

  __onDom() {
    this.__dom = true;
    this.__saveRef();
  }
  __saveRef() {
    // ref快速引用
    if(this.props.ref) {
      var top = this.top;
      if(top) {
        var k = this.props.ref;
        var exist = top.ref[k];
        if(Array.isArray(exist)) {
          exist.push(this);
        }
        else if(exist) {
          top.ref[k] = [exist, this];
        }
        else {
          top.ref[k] = this;
        }
      }
    }
  }
  __delRef() {
    let k = this.props.ref;
    if(!k) {
      return;
    }
    var top = this.top;
    if(top && top.ref) {
      var ref = top.ref[k];
      if(ref) {
        if(ref === this) {
          delete top.ref[k];
        }
        else if(Array.isArray(ref)) {
          for(var i = 0, len = ref.length; i < len; i++) {
            if(ref[i] === this) {
              ref.splice(i, 1);
              break;
            }
          }
        }
      }
    }
  }

  inTo(dom) {
    this.clean();
    var s = this.toString();
    getDom(dom).innerHTML = s;
    this.emit(Event.DOM);
  }
  appendTo(dom) {
    this.clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('beforeend', s);
    this.emit(Event.DOM);
  }
  prependTo(dom) {
    this.clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterbegin', s);
    this.emit(Event.DOM);
  }
  before(dom) {
    this.clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('beforebegin', s);
    this.emit(Event.DOM);
  }
  after(dom) {
    this.clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterend', s);
    this.emit(Event.DOM);
  }
  replace(dom) {
    this.clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterend', s);
    dom.parentNode.removeChild(dom);
    this.emit(Event.DOM);
  }

  get top() {
    if(!this.__top && this.parent) {
      if(this.parent instanceof migi.Component) {
        this.__top = this.parent;
      }
      else {
        this.__top = this.parent.top;
      }
    }
    return this.__top;
  }
  get parent() {
    return this.__parent;
  }
  get children() {
    return this.__children;
  }
  get dom() {
    return this.__dom;
  }
}

export default Element;
