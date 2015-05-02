define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var type=function(){var _1=require('./type');return _1.hasOwnProperty("type")?_1.type:_1.hasOwnProperty("default")?_1.default:_1}();

!function(){var _2=Object.create(Event.prototype);_2.constructor=HtmlComponent;HtmlComponent.prototype=_2}();
  function HtmlComponent(name, props, children) {
    if(props===void 0)props={};children=[].slice.call(arguments, 2);Event.call(this);
    this.name = name;
    this.props = props;
    this.children = children;

    this.on(Event.DOM, this.onDom);
    this.on(Event.DATA, this.onData);
  }
  HtmlComponent.prototype.setProp = function(k, v) {
    this.props[k] = v;
  }
  HtmlComponent.prototype.toString = function() {
    var self = this;
    var res = '<' + self.name;
    Object.keys(self.props).forEach(function(k) {
      res += ' ' + k + '="' + self.props[k] + '"';
    });
    res += '>';
    self.children.forEach(function(child) {
      res += self.renderChild(child);
    });
    res +='</' + self.name + '>';
    return res;
  }
  HtmlComponent.prototype.renderChild = function(child) {
    var self = this;
    if(child instanceof HtmlComponent) {
      return child.toString();
    }
    else if(type.isArray(child)) {
      var res = '';
      child.forEach(function(item) {
        res += self.renderChild(item);
      });
      return res;
    }
    else {
      return child;
    }
  }
  HtmlComponent.prototype.onDom = function() {
    //TODO
  }
  HtmlComponent.prototype.onData = function(k, v) {
    //TODO
  }
Object.keys(Event).forEach(function(k){HtmlComponent[k]=Event[k]});

exports.default=HtmlComponent;});