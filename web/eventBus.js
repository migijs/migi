define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();

var eventBus = new Event();
eventBus.uid = -1;

exports["default"]=eventBus;});