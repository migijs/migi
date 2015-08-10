var path = require('path');
var fs = require('fs');

module.exports = {
  'parent': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test span', '123')
      .click('#test p')
      .assert.containsText('#test span', '456')
      .assert.containsText('#test strong', 'div')
      .end();
  }
};