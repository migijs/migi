define(function(require, exports, module){var hash = {};

exports["default"]={
  get: function(k) {
    return hash[k];
  },
  set: function(elem) {
    hash[elem.uid] = elem;
    return elem;
  }
};});