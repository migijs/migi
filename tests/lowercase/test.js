var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test input')
      .assert.elementPresent('#test span')
      .setValue('#test input', '123')
      .assert.value('#test input', '123')
      .assert.containsText('#test span', '')
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .setValue('#test input', '456')
      .assert.value('#test input', '123')
      .assert.containsText('#test span', 'true')
      .end()
  }
};