class Component extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
    this._count = 0;
    this.on(migi.Event.DATA, function(k) {
      if(k == 'txt') {
        this.count++;
      }
    });
  }
  get txt() {
    return this._txt;
  }
  @bind
  set txt(v) {
    this._txt = v;
  }
  get count() {
    return this._count;
  }
  @bind
  set count(v) {
    this._count = v;
  }
  render() {
    return <div>
      <span>{this.txt}</span>
      <strong>{this.count}</strong>
    </div>;
  }
}

var cp = migi.render(
  <Component/>,
  '#test'
);

cp.txt = 0;