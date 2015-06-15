var path = require('path');
var fs = require('fs');

module.exports = {
  'explicit': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test input[ref="1"]')
      .assert.value('#test input[ref="1"]', 'army')
      .assert.elementPresent('#test input[ref="2"]')
      .assert.attributeEquals('#test input[ref="2"]', 'placeholder', 'last')
      .assert.value('#test input[ref="2"]', '')
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'My name is: army(no last)')
      .setValue('#test input[ref="1"]', '')
      .keys(browser.Keys.BACK_SPACE)
      .keys(browser.Keys.BACK_SPACE)
      .keys(browser.Keys.BACK_SPACE)
      .keys(browser.Keys.BACK_SPACE)
      .assert.containsText('#test p', 'My name is: (no name)')
      .clearValue('#test input[ref="1"]')
      .setValue('#test input[ref="1"]', 'army')
      .setValue('#test input[ref="2"]', '8735')
      .assert.containsText('#test p', 'My name is: army8735')
      .end();
  }
};