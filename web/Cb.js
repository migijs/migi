define(function(require, exports, module){
  function Cb(context, cb) {
    this.context = context;
    this.cb = cb;
  }


exports["default"]=Cb;
});