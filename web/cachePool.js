define(function(require, exports, module){var MAX = 4096;
var cache = new Array(MAX);

var o = {
  index: 0,
  add: function(item) {
    if(!item.__hasDes && this.index < MAX) {
      cache[this.index++] = item;
    }
  },
  get: function() {
    return cache[--this.index];
  }
};

exports["default"]=o;});