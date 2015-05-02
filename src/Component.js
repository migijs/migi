import Event from './Event';
import HtmlComponent from './HtmlComponent';
import type from './type';

class Component extends Event {
  constructor(name, props = {}) {
    super();
    this.name = name;
    this.props = props;
  }
  //需要被子类覆盖
  render() {
    return '<' + this.name + '/>';
  }
  toString() {
    var self = this;
    var res = self.render();
    if(res instanceof HtmlComponent) {
      self.props = self.props || {};
      Object.keys(self.props).forEach(function(k) {
        res.setProp(k, self.props[k]);
      });
    }
    return res.toString();
  }
}

export default Component;