var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .click('#test div')
      .assert.containsText('#test p.a', '4')
      .assert.containsText('#test p.b', '<span migi-uid="3">5</span><span migi-uid="4">6</span><span migi-uid="5">7</span>')
      .end();
  }
};