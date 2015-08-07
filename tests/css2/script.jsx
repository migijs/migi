var style = `
  div{margin:0px}
  div:hover[a="1"]{margin:1px}
`;

class Test extends migi.Component {
  constructor(...data) {
    super(...data);
    this.style = style;
  }
  render() {
    return (
      <div a="1">123</div>
    );
  }
}

migi.render(
  <Test/>,
  '#test'
);