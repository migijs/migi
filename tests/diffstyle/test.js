var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.cssProperty('#test span', 'margin', '1px')
      .assert.cssProperty('#test li[migi-uid="5"]', 'padding', '1px')
      .assert.cssProperty('#test li[migi-uid="6"]', 'padding', '1px')
      .assert.cssProperty('#test li[migi-uid="7"]', 'padding', '1px')
      .assert.cssProperty('#test li[migi-uid="8"]', 'padding', '1px')
      .end()
  }
};