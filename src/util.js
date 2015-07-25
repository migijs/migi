import Element from './Element';

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
      if(obj[i] instanceof Element) {
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
  if(a instanceof Element || b instanceof Element) {
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
    else if(item instanceof Element) {
      res += item.toString();
    }
    else if(item === void 0 || item === null) {
      res += '';
    }
    else {
      res += util.encodeHtml(item.toString(), prop);
    }
  });
  return res;
}

const NODE = document.createElement('div');
const TABLE = document.createElement('table');
const TBODY = document.createElement('tbody');
const TR = document.createElement('tr');
const UL = document.createElement('ul');
const DL = document.createElement('dl');
const SELECT = document.createElement('select');
const MENU = document.createElement('menu');
const LIE = !+'\v1';

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
  encodeHtml(s, prop) {
    return prop ? s.replace(/"/g, '&quot;') : s.replace(/</g, '&lt;');
  },
  NODE: NODE,
  getParent(name) {
    switch(name) {
      case 'td':
        return TR;
      case 'tr':
        return TBODY;
      case 'tbody':
      case 'thead':
      case 'col':
        return TABLE;
      case 'li':
        return UL;
      case 'dt':
      case 'dd':
        return DL;
      case 'option':
        return SELECT;
      case 'menuitem':
        return MENU;
      default:
        return NODE;
    }
  },
  lie: LIE,
  joinArray(arr, prop) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }
    return joinArray(arr, prop);
  },
  smix(target, ...data) {
    data.forEach(function(item) {
      Object.keys(item).forEach(function(k) {
        target[k] = item[k];
      });
    });
  }
};

export default util;