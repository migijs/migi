class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.style = `span{margin:1px}li{padding:1px}`;
    this._data = '';
    this._list = [];
  }
  get data() {
    return this._data;
  }
  set data(v) {
    this._data = v;
  }
  get list() {
    return this._list;
  }
  set list(v) {
    this._list = v;
  }
  render() {
    return <div>
      <p>{ this.data }</p>
      <ul>
        {
          this.list.map(function(item) {
            if(Array.isArray(item)) {
              return item.map(function(item2) {
                return <li>{ item2 }</li>;
              })
            }
            else {
              return <li>{ item }</li>;
            }
          })
        }
      </ul>
    </div>;
  }
}

var vd = migi.render(
  <Component/>,
  '#test'
);

vd.data = <span>123</span>;
vd.list = [1, 2, [3, 4]];