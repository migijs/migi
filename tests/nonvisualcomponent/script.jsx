class NV extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
    var self = this;
    self.on(migi.Event.DOM, function() {
      self.emit('success', {name:'migi'});
    });
  }
  request() {
    var self = this;
    var url = self.props.url;
    $.getJSON(url, function(data) {
      self.emit('success', data);
    });
  }
}
class MyComponent extends migi.Component {
  constructor(...data) {
    super(...data);
    var self = this;
    self._text = '';
    self.findChild('NV').on('success', function(data) {
      self.txt = data.name;
    });
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