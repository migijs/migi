var hash = {};

export default {
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
};
