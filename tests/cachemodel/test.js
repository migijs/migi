var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.elementPresent('#test span')
      .assert.containsText('#test span', '0')
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test span', '100000')
      .click('#test p')
      .assert.containsText('#test span', '200000')
      .end();
  }
};