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
      case 5:
        this.data = [];
        break;
      case 6:
        this.data = <b>dom</b>;
        break;
      case 7:
        this.data = [];
        break;
      case 8:
        this.data = 'txt';
        break;
      case 9:
        this.data = ['txt'];
        break;
      case 10:
        this.data = 'txt';
        break;
      case 11:
        this.data = [<b>dom</b>];
        break;
      case 12:
        this.data = 'txt';
        break;
      case 13:
        this.data = ['txt',<b>dom</b>];
        break;
      case 14:
        this.data = <b>dom</b>;
        break;
      case 15:
        this.data = [<b>dom</b>,'txt'];
        break;
      case 16:
        this.data = 'txt';
        break;
      case 17:
        this.data = [<b>dom</b>,'txt'];
        break;
      case 18:
        this.data = <b>dom</b>;
        break;
      case 19:
        this.data = ['txt',<b>dom</b>];
        break;
      case 20:
        this.data = [<b>dom</b>,<b>dom</b>];
        break;
    }
    this.record();
  }
  record() {
    var ps = this.$element.querySelectorAll('p');
    var lis = this.$element.querySelectorAll('li');
    var s = '';
    var s2 = '';
    for(var i = 0, len = lis.length; i < len; i++) {
      s += lis[i].childNodes.length + ',';
      s2 += lis[i].innerHTML + ',';
    }
    ps[0].innerHTML = s;
    ps[1].innerHTML = s2.replace(/</g, '&lt;');
  }
  render() {
    return <div>
        <strong onClick={this.click} ref="click">click</strong>
        <p ref="1"></p>
        <p ref="2"></p>
        <ul>
          <li title="1个变量">{this.data}</li>
          <li title="静态+变量">before{this.data}</li>
          <li title="变量+静态">{this.data}after</li>
          <li title="静态+变量+静态">before{this.data}after</li>
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