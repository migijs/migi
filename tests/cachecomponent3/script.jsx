class Cache extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
    this.i = 0;
    this.j = 1;
    this.on(migi.Event.DOM, function() {
      for(var i = 0; i < 100000; i++) {
        this.count++;
        this.count2++;
      }
    });
  }
  get count() {
    return this.i;
  }
  set count(v) {
    this.i = v;
  }
  get count2() {
    return this.j;
  }
  set count2(v) {
    this.j = v;
  }
  render() {
    return <p>count: { Math.max(this.count, this.count2) }</p>;
  }
}

var cache = new Cache();
var count = 0;
cache.$inTo('#test');
var __onData = cache.$virtualDom.__onData;
cache.$virtualDom.__onData = function(data) {
  __onData.call(this, data);
  document.querySelector('#test2').innerHTML = ++count;
  document.querySelector('#test3').innerHTML = data;
};