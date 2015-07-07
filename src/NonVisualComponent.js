import Event from './Event';
import Component from './Component';

class NonVisualComponent extends Component {
  constructor(...data) {
    super(...data);
  }

  //非可视为空
  //@overwrite
  toString() {
    if(this.children.length) {
      return super.toString();
    }
    return '';
  }

  //没有dom
  //@overwrite
  __onDom() {
    this.__dom = true;
  }
}

export default NonVisualComponent;