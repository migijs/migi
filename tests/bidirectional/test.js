var path = require('path');
var fs = require('fs');

module.exports = {
  'bidirectional': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test input[ref="1"]')
      .assert.value('#test input[ref="1"]', 'Hello!')
      .assert.elementPresent('#test input[ref="2"]')
      .assert.attributeEquals('#test input[ref="2"]', 'placeholder', 'Hello!')
      .assert.value('#test input[ref="2"]', '')
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'Hello!')
      .assert.elementPresent('#test textarea')
      .assert.value('#test textarea', 'Hello!')
      .clearValue('#test input[ref="1"]')
      .setValue('#test input[ref="1"]', '123')
      .assert.attributeEquals('#test input[ref="2"]', 'placeholder', '123')
      .assert.containsText('#test p', '123')
      .assert.value('#test textarea', '123')
      .clearValue('#test input[ref="1"]')
      .setValue('#test input[ref="1"]', '456')
      .assert.attributeEquals('#test input[ref="2"]', 'placeholder', '456')
      .assert.containsText('#test p', '456')
      .assert.value('#test textarea', '456')
      .clearValue('#test textarea')
      .setValue('#test textarea', '111')
      .assert.attributeEquals('#test input[ref="2"]', 'placeholder', '111')
      .assert.containsText('#test p', '111')
      .assert.value('#test input[ref="1"]', '111')
      .clearValue('#test input[ref="1"]')
      .setValue('#test input[ref="1"]', '123')
      .assert.attributeEquals('#test input[ref="2"]', 'placeholder', '123')
      .assert.containsText('#test p', '123')
      .assert.value('#test textarea', '123')
      .end();
  }
};