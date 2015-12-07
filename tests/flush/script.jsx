class Cache extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
    var self = this;
    self.i = 0;
    self.handler = null;
    self.on(migi.Event.DOM, function() {
      for(var j = 0; j < 100000; j++) {
        self.$.count++;
        if(j == 50000) {
          self.flush();
        }
      }
    });
    self.on(migi.Event.DATA, function(k) {
      document.querySelector('#test2').innerHTML = ++count;
    });
  }
  get count() {
    return this.i;
  }
  set count(v) {
    this.i = v;
  }
  render() {
    return <p>count: {this.count}</p>;
  }
}

var cache = new Cache();
var count = 0;
cache.inTo('#test');