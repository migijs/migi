import sort from './sort';

function match(names, classes, style) {
  var res = { s: '' };
  matchSel(names.length - 1, names, classes, style, res);
  return res.s;
}
function matchSel(i, names, classes, style, res) {
  if(style.hasOwnProperty(names[i])) {
    var k = names[i];
    var item = style[k];
    if(i) {
      if(item._d && i > item._d || !item._d) {
        return;
      }
      matchSel(i - 1, names, classes, item, res);
    }
    else {
      if(item._v) {
        res.s += item._v;
      }
    }
  }
  if(style.hasOwnProperty(classes[i])) {
    var k = classes[i];
    var item = style[k];
    if(i) {
      if(item._d && i > item._d || !item._d) {
        return;
      }
      matchSel(i - 1, names, classes, item, res);
    }
    else {
      if(item._v) {
        res.s += item._v;
      }
    }
  }
  if(style.hasOwnProperty(names[i] + classes[i])) {
    //TODO: 优先级结合
  }
}

export default match;