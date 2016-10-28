var count = 0;

class NV extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
    this.on(migi.Event.DOM, function() {
      document.querySelector('strong').innerHTML = count++;
    });
  }
}
class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._list = [];
    this.i = 0;
  }
  get list() {
    return this._list;
  }
  @bind
  set list(v) {
    this._list = v;
  }
  add() {
    switch(this.i++) {
      case 0:
        this._list = <NV/>;
        break;
      case 1:
        this._list = <NV/>;
        break;
    }
    this.list = this.list;
  }
  render() {
    return (
      <div>
        <p onClick={this.add} ref="add">点击添加1个</p>
        <strong></strong>
        <div>{this.list}</div>
      </div>
    );
  }
}

migi.render(
  <Component/>,
  '#test'
);