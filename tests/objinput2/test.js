var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('#test input[ref="0"]', '123')
      .getAttribute('#test input[ref="0"]', 'checked', function(result) {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, null);
      })
      .assert.value('#test input[ref="1"]', '123')
      .getAttribute('#test input[ref="1"]', 'checked', function(result) {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, null);
      })
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .assert.value('#test input[ref="0"]', '123')
      .getAttribute('#test input[ref="0"]', 'checked', function(result) {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, 'true');
      })
      .assert.value('#test input[ref="1"]', '123')
      .getAttribute('#test input[ref="1"]', 'checked', function(result) {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, 'true');
      })
  },
  'click again': function(browser) {
    browser
      .click('#test p')
      .assert.value('#test input[ref="0"]', '123')
      .getAttribute('#test input[ref="0"]', 'checked', function(result) {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, null);
      })
      .assert.value('#test input[ref="1"]', '123')
      .getAttribute('#test input[ref="1"]', 'checked', function(result) {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, null);
      })
      .end()
  }
};