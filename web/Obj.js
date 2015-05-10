define(function(require, exports, module){var util=function(){var _0=require('./util');return _0.hasOwnProperty("util")?_0.util:_0.hasOwnProperty("default")?_0.default:_0}();


  function Obj(k, context, cb) {
    this._k = k;
    this._context = context;
    this.v = cb.call(context);
    this._cb = cb;
  }
  var _1={};_1.k={};_1.k.get =function() {
    return this._k;
  }
  _1.context={};_1.context.get =function() {
    return this._context;
  }
  _1.v={};_1.v.get =function() {
    return this._v;
  }
  _1.v.set =function(v) {
    this._v = util.clone(v);
  }
  _1.cb={};_1.cb.get =function() {
    return this._cb;
  }
  Obj.prototype.toString = function() {
    return this.v.toString();
  }
Object.keys(_1).forEach(function(k){Object.defineProperty(Obj.prototype,k,_1[k])});

exports.default=Obj;});