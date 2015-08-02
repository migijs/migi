const TABLE = document.createElement('table');
const TBODY = document.createElement('tbody');
const TR = document.createElement('tr');
const UL = document.createElement('ul');
const DL = document.createElement('dl');
const SELECT = document.createElement('select');
const MENU = document.createElement('menu');

var o = {
  lie: !+'\v1',
  NODE: document.createElement('div'),
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

export default o;