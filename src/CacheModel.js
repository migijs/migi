import Model from './Model';
import CacheComponent from './CacheComponent';

class CacheModel extends Model {
  constructor() {
    super();
    this.__handler = {}; //普通状态下缓存data key的hash
    this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识
    this.__timeout;
    this.__timecb;
  }
}

CacheModel.prototype.__data = CacheComponent.prototype.__data;

export default CacheModel;
