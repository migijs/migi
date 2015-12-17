function Dom(name) {}

window = {
  screen: {
    width: 1024,
    height: 768
  },
  innerWidth: 1024,
  innerHeight: 768,
  devicePixelRatio: 2,
  addEventListener: function() {}
};

navigator = {
  userAgent: ''
};

document = {
  documentElement: {},
  body: {},
  createElement: function(name) {
    return new Dom(name);
  },
  querySelector: function() {
    return {
      setAttribute: function() {},
      addEventListener: function() {},
      querySelector: function() {},
      querySelectorAll: function() {
        return [];
      }
    };
  }
};