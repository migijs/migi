var path = require('path');
var fs = require('fs');

module.exports = {
  'hello': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test h1')
      .assert.attributeEquals('#test h1', 'migi-uid', '0')
      .assert.containsText('#test', 'Hello, world!')
      .end();
  }
};