define(function(require, exports, module){var sort=function(){var _0=require('./sort');return _0.hasOwnProperty("sort")?_0.sort:_0.hasOwnProperty("default")?_0["default"]:_0}();

function match(names, classes, ids, style) {
  var res = [];
  matchSel(names.length - 1, names, classes, ids, style, res);
  sort(res, function(a, b) {
    return a._p > b._p;
  });
  var s = '';
  res.forEach(function(item) {
    sort(item._v, function(a, b) {
      return a[0] > b[0];
    });
    item._v.forEach(function(style) {
      s += style[1] + ';';
    });
  });
  return s;
}
//从底部往上匹配，即.a .b这样的选择器是.b->.a逆序对比
//过程中只要不匹配就跳出，i从最大到0
function matchSel(i, names, classes, ids, style, res) {
  //id、class、name可能单个或组合出现，每种都要匹配
  var combo = [];
  combo.push(names[i]);
  if(classes[i]) {
    combo.push(classes[i]);
  }
  if(ids[i]) {
    combo.push(ids[i]);
  }
  //排序，name<class<id
  sort(combo, function(a, b) {
    return a < b;
  });
  //将可能的组合添加进入combo
  for(var j = 0, len = combo.length; j < len; j++) {
    var s = combo[j];
    for(var k = j + 1; k < len; k++) {
      s += combo[k];
      combo.push(s);
    }
  }
  for(var j = 0, len = combo.length; j < len; j++) {
    var k = combo[j];
    if(style.hasOwnProperty(k)) {
      var item = style[k];
      if(i) {
        //_d记录着深度，当i索引>深度或者深度不存在（说明没有后续）跳出
        if(item._d && i > item._d || !item._d) {
          return;
        }
        matchSel(i - 1, names, classes, ids, item, res);
      }
      //i到0说明匹配完成，将值存入
      else {
        res.push(item);
      }
    }
  }
}

exports["default"]=match;});