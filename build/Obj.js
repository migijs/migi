
  function Obj(k, context, cb) {
    this.k = k;
    this.context = context;
    this.v = cb.call(context).toString();
    this.cb = cb;
  }
  Obj.prototype.toString = function() {
    return this.v;
  }


exports.default=Obj;