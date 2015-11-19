class Test extends migi.Component {
  constructor(...data) {
    super(...data);
    this.style = `.a.b{margin:1px}.b.c{padding:2px}.a.c{width:100px}.a.b.c{height:200px}`;
  }
  render() {
    return <div class="a b c">123</div>;
  }
}

migi.render(
  <Test/>,
  '#test'
);