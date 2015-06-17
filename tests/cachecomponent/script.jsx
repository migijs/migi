class Cache extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
    var self = this;
    self.i = 0;
    self.on(migi.Event.DOM, function() {
      for(var j = 0; j < 100000; j++) {
        self.count++;
      }
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
cache.virtualDom.on(migi.Event.DATA, function() {
  document.querySelector('#test2').innerHTML = ++count;
});