import Event from './Event';
import Component from './Component';

var uid = 0;

class Model extends Event {
  constructor() {
    super();
    this.__uid = 'm' + uid++;
    this.__name = this.constructor.__migiName;
    this.__ref = []; //以ref为attr的vd快速访问引用
    this.__bridgeHash = {}; //桥接记录
    this.__bindHash = {}; //缩略语法中是否设置过默认值
    this.__ob = []; //被array们的__ob__引用
  }

  __onData(k) {
    k = 'model.' + k;
    this.__ref.forEach(function(cp) {
      //set触发数据变更时，若已DOM则打开开关
      if(cp.dom) {
        cp.__canData = true;
      }
      cp.__onData(k);
    });
  }

  __add(cp) {
    if(this.__ref.indexOf(cp) == -1) {
      this.__ref.push(cp);
    }
  }
  __del(cp) {
    var i = this.__ref.indexOf(cp);
    if(i > -1) {
      this.__ref.splice(i, 1);
    }
  }

  get name() {
    return this.__name;
  }
}

//完全一样的桥接数据流方法，复用
['__data', '__record', 'bridge', 'bridgeTo', '__unRecord', 'unBridge', 'unBridgeTo', '__initBind', '__getBind', '__setBind', '__array'].forEach(function(k) {
  Model.prototype[k] = Component.prototype[k];
});

export default Model;
