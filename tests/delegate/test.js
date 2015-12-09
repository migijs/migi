var path = require('path');
var fs = require('fs');

module.exports = {
  'delegate': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test strong')
      .click('#test span')
      .assert.containsText('#test strong', '1')
      .click('#test span')
      .assert.containsText('#test strong', '11')
      .click('#test p')
      .assert.containsText('#test strong', '1123')
      .click('#test span')
      .assert.containsText('#test strong', '11231')
      .click('#test p')
      .assert.containsText('#test strong', '1123123')
      .end();
  }
};