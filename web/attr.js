define(function(require, exports, module){var util=function(){var _0=require('./util');return _0.hasOwnProperty("default")?_0["default"]:_0}();

var NUM = 0;
var STR = 1;
var BOOL = 2;

var RENDER_EXIST = 1;
var RENDER_DOM = 2;

var SPECIALS = {
  button: {
    disabled: RENDER_EXIST
  },
  input: {
    autofocus: RENDER_EXIST,
    checked: RENDER_EXIST,
    defaultValue: RENDER_DOM,
    disabled: RENDER_EXIST,
    multiple: RENDER_EXIST,
    readOnly: RENDER_EXIST,
    required: RENDER_EXIST
  },
  link: {
    disabled: RENDER_EXIST
  },
  option: {
    disabled: RENDER_EXIST,
    selected: RENDER_EXIST,
    text: RENDER_DOM
  },
  select: {
    autofocus: RENDER_EXIST,
    disabled: RENDER_EXIST,
    multiple: RENDER_EXIST,
    selectedIndex: RENDER_DOM
  },
  textarea: {
    autofocus: RENDER_EXIST,
    disabled: RENDER_EXIST,
    readOnly: RENDER_EXIST
  }
};

var SETS = {
  button: {
    disabled: BOOL
  },
  input: {
    autofocus: BOOL,
    checked: BOOL,
    defaultValue: STR,
    disabled: BOOL,
    readOnly: BOOL,
    required: BOOL,
    value: STR
  },
  link: {
    checked: BOOL
  },
  option: {
    disabled: BOOL,
    selected: BOOL,
    text: STR
  },
  select: {
    autofocus: BOOL,
    disabled: BOOL,
    required: BOOL,
    selectedIndex: NUM,
    value: STR
  },
  textarea: {
    autofocus: BOOL,
    disabled: BOOL,
    readOnly: BOOL,
    required: BOOL,
    value: STR
  }
};

exports["default"]={
  RENDER_EXIST:RENDER_EXIST,
  RENDER_DOM:RENDER_DOM,
  special:function(name, prop) {
    if(SPECIALS.hasOwnProperty(name)) {
      var o = SPECIALS[name];
      if(o.hasOwnProperty(prop)) {
        return o[prop];
      }
    }
  },
  update:function(name, element, k, v) {
    //特殊对待的prop，用js赋值
    if(SETS.hasOwnProperty(name)) {
      var o = SETS[name];
      if(o.hasOwnProperty(k)) {
        o = o[k];
        switch(o) {
          case NUM:
            v = parseInt(v);
            element[k] = v || 0;
            break;
          case STR:
            v = util.stringify(v);
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
    //普通的setAttribute
    switch(k) {
      case 'className':
        k = 'class';
      case 'id':
      case 'class':
        //jaw导入style时改写migi-前缀
        if(this.__style) {
          k = 'migi-' + k;
        }
      default:
        if(v === null || v === void 0) {
          element.removeAttribute(k);
        }
        else {
          element.setAttribute(k, v);
        }
        break;
    }
  }
};});