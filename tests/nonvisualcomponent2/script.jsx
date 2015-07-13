class NV extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
  }
}
class MyComponent extends migi.Component {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      this.$element.querySelector('p').innerHTML = this.$element.childNodes.length;
    });
  }
  render() {
    return <div>
      <NV/>
      <p></p>
    </div>;
  }
}

migi.render(
  <MyComponent/>,
  '#test'
);