define(function(require, exports, module){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var hash = {};

exports.default = {
  get: function get(k) {
    return hash[k];
  },
  set: function set(elem) {
    hash[elem.__uid] = elem;
    return elem;
  }
};});