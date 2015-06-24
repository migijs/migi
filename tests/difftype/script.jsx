class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._data = '';
    this.i = 0;
    this.on(migi.Event.DOM, function() {
      this.record();
    });
  }
  get data() {
    return this._data;
  }
  set data(v) {
    this._data = v;
    this.record();
  }
  click() {
    switch(this.i++) {
      case 0:
        this.data = 'txt';
        break;
      case 1:
        this.data = <b>dom</b>;
        break;
      case 2:
        this.data = 'txt';
        break;
      case 3:
        this.data = <b>dom</b>;
        break;
      case 4:
        this.data = 'txt';
        break;
    }
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
  render() {
    return <div>
        <p onClick={this.click} ref="click">click</p>
        <strong></strong>
        <ul>
          <li title="1个变量">{this.data}</li>
          <li title="静态+变量">before{this.data}</li>
          <li title="变量+静态">{this.data}after</li>
          <li title="静态+变量+静态">before{this.data}after</li>
          <li title="空+变量">{null} {this.data}</li>
          <li title="变量+空">{this.data} {null}</li>
          <li title="空+变量+空">{null} {this.data} {null}</li>
          <li title="变量+变量">{this.data} {this.data}</li>
          <li title="变量+静态+变量">{this.data}middle{this.data}</li>
          <li title="静态+变量+静态+变量+静态">before{this.data}middle{this.data}after</li>
          <li title="变量+DOM">{this.data}<span>dom</span></li>
          <li title="DOM+变量"><span>dom</span>{this.data}</li>
          <li title="DOM+变量+DOM"><span>dom</span>{this.data}<span>dom</span></li>
          <li title="DOM+变量+DOM+变量"><span>dom</span>{this.data}<span>dom</span>{this.data}</li>
          <li title="变量+DOM+变量+DOM">{this.data}<span>dom</span>{this.data}<span>dom</span></li>
        </ul>
      </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);