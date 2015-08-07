class NV extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
  }
}
class NV2 extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
  }
}

class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    var nv = this.findChild(NV);
    nv.on(migi.Event.DOM, function(fake) {
      var div = document.createElement('div');
      div.id = 'fake1';
      div.innerHTML = fake;
      document.body.appendChild(div);
    });
    var nv2 = nv.findChild(NV2);
    nv2.on(migi.Event.DOM, function(fake) {
      var div = document.createElement('div');
      div.id = 'fake2';
      div.innerHTML = fake;
      document.body.appendChild(div);
    });
    var span = nv2.findChild('span');
    span.on(migi.Event.DOM, function(fake) {
      var div = document.createElement('div');
      div.id = 'fake3';
      div.innerHTML = fake;
      document.body.appendChild(div);
    });
  }
  render() {
    return <div>1</div>
  }
}

migi.render(
  <Component>
    <NV>
      <NV2>
        <span></span>
      </NV2>
    </NV>
  </Component>,
  '#test'
);