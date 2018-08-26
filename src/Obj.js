import Element from './Element';
import util from './util';

class Obj {
  constructor(k, cb, single, vBind) {
    this.k = k;
    this.cb = cb;
    this.single = single;
    this.vBind = vBind;
    this.setV(cb());
  }
  setV(v) {
    this.v = util.clone(v);
  }
  // prop为true时作为prop渲染转义，否则为innerHTML转义
  toString(prop) {
    // array调用join包括转码
    if(Array.isArray(this.v)) {
      return util.joinArray(this.v, prop);
    }
    var s = util.stringify(this.v);
    if(prop) {
      return util.encodeHtml(s, prop);
    }
    return this.v instanceof Element ? s : util.encodeHtml(s);
  }
  toSourceString() {
    if(Array.isArray(this.v)) {
      return util.joinSourceArray(this.v);
    }
    return util.stringify(this.v);
  }
  update(ov) {
    var nv = this.cb();
    if(!util.equal(ov, nv)) {
      this.setV(nv);
      return true;
    }
  }
}

export default Obj;
