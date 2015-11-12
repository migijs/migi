import Event from './Event';
import Component from './Component';
import util from './util';
import browser from './browser';
import Stream from './Stream';

class CachedComponent extends Component {
  constructor(...data) {
    super(...data);
    this.__handler = {}; //普通状态下缓存data key的hash
    this.__bridgeHandler = {}; //flag为true时的hash
    this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识
    this.__bcb = false; //flag为true时的缓存时间内状态标识
    this.__flag = false; //被数据流桥接的数据分发到时，标识true，不走普通逻辑，进入另外一个缓存时间逻辑

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiCC = true;
      return this.__hackLie(CachedComponent);
    }
  }

  //@overwrite
  __data(k) {
    var self = this;
    //没有缓存根据是否桥接模式赋予stream对象或生成sid
    if(!self.__handler.hasOwnProperty(k)) {
      self.__handler[k] = self.__stream || Stream.gen();
    }
    else {
      var item = self.__handler[k];
      //新stream的sid必须大于老stream的sid或sid才能覆盖
      if(self.__stream) {
        if(item instanceof Stream) {
          if(item.sid < self.__stream.sid) {
            self.__handler[k] = self.__stream;
          }
        }
        else if(item < self.__stream.sid) {
          self.__handler[k] = self.__stream;
        }
      }
      //非stream触发更新即主动数据更新
      //当缓存是bridge时，Stream当前的sid>=缓存的sid即说明是发生在bridge之后的
      else {
        var now = Stream.now();
        if(item instanceof Stream) {
          if(item.sid <= now) {
            self.__handler[k] = now;
          }
        }
        else if(item < now) {
          self.__handler[k] = now;
        }
      }
    }
    if(!self.__ccb) {
      self.__ccb = true;
      //1ms后触发数据变更并重设状态
      setTimeout(function() {
        var keys = Object.keys(self.__handler);
        //可能被清空
        if(keys.length) {
          self.emit(Event.DATA, keys.length > 1 ? keys : keys[0]);
          keys.forEach(function(key) {
            var stream = self.__handler[key];
            if(stream instanceof Stream) {
              //被桥接触发记录的是stream
              Object.keys(self.__bridgeHash).forEach(function(k) {
                var arr = self.__bridgeHash[k];
                arr.forEach(function(item) {
                  var target = item.target;
                  var name = item.name;
                  var middleware = item.middleware;
                  if(!stream.has(target.uid)) {
                    stream.add(target.uid);
                    //先设置桥接对象数据为桥接模式，修改数据后再恢复
                    target.__stream = stream;
                    target[name] = middleware ? middleware.call(self, self[k]) : self[k];
                    target.__stream = null;
                  }
                });
              });
            }
          });
        }
        self.__ccb = false;
        self.__handler = {};
      }, 1);
    }
  }
  //@overwrite
  //__onData(k, caller) {
  //  var self = this;
  //  if(self.__flag) {
  //    self.__bridgeData(k);
  //    return;
  //  }
  //  //被桥接的数据缓存作废
  //  delete self.__bridgeHandler[k];
  //  if(self.__handler.hasOwnProperty(k)) {
  //    return;
  //  }
  //  self.__handler[k] = true;
  //  if(!self.__ccb) {
  //    self.__ccb = true;
  //    setTimeout(function() {
  //      var keys = Object.keys(self.__handler);
  //      self.__handler = {};
  //      self.__ccb = false;
  //      //可能被清空
  //      if(!keys.length) {
  //        return;
  //      }
  //      keys = keys.length > 1 ? keys : keys[0];
  //      super.__onData(keys);
  //      self.emit(Event.CACHE_DATA, keys, caller);
  //    }, 1);
  //  }
  //}
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
        //fake来源，来自于桥接bridge
        self.emit(Event.CACHE_DATA, keys, self.__brcb);
      }, 1);
    }
  }

  //逻辑和Component复用，代码有点交叉的味道
  //bind{}
  //bridge{}
}

export default CachedComponent;