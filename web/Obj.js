define(function(require, exports, module){var Element=function(){var _0=require('./Element');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var browser=function(){var _2=require('./browser');return _2.hasOwnProperty("default")?_2["default"]:_2}();


  function Obj(k, context, cb) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }

    this.__k = k;
    this.__context = context;
    this.__cb = cb;
    this.v = cb.call(context);
  }
  var _3={};_3.k={};_3.k.get =function() {
    return this.__k;
  }
  _3.context={};_3.context.get =function() {
    return this.__context;
  }
  _3.v={};_3.v.get =function() {
    return this.__v;
  }
  _3.v.set =function(v) {
    this.__v = util.clone(v);
  }
  _3.cb={};_3.cb.get =function() {
    return this.__cb;
  }
  Obj.prototype.toString = function(prop) {
    //array调用join包括转码
    if(Array.isArray(this.v)) {
      return util.joinArray(this.v, prop);
    }
    //防止undefined的变量
    if(this.v === void 0 || this.v === null) {
      return '';
    }
    var s = this.v.toString();
    if(prop) {
      return util.encodeHtml(s, prop);
    }
    return this.v instanceof Element || browser.lie && this.v && this.v.__migiElem ? s : util.encodeHtml(s, prop);
  }
  Obj.prototype.update = function(ov) {
    var nv = this.cb.call(this.context);
    if(!util.equal(ov, nv)) {
      this.v = nv;
      return true;
    }
  }
Object.keys(_3).forEach(function(k){Object.defineProperty(Obj.prototype,k,_3[k])});

exports["default"]=Obj;});