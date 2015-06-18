var path = require('path');
var fs = require('fs');

module.exports = {
  'single instance': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementNotPresent('#test div')
      .assert.elementPresent('#test1 div')
      .assert.containsText('#test1 div', '1')
  },
  'inTo': function(browser) {
    browser
      .assert.elementPresent('#test2 div')
      .assert.containsText('#test2 div', '2')
  },
  'appendTo only': function(browser) {
    browser
      .assert.elementPresent('#test3 div')
      .assert.containsText('#test3 div', '3')
  },
  'appendTo not only': function(browser) {
    browser
      .assert.elementPresent('#test4 span')
      .assert.containsText('#test4 span', 'placeholder')
      .assert.containsText('#test4 *:first-child', 'placeholder')
      .assert.elementPresent('#test4 div')
      .assert.containsText('#test4 div', '4')
      .assert.containsText('#test4 *:last-child', '4')
  },
  'prependTo only': function(browser) {
    browser
      .assert.elementPresent('#test5 div')
      .assert.containsText('#test5 div', '5')
  },
  'prependTo not only': function(browser) {
    browser
      .assert.elementPresent('#test6 span')
      .assert.containsText('#test6 span', 'placeholder')
      .assert.containsText('#test6 *:last-child', 'placeholder')
      .assert.elementPresent('#test6 div')
      .assert.containsText('#test6 div', '6')
      .assert.containsText('#test6 *:first-child', '6')
  },
  'beforeDOM': function(browser) {
    browser
      .assert.elementPresent('#test7 span')
      .assert.containsText('#test7 span', 'placeholder')
      .assert.containsText('#test7 *:last-child', 'placeholder')
      .assert.elementPresent('#test7 div')
      .assert.containsText('#test7 div', '7')
      .assert.containsText('#test7 *:first-child', '7')
  },
  'afterDOM': function(browser) {
    browser
      .assert.elementPresent('#test8 span')
      .assert.containsText('#test8 span', 'placeholder')
      .assert.containsText('#test8 *:first-child', 'placeholder')
      .assert.elementPresent('#test8 div')
      .assert.containsText('#test8 div', '8')
      .assert.containsText('#test8 *:last-child', '8')
  },
  'replace': function(browser) {
    browser
      .assert.elementPresent('#test9 div')
      .assert.containsText('#test9 div', '9')
      .assert.elementNotPresent('#test9 span')
      .end()
  }
};