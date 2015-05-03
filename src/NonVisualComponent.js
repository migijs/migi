import Component from './Component';

class NonVisualComponent extends Component {
  constructor(...data) {
    super(...data);
  }

  //非可视为空
  toString() {
    return '';
  }

  //没有dom
  onDom() {}
}

export default NonVisualComponent;