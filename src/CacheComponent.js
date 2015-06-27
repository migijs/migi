import Event from './Event';
import Component from './Component';

class CachedComponent extends Component {
  constructor(...data) {
    super(...data);
    this.__handler = {};
  }

  __onData(k) {
    var self = this;
    if(self.__handler.hasOwnProperty(k)) {
      return;
    }
    function cb() {
      self.virtualDom.emit(Event.DATA, k);
      self.children.forEach(function(child) {
        if(child instanceof Component) {
          child.emit(Event.DATA, k);
        }
      });
    }
    self.__handler[k] = cb;
    setTimeout(function() {
      cb();
      delete self.__handler[k];
    }, 1);
  }
}

export default CachedComponent;