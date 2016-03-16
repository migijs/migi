var path = require('path');
var fs = require('fs');

module.exports = {
  'dom2': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test span')
      .assert.containsText('#test span', '0')
      .click('#test p')
      .assert.containsText('#test span', '1')
      .end();
  }
};