define(function(require, exports, module){var VirtualDom=function(){var _0=require('./VirtualDom');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Event=function(){var _1=require('./Event');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var sort=function(){var _2=require('./sort');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var browser=function(){var _3=require('./browser');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var hash=function(){var _4=require('./hash');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var matchHash=function(){var _5=require('./matchHash');return _5.hasOwnProperty("default")?_5["default"]:_5}();

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
function matchSel(i, names, classes, ids, style, virtualDom, res, cur, history, first) {
  var item2;history[cur] = true;
  var hasId = 0;
  var hasClass = 0;
  var name = names[i];
  var klass = classes[i];
  var id = ids[i];
  //class可能有多个，任意个class的组合也要匹配
  if(klass && klass.length) {
    var comboClass = comboArr(klass, klass.length);
    hasClass = 1;
  }
  //id、class、name可能单个或组合出现，每种都要匹配
  var combo = [name];
  if(id) {
    hasId = 2;
  }
  //各种*的情况标识
  var hasStarClass = style.hasOwnProperty('_*.');
  var hasStarId = style.hasOwnProperty('_*#');
  var hasStarIdClass = style.hasOwnProperty('_*.#');
  //只有当前有_*时说明有*才匹配
  if(style.hasOwnProperty('_*')) {
    combo.push('*');
  }
  //将各种可能的组合添加进入combo
  if(hasClass) {
    comboClass.forEach(function(klass) {
      combo.push(klass);
      combo.push(name + klass);
      if(hasStarClass) {
        combo.push('*' + klass);
      }
      if(hasId) {
        combo.push(klass + id);
        combo.push(name + klass + id);
        if(hasStarIdClass) {
          combo.push('*' + klass + id);
        }
      }
    });
  }
  if(hasId) {
    combo.push(id);
    combo.push(name + id);
    if(hasStarId) {
      combo.push('*' + id);
    }
  }
  for(var j = 0, len = combo.length; j < len; j++) {
    var k = combo[j];
    if(style.hasOwnProperty(k)) {
      var item = style[k];
      //还未到根节点继续匹配
      if(i) {
        matchSel(i - 1, names, classes, ids, item, virtualDom.parent, res, cur + ',' + (i - 1) + ':' + j, history);
        //多层级时需递归所有层级组合，如<div><p><span>对应div span{}的样式时，并非一一对应
        for(var l = i - 2; l >= 0; l--) {
          var key = cur + ',' + l + ':' + j;
          if(!history.hasOwnProperty(key)) {
            matchSel(l, names, classes, ids, item, virtualDom.parent, res, key, history);
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
                  case 'empty':
                    if(!virtualDom.isEmpty()) {
                      isMatch = false;
                      break outer;
                    }
                    break;
                  case 'enabled':
                    if(!virtualDom.isEnabled()) {
                      isMatch = false;
                      break outer;
                    }
                    break;
                  case 'disabled':
                    if(!virtualDom.isDisabled()) {
                      isMatch = false;
                      break outer;
                    }
                    break;
                  case 'checked':
                    if(!virtualDom.isChecked()) {
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
        function inAttr(item) {
          if(item && item.hasOwnProperty('_[')) {
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
                    if(p === void 0) {
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
        inAttr(item);
        inAttr(item2);}();
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

function comboArr(arr, len, res, i) {
  if(res===void 0)res=[];if(i===void 0)i=0;if(len - i > 1) {
    comboArr(arr, len, res, i + 1);
    for(var j = 0, len2 = res.length; j < len2; j++) {
      res.push(res[j] + '.' + arr[i]);
    }
  }
  res.push('.' + arr[i]);
  return res;
}

exports["default"]=match;});