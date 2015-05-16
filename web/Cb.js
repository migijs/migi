define(function(require, exports, module){
  function Cb(context, cb) {
    this.__context = context;
    this.__cb = cb;
  }
  var _0={};_0.context={};_0.context.get =function() {
    return this.__context;
  }
  _0.cb={};_0.cb.get =function() {
    return this.__cb;
  }
Object.keys(_0).forEach(function(k){Object.defineProperty(Cb.prototype,k,_0[k])});

exports.default=Cb;});