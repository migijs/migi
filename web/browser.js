define(function(require, exports, module){var NODE = document.createElement('div');
var TABLE = document.createElement('table');
var TBODY = document.createElement('tbody');
var TR = document.createElement('tr');
var UL = document.createElement('ul');
var DL = document.createElement('dl');
var SELECT = document.createElement('select');
var MENU = document.createElement('menu');

exports["default"]={
  lie: !+'\v1',
  NODE: NODE,
  getParent:function(name) {
    switch(name) {
      case 'td':
        return TR;
      case 'tr':
        return TBODY;
      case 'tbody':
      case 'thead':
      case 'col':
        return TABLE;
      case 'li':
        return UL;
      case 'dt':
      case 'dd':
        return DL;
      case 'option':
        return SELECT;
      case 'menuitem':
        return MENU;
      default:
        return NODE;
    }
  }
};});