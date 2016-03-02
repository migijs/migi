var path = require('path');
var fs = require('fs');

module.exports = {
  'target': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .click('#test p')
      .assert.containsText('#test2', 'p')
      .assert.containsText('#test3', 'span')
      .end();
  }
};