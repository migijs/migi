class NV extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function(fake) {
      this.emit('dom', fake);
    });
  }
}

class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.$findChild(NV).on('dom', function(fake) {
      var div = document.createElement('div');
      div.id = 'fake1';
      div.innerHTML = fake;
      document.body.appendChild(div);
    });
  }
}

migi.render(
  <Component>
    <NV/>
  </Component>,
  '#test'
);

class Component2 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.$findChild(NV).on('dom', function(fake) {
      var div = document.createElement('div');
      div.id = 'fake2';
      div.innerHTML = fake;
      document.body.appendChild(div);
    });
  }
  render() {
    return <div></div>;
  }
}

migi.render(
  <Component2>
    <NV/>
  </Component2>,
  '#test2'
);