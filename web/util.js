define(function(require, exports, module){var Component=function(){var _0=require('./Component');return _0.hasOwnProperty("Component")?_0.Component:_0.hasOwnProperty("default")?_0.default:_0}();
var VirtualDom=function(){var _1=require('./VirtualDom');return _1.hasOwnProperty("VirtualDom")?_1.VirtualDom:_1.hasOwnProperty("default")?_1.default:_1}();

function clone(obj) {
  if(obj instanceof Component || obj instanceof VirtualDom) {
    return obj;
  }
  var o = Array.isArray(obj) ? [] : {};
  for(var i in obj) {
    if(obj.hasOwnProperty(i)) {
      if(obj[i] instanceof Component || obj[i] instanceof VirtualDom) {
        o[i] = obj[i];
      }
      else if(util.isDate(obj[i])) {
        o[i] = new Date(obj[i]);
      }
      else {
        o[i] = util.isObject(obj[i]) ? clone(obj[i]) : obj[i];
      }
    }
  }
  return o;
}

var uid = 0;

function isType(type) {
  return function(obj) {
    return {}.toString.call(obj) == '[object ' + type + ']';
  }
}

function isOrigin(o) {
  return util.isBoolean(o) || util.isNull(o) || util.isNumber(o) || util.isUndefined(o) || util.isString(o);
}
function equal(a, b) {
  if(a === b) {
    return true;
  }
  if(isOrigin(a) || isOrigin(b) || util.isFunction(a) || util.isFunction(b)) {
    return a === b;
  }
  if(util.isArray(a)) {
    if(!util.isArray(b)) {
      return false;
    }
    if(a.length !== b.length) {
      return false;
    }
    for(var i = 0, len = a.length; i < len; i++) {
      if(!equal(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if(util.isDate(a)) {
    if(!util.isDate(b)) {
      return false;
    }
    return a.toString() === b.toString();
  }
  if(util.isObject(a)) {
    if(!util.isObject(b)) {
      return false;
    }
    var ka = Object.keys(a);
    var kb = Object.keys(b);
    if(ka.length !== kb.length) {
      return false;
    }
    for(var i = 0, len = ka.length; i < len; i++) {
      if(!b.hasOwnProperty(i) || !equal(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
}

var util = {
  clone:function(obj) {
    //fix循环依赖
    if(Component.hasOwnProperty('default')) {
      Component = Component.default;
    }
    if(VirtualDom.hasOwnProperty('default')) {
      VirtualDom = VirtualDom.default;
    }
    if(typeof obj != 'object') {
      return obj;
    }
    return clone(obj);
  },
  uid:function() {
    return uid++;
  },
  isObject: isType('Object'),
  isString: isType('String'),
  isArray: Array.isArray || isType('Array'),
  isFunction: isType('Function'),
  isUndefined: isType('Undefined'),
  isNumber: isType('Number'),
  isNull: isType('Null'),
  isBoolean: isType('Boolean'),
  isDate: isType('Date'),
  equal:function(a, b) {
    //fix循环依赖
    if(Component.hasOwnProperty('default')) {
      Component = Component.default;
    }
    if(VirtualDom.hasOwnProperty('default')) {
      VirtualDom = VirtualDom.default;
    }
    return equal(a, b);
  },
  escape: function(s) {
    var xmlchar = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      ' ': '&nbsp;'
    };
    return s.replace(/[<>&]/g, function($1){
      return xmlchar[$1];
    });
  }
};

exports.default=util;});