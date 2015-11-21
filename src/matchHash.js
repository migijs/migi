import browser from './browser';

var hash = {};

export default {
  add: function(uid, cb) {
    hash[uid] = cb;
  },
  del: function(uid) {
    var cb = hash[uid];
    if(cb) {
      if(browser.lie && window.attachEvent) {
        window.detachEvent('onmouseup', cb, true);
        window.detachEvent('onblur', cb);
        window.detachEvent('ondragend', cb);
      }
      else {
        window.removeEventListener('mouseup', cb, true);
        window.removeEventListener('touchend', cb, true);
        window.removeEventListener('touchcancel', cb, true);
        window.removeEventListener('blur', cb);
        window.removeEventListener('dragend', cb);
      }
      delete hash[uid];
    }
  }
};