define(function(require, exports, module){var sid = 0;


  function Stream(cid) {
    this.sid = sid++;
    this.hash = {};
    this.hash[cid] = true;
  }
  Stream.prototype.add = function(k) {
    this.hash[k] = true;
  }
  Stream.prototype.has = function(k) {
    return this.hash.hasOwnProperty(k);
  }

  Stream.now=function() {
    return sid;
  }
  Stream.gen=function() {
    return sid++;
  }


exports["default"]=Stream;});