import Element from './Element';
import util from './util';

function getList(v, list) {
  if(Array.isArray(v)) {
    v.forEach(function(item) {
      var res = getList(item, []);
      if(Array.isArray(res)) {
        list = list.concat(res);
      }
      else {
        list.push(v);
      }
    });
  }
  else {
    list.push(v);
  }
  return list;
}
function joinArray(arr) {
  var res = '';
  arr.forEach(function(item) {
    if(Array.isArray(item)) {
      res += joinArray(item);
    }
    else {
      res += item.toString();
    }
  });
  return res;
}

class Obj {
  constructor(k, context, cb) {
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
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
    var list = getList(v, []);
    //数组只有1项时，为其对应类型；
    //多项时判断2种数量，全部为一种也是对应类型；否则报错
    //count计数为VirtualDom/Component节点数
    var iV = 0;
    var iT = 0;
    list.forEach(function(item) {
      if(item instanceof Element) {
        iV++;
        self.__count++;
      }
      else {
        iT++;
        //只有TEXT类型需要关心empty，因为空字符串初始化时若处于2个DOM之间，则不占文本节点对象，需新建
        //以后无论如何变更，只要变成非空字符串，都不是empty，因为TextNode已经存在，变为空也无所谓
        if(!!item.toString()) {
          self.__empty = false;
        }
      }
    });
    if(list.length == 0) {
      self.type = Obj.TEXT;
    }
    else if(iV == list.length) {
      self.type = Obj.ELEMENT;
    }
    else if(iT == list.length) {
      self.type = Obj.TEXT;
    }
    else {
      throw new Error('migi.Obj can not has complex value: ' + self.k);
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
  toString() {
    var s = Array.isArray(this.v) ? joinArray(this.v) : this.v;
    return s.toString();
  }
}

//jsx创建有3种类型：纯文本或js变量返回String或Array<String>都是TEXT、全部VirtualDom、全部COMPONENT；不准有混合类型
//当Obj作为VirtualDom的child变更时，如果发生类型改变或非TEXT类型改变，通知parent重绘
//全部VirtualDom和Component统一为Element
Obj.TEXT = '__0';
Obj.ELEMENT = '__1';

export default Obj;