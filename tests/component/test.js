var path = require('path');
var fs = require('fs');

module.exports = {
  'coomponent': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test h1')
      .assert.attributeEquals('#test h1', 'migi-uid', '1')
      .assert.containsText('#test h1', 'Hello migi, this is HelloMessage')
      .getAttribute('#test h1', 'migi-name', function(result) {
        this.assert.equal(typeof result, "object");
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, "HelloMessage");
      })
      .end();
  }
};