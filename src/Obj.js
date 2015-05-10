import util from './util';

class Obj {
  constructor(k, context, cb) {
    this._k = k;
    this._context = context;
    this.v = cb.call(context);
    this._cb = cb;
  }
  get k() {
    return this._k;
  }
  get context() {
    return this._context;
  }
  get v() {
    return this._v;
  }
  set v(v) {
    this._v = util.clone(v);
  }
  get cb() {
    return this._cb;
  }
  toString() {
    return this.v.toString();
  }
}

export default Obj;