var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var type=function(){var _1=require('./type');return _1.hasOwnProperty("type")?_1.type:_1.hasOwnProperty("default")?_1.default:_1}();
var uid=function(){var _2=require('./uid');return _2.hasOwnProperty("uid")?_2.uid:_2.hasOwnProperty("default")?_2.default:_2}();
var Obj=function(){var _3=require('./Obj');return _3.hasOwnProperty("Obj")?_3.Obj:_3.hasOwnProperty("default")?_3.default:_3}();

!function(){var _4=Object.create(Event.prototype);_4.constructor=HtmlComponent;HtmlComponent.prototype=_4}();
  function HtmlComponent(name, props, children) {
    if(props===void 0)props={};children=[].slice.call(arguments, 2);Event.call(this);
    var self = this;
    self.name = name;
    self.props = props;
    self.children = children;
    children.forEach(function(child) {
      child.parent = self;
    });
    self.parent = null;
    self.id = uid();
    self.element = null;

    self.on(Event.DOM, self.__onDom);
    self.on(Event.DATA, self.__onData);
  }
  HtmlComponent.prototype.toString = function() {
    var self = this;
    var res = '<' + self.name;
    Object.keys(self.props).forEach(function(k) {
      if(/^on[A-Z]/.test(k)) {
        self.on(Event.DOM, function() {
          var name = k.slice(2).replace(/[A-Z]/g, function(Up) {
            return Up.toLowerCase();
          });
          self.element.addEventListener(name, function(event) {
            var item = self.props[k];
            item.cb.call(item.context, event);
          });
        });
      }
      else {
        res += ' ' + k + '="' + self.props[k].toString() + '"';
        if(k == 'value' && self.name == 'input' && self.props[k] instanceof Obj) {
          var item = self.props[k];
          self.on(Event.DOM, function() {
            function cb() {
              item.v = this.value;
              var key = item.k;
              item.context[key] = this.value;
            }
            self.element.addEventListener('input', cb);
            self.element.addEventListener('paste', cb);
            self.element.addEventListener('cut', cb);
          });
        }
      }
    });
    res += ' migi-id="' + self.id + '"';
    res += '>';
    if(self.name == 'textarea') {
      self.children.forEach(function(child) {
        if(child instanceof Obj) {
          self.on(Event.DOM, function() {
            function cb(e) {
              child.v = this.value;
              var key = child.k;
              child.context[key] = this.value;
            }
            self.element.addEventListener('input', cb, true);
            self.element.addEventListener('paste', cb, true);
            self.element.addEventListener('cut', cb, true);
          });
        }
      });
    }
    self.children.forEach(function(child) {
      res += self.renderChild(child);
    });
    res +='</' + self.name + '>';
    return res;
  }
  HtmlComponent.prototype.renderChild = function(child) {
    var self = this;
    if(child instanceof HtmlComponent || child instanceof Obj) {
      return child.toString();
    }
    else if(type.isArray(child)) {
      var res = '';
      child.forEach(function(item) {
        res += self.renderChild(item);
      });
      return res;
    }
    else {
      return child.toString();
    }
  }
  HtmlComponent.prototype.closestHtml = function(name) {
    var parent = this.parent;
    while(parent) {
      if(parent instanceof HtmlComponent) {
        if(name && parent.name == name) {
          return parent;
        }
        return parent;
      }
      parent = parent.parent;
    }
    return document.body;
  }
  HtmlComponent.prototype.closeset = function(name) {
    var parent = this.parent;
    while(parent) {
      if(parent instanceof HtmlComponent == false) {
        if(name && parent.name == name) {
          return parent;
        }
        return parent;
      }
      parent = parent.parent;
    }
  }

  HtmlComponent.prototype.__onDom = function() {
    var self = this;
    var parent = self.closestHtml();
    if(parent != document.body) {
      parent = parent.element;
    }
    self.element = parent.querySelector('[migi-id="' + self.id + '"]');
    if(self.parent && self.parent instanceof HtmlComponent == false) {
      self.parent.element = self.element;
    }
    self.children.forEach(function(child) {
      if(!type.isString(child) && child instanceof Event) {
        child.emit(Event.DOM);
      }
    });
  }
  HtmlComponent.prototype.__onData = function(target, k) {
    var self = this;
    //联动属性值
    for(var key in self.props) {
      var item = self.props[key];
      if(item instanceof Obj) {
        if(Array.isArray(item.k)) {
          var i = item.k.indexOf(k);
          if(i > -1) {
            var ov = item.v;
            var nv = item.cb.call(target);
            if(ov != nv) {
              if(key == 'value') {
                self.element.value = nv;
              }
              else {
                self.element.setAttribute(key, nv);
              }
            }
          }
        }
        else if(k == item.k) {
          var ov = item.v;
          var nv = item.cb.call(target);
          if(ov != nv) {
            if(key == 'value') {
              self.element.value = nv;
            }
            else {
              self.element.setAttribute(key, nv);
            }
          }
        }
      }
    }
    //联动html和子节点
    //利用索引更新，子节点只可能为：文本（包括变量）、组件、html
    //其中只有文本节点需要自己更新，记录其索引
    //由于渲染时变量和文本同为一个文本节点，因此start为真实DOM的索引
    var start = 0;
    var change = [];
    self.children.forEach(function(child, i) {
      //文本节点变量
      if(child instanceof Obj) {
        if(Array.isArray(child.k)) {
          var j = child.k.indexOf(k);
          if(j > -1) {
            var res = self.__updateChild(child, target);
            if(res) {
              change.push({
                start: start,
                index: i
              });
            }
          }
        }
        else if(k == child.k) {
          var res = self.__updateChild(child, target);
          if(res) {
            change.push({
              start: start,
              index: i
            });
          }
        }
      }
      //递归通知，增加索引
      else if(child instanceof HtmlComponent) {
        child.emit(Event.DATA, target, k);
        start++;
      }
      //else其它情况为普通文本节点忽略
    });
    if(change.length && self.element) {
      change.forEach(function(item) {
        //利用虚拟索引向前向后找文本节点，拼接后更新到真实索引上
        for(var first = item.index; first > 0; first--) {
          var prev = self.children[first - 1];
          if(!type.isString(prev) && !prev instanceof Obj) {
            break;
          }
        }
        for(var last = item.index, len = self.children.length; last < len - 1; last++) {
          var next = self.children[last + 1];
          if(!type.isString(next) && !next instanceof Obj) {
            break;
          }
        }
        var res = '';
        for(var i = first; i <= last; i++) {
          res += self.renderChild(self.children[i]);
        }
        var textNode = self.element.childNodes[item.start];
        //当仅有1个变量节点且变量为空时DOM无节点
        if(!textNode) {
          textNode = document.createTextNode('');
          self.element.appendChild(textNode);
        }
        var now = textNode.textContent;
        if(res != now) {
          textNode.textContent = res;
        }
      });
    }
  }
  HtmlComponent.prototype.__updateChild = function(child, target) {
    var ov = child.v;
    var nv = child.cb.call(target).toString();
    if(ov != nv) {
      child.v = nv;
      return true;
    }
    return false;
  }
Object.keys(Event).forEach(function(k){HtmlComponent[k]=Event[k]});

exports.default=HtmlComponent;