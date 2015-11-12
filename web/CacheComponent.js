define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var util=function(){var _2=require('./util');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var browser=function(){var _3=require('./browser');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var EventBus=function(){var _4=require('./EventBus');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var Stream=function(){var _5=require('./Stream');return _5.hasOwnProperty("default")?_5["default"]:_5}();

!function(){var _6=Object.create(Component.prototype);_6.constructor=CachedComponent;CachedComponent.prototype=_6}();
  function CachedComponent(data) {
    data=[].slice.call(arguments, 0);Component.apply(this,[].concat(Array.from(data)));
    this.__handler = {}; //普通状态下缓存data key的hash
    this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiCC = true;
      return this.__hackLie(CachedComponent);
    }
  }

  //@overwrite
  CachedComponent.prototype.__data = function(k) {
    var _7=this;var self = this;
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
        self.__ccb = false;
        var temp = self.__handler;
        var keys = Object.keys(temp);
        self.__handler = {};
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
                    //先设置桥接对象数据为桥接模式，修改数据后再恢复
                    target.__stream = stream;
                    target[name] = middleware ? middleware.call(self, self[k]) : self[k];
                    target.__stream = null;
                  }
                });
              }
            }
            else {
              var bridge = self.__bridgeHash[key];
              if(bridge) {
                stream = new Stream(self.uid);
                bridge.forEach(function(item) {
                  var target = item.target;
                  var name = item.name;
                  var middleware = item.middleware;
                  //作为主动发起数据变更方，第一位无需检查重复
                  stream.add(target.uid);
                  if(target instanceof EventBus) {
                    target.emit(Event.DATA, name, middleware ? middleware.call(self, self[k]) : self[k], stream);
                  }
                  //先设置桥接对象数据为桥接模式，修改数据后再恢复
                  else {
                    target.__stream = stream;
                    target[name] = middleware ? middleware.call(self, self[k]) : self[k];
                    target.__stream = null;
                  }
                });
              }
            }
          });
        }
      }, 1);
    }
  }
Object.keys(Component).forEach(function(k){CachedComponent[k]=Component[k]});

exports["default"]=CachedComponent;});