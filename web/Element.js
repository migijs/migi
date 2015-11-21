define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var browser=function(){var _2=require('./browser');return _2.hasOwnProperty("default")?_2["default"]:_2}();

var uid = 0;

function getDom(dom) {
  if(util.isString(dom)) {
    return document.querySelector(dom);
  }
  else if(dom instanceof Element || browser.lie && dom && dom.__migiEL) {
    return dom.element;
  }
  return dom;
}
function arr2hash(arr) {
  var hash = {};
  arr.forEach(function(item) {
    if(Array.isArray(item)) {
      hash[item[0]] = item[1];
    }
    else {
      Object.keys(item).forEach(function(k) {
        hash[k] = item[k];
      });
    }
  });
  return hash;
}
function hash2arr(hash) {
  var arr = [];
  Object.keys(hash).forEach(function(k) {
    arr.push([k, hash[k]]);
  });
  return arr;
}
function spread(arr) {
  for(var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    if(!Array.isArray(item)) {
      var temp = [];
      Object.keys(item).forEach(function(k) {
        temp.push([k, item[k]]);
      });
      arr.splice.apply(arr,[i,1].concat(Array.from(temp)));
    }
  }
  return arr;
}

!function(){var _3=Object.create(Event.prototype);_3.constructor=Element;Element.prototype=_3}();
  function Element(name, props, children) {
    Event.call(this);
    this.$ = this.$$ = this;
    this.__reset(name, props, children);
  }
  Element.prototype.__reset = function(name, props, children) {
    this.uid = uid++;
    this.__name = name;
    //构建工具中都是arr，手写可能出现hash情况
    if(Array.isArray(props)) {
      this.props = arr2hash(props);
      this.__props = spread(props);
    }
    else {
      this.props = props;
      this.__props = hash2arr(props);
    }
    this.children = children;

    this.__element = null; //真实DOM引用
    this.__parent = null; //父vd或cp引用
    this.__top = null; //最近父cp引用
    this.__style = null; //样式中间生成代码
    this.__dom = false; //是否被添加到真实DOM标识
    this.__cache = {}; //缓存计算好的props

    this.once(Event.DOM, this.__onDom);

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiEL = this;
      this.__migiGS = GS;
    }
  }
  //防止多次插入后重复，清除上次，永远只存在一个实例
  Element.prototype.__clean = function() {
    if(this.__dom) {
      this.__dom = false;
      var elem = this.element;
      if(elem) {
        elem.parentNode.removeChild(elem);
      }
    }
  }

  Element.prototype.__onDom = function() {
    this.__dom = true;
    this.__saveRef();
  }
  Element.prototype.__saveRef = function() {
    //ref快速引用
    if(this.__cache['ref']) {
      var top = this.top;
      if(top) {
        var k = this.__cache['ref'];
        var exist = top.ref[k];
        if(Array.isArray(exist)) {
          exist.push(this);
        }
        else if(exist) {
          top.ref[k] = [exist, this];
        }
        else {
          top.ref[k] = this;
        }
      }
    }
  }

  Element.prototype.inTo = function(dom) {
    this.__clean();
    var s = this.toString();
    getDom(dom).innerHTML = s;
    this.emit(Event.DOM);
  }
  Element.prototype.appendTo = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('beforeend', s);
    this.emit(Event.DOM);
  }
  Element.prototype.prependTo = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterbegin', s);
    this.emit(Event.DOM);
  }
  Element.prototype.before = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('beforebegin', s);
    this.emit(Event.DOM);
  }
  Element.prototype.after = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterend', s);
    this.emit(Event.DOM);
  }
  Element.prototype.replace = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterend', s);
    dom.parentNode.removeChild(dom);
    this.emit(Event.DOM);
  }

  Element.__clean=function() {
    uid = 0;
  }
Object.keys(Event).forEach(function(k){Element[k]=Event[k]});

var GS = {
  top: {
    get: function() {
      if(!this.__top && this.parent) {
        if(this.parent instanceof migi.Component || this.parent && this.parent.__migiCP) {
          this.__top = this.parent;
        }
        else {
          this.__top = this.parent.top;
        }
      }
      return this.__top;
    }
  },
  element: {
    get: function() {
      return this.__element || (this.__element = document.querySelector(this.name + '[migi-uid="' + this.uid + '"]'));
    }
  },
  parent: {
    get: function() {
      var p = this.__parent;
      if(browser.lie && p) {
        return p.__migiNode;
      }
      return p;
    }
  }
};
['name', 'dom'].forEach(function(item) {
  GS[item] = {
    get: function() {
      return this['__' + item];
    }
  };
});
if(!browser.lie) {
  Object.defineProperties(Element.prototype, GS);
}

exports["default"]=Element;});