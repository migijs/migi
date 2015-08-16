import util from './util';

var relations = {};
var hash = {};

function addStream(k1, temp, history) {
  //temp用来记录uid+key只出现在数据流中一次
  //relations防止没有此桥接的对象
  if(temp.hasOwnProperty(k1) || !relations.hasOwnProperty(k1)) {
    return;
  }
  temp[k1] = true;
  //hash则记录uid+key对应的是哪个history源引用
  hash[k1] = history;
  var o = relations[k1];
  Object.keys(o).forEach(function(k2) {
    addStream(k2, temp, history);
  });
}

export default {
  gen(uid, keys) {
    var history = {};
    var temp = {};
    //根据record记录的关系hash，将此次数据流所相关的全部对象的源引用，设置为唯一的一个记录，以此防止闭环
    if(Array.isArray(keys)) {
      keys.forEach(function(key) {
        var k1 = uid + ',' + key;
        history[k1] = true;
        addStream(k1, temp, history);
      });
    }
    else {
      var k1 = uid + ',' + keys;
      history[k1] = true;
      addStream(k1, temp, history);
    }
  },
  //记录a的uid+a的key -> {b的uid+b的key: true}
  record(aid, bid, k1, k2) {
    var ka = aid + ',' + k1;
    var kb = bid + ',' + k2;
    relations[ka] = relations[ka] || {};
    var o = relations[ka];
    if(o.hasOwnProperty(kb)) {
      throw new Error('can not bridge duplicate: ' + a.name + '.' + a.uid + '.' + k1 + ' -> ' + b.name + '.' + b.uid + '.' + k2);
    }
    o[kb] = true;
  },
  pass(obj, key) {
    var k = obj.uid + ',' + key;
    //只被桥接没有桥接别人的话不存在
    if(!hash.hasOwnProperty(k)) {
      return false;
    }
    var history = hash[k];
    var res = history.hasOwnProperty(k);
    history[k] = true;
    return res;
  },
  del(uid) {
    var k = uid + ',';
    Object.keys(relations).forEach(function(k1) {
      if(k1.indexOf(k) == 0) {
        delete relations[k1];
      }
      else {
        var item = relations[k1];
        Object.keys(item).forEach(function(k2) {
          if(k2.indexOf(k) == 0) {
            delete item[k2];
          }
        });
      }
    });
    var k2 = ',' + uid;
    Object.keys(hash).forEach(function(k1) {
      if(k1.indexOf(k) == 0 || k1.indexOf(k2) > 0) {
        delete hash[k1];
      }
    });
  }
};