class Person extends migi.Component {
  constructor(...data) {
    super(...data);
    this._first = 'army';
    this._last = '';
  }
  @link(first, last)
  get name() {
    if(!this.first && !this.last) {
      return '(no name)';
    }
    return (this._first || '(no first)') + (this._last || '(no last)');
  }
  get first() {
    return this._first;
  }
  @bind
  set first(v) {
    this._first = v;
  }
  get last() {
    return this._last;
  }
  @bind
  set last(v) {
    this._last = v;
  }
  render() {
    return (
      <div>
        <p>My name is: {this.name}</p>
        <label>first: <input value={this.first} placeholder="first" ref="1"/></label>
        <label>last: <input value={this.last} placeholder="last" ref="2"/></label>
      </div>
    );
  }
}

migi.render(
  <Person />,
  '#test'
);