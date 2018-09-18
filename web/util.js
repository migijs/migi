define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _Obj = require('./Obj');

var _Obj2 = _interopRequireDefault(_Obj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _clone(obj) {
  if (obj instanceof _Element2.default || obj instanceof _Obj2.default) {
    return obj;
  }
  if (isOrigin(obj)) {
    return obj;
  }
  var o = Array.isArray(obj) ? [] : {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      var item = obj[i];
      if (item instanceof _Element2.default) {
        o[i] = item;
      } else if (util.isDate(item)) {
        o[i] = new Date(item);
      } else {
        o[i] = util.isObject(item) ? _clone(item) : item;
      }
    }
  }
  return o;
}

var toString = {}.toString;
function isType(type) {
  return function (obj) {
    return toString.call(obj) == '[object ' + type + ']';
  };
}

function isOrigin(o) {
  return o === undefined || o === null || util.isBoolean(o) || util.isNumber(o) || util.isString(o);
}
function _equal(a, b) {
  // vd常量
  if (a instanceof _Element2.default || b instanceof _Element2.default) {
    return a === b;
  }
  if (isOrigin(a) || isOrigin(b)) {
    return a === b;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }
    if (a.length != b.length) {
      return false;
    }
    for (var i = 0, len = a.length; i < len; i++) {
      if (!_equal(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (util.isDate(a)) {
    if (!util.isDate(b)) {
      return false;
    }
    return a - b == 0;
  }
  if (util.isObject(a)) {
    if (!util.isObject(b)) {
      return false;
    }
    var ka = Object.keys(a);
    var kb = Object.keys(b);
    if (ka.length !== kb.length) {
      return false;
    }
    for (var i = 0, len = ka.length; i < len; i++) {
      if (!b.hasOwnProperty(i) || !_equal(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
}

function _joinArray(arr, prop) {
  var res = '';
  for (var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    if (Array.isArray(item)) {
      res += _joinArray(item);
    } else if (item instanceof _Element2.default) {
      res += prop ? encodeHtml(item.toString(), prop) : item.toString();
    } else if (item instanceof _Obj2.default) {
      res += item.toString(prop);
    } else {
      res += encodeHtml(stringify(item), prop);
    }
  }
  return res;
}

function _joinSourceArray(arr) {
  var res = '';
  for (var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    if (Array.isArray(item)) {
      res += _joinSourceArray(item);
    } else {
      res += stringify(item);
    }
  }
  return res;
}

function stringify(s) {
  if (s === null || s === undefined) {
    return '';
  }
  return s.toString();
}

function encodeHtml(s, prop) {
  if (prop) {
    return s.replace(/"/g, '&quot;');
  }
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function linear(arr, res) {
  res = res || [];
  if (Array.isArray(res)) {
    res.forEach(function (item) {
      res.push(item);
    });
  } else {
    res.push(arr);
  }
  return res;
}

function arrFirst(arr) {
  if (Array.isArray(arr)) {
    return arrFirst(arr[0]);
  }
  return arr;
}

function getAllChildrenElement(vd) {
  var res = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  vd.__children.forEach(function (item) {
    if (item instanceof migi.VirtualDom) {
      getAllChildrenElement(item, res);
      res.push(item);
    } else if (item instanceof migi.Component) {
      getAllChildrenElement(item.__virtualDom, res);
      res.push(item.__virtualDom);
    }
  });
  return res;
}

var util = {
  clone: function clone(obj) {
    return _clone(obj);
  },

  isObject: isType('Object'),
  isString: isType('String'),
  isFunction: isType('Function'),
  isNumber: isType('Number'),
  isBoolean: isType('Boolean'),
  isDate: isType('Date'),
  equal: function equal(a, b) {
    return _equal(a, b);
  },

  stringify: stringify,
  encodeHtml: encodeHtml,
  joinArray: function joinArray(arr, prop) {
    return _joinArray(arr, prop);
  },
  joinSourceArray: function joinSourceArray(arr) {
    return _joinSourceArray(arr);
  },

  linear: linear,
  arrFirst: arrFirst,
  isDom: function isDom(obj) {
    return obj instanceof _Element2.default;
  },
  getAllChildrenElement: getAllChildrenElement
};

exports.default = util;});