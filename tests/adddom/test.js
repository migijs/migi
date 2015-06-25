var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="2个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'start')
      .assert.containsText('#test li[title="变量+静态"]', 'end')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="变量+DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test strong', '1,1,1,1,1,2,2,3,4,3,4,')
  },
  'add': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test li[title="1个变量"]', '0')
      .assert.containsText('#test li[title="2个变量"]', '00')
      .assert.containsText('#test li[title="静态+变量"]', 'start 0')
      .assert.containsText('#test li[title="变量+静态"]', '0 end')
      .assert.containsText('#test li[title="变量+静态+变量"]', '0 middle 0')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom0')
      .assert.containsText('#test li[title="变量+DOM"]', '0dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'dom0dom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'dom0dom0')
      .assert.containsText('#test li[title="变量+DOM+变量"]', '0dom0')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', '0dom0dom')
      .assert.containsText('#test strong', '1,2,2,2,3,2,2,3,4,3,4,')
  },
  'add again': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test li[title="1个变量"]', '01')
      .assert.containsText('#test li[title="2个变量"]', '0101')
      .assert.containsText('#test li[title="静态+变量"]', 'start 01')
      .assert.containsText('#test li[title="变量+静态"]', '01 end')
      .assert.containsText('#test li[title="变量+静态+变量"]', '01 middle 01')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom01')
      .assert.containsText('#test li[title="变量+DOM"]', '01dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'dom01dom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'dom01dom01')
      .assert.containsText('#test li[title="变量+DOM+变量"]', '01dom01')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', '01dom01dom')
      .assert.containsText('#test strong', '2,4,3,3,5,3,3,4,6,5,6,')
  },
  'del': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test li[title="1个变量"]', '0')
      .assert.containsText('#test li[title="2个变量"]', '00')
      .assert.containsText('#test li[title="静态+变量"]', 'start 0')
      .assert.containsText('#test li[title="变量+静态"]', '0 end')
      .assert.containsText('#test li[title="变量+静态+变量"]', '0 middle 0')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom0')
      .assert.containsText('#test li[title="变量+DOM"]', '0dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'dom0dom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'dom0dom0')
      .assert.containsText('#test li[title="变量+DOM+变量"]', '0dom0')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', '0dom0dom')
      .assert.containsText('#test strong', '1,2,2,2,3,2,2,3,4,3,4,')
  },
  'del again': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="2个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'start')
      .assert.containsText('#test li[title="变量+静态"]', 'end')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="变量+DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test strong', '1,1,1,1,1,2,2,3,4,3,4,')
  },
  'del empty': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="2个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'start')
      .assert.containsText('#test li[title="变量+静态"]', 'end')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="变量+DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test strong', '1,1,1,1,1,2,2,3,4,3,4,')
  },
  'add 2': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test li[title="1个变量"]', '2')
      .assert.containsText('#test li[title="2个变量"]', '22')
      .assert.containsText('#test li[title="静态+变量"]', 'start 2')
      .assert.containsText('#test li[title="变量+静态"]', '2 end')
      .assert.containsText('#test li[title="变量+静态+变量"]', '2 middle 2')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom2')
      .assert.containsText('#test li[title="变量+DOM"]', '2dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'dom2dom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'dom2dom2')
      .assert.containsText('#test li[title="变量+DOM+变量"]', '2dom2')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', '2dom2dom')
      .assert.containsText('#test strong', '1,2,2,2,3,2,2,3,4,3,4,')
  },
  'del 2': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="2个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'start')
      .assert.containsText('#test li[title="变量+静态"]', 'end')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="变量+DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test strong', '1,1,1,1,1,2,2,3,4,3,4,')
      .end()
  }
};