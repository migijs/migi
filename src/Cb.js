class Cb {
  constructor(context, cb) {
    this.__context = context;
    this.__cb = cb;
  }
  get context() {
    return this.__context;
  }
  get cb() {
    return this.__cb;
  }
}

export default Cb;