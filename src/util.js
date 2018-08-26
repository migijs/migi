import Element from './Element';
import Obj from './Obj';

function clone(obj) {
  if(obj instanceof Element || obj instanceof Obj) {
    return obj;
  }
  if(isOrigin(obj)) {
    return obj;
  }
  var o = Array.isArray(obj) ? [] : {};
  for(var i in obj) {
    if(obj.hasOwnProperty(i)) {
      var item = obj[i];
      if(item instanceof Element) {
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
  // vd常量
  if(a instanceof Element || b instanceof Element) {
    return a === b;
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
  for(var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    if(Array.isArray(item)) {
      res += joinArray(item);
    }
    else if(item instanceof Element) {
      res += prop ? encodeHtml(item.toString(), prop) : item.toString();
    }
    else if(item instanceof Obj) {
      res += item.toString(prop);
    }
    else {
      res += encodeHtml(stringify(item), prop);
    }
  }
  return res;
}

function joinSourceArray(arr) {
  var res = '';
  for(var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    if(Array.isArray(item)) {
      res += joinSourceArray(item);
    }
    else {
      res += item.toString();
    }
  }
  return res;
}

function stringify(s) {
  if(s === null || s === void 0) {
    return '';
  }
  return s.toString();
}

function encodeHtml(s, prop) {
  if(prop) {
    return s.replace(/"/g, '&quot;');
  }
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function linear(arr, res) {
  res = res || [];
  if(Array.isArray(res)) {
    res.forEach(function(item) {
      res.push(item);
    });
  }
  else {
    res.push(arr);
  }
  return res;
}

function arrFirst(arr) {
  if(Array.isArray(arr)) {
    return arrFirst(arr[0]);
  }
  return arr;
}

function getAllChildrenElement(vd, res = []) {
  vd.__children.forEach((item) => {
    if(item instanceof migi.VirtualDom) {
      getAllChildrenElement(item, res);
      res.push(item);
    }
    else if(item instanceof migi.Component) {
      getAllChildrenElement(item.__virtualDom, res);
      res.push(item.__virtualDom);
    }
  });
  return res;
}

var util = {
  clone(obj) {
    return clone(obj);
  },
  isObject: isType('Object'),
  isString: isType('String'),
  isFunction: isType('Function'),
  isNumber: isType('Number'),
  isBoolean: isType('Boolean'),
  isDate: isType('Date'),
  equal(a, b) {
    return equal(a, b);
  },
  stringify,
  encodeHtml,
  joinArray(arr, prop) {
    return joinArray(arr, prop);
  },
  joinSourceArray(arr) {
    return joinSourceArray(arr);
  },
  linear,
  arrFirst,
  isDom: function(obj) {
    return obj instanceof Element;
  },
  getAllChildrenElement,
};

export default util;
