define(function(require, exports, module){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MAX = 4096;
var cache = new Array(MAX);

var pool = {
  index: 0,
  add: function add(item) {
    if (!item.__hasDes && this.index < MAX) {
      cache[this.index++] = item;
      item.__hasDes = true;
    }
  },
  get: function get() {
    return cache[--this.index];
  }
};

exports.default = pool;});