var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test')
      .assert.elementPresent('#test2')
      .assert.elementPresent('#test span')
      .assert.attributeEquals('#test span', 'a', '1')
      .assert.attributeEquals('#test span', 'b', '2')
      .assert.containsText('#test span', '1')
  },
  'click span': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test2', '1')
      .click('#test span')
      .assert.containsText('#test2', '11')
  },
  'click div': function(browser) {
    browser
      .click('#test div')
      .assert.elementPresent('#test span')
      .assert.attributeEquals('#test span', 'a', '3')
      .getAttribute('#test span', 'b', function(result) {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        this.assert.equal(result.value, null);
      })
      .assert.containsText('#test span', '2')
  },
  'click span2': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test2', '112')
      .click('#test span')
      .assert.containsText('#test2', '1122')
      .end();
  }
};