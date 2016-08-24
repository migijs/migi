class Cache extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
    this.count = 0;
    this.a = [1];
    this.a = [1];
    this.a = [1];
  }
  get a() {
    return this._a || [];
  }
  set a(v) {
    this._a = v;
  }
  click() {
    this.a = [3];
    this.a = [3];
  }
  render() {
    return <div>
      <span onClick={ this.click }>click</span>
      <p>
      {
        this.a.map(function(item) {
          document.querySelector('#test2').innerHTML = ++this.count;
          return item;
        }.bind(this))
      }
      </p>
    </div>;
  }
}

var cache = new Cache();
cache.inTo('#test');
