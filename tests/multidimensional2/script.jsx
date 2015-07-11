class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._data = <span>1</span>;
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
  record() {
    this.$element.querySelector('[ref]').innerHTML = this.$element.querySelector('div').innerHTML.replace(/</g, '&lt;');
  }
  click() {
    switch(this.i++) {
      case 0:
        this.data = <span>1<span>2<span>3</span></span></span>;
        break;
      default:
        this.data = <span>1</span>;
        break;
    }
    this.record();
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      <div>{this.data}</div>
      <p ref="msg">{this.txt}</p>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);