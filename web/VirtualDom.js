define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var Component=function(){var _2=require('./Component');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var Obj=function(){var _4=require('./Obj');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var Cb=function(){var _5=require('./Cb');return _5.hasOwnProperty("default")?_5["default"]:_5}();
var range=function(){var _6=require('./range');return _6.hasOwnProperty("default")?_6["default"]:_6}();
var match=function(){var _7=require('./match');return _7.hasOwnProperty("default")?_7["default"]:_7}();
var sort=function(){var _8=require('./sort');return _8.hasOwnProperty("default")?_8["default"]:_8}();
var domDiff=function(){var _9=require('./domDiff');return _9.hasOwnProperty("default")?_9["default"]:_9}();

var SELF_CLOSE = {
  'img': true,
  'meta': true,
  'link': true,
  'br': true,
  'basefont': true,
  'base': true,
  'col': true,
  'embed': true,
  'frame': true,
  'hr': true,
  'input': true,
  'keygen': true,
  'area': true,
  'param': true,
  'source': true,
  'track': true
};

!function(){var _10=Object.create(Element.prototype);_10.constructor=VirtualDom;VirtualDom.prototype=_10}();
  function VirtualDom(name, props, children) {
    //fix循环依赖
    if(props===void 0)props={};if(children===void 0)children=[];if(Component.hasOwnProperty('default')) {
      Component = Component['default'];
    }
    //自闭合标签不能有children
    if(SELF_CLOSE.hasOwnProperty(name) && children.length) {
      throw new Error('self-close tag can not has chilren nodes: ' + name);
    }
    Element.call(this,name, props, children);
    var self = this;
    self.__cache = {};
    self.__names = [];
    self.__classes = null;
    self.__ids = null;
    self.__inline = null;
    self.__selfClose = SELF_CLOSE.hasOwnProperty(name);
    self.__hover = false;
    self.__active = false;
    children.forEach(function(child) {
      if(child !== void 0) {
        child.__parent = self;
      }
    });
  }

  //@override
  VirtualDom.prototype.toString = function() {
    var self = this;
    var res = '<' + self.name;
    //处理属性
    Object.keys(self.props).forEach(function(prop) {
      var s = self.__renderProp(prop);
      res += s;
    });
    //使用jaw内联css需解析
    if(self.__style) {
      var s = self.__match(true);
      if(s) {
        if(res.indexOf(' style="') > 1) {
          res = res.replace(/ style="[^"]*"/, ' style="' + s + '"');
        }
        else {
          res = res + ' style="' + s + '"';
        }
      }
    }
    res += ' migi-uid="' + self.uid + '"';
    //input和select这种:input要侦听数据绑定
    if(self.name == 'input') {
      if(self.props.hasOwnProperty('value')) {
        var item = self.props.value;
        self.on(Event.DOM, function() {
          self.off(Event.DOM, arguments.callee);
          function cb() {
            item.v = this.value;
            var key = item.k;
            item.context[key] = this.value;
          }
          switch(self.__cache.type) {
            //一些无需联动
            case 'button':
            case 'hidden':
            case 'image':
            case 'file':
            case 'reset':
            case 'submit':
              break;
            //只需侦听change
            case 'checkbox':
            case 'radio':
            case 'range':
              self.element.addEventListener('change', cb);
              break;
            //其它无需change，但input等
            default:
              self.element.addEventListener('input', cb);
              self.element.addEventListener('paste', cb);
              self.element.addEventListener('cut', cb);
              break;
          }
        });
      }
    }
    else if(self.name == 'select') {
      if(self.props.hasOwnProperty('value')) {
        var item = self.props.value;
        self.on(Event.DOM, function() {
          self.off(Event.DOM, arguments.callee);
          function cb() {
            item.v = this.value;
            var key = item.k;
            item.context[key] = this.value;
          }
          self.element.addEventListener('change', cb);
        });
      }
    }
    //自闭合标签特殊处理
    if(self.__selfClose) {
      return res + '/>';
    }
    res += '>';
    //textarea的value在标签的childNodes里
    if(self.name == 'textarea') {
      self.children.forEach(function(child) {
        if(child instanceof Obj) {
          self.on(Event.DOM, function() {
            self.on(Event.DOM, arguments.callee);
            function cb(e) {
              child.v = this.value;
              var key = child.k;
              child.context[key] = this.value;
            }
            self.element.addEventListener('input', cb);
            self.element.addEventListener('paste', cb);
            self.element.addEventListener('cut', cb);
          });
        }
      });
    }
    //渲染children
    res += self.__renderChildren();
    res +='</' + self.name + '>';
    return res;
  }

  VirtualDom.prototype.isFirst = function() {
    //本身就是Component的唯一节点
    if(this.parent instanceof Component) {
      return true;
    }
    var children = this.parent.children;
    for(var i = 0, len = children.length; i < len; i++) {
      var child = children[i];
      if(child == this) {
        return true;
      }
      else if(child instanceof VirtualDom) {
        return false;
      }
      else if(child instanceof Obj && child.type == Obj.ELEMENT) {
        return false;
      }
    }
  }
  VirtualDom.prototype.isLast = function() {
    //本身就是Component的唯一节点
    if(this.parent instanceof Component) {
      return true;
    }
    var children = this.parent.children;
    for(var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      if(child == this) {
        return true;
      }
      else if(child instanceof VirtualDom) {
        return false;
      }
      else if(child instanceof Obj && child.type == Obj.ELEMENT) {
        return false;
      }
    }
  }

  VirtualDom.prototype.__renderProp = function(prop) {
    var self = this;
    var v = self.props[prop];
    var res = '';
    //onXxx侦听处理
    if(/^on[A-Z]/.test(prop)) {
      self.on(Event.DOM, function() {
        self.off(Event.DOM, arguments.callee);
        var name = prop.slice(2).replace(/[A-Z]/g, function(Up) {
          return Up.toLowerCase();
        });
        self.element.addEventListener(name, function(event) {
          var item = self.props[prop];
          if(item instanceof Cb) {
            item.cb.call(item.context, event);
          }
          else {
            item(event);
          }
        });
      });
    }
    //Obj类型绑定处理
    else if(v instanceof Obj) {
      if(util.isString(v.v)) {
        var s = v.toString();
        //特殊html不转义
        if(prop == 'dangerouslySetInnerHTML') {
          self.on(Event.DOM, function() {
            self.off(Event.DOM, arguments.callee);
            self.element.innerHTML = s;
          });
          return '';
        }
        if(self.__style) {
          self.__cache[prop] = s;
        }
        res = ' ' + prop + '="' + util.encodeHtml(s, true) + '"';
      }
      else if(!!v.v) {
        if(self.__style) {
          self.__cache[prop] = s;
        }
        res = ' ' + prop;
      }
    }
    else {
      var s = v.toString();
      if(prop == 'dangerouslySetInnerHTML') {
        self.on(Event.DOM, function() {
          self.off(Event.DOM, arguments.callee);
          self.element.innerHTML = s;
        });
        return '';
      }
      if(self.__style) {
        self.__cache[prop] = s;
      }
      res = ' ' + prop + '="' + util.encodeHtml(s, true) + '"';
    }
    //使用jaw导入样式时不输出class和id，以migi-class和migi-id取代之
    if(self.__style) {
      switch(prop) {
        case 'class':
        case 'id':
          res = ' ' + 'migi-' + res.slice(1);
          break;
      }
    }
    return res;
  }
  VirtualDom.prototype.__renderChildren = function() {
    var self = this;
    var res = '';
    self.children.forEach(function(child) {
      res += self.__renderChild(child);
    });
    return res;
  }
  VirtualDom.prototype.__renderChild = function(child) {
    var self = this;
    if(child === void 0) {
      return '';
    }
    if(child instanceof Element) {
      return child.toString();
    }
    if(child instanceof Obj) {
      var s = child.toString();
      return child.type == Obj.TEXT ? util.encodeHtml(s) : s;
    }
    if(Array.isArray(child)) {
      var res = '';
      child.forEach(function(item) {
        res += self.__renderChild(item);
      });
      return res;
    }
    return util.encodeHtml(child.toString());
  }

  VirtualDom.prototype.find = function(name) {
    return this.findAll(name, true)[0];
  }
  VirtualDom.prototype.findAll = function(name, first) {
    var res = [];
    for(var i = 0, len = this.children.length; i < len; i++) {
      var child = this.children[i];
      if(child instanceof Element) {
        if(child instanceof Component) {
          if(child.name == name) {
            res.push(child);
            if(first) {
              break;
            }
          }
        }
        else {
          if(child.name == name) {
            res.push(child);
            if(first) {
              break;
            }
          }
          res = res.concat(child.findAll(name));
          if(first && res.length) {
            break;
          }
        }
      }
    }
    return res;
  }

  var _11={};_11.element={};_11.element.get =function() {
    this.__element = this.__element || document.querySelector('[migi-uid="' + this.uid + '"]');
    return this.__element;
  }
  _11.names={};_11.names.get =function() {
    return this.__names;
  }
  _11.style={};_11.style.set =function(v) {
    var self = this;
    self.__style = v;
    if(self.parent instanceof VirtualDom) {
      self.__names = self.parent.names.slice(0);
    }
    else {
      self.__names = [];
    }
    self.__names.push(self.name);
    self.children.forEach(function(child) {
      if(child instanceof VirtualDom) {
        child.style = v;
      }
    });
  }

  //@override
  VirtualDom.prototype.__onDom = function() {
    Element.prototype.__onDom.call(this);
    var self = this;
    var start = 0;
    var prev;
    for(var index = 0, len = self.children.length; index < len; index++) {
      var child = self.children[index];
      var temp = self.__domChild(child, prev, index, start, len);
      if(temp) {
        start = temp.start;
        index = temp.index;
        prev = temp.prev;
      }
    }
  }
  //force强制查看prev，因为child为数组时会展开，当child不是第1个时其展开项都有prev
  VirtualDom.prototype.__domChild = function(child, prev, index, start, len, force) {
    var self = this;
    var temp;
    if(Array.isArray(child)) {
      child.forEach(function(item, i) {
        //第1个同时作为children的第1个要特殊处理
        temp = self.__domChild(item, prev, index, start, len, index || i);
        if(temp) {
          start = temp.start;
          index = temp.index;
          prev = temp.prev;
        }
      });
    }
    else if(child instanceof Element) {
      child.emit(Event.DOM);
      start++;
      //前方文本节点需再增1次，因为文本节点自身不涉及逻辑
      if(index || force) {
        if(VirtualDom.isText(prev)) {
          start++;
        }
      }
      prev = child;
    }
    //Obj类型时需判断是否TEXT
    else if(child instanceof Obj && child.type != Obj.TEXT) {
      temp = self.__domChild(child.v, prev, index, start, len, force);
      if(temp) {
        start = temp.start;
        index = temp.index;
        prev = temp.prev;
      }
    }
    else if(VirtualDom.isText(child)) {
      if(VirtualDom.isEmptyText(child)) {
        //前方如有兄弟文本节点，无需插入
        if(index || force) {
          var prev = self.children[index - 1];
          if(VirtualDom.isText(prev)) {
            return;
          }
        }
        //后方如有非空兄弟文本节点，无需插入；同时设置索引，提高循环性能
        for(var i = index + 1; i < len; i++) {
          var next = self.children[i];
          if(VirtualDom.isText(next)) {
            index++;
            prev = next;
            if(!VirtualDom.isEmptyText(next)) {
              return { start:start, index:index, prev:prev };
            }
          }
          else {
            break;
          }
        }
        var blank = document.createTextNode('');
        //可能仅一个空文本节点，或最后一个空文本节点
        var length = self.element.childNodes.length;
        if(!length || start >= length) {
          self.element.appendChild(blank);
        }
        //插入
        else {
          self.element.insertBefore(blank, self.element.childNodes[start]);
        }
      }
    }
    return { start:start, index:index, prev:prev };
  }
  //@override
  VirtualDom.prototype.__onData = function(k) {
    var self = this;
    //联动属性值
    for(var key in self.props) {
      var item = self.props[key];
      if(item instanceof Obj) {
        var change = false;
        if(Array.isArray(item.k)) {
          change = item.k.indexOf(k) > -1;
        }
        else if(k == item.k) {
          change = true;
        }
        if(change) {
          var ov = item.v;
          var nv = item.cb.call(item.context);
          if(ov != nv) {
            item.v = nv;
            self.__updateAttr(key, nv);
          }
        }
      }
    }
    //利用索引更新，子节点可能为文本、Component、VirtualDom，以及数组
    //其中只有文本节点需要自己更新，记录其索引，组件和VirtualDom递归通知更新
    //由于渲染时相邻的文本变量和String文本同为一个文本节点，因此start为真实DOM的索引
    //当文本节点时start不更新
    //Obj类型的判断type和count，及为文本时是否为空
    var start = 0;
    var ranges = [];
    var prev;
    for(var index = 0, len = self.children.length; index < len; index++) {
      var child = self.children[index];
      //prev和start都传入，在child为数组的情况下自动计算返回
      var temp = self.__checkObj(k, child, prev, index, ranges, start, len);
      start = temp.start;
      prev = temp.prev;
    }
    //得到range更新文本节点，非可视组件可能没有DOM
    if(ranges.length && self.element) {
      //相邻的TEXT节点合并更新
      range.merge(ranges);
      ranges.forEach(function(item) {
        var prevArr;
        var nextArr;
        //利用虚拟索引向前向后找文本节点，拼接后更新到真实索引上
        outer:
        for(var first = item.index; first > 0; first--) {
          var prev = self.children[first - 1];
          //可能存在数组的情况，展开递归判断，命中后，保留文本项
          if(Array.isArray(prev)) {
            prevArr = util.join(prev);
            for(var i = prevArr.length - 1; i >= 0; i--) {
              prev = prevArr[i];
              if(!VirtualDom.isText(prev)) {
                prevArr = prevArr.slice(i + 1);
                break outer;
              }
            }
          }
          //非数组将其置空，方便后面判断
          else {
            prevArr = null;
            if(!VirtualDom.isText(prev)) {
              break;
            }
          }
        }
        for(var last = item.index, len = self.children.length; last < len - 1; last++) {
          var next = self.children[last + 1];
          if(Array.isArray(next)) {
            nextArr = util.join(next);
            for(var i = 0, l = nextArr.length; i < l; i++) {
              next = nextArr[i];
              if(!VirtualDom.isText(next)) {
                nextArr = nextArr.slice(0, i);
                break;
              }
            }
          }
          else {
            nextArr = null;
            if(!VirtualDom.isText(next)) {
              break;
            }
          }
        }
        var res = '';
        for(var i = first; i <= last; i++) {
          //根据前面的可能数组情况下预留的标识合并
          if(i == first && prevArr) {
            res += self.__renderChild(prevArr);
          }
          else if(i == last && nextArr) {
            res += self.__renderChild(nextArr);
          }
          else {
            res += self.__renderChild(self.children[i]);
          }
        }
        var textNode = self.element.childNodes[item.start];
        var now = util.lie ? textNode.innerText : textNode.textContent;
        if(res != now) {
          //textContent自动转义，保留空白，但显式时仍是合并多个空白，故用临时节点的innerHTML再replace代替
          //但当为innerHTML空时，没有孩子节点，所以特殊判断
          if(res) {
            util.NODE.innerHTML = res;
            self.element.replaceChild(util.NODE.firstChild, textNode);
          }
          else if(util.lie) {
            textNode.innerText = '';
          }
          else {
            textNode.textContent = '';
          }
        }
      });
    }
  }
  //force强制查看prev，因为child为数组时会展开，当child不是第1个时其展开项都有prev
  VirtualDom.prototype.__checkObj = function(k, child, prev, index, ranges, start, len, force) {
    var self = this;
    //当Component和VirtualDom则start++，且前面是非空文本节点时再++，因为有2个节点
    //文本节点本身不会增加索引，因为可能有相邻的
    if(child instanceof Obj) {
      //TODO: NEXT_MAYBE_TEXT上次循环的特殊处理
      var old = child.v;
      var oldCount = child.count;
      var oldStart = start;
      var oldType = child.type;
      //可能Obj的关联是个列表
      var change = false;
      if(Array.isArray(child.k)) {
        change = child.k.indexOf(k) > -1;
      }
      else if(k == child.k) {
        change = true;
      }
      //当可能发生变化时才进行比对
      if(change && self.__needUpdate(child)) {
        //老类型是TEXT
        if(oldType == Obj.TEXT) {
          //新类型也是TEXT，进行range更新文本
          if(child.type == Obj.TEXT) {
            ranges.push({ start:start, index:index });
          }
          //新类型是ELEMENT
          else {
            var prevText = false;
            var nextText = false;
            //前面如有文本，设置range更新
            if(index || force) {
              if(VirtualDom.isText(prev)) {
                prevText = true;
                ranges.push({ start:start, index: index - 1 });
                //更新索引，前面有文本节点自增
                start++;
              }
            }
            //更新索引
            start += child.count;
            //后面如有文本，设置range更新
            if(index < len - 1) {
              var next = self.children[index + 1];
              //next需判断数组，prev被展开处理所以无需考虑
              if(Array.isArray(next)) {
                next = util.getFirst(next);
              }
              if(VirtualDom.isText(next)) {
                nextText = true;
                //注意坑，后面可能是个TEXT的Obj，但可能接下来的循环发生类型改变
                //因此设置type，下一个循环会对range进行检查，改变需要特殊处理
                ranges.push({ start: start, index: index + 1, type: VirtualDom.NEXT_MAYBE_TEXT });
              }
            }
            //如果只有自己，需删除掉这个节点，插入在当前的索引位置即可
            if(!prevText && !nextText) {
              self.element.removeChild(self.element.childNodes[oldStart]);
            }
            //如果前面有文本，插入需放到下一个
            else if(prevText) {
              oldStart++;
            }
            //本身渲染后插入
            var s = child.toString();
            var name = /^<([\w-]+)/.exec(s)[1];
            var node = util.getParent(name);
            node.innerHTML = s;
            var insert = self.element.childNodes[oldStart];
            if(insert) {
              for(var i = node.childNodes.length - 1; i >= 0; i--) {
                self.element.insertBefore(node.childNodes[i], insert);
              }
            }
            else {
              while(node.childNodes[0]) {
                self.element.appendChild(node.childNodes[0]);
              }
            }
            //别忘了触发新vd的DOM事件
            if(Array.isArray(child.v)) {
              child.v.forEach(function(item) {
                item.emit(Event.DOM);
              });
            }
            else {
              child.v.emit(Event.DOM);
            }
          }
        }
        //老类型是ELEMENT
        else {
          //新类型是ELEMENT
          if(child.type == Obj.ELEMENT) {
            self.__updateChild(old, child.v, start);
            start += child.count;
            //别忘了前面的文本节点索引
            if(index || force) {
              if(VirtualDom.isText(prev)) {
                start++;
              }
            }
            //TODO: 别忘了触发新vd的DOM事件
          }
          //新类型是TEXT
          else {
            //删除老的DOM节点
            for(var i = 0; i < oldCount; i++) {
              self.element.removeChild(self.element.childNodes[start]);
            }
            var single = true;
            //前面如有文本，设置range更新
            if(index || force) {
              if(VirtualDom.isText(prev)) {
                single = false;
                ranges.push({ start:start, index: index - 1 });
              }
            }
            //后面如有文本，设置range更新
            if(index < len - 1) {
              var next = self.children[index + 1];
              if(Array.isArray(next)) {
                next = util.getFirst(next);
              }
              if(VirtualDom.isText(next)) {
                single = false;
                //同样后面可能Obj变成非TEXT类型，记录type
                ranges.push({ start:start, index: index + 1, type: VirtualDom.NEXT_MAYBE_TEXT_TOO });
              }
            }
            //如果只有自己，本身渲染后插入
            if(single) {
              var node = util.NODE;
              node.innerHTML = child.toString();
              //可能toString()为空字符串，不会生成firstChild
              if(!node.firstChild) {
                var textNode = document.createTextNode('');
                node.appendChild(textNode);
              }
              var insert = self.element.childNodes[start];
              if(insert) {
                self.element.insertBefore(node.firstChild, insert);
              }
              else {
                self.element.appendChild(node.firstChild);
              }
            }
          }
        }
      }
      //未发生改变只更新索引
      else if(oldType == Obj.ELEMENT) {
        start += child.count;
        //别忘了前面的文本节点索引
        if(index || force) {
          if(VirtualDom.isText(prev)) {
            start++;
          }
        }
      }
      prev = child;
    }
    //递归通知，增加索引
    else if(child instanceof Element) {
      child.emit(Event.DATA, k);
      start++;
      if(index || force) {
        if(VirtualDom.isText(prev)) {
          start++;
        }
      }
      prev = child;
    }
    else if(Array.isArray(child)) {
      var temp;
      child.forEach(function(item, i) {
        //第1个同时作为children的第1个要特殊处理
        temp = self.__checkObj(k, item, prev, index, ranges, start, len, i || index);
        start = temp.start;
        prev = temp.prev;
      });
    }
    //else其它情况为文本节点或者undefined忽略
    else {
      prev = child;
    }
    return { start:start, prev:prev };
  }
  //start对应真实DOM索引
  VirtualDom.prototype.__updateChild = function(olds, news, start) {
    var self = this;
    //转成数组方便对比
    if(!Array.isArray(olds)) {
      olds = [olds];
    }
    else {
      olds = util.join(olds);
    }
    if(!Array.isArray(news)) {
      news = [news];
    }
    else {
      news = util.join(news);
    }
    for(var i = 0, len = Math.min(olds.length, news.length); i < len; i++) {
      var ovd = olds[i];
      var nvd = news[i];
      //同类型节点更新之
      if(ovd.name == nvd.name) {
        domDiff(ovd, nvd);
      }
      //否则重绘替换
      else {
        var node = util.getParent(nvd.name);
        node.innerHTML = nvd.toString();
        self.element.replaceChild(node.firstChild, self.element.childNodes[start]);
      }
      start++;
      //TODO: 当是Component的时候
    }
    //老的多余的删除
    for(var j = i, len = olds.length; j < len; j++) {
      self.element.removeChild(self.element.childNodes[start]);
    }
    //新的多余的插入
    if(i <= news.length - 1) {
      var insert = self.element.childNodes[start];
      if(insert) {
        for(var j = news.length - 1; j >= i; j--) {
          var node = util.getParent(news[j].name);
          node.innerHTML = news[j].toString();
          self.element.insertBefore(node.firstChild, insert);
        }
      }
      else {
        for(var j = i, l = news.length; j < l; j++) {
          var node = util.getParent(news[j].name);
          node.innerHTML = news[j].toString();
          self.element.appendChild(node.firstChild);
        }
      }
    }
  }
  VirtualDom.prototype.__needUpdate = function(child) {
    var ov = child.v;
    var nv = child.cb.call(child.context);
    if(!util.equal(ov, nv)) {
      child.v = nv;
      return true;
    }
    return false;
  }
  VirtualDom.prototype.__updateAttr = function(k, v) {
    if(k == 'dangerouslySetInnerHTML') {
      this.element.innerHTML = v || '';
      return;
    }
    switch(k) {
      case 'value':
      case 'checked':
      case 'selected':
      case 'selectedIndex':
      case 'readOnly':
      case 'multiple':
      case 'defaultValue':
      case 'autofocus':
      case 'async':
      case 'tagName':
      case 'nodeName':
      case 'nodeType':
        this.element[k] = v || false;
        break;
      case 'id':
      case 'class':
        if(this.__style) {
          if(v === null || v === void 0) {
            this.element.removeAttribute('migi-' + k);
          }
          else{
            this.element.setAttribute('migi-' + k, v);
          }
          break;
        }
      default:
        if(v === null || v === void 0) {
          this.element.removeAttribute(k);
        }
        else{
          this.element.setAttribute(k, v);
        }
        break;
    }
    //使用了jaw内联解析css
    if(this.__style) {
      this.__cache[k] = v;
      this.__updateStyle();
    }
  }
  VirtualDom.prototype.__match = function(first) {
    this.__inline = this.__cache.style || '';
    if(this.parent instanceof VirtualDom) {
      this.__classes = this.parent.__classes.slice(0);
      this.__ids = this.parent.__ids.slice(0);
    }
    else {
      this.__classes = [];
      this.__ids = [];
    }
    var klass = (this.__cache['class'] || '').trim();
    if(klass) {
      klass = klass.split(/\s+/);
      sort(klass, function(a, b) {
        return a < b;
      });
      this.__classes.push('.' + klass.join('.'));
    }
    else {
      this.__classes.push('');
    }
    var id = (this.__cache.id || '').trim();
    if(id) {
      this.__ids.push(id);
    }
    else {
      this.__ids.push('');
    }
    //TODO: css3伪类
    var matches = match(this.__names, this.__classes, this.__ids, this.__style, this, first);
    //本身的inline最高优先级追加到末尾
    return matches + this.__inline;
  }
  VirtualDom.prototype.__updateStyle = function() {
    var s = this.__match();
    if(this.element.getAttribute('style') != s) {
      this.element.setAttribute('style', s);
    }
    this.children.forEach(function(child) {
      if(child instanceof VirtualDom) {
        child.__updateStyle();
      }
    });
  }

  VirtualDom.isText=function(item) {
    //动态文本节点
    if(item instanceof Obj) {
      if(item.type == Obj.TEXT) {
        return true;
      }
    }
    //静态文本节点，包括空、undefined、null
    else if(!(item instanceof Element)) {
      return true;
    }
  }
  VirtualDom.isEmptyText=function(item) {
    //动态文本节点
    if(item instanceof Obj) {
      return item.empty;
    }
    return item === void 0 || !item.toString();
  }
Object.keys(_11).forEach(function(k){Object.defineProperty(VirtualDom.prototype,k,_11[k])});Object.keys(Element).forEach(function(k){VirtualDom[k]=Element[k]});

//vd由node变为text的时候，记录后方可能会为文本
VirtualDom.NEXT_MAYBE_TEXT = 0;
//vd由text变为node的时候，记录后方可能会为文本
VirtualDom.NEXT_MAYBE_TEXT_TOO = 1;

exports["default"]=VirtualDom;});