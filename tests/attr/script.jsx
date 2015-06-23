class Test extends migi.Component {
  constructor(...data) {
    super(...data);
    this.style = `
      a[title]{padding:1px}
      a[title="b"]{padding:2px}
      a[title^="abc"]{padding:3px}
      a[title$="bc"]{padding:4px}
      a[title~="bc"]{padding:5px}
      a[title*="gh"]{padding:6px}
      a[title|="bc"]{padding:7px}`;
  }
  render() {
    return <div>
      <a href="#" ref="0">link0</a>
      <a href="#" title="" ref="1">link1</a>
      <a href="#" title="a" ref="2">link2</a>
      <a href="#" title="b" ref="3">link3</a>
      <a href="#" title="abcd" ref="4">link4</a>
      <a href="#" title="abc" ref="5">link5</a>
      <a href="#" title="a bc d" ref="6">link6</a>
      <a href="#" title="bc-a" ref="7">link7</a>
      <a href="#" title="sghj" ref="8">link8</a>
    </div>;
  }
}

migi.render(
  <Test/>,
  '#test'
);