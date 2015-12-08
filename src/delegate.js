import sort from './sort';
import hash from './hash';
import matchUtil from './matchUtil';

function delegate(e, item, top) {
  var elem = e.target;
  var vd = hash.get(elem.getAttribute('migi-uid'));
  var names = [];
  var classes = [];
  var ids = [];console.log(vd.parent, top);
  while(vd.parent && vd.parent != top) {
    console.log(vd);
    vd = vd.parent;
  }
}

function push(vd, names, classes, ids) {
  names.push(vd.name);
  classes.push(matchUtil.splitClass(vd.__cache['class']));
}

export default delegate;