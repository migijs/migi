import Event from './Event';
import Component from './Component';
import EventBus from './EventBus';
import Stream from './Stream';
import CacheModel from './CacheModel';

class CacheComponent extends Component {
  constructor(...data) {
    super(...data);
    this.__handler = {}; //缓存data key的hash
    this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识
    this.__handler2 = {}; //handler的副本，每次handler被重置为空后保留缓存值
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
      self.__timeout = setTimeout(self.__timecb = function() {
        self.__ccb = false;
        var temp = self.__handler;
        var keys = Object.keys(temp);
        self.__handler = {};
        //赋值更新状态的sid到缓存
        keys.forEach(function(key) {
          var item = temp[key];
          self.__handler2[key] = item.sid || item;
        });
        //可能被清空
        if(keys.length) {
          self.emit(Event.DATA, keys.length > 1 ? keys : keys[0]);
          keys.forEach(function(key) {
            var stream = temp[key];
            //被桥接触发记录的是stream
            if(stream instanceof Stream) {
              var bridge = self.__bridgeHash[key];
              if(bridge) {
                bridge.forEach(function(item) {
                  var target = item.target;
                  var name = item.name;
                  var middleware = item.middleware;
                  if(!stream.has(target.uid)) {
                    stream.add(target.uid);
                    //必须大于桥接对象的sid才生效
                    var tItem = CacheComponent.getSid(target, name);
                    if(stream.sid > tItem) {
                      //先设置桥接对象数据为桥接模式，修改数据后再恢复
                      target.__stream = stream;
                      target[name] = middleware ? middleware.call(self, self[key]) : self[key];
                      target.__stream = null;
                    }
                  }
                });
              }
            }
            else {
              var bridge = self.__bridgeHash[key];
              if(bridge) {
                stream = new Stream(self.uid, temp[key]);
                bridge.forEach(function(item) {
                  var target = item.target;
                  var name = item.name;
                  var middleware = item.middleware;
                  //作为主动发起数据变更方，第一位无需检查重复
                  stream.add(target.uid);
                  if(target instanceof EventBus) {
                    target.emit(Event.DATA, name, middleware ? middleware.call(self, self[key]) : self[key], stream);
                  }
                  else {
                    //必须大于桥接对象的sid才生效
                    var tItem = CacheComponent.getSid(target, name);
                    if(stream.sid > tItem) {
                      //先设置桥接对象数据为桥接模式，修改数据后再恢复
                      target.__stream = stream;
                      target[name] = middleware ? middleware.call(self, self[key]) : self[key];
                      target.__stream = null;
                    }
                  }
                });
              }
            }
          });
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

  static getSid(target, name) {
    if(CacheModel.hasOwnProperty('default')) {
      CacheModel = CacheModel['default'];
    }
    if(target instanceof CacheComponent
      || target instanceof CacheModel) {
      var tItem = target.__handler[name] || target.__handler2[name] || 0;
      return tItem.sid || tItem;
    }
    return 0;
  }
}

export default CacheComponent;
