var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('#test input[ref="0"]', '')
      .assert.value('#test input[ref="1"]', '')
      .assert.value('#test input[ref="2"]', '123')
      .assert.value('#test input[ref="3"]', '123')
      .assert.value('#test input[ref="4"]', '123')
      .assert.value('#test input[ref="5"]', '123')
      .assert.value('#test input[ref="6"]', '')
      .assert.value('#test input[ref="7"]', '')
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .assert.value('#test input[ref="0"]', '')
      .assert.value('#test input[ref="1"]', '')
      .assert.value('#test input[ref="2"]', '123')
      .assert.value('#test input[ref="3"]', '123')
      .assert.value('#test input[ref="4"]', '123')
      .assert.value('#test input[ref="5"]', '123')
      .assert.value('#test input[ref="6"]', '456')
      .assert.value('#test input[ref="7"]', '456')
      .end()
  }
};