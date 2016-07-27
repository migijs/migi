var html = '<strong>1"23</strong>';

migi.render(
  <div>
    <span id="s1">{ '>' }</span>
    <span id="s2">{ ' ' }</span>
    <span id="s3">{ '<' }</span>
    <span id="s4">{ '<div>' }</span>
    <span id="s5">{ '    ' }</span>
    <span id="s6">{ '&' }</span>
    <span id="s7">{ '&amp;' }</span>
    <span id="s8">{ '"' }</span>
    <span id="s9" dangerouslySetInnerHTML={ html }></span>
    <span id="s10" dangerouslySetInnerHTML={ [html] }></span>
  </div>,
  '#test'
);