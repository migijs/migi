class Test extends migi.Component {
  constructor(...data) {
    super(...data);
    this.style = `a:hover{margin:1px}a:hover span{margin:2px}a:active{margin:3px}a:active span{margin:4px}`;
  }
  render() {
    return <div>
        <a href="#">123</a>
        <a href="#"><span>456</span></a>
      </div>;
  }
}

migi.render(
  <Test/>,
  '#test'
);