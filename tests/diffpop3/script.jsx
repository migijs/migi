class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list = [1, 2];
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
        this.list.pop();
        break;
      case 1:
        this.list.pop();
        break;
      case 2:
        this.list = [0, 1, 2];
        break;
      case 3:
        this.list.pop();
        break;
      case 4:
        this.list.pop();
        break;
      case 5:
        this.list = [<span>0</span>, 1, 2];
        break;
      case 6:
        this.list.pop();
        break;
      case 7:
        this.list.pop();
        break;
      case 8:
        this.list = [<span>1</span>, <span>2</span>];
        break;
      case 9:
        this.list.pop();
        break;
      case 10:
        this.list.pop();
        break;
      case 11:
        this.list = [0, <span>1</span>, <span>2</span>];
        break;
      case 12:
        this.list.pop();
        break;
      case 13:
        this.list.pop();
        break;
      case 14:
        this.list = [<span>0</span>, <span>1</span>, <span>2</span>];
        break;
      case 15:
        this.list.pop();
        break;
      case 16:
        this.list.pop();
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
      <div>{this.list}<span>d</span></div>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);