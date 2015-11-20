class Component extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
    this.style = `li{padding:1px}li:hover{padding:2px}`;
    this._data = '';
    this._list = [];
  }
  get list() {
    return this._list;
  }
  set list(v) {
    this._list = v;
  }
  render() {
    return <ul>
      {
        this.list.map(function(item) {
          return <li>{ item }</li>;
        })
      }
    </ul>;
  }
}

var vd = migi.render(
  <Component/>,
  '#test'
);

vd.list = [1];