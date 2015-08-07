const PROTECT = {
  constructor: true
};

export default {
  //不包括原型链mix
  s(target, ...data) {
    data.forEach(function(item) {
      util.pmix(target, item, true);
    });
    return target;
  },
  //包括原型链mix
  p(target, data, noProto) {
    for(var i in data) {
      if(!PROTECT.hasOwnProperty(i)) {
        if(!noProto || data.hasOwnProperty(i)) {
          target[i] = data[i];
        }
      }
    }
    return target;
  }
};