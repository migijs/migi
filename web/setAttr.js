define(function(require, exports, module){exports["default"]=function(element, k, v) {
  switch(k) {
    case 'value':
    case 'defaultValue':
    case 'tagName':
    case 'nodeName':
    case 'nodeType':
      if(v === null || v === void 0) {
        v = '';
      }
      element[k] = v.toString() || '';
      break;
    case 'selectedIndex':
    case 'size':
    case 'tabIndex':
      v = parseInt(v);
      element[k] = v || 0;
      break;
    case 'checked':
    case 'selected':
    case 'readOnly':
    case 'multiple':
    case 'autofocus':
    case 'disabled':
    case 'async':
      element[k] = v || false;
      break;
    case 'className':
      k = 'class';
    case 'id':
    case 'class':
      if(this.__style) {
        if(v === null || v === void 0) {
          element.removeAttribute('migi-' + k);
        }
        else {
          element.setAttribute('migi-' + k, v);
        }
        break;
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
};});