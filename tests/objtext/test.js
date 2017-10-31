var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test [ref="1"]', '1<div>2')
      .assert.attributeEquals('#test [ref="1"]', 'test', '1<div>2')
      .assert.containsText('#test [ref="2"]', '1&nbsp;&nbsp;2')
      .assert.attributeEquals('#test [ref="2"]', 'test', '1&nbsp;&nbsp;2')
      .assert.elementPresent('#test [ref="3"] span')
      .assert.containsText('#test [ref="3"]', '3')
      .assert.attributeEquals('#test [ref="3"]', 'test', '<span migi-uid="1">3</span>')
      .assert.elementPresent('#test [ref="4"] span')
      .assert.containsText('#test [ref="4"]', '4')
      .assert.attributeEquals('#test [ref="4"]', 'test', '<span migi-uid="2">4</span>')
  },
  'click': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref="1"]', '1<div>3')
      .assert.attributeEquals('#test [ref="1"]', 'test', '1<div>3')
      .assert.containsText('#test [ref="2"]', '1&nbsp;&nbsp;3')
      .assert.attributeEquals('#test [ref="2"]', 'test', '1&nbsp;&nbsp;3')
      .assert.elementPresent('#test [ref="3"] span')
      .assert.containsText('#test [ref="3"]', '4')
      .assert.attributeEquals('#test [ref="3"]', 'test', '<span migi-uid="10">4</span>')
      .assert.elementPresent('#test [ref="4"] span')
      .assert.containsText('#test [ref="4"]', '4')
      .assert.attributeEquals('#test [ref="4"]', 'test', '<span migi-uid="2">4</span>')
      .end();
  }
};