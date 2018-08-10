class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._list = [[<span>1</span>], 0];
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
        this.list = [[1, <span>2</span>], 0];
        break;
      case 1:
        this.list = [[<span>1</span>], 0];
        break;
      case 2:
        this.list = [[1, 2], 0];
        break;
      case 3:
        this.list = [[<span>1</span>, 0]];
        break;
      case 4:
        this.list = [[1, <span>2</span>, 3], 0];
        break;
      case 5:
        this.list = [[<span>1</span>], 0];
        break;
      case 6:
        this.list = [[1, <span>2</span>, 3, <span>4</span>], 0];
        break;
      case 7:
        this.list = [[<span>1</span>], 0];
        break;
      case 8:
        this.list = [[1, <span>2</span>, 3, <span>4</span>, 5], 0];
        break;
      case 9:
        this.list = [[<span>1</span>], 0];
        break;
      case 10:
        this.list = [[1, 2, <span>3</span>], 0];
        break;
      case 11:
        this.list = [[<span>1</span>], 0];
        break;
      case 12:
        this.list = [[1, 2, <span>3</span>, <span>4</span>], 0];
        break;
      case 13:
        this.list = [[<span>1</span>], 0];
        break;
      case 14:
        this.list = [[1, 2, <span>3</span>, 4], 0];
        break;
      case 15:
        this.list = [[<span>1</span>], 0];
        break;
      case 16:
        this.list = [[1, 2, <span>3</span>, 4, <span>5</span>], 0];
        break;
      case 17:
        this.list = [[<span>1</span>], 0];
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