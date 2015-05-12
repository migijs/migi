import VirtualDom from './VirtualDom';
import util from './util';

function getType(v) {
  if(Array.isArray(v)) {
    //递归数组中有一个是VIRTUALDOM都算VIRTUALDOM
    for(var i = 0, len = v.length; i < len; i++) {
      var t = getType(v[i]);
      if(t == Obj.VIRTUALDOM) {
        return Obj.VIRTUALDOM;
      }
    }
    return Obj.TEXT;
  }
  else if(v instanceof VirtualDom) {
    return Obj.VIRTUALDOM;
  }
  else {
    return Obj.TEXT;
  }
}
function joinArray(arr, unEscape) {
  var res = '';
  arr.forEach(function(item) {
    if(Array.isArray(item)) {
      res += joinArray(item);
    }
    else {
      res += item instanceof VirtualDom || unEscape ? item.toString() : util.escape(item.toString());
    }
  });
  return res;
}

class Obj {
  constructor(k, context, cb) {
    //fix循环依赖
    if(VirtualDom.hasOwnProperty('default')) {
      VirtualDom = VirtualDom.default;
    }
    this._k = k;
    this._context = context;
    this.type = null;
    this.v = cb.call(context);
    this._cb = cb;
  }
  get k() {
    return this._k;
  }
  get context() {
    return this._context;
  }
  get v() {
    return this._v;
  }
  set v(v) {
    this.type = getType(v);
    this._v = util.clone(v);
  }
  get cb() {
    return this._cb;
  }
  toString(unEscape) {
    var self = this;
    if(Array.isArray(self.v)) {
      return joinArray(self.v, unEscape);
    }
    var s = util.isUndefined(self.v) ? '' : self.v;
    //jsx中的js变量如为文本则需html转义作为innerHTML
    return self.type == Obj.TEXT && !unEscape ? util.escape(s.toString()) : s.toString();
  }
}

//jsx创建有2种类型：纯文本或js变量返回String或Array<String>都是TEXT；包含VirtualDom则为VIRTUALDOM
//当Obj作为VirtualDom的child变更时，如果发生类型改变或VIRTUALDOM类型改变，通知parent重绘
Obj.TEXT = 'TEXT';
Obj.VIRTUALDOM = 'VIRTUALDOM';

export default Obj;