var sid = 1;

class Stream {
  constructor(cid, iid) {
    this.sid = iid === undefined ? sid++ : iid;
    this.hash = {};
    this.hash[cid] = true;
  }
  add(k) {
    this.hash[k] = true;
  }
  has(k) {
    return this.hash.hasOwnProperty(k);
  }

  static now() {
    return sid;
  }
  static gen() {
    return sid++;
  }
}

export default Stream;
