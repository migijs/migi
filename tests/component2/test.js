var path = require('path');
var fs = require('fs');

module.exports = {
  'component render return a component': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test span')
      .assert.containsText('#test span', '123')
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test span', '456')
      .end();
  }
};