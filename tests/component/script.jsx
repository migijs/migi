class HelloMessage extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <h1 a="1" b="2">Hello {this.props.name}, this is {this.name}</h1>;
  }
}

migi.render(
  <HelloMessage name="migi"/>,
  '#test'
);