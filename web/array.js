define(function(require, exports, module){var arrayProto = Array.prototype;
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
      this.__ob__(result);
      return result;
    }
  });
});

exports["default"]=arrayMethods;
});