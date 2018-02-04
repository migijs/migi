var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .click('#test p')
      .assert.containsText('#test span', '1')
      .assert.containsText('#test b', '2')
      .assert.containsText('#test strong', '3')
      .end();
  }
};