var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.elementPresent('#test input')
      .assert.attributeEquals('#test input', 'name', '')
      .assert.attributeEquals('#test input', 'test', '')
      .assert.attributeEquals('#test input', 'data-test', '')
      .assert.value('#test input', '')
      .getAttribute('#test input', 'checked', function(result) {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, null);
      })
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .assert.attributeEquals('#test input', 'name', '')
      .assert.attributeEquals('#test input', 'test', '')
      .assert.attributeEquals('#test input', 'data-test', '')
      .assert.value('#test input', '123')
      .getAttribute('#test input', 'checked', function(result) {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, 'true');
      })
  },
  'click agian': function(browser) {
    browser
      .click('#test p')
      .assert.attributeEquals('#test input', 'name', '')
      .assert.attributeEquals('#test input', 'test', '')
      .assert.attributeEquals('#test input', 'data-test', '')
      .assert.value('#test input', '')
      .getAttribute('#test input', 'checked', function(result) {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, null);
      })
      .end();
  }
};