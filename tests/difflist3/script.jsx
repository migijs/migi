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
  set list(v) {
    this._list = v;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.list = [1,[]];
        break;
      case 1:
        this.list = [<span>1</span>,[]];
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
      <div>{this.list}</div>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);