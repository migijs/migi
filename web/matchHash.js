define(function(require, exports, module){var browser=function(){var _0=require('./browser');return _0.hasOwnProperty("default")?_0["default"]:_0}();

var hash = {};

exports["default"]={
  add: function(uid, cb) {
    hash[uid] = cb;
  },
  del: function(uid) {
    var cb = hash[uid];
    if(cb) {
      window.removeEventListener('mouseup', cb, true);
      window.removeEventListener('touchend', cb, true);
      window.removeEventListener('touchcancel', cb, true);
      window.removeEventListener('blur', cb);
      window.removeEventListener('dragend', cb);
      delete hash[uid];
    }
  }
};});