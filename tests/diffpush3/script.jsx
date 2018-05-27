class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list = [];
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
        this.list.push(this.i);
        break;
      case 1:
        this.list.push(this.i);
        break;
      case 2:
        this.list = [0];
        break;
      case 3:
        this.list.push(this.i);
        break;
      case 4:
        this.list.push(this.i);
        break;
      case 5:
        this.list = [<span>0</span>];
        break;
      case 6:
        this.list.push(this.i);
        break;
      case 7:
        this.list.push(this.i);
        break;
      case 8:
        this.list = [];
        break;
      case 9:
        this.list.push(<span>d</span>);
        break;
      case 10:
        this.list.push(<span>d</span>);
        break;
      case 11:
        this.list = [0];
        break;
      case 12:
        this.list.push(<span>d</span>);
        break;
      case 13:
        this.list.push(<span>d</span>);
        break;
      case 14:
        this.list = [<span>0</span>];
        break;
      case 15:
        this.list.push(<span>d</span>);
        break;
      case 16:
        this.list.push(<span>d</span>);
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
      <div>{this.list}<span>a</span></div>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);