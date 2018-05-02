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
  @bind
  set list(_list) {
    this._list = _list;
  }
  record() {
    var strong = this.element.querySelector('strong');
    var lis = this.element.querySelectorAll('li');
    var s = '';
    for(var i = 0, len = lis.length; i < len; i++) {
      s += lis[i].childNodes.length + ',';
    }
    strong.innerHTML = s;
  }
  add() {
    this.list.push(this.i++);
    this.list.push(this.i++);
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
    var blank = '';
    var arr = [];
    var udf;
    return (
      <div>
        <p onClick={this.add} ref="add">点击添加2个数</p>
        <p onClick={this.del} ref="del">点击删除2个数</p>
        <strong></strong>
        <ul>
          <li title="1个文本变量">{this.list}</li>
          <li title="2个文本变量">{this.list} {this.list}</li>
          <li title="静态+变量">start {this.list}</li>
          <li title="变量+静态">{this.list} end</li>
          <li title="变量+静态+变量">{this.list} middle {this.list}</li>
          <li title="空+变量">{blank} {this.list}</li>
          <li title="变量+空">{this.list} {blank}</li>
          <li title="变量+空+变量">{this.list} {blank} {this.list}</li>
          <li title="DOM+变量"><span>dom</span>{this.list}</li>
          <li title="变量+DOM">{this.list}<span>dom</span></li>
          <li title="DOM+变量+DOM"><span>dom</span>{this.list}<span>dom</span></li>
          <li title="DOM+变量+DOM+变量"><span>dom</span>{this.list}<span>dom</span>{this.list}</li>
          <li title="变量+DOM+变量">{this.list}<span>dom</span>{this.list}</li>
          <li title="变量+[]+变量">{this.list} {arr} {this.list}</li>
          <li title="变量+undefined+变量">{this.list} {udf} {this.list}</li>
          <li title="变量+null+变量">{this.list} {null} {this.list}</li>
        </ul>
      </div>
    );
  }
}

migi.dev.optimizeArrayDiff = false;

migi.render(
  <Component/>,
  '#test'
);