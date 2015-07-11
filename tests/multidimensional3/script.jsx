class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._data = '';
    this.i = 0;
  }
  get data() {
    return this._data;
  }
  set data(v) {
    this._data = v;
  }
  record() {
    this.$element.querySelector('[ref]').innerHTML = '^'
      + this.$element.querySelector('div').innerHTML.replace(/</g, '&lt;')
      + '$'
      + this.$element.querySelector('div').childNodes.length;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.data = [1, [[2, <span>d</span>], 4]];
        break;
      case 1:
        this.data = '';
        break;
      case 2:
        this.data = [1, 2, <b>3</b>, <b>4</b>];
        break;
      case 3:
        this.data = '';
        break;
      case 4:
        this.data = [1, 2, <b>3</b>, <b>4</b>, 5];
        break;
      case 5:
        this.data = '';
        break;
      case 6:
        this.data = [1, 2, <b>3</b>, <b>4</b>, 5, <b>6</b>, 7, <b>8</b>];
        break;
      case 7:
        this.data = '';
        break;
    }
    this.record();
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      <div>{this.data}</div>
      <p ref=""></p>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);