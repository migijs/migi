define(function(require, exports, module){function clone(obj) {
  var o = Array.isArray(obj) ? [] : {};
  for(var i in obj) {
    if(obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === 'object' ? clone(obj[i]) : obj[i];
    }
  }
  return o;
}

var count = 0;

var util = {
  clone:function(obj) {
    if(typeof obj != 'object') {
      return obj;
    }
    return clone(obj);
  },
  uid:function() {
    return count++;
  }
};

exports.default=util;});