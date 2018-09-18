class HelloMessage extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <h1 a="1" b="2">Hello {this.props.name}, this is {this.__name}</h1>;
  }
}

migi.render(
  <HelloMessage name="migi"/>,
  '#test'
);

class HelloMessage2 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
}

migi.render(
  <HelloMessage2>
    <p>from a child</p>
  </HelloMessage2>,
  '#test2'
);