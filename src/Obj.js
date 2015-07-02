import Element from './Element';
import util from './util';

class Obj {
  constructor(k, context, cb) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }

    this.__k = k;
    this.__context = context;
    this.__cb = cb;
    this.v = cb.call(context);
  }
  get k() {
    return this.__k;
  }
  get context() {
    return this.__context;
  }
  get v() {
    return this.__v;
  }
  set v(v) {
    this.__v = util.clone(v);
  }
  get cb() {
    return this.__cb;
  }
  toString(prop) {
    //array调用join包括转码
    if(Array.isArray(this.v)) {
      return util.joinArray(this.v, prop);
    }
    //防止undefined的变量
    if(this.v === void 0 || this.v === null) {
      return '';
    }
    var s = this.v.toString();
    if(prop) {
      return util.encodeHtml(s, prop);
    }
    return this.v instanceof Element ? s : util.encodeHtml(s, prop);
  }
  update(ov) {
    var nv = this.cb.call(this.context);
    if(!util.equal(ov, nv)) {
      this.v = nv;
      return true;
    }
  }
}

export default Obj;