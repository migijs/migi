var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'before')
      .assert.containsText('#test li[title="变量+静态"]', 'after')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforeafter')
      .assert.containsText('#test li[title="空+变量"]', '')
      .assert.containsText('#test li[title="变量+空"]', '')
      .assert.containsText('#test li[title="空+变量+空"]', '')
      .assert.containsText('#test li[title="变量+变量"]', '')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforemiddleafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test strong', '1,1,1,1,1,1,1,1,1,1,2,2,3,4,4,')
  },
  'empty to text': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test li[title="1个变量"]', 'txt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxt')
      .assert.containsText('#test li[title="变量+静态"]', 'txtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtafter')
      .assert.containsText('#test li[title="空+变量"]', 'txt')
      .assert.containsText('#test li[title="变量+空"]', 'txt')
      .assert.containsText('#test li[title="空+变量+空"]', 'txt')
      .assert.containsText('#test li[title="变量+变量"]', 'txttxt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtmiddletxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtmiddletxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomtxtdom')
      .assert.containsText('#test strong', '1,1,1,1,1,1,1,1,1,1,2,2,3,4,4,')
  },
  'text to dom': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test li[title="1个变量"]', 'dom')
      .assert.elementPresent('#test li[title="1个变量"] b')
      .assert.containsText('#test li[title="静态+变量"]', 'beforedom')
      .assert.elementPresent('#test li[title="静态+变量"] b')
      .assert.containsText('#test li[title="变量+静态"]', 'domafter')
      .assert.elementPresent('#test li[title="变量+静态"] b')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforedomafter')
      .assert.elementPresent('#test li[title="静态+变量+静态"] b')
      .assert.containsText('#test li[title="空+变量"]', 'dom')
      .assert.elementPresent('#test li[title="空+变量"] b')
      .assert.containsText('#test li[title="变量+空"]', 'dom')
      .assert.elementPresent('#test li[title="变量+空"] b')
      .assert.containsText('#test li[title="空+变量+空"]', 'dom')
      .assert.elementPresent('#test li[title="空+变量+空"] b')
      .assert.containsText('#test li[title="变量+变量"]', 'dom')
      .assert.elementPresent('#test li[title="变量+变量"] b')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'dommiddledom')
      .assert.elementPresent('#test li[title="变量+静态+变量"] b')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforedommiddledomafter')
      .assert.elementPresent('#test li[title="静态+变量+静态+变量+静态"] b')
      .assert.containsText('#test li[title="变量+DOM"]', 'domdom')
      .assert.elementPresent('#test li[title="变量+DOM"] b')
      .assert.containsText('#test li[title="DOM+变量"]', 'domdom')
      .assert.elementPresent('#test li[title="DOM+变量"] b')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdomdom')
      .assert.elementPresent('#test li[title="DOM+变量+DOM"] b')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdomdomdom')
      .assert.elementPresent('#test li[title="DOM+变量+DOM+变量"] b')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdomdomdom')
      .assert.elementPresent('#test li[title="变量+DOM+变量+DOM"] b')
      .assert.containsText('#test strong', '1,1,1,1,1,1,1,1,1,1,2,2,3,4,4,')
  }
};