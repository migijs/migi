class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list = this.props.list;
  }
  get list() {
    return this._list || [];
  }
  set list(v) {
    this._list = v;
  }
  render() {
    return (
      <div>{this.list}</div>
    );
  }
}

var data = <Component list={[<p>1</p>]}/>;

var cp = <Component list={data}/>;

cp.appendTo('#test');

cp.list = <List list={[<p>3</p>, <p>2</p>]}/>;