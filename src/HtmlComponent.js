import Event from './Event';
import type from './type';
import uid from './uid';

class HtmlComponent extends Event {
  constructor(name, props = {}, ...children) {
    super();
    this.name = name;
    this.props = props;
    this.children = children;
    this.parent = null;
    this.id = uid();

    this.on(Event.DOM, this.onDom);
    this.on(Event.DATA, this.onData);
  }
  toString() {
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
            self.props[k](event);
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
  renderChild(child) {
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

  onDom() {
    var self = this;
    self.children.forEach(function(child) {
      child.emit(Event.DOM);
    });
  }
  onData(k, v) {
    //TODO
  }
}

export default HtmlComponent;