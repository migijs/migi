class Cache extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
    this.i = 0;
    this.on(migi.Event.DOM, function() {
      for(var i = 0; i < 100000; i++) {
        this.count++;
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
var __onData = cache.virtualDom.__onData;
cache.virtualDom.__onData = function(data) {
  __onData.call(this, data);
  document.querySelector('#test2').innerHTML = ++count;
};