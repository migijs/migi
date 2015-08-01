import Event from './Event';
import Component from './Component';
import util from './util';
import browser from './browser';

class NonVisualComponent extends Component {
  constructor(...data) {
    super(...data);

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiNV = true;
      return this.__hackLie(NonVisualComponent);
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