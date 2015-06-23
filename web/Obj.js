define(function(require, exports, module){var Element=function(){var _0=require('./Element');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();


  function Obj(k, context, cb) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }

    this.__k = k;
    this.__context = context;
    this.__empty = true;
    this.type = null;
    this.__count = 0;
    this.__cb = cb;
    this.v = cb.call(context);
  }
  var _2={};_2.k={};_2.k.get =function() {
    return this.__k;
  }
  _2.context={};_2.context.get =function() {
    return this.__context;
  }
  _2.v={};_2.v.get =function() {
    return this.__v;
  }
  _2.v.set =function(v) {
    this.__v = util.clone(v);
  }
  _2.cb={};_2.cb.get =function() {
    return this.__cb;
  }
  Obj.prototype.toString = function() {
    var s = Array.isArray(this.v) ? util.joinArray(this.v) : this.v;
    //防止undefined的变量
    return s === void 0 ? '' : s.toString();
  }
  Obj.prototype.update = function(ov) {
    var nv = this.cb.call(this.context);
    if(!util.equal(ov, nv)) {
      this.v = nv;
      return true;
    }
  }
Object.keys(_2).forEach(function(k){Object.defineProperty(Obj.prototype,k,_2[k])});

exports["default"]=Obj;});