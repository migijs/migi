import sort from './sort';

export default {
  splitClass: function(s) {
    s = (s || '').trim();
    if(s) {
      s = s.split(/\s+/);
      sort(s, function(a, b) {
        return a > b;
      });
      return s;
    }
    else {
      return '';
    }
  },
  preId: function(s) {
    s = (s || '').trim();
    if(s) {
      return '#' + s;
    }
    else {
      return '';
    }
  },
  combo: function(klass, name, id, json) {
    var hasId = 0;
    var hasClass = 0;
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
    var hasStarClass = json.hasOwnProperty('_*.');
    var hasStarId = json.hasOwnProperty('_*#');
    var hasStarIdClass = json.hasOwnProperty('_*.#');
    //只有当前有_*时说明有*才匹配
    if(json.hasOwnProperty('_*')) {
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
    return combo;
  },
  pseudo: function(pseudos, virtualDom, sel) {
    for(var j = 0, len = pseudos.length; j < len; j++) {
      var pseudo = pseudos[j];
      switch(pseudo) {
        case 'hover':
          if(!virtualDom.__hover) {
            return false;
          }
          break;
        case 'active':
          if(!virtualDom.__active) {
            return false;
          }
          break;
        case 'first-child':
          if(!virtualDom.isFirst()) {
            return false;
          }
          break;
        case 'last-child':
          if(!virtualDom.isLast()) {
            return false;
          }
          break;
        case 'empty':
          if(!virtualDom.isEmpty()) {
            return false;
          }
          break;
        case 'enabled':
          if(!virtualDom.isEnabled()) {
            return false;
          }
          break;
        case 'disabled':
          if(!virtualDom.isDisabled()) {
            return false;
          }
          break;
        case 'checked':
          if(!virtualDom.isChecked()) {
            return false;
          }
          break;
        case 'only-child':
          if(!virtualDom.isOnly()) {
            return false;
          }
          break;
        case 'only-of-type':
          if(!virtualDom.isOnlyOfType(sel)) {
            return false;
          }
          break;
        case 'first-of-type':
          if(!virtualDom.isFirstOfType(sel)) {
            return false;
          }
          break;
        case 'last-of-type':
          if(!virtualDom.isLastOfType(sel)) {
            return false;
          }
          break;
        //除了nth外不支持
        default:
          if(pseudo.indexOf('nth-child') == 0) {
            var idx = virtualDom.getIdx();
            var n = /\((.+)\)/.exec(pseudo)[1];
            if(n == 'n') {}
            else if(n == 'odd') {
              if(idx % 2 == 1) {
                return false;
              }
            }
            else if(n == 'even') {
              if(idx % 2 == 0) {
                return false;
              }
            }
            else if(/^\d+$/.test(n)) {
              if(idx != n - 1) {
                return false;
              }
            }
            else {
              var mc = /(\d+)n(?:\+(\d+))?/.exec(n);
              var res = false;
              for(var k = 0; k <= Math.ceil(idx / mc[1]); k++) {
                if(mc[1] * k + (mc[2] || 0) == idx + 1) {
                  res = true;
                  break;
                }
              }
              if(!res) {
                return false;
              }
            }
          }
          else if(pseudo.indexOf('nth-last-child') == 0) {
            var siblings = virtualDom.siblings();
            var len2 = siblings.length;
            var idx = virtualDom.getIdx(siblings);
            idx = len2 - idx - 1;
            var n = /\((.+)\)/.exec(pseudo)[1];
            if(n == 'n') {}
            else if(n == 'odd') {
              if(idx % 2 == 1) {
                return false;
              }
            }
            else if(n == 'even') {
              if(idx % 2 == 0) {
                return false;
              }
            }
            else if(/^\d+$/.test(n)) {
              if(idx != n - 1) {
                return false;
              }
            }
            else {
              var mc = /(\d+)n(?:\+(\d+))?/.exec(n);
              var res = false;
              for(var k = 0; k <= Math.ceil(idx / mc[1]); k++) {
                if(mc[1] * k + (mc[2] || 0) == idx + 1) {
                  res = true;
                  break;
                }
              }
              if(!res) {
                return false;
              }
            }
          }
          else {
            return false;
          }
      }
    }
    return true;
  },
  attr: function(attrs, virtualDom) {
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
          break;
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
          break;
        }
      }
    }
    return isMatch;
  },
  nci: function(s, vd) {
    var nodeName = /^[a-z\d]+/i.exec(s);
    if(nodeName && nodeName[0].toUpperCase() != vd.__name.toUpperCase()) {
      return true;
    }
    var className = s.match(/\.[a-z\d_-]+/ig);
    if(className) {
      for(var j = className.length - 1; j >= 0; j--) {
        if(!new RegExp('\\b' + className[j].slice(1) + '\\b', 'i').test(vd.__cache.class)) {
          return true;
        }
      }
    }
    var id = /#[a-z\d_-]+/i.exec(s);
    if(id && id[0].toUpperCase() != vd.__cache.id.toUpperCase()) {
      return true;
    }
  }
};

function comboArr(arr, len, res = [], i = 0) {
  if(len - i > 1) {
    comboArr(arr, len, res, i + 1);
    for(var j = 0, len2 = res.length; j < len2; j++) {
      res.push(res[j] + '.' + arr[i]);
    }
  }
  res.push('.' + arr[i]);
  return res;
}