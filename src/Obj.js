import Element from './Element';
import util from './util';
import browser from './browser';

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
    return this.v instanceof Element || browser.lie && this.v && this.v.__migiElem ? s : util.encodeHtml(s, prop);
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