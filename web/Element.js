define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var browser=function(){var _2=require('./browser');return _2.hasOwnProperty("default")?_2["default"]:_2}();

var uid = 0;

function getDom(dom) {
  if(util.isString(dom)) {
    return document.querySelector(dom);
  }
  return dom;
}

!function(){var _3=Object.create(Event.prototype);_3.constructor=Element;Element.prototype=_3}();
  function Element(name, props, children) {
    Event.call(this);
    this.__uid = uid++;
    this.__reset(name, props, children);
  }
  Element.prototype.__reset = function(name, props, children) {
    this.__name = name;
    this.__props = props;
    this.__children = children;

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
    if(this.$dom) {
      this.$element.parentNode.removeChild(this.$element);
    }
  }

  Element.prototype.__onDom = function() {
    this.__dom = true;
  }
  Element.prototype.__saveRef = function() {
    //ref快速引用
    if(this.__cache['ref']) {
      var top = this.$top;
      if(top) {
        var exist = top.$ref[this.$name];
        if(Array.isArray(exist)) {
          exist.push(this);
        }
        else if(exist) {
          top.$ref[this.$name] = [exist, this];
        }
        else {
          top.$ref[this.$name] = this;
        }
      }
    }
  }

  Element.prototype.__hackLie = function(cons, GS) {
    this.__migiGS = util.smix({}, this.__migiGS, GS);
    if(this.constructor == cons) {
      var a = document.createElement('a');
      this.__migiNode = a.__migiNode = a;
      util.pmix(a, this);
      Object.defineProperties(a, this.__migiGS);
      return a;
    }
  }

  Element.prototype.$inTo = function(dom) {
    this.__clean();
    var s = this.toString();
    getDom(dom).innerHTML = s;
    this.emit(Event.DOM);
  }
  Element.prototype.$appendTo = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('beforeend', s);
    this.emit(Event.DOM);
  }
  Element.prototype.$prependTo = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterbegin', s);
    this.emit(Event.DOM);
  }
  Element.prototype.$before = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('beforebegin', s);
    this.emit(Event.DOM);
  }
  Element.prototype.$after = function(dom) {
    this.__clean();
    var s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('afterend', s);
    this.emit(Event.DOM);
  }
  Element.prototype.$replace = function(dom) {
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
  $top: {
    get: function() {
      if(!this.__top && this.$parent) {
        if(this.$parent instanceof migi.Component || this.$parent && this.$parent.__migiCP) {
          this.__top = this.$parent;
        }
        else {
          this.__top = this.$parent.$top;
        }
      }
      return this.__top;
    }
  },
  $element: {
    get: function() {
      return this.__element || (this.__element = document.querySelector(this.$name + '[migi-uid="' + this.$uid + '"]'));
    }
  },
  $parent: {
    get: function() {
      var p = this.__parent;
      if(browser.lie && p) {
        return p.__migiNode;
      }
      return p;
    }
  }
};
['name', 'props', 'children', 'uid', 'dom'].forEach(function(item) {
  GS['$' + item] = {
    get: function() {
      return this['__' + item];
    }
  };
});
if(!browser.lie) {
  Object.defineProperties(Element.prototype, GS);
}

exports["default"]=Element;});