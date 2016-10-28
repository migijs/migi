class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    var self = this;
    self.on(migi.Event.DOM, function() {
      self.element.querySelector('p').innerHTML = 'len:' + self.element.childNodes.length
        + ',html:' + self.element.innerHTML.replace(/</g, '&lt;');
    });
  }
  get txt() {
    return this._txt;
  }
  @bind
  set txt(v) {
    this.txt = v;
  }
  render() {
    return <div>
        {this.udf}
        <span ref="empty"></span>
        <span ref="udf">{this.udf}</span>
        {''}text{''}
        <span ref="null">{null}</span>
        <span ref="estring">{''}</span>
        {''}
        <span ref="earr">{[]}</span>
        {[]}
        <p></p>
      </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);