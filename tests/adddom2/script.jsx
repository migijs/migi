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
  set list(_list) {
    this._list = _list;
  }
  record() {
    var strong = this.$element.querySelector('strong');
    var lis = this.$element.querySelectorAll('li');
    var s = '';
    for(var i = 0, len = lis.length; i < len; i++) {
      s += lis[i].childNodes.length + ',';
    }
    strong.innerHTML = s;
  }
  add() {
    this.list.push(<b>{this.i++}</b>);
    this.list.push(<b>{this.i++}</b>);
    this.list = this.list;
    this.record();
  }
  del() {
    this.list.pop();
    this.list.pop();
    this.list = this.list;
    this.record();
  }
  render() {
    return (
      <div>
        <p onClick={this.add} ref="add">点击添加2个dom</p>
        <p onClick={this.del} ref="del">点击删除2个dom</p>
        <strong></strong>
        <ul>
          <li title="1个变量">{this.list}</li>
          <li title="2个变量">{this.list} {this.list}</li>
          <li title="静态+变量">start {this.list}</li>
          <li title="变量+静态">{this.list} end</li>
          <li title="变量+静态+变量">{this.list} middle {this.list}</li>
          <li title="DOM+变量"><span>dom</span>{this.list}</li>
          <li title="变量+DOM">{this.list}<span>dom</span></li>
          <li title="DOM+变量+DOM"><span>dom</span>{this.list}<span>dom</span></li>
          <li title="DOM+变量+DOM+变量"><span>dom</span>{this.list}<span>dom</span>{this.list}</li>
          <li title="变量+DOM+变量">{this.list}<span>dom</span>{this.list}</li>
          <li title="变量+DOM+变量+DOM">{this.list}<span>dom</span>{this.list}<span>dom</span></li>
        </ul>
      </div>
    );
  }
}

migi.render(
  <Component/>,
  '#test'
);