import Event from './Event';
import Element from './Element';
import Component from './Component';
import util from './util';
import Obj from './Obj';
import Cb from './Cb';
import merge from './merge';
import match from './match';
import sort from './sort';

const SELF_CLOSE = {
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

const TEMP_NODE = document.createElement('div');

const NEXT_MAYBE_TEXT = 0;
const NEXT_MAYBE_TEXT_TOO = 1;

class VirtualDom extends Element {
  constructor(name, props = {}, children = []) {
    //fix循环依赖
    if(Component.hasOwnProperty('default')) {
      Component = Component['default'];
    }
    //自闭合标签不能有children
    if(SELF_CLOSE.hasOwnProperty(name) && children.length) {
      throw new Error('self-close tag can not has chilren nodes: ' + name);
    }
    super(name, props, children);
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
  toString() {
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

  isFirst() {
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
  isLast() {
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

  __renderProp(prop) {
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
  __renderChildren() {
    var self = this;
    var res = '';
    self.children.forEach(function(child) {
      res += self.__renderChild(child);
    });
    return res;
  }
  __renderChild(child) {
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
  //start对应真实DOM索引
  __reRender(olds, news, start) {
    var self = this;
    //转成数组方便对比
    if(!Array.isArray(olds)) {
      olds = [olds];
    }
    if(!Array.isArray(news)) {
      news = [news];
    }
    for(var i = 0, len = Math.min(olds.length, news.length); i < len; i++) {
      var ovd = olds[i];
      var nvd = news[i];
      //同类型节点更新之
      if(ovd.name == nvd.name) {
        self.__updateChild(ovd, nvd);
      }
      //否则重绘插入
      else {
        var s = child.toString();
        var name = /^<([\w-])/.exec(s)[1];
        var node = util.getParent(name);
        node.innerHTML = s;
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
          var s = news[j].toString();
          var name = /^<([\w-])/.exec(s)[1];
          var node = util.getParent(name);
          node.innerHTML = s;
          self.element.insertBefore(node.firstChild, insert);
        }
      }
      else {
        for(var j = i, l = news.length; j < l; j++) {
          var s = news[j].toString();
          var name = /^<([\w-])/.exec(s)[1];
          var node = util.getParent(name);
          node.innerHTML = s;
          self.element.appendChild(node.firstChild);
        }
      }
    }
  }

  find(name) {
    return this.findAll(name, true)[0];
  }
  findAll(name, first) {
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
  //DomDiff之后发生变更，更新的新VirtualDom
  __updateChild(old, virtualDom) {
    //特殊的uid，以及将真实DOM引用赋给新vd
    var elem = old.element;
    elem.setAttribute('migi-uid', virtualDom.uid);
    virtualDom.element = elem;
    //删除老参数，添加新参数
    var ok = Object.keys(old.props);
    var nk = Object.keys(virtualDom.props);
    //记录对比过的prop
    var hash = {};
    ok.forEach(function(prop) {
      //TODO: 侦听引用对比
      if(/^on[A-Z]/.test(prop)) {
        //TODO: removeEventListener参数
        var name = prop.slice(2).replace(/[A-Z]/g, function(Up) {
          return Up.toLowerCase();
        });
        elem.removeEventListener(name);
      }
      else {
        hash[prop] = true;
        //对比老属性，相同无需更新
        var v = old.props[prop];
        var n = virtualDom.props[prop];
        if(v !== n) {
          old.__updateAttr(prop, n);
        }
      }
    });
    //添加新vd的属性
    nk.forEach(function(prop) {
      //TODO: onXxx
      if(!hash.hasOwnProperty(prop)) {
        virtualDom.__updateAttr(prop, virtualDom.props[prop]);
      }
    });
    //渲染children
    var start = 0;
    var range = [];
    //遍历孩子，长度取新老vd最大值
    for(var i = 0, length = Math.max(old.children.length, virtualDom.children.length); i < length; i++) {
      var oc = old.children[i];
      var nc = virtualDom.children[i];
      var isArray = Array.isArray(oc);
      var len = isArray ? old.length : 0;
      var count = 0;
      var source = isArray ? oc[0] : oc;
      if(Array.isArray(nc)) {
        var index = -1;
        nc.forEach(function(item, i) {
          index = i;
          if(item instanceof VirtualDom) {
            //老的是数组
            if(isArray) {
              if(source === void 0) {
                //
              }
              else {
                if(source instanceof VirtualDom) {
                  item.__updateChild(source, item);
                }
                else if(source instanceof Component) {
                  //TODO
                }
                else {
                  var dom = util.getParent(item.name);
                  dom.innerHTML = item.toString();
                  item.element.replaceChild(dom.firstChild, nc.element.childNodes[start]);
                }
              }
              source = oc[++count];
            }
            else {
              //TODO
            }
            start++;
            item.emit(Event.DOM);
          }
        });
        //可能老的长度>新的，需删除后面的部分
        if(isArray) {
          for(var i = index + 1; i < len; i++) {
            self.element.removeChild(self.element.childNodes[start--]);
            //TODO: 可能不是DOM而是合并的text节点或数组
          }
        }
      }
      else {
        //可能新的没有
        if(nc === void 0) {
          if(isArray) {
            //TODO
          }
          else {
            //TODO
          }
        }
        else {
          if(isArray) {
            //TODO
          }
          else {
            if(nc instanceof VirtualDom) {
              if(source instanceof VirtualDom) {
                if(nc.name == source.name) {
                  nc.__updateChild(source, nc);
                }
                else {
                  //TODO
                }
                start++;
              }
              else if(source instanceof Component) {
                //TODO
              }
              else {
                //TODO
              }
            }
            else if(nc instanceof Component) {
              //TODO
            }
            else {
              range.push({ start, index: 0 });
            }
          }
        }
      }
    }
    //相邻的TEXT节点合并更新
    merge(range);
    if(range.length && elem) {
      var self = this;
      range.forEach(function(item) {
        //利用虚拟索引向前向后找文本节点，拼接后更新到真实索引上
        for(var first = item.index; first > 0; first--) {
          var prev = virtualDom.children[first - 1];
          if(!util.isString(prev)) {
            break;
          }
        }
        for(var last = item.index, len = old.children.length; last < len - 1; last++) {
          var next = virtualDom.children[last + 1];
          if(!util.isString(next)) {
            break;
          }
        }
        var res = '';
        for(var i = first; i <= last; i++) {
          res += virtualDom.__renderChild(virtualDom.children[i]);
        }
        var textNode = virtualDom.element.childNodes[item.start];
        var now = util.lie ? textNode.innerText : textNode.textContent;
        if(res != now) {
          //textContent自动转义，保留空白，但显示时仍是合并多个空白，故用临时节点的innerHTML再replace代替
          //但当为innerHTML空时，没有孩子节点，所以特殊判断
          if(res) {
            TEMP_NODE.innerHTML = res;
            elem.replaceChild(TEMP_NODE.firstChild, textNode);
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

  get element() {
    this.__element = this.__element || document.querySelector('[migi-uid="' + this.uid + '"]');
    return this.__element;
  }
  set element(v) {
    this.__element = v;
  }
  get names() {
    return this.__names;
  }
  set style(v) {
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
  __onDom() {
    super.__onDom();
    var self = this;
    var length = self.element.childNodes.length;
    var start = 0;
    var prev;
    for(var index = 0, len = self.children.length; index < len; index++) {
      var child = self.children[index];
      var temp = self.__domChild(child, prev, index, start, len, length);
      if(temp) {
        start = temp.start;
        index = temp.index;
        prev = temp.prev;
      }
    }
  }
  //force强制查看prev，因为child为数组时会展开，当child不是第1个时其展开项都有prev
  __domChild(child, prev, index, start, len, length, force) {
    var self = this;
    if(Array.isArray(child)) {
      var temp;
      util.join(child).forEach(function(item, i) {
        //第1个同时作为children的第1个要特殊处理
        temp = self.__domChild(item, prev, index, start, len, length, index || i);
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
        if(self.__isText(prev)) {
          start++;
        }
      }
      prev = child;
    }
    else if(self.__isText(child)) {
      if(self.__isEmptyText(child)) {
        //前方如有兄弟文本节点，无需插入
        if(index || force) {
          var prev = self.children[index - 1];
          if(self.__isText(prev)) {
            return;
          }
        }
        //后方如有非空兄弟文本节点，无需插入；同时设置索引，提高循环性能
        for(var i = index + 1; i < len; i++) {
          var next = self.children[i];
          if(self.__isText(next)) {
            index++;
            prev = next;
            if(!self.__isEmptyText(next)) {
              return { start, index, prev };
            }
          }
          else {
            break;
          }
        }
        var blank = document.createTextNode('');
        //可能仅一个空文本节点，或最后一个空文本节点
        if(!length || start >= length) {
          self.element.appendChild(blank);
        }
        //插入
        else {
          self.element.insertBefore(blank, self.element.childNodes[start]);
        }
      }
    }
    return { start, index, prev };
  }
  //@override
  __onData(k) {
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
    var range = [];
    var len = self.children.length;
    var prev;
    for(var index = 0; index < len; index++) {
      var child = self.children[index];
      //prev和start都传入，在child为数组的情况下自动计算返回
      var temp = self.__checkChild(k, child, prev, index, range, start, len);
      start = temp.start;
      prev = temp.prev;
    }
    //得到range更新文本节点，非可视组件可能没有DOM
    if(range.length && self.element) {
      //相邻的TEXT节点合并更新
      merge(range);
      range.forEach(function(item) {
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
              if(!self.__isText(prev)) {
                prevArr = prevArr.slice(i + 1);
                break outer;
              }
            }
          }
          //非数组将其置空，方便后面判断
          else {
            prevArr = null;
            if(!self.__isText(prev)) {
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
              if(!self.__isText(next)) {
                nextArr = nextArr.slice(0, i);
                break;
              }
            }
          }
          else {
            nextArr = null;
            if(!self.__isText(next)) {
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
            TEMP_NODE.innerHTML = res;
            self.element.replaceChild(TEMP_NODE.firstChild, textNode);
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
  __checkChild(k, child, prev, index, range, start, len, force) {
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
            range.push({ start, index });
          }
          //新类型是ELEMENT
          else {
            var prevText = false;
            var nextText = false;
            //前面如有文本，设置range更新
            if(index || force) {
              if(self.__isText(prev)) {
                prevText = true;
                range.push({ start, index: index - 1 });
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
              if(self.__isText(next)) {
                nextText = true;
                //注意坑，后面可能是个TEXT的Obj，但可能接下来的循环发生类型改变
                //因此设置type，下一个循环会对range进行检查，改变需要特殊处理
                range.push({ start: start, index: index + 1, type: NEXT_MAYBE_TEXT });
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
            var name = /^<([\w-])/.exec(s)[1];
            var node = util.getParent(name);
            node.innerHTML = s;
            var insert = self.element.childNodes[oldStart];
            if(insert) {
              for(var i = node.childNodes.length - 1; i >= 0; i--) {
                self.element.insertBefore(node.childNodes[i], insert);
              }
            }
            else {
              for(var i = 0, l = node.childNodes.length; i < l; i++) {
                self.element.appendChild(node.childNodes[i]);
              }
            }
            //别忘了Obj的新DOM触发事件
            child.emit(Event.DOM);
          }
        }
        //老类型是ELEMENT
        else {
          //新类型是ELEMENT
          if(child.type == Obj.ELEMENT) {
            self.__reRender(old, child.v, start);
            start += child.count;
            //别忘了前面的文本节点索引
            if(index || force) {
              if(self.__isText(prev)) {
                start++;
              }
            }
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
              if(self.__isText(prev)) {
                single = false;
                range.push({ start, index: index - 1 });
              }
            }
            //后面如有文本，设置range更新
            if(index < len - 1) {
              var next = self.children[index + 1];
              if(Array.isArray(next)) {
                next = util.getFirst(next);
              }
              if(self.__isText(next)) {
                single = false;
                //同样后面可能Obj变成非TEXT类型，记录type
                range.push({ start, index: index + 1, type: NEXT_MAYBE_TEXT_TOO });
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
          if(self.__isText(prev)) {
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
        if(self.__isText(prev)) {
          start++;
        }
      }
      prev = child;
    }
    else if(Array.isArray(child)) {
      var temp;
      util.join(child).forEach(function(item, i) {
        //第1个同时作为children的第1个要特殊处理
        temp = self.__checkChild(k, item, prev, index, range, start, len, i || index);
        start = temp.start;
        prev = temp.prev;
      });
    }
    //else其它情况为文本节点或者undefined忽略
    else {
      prev = child;
    }
    return { start, prev };
  }
  __isText(item) {
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
  //默认已是text类型
  __isEmptyText(item) {
    //动态文本节点
    if(item instanceof Obj) {
      return item.empty;
    }
    return item === void 0 || !item.toString();
  }
  __needUpdate(child) {
    var ov = child.v;
    var nv = child.cb.call(child.context);
    if(!util.equal(ov, nv)) {
      child.v = nv;
      return true;
    }
    return false;
  }
  __updateAttr(k, v) {
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
  __match(first) {
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
  __updateStyle() {
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
}

export default VirtualDom;