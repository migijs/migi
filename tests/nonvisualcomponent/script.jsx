class NV extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
  }
  request() {
    this.emit('success', {name:'migi'});
  }
}
class MyComponent extends migi.Component {
  constructor(...data) {
    super(...data);
    var self = this;
    self._text = '';
    self.findChild('NV').on('success', function(data) {
      self.txt = data.name;
    }).request();
  }
  get txt() {
    return this._text;
  }
  set txt(v) {
    this._text = v;
  }
  render() {
    return <p>Hi, I am {this.txt}</p>;
  }
}

migi.render(
  <MyComponent>
    <NV/>
  </MyComponent>,
  '#test'
);