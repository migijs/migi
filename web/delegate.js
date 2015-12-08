define(function(require, exports, module){var sort=function(){var _0=require('./sort');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var hash=function(){var _1=require('./hash');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var matchUtil=function(){var _2=require('./matchUtil');return _2.hasOwnProperty("default")?_2["default"]:_2}();

function delegate(e, item, top) {
  var elem = e.target;
  var vd = hash.get(elem.getAttribute('migi-uid'));
  var names = [];
  var classes = [];
  var ids = [];console.log(vd.parent, top);
  while(vd.parent && vd.parent != top) {
    console.log(vd);
    vd = vd.parent;
  }
}

function push(vd, names, classes, ids) {
  names.push(vd.name);
  classes.push(matchUtil.splitClass(vd.__cache['class']));
}

exports["default"]=delegate;});