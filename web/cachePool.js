define(function(require, exports, module){var browser=function(){var _0=require('./browser');return _0.hasOwnProperty("default")?_0["default"]:_0}();

var MAX = 4096;
var cache = new Array(MAX);

var pool = {
  index: 0,
  add: function(item) {
    if(!browser.lie && !item.__hasDes && this.index < MAX) {
      cache[this.index++] = item;
    }
  },
  get: function() {
    return cache[--this.index];
  }
};

exports["default"]=pool;});