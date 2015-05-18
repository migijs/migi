import Component from './Component';

class NonVisualComponent extends Component {
  constructor(...data) {
    super(...data);
    var name = arguments.callee.caller.toString();
    name = /^function\s+([\w$]+)/.exec(name)[1];
    this.__name = name;
  }

  //非可视为空
  toString() {
    return '';
  }

  //没有dom
  __onDom() {}
}

export default NonVisualComponent;