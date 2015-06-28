import Event from './Event';
import Component from './Component';
import util from './util';

class CachedComponent extends Component {
  constructor(...data) {
    super(...data);
    this.__handler = {};
    this.__cb = null;
    this.__flag = false;
  }

  __onData(k) {
    var self = this;
    if(self.__flag) {
      super.__onData(k);
      return;
    }
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
        keys = keys.length > 1 ? keys : keys[0];
        super.__onData(keys);
        self.emit(Event.CACHE_DATA, keys);
      }, 1);
    }
  }
  //逻辑和Component复用，代码有点交叉的味道
  //bind{}
  //bridge{}
}

export default CachedComponent;