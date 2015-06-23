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
    this.__empty = true;
    this.type = null;
    this.__count = 0;
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
  toString() {
    var s = Array.isArray(this.v) ? util.joinArray(this.v) : this.v;
    //防止undefined的变量
    return s === void 0 ? '' : s.toString();
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