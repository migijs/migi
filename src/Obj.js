class Obj {
  constructor(k, v, cb) {
    this.k = k;
    this.v = v;
    this.cb = cb;
  }
  toString() {
    return this.v;
  }
}

export default Obj;