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
  set list(v) {
    this._list = v;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.list = [7,8,9];
        break;
      case 1:
        this.list = [<span>1</span>,2,3];
        break;
      case 2:
        this.list = [7,8,9];
        break;
      case 3:
        this.list = [1,<span>2</span>,3];
        break;
      case 4:
        this.list = [7,8,9];
        break;
      case 5:
        this.list = [1,2,<span>3</span>];
        break;
      case 6:
        this.list = [7,8,9];
        break;
      case 7:
        this.list = [<span>1</span>,<span>2</span>,3];
        break;
      case 8:
        this.list = [7,8,9];
        break;
      case 9:
        this.list = [1,<span>2</span>,<span>3</span>];
        break;
      case 10:
        this.list = [7,8,9];
        break;
      case 11:
        this.list = [<span>1</span>,2,<span>3</span>];
        break;
      case 12:
        this.list = [7,8,9];
        break;
      case 13:
        this.list = [<span>4</span>,<span>5</span>,<span>6</span>];
        break;
      case 14:
        this.list = [1,<span>2</span>,<span>3</span>];
        break;
      case 15:
        this.list = [<span>4</span>,<span>5</span>,<span>6</span>];
        break;
      case 16:
        this.list = [<span>1</span>,2,<span>3</span>];
        break;
      case 17:
        this.list = [<span>4</span>,<span>5</span>,<span>6</span>];
        break;
      case 18:
        this.list = [<span>1</span>,<span>2</span>,3];
        break;
      case 19:
        this.list = [<span>4</span>,<span>5</span>,<span>6</span>];
        break;
      case 20:
        this.list = [1,2,<span>3</span>];
        break;
      case 21:
        this.list = [<span>4</span>,<span>5</span>,<span>6</span>];
        break;
      case 22:
        this.list = [<span>1</span>,2,3];
        break;
      case 23:
        this.list = [<span>4</span>,<span>5</span>,<span>6</span>];
        break;
      case 24:
        this.list = [1,<span>2</span>,3];
        break;
      case 25:
        this.list = [<span>4</span>,<span>5</span>,<span>6</span>];
        break;
    }
    this.record();
  }
  record() {
    this.$element.querySelector('p[ref="1"]').innerHTML = this.$element.querySelector('div').childNodes.length;
    this.$element.querySelector('p[ref="2"]').innerHTML = this.$element.querySelector('div').innerHTML.replace(/</g, '&lt;');
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