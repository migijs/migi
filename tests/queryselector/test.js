var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test #p0', 'false')
      .assert.containsText('#test #p1', 'true')
      .assert.containsText('#test .p2', 'true')
      .assert.containsText('#test div', 'true')
      .assert.containsText('#test [test="p4"]', 'true')
      .assert.containsText('#test [Up]', 'true')
      .assert.containsText('#test [migi-name="Inner"]', 'true')
      .end();
  }
};