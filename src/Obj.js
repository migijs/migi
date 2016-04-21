import Element from './Element';
import util from './util';

class Obj {
  constructor(k, context, cb) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }

    this.k = k;
    this.context = context;
    this.cb = cb;
    this.setV(cb.call(context));
  }
  setV(v) {
    this.v = util.clone(v);
  }
  //prop为true时作为prop渲染转义，否则为innerHTML转义
  toString(prop) {
    //array调用join包括转码
    if(Array.isArray(this.v)) {
      return util.joinArray(this.v, prop);
    }
    var s = util.stringify(this.v);
    if(prop) {
      return util.encodeHtml(s, prop);
    }
    return this.v instanceof Element ? s : util.encodeHtml(s);
  }
  update(ov) {
    var nv = this.cb.call(this.context);
    if(!util.equal(ov, nv)) {
      this.setV(nv);
      return true;
    }
  }
}

export default Obj;
