import Component from './Component';

class NonVisualComponent extends Component {
  constructor(...data) {
    super(...data);
  }

  //�ǿ���Ϊ��
  toString() {
    return '';
  }

  //û��dom
  onDom() {}
}

export default NonVisualComponent;