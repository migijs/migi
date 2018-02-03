var path = require('path');
var fs = require('fs');

module.exports = {
  'bindproperty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', '1')
      .click('#test span')
      .assert.containsText('#test p', '2')
      .end();
  }
};