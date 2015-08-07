class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.i = 0;
  }
  get cp() {
    return this._cp;
  }
  set cp(v) {
    this._cp = v;
  }
  get data() {
    return this.__data;
  }
  set data(v) {
    this._data = v;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.cp = <Ajax/>;
        break;
      case 1:
        this.cp = <Ajax/>;
        break;
    }
    this.ajax();
  }
  ajax() {
    var self = this;
    self.find(Ajax).on('test', function(v) {
      self.element.querySelector('div').innerHTML = v;
    });
  }
  render() {
    return <div>
      <p onClick={this.click} ref="0">click</p>
      <div ref="1">{this.data}</div>
      {this.cp}
    </div>;
  }
}
var count = 0;
class Ajax extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
    var self = this;
    self.on(migi.Event.DOM, function() {
      count++;
    });
    setTimeout(function() {
      self.emit('test', count++);
    }, 500);
  }
}

var vd = migi.render(
  <Component/>,
  '#test'
);