define(function(require, exports, module){var VirtualDom=function(){var _0=require('./VirtualDom');return _0.hasOwnProperty("VirtualDom")?_0.VirtualDom:_0.hasOwnProperty("default")?_0.default:_0}();
var Event=function(){var _1=require('./Event');return _1.hasOwnProperty("Event")?_1.Event:_1.hasOwnProperty("default")?_1.default:_1}();
var sort=function(){var _2=require('./sort');return _2.hasOwnProperty("sort")?_2.sort:_2.hasOwnProperty("default")?_2.default:_2}();

//names,classes,ids为从当前节点开始往上的列表
//style为jaw传入的总样式对象
//virtualDom当前传入的VirtualDom对象
//first为初始化时第一次
function match(names, classes, ids, style, virtualDom, first) {
  if(VirtualDom.hasOwnProperty('default')) {
    VirtualDom = VirtualDom['default'];
  }
  var res = [];
  matchSel(names.length - 1, names, classes, ids, style, virtualDom, res, first);
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
function matchSel(i, names, classes, ids, style, virtualDom, res, first) {
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
        //_d记录着深度，当i索引>深度跳出
        if(item._d && i > item._d) {
          break;
        }
        matchSel(i - 1, names, classes, ids, item, virtualDom.parent, res);
      }
      //i到0说明匹配完成，将值存入
      else if(item.hasOwnProperty('_v')) {
        res.push(item);
      }
      //首次进入处理:伪类
      //TODO: 不止hover
      if(first && item.hasOwnProperty('_:')) {
        item['_:'].forEach(function(pseudoItem) {
          pseudoItem[0].forEach(function(pseudo) {
            switch(pseudo) {
              case 'hover':
                virtualDom.on(Event.DOM, function() {
                  virtualDom.element.addEventListener('mouseenter', function(e) {
                    virtualDom.__hover = true;
                    virtualDom.__updateStyle();
                  });
                  virtualDom.element.addEventListener('mouseleave', function(e) {
                    virtualDom.__hover = false;
                    virtualDom.__updateStyle();
                  });
                });
                break;
              case 'active':
                virtualDom.on(Event.DOM, function() {
                  virtualDom.element.addEventListener('mousedown', function(e) {
                    virtualDom.__active = true;
                    virtualDom.__updateStyle();
                  });
                  //鼠标弹起捕获body，因为可能会移出元素后再弹起，且事件被shadow化阻止冒泡了
                  document.body.addEventListener('mouseup', function(e) {
                    virtualDom.__active = false;
                      virtualDom.__updateStyle();
                  }, true);
                });
                break;
            }
          });
        });
      }
      //有:伪类时，检查是否满足伪类情况，全部满足后追加样式
      if(item.hasOwnProperty('_:')) {
        var item2 = item['_:'];
        item2.forEach(function(pseudoItem) {
          var pseudos = pseudoItem[0];
          var isMatch = true;
          outer:
          for(var j = 0, len = pseudos.length; j < len; j++) {
            switch(pseudos[j]) {
              case 'hover':
                if(virtualDom.__hover == false) {
                  isMatch = false;
                  break outer;
                }
                break;
              case 'active':
                if(virtualDom.__active == false) {
                  isMatch = false;
                  break outer;
                }
                break;
            }
          }
          item = pseudoItem[1];
          if(isMatch && item.hasOwnProperty('_v')) {
            res.push(item);
          }
        });
      }
    }
  }
  //当前有样式值
  if(style.hasOwnProperty('_v')) {
    res.push(style);
  }
}

exports.default=match;});