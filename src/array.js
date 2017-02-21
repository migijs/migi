var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
var list = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

for(var i = list.length - 1; i >= 0; i--) {
  var method = list[i];
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
          cb();
        });
      }
      return result;
    }
  });
}

export default arrayMethods;
