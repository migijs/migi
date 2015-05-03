import Event from './Event';
import type from './type';
import uid from './uid';
import Obj from './Obj';

class HtmlComponent extends Event {
  constructor(name, props = {}, ...children) {
    super();
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
  toString() {
    var self = this;
    var res = '<' + self.name;
    Object.keys(self.props).forEach(function(k) {
      if(/^on[A-Z]/.test(k)) {
        self.on(Event.DOM, function() {
          var name = k.slice(2).replace(/[A-Z]/g, function(Up) {
            return Up.toLowerCase();
          });
          self.element.addEventListener(name, function(event) {
            self.props[k].v.call(self.closeset(), event);
          }, true);
        });
      }
      else {
        res += ' ' + k + '="' + self.props[k].toString() + '"';
        if(k == 'value' && self.name == 'input' && self.props[k] instanceof Obj) {
          self.on(Event.DOM, function() {
            function cb() {
              var key = self.props[k].k.replace(/^this\./, '');
              self.closeset()[key] = this.value;
            }
            self.element.addEventListener('input', cb, true);
            self.element.addEventListener('paste', cb, true);
            self.element.addEventListener('cut', cb, true);
          });
        }
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
  renderChild(child) {
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
      return child;
    }
  }
  closestHtml() {
    var parent = this.parent;
    while(parent) {
      if(parent instanceof HtmlComponent) {
        return parent;
      }
      parent = parent.parent;
    }
    return document.body;
  }
  closeset() {
    var parent = this.parent;
    while(parent) {
      if(parent instanceof HtmlComponent == false) {
        return parent;
      }
      parent = parent.parent;
    }
  }

  onDom() {
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
  onData(target, k) {
    var self = this;
    var change = false;
    self.children.forEach(function(child) {
      if(child instanceof Obj && k == child.k) {
        var now = target[k];
        if(now != child.v) {
          change = true;
          child.v = now;
        }
      }
      else if(child instanceof HtmlComponent) {
        child.emit(Event.DATA, target, k);
      }
    });
    if(change) {
      var res = '';
      self.children.forEach(function(child) {
        res += self.renderChild(child);
      });
      this.element.innerHTML = res;
    }
    //TODO:嵌套html或子组件时处理
  }
}

export default HtmlComponent;