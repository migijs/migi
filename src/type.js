function isType(type) {
  return function(obj) {
    return {}.toString.call(obj) == "[object " + type + "]";
  }
}

export var isObject = isType("Object");
export var isString = isType("String");
export var isArray = Array.isArray || isType("Array");
export var isFunction = isType("Function");
export var isUndefined = isType("Undefined");
export var isDom = function(obj) {
  return obj instanceof HTMLElement;
};