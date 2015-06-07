define(function(require, exports, module){var Element=function(){var _0=require('./Element');return _0.hasOwnProperty("default")?_0["default"]:_0}();

function clone(obj) {
  if(obj instanceof Element) {
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

//TODO: 性能优化
function join(arr) {
  var res = [];
  arr.forEach(function(item) {
    if(Array.isArray(item)) {
      res = res.concat(join(item));
    }
    else {
      res.push(item);
    }
  });
  return res;
}

function getFirst(arr) {
  var res = arr[0];
  if(Array.isArray(res)) {
    return getFirst(res);
  }
  return res;
}

function getLast(arr) {
  var res = arr[arr.length - 1];
  if(Array.isArray(res)) {
    return getLast(res);
  }
  return res;
}

var NODE = document.createElement('div');
var TABLE = document.createElement('table');
var TBODY = document.createElement('tbody');
var TR = document.createElement('tr');
var UL = document.createElement('ul');
var DL = document.createElement('dl');
var SELECT = document.createElement('select');
var LIE = !+'\v1';

var util = {
  clone:function(obj) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }
    if(typeof obj != 'object') {
      return obj;
    }
    return clone(obj);
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
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }
    return equal(a, b);
  },
  encodeHtml:function(s, prop) {
    var xmlchar = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      ' ': '&nbsp;'
    };
    return s.replace(prop ? /[<>&'"]/g : /[<>&'" ]/g, function($1){
      return xmlchar[$1];
    });
  },
  NODE: NODE,
  TABLE: TABLE,
  TR: TR,
  getParent:function(name) {
    //TODO: insertAdjacentHTML
    switch(name.toLowerCase()) {
      case 'td':
        return TR;
      case 'tr':
        return TBODY;
      case 'tbody':
      case 'thead':
        return TABLE;
      case 'li':
        return UL;
      case 'dt':
      case 'dd':
        return DL;
      case 'option':
        return SELECT;
      default:
        return NODE;
    }
  },
  lie: LIE,
  version: function() {
    if(!LIE) {
      return;
    }
    var v = 5;
    while (NODE.innerHTML = '<!--[if gt IE '+(++v)+']>1<![endif]-->', NODE.innerHTML);
    return v;
  }(),
  join:join,
  getFirst:getFirst,
  getLast:getLast
};

exports["default"]=util;});