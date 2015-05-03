import Event from './Event';
import Component from './Component';

class CachedComponent extends Component {
  constructor(...data) {
    super(...data);
    this.__handler = {};
  }

  __onData(target, k) {
    var self = this;
    function cb() {
      self.htmlComponent.emit(Event.DATA, target, k);
    }
    var temp;
    if(!self.__handler.hasOwnProperty(k)) {
      temp = self.__handler[k] = { cb: cb, timeout: null };
    }
    temp = temp || self.__handler[k];
    if(temp.timeout) {
      temp.cb = cb;
    }
    else {
      temp.timeout = setTimeout(function() {
        temp.cb();
        temp.timeout = null;
      }, 1);
    }
    self.children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DATA, target, k);
      }
    });
  }
}

export default CachedComponent;