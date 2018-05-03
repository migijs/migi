import Event from './Event';
import Component from './Component';

class CacheComponent extends Component {
  constructor(...data) {
    super(...data);
    this.__handler = {}; //缓存data key的hash
    this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识
    this.__timeout;
    this.__timecb;
  }

  //@overwrite
  __data(k) {
    var self = this;
    //set触发数据变更时，若已DOM则打开开关
    if(self.dom) {
      self.__canData = true;
    }
    
    if(!Array.isArray(k)) {
      k = [k];
    }
    //没有缓存根据是否桥接模式赋予stream对象或生成sid
    k.forEach(function(k) {
      self.__handler[k] = true;
    });
    if(!self.__ccb) {
      self.__ccb = true;
      //1ms后触发数据变更并重设状态
      self.__timeout = setTimeout(self.__timecb = function() {
        self.__ccb = false;
        var temp = self.__handler;
        var keys = Object.keys(temp);
        self.__handler = {};
        //可能被清空
        if(keys.length) {
          self.__onData(keys);
          self.emit(Event.DATA, keys.length > 1 ? keys : keys[0]);
        }
      }, 0);
    }
  }
  flush() {
    if(this.__timeout) {
      clearTimeout(this.__timeout);
      this.__ccb = false;
      this.__timecb();
    }
  }
}

export default CacheComponent;
