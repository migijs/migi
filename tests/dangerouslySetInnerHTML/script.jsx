var html = '<strong>使用html</strong>';

migi.render(
  <div>
    <p dangerouslySetInnerHTML={ html }></p>
    <p dangerouslySetInnerHTML="<strong>再次使用html</strong>"></p>
  </div>,
  document.querySelector('#test')
);