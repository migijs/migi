import Component from './Component';

class NonVisualComponent extends Component {
  constructor(...data) {
    super(...data);
  }

  //非可视为空
  //@overwrite
  toString() {
    return '';
  }

  //没有dom
  //@overwrite
  __onDom() {
    this.__dom = true;
    Component.fakeDom(this.children);
  }
}

export default NonVisualComponent;