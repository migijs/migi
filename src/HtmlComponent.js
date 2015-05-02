import Event from './Event';
import type from './type';

class HtmlComponent extends Event {
  constructor(name, props = {}, ...chilren) {
    super();
    this.name = name;
    this.props = props;
    this.chilren = chilren;

    this.on(Event.DOM, this.onDom);
    this.on(Event.DATA, this.onData);
  }
  setProp(k, v) {
    this.props[k] = v;
  }
  toString() {
    var self = this;
    var res = '<' + self.name;
    Object.keys(self.props).forEach(function(k) {
      res += ' ' + k + '="' + self.props[k] + '"';
    });
    res += '>';
    self.chilren.forEach(function(child) {
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
    //TODO
  }
  onData(k, v) {
    //TODO
  }
}

export default HtmlComponent;