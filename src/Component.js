import Event from './Event';
import type from './type';

class Component extends Event {
  constructor(name, props = {}, ...chilren) {
    super();
    this.name = name;
    this.props = props;
    this.chilren = chilren;
    this.on(Event.DOM, this.onDom);
    this.on(Event.DATA, this.onData);
  }
  //需要被子类覆盖
  render() {
    var self = this;
    var res = '<' + self.name;
    Object.keys(self.props).forEach(function(k) {
      res += ' ' + k + '="' + self.props[k] + '"'
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
    if(child instanceof Component) {
      return child.render();
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

export default Component;