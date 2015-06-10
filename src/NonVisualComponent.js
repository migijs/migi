import Event from './Event';
import Component from './Component';

class NonVisualComponent extends Component {
  constructor(...data) {
    super(...data);
  }

  //非可视为空
  toString() {
    if(this.children.length) {
      return super.toString();
    }
    return '';
  }

  //没有dom
  __onDom() {
    this.__dom = true;
    //触发后就移除
    this.off(Event.DOM, this.__onDom);
  }
}

export default NonVisualComponent;