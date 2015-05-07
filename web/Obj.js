define(function(require, exports, module){
  function Obj(k, context, cb) {
    this.k = k;
    this.context = context;
    this.v = cb.call(context);
    this.cb = cb;
  }
  Obj.prototype.toString = function() {
    return this.v;
  }


exports.default=Obj;});