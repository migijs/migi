function clone(obj) {
  var o = Array.isArray(obj) ? [] : {};
  for(var i in obj) {
    if(obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === 'object' ? clone(obj[i]) : obj[i];
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
  isDom: function(obj) {
    return obj instanceof HTMLElement;
  }
};

exports.default=util;