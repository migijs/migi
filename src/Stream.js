var sid = 0;

class Stream {
  constructor(cid) {
    this.sid = sid++;
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