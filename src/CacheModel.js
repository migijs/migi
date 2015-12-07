import Model from './Model';
import browser from './browser';
import CacheComponent from './CacheComponent';

class CacheModel extends Model {
  constructor() {
    super();
    this.__handler = {}; //普通状态下缓存data key的hash
    this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识
    this.__handler2 = {}; //handler的副本，每次handler被重置为空后保留缓存值
    this.__timeout;
    this.__timecb;

    //ie8的对象识别hack
    if(browser.lie) {
      return this.__hackLie(CacheModel);
    }
  }
}

CacheModel.prototype.__data = CacheComponent.prototype.__data;

export default CacheModel;