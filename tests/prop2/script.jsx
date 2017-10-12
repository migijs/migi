var udf;

class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind a = [1,2]
  render() {
    return <div>{ this.a }</div>;
  }
}

class Inner extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <span>{ this.props.a }</span>;
  }
}

migi.render(
  <Component/>,
  '#test'
);