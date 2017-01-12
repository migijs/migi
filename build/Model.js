var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("default")?_1["default"]:_1}();

var uid = 0;

!function(){var _2=Object.create(Event.prototype);_2.constructor=Model;Model.prototype=_2}();
  function Model() {
    Event.call(this);
    this.uid = 'm' + uid++;
    this.__name = this.constructor.__migiName;
    this.__ref = []; //以ref为attr的vd快速访问引用
    this.__bridgeHash = {}; //桥接记录
    this.__bindHash = {}; //缩略语法中是否设置过默认值

    this.on(Event.DATA, this.__onData);
  }

  Model.prototype.__onData = function(k, caller) {
    k = 'model.' + k;
    this.__ref.forEach(function(cp) {
      //set触发数据变更时，若已DOM则打开开关
      if(cp.dom) {
        cp.__canData = true;
      }
      cp.emit(Event.DATA, k, caller);
    });
  }

  Model.prototype.__add = function(cp) {
    if(this.__ref.indexOf(cp) == -1) {
      this.__ref.push(cp);
    }
  }
  Model.prototype.__del = function(cp) {
    var i = this.__ref.indexOf(cp);
    if(i > -1) {
      this.__ref.splice(i, 1);
    }
  }

  var _3={};_3.name={};_3.name.get =function() {
    return this.__name;
  }
Object.keys(_3).forEach(function(k){Object.defineProperty(Model.prototype,k,_3[k])});Object.keys(Event).forEach(function(k){Model[k]=Event[k]});

//完全一样的桥接数据流方法，复用
['__data', '__record', 'bridge', 'bridgeTo', '__unRecord', 'unBridge', 'unBridgeTo', '__initBind', '__getBind', '__setBind', '__array'].forEach(function(k) {
  Model.prototype[k] = Component.prototype[k];
});

exports["default"]=Model;
