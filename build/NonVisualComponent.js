var Component=function(){var _0=require('./Component');return _0.hasOwnProperty("Component")?_0.Component:_0.hasOwnProperty("default")?_0.default:_0}();

!function(){var _1=Object.create(Component.prototype);_1.constructor=NonVisualComponent;NonVisualComponent.prototype=_1}();
  function NonVisualComponent(data) {
    data=[].slice.call(arguments, 0);Component.apply(this,[].concat(function(){var _2=[],_3,_4=data[Symbol.iterator]();while(!(_3=_4.next()).done)_2.push(_3.value);return _2}()));
  }

  //�ǿ���Ϊ��
  NonVisualComponent.prototype.toString = function() {
    return '';
  }

  //û��dom
  NonVisualComponent.prototype.onDom = function() {}
Object.keys(Component).forEach(function(k){NonVisualComponent[k]=Component[k]});

exports.default=NonVisualComponent;