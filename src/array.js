var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
  var original = arrayProto[method];
  Object.defineProperty(arrayMethods, method, {
    value: function() {
      var i = arguments.length;
      var args = new Array(i);
      while(i--) {
        args[i] = arguments[i];
      }
      var result = original.apply(this, args);
      if(Array.isArray(this.__cb__)) {
        this.__cb__.forEach(function(cb) {
          if(method == 'sort' || method == 'reverse') {
            cb();
          }
          else {
            cb({
              method,
              args,
            });
          }
        });
      }
      return result;
    }
  });
});

export default arrayMethods;
