var path = require('path');
var fs = require('fs');

module.exports = {
  'simple': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test a:first-child')
      .assert.cssProperty('#test a:first-child', 'margin', '0px')
      .assert.elementPresent('#test a:last-child span')
      .assert.cssProperty('#test a:last-child span', 'margin', '0px')
  },
  'hover': function(browser) {
    browser
      .moveToElement('#test a:first-child', 1, 1)
      .assert.cssProperty('#test a:first-child', 'margin', '1px')
      .moveToElement('#test a:last-child span', 1, 1)
      .assert.cssProperty('#test a:last-child span', 'margin', '2px')
  },
  'active': function(browser) {
    browser
      .moveToElement('#test a:first-child', 1, 1)
      .mouseButtonDown('left')
      .assert.cssProperty('#test a:first-child', 'margin', '3px')
      .mouseButtonUp('left')
      .moveToElement('#test a:last-child span', 1, 1)
      .mouseButtonDown('left')
      .assert.cssProperty('#test a:last-child span', 'margin', '4px')
      .mouseButtonUp('left')
      .end();
  }
};