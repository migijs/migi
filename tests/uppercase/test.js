var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test select')
      .assert.value('#test select', '1')
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .assert.value('#test select', '3')
      .end()
  }
};