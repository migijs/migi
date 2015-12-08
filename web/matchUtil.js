define(function(require, exports, module){var sort=function(){var _0=require('./sort');return _0.hasOwnProperty("default")?_0["default"]:_0}();

exports["default"]={
  splitClass: function(s) {
    s = (s || '').trim();
    if(s) {
      s = s.split(/\s+/);
      sort(s, function(a, b) {
        return a > b;
      });
      return s;
    }
    else {
      return '';
    }
  },
  preId: function(s) {
    s = (s || '').trim();
    if(s) {
      return '#' + s;
    }
    else {
      return '';
    }
  }
};});