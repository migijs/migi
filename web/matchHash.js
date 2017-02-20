define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var hash = {};

exports.default = {
  add: function add(uid, cb) {
    hash[uid] = cb;
  },
  del: function del(uid) {
    var cb = hash[uid];
    if (cb) {
      window.removeEventListener('mouseup', cb, true);
      window.removeEventListener('touchend', cb, true);
      window.removeEventListener('touchcancel', cb, true);
      window.removeEventListener('blur', cb);
      window.removeEventListener('dragend', cb);
      delete hash[uid];
    }
  }
};});