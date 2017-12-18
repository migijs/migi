define(function(require, exports, module) {
  var head = document.head || document.getElementsByTagName('head')[0];
  var migi = require('./web/migi')['default'];
  migi.init = function() {
    var jsx = document.querySelectorAll('script');
    for(var i = 0, len = jsx.length; i < len; i++) {
      var node = jsx[i];
      if(node.getAttribute('type') == 'text/jsx') {
        var code = node.text;
        // node.parentNode.removeChild(node);
        if(!code) {
          continue;
        }
        var charset = node.getAttribute('charset');
        var crossorigin = node.getAttribute('crossorigin');
        var script = document.createElement('script');
        if(charset) {
          script.charset = charset;
        }
        if(crossorigin) {
          node.setAttribute('crossorigin', crossorigin);
        }
        script.async = true;
        script.text = code;console.log(head);console.log(script);
        head.appendChild(script);
      }
    }
  }
  module.exports = migi;
});