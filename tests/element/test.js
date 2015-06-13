var path = require('path');
var fs = require('fs');

module.exports = {
  'element': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test input')
      .click('#test input:last-child')
      .getValue('#test input:first-child', function(result) {
        this.assert.equal(typeof result, "object");
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, '1');
      })
      .end();
  }
};