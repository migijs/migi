var path = require('path');
var fs = require('fs');

module.exports = {
  'array': function(browser) {console.log(path.join(__dirname, 'index.html'))
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test div')
      .assert.elementPresent('#test h1')
      .assert.attributeEquals('#test h1', 'migi-uid', '0')
      .assert.containsText('#test h1', 'Hello world!')
      .assert.elementPresent('#test h2')
      .assert.attributeEquals('#test h2', 'migi-uid', '1')
      .assert.containsText('#test h2', 'migi is awesome!')
      .assert.containsText('#test div', '12367')
      .end();
  }
};