define(function(require, exports, module){var VirtualDom=function(){var _0=require('./VirtualDom');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Event=function(){var _1=require('./Event');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var sort=function(){var _2=require('./sort');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var browser=function(){var _3=require('./browser');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var hash=function(){var _4=require('./hash');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var matchHash=function(){var _5=require('./matchHash');return _5.hasOwnProperty("default")?_5["default"]:_5}();
var matchUtil=function(){var _6=require('./matchUtil');return _6.hasOwnProperty("default")?_6["default"]:_6}();

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
  matchSel(names.length - 1, names, classes, ids, style, virtualDom, res, first);
  sort(res, function(a, b) {
    var pa = a[2];
    var pb = b[2];
    //引用相等
    if(pa == pb) {
      return a[0] > b[0];
    }
    //优先级内容不相等
    for(var i = 0; i < 3; i++) {
      if(pa[i] != pb[i]) {
        return pa[i] > pb[i];
      }
    }
    //优先级相等比较出现顺序
    return a[0] > b[0];
  });
  var s = '';
  res.forEach(function(item) {
    s += item[1] + ';';
  });
  return s;
}
//从底部往上匹配，即.a .b这样的选择器是.b->.a逆序对比
//过程中只要不匹配就跳出，i从最大到0
function matchSel(i, names, classes, ids, style, virtualDom, res, first, isChild) {
  var item2;var combo = matchUtil.combo(classes[i], names[i], ids[i], style);
  for(var j = 0, len = combo.length; j < len; j++) {
    var k = combo[j];
    if(style.hasOwnProperty(k)) {
      var item = style[k];
      //还未到根节点继续匹配
      if(i) {
        matchSel(i - 1, names, classes, ids, item, virtualDom.parent, res);
        //多层级时需递归所有层级组合，如<div><p><span>对应div span{}的样式时，并非一一对应
        if(!isChild) {
          for(var l = i - 2; l >= 0; l--) {
            matchSel(l, names, classes, ids, item, virtualDom.parent, res);
          }
        }
      }
      //将当前层次的值存入
      if(item.hasOwnProperty('_v')) {
        dealStyle(res, item);
      }
      //首次进入处理:伪类
      if(first && item.hasOwnProperty('_:')) {
        item['_:'].forEach(function(pseudoItem) {
          pseudoItem[0].forEach(function(pseudo) {
            var uid = virtualDom.uid;
            switch(pseudo) {
              case 'hover':
                function onHover() {
                  //因为vd可能destroy导致被回收，所以每次动态从hash中取当前的vd
                  hash.get(uid).__hover = true;
                  hash.get(uid).__updateStyle();
                }
                function outHover() {
                  hash.get(uid).__hover = false;
                  hash.get(uid).__updateStyle();
                }
                virtualDom.on(Event.DOM, function() {
                  if(browser.lie && virtualDom.element.attachEvent) {
                    virtualDom.element.attachEvent('onmouseenter', onHover);
                    virtualDom.element.attachEvent('onmouseleave', outHover);
                  }
                  else {
                    virtualDom.element.addEventListener('mouseenter', onHover);
                    virtualDom.element.addEventListener('mouseleave', outHover);
                  }
                });
                //记录缓存当destryo时移除
                virtualDom.__onHover = onHover;
                virtualDom.__outHover = outHover;
                break;
              case 'active':
                function onActive() {
                  //因为vd可能destroy导致被回收，所以每次动态从hash中取当前的vd
                  hash.get(uid).__active = true;
                  hash.get(uid).__updateStyle();
                }
                function outActive() {
                  hash.get(uid).__active = false;
                  hash.get(uid).__updateStyle();
                }
                virtualDom.on(Event.DOM, function() {
                  if(browser.lie && virtualDom.element.attachEvent) {
                    virtualDom.element.attachEvent('onmousedown', onActive);
                    //鼠标弹起捕获body，因为可能会移出元素后再弹起，且事件被shadow化阻止冒泡了
                    window.attachEvent('onmouseup', outActive, true);
                    //window失焦时也需判断
                    window.attachEvent('onblur', outActive);
                    //drag结束时也需判断
                    window.attachEvent('ondragend', outActive);
                  }
                  else {
                    virtualDom.element.addEventListener('mousedown', onActive);
                    //鼠标弹起捕获body，因为可能会移出元素后再弹起，且事件被shadow化阻止冒泡了
                    window.addEventListener('mouseup', outActive, true);
                    //touchend也失焦
                    window.addEventListener('touchend', outActive, true);
                    //touchcancel也失焦
                    window.addEventListener('touchcancel', outActive, true);
                    //window失焦时也需判断
                    window.addEventListener('blur', outActive);
                    //drag结束时也需判断
                    window.addEventListener('dragend', outActive);
                  }
                });
                //对window的侦听需要在destroy后移除，先记录下来
                matchHash.add(uid, outActive);
                break;
            }
          });
        });
      }
      //:和[可能同时存在，也可能分开
      if(item.hasOwnProperty('_:') || item.hasOwnProperty('_[')) {!function(){
        item2;
        //有:伪类时，检查是否满足伪类情况，全部满足后追加样式
        if(item.hasOwnProperty('_:')) {
          item2 = item['_:'];
          item2.forEach(function(pseudoItem) {
            var isMatch = matchUtil.pseudo(pseudoItem[0], virtualDom);
            if(isMatch) {
              item2 = pseudoItem[1];
              //同普通匹配一样
              if(i) {
                matchSel(i - 1, names, classes, ids, item2, virtualDom.parent, res);
              }
              if(item2.hasOwnProperty('_v')) {
                dealStyle(res, item2);
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
                  matchSel(i - 1, names, classes, ids, item2, virtualDom.parent, res);
                }
                if(item2.hasOwnProperty('_v')) {
                  dealStyle(res, item2);
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
        matchSel(i - 1, names, classes, ids, item2, virtualDom.parent, res, false, isChild);
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
              dealStyle(res, item2[k]);
            }
            matchSel(i - 1, names, classes, ids, item2[k], virtualDom.parent, res, false, isChild);
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
                dealStyle(res, item2[k]);
              }
              hasSibiling = true;
              matchSel(i - 1, names, classes, ids, item2[k], virtualDom.parent, res, false, isChild);
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

function dealStyle(res, item) {
  item._v.forEach(function(style) {
    style[2] = item._p;
    res.push(style);
  });
}

exports["default"]=match;});