define(function(require, exports, module){var sid = 1;


  function Stream(cid, iid) {
    this.sid = iid === undefined ? sid++ : iid;
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