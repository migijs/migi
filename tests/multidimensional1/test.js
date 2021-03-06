var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test div div', '1234')
      .end()
  }
};