class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list1 = [1, 2];
    this.list2 = [1, 2];
    this.list3 = [1, 2];
    this.list4 = [1, 2];
    this.i = 0;
    this.on(migi.Event.DOM, function() {
      this.record();
    });
  }
  @bind list1
  @bind list2
  @bind list3
  @bind list4
  click() {
    switch(this.i++) {
      case 0:
        this.list1 = [3, 4];
        this.list2 = [3, <span>4</span>];
        this.list3 = [<span>3</span>, 4];
        this.list4 = [<span>3</span>, <span>4</span>];
        break;
      case 1:
        this.list1 = [1, <span>2</span>];
        this.list2 = [1, <span>2</span>];
        this.list3 = [1, <span>2</span>];
        this.list4 = [1, <span>2</span>];
        break;
      case 2:
        this.list1 = [3, 4];
        this.list2 = [3, <span>4</span>];
        this.list3 = [<span>3</span>, 4];
        this.list4 = [<span>3</span>, <span>4</span>];
        break;
      case 3:
        this.list1 = [<span>1</span>, 2];
        this.list2 = [<span>1</span>, 2];
        this.list3 = [<span>1</span>, 2];
        this.list4 = [<span>1</span>, 2];
        break;
      case 4:
        this.list1 = [3, 4];
        this.list2 = [3, <span>4</span>];
        this.list3 = [<span>3</span>, 4];
        this.list4 = [<span>3</span>, <span>4</span>];
        break;
      case 5:
        this.list1 = [<span>1</span>, <span>2</span>];
        this.list2 = [<span>1</span>, <span>2</span>];
        this.list3 = [<span>1</span>, <span>2</span>];
        this.list4 = [<span>1</span>, <span>2</span>];
        break;
      case 6:
        this.list1 = [3, 4];
        this.list2 = [3, <span>4</span>];
        this.list3 = [<span>3</span>, 4];
        this.list4 = [<span>3</span>, <span>4</span>];
        break;
    }
    this.record();
  }
  record() {
    this.element.querySelector('p[ref="1"]').innerHTML = this.element.querySelector('li[ref="1"]').childNodes.length
      + this.element.querySelector('li[ref="1"]').innerHTML.replace(/</g, '&lt;');
    this.element.querySelector('p[ref="2"]').innerHTML = this.element.querySelector('li[ref="2"]').childNodes.length
      + this.element.querySelector('li[ref="2"]').innerHTML.replace(/</g, '&lt;');
    this.element.querySelector('p[ref="3"]').innerHTML = this.element.querySelector('li[ref="3"]').childNodes.length
      + this.element.querySelector('li[ref="3"]').innerHTML.replace(/</g, '&lt;');
    this.element.querySelector('p[ref="4"]').innerHTML = this.element.querySelector('li[ref="4"]').childNodes.length
      + this.element.querySelector('li[ref="4"]').innerHTML.replace(/</g, '&lt;');
  }
  render() {
    return <div>
      <strong onClick={this.click} ref="click">click</strong>
      <p ref="1"></p>
      <p ref="2"></p>
      <p ref="3"></p>
      <p ref="4"></p>
      <ul>
        <li ref="1">{this.list1}</li>
        <li ref="2">{this.list2}</li>
        <li ref="3">{this.list3}</li>
        <li ref="4">{this.list4}</li>
      </ul>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);