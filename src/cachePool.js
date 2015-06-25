var MAX = 4096;
var cache = new Array(MAX);

var o = {
  index: 0,
  add: function(item) {
    if(this.index < MAX) {
      cache[this.index++] = item;
    }
  },
  get: function() {
    return cache[--this.index];
  }
};

export default o;