define(function(require, exports, module){var PROTECT = {
  constructor: true,
  style: true
};

var REFS = {
  $: true,
  $$: true,
  model: true,
  style: true
};

var mix = {
  //__migiGS使用的混入
  gs:function(target, data) {
    data=[].slice.call(arguments, 1);data.forEach(function(item) {
      if(item) {
        Object.keys(item).forEach(function(k) {
          target[k] = item[k];
        });
      }
    });
    return target;
  },
  //lie返回的dom对象包裹
  ref:function(target, dom, gs) {
    for(var i in target) {
      if(target.hasOwnProperty(i) && !REFS.hasOwnProperty(i)) {
        !function(k) {
          gs[k] = {
            get: function() {
              return target[k];
            },
            set: function(v) {
              target[k] = v;
            }
          };
        }(i);
      }
      else if(!PROTECT.hasOwnProperty(i)) {
        dom[i] = target[i];
      }
    }
    gs.constructor = {
      get: function() {
        return target.constructor;
      }
    };
    return target;
  }
};

exports["default"]=mix;});