var path = require('path');
var fs = require('fs');

module.exports = {
  'empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'len:10,html:<span ref="empty" migi-uid="1"></span><span ref="udf" migi-uid="2"></span>text<span ref="null" migi-uid="3"></span><span ref="estring" migi-uid="4"></span><span ref="earr" migi-uid="5"></span><p migi-uid="6"></p>')
      .end();
  }
};