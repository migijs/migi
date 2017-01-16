var path = require('path');
var fs = require('fs');

module.exports = {
  'arr': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p:first-child', '1')
      .assert.containsText('#test p:last-child', '1')
      .click('#test p')
      .assert.containsText('#test p:first-child', '12')
      .assert.containsText('#test p:last-child', '12')
      .end();
  }
};