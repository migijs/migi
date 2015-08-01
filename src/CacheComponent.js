import Event from './Event';
import Component from './Component';
import util from './util';
import browser from './browser';

class CachedComponent extends Component {
  constructor(...data) {
    super(...data);
    this.__handler = {};
    this.__bridgeHandler = {};
    this.__ccb = null;
    this.__bcb = null;
    this.__flag = false;

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiCC = true;
      return this.__hackLie(CachedComponent);
    }
  }

  //@overwrite
  __onData(k) {
    var self = this;
    if(self.__flag) {
      self.__bridgeData(k);
      return;
    }
    if(self.__handler.hasOwnProperty(k)) {
      return;
    }
    self.__handler[k] = true;
    if(!self.__ccb) {
      self.__ccb = true;
      setTimeout(function() {
        var keys = Object.keys(self.__handler);
        self.__handler = {};
        self.__ccb = null;
        keys = keys.length > 1 ? keys : keys[0];
        super.__onData(keys);
        self.emit(Event.CACHE_DATA, keys);
      }, 1);
    }
  }
  __bridgeData(k) {
    var self = this;
    if(self.__bridgeHandler.hasOwnProperty(k)) {
      return;
    }
    self.__bridgeHandler[k] = true;
    if(!self.__bcb) {
      self.__bcb = true;
      setTimeout(function() {
        var keys = Object.keys(self.__bridgeHandler);
        self.__handler = {};
        self.__bcb = null;
        keys = keys.length > 1 ? keys : keys[0];
        super.__onData(keys);
      }, 1);
    }
  }

  //逻辑和Component复用，代码有点交叉的味道
  //bind{}
  //bridge{}
}

export default CachedComponent;