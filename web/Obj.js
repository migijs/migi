define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("Element")?_1.Element:_1.hasOwnProperty("default")?_1["default"]:_1}();
var util=function(){var _2=require('./util');return _2.hasOwnProperty("util")?_2.util:_2.hasOwnProperty("default")?_2["default"]:_2}();

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

!function(){var _3=Object.create(Event.prototype);_3.constructor=Obj;Obj.prototype=_3}();
  function Obj(k, context, cb) {
    Event.call(this);
    //fix循环依赖
    if(Element.hasOwnProperty('default')) {
      Element = Element['default'];
    }

    var self = this;
    self.__k = k;
    self.__context = context;
    self.__empty = true;
    self.type = null;
    self.__count = 0;
    self.__cb = cb;
    self.v = cb.call(context);

    self.on(Event.DOM, function() {
      self.off(Event.DOM, arguments.callee);
      var list = getList(self.v, []);
      list.forEach(function(item) {
        if(item instanceof Element) {
          item.emit(Event.DOM);
        }
      });
    });
  }
  var _4={};_4.k={};_4.k.get =function() {
    return this.__k;
  }
  _4.context={};_4.context.get =function() {
    return this.__context;
  }
  _4.v={};_4.v.get =function() {
    return this.__v;
  }
  _4.v.set =function(v) {
    var self = this;
    self.__count = 0;
    self.__empty = true;

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
        if(item !== void 0 && !!item.toString()) {
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
    //TODO: 可能不需要clone
    self.__v = util.clone(v);
  }
  _4.cb={};_4.cb.get =function() {
    return this.__cb;
  }
  _4.count={};_4.count.get =function() {
    return this.__count;
  }
  _4.empty={};_4.empty.get =function() {
    return this.__empty;
  }
  Obj.prototype.toString = function() {
    var s = Array.isArray(this.v) ? joinArray(this.v) : this.v;
    //防止undefined的变量
    return s === void 0 ? '' : s.toString();
  }
Object.keys(_4).forEach(function(k){Object.defineProperty(Obj.prototype,k,_4[k])});Object.keys(Event).forEach(function(k){Obj[k]=Event[k]});

//jsx创建有3种类型：纯文本或js变量返回String或Array<String>都是TEXT、全部VirtualDom、全部COMPONENT；不准有混合类型
//当Obj作为VirtualDom的child变更时，如果发生类型改变或非TEXT类型改变，DomDiff重绘
//全部VirtualDom和Component统一为Element
Obj.TEXT = '__0';
Obj.ELEMENT = '__1';

exports["default"]=Obj;});