define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event2 = require('./Event');

var _Event3 = _interopRequireDefault(_Event2);

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var uid = 0;

var Model = function (_Event) {
  _inherits(Model, _Event);

  function Model() {
    _classCallCheck(this, Model);

    var _this = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this));

    _this.__uid = 'm' + uid++;
    _this.__name = _this.constructor.__migiName;
    _this.__ref = []; //以ref为attr的vd快速访问引用
    _this.__bridgeHash = {}; //桥接记录
    _this.__bindHash = {}; //缩略语法中是否设置过默认值
    _this.__ob = []; //被array们的__ob__引用
    return _this;
  }

  _createClass(Model, [{
    key: '__onData',
    value: function __onData(k) {
      k = 'model.' + k;
      this.__ref.forEach(function (cp) {
        //set触发数据变更时，若已DOM则打开开关
        if (cp.dom) {
          cp.__canData = true;
        }
        cp.__onData(k);
      });
    }
  }, {
    key: '__add',
    value: function __add(cp) {
      if (this.__ref.indexOf(cp) == -1) {
        this.__ref.push(cp);
      }
    }
  }, {
    key: '__del',
    value: function __del(cp) {
      var i = this.__ref.indexOf(cp);
      if (i > -1) {
        this.__ref.splice(i, 1);
      }
    }
  }, {
    key: 'name',
    get: function get() {
      return this.__name;
    }
  }]);

  return Model;
}(_Event3.default);

//完全一样的桥接数据流方法，复用


['__data', '__record', 'bridge', 'bridgeTo', '__unRecord', 'unBridge', 'unBridgeTo', '__initBind', '__getBind', '__setBind', '__array'].forEach(function (k) {
  Model.prototype[k] = _Component2.default.prototype[k];
});

exports.default = Model;});