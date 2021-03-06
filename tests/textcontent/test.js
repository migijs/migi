var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test [ref="1"]', '')
      .assert.containsText('#test [ref="2"]', '')
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref="1"]', '1 2')
      .assert.containsText('#test [ref="2"]', '1&nbsp;&nbsp;2')
      .end();
  }
};