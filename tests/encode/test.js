var path = require('path');
var fs = require('fs');

module.exports = {
  'encode': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test span#s1')
      .assert.containsText('#test span#s1', '>')
      .assert.elementPresent('#test span#s2')
      .assert.containsText('#test span#s2', '')
      .assert.elementPresent('#test span#s3')
      .assert.containsText('#test span#s3', '<')
      .assert.elementPresent('#test span#s4')
      .assert.containsText('#test span#s4', '<div>')
      .assert.elementPresent('#test span#s5')
      .assert.containsText('#test span#s5', '')
      .assert.elementPresent('#test span#s6')
      .assert.containsText('#test span#s6', '&')
      .assert.elementPresent('#test span#s7')
      .assert.containsText('#test span#s7', '&')
      .assert.elementPresent('#test span#s8')
      .assert.containsText('#test span#s8', '"')
      .assert.elementPresent('#test span#s9')
      .assert.containsText('#test span#s9', '1"23')
      .assert.elementPresent('#test span#s10')
      .assert.containsText('#test span#s10', '1"23')
      .end();
  }
};