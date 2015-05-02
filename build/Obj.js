
  function Obj(k, v) {
    this.k = k;
    this.v = v;
  }
  Obj.prototype.toString = function() {
    return this.v;
  }


exports.default=Obj;