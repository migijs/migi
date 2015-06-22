define(function(require, exports, module){var VirtualDom=function(){var _0=require('./VirtualDom');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Event=function(){var _1=require('./Event');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var sort=function(){var _2=require('./sort');return _2.hasOwnProperty("default")?_2["default"]:_2}();

//names,classes,ids为从当前节点开始往上的列表
//style为jaw传入的总样式对象
//virtualDom当前传入的VirtualDom对象
//first为初始化时第一次
function match(names, classes, ids, style, virtualDom, first) {
  //fix循环依赖
  if(VirtualDom.hasOwnProperty('default')) {
    VirtualDom = VirtualDom['default'];
  }
  var res = [];
  var history = {};
  matchSel(names.length - 1, names, classes, ids, style, virtualDom, res, String(names.length - 1), history, first);
  sort(res, function(a, b) {
    if(a[2] == b[2]) {
      return a[0] > b[0];
    }
    return a[2] > b[2];
  });
  var s = '';
  res.forEach(function(item) {
    s += item[1] + ';';
  });
  return s;
}
//从底部往上匹配，即.a .b这样的选择器是.b->.a逆序对比
//过程中只要不匹配就跳出，i从最大到0
function matchSel(i, names, classes, ids, style, virtualDom, res, cur, history, first) {
  history[cur] = true;
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
      //_d记录着深度，没有深度（为0）不记录即不存在_d跳出
      if(i) {
        if(style._d) {
          matchSel(i - 1, names, classes, ids, item, virtualDom.parent, res, cur + ',' + (i - 1) + ':' + j, history);
        }
        //多层级时需递归所有层级组合，如<div><p><span>对应div span{}的样式时，并非一一对应
        for(var l = i - 2; l >= 0; l--) {
          var key = cur + ',' + l + ':' + j;
          if(!history.hasOwnProperty(key)) {
            matchSel(l, names, classes, ids, item, virtualDom.parent, res, key, history);
          }
        }
      }
      //i到0说明匹配完成，将值存入
      if(item.hasOwnProperty('_v')) {
        dealStyle(res, item);
      }
      //首次进入处理:伪类
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
                  //window失焦时也需判断
                  window.addEventListener('blur', function(e) {
                    virtualDom.__active = false;
                    virtualDom.__updateStyle();
                  });
                  //drag结束时也需判断
                  window.addEventListener('dragend', function(e) {
                    virtualDom.__active = false;
                    virtualDom.__updateStyle();
                  });
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
                if(!virtualDom.__hover) {
                  isMatch = false;
                  break outer;
                }
                break;
              case 'active':
                if(!virtualDom.__active) {
                  isMatch = false;
                  break outer;
                }
                break;
              case 'first-child':
                if(!virtualDom.isFirst()) {
                  isMatch = false;
                  break outer;
                }
                break;
              case 'last-child':
                if(!virtualDom.isLast()) {
                  isMatch = false;
                  break outer;
                }
                break;
              //TODO:其它伪类
              default:
                isMatch = false;
                break;
            }
          }
          if(isMatch) {
            item2 = pseudoItem[1];
            //同普通匹配一样
            if(i) {
              matchSel(i - 1, names, classes, ids, item2, virtualDom.parent, res, cur + ',' + (i - 1) + ':' + j, history);
            }
            if(item2.hasOwnProperty('_v')) {
              dealStyle(res, item2);
            }
          }
        });
      }
      //有:[属性时，检查是否满足伪类情况，全部满足后追加样式
      if(item.hasOwnProperty('_[')) {
        var item2 = item['_['];
        item2.forEach(function(attrItem) {
          var attrs = attrItem[0];
          var isMatch = true;
          outer:
          for(var j = 0, len = attrs.length; j < len; j++) {
            var attr = attrs[j];
            //[attr]形式，只要有属性即可
            if(attr.length == 1) {
              if(!virtualDom.__cache.hasOwnProperty(attr[0])) {
                isMatch = false;
                break;
              }
            }
            //[attr=xxx]形式，需比较值
            else {
              var p = virtualDom.__cache[attr[0]];
              if(p === undefined) {
                isMatch = false;
                break outer;
              }
              var v = attr[2];
              switch(attr[1]) {
                case '=':
                  isMatch = p == v;
                  break;
                case '^=':
                  isMatch = p.indexOf(v) == 0;
                  break;
                case '$=':
                  isMatch = p.length >= v.length && p.indexOf(v) == p.length - v.length;
                  break;
                case '~=':
                  var reg = new RegExp('\\b' + v + '\\b');
                  isMatch = reg.test(p);
                  break;
                case '*=':
                  isMatch = p.indexOf(v) > -1;
                  break;
                case '|=':
                  isMatch = p.indexOf(v) == 0 || p.indexOf(v + '-') == 0;
                  break;
                default:
                  isMatch = false;
                  break outer;
              }
              if(!isMatch) {
                break outer;
              }
            }
          }
          if(isMatch) {
            item2 = attrItem[1];
            //同普通匹配一样
            if(i) {
              matchSel(i - 1, names, classes, ids, item2, virtualDom.parent, res, cur + ',' + (i - 1) + ':' + j, history);
            }
            if(item2.hasOwnProperty('_v')) {
              dealStyle(res, item2);
            }
          }
        });
      }
    }
  }
}

function dealStyle(res, item) {
  item._v.forEach(function(style) {
    style[2] = item._p;
    res.push(style);
  });
}

exports["default"]=match;});