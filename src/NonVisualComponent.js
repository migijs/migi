import Event from './Event';
import Component from './Component';
import browser from './browser';

class NonVisualComponent extends Component {
  constructor(...data) {
    super(...data);

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiNVCp = true;
    }
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
    Component.fakeDom(this.$children);
  }
}

export default NonVisualComponent;