define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Obj = function () {
  function Obj(k, cb, single, vBind) {
    _classCallCheck(this, Obj);

    this.k = k;
    this.cb = cb;
    this.single = single;
    this.vBind = vBind;
    this.setV(cb());
  }

  _createClass(Obj, [{
    key: 'setV',
    value: function setV(v) {
      this.v = _util2.default.clone(v);
    }
    // prop为true时作为prop渲染转义，否则为innerHTML转义

  }, {
    key: 'toString',
    value: function toString(prop) {
      // array调用join包括转码
      if (Array.isArray(this.v)) {
        return _util2.default.joinArray(this.v, prop);
      }
      var s = _util2.default.stringify(this.v);
      if (prop) {
        return _util2.default.encodeHtml(s, prop);
      }
      return this.v instanceof _Element2.default ? s : _util2.default.encodeHtml(s);
    }
  }, {
    key: 'toSourceString',
    value: function toSourceString() {
      if (Array.isArray(this.v)) {
        return _util2.default.joinSourceArray(this.v);
      }
      return _util2.default.stringify(this.v);
    }
  }, {
    key: 'update',
    value: function update(ov) {
      var nv = this.cb();
      if (!_util2.default.equal(ov, nv)) {
        this.setV(nv);
        return true;
      }
    }
  }]);

  return Obj;
}();

exports.default = Obj;});