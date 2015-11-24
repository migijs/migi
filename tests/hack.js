function Dom(name) {}

window = {};

navigator = {
  userAgent: ''
};

document = {
  createElement: function(name) {
    return new Dom(name);
  },
  querySelector: function() {}
};