var path = require('path');
var fs = require('fs');

module.exports = {
  'bridge event': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test [migi-uid="11"]', '11')
      .assert.containsText('#test [migi-uid="12"]', '11')
      .assert.containsText('#test [migi-uid="13"]', '22')
      .assert.containsText('#test [migi-uid="14"]', '22')
      .assert.containsText('#test [migi-uid="15"]', '33')
      .assert.containsText('#test [migi-uid="16"]', '3333')
      .assert.containsText('#test [migi-uid="17"]', '44')
      .assert.containsText('#test [migi-uid="18"]', '44')
      .assert.containsText('#test [migi-uid="19"]', '55')
      .assert.containsText('#test [migi-uid="20"]', '555555')
      .end()
  }
};