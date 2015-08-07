define(function(require, exports, module){var PROTECT = {
  constructor: true
};

var mix = {
  //不包括原型链mix
  s:function(target, data) {
    data=[].slice.call(arguments, 1);data.forEach(function(item) {
      mix.p(target, item, true);
    });
    return target;
  },
  //包括原型链mix
  p:function(target, data, noProto) {
    for(var i in data) {
      if(!PROTECT.hasOwnProperty(i)) {
        if(!noProto || data.hasOwnProperty(i)) {
          target[i] = data[i];
        }
      }
    }
    return target;
  }
};

exports["default"]=mix;});