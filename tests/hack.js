function Dom(name) {}

window = {};

document = {
  createElement: function(name) {
    return new Dom(name);
  }
};