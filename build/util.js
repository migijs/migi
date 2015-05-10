var VirtualDom=function(){var _0=require('./VirtualDom');return _0.hasOwnProperty("VirtualDom")?_0.VirtualDom:_0.hasOwnProperty("default")?_0.default:_0}();

function clone(obj) {
  //fixѭ������
  if(VirtualDom.hasOwnProperty('default')) {
    VirtualDom = VirtualDom.default;
  }
  var o = Array.isArray(obj) ? [] : {};
  for(var i in obj) {
    if(obj.hasOwnProperty(i)) {
      if(obj[i] instanceof VirtualDom) {
        o[i] = obj[i].toString();
      }
      else {
        o[i] = typeof obj[i] === 'object' ? clone(obj[i]) : obj[i];
      }
    }
  }
  return o;
}

var count = 0;

function isType(type) {
  return function(obj) {
    return {}.toString.call(obj) == "[object " + type + "]";
  }
}

function isOrigin(o) {
  return util.isBoolean(o) || util.isNull(o) || util.isNumber(o) || util.isUndefined(o) || util.isString(o);
}
function equal(a, b) {
  //fixѭ������
  if(VirtualDom.hasOwnProperty('default')) {
    VirtualDom = VirtualDom.default;
  }
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
  if(a instanceof VirtualDom) {
    if(!b instanceof VirtualDom) {
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
      if(!(i in b) || !equal(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
}

var util = {
  clone:function(obj) {
    if(typeof obj != 'object') {
      return obj;
    }
    return clone(obj);
  },
  uid:function() {
    return count++;
  },
  isObject: isType("Object"),
  isString: isType("String"),
  isArray: Array.isArray || isType("Array"),
  isFunction: isType("Function"),
  isUndefined: isType("Undefined"),
  isNumber: isType("Number"),
  isNull: isType("Null"),
  isBoolean: isType("Boolean"),
  isDate: isType("Date"),
  equal:equal
};

exports.default=util;