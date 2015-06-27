import Event from './Event';
import Component from './Component';

class CachedComponent extends Component {
  constructor(...data) {
    super(...data);
    this.__handler = {};
    this.__cb = null;
  }

  __onData(k) {
    var self = this;
    if(self.__handler.hasOwnProperty(k)) {
      return;
    }
    self.__handler[k] = true;
    if(!self.__cb) {
      self.__cb = true;
      setTimeout(function() {
        var keys = Object.keys(self.__handler);
        self.__handler = {};
        self.__cb = null;
        super.__onData(keys);
      }, 1);
    }
  }
}

export default CachedComponent;