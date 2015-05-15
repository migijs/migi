var VirtualDom=function(){var _0=require('./VirtualDom');return _0.hasOwnProperty("VirtualDom")?_0.VirtualDom:_0.hasOwnProperty("default")?_0.default:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("util")?_1.util:_1.hasOwnProperty("default")?_1.default:_1}();

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


  function Obj(k, context, cb) {
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
  var _2={};_2.k={};_2.k.get =function() {
    return this.__k;
  }
  _2.context={};_2.context.get =function() {
    return this.__context;
  }
  _2.v={};_2.v.get =function() {
    return this.__v;
  }
  _2.v.set =function(v) {
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
  _2.cb={};_2.cb.get =function() {
    return this.__cb;
  }
  _2.count={};_2.count.get =function() {
    return this.__count;
  }
  _2.empty={};_2.empty.get =function() {
    return this.__empty;
  }
  Obj.prototype.toString = function(unEscape) {
    var self = this;
    if(Array.isArray(self.v)) {
      return joinArray(self.v, unEscape);
    }
    var s = util.isUndefined(self.v) ? '' : self.v;
    //jsx中的js变量如为文本则需html转义作为innerHTML
    return self.type == Obj.TEXT && !unEscape ? util.escape(s.toString()) : s.toString();
  }
Object.keys(_2).forEach(function(k){Object.defineProperty(Obj.prototype,k,_2[k])});

//jsx创建有2种类型：纯文本或js变量返回String或Array<String>都是TEXT；包含VirtualDom则为VIRTUALDOM
//当Obj作为VirtualDom的child变更时，如果发生类型改变或VIRTUALDOM类型改变，通知parent重绘
Obj.TEXT = 'TEXT';
Obj.VIRTUALDOM = 'VIRTUALDOM';
Obj.COMPLEX = 'COMPLEX';

exports.default=Obj;