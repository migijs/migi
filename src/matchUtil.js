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
  pseudo: function(pseudos, virtualDom) {
    var isMatch = true;
    for(var j = 0, len = pseudos.length; j < len; j++) {
      switch(pseudos[j]) {
        case 'hover':
          if(!virtualDom.__hover) {
            isMatch = false;
            break;
          }
          break;
        case 'active':
          if(!virtualDom.__active) {
            isMatch = false;
            break;
          }
          break;
        case 'first-child':
          if(!virtualDom.isFirst()) {
            isMatch = false;
            break;
          }
          break;
        case 'last-child':
          if(!virtualDom.isLast()) {
            isMatch = false;
            break;
          }
          break;
        case 'empty':
          if(!virtualDom.isEmpty()) {
            isMatch = false;
            break;
          }
          break;
        case 'enabled':
          if(!virtualDom.isEnabled()) {
            isMatch = false;
            break;
          }
          break;
        case 'disabled':
          if(!virtualDom.isDisabled()) {
            isMatch = false;
            break;
          }
          break;
        case 'checked':
          if(!virtualDom.isChecked()) {
            isMatch = false;
            break;
          }
          break;
        //TODO:其它伪类
        default:
          isMatch = false;
          break;
      }
    }
    return isMatch;
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