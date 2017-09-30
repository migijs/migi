function createElement(name) {
  if(typeof window != 'undefined') {
    return document.createElement(name);
  }
}

const NODE = createElement('div');
const TABLE = createElement('table');
const TBODY = createElement('tbody');
const TR = createElement('tr');
const UL = createElement('ul');
const DL = createElement('dl');
const SELECT = createElement('select');
const MENU = createElement('menu');

export default {
  NODE: NODE,
  getParent(name) {
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
};
