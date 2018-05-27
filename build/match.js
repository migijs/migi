'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _sort = require('./sort');

var _sort2 = _interopRequireDefault(_sort);

var _hash = require('./hash');

var _hash2 = _interopRequireDefault(_hash);

var _matchHash = require('./matchHash');

var _matchHash2 = _interopRequireDefault(_matchHash);

var _matchUtil = require('./matchUtil');

var _matchUtil2 = _interopRequireDefault(_matchUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// names,classes,ids为从当前节点开始往上的列表
// style为jaw传入的总样式对象
// virtualDom当前传入的VirtualDom对象
// first为初始化时第一次
function match(names, classes, ids, style, virtualDom, first) {
  var res = [];
  matchSel(names.length - 1, names, classes, ids, style.default, virtualDom, res, first);
  // 如果有media query
  if (style.media) {
    style.media.forEach(function (media) {
      var match = false;
      media.query.forEach(function (qlist) {
        // 中一个即命中不再往下匹配
        if (match) {
          return;
        }
        for (var i = 0, len = qlist.length; i < len; i++) {
          var item = qlist[i];
          // Array/String类型标明是否有值，目前只支持Array
          if (Array.isArray(item)) {
            var k = item[0].replace(/^-[a-z]+-/i, '').replace(/^mso-/i, '').toLowerCase();
            var v = item[1];
            // 只支持px单位
            if (/(px|\d)$/.test(v)) {
              v = v.replace(/px$/, '');
              switch (k) {
                case 'width':
                case 'height':
                  var cur = getCur(k);
                  if (cur == v) {
                    match = true;
                    matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                    return;
                  }
                  break;
                case 'min-width':
                case 'max-width':
                case 'min-height':
                case 'max-height':
                  var cur = getCur(k.slice(4));
                  if (k.indexOf('min-') == 0) {
                    if (cur >= v) {
                      match = true;
                      matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                      return;
                    }
                  } else {
                    if (cur <= v) {
                      match = true;
                      matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                      return;
                    }
                  }
                  break;
                case 'device-width':
                case 'device-height':
                  var cur = window.screen[k.slice(7)];
                  if (cur == v) {
                    match = true;
                    matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                  }
                  break;
                case 'min-device-width':
                case 'min-device-height':
                case 'max-device-width':
                case 'max-device-height':
                  var cur = window.screen[k.slice(11)];
                  if (k.indexOf('min-') == 0) {
                    if (cur >= v) {
                      match = true;
                      matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                      return;
                    }
                  } else {
                    if (cur <= v) {
                      match = true;
                      matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                      return;
                    }
                  }
                  break;
                case 'aspect-ratio':
                  var w = getCur('width');
                  var h = getCur('height');
                  var cur = w / h;
                  var val = v.split('/');
                  val = val[0] / val[1];
                  if (cur == val) {
                    match = true;
                    matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                    return;
                  }
                  break;
                case 'min-aspect-ratio':
                case 'max-aspect-ratio':
                  var w = getCur('width');
                  var h = getCur('height');
                  var cur = w / h;
                  var val = v.split('/');
                  val = val[0] / val[1];
                  if (k.indexOf('min-') == 0) {
                    if (cur >= v) {
                      match = true;
                      matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                      return;
                    }
                  } else {
                    if (cur <= v) {
                      match = true;
                      matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                      return;
                    }
                  }
                  break;
                case 'device-aspect-ratio':
                  var w = window.screen.width;
                  var h = window.screen.height;
                  var cur = w / h;
                  var val = v.split('/');
                  val = val[0] / val[1];
                  if (cur == val) {
                    match = true;
                    matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                    return;
                  }
                  break;
                case 'min-device-aspect-ratio':
                case 'max-device-aspect-ratio':
                  var w = window.screen.width;
                  var h = window.screen.height;
                  var cur = w / h;
                  var val = v.split('/');
                  val = val[0] / val[1];
                  if (k.indexOf('min-') == 0) {
                    if (cur >= v) {
                      match = true;
                      matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                      return;
                    }
                  } else {
                    if (cur <= v) {
                      match = true;
                      matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                      return;
                    }
                  }
                  break;
                case 'device-pixel-ratio':
                  var cur = window.devicePixelRatio;
                  if (cur == v) {
                    match = true;
                    matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                    return;
                  }
                  break;
                case 'min-device-pixel-ratio':
                case 'max-device-pixel-ratio':
                  var cur = window.devicePixelRatio;
                  if (k.indexOf('min-') == 0) {
                    if (cur >= v) {
                      match = true;
                      matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                      return;
                    }
                  } else {
                    if (cur <= v) {
                      match = true;
                      matchSel(names.length - 1, names, classes, ids, media.style, virtualDom, res, first);
                      return;
                    }
                  }
                  break;
              }
            }
          }
        }
      });
    });
    // 窗口resize时重新匹配@media query
    if (first) {
      var resize = function resize() {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
          _hash2.default.get(virtualDom.__uid).__updateStyle();
        }, 100);
      };

      var timeout;

      window.addEventListener('resize', resize);
      _matchHash2.default.add(virtualDom.__uid, resize);
    }
  }
  (0, _sort2.default)(res, function (a, b) {
    var pa = a[2];
    var pb = b[2];
    // 引用相等比较出现顺序
    if (pa == pb) {
      return a[0] > b[0];
    }
    // 优先级不相等
    for (var i = 0; i < 3; i++) {
      if (pa[i] != pb[i]) {
        return pa[i] > pb[i];
      }
    }
    // 优先级相等比较出现顺序
    return a[0] > b[0];
  });
  var s = '';
  res.forEach(function (item) {
    s += item[1] + ';';
  });
  return s;
}
// 从底部往上匹配，即.a .b这样的选择器是.b->.a逆序对比
// 过程中只要不匹配就跳出，i从最大到0
function matchSel(i, names, classes, ids, style, virtualDom, res, first, isChild) {
  var combo = _matchUtil2.default.combo(classes[i], names[i], ids[i], style);
  for (var j = 0, len = combo.length; j < len; j++) {
    var k = combo[j];
    if (style.hasOwnProperty(k)) {
      var item = style[k];
      // 还未到根节点继续匹配
      if (i) {
        matchSel(i - 1, names, classes, ids, item, virtualDom.parent, res, first);
        // 多层级时需递归所有层级组合，如<div><p><span>对应div span{}的样式时，并非一一对应
        if (!isChild) {
          for (var l = i - 2; l >= 0; l--) {
            matchSel(l, names, classes, ids, item, virtualDom.parent, res, first);
          }
        }
      }
      // 将当前层次的值存入
      if (item.hasOwnProperty('_v')) {
        dealStyle(res, item);
      }
      // 首次进入处理:伪类
      if (first && item.hasOwnProperty('_:')) {
        item['_:'].forEach(function (pseudoItem) {
          pseudoItem[0].forEach(function (pseudo) {
            var uid = virtualDom.__uid;
            switch (pseudo) {
              case 'hover':
                var onHover = function onHover() {
                  // 因为vd可能destroy导致被回收，所以每次动态从hash中取当前的vd
                  _hash2.default.get(uid).__hover = true;
                  _hash2.default.get(uid).__updateStyle();
                };

                var outHover = function outHover() {
                  _hash2.default.get(uid).__hover = false;
                  _hash2.default.get(uid).__updateStyle();
                };

                var cb = function cb() {
                  virtualDom.element.addEventListener('mouseenter', onHover);
                  virtualDom.element.addEventListener('mouseleave', outHover);
                };
                // 可能由DOMDiff发起，此时已经在DOM上了


                if (virtualDom.__dom) {
                  cb();
                } else {
                  virtualDom.once(_Event2.default.DOM, cb);
                }
                // 记录缓存当destryo时移除
                virtualDom.__onHover = onHover;
                virtualDom.__outHover = outHover;
                break;
              case 'active':
                var onActive = function onActive() {
                  // 因为vd可能destroy导致被回收，所以每次动态从hash中取当前的vd
                  _hash2.default.get(uid).__active = true;
                  _hash2.default.get(uid).__updateStyle();
                };

                var outActive = function outActive() {
                  _hash2.default.get(uid).__active = false;
                  _hash2.default.get(uid).__updateStyle();
                };

                var cb2 = function cb2() {
                  virtualDom.element.addEventListener('mousedown', onActive);
                  // 鼠标弹起捕获body，因为可能会移出元素后再弹起，且事件被shadow化阻止冒泡了
                  window.addEventListener('mouseup', outActive, true);
                  // touchend也失焦
                  window.addEventListener('touchend', outActive, true);
                  // touchcancel也失焦
                  window.addEventListener('touchcancel', outActive, true);
                  // window失焦时也需判断
                  window.addEventListener('blur', outActive);
                  // drag结束时也需判断
                  window.addEventListener('dragend', outActive);
                };
                // 可能由DOMDiff发起，此时已经在DOM上了


                if (virtualDom.__dom) {
                  cb2();
                } else {
                  virtualDom.once(_Event2.default.DOM, cb2);
                }
                // 对window的侦听需要在destroy后移除，先记录下来
                _matchHash2.default.add(uid, outActive);
                break;
            }
          });
        });
      }
      // :和[可能同时存在，也可能分开
      if (item.hasOwnProperty('_:') || item.hasOwnProperty('_[')) {
        // 有:[属性时，检查是否满足伪类情况，全部满足后追加样式
        var inAttr = function inAttr(item) {
          if (item && item.hasOwnProperty('_[')) {
            var item2 = item['_['];
            item2.forEach(function (attrItem) {
              var isMatch = _matchUtil2.default.attr(attrItem[0], virtualDom);
              if (isMatch) {
                item2 = attrItem[1];
                // 同普通匹配一样
                if (i) {
                  matchSel(i - 1, names, classes, ids, item2, virtualDom.parent, res, first);
                }
                if (item2.hasOwnProperty('_v')) {
                  dealStyle(res, item2);
                }
              }
            });
          }
        };

        var item2;
        // 有:伪类时，检查是否满足伪类情况，全部满足后追加样式
        if (item.hasOwnProperty('_:')) {
          item2 = item['_:'];
          item2.forEach(function (pseudoItem) {
            var isMatch = _matchUtil2.default.pseudo(pseudoItem[0], virtualDom, k);
            if (isMatch) {
              item2 = pseudoItem[1];
              // 同普通匹配一样
              if (i) {
                matchSel(i - 1, names, classes, ids, item2, virtualDom.parent, res, first);
              }
              if (item2.hasOwnProperty('_v')) {
                dealStyle(res, item2);
              }
            }
          });
        }
        inAttr(item);
        inAttr(item2);
      }
      // 父子选择器
      if (item.hasOwnProperty('_>')) {
        var item2 = item['_>'];
        matchSel(i - 1, names, classes, ids, item2, virtualDom.parent, res, false, isChild);
      }
      // 相邻兄弟选择器
      if (item.hasOwnProperty('_+')) {
        var item2 = item['_+'];
        var prev = virtualDom.prev();
        if (prev) {
          Object.keys(item2).forEach(function (k) {
            if (_matchUtil2.default.nci(k, prev)) {
              return;
            }
            // 将当前层次的值存入
            if (item2[k].hasOwnProperty('_v')) {
              dealStyle(res, item2[k]);
            }
            matchSel(i - 1, names, classes, ids, item2[k], virtualDom.parent, res, false, isChild);
          });
        }
      }
      // 兄弟选择器
      if (item.hasOwnProperty('_~')) {
        var item2 = item['_~'];
        var prevAll = virtualDom.prevAll();
        if (prevAll.length) {
          var hasSibiling = false;
          for (var j = prevAll.length - 1; j >= 0; j--) {
            var prev = prevAll[j];
            Object.keys(item2).forEach(function (k) {
              if (_matchUtil2.default.nci(k, prev)) {
                return;
              }
              // 将当前层次的值存入
              if (item2[k].hasOwnProperty('_v')) {
                dealStyle(res, item2[k]);
              }
              hasSibiling = true;
              matchSel(i - 1, names, classes, ids, item2[k], virtualDom.parent, res, false, isChild);
            });
            // 一旦前方出现一次，即说明命中兄弟选择器，可以跳出继续判断下去的循环
            if (hasSibiling) {
              break;
            }
          }
        }
      }
    }
  }
}

function dealStyle(res, item) {
  item._v.forEach(function (style) {
    style[2] = item._p;
    res.push(style);
  });
}

function getCur(k) {
  var key = k.charAt(0).toUpperCase() + k.slice(1);
  return window['inner' + key] || document.documentElement['client' + key] || document.body['client' + key];
}

exports.default = match;