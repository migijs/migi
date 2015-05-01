define(function(require, exports, module){function isType(type) {
  return function(obj) {
    return {}.toString.call(obj) == "[object " + type + "]";
  }
}

var isObject;exports.isObject=isObject = isType("Object");
var isString;exports.isString=isString = isType("String");
var isArray;exports.isArray=isArray = Array.isArray || isType("Array");
var isFunction;exports.isFunction=isFunction = isType("Function");
var isUndefined;exports.isUndefined=isUndefined = isType("Undefined");
var isDom;exports.isDom=isDom = function(obj) {
  return obj instanceof HTMLElement;
};});