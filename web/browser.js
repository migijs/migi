define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function createElement(name) {
  if (typeof window != 'undefined') {
    return document.createElement(name);
  }
}

var NODE = createElement('div');
var TABLE = createElement('table');
var TBODY = createElement('tbody');
var TR = createElement('tr');
var UL = createElement('ul');
var DL = createElement('dl');
var SELECT = createElement('select');
var MENU = createElement('menu');

exports.default = {
  NODE: NODE,
  getParent: function getParent(name) {
    switch (name) {
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