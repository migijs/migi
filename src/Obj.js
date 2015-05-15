import VirtualDom from './VirtualDom';
import util from './util';

function getType(v, list) {
  if(Array.isArray(v)) {
    v.forEach(function(item) {
      list.push(getType(item, list));
    });
  }
  else if(v instanceof VirtualDom) {
    list.push(Obj.VIRTUALDOM);
  }
  else {
    list.push(Obj.TEXT);
  }
  return list;
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
    this.__k = k;
    this.__context = context;
    this.__empty = true;
    this.type = null;
    this.__count = 0;
    this.__cb = cb;
    this.v = cb.call(context);
  }
  get k() {
    return this.__k;
  }
  get context() {
    return this.__context;
  }
  get v() {
    return this.__v;
  }
  set v(v) {
    var self = this;
    var list = getType(v, []);
    //数组只有1项时，为其对应类型；
    //多项时判断2种数量，全部为一种也是对应类型；否则为COMPLEX类型
    //count计数为VirtualDom节点数
    var iV = 0;
    var iT = 0;
    list.forEach(function(item) {
      if(item instanceof VirtualDom) {
        iV++;
        self.__count++;
      }
      else {
        iT++;
      }
    });
    if(list.length == 1) {
      self.type == list[0];
    }
    else {
      if(iV == 0) {
        self.type == Obj.TEXT;
      }
      else if(iT == 0) {
        self.type == Obj.VIRTUALDOM;
      }
      else {
        self.type == Obj.COMPLEX;
      }
    }
    //只有TEXT类型需要关心empty，因为空字符串初始化时若处于2个DOM之间，则不占文本节点对象，需新建
    //以后无论如何变更，只要变成非空字符串，都不是empty，因为TextNode已经存在，变为空也无所谓
    if(self.type == Obj.TEXT) {
      if(v != '') {
        self.__empty = false;
      }
    }
    self.__v = util.clone(v);
  }
  get cb() {
    return this.__cb;
  }
  get count() {
    return this.__count;
  }
  get empty() {
    return this.__empty;
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
Obj.COMPLEX = 'COMPLEX';

export default Obj;