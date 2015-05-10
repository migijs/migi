var VirtualDom=function(){var _0=require('./VirtualDom');return _0.hasOwnProperty("VirtualDom")?_0.VirtualDom:_0.hasOwnProperty("default")?_0.default:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("util")?_1.util:_1.hasOwnProperty("default")?_1.default:_1}();


  function Obj(k, context, cb) {
    //fix循环依赖
    if(VirtualDom.hasOwnProperty('default')) {
      VirtualDom = VirtualDom.default;
    }
    this._k = k;
    this._context = context;
    this.v = cb.call(context);
    this._cb = cb;
  }
  var _2={};_2.k={};_2.k.get =function() {
    return this._k;
  }
  _2.context={};_2.context.get =function() {
    return this._context;
  }
  _2.v={};_2.v.get =function() {
    return this._v;
  }
  _2.v.set =function(v) {
    this._v = util.clone(v);
  }
  _2.cb={};_2.cb.get =function() {
    return this._cb;
  }
  Obj.prototype.toString = function() {
    return (this.v || '').toString();
  }
Object.keys(_2).forEach(function(k){Object.defineProperty(Obj.prototype,k,_2[k])});

exports.default=Obj;