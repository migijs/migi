# A JavaScript MVVM library on JSX

`migi`取自动漫寄生兽主角小右，意指以jsx语法将html模板寄生在js上。

[![NPM version](https://badge.fury.io/js/migi.png)](https://npmjs.org/package/migi)
[![Build Status](https://travis-ci.org/migijs/migi.svg?branch=master)](https://travis-ci.org/migijs/migi)
[![Dependency Status](https://david-dm.org/migijs/migi.png)](https://david-dm.org/migijs/migi)

## INSTALL
```
npm install migi
```

[![logo](https://raw.githubusercontent.com/migijs/migi/master/logo.jpg)](https://github.com/migijs/migi)

## 文档
https://github.com/migijs/migi/wiki/%E6%96%87%E6%A1%A3

## API

### migi
* render(element:Element, dom:DOM/String):Element 渲染element到指定dom中作为innerHTML，会调用element的toString方法
* createCp(name:String, props:Object, children:Array\<VirtualDom>):Component 创建指定name名称和props属性的组件，孩子列表children
* createVd(name:String, props:Object, children:Array\<VirtualDom>):VirtualDom 创建指定name名称和props属性的虚拟DOM，孩子列表children
* Event:class Event类
* EventBus:class EventBus类
* eventBus:EventBus 默认的全局事件总线
* Element:class Element类，Component组件和VirtualDom虚拟DOM抽象父类
* Component:class Component类
* NonVisualComponent:class NonVisualComponent类，父类为Component
* CacheComponent:class CacheComponent，父类为Component
* VirtualDom:class VirtualDom虚拟DOM类
* Obj:class get/set数据变动侦听类
* Cb:class VirtualDom点击侦听类

#### Event
* on(id:String/Array\<String>, handle:Function):Event 添加侦听
* off(id:String/Array\<String>, handle:Function):Event 删除侦听
* once(id:String/Array\<String>, handle:Function):Event 添加侦听，且只执行一次
* emit(id:String/Array\<String>, ...data:Object):Event 触发事件，参数变长
##### Event static
* mix(...obj:Object):void 将Event的方法混入到指定obj上

## Demo
* demo目录下是一个web端的实时转换例子，本地浏览需要npm install安装依赖
* 依赖的语法解析器来自于homunculus：https://github.com/army8735/homunculus
* 依赖的jsx翻译工具来自于lefty：https://github.com/migijs/lefty
* 依赖的css注入工具来自于jaw：https://github.com/migijs/jaw
* 在线地址：http://army8735.me/migijs/migi/demo/

# License
[MIT License]
