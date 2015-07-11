class NotesList extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <ol>
      <li>first</li>
      {
        this.$children.map(function(child) {
          return <li>{child}</li>;
        })
      }
    </ol>;
  }
}

migi.render(
  <NotesList>
    <span>hello</span>
    <span>world</span>
  </NotesList>,
  '#test'
);