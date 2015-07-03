var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test [migi-name="Component"]')
      .assert.elementPresent('#test [ref="0"]')
      .assert.elementPresent('#test [ref="1"]')
      .assert.elementPresent('#test [migi-name="Component2"]')
      .assert.elementPresent('#test [ref="2"]')
      .assert.elementPresent('#test [ref="3"]')
      .assert.containsText('#test [ref="2"]', 'c2')
      .assert.value('#test [ref="3"]', 'c2')
      .clearValue('#test input[ref="3"]')
      .setValue('#test input[ref="3"]', '123')
      .assert.containsText('#test [ref="2"]', '123')
      .assert.value('#test [ref="3"]', '123')

  },
  'cp2 2 cp2': function(browser) {
    browser
      .click('#test p[ref="0"]')
      .assert.elementPresent('#test [migi-name="Component2"]')
      .assert.elementPresent('#test [ref="2"]')
      .assert.elementPresent('#test [ref="3"]')
      .assert.containsText('#test [ref="2"]', 'c2')
      .assert.value('#test [ref="3"]', 'c2')
      .clearValue('#test input[ref="3"]')
      .setValue('#test input[ref="3"]', '123')
      .assert.containsText('#test [ref="2"]', '123')
      .assert.value('#test [ref="3"]', '123')
      .end()
  }
};