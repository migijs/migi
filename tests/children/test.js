var path = require('path');
var fs = require('fs');

module.exports = {
  'children': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test li[migi-uid="3"]')
      .assert.containsText('#test li[migi-uid="3"]', 'first')
      .assert.elementPresent('#test li[migi-uid="4"]')
      .assert.elementPresent('#test li[migi-uid="4"] span')
      .assert.containsText('#test li[migi-uid="4"] span', 'hello')
      .assert.elementPresent('#test li[migi-uid="5"]')
      .assert.elementPresent('#test li[migi-uid="5"] span', 'world')
      .end();
  }
};