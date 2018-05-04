var path = require('path');
var fs = require('fs');

module.exports = {
  'cachecomponent3': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'count: 100001')
      .assert.containsText('#test2', '1')
      .assert.containsText('#test3', 'count,count2')
      .end();
  }
};