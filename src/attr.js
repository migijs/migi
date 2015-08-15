import util from './util';

const NUM = 0;
const STR = 1;
const BOOL = 2;

const RENDER_EXIST = 1;
const RENDER_DOM = 2;

const SPECIALS = {
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

const SETS = {
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

export default {
  RENDER_EXIST,
  RENDER_DOM,
  special(name, prop) {
    if(SPECIALS.hasOwnProperty(name)) {
      var o = SPECIALS[name];
      if(o.hasOwnProperty(prop)) {
        return o[prop];
      }
    }
  },
  update(name, element, k, v) {
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
};