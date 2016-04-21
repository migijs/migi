define(function(require, exports, module){var MAX = 4096;
var cache = new Array(MAX);

var pool = {
  index: 0,
  add: function(item) {
    if(!item.__hasDes && this.index < MAX) {
      cache[this.index++] = item;
      item.__hasDes = true;
    }
  },
  get: function() {
    return cache[--this.index];
  }
};

exports["default"]=pool;
});