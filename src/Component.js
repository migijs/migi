import Event from './Event';
import HtmlComponent from './HtmlComponent';
import type from './type';

class Component extends Event {
  constructor(name, props = {}, ...children) {
    super();
    this.name = name;
    this.props = props;
    this.children = children;
  }
  //需要被子类覆盖
  render() {
    return '<' + this.name + '/>';
  }
  toString() {
    var self = this;
    var res = self.render();
    return res.toString();
  }
}

export default Component;