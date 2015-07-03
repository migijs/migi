var path = require('path');
var fs = require('fs');

module.exports = {
  'bridge event': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test [migi-uid="13"]', '11')
      .assert.containsText('#test [migi-uid="14"]', '11')
      .assert.containsText('#test [migi-uid="15"]', '22')
      .assert.containsText('#test [migi-uid="16"]', '22')
      .assert.containsText('#test [migi-uid="17"]', '33')
      .assert.containsText('#test [migi-uid="18"]', '3333')
      .assert.containsText('#test [migi-uid="19"]', '44')
      .assert.containsText('#test [migi-uid="20"]', '44')
      .assert.containsText('#test [migi-uid="21"]', '55')
      .assert.containsText('#test [migi-uid="22"]', '555555')
      .assert.containsText('#test [migi-uid="23"]', '66')
      .assert.containsText('#test [migi-uid="24"]', '66')
      .end()
  }
};