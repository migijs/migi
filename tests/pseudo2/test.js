var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.cssProperty('#test p', 'width', '20px')
      .assert.cssProperty('#test #i1', 'width', '100px')
      .assert.cssProperty('#test #i2', 'width', '101px')
      .assert.cssProperty('#test #i3', 'width', '102px')
      .end();
  }
};