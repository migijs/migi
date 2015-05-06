define(function(require, exports, module){
  function Obj(k, v, cb) {
    this.k = k;
    this.v = v;
    this.cb = cb;
  }
  Obj.prototype.toString = function() {
    return this.v;
  }


exports.default=Obj;});