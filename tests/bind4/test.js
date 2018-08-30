var path = require('path');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test input')
      .assert.value('#test input', '1');
  },
  'click': function(browser) {
    browser
      .click('#test span')
      .assert.value('#test input', '2')
      .end();
  },
};