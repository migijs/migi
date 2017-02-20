define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model2 = require('./Model');

var _Model3 = _interopRequireDefault(_Model2);

var _CacheComponent = require('./CacheComponent');

var _CacheComponent2 = _interopRequireDefault(_CacheComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CacheModel = function (_Model) {
  _inherits(CacheModel, _Model);

  function CacheModel() {
    _classCallCheck(this, CacheModel);

    var _this = _possibleConstructorReturn(this, (CacheModel.__proto__ || Object.getPrototypeOf(CacheModel)).call(this));

    _this.__handler = {}; //普通状态下缓存data key的hash
    _this.__ccb = false; //缓存1ms再数据分发的是否在缓存时间内的状态标识
    _this.__handler2 = {}; //handler的副本，每次handler被重置为空后保留缓存值
    _this.__timeout;
    _this.__timecb;
    return _this;
  }

  return CacheModel;
}(_Model3.default);

CacheModel.prototype.__data = _CacheComponent2.default.prototype.__data;

exports.default = CacheModel;});