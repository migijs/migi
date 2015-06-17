var path = require('path');
var fs = require('fs');

module.exports = {
  'nonvisualcomponent': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'Hi, I am migi')
      .end();
  }
};