var path = require('path');
var fs = require('fs');

module.exports = {
  'virtualDom find&findAll': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test div span')
      .assert.containsText('#test span[ref="1"]', '1')
      .assert.containsText('#test span[ref="2"]', '2')
      .assert.containsText('#resvd', 'true')
      .assert.containsText('#res1', '1')
      .assert.containsText('#res2', '2')
  },
  'component find&findAll': function(browser) {
    browser
      .assert.elementPresent('#test2 div p')
      .assert.containsText('#test2 p[ref="3"]', '3')
      .assert.containsText('#test2 p[ref="4"]', '4')
      .assert.containsText('#rescp', 'true')
      .assert.containsText('#res3', '3')
      .assert.containsText('#res4', '4')
      .end();
  }
};