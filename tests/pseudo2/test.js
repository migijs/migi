var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.cssProperty('#test p', 'margin', '20px')
      .assert.cssProperty('#test [migi-id="i1"]', 'margin', '100px')
      .assert.cssProperty('#test [migi-id="i2"]', 'margin', '101px')
      .assert.cssProperty('#test [migi-id="i3"]', 'margin', '102px')
      .end();
  }
};