import sort from './sort';
import hash from './hash';
import matchUtil from './matchUtil';

function delegate(e, json, top) {
  var elem = e.target;
  var vd = hash.get(elem.getAttribute('migi-uid'));
  var names = [];
  var classes = [];
  var ids = [];
  push(vd, names, classes, ids);
  var temp = vd;
  while(temp.parent && temp.parent != top) {
    temp = temp.parent;
    push(temp, names, classes, ids);
  }
  //可能添加侦听本身
  if(vd != top) {
    push(top, names, classes, ids);
  }
  console.log(names, classes, ids);
  var res = [];
  matchSel(names.length - 1, names, classes, ids, json, vd, res);
  console.log(res);
}

function push(vd, names, classes, ids) {
  names.push(vd.name);
  classes.push(matchUtil.splitClass(vd.__cache['class']));
  ids.push(matchUtil.preId(vd.__cache.id));
}

//从底部往上匹配，即.a .b这样的选择器是.b->.a逆序对比
//过程中只要不匹配就跳出，i从最大到0
function matchSel(i, names, classes, ids, json, virtualDom, res) {
  var combo = matchUtil.combo(classes[i], names[i], ids[i], json);
  console.log(combo);
}

export default delegate;