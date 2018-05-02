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
        this.list = [1];
        break;
      case 1:
        this.list = [];
        break;
      case 2:
        this.list = [1, 2];
        break;
      case 3:
        this.list = [];
        break;
      case 4:
        this.list = [1, 2, <span>3</span>];
        break;
      case 5:
        this.list = [];
        break;
      case 6:
        this.list = [1, 2, <span>3</span>, <span>4</span>];
        break;
      case 7:
        this.list = [];
        break;
      case 8:
        this.list = [1, 2, <span>3</span>, <span>4</span>, 5];
        break;
      case 9:
        this.list = [];
        break;
      case 10:
        this.list = [1, 2, <span>3</span>, <span>4</span>, 5, 6];
        break;
      case 11:
        this.list = [];
        break;
      case 12:
        this.list = [1, 2, <span>3</span>, <span>4</span>, 5, 6, <span>7</span>];
        break;
      case 13:
        this.list = [];
        break;
      case 14:
        this.list = [1, <span>2</span>];
        break;
      case 15:
        this.list = [];
        break;
      case 16:
        this.list = [1, <span>2</span>, <span>3</span>];
        break;
      case 17:
        this.list = [];
        break;
      case 18:
        this.list = [1, <span>2</span>, <span>3</span>, 4];
        break;
      case 19:
        this.list = [];
        break;
      case 20:
        this.list = [1, <span>2</span>, <span>3</span>, 4, 5];
        break;
      case 21:
        this.list = [];
        break;
      case 22:
        this.list = [1, <span>2</span>, <span>3</span>, 4, 5, <span>6</span>];
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