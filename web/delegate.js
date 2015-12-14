define(function(require, exports, module){var sort=function(){var _0=require('./sort');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var hash=function(){var _1=require('./hash');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var matchUtil=function(){var _2=require('./matchUtil');return _2.hasOwnProperty("default")?_2["default"]:_2}();

var res;

function delegate(e, json, top) {
  var elem = e.target;
  var vd = hash.get(elem.getAttribute('migi-uid'));
  var names = [];
  var classes = [];
  var ids = [];
  //可能添加侦听本身
  if(vd != top) {
    push(top, names, classes, ids);
  }
  push(vd, names, classes, ids);
  var temp = vd;
  while(temp.parent && temp.parent != top) {
    temp = temp.parent;
    push(temp, names, classes, ids);
  }
  res = false;
  matchSel(names.length - 1, names, classes, ids, json, vd);
  return res;
}

function push(vd, names, classes, ids) {
  names.push(vd.name);
  classes.push(matchUtil.splitClass(vd.__cache['class']));
  ids.push(matchUtil.preId(vd.__cache.id));
}

//从底部往上匹配，即.a .b这样的选择器是.b->.a逆序对比
//过程中只要不匹配就跳出，i从最大到0
function matchSel(i, names, classes, ids, json, virtualDom) {
  //只要有一次命中即跳出，不同于css样式全部递归完毕
  var item2;if(res) {
    return;
  }
  var combo = matchUtil.combo(classes[i], names[i], ids[i], json);
  for(var j = 0, len = combo.length; j < len; j++) {
    var k = combo[j];
    if(json.hasOwnProperty(k)) {
      var item = json[k];
      //还未到根节点继续匹配
      if(i) {
        matchSel(i - 1, names, classes, ids, item, virtualDom.parent);
        //多层级时需递归所有层级组合，如<div><p><span>对应div span{}的样式时，并非一一对应
        for(var l = i - 2; l >= 0; l--) {
          matchSel(l, names, classes, ids, item, virtualDom.parent);
        }
      }
      //将当前层次的值存入
      if(item.hasOwnProperty('_v')) {
        res = true;
        return;
      }
      //:和[可能同时存在，也可能分开
      if(item.hasOwnProperty('_:') || item.hasOwnProperty('_[')) {!function(){
        item2;
        //有:伪类时，检查是否满足伪类情况，全部满足后追加样式
        if(item.hasOwnProperty('_:')) {
          item2 = item['_:'];
          item2.forEach(function(pseudoItem) {
            var isMatch = matchUtil.pseudo(pseudoItem[0], virtualDom, k);
            if(isMatch) {
              item2 = pseudoItem[1];
              //同普通匹配一样
              if(i) {
                matchSel(i - 1, names, classes, ids, item2, virtualDom.parent);
              }
              if(item2.hasOwnProperty('_v')) {
                res = true;
              }
            }
          });
        }
        //有:[属性时，检查是否满足伪类情况，全部满足后追加样式
        function inAttr(item) {
          if(item && item.hasOwnProperty('_[')) {
            var item2 = item['_['];
            item2.forEach(function(attrItem) {
              var isMatch = matchUtil.attr(attrItem[0], virtualDom);
              if(isMatch) {
                item2 = attrItem[1];
                //同普通匹配一样
                if(i) {
                  matchSel(i - 1, names, classes, ids, item2, virtualDom.parent);
                }
                if(item2.hasOwnProperty('_v')) {
                  res = true;
                }
              }
            });
          }
        }
        inAttr(item);
        inAttr(item2);}();
      }
      //父子选择器
      if(item.hasOwnProperty('_>')) {
        var item2 = item['_>'];
        matchSel(i - 1, names, classes, ids, item2, virtualDom.parent);
      }
      //相邻兄弟选择器
      if(item.hasOwnProperty('_+')) {
        var item2 = item['_+'];
        var prev = virtualDom.prev();
        if(prev) {
          Object.keys(item2).forEach(function(k) {
            if(matchUtil.nci(k, prev)) {
              return;
            }
            //将当前层次的值存入
            if(item2[k].hasOwnProperty('_v')) {
              res = true;
              return;
            }
            matchSel(i - 1, names, classes, ids, item2[k], virtualDom.parent);
          });
        }
      }
      //兄弟选择器
      if(item.hasOwnProperty('_~')) {
        var item2 = item['_~'];
        var prevAll = virtualDom.prevAll();
        if(prevAll.length) {
          var hasSibiling = false;
          for(var j = prevAll.length - 1; j >= 0; j--) {
            var prev = prevAll[j];
            Object.keys(item2).forEach(function(k) {
              if(matchUtil.nci(k, prev)) {
                return;
              }
              //将当前层次的值存入
              if(item2[k].hasOwnProperty('_v')) {
                res = true;
                return;
              }
              hasSibiling = true;
              matchSel(i - 1, names, classes, ids, item2[k], virtualDom.parent);
            });
            //一旦前方出现一次，即说明命中兄弟选择器，可以跳出继续判断下去的循环
            if(hasSibiling) {
              break;
            }
          }
        }
      }
    }
  }
}

exports["default"]=delegate;});