define(function(require, exports, module){var Element=function(){var _0=require('./Element');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var browser=function(){var _2=require('./browser');return _2.hasOwnProperty("default")?_2["default"]:_2}();


  function Obj(k, context, cb) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }

    this.k = k;
    this.context = context;
    this.cb = cb;
    this.setV(cb.call(context));
  }
  Obj.prototype.setV = function(v) {
    this.v = util.clone(v);
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
    return this.v instanceof Element || browser.lie && this.v && this.v.__migiEL ? s : util.encodeHtml(s, prop);
  }
  Obj.prototype.update = function(ov) {
    var nv = this.cb.call(this.context);
    if(!util.equal(ov, nv)) {
      this.setV(nv);
      return true;
    }
  }


exports["default"]=Obj;});