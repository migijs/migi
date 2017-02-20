define(function(require, exports, module){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cb = function Cb(context, cb) {
  _classCallCheck(this, Cb);

  this.context = context;
  this.cb = cb;
};

exports.default = Cb;});