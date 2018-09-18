define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NUM = 0;
var STR = 1;
var BOOL = 2;

var RENDER_EXIST = 1; // 只有存在时才渲染输出
var RENDER_DOM = 2; // 需要在domready后设置

var SPECIALS = {
  button: {
    disabled: RENDER_EXIST
  },
  input: {
    autofocus: RENDER_EXIST,
    checked: RENDER_EXIST,
    defaultChecked: RENDER_DOM,
    defaultchecked: RENDER_DOM,
    defaultValue: RENDER_DOM,
    defaultvalue: RENDER_DOM,
    disabled: RENDER_EXIST,
    multiple: RENDER_EXIST,
    readOnly: RENDER_EXIST,
    readonly: RENDER_EXIST,
    required: RENDER_EXIST
  },
  link: {
    disabled: RENDER_EXIST
  },
  option: {
    defaultSelected: RENDER_DOM,
    defaultselected: RENDER_DOM,
    disabled: RENDER_EXIST,
    selected: RENDER_EXIST,
    text: RENDER_DOM
  },
  select: {
    autofocus: RENDER_EXIST,
    disabled: RENDER_EXIST,
    multiple: RENDER_EXIST,
    selectedIndex: RENDER_DOM,
    selectedindex: RENDER_DOM
  },
  textarea: {
    autofocus: RENDER_EXIST,
    defaultValue: RENDER_DOM,
    defaultvalue: RENDER_DOM,
    disabled: RENDER_EXIST,
    readOnly: RENDER_EXIST,
    readonly: RENDER_EXIST
  },
  audio: {
    autoplay: RENDER_EXIST,
    controls: RENDER_EXIST,
    loop: RENDER_EXIST,
    muted: RENDER_EXIST
  },
  video: {
    autoplay: RENDER_EXIST,
    controls: RENDER_EXIST,
    loop: RENDER_EXIST,
    muted: RENDER_EXIST
  }
};

var SETS = {
  button: {
    disabled: BOOL
  },
  input: {
    autofocus: BOOL,
    checked: BOOL,
    defaultChecked: BOOL,
    defaultchecked: BOOL,
    defaultValue: STR,
    defaultvalue: STR,
    disabled: BOOL,
    readOnly: BOOL,
    readonly: BOOL,
    required: BOOL,
    value: STR
  },
  link: {
    checked: BOOL
  },
  option: {
    defaultSelected: BOOL,
    defaultselected: BOOL,
    disabled: BOOL,
    selected: BOOL,
    text: STR
  },
  select: {
    autofocus: BOOL,
    disabled: BOOL,
    required: BOOL,
    selectedIndex: NUM,
    selectedindex: NUM,
    value: STR
  },
  textarea: {
    autofocus: BOOL,
    defaultValue: STR,
    defaultvalue: STR,
    disabled: BOOL,
    readOnly: BOOL,
    readonly: BOOL,
    required: BOOL,
    value: STR
  },
  audio: {
    autoplay: BOOL,
    controls: BOOL,
    loop: BOOL,
    muted: BOOL
  },
  video: {
    autoplay: BOOL,
    controls: BOOL,
    loop: BOOL,
    muted: BOOL
  }
};

var lowerCase = {
  defaultchecked: 'defaultChecked',
  defaultselected: 'defaultSelected',
  defaultvalue: 'defautlValue',
  readonly: 'readOnly',
  selectindex: 'selectIndex'
};

exports.default = {
  RENDER_EXIST: RENDER_EXIST,
  RENDER_DOM: RENDER_DOM,
  special: function special(name, prop) {
    if (SPECIALS.hasOwnProperty(name)) {
      var o = SPECIALS[name];
      if (o.hasOwnProperty(prop)) {
        return o[prop];
      }
    }
  },
  update: function update(name, element, k, v, jaw) {
    // 特殊对待的prop，用js赋值
    if (SETS.hasOwnProperty(name)) {
      var o = SETS[name];
      if (o.hasOwnProperty(k)) {
        o = o[k];
        k = lowerCase[k] || k;
        switch (o) {
          case NUM:
            v = parseInt(v);
            element[k] = v || 0;
            break;
          case STR:
            v = _util2.default.stringify(v);
            element[k] = v;
            break;
          case BOOL:
            v = !!v;
            element[k] = v;
            break;
        }
        return;
      }
    }
    // 普通的setAttribute
    switch (k) {
      case 'className':
        k = 'class';
        break;
      case 'htmlFor':
        k = 'for';
        break;
    }
    // jaw导入style时改写migi-前缀
    if (jaw) {
      switch (k) {
        case 'id':
        case 'class':
          k = 'migi-' + k;
          break;
      }
    }
    if (v === null || v === undefined) {
      element.removeAttribute(k);
    } else if (k == 'id') {
      element[k] = v;
    } else if (k == 'class') {
      element.className = v;
    } else {
      element.setAttribute(k, v);
    }
  }
};});