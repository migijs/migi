class Cache extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
  }
  get cname() {
    return this._cname;
  }
  set cname(v) {
    this._cname = v;
  }
  get text() {
    return this._text;
  }
  set text(v) {
    this._text = v;
  }
  render() {
    return <p class={this.cname}>{this.text}</p>;
  }
}

var cache = new Cache();
cache.inTo('#test');
cache.cname = 'a';
cache.text = 'b';