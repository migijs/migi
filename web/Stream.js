define(function(require, exports, module){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sid = 1;

var Stream = function () {
  function Stream(cid, iid) {
    _classCallCheck(this, Stream);

    this.sid = iid === undefined ? sid++ : iid;
    this.hash = {};
    this.hash[cid] = true;
  }

  _createClass(Stream, [{
    key: "add",
    value: function add(k) {
      this.hash[k] = true;
    }
  }, {
    key: "has",
    value: function has(k) {
      return this.hash.hasOwnProperty(k);
    }
  }], [{
    key: "now",
    value: function now() {
      return sid;
    }
  }, {
    key: "gen",
    value: function gen() {
      return sid++;
    }
  }]);

  return Stream;
}();

exports.default = Stream;});