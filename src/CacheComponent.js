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
    self.__handler[k] = true;
    setTimeout(function() {
      var keys = Object.keys(self.__handler);
      self.__handler = {};
      self.virtualDom.emit(Event.DATA, keys);
      self.children.forEach(function(child) {
        if(child instanceof Component) {
          child.emit(Event.DATA, keys);
        }
      });
    }, 1);
  }
}

export default CachedComponent;