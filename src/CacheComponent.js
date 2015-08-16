import Event from './Event';
import Component from './Component';
import util from './util';
import browser from './browser';

class CachedComponent extends Component {
  constructor(...data) {
    super(...data);
    this.__handler = {}; //普通状态下缓存data key的hash
    this.__bridgeHandler = {}; //flag为true时的hash
    this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识
    this.__bcb = false; //flag为true时的缓存时间内状态标识
    this.__flag = false; //被数据流桥接的数据分发到时，标识true，不走普通逻辑，进入另外一个缓存时间逻辑
    this.__stream = {}; //存储数据流中一个key对应的流sid

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
    //被桥接的数据缓存作废
    delete self.__bridgeHandler[k];
    if(self.__handler.hasOwnProperty(k)) {
      return;
    }
    self.__handler[k] = true;
    if(!self.__ccb) {
      self.__ccb = true;
      setTimeout(function() {
        var keys = Object.keys(self.__handler);
        self.__handler = {};
        self.__ccb = false;
        //可能被清空
        if(!keys.length) {
          return;
        }
        keys = keys.length > 1 ? keys : keys[0];
        super.__onData(keys);
        self.emit(Event.CACHE_DATA, keys);
      }, 1);
    }
  }
  __bridgeData(k) {
    var self = this;
    //之前非桥接的数据缓存作废
    delete self.__handler[k];
    if(self.__bridgeHandler.hasOwnProperty(k)) {
      return;
    }
    self.__bridgeHandler[k] = true;
    if(!self.__bcb) {
      self.__bcb = true;
      setTimeout(function() {
        var keys = Object.keys(self.__bridgeHandler);
        self.__bcb = false;
        //可能被清空
        if(!keys.length) {
          return;
        }
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