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
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', ',before,after,beforeafter,,,,,middle,beforemiddleafter,<span migi-uid="14">dom</span>,<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><span migi-uid="19">dom</span>,<span migi-uid="21">dom</span><span migi-uid="22">dom</span>,<span migi-uid="24">dom</span><span migi-uid="25">dom</span>,')
  },
  'empty to text': function(browser) {
    browser
      .click('#test strong')
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
      .assert.containsText('#test div p[ref="1"]', '1,1,1,1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test div p[ref="2"]', 'txt,beforetxt,txtafter,beforetxtafter,txt,txt,txt,txttxt,txtmiddletxt,beforetxtmiddletxtafter,txt<span migi-uid="14">dom</span>,<span migi-uid="16">dom</span>txt,<span migi-uid="18">dom</span>txt<span migi-uid="19">dom</span>,<span migi-uid="21">dom</span>txt<span migi-uid="22">dom</span>txt,txt<span migi-uid="24">dom</span>txt<span migi-uid="25">dom</span>,')
  },
  'text to dom': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'dom')
      .assert.containsText('#test li[title="静态+变量"]', 'beforedom')
      .assert.containsText('#test li[title="变量+静态"]', 'domafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforedomafter')
      .assert.containsText('#test li[title="空+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+空"]', 'dom')
      .assert.containsText('#test li[title="空+变量+空"]', 'dom')
      .assert.containsText('#test li[title="变量+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'dommiddledom')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforedommiddledomafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdomdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdomdomdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdomdomdom')
      .assert.containsText('#test div p[ref="1"]', '1,2,2,3,2,2,3,2,3,5,2,2,3,4,4,')
      .assert.containsText('#test div p[ref="2"]', '<b migi-uid="29">dom</b>,before<b migi-uid="29">dom</b>,<b migi-uid="29">dom</b>after,before<b migi-uid="29">dom</b>after,<b migi-uid="29">dom</b>,<b migi-uid="29">dom</b>,<b migi-uid="29">dom</b>,<b migi-uid="29">dom</b><b migi-uid="29">dom</b>,<b migi-uid="29">dom</b>middle<b migi-uid="29">dom</b>,before<b migi-uid="29">dom</b>middle<b migi-uid="29">dom</b>after,<b migi-uid="29">dom</b><span migi-uid="14">dom</span>,<span migi-uid="16">dom</span><b migi-uid="29">dom</b>,<span migi-uid="18">dom</span><b migi-uid="29">dom</b><span migi-uid="19">dom</span>,<span migi-uid="21">dom</span><b migi-uid="29">dom</b><span migi-uid="22">dom</span><b migi-uid="29">dom</b>,<b migi-uid="29">dom</b><span migi-uid="24">dom</span><b migi-uid="29">dom</b><span migi-uid="25">dom</span>,')
  }
};