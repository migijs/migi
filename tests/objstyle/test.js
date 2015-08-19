var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test span', '123')
      .assert.cssProperty('#test span', 'margin', '2px')
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test span', '456')
      .assert.cssProperty('#test span', 'margin', '2px')
      .end();
  }
};