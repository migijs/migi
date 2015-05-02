define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var type=function(){var _1=require('./type');return _1.hasOwnProperty("type")?_1.type:_1.hasOwnProperty("default")?_1.default:_1}();
var uid=function(){var _2=require('./uid');return _2.hasOwnProperty("uid")?_2.uid:_2.hasOwnProperty("default")?_2.default:_2}();

!function(){var _3=Object.create(Event.prototype);_3.constructor=HtmlComponent;HtmlComponent.prototype=_3}();
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

    self.on(Event.DOM, this.onDom);
    self.on(Event.DATA, this.onData);
  }
  HtmlComponent.prototype.toString = function() {
    var self = this;
    var res = '<' + self.name;
    Object.keys(self.props).forEach(function(k) {
      if(/^on[A-Z]/.test(k)) {
        self.on(Event.DOM, function() {
          var dom = document.querySelector(this.name + '[migi-id="' + self.id + '"]');
          var name = k.slice(2).replace(/[A-Z]/g, function(Up) {
            return Up.toLowerCase();
          });
          dom.addEventListener(name, function(event) {
            self.props[k].call(self.closeset(), event);
          }, true);
        });
      }
      else {
        res += ' ' + k + '="' + self.props[k] + '"';
      }
    });
    res += ' migi-id="' + self.id + '"';
    res += '>';
    self.children.forEach(function(child) {
      res += self.renderChild(child);
    });
    res +='</' + self.name + '>';
    return res;
  }
  HtmlComponent.prototype.renderChild = function(child) {
    var self = this;
    if(child instanceof HtmlComponent) {
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
      return child;
    }
  }
  HtmlComponent.prototype.closestHtml = function() {
    var parent = this.parent;
    while(parent) {
      if(parent instanceof HtmlComponent) {
        return parent;
      }
      parent = parent.parent;
    }
    return document.body;
  }
  HtmlComponent.prototype.closeset = function() {
    var parent = this.parent;
    while(parent) {
      if(parent instanceof HtmlComponent == false) {
        return parent;
      }
      parent = parent.parent;
    }
  }

  HtmlComponent.prototype.onDom = function() {
    var self = this;
    var parent = self.closestHtml();
    if(parent != document.body) {
      parent = parent.element;
    }
    self.element = parent.querySelector('[migi-id="' + self.id + '"]');
    if(self.parent instanceof HtmlComponent == false) {
      self.parent.element = self.element;
    }
    self.children.forEach(function(child) {
      child.emit(Event.DOM);
    });
  }
  HtmlComponent.prototype.onData = function(k, v) {
    //TODO
  }
Object.keys(Event).forEach(function(k){HtmlComponent[k]=Event[k]});

exports.default=HtmlComponent;});