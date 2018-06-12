class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list = [1, 2, 3];
    this.i = 0;
    this.on(migi.Event.DOM, function() {
      this.record();
    });
  }
  get list() {
    return this._list;
  }
  @bind
  set list(v) {
    this._list = v;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.list.splice(0, 1, 4);
        break;
      case 1:
        this.list.splice(0, 0, 5);
        break;
      case 2:
        this.list.splice(0, 2, 6);
        break;
      case 3:
        this.list.splice(0, 1);
        break;
      case 4:
        this.list.splice(1, 0, 7);
        break;
      case 5:
        this.list.splice(1, 1, 8);
        break;
      case 6:
        this.list.splice(2, 1);
        break;
      case 7:
        this.list = [1, 2, 3];
        break;
      case 8:
        this.list.splice(0, 1, <span>4</span>);
        break;
      case 9:
        this.list.splice(0, 0, <span>5</span>);
        break;
      case 10:
        this.list.splice(0, 2, <span>6</span>);
        break;
      case 11:
        this.list.splice(0, 1);
        break;
      case 12:
        this.list.splice(1, 0, <span>7</span>);
        break;
      case 13:
        this.list.splice(1, 1, <span>8</span>);
        break;
      case 14:
        this.list.splice(2, 1);
        break;
    }
    this.record();
  }
  record() {
    this.element.querySelector('p[ref="1"]').innerHTML = this.element.querySelector('div').childNodes.length;
    this.element.querySelector('p[ref="2"]').innerHTML = this.element.querySelector('div').innerHTML.replace(/</g, '&lt;');
  }
  render() {
    return <div>
      <strong onClick={this.click} ref="click">click</strong>
      <p ref="1"></p>
      <p ref="2"></p>
      <div><span>a</span>{this.list}<span>b</span></div>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);