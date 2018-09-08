class Component extends migi.Component {
  constructor(data) {
    super(data);
  }
  render() {
    return <p>{ this.props.a }</p>;
  }
}

migi.render(
  <Component a="a"/>,
  '#test'
);