import Element from './Element';
import browser from './browser';

function clone(obj) {
  if(obj instanceof Element) {
    return obj;
  }
  if(isOrigin(obj)) {
    return obj;
  }
  var o = Array.isArray(obj) ? [] : {};
  for(var i in obj) {
    if(obj.hasOwnProperty(i)) {
      var item = obj[i];
      if(item instanceof Element || browser.lie && item && item.__migiEL) {
        o[i] = item;
      }
      else if(util.isDate(item)) {
        o[i] = new Date(item);
      }
      else {
        o[i] = util.isObject(item) ? clone(item) : item;
      }
    }
  }
  return o;
}

var toString = {}.toString;
function isType(type) {
  return function(obj) {
    return toString.call(obj) == '[object ' + type + ']';
  }
}

function isOrigin(o) {
  return o === void 0 || o === null || util.isBoolean(o) || util.isNumber(o) || util.isString(o);
}
function equal(a, b) {
  //vd常量
  if(a instanceof Element || b instanceof Element || browser.lie && (a && a.__migiEL || b && b.__migiEL)) {
    return a == b;
  }
  if(isOrigin(a) || isOrigin(b)) {
    return a === b;
  }
  if(Array.isArray(a)) {
    if(!Array.isArray(b)) {
      return false;
    }
    if(a.length != b.length) {
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
    return a - b == 0;
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

function joinArray(arr, prop) {
  var res = '';
  arr.forEach(function(item) {
    if(Array.isArray(item)) {
      res += joinArray(item);
    }
    else if(item instanceof Element || browser.lie && item && item.__migiEL) {
      res += prop ? encodeHtml(item.toString(), prop) : item.toString();
    }
    else {
      res += encodeHtml(stringify(item), prop);
    }
  });
  return res;
}

function stringify(s) {
  if(s === null || s === void 0) {
    return '';
  }
  return s.toString();
}

function encodeHtml(s, prop) {
  return prop ? s.replace(/"/g, '&quot;') : s.replace(/</g, '&lt;');
}

function arr2hash(arr) {
  var hash = {};
  arr.forEach(function(item) {
    if(Array.isArray(item)) {
      hash[item[0]] = item[1];
    }
    else {
      Object.keys(item).forEach(function(k) {
        hash[k] = item[k];
      });
    }
  });
  return hash;
}

function hash2arr(hash) {
  var arr = [];
  Object.keys(hash).forEach(function(k) {
    arr.push([k, hash[k]]);
  });
  return arr;
}

var util = {
  clone(obj) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }
    return clone(obj);
  },
  isObject: isType('Object'),
  isString: isType('String'),
  isFunction: isType('Function'),
  isNumber: isType('Number'),
  isBoolean: isType('Boolean'),
  isDate: isType('Date'),
  equal(a, b) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }
    return equal(a, b);
  },
  stringify,
  encodeHtml,
  joinArray(arr, prop) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }
    return joinArray(arr, prop);
  },
  arr2hash,
  hash2arr
};

export default util;