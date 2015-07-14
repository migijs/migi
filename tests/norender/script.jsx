var count = 0;

class NV extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function(fake) {
      if(!fake) {
        count++;
        var div = document.querySelector('record');
        if(!div) {
          div = document.createElement('div');
          div.id = 'record';
          document.body.appendChild(div);
        }
        div.innerHTML = count;
      }
    });
  }
}
class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
}

class NV2 extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function(fake) {
      if(!fake) {
        count++;
        var div = document.querySelector('record2');
        if(!div) {
          div = document.createElement('div');
          div.id = 'record2';
          document.body.appendChild(div);
        }
        div.innerHTML = count;
      }
    });
  }
}
class Component2 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div/>;
  }
}

migi.render(
  <Component>
    <NV/>
  </Component>,
  '#test'
);

migi.render(
  <Component2>
    <NV2/>
  </Component2>,
  '#test2'
);