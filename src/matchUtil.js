import sort from './sort';

export default {
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
};