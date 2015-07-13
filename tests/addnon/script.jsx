class NV extends migi.NonVisualComponent {
  constructor(...data) {
    super(...data);
  }
}
class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._list = [];
    this.i = 0;
    this.on(migi.Event.DOM, function() {
      this.record();
    });
  }
  get list() {
    return this._list;
  }
  set list(v) {
    this._list = v;
  }
  record() {
    var strong = this.$element.querySelector('strong');
    strong.innerHTML = this.$element.querySelector('div').childNodes.length;
  }
  add() {
    switch(this.i++) {
      case 0:
        this.list.push(<NV/>);
        break;
      case 1:
        this.list.push(<div/>);
        break;
      case 2:
        this.list.push(<NV/>);
        break;
    }
    this.list = this.list;
    this.record();
  }
  del() {
    this.list.pop();
    this.list = this.list;
    this.record();
  }
  render() {
    return (
      <div>
        <p onClick={this.add} ref="add">点击添加1个</p>
        <p onClick={this.del} ref="del">点击删除1个</p>
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