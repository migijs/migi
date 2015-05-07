class Obj {
  constructor(k, context, cb) {
    this.k = k;
    this.v = cb.call(context);
    this.cb = cb;
  }
  toString() {
    return this.v;
  }
}

export default Obj;