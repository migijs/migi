!function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(16)["default"]},function(t,e,n){function r(){this.__hash={}}r.prototype.on=function(t,e){var n=this;if(Array.isArray(t))t.forEach(function(t){n.on(t,e)});else if(e){n.__hash.hasOwnProperty(t)||(n.__hash[t]=[]);for(var r=0,i=n.__hash[t],a=i.length;a>r;r++)if(i[r]===e)return this;n.__hash[t].push(e)}return this},r.prototype.once=function(t,e){var n=this;return Array.isArray(t)?t.forEach(function(t){n.once(t,e)}):e&&n.on(t,function(r){r=[].slice.call(arguments,0),e.apply(n,r),n.off(t,arguments.callee)}),this},r.prototype.off=function(t,e){var n=this;if(Array.isArray(t))t.forEach(function(t){n.off(t,e)});else if(n.__hash.hasOwnProperty(t))if(e){for(var r=0,i=n.__hash[t],a=i.length;a>r;r++)if(i[r]===e){i.splice(r,1);break}}else delete n.__hash[t];return this},r.prototype.emit=function(t,e){e=[].slice.call(arguments,1);var n=this;if(Array.isArray(t))t.forEach(function(t){n.emit(t,e)});else if(n.__hash.hasOwnProperty(t)){var r=n.__hash[t].slice();r.forEach(function(t){t.apply(n,e)})}return this},r.mix=function(t){return t=[].slice.call(arguments,0),t.forEach(function(t){var e=new r;t.__hash={};var n=["on","once","off","emit"];n.forEach(function(n){t[n]=e[n]})}),this},r.DOM="__0",r.DATA="__1",e["default"]=r},function(t,e,n){function r(t){return o.isString(t)?document.querySelector(t):t}function i(t,e,n){a.call(this),this.__uid=s++,this.__reset(t,e,n)}var a=function(){var t=n(1);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=n(3);return t.hasOwnProperty("default")?t["default"]:t}(),s=0;!function(){var t=Object.create(a.prototype);t.constructor=i,i.prototype=t}(),i.prototype.__reset=function(t,e,n){this.__name=t,this.__props=e,this.__children=n,this.__element=null,this.__parent=null,this.__style=null,this.__dom=!1,this.on(a.DOM,this.__onDom),this.on(a.DATA,this.__onData)},i.prototype.__clean=function(){this.dom&&this.element.parentNode.removeChild(this.element)},i.prototype.__onDom=function(){this.__dom=!0,this.off(a.DOM,this.__onDom)};var c={};c.name={},c.name.get=function(){return this.__name},c.props={},c.props.get=function(){return this.__props},c.children={},c.children.get=function(){return this.__children},c.parent={},c.parent.get=function(){return this.__parent},c.uid={},c.uid.get=function(){return this.__uid},c.element={},c.element.get=function(){return this.__element||(this.__element=document.querySelector(this.name+'[migi-uid="'+this.uid+'"]'))},c.dom={},c.dom.get=function(){return this.__dom},c.html={},c.html.get=function(){return this.element.innerHTML},c.html.set=function(t){this.element.innerHTML=t},c.text={},c.text.get=function(){return o.lie?this.element.innerText:this.element.textContent},c.text.set=function(t){this.element.innerHTML=o.encodeHtml(t)},i.prototype.inTo=function(t){this.__clean();var e=this.toString();r(t).innerHTML=e,this.emit(a.DOM)},i.prototype.appendTo=function(t){this.__clean();var e=this.toString();if(t=r(t),t.lastChild){var n=o.getParent(this.name);n.innerHTML=e,t.appendChild(n.firstChild)}else t.innerHTML=e;this.emit(a.DOM)},i.prototype.prependTo=function(t){this.__clean();var e=this.toString();if(t=r(t),t.firstChild){var n=o.getParent(this.name);n.innerHTML=e,t.insertBefore(n.firstChild,t.firstChild)}else t.innerHTML=e;this.emit(a.DOM)},i.prototype.before=function(t){this.__clean();var e=this.toString(),n=o.getParent(this.name);n.innerHTML=e,t=r(t),t.parentNode.insertBefore(n.firstChild,t),this.emit(a.DOM)},i.prototype.after=function(t){this.__clean();var e=this.toString(),n=o.getParent(this.name);n.innerHTML=e,t=r(t);var i=t.nextSibling;i?t.parentNode.insertBefore(n.firstChild,i):t.parentNode.appendChild(n.firstChild),this.emit(a.DOM)},i.prototype.replace=function(t){this.__clean();var e=this.toString(),n=o.getParent(this.name);n.innerHTML=e,t=r(t),t.parentNode.replaceChild(n.firstChild,t),this.emit(a.DOM)},i.clean=function(){s=0},Object.keys(c).forEach(function(t){Object.defineProperty(i.prototype,t,c[t])}),Object.keys(a).forEach(function(t){i[t]=a[t]}),e["default"]=i},function(t,e,n){function r(t){if(t instanceof f)return t;var e=Array.isArray(t)?[]:{};for(var n in t)t.hasOwnProperty(n)&&(t[n]instanceof f?e[n]=t[n]:O.isDate(t[n])?e[n]=new Date(t[n]):e[n]=O.isObject(t[n])?r(t[n]):t[n]);return e}function i(t){return function(e){return l.call(e)=="[object "+t+"]"}}function a(t){return O.isBoolean(t)||O.isNull(t)||O.isNumber(t)||O.isUndefined(t)||O.isString(t)}function o(t,e){if(t===e)return!0;if(a(t)||a(e)||O.isFunction(t)||O.isFunction(e))return t===e;if(O.isArray(t)){if(!O.isArray(e))return!1;if(t.length!==e.length)return!1;for(var n=0,r=t.length;r>n;n++)if(!o(t[n],e[n]))return!1;return!0}if(O.isDate(t))return O.isDate(e)?t.toString()===e.toString():!1;if(O.isObject(t)){if(!O.isObject(e))return!1;var i=Object.keys(t),s=Object.keys(e);if(i.length!==s.length)return!1;for(var n=0,r=i.length;r>n;n++)if(!e.hasOwnProperty(n)||!o(t[n],e[n]))return!1;return!0}}function s(t){var e=t[0];return Array.isArray(e)?s(e):e}function c(t){var e=t[t.length-1];return Array.isArray(e)?c(e):e}function u(t){var e="";return t.forEach(function(t){e+=Array.isArray(t)?u(t):t.toString()}),e}var f=function(){var t=n(2);return t.hasOwnProperty("default")?t["default"]:t}(),l={}.toString,h=document.createElement("div"),d=document.createElement("table"),p=document.createElement("tbody"),_=document.createElement("tr"),v=document.createElement("ul"),y=document.createElement("dl"),m=document.createElement("select"),g=!1,O={clone:function(t){return f.hasOwnProperty("default")&&(f=f["default"]),"object"!=typeof t?t:r(t)},isObject:i("Object"),isString:i("String"),isArray:Array.isArray||i("Array"),isFunction:i("Function"),isUndefined:i("Undefined"),isNumber:i("Number"),isNull:i("Null"),isBoolean:i("Boolean"),isDate:i("Date"),equal:function(t,e){return f.hasOwnProperty("default")&&(f=f["default"]),o(t,e)},encodeHtml:function(t,e){return e?t.replace(/"/g,"&quot;"):t.replace(/</g,"&lt;")},NODE:h,TABLE:d,TR:_,getParent:function(t){switch(t.toLowerCase()){case"td":return _;case"tr":return p;case"tbody":case"thead":return d;case"li":return v;case"dt":case"dd":return y;case"option":return m;default:return h}},lie:g,version:function(){if(g){for(var t=5;h.innerHTML="<!--[if gt IE "+ ++t+"]>1<![endif]-->",h.innerHTML;);return t}}(),getFirst:s,getLast:c,joinArray:u};e["default"]=O},function(t,e,n){function r(t,e){void 0===t&&(t={}),void 0===e&&(e=[]);var n=this,r=n.constructor.toString();r=/^function\s+([\w$]+)/.exec(r)[1],a.call(this,r,t,e),n.__virtualDom=null,Object.keys(t).forEach(function(e){if(/^on[A-Z]/.test(e)){var r=e.slice(2).replace(/[A-Z]/g,function(t){return t.toLowerCase()}),i=t[e];n.on(r,function(t){t=[].slice.call(arguments,0),i.apply(this,[].concat(Array.from(t)))})}})}var i=function(){var t=n(1);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=n(2);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=n(5);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=n(3);return t.hasOwnProperty("default")?t["default"]:t}();!function(){var t=Object.create(a.prototype);t.constructor=r,r.prototype=t}(),r.prototype.render=function(){return new o("div",this.props,this.children)},r.prototype.toString=function(){return this.__virtualDom=this.render(),this.virtualDom.__parent=this,this.__style&&(this.virtualDom.style=this.__style),this.virtualDom.toString()},r.prototype.findChild=function(t){return this.findChildren(t,!0)[0]},r.prototype.findChildren=function(t,e){for(var n=[],i=0,o=this.children.length;o>i;i++){var s=this.children[i];if(s instanceof a)if(s instanceof r){if(s.name==t&&(n.push(s),e))break}else{if(s.name==t&&(n.push(s),e))break;if(n=n.concat(s.findAll(t)),e&&n.length)break}}return n},r.prototype.find=function(t){return this.findAll(t,!0)[0]},r.prototype.findAll=function(t,e){return this.virtualDom.findAll(t,e)},r.prototype.bind=function(t,e,n){var r=this;r.on(i.DATA,function(i){(!e||e.indexOf(i)>-1)&&(n&&-1!=n.indexOf(i)||t[i]!==r[i]&&(t[i]=r[i]))}),t.on(i.DATA,function(i){(!e||e.indexOf(i)>-1)&&(n&&-1!=n.indexOf(i)||t[i]!==r[i]&&(r[i]=t[i]))})},r.prototype.bindTo=function(t,e,n){t.bind(this,e,n)},r.prototype.bridge=function(t,e){var n=this;n.on(i.DATA,function(r){if(e.hasOwnProperty(r)){var i=e[r];if(s.isFunction(i))t[r]=i(n[r]);else if(i.name){var a=i.middleware?i.middleware.call(n,n[r]):n[r];t[i.name]=a}}})},r.prototype.bridgeTo=function(t,e){t.bridge(this,e)};var c={};c.virtualDom={},c.virtualDom.get=function(){return this.__virtualDom},c.element={},c.element.get=function(){return this.virtualDom?this.virtualDom.element:null},c.style={},c.style.set=function(t){this.__style=t},r.prototype.__onDom=function(){function t(t){t.target!=e.element&&t.stopPropagation()}a.prototype.__onDom.call(this);var e=this;e.virtualDom.emit(i.DOM),e.element.setAttribute("migi-name",this.name),e.children.forEach(function(t){t instanceof r&&t.emit(i.DOM)}),["click","dblclick","focus","blur","change","abort","error","load","mousedown","mousemove","mouseover","mouseup","mouseout","reset","resize","scroll","select","submit","unload","DOMActivate","DOMFocusIn","DOMFocusOut"].forEach(function(n){e.element.addEventListener(n,t)})},r.prototype.__onData=function(t){this.virtualDom&&this.virtualDom.emit(i.DATA,t)},Object.keys(c).forEach(function(t){Object.defineProperty(r.prototype,t,c[t])}),Object.keys(a).forEach(function(t){r[t]=a[t]}),e["default"]=r},function(t,e,n){function r(t,e,n){if(void 0===e&&(e={}),void 0===n&&(n=[]),o.hasOwnProperty("default")&&(o=o["default"]),_.hasOwnProperty(t)&&n.length)throw new Error("self-close tag can not has chilren nodes: "+t);a.call(this,t,e,n);var r=this;r.__cache={},r.__names=null,r.__classes=null,r.__ids=null,r.__inline=null,r.__hover=!1,r.__active=!1,r.__init(t,n)}var i=function(){var t=n(1);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=n(2);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=n(4);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=n(3);return t.hasOwnProperty("default")?t["default"]:t}(),c=function(){var t=n(6);return t.hasOwnProperty("default")?t["default"]:t}(),u=function(){var t=n(9);return t.hasOwnProperty("default")?t["default"]:t}(),f=function(){var t=n(10);return t.hasOwnProperty("default")?t["default"]:t}(),l=function(){var t=n(15);return t.hasOwnProperty("default")?t["default"]:t}(),h=function(){var t=n(11);return t.hasOwnProperty("default")?t["default"]:t}(),d=function(){var t=n(14);return t.hasOwnProperty("default")?t["default"]:t}(),p=(function(){var t=n(7);return t.hasOwnProperty("default")?t["default"]:t}(),function(){var t=n(8);return t.hasOwnProperty("default")?t["default"]:t}()),_={img:!0,meta:!0,link:!0,br:!0,basefont:!0,base:!0,col:!0,embed:!0,frame:!0,hr:!0,input:!0,keygen:!0,area:!0,param:!0,source:!0,track:!0},v={checked:!0,selected:!0,selectedIndex:!0,readOnly:!0,multiple:!0,defaultValue:!0,autofocus:!0,async:!0,tagName:!0,nodeName:!0,nodeType:!0};!function(){var t=Object.create(a.prototype);t.constructor=r,r.prototype=t}(),r.prototype.toString=function(){var t=this,e="<"+t.name;if(Object.keys(t.props).forEach(function(n){var r=t.__renderProp(n);e+=r}),t.__style){var n=t.__match(!0);n&&(e=e.indexOf(' style="')>1?e.replace(/ style="[^"]*"/,' style="'+n+'"'):e+' style="'+n+'"')}if(e+=' migi-uid="'+t.uid+'"',"input"==t.name){if(t.props.hasOwnProperty("value")){var r=t.props.value;t.on(i.DOM,function(){function e(){r.v=this.value;var t=r.k;r.context[t]=this.value}switch(t.off(i.DOM,arguments.callee),t.__cache.type){case"button":case"hidden":case"image":case"file":case"reset":case"submit":break;case"checkbox":case"radio":case"range":t.element.addEventListener("change",e);break;default:t.element.addEventListener("input",e),t.element.addEventListener("paste",e),t.element.addEventListener("cut",e)}})}}else if("select"==t.name&&t.props.hasOwnProperty("value")){var r=t.props.value;t.on(i.DOM,function(){function e(){r.v=this.value;var t=r.k;r.context[t]=this.value}t.off(i.DOM,arguments.callee),t.element.addEventListener("change",e)})}return t.__selfClose?e+"/>":(e+=">","textarea"==t.name&&t.children.forEach(function(e){e instanceof c&&t.on(i.DOM,function(){function n(t){e.v=this.value;var n=e.k;e.context[n]=this.value}t.off(i.DOM,arguments.callee),t.element.addEventListener("input",n),t.element.addEventListener("paste",n),t.element.addEventListener("cut",n)})}),e+=t.__renderChildren(),e+="</"+t.name+">")},r.prototype.isFirst=function(t){if(this.parent instanceof o)return!0;t=t||this.parent.children;for(var e=0,n=t.length;n>e;e++){var i=t[e];if(Array.isArray(i)&&i.length)return this.isFirst(i);if(i==this)return!0;if(i instanceof r)return!1;if(i instanceof c&&(i=i.v,Array.isArray(i)&&i.length))return this.isFirst(i)}},r.prototype.isLast=function(t){if(this.parent instanceof o)return!0;t=t||this.parent.children;for(var e=t.length-1;e>=0;e--){var n=t[e];if(Array.isArray(n)&&n.length)return this.isLast(n);if(n==this)return!0;if(n instanceof r)return!1;if(n instanceof c&&(n=n.v,Array.isArray(n)&&n.length))return this.isLast(n)}},r.prototype.__renderProp=function(t){var e=this,n=e.props[t],r="";if(/^on[A-Z]/.test(t))e.on(i.DOM,function(){e.off(i.DOM,arguments.callee);var n=t.slice(2).replace(/[A-Z]/g,function(t){return t.toLowerCase()});e.element.addEventListener(n,function(n){var r=e.props[t];r instanceof u?r.cb.call(r.context,n):r(n)})});else if(n instanceof c){var a=n.toString();if("dangerouslySetInnerHTML"==t)return e.on(i.DOM,function(){e.off(i.DOM,arguments.callee),e.element.innerHTML=a}),"";e.__cache[t]=a,(!v.hasOwnProperty(t)||n.v)&&(r=" "+t+'="'+s.encodeHtml(a,!0)+'"')}else{var a=Array.isArray(n)?s.joinArray(n):void 0===n||null===n?"":n.toString();if("dangerouslySetInnerHTML"==t)return e.on(i.DOM,function(){e.off(i.DOM,arguments.callee),e.element.innerHTML=a}),"";"className"==t&&(t="class"),e.__cache[t]=a,(!v.hasOwnProperty(t)||n)&&(r=" "+t+'="'+s.encodeHtml(a,!0)+'"')}if(e.__style)switch(t){case"class":case"id":r=" migi-"+r.slice(1)}return r},r.prototype.__renderChildren=function(){var t=this,e="";return t.children.forEach(function(t){e+=r.renderChild(t)}),e},r.prototype.find=function(t){return this.findAll(t,!0)[0]},r.prototype.findAll=function(t,e){for(var n=[],r=0,i=this.children.length;i>r;r++){var s=this.children[r];if(s instanceof a)if(s instanceof o){if(s.name==t&&(n.push(s),e))break}else{if(s.name==t&&(n.push(s),e))break;if(n=n.concat(s.findAll(t)),e&&n.length)break}}return n};var y={};y.names={},y.names.get=function(){return this.__names||(this.__names=[])},y.style={},y.style.set=function(t){var e=this;e.__style=t,e.parent instanceof r?e.__names=e.parent.names.slice(0):e.__names=[],e.__names.push(e.name),e.children.forEach(function(e){e instanceof r&&(e.style=t)})},r.prototype.__onDom=function(){a.prototype.__onDom.call(this);for(var t=this,e={start:0,first:!0},n=0,r=t.children.length;r>n;n++){var i=t.children[n];t.__domChild(i,n,r,e)}e.empty&&t.__insertBlank(e)},r.prototype.__domChild=function(t,e,n,o,s){var u=this;if(Array.isArray(t)&&t.length)t.forEach(function(t,r){u.__domChild(t,e,n,o,r)});else if(t instanceof a)o.empty&&(u.__insertBlank(o),o.empty=!1),t.emit(i.DOM),o.start++,o.first||o.prev==p.TEXT&&o.start++,o.prev=p.DOM;else if(t instanceof c)u.__domChild(t.v,e,n,o,s);else if(r.isEmptyText(t)){if(!o.first&&o.prev==p.TEXT)return;o.empty=!0,o.prev=p.TEXT}else o.empty=!1,o.prev=p.TEXT;o.first=!1},r.prototype.__insertBlank=function(t){var e=document.createTextNode(""),n=this.element,r=n.childNodes,i=r.length;!i||t.start>=i?n.appendChild(e):n.insertBefore(e,r[t.start])},r.prototype.__onData=function(t){var e=this;for(var n in e.props){var r=e.props[n];if(r instanceof c){var i=!1;if(Array.isArray(r.k)?i=r.k.indexOf(t)>-1:t==r.k&&(i=!0),i){var a=r.v,o=r.cb.call(r.context);a!=o&&(r.v=o,e.__updateAttr(n,o))}}}for(var s,u=[],l={start:0,record:[],first:!0},h=e.children,d=0,p=h.length;p>d;d++){var _=h[d];s=[d],e.__checkObj(t,_,d,p,u,l,s)}if(f.merge(u),u.length){if("textarea"==e.name)return void e.__updateAttr("value",f.value(u[0],e.children));u.forEach(function(t){f.update(t,e.children,e.element)})}},r.prototype.__checkObj=function(t,e,n,r,o,s,u){var l=this;if(e instanceof c){var h=!1;if(Array.isArray(e.k)?h=e.k.indexOf(t)>-1:t==e.k&&(h=!0),h){var _=e.v;e.update(_)&&d.diff(this.element,_,e.v,o,s,u)}}else e instanceof a?(delete s.t2d,delete s.d2t,e.emit(i.DATA,t),s.start++,s.first||s.prev!=p.TEXT||s.start++,s.prev=p.DOM):Array.isArray(e)&&e.length?(u.push(0),e.forEach(function(e,i){u[u.length-1]=i,l.__checkObj(t,e,n,r,o,s,u)}),u.pop()):(d.check(s,this.element,e,o,u),f.record(u,s),s.prev=p.TEXT);s.first=!1},r.prototype.__updateAttr=function(t,e){if("dangerouslySetInnerHTML"==t)return void(this.element.innerHTML=e||"");switch(t){case"value":this.element[t]=e||"";break;case"checked":case"selected":case"selectedIndex":case"readOnly":case"multiple":case"defaultValue":case"autofocus":case"async":case"tagName":case"nodeName":case"nodeType":this.element[t]=e||!1;break;case"className":t="class";case"id":case"class":if(this.__style){null===e||void 0===e?this.element.removeAttribute("migi-"+t):this.element.setAttribute("migi-"+t,e);break}default:null===e||void 0===e?this.element.removeAttribute(t):this.element.setAttribute(t,e)}this.__cache[t]=e,this.__style&&this.__updateStyle()},r.prototype.__match=function(t){this.__inline=this.__cache.style||"",this.parent instanceof r?(this.__classes=this.parent.__classes.slice(0),this.__ids=this.parent.__ids.slice(0)):(this.__classes=[],this.__ids=[]);var e=(this.__cache["class"]||"").trim();e?(e=e.split(/\s+/),h(e,function(t,e){return e>t}),this.__classes.push("."+e.join("."))):this.__classes.push("");var n=(this.__cache.id||"").trim();n?this.__ids.push("#"+n):this.__ids.push("");var i=l(this.__names,this.__classes,this.__ids,this.__style,this,t);return i+this.__inline},r.prototype.__updateStyle=function(){var t=this.__match();this.element.getAttribute("style")!=t&&this.element.setAttribute("style",t),this.children.forEach(function(t){t instanceof r&&t.__updateStyle()})},r.prototype.__init=function(t,e){var n=this;n.__selfClose=_.hasOwnProperty(t),e.forEach(function(t){t instanceof a&&(t.__parent=n)})},r.prototype.__reset=function(t,e,n){return void 0===e&&(e={}),void 0===n&&(n=[]),a.prototype.__reset.call(this,t,e,n),this.__init(t,n),this.__hasDes=!1,this},r.prototype.__destroy=function(){return this.__cache={},this.__names=null,this.__classes=null,this.__ids=null,this.__inline=null,this.__hover=!1,this.__active=!1,this.__hasDes=!0,this},r.isEmptyText=function(t){return void 0===t||null===t||!t.toString()},r.renderChild=function(t){if(void 0===t||null===t)return"";if(t instanceof a)return t.toString();if(t instanceof c)return t.toString();if(Array.isArray(t)){var e="";return t.forEach(function(t){e+=r.renderChild(t)}),e}return s.encodeHtml(t.toString())},Object.keys(y).forEach(function(t){Object.defineProperty(r.prototype,t,y[t])}),Object.keys(a).forEach(function(t){r[t]=a[t]}),e["default"]=r},function(t,e,n){function r(t,e,n){i.hasOwnProperty("default")&&(i=i["default"]),this.__k=t,this.__context=e,this.__empty=!0,this.type=null,this.__count=0,this.__cb=n,this.v=n.call(e)}var i=function(){var t=n(2);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=n(3);return t.hasOwnProperty("default")?t["default"]:t}(),o={};o.k={},o.k.get=function(){return this.__k},o.context={},o.context.get=function(){return this.__context},o.v={},o.v.get=function(){return this.__v},o.v.set=function(t){this.__v=a.clone(t)},o.cb={},o.cb.get=function(){return this.__cb},r.prototype.toString=function(){var t=Array.isArray(this.v)?a.joinArray(this.v):this.v;return void 0===t||null===t?"":t.toString()},r.prototype.update=function(t){var e=this.cb.call(this.context);return a.equal(t,e)?void 0:(this.v=e,!0)},Object.keys(o).forEach(function(t){Object.defineProperty(r.prototype,t,o[t])}),e["default"]=r},function(t,e,n){var r=4096,i=new Array(r),a={index:0,add:function(t){!t.__hasDes&&this.index<r&&(i[this.index++]=t)},get:function(){return i[--this.index]}};e["default"]=a},function(t,e,n){e["default"]={TEXT:0,DOM:1}},function(t,e,n){function r(t,e){this.__context=t,this.__cb=e}var i={};i.context={},i.context.get=function(){return this.__context},i.cb={},i.cb.get=function(){return this.__cb},Object.keys(i).forEach(function(t){Object.defineProperty(r.prototype,t,i[t])}),e["default"]=r},function(t,e,n){function r(t){for(var e=0,n=t.length;n-1>e;e++){var r=t[e],i=t[e+1];r.start==i.start&&(t.splice(e+1,1),e--,n--)}}function i(t,e,n){for(var r="",o=t.shift(),s=e.length;s>o;o++){var c=e[o];if(t.length){if(r+=c instanceof l?i(t,c.v,n):i(t,c,n),n.end)break}else if(c instanceof l)if(Array.isArray(c.v)){if(r+=a(c.v,n),n.end)break}else{if(c.v instanceof u){n.end=!0;break}r+=void 0===c||null===c?"":c.toString()}else{if(c instanceof u){n.end=!0;break}r+=void 0===c||null===c?"":c.toString()}}return r}function a(t,e){for(var n="",r=0,i=t.length;i>r;r++){var o=t[r];if(e.end)break;if(Array.isArray(o))n+=a(o,e);else{if(o instanceof u){e.end=!0;break}n+=void 0===o||null===o?"":o.toString()}}return n}function o(t,e,n){f.hasOwnProperty("default")&&(f=f["default"]);var r=i(t.index,e,{}),a=n.childNodes,o=a[t.start];if(1!=o.nodeType){var s=h.lie?o.innerText:o.textContent;if(r!=s)if(r)if(h.lie){var c=h.NODE;c.innerHTML=r,n.replaceChild(c.firstChild,o)}else o.textContent=r;else h.lie?o.innerText="":o.textContent=""}}function s(t,e){return f.hasOwnProperty("default")&&(f=f["default"]),i(t.index,e)}function c(t,e){(e.first||e.prev==d.DOM)&&(e.record=t.slice())}var u=function(){var t=n(2);return t.hasOwnProperty("default")?t["default"]:t}(),f=function(){var t=n(5);return t.hasOwnProperty("default")?t["default"]:t}(),l=function(){var t=n(6);return t.hasOwnProperty("default")?t["default"]:t}(),h=function(){var t=n(3);return t.hasOwnProperty("default")?t["default"]:t}(),d=function(){var t=n(8);return t.hasOwnProperty("default")?t["default"]:t}();e.merge=r,e.update=o,e.value=s,e.record=c},function(t,e,n){function r(t,e,n,a){if(!(e>=n)){var o=e,s=n,c=o,u=t[c],f=!0;t:for(;s>o;)if(f){for(;s>o;s--)if(a&&a.call(t,u,t[s])||!a&&u>t[s]){i(t,c,s),c=s,f=!f;continue t}}else for(;s>o;o++)if(a&&a.call(t,t[o],u)||!a&&u<t[o]){i(t,c,o),c=o,f=!f;continue t}r(t,e,c,a),r(t,c+1,n,a)}}function i(t,e,n){var r=t[e];t[e]=t[n],t[n]=r}t.exports=function(t,e){if(!Array.isArray(t))throw new Error("quick sort need an array");return t.length<2?t:(r(t,0,t.length-1,e),t)}},function(t,e,n){function r(t){t=[].slice.call(arguments,0),a.apply(this,[].concat(Array.from(t))),this.__handler={}}var i=function(){var t=n(1);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=n(4);return t.hasOwnProperty("default")?t["default"]:t}();!function(){var t=Object.create(a.prototype);t.constructor=r,r.prototype=t}(),r.prototype.__onData=function(t,e){function n(){r.virtualDom.emit(i.DATA,t,e),r.children.forEach(function(n){n instanceof a&&n.emit(i.DATA,t,e)})}var r=this;r.__handler.hasOwnProperty(e)||(r.__handler[e]=n,setTimeout(function(){n(),delete r.__handler[e]},1))},Object.keys(a).forEach(function(t){r[t]=a[t]}),e["default"]=r},function(t,e,n){function r(t){t=[].slice.call(arguments,0),a.apply(this,[].concat(Array.from(t)))}var i=function(){var t=n(1);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=n(4);return t.hasOwnProperty("default")?t["default"]:t}();!function(){var t=Object.create(a.prototype);t.constructor=r,r.prototype=t}(),r.prototype.toString=function(){return this.children.length?a.prototype.toString.call(this):""},r.prototype.__onDom=function(){this.__dom=!0,this.off(i.DOM,this.__onDom)},Object.keys(a).forEach(function(t){r[t]=a[t]}),e["default"]=r},function(t,e,n){function r(t,e,n,r,i){var a,o=i?_.NODE:_.getParent(r.name),s=void 0===r||null===r?"":r.toString();s?(o.innerHTML=i?_.encodeHtml(s):s,a=o.firstChild):a=document.createTextNode(""),n>=e.length?t.appendChild(a):t.replaceChild(a,e[n]),i||r.emit(d.DOM)}function i(t,e,n,r,i){var a,o=i?_.NODE:_.getParent(r.name),s=void 0===r||null===r?"":r.toString();s?(o.innerHTML=i?_.encodeHtml(s):s,a=o.firstChild):a=document.createTextNode(""),n>=e.length?t.appendChild(a):t.insertBefore(a,e[n]),i||r.emit(d.DOM)}function a(t,e,n,r,a){if(e instanceof p){switch(r.state){case g:case w:c(n,r),r.start++,r.t2d=!0;case b:r.t2d=!0;case O:i(t,t.childNodes,r.start++,e)}r.state=O,r.prev=m.DOM}else{switch(r.state){case g:r.d2t=!0;case w:c(n,r),r.state=w;break;case O:case b:v.record(a,r),i(t,t.childNodes,r.start,e,!0),r.state=g,r.d2t=!0}r.prev=m.TEXT}r.first=!1}function o(t,e,n,r,i){if(e instanceof p){switch(r.state){case g:case w:t.removeChild(t.childNodes[r.start+1]),r.prev=m.TEXT;break;case b:r.state=O;case O:t.removeChild(t.childNodes[r.start]),r.prev=m.DOM}y.add(e.__destroy())}else switch(r.state){case g:t.removeChild(t.childNodes[r.start+1]),r.state=w;case w:r.prev=m.TEXT;case O:c(n,r);break;case b:t.removeChild(t.childNodes[r.start]),r.prev=m.DOM}}function s(t,e){return(void 0===t||null===t)&&(t=""),(void 0===e||null===e)&&(e=""),t.toString()==e.toString()}function c(t,e){t.push({start:e.start,index:e.record.slice()})}function u(t,e){if(t!==e){var n=t.element;e.__uid=t.uid,e.__element=n;var r=Object.keys(t.props),i=Object.keys(e.props),a={};r.forEach(function(r){if(/^on[A-Z]/.test(r)){var i=r.slice(2).replace(/[A-Z]/g,function(t){return t.toLowerCase()});n.removeEventListener(i)}else{a[r]=!0;var o=t.props[r],s=e.props[r];o!==s&&t.__updateAttr(r,s)}}),i.forEach(function(t){a.hasOwnProperty(t)||e.__updateAttr(t,e.props[t])});for(var o,s=[],c={start:0,record:[],first:!0},u=0,f=Math.min(t.children.length,e.children.length);f>u;u++){var h=t.children[u],d=e.children[u];o=[u],l(n,h,d,s,c,o)}v.merge(s),s.length&&s.forEach(function(t){v.update(t,e.children,n)}),y.add(t.__destroy())}}function f(t,e,n,r,i,a){i.first||(i.prev==m.TEXT?i.state=w:i.state=O),l(t,e,n,r,i,a,!0),i.t2d||i.d2t||(i.state==b?i.t2d=!0:i.state==g&&(i.d2t=!0))}function l(t,e,n,f,d,A,k){var P=Array.isArray(e),D=Array.isArray(n);if(P&&D){var E=e.length,T=n.length,x=E?1:0,M=T?2:0;switch(A.push(0),d.first&&v.record(A,d),x+M){case 0:d.state=w,d.prev=m.TEXT;break;case 1:l(t,e[0],n[0],f,d,A,k);for(var C=1;E>C;C++)o(t,e[C],f,d,A);break;case 2:l(t,e[0],n[0],f,d,A,k);for(var C=1;T>C;C++)A[A.length-1]=C,a(t,n[C],f,d,A);break;case 3:for(var C=0,S=Math.min(E,T);S>C;C++)A[A.length-1]=C,l(t,e[C],n[C],f,d,A,k&&!C);for(var L=C;E>L;L++)o(t,e[L],f,d,A);for(var L=C;T>L;L++)A[A.length-1]=C,a(t,n[L],f,d,A)}A.pop()}else if(P){l(t,e[0],n,f,d,A,k);for(var C=1,S=e.length;S>C;C++)o(t,e[C],f,d,A)}else if(D){A.push(0),l(t,e,n[0],f,d,A,k);for(var C=1,S=n.length;S>C;C++)A[A.length-1]=C,a(t,n[C],f,d,A);A.pop()}else{var j=e instanceof p?1:0,N=n instanceof p?2:0;switch(j+N){case 0:!d.first&&k&&h(d,t,n,f,A),v.record(A,d);var H=t.childNodes;if(d.first)s(e,n)||c(f,d);else if(s(e,n))switch(d.state){case g:c(f,d),t.removeChild(H[d.start+1]);break;case b:c(f,d),i(t,H,d.start,n,!0)}else switch(d.state){case g:c(f,d),t.removeChild(H[d.start+1]);break;case b:c(f,d),i(t,H,d.start,n,!0);break;case O:v.record(A,d);case w:s(e,n)||c(f,d)}d.state=w,d.prev=m.TEXT;break;case 1:v.record(A,d);var H=t.childNodes;if(d.first)r(t,H,d.start,n,!0);else switch(d.state){case g:case w:c(f,d),t.removeChild(H[d.start+1]);break;case b:r(t,H,d.start++,n,!0);break;case O:r(t,H,d.start,n,!0)}y.add(e.__destroy()),d.state=g,d.prev=m.TEXT;break;case 2:var H=t.childNodes;if(d.first)r(t,H,d.start++,n);else switch(d.state){case g:d.start++;case O:r(t,H,d.start++,n);break;case b:i(t,H,d.start++,n);break;case w:c(f,d),i(t,H,++d.start,n),d.start++}d.state=b,d.prev=m.DOM;break;case 3:if(!d.first)switch(d.state){case g:case w:d.start++}if(e.name==n.name)u(e,n);else{var X=_.getParent(n.name);X.innerHTML=n.toString(),t.replaceChild(X.firstChild,t.childNodes[d.start]),y.add(e.__destroy())}d.state=O,d.prev=m.DOM,d.start++}}d.first=!1}function h(t,e,n,r,a){t.t2d?(delete t.t2d,v.record(a,t),c(r,t),i(e,e.childNodes,t.start,n,!0)):t.d2t&&(delete t.d2t,o(e,n,r,t))}var d=function(){var t=n(1);return t.hasOwnProperty("default")?t["default"]:t}(),p=function(){var t=n(2);return t.hasOwnProperty("default")?t["default"]:t}(),_=function(){var t=n(3);return t.hasOwnProperty("default")?t["default"]:t}(),v=function(){var t=n(10);return t.hasOwnProperty("default")?t["default"]:t}(),y=function(){var t=n(7);return t.hasOwnProperty("default")?t["default"]:t}(),m=function(){var t=n(8);return t.hasOwnProperty("default")?t["default"]:t}(),g=0,O=1,b=2,w=3;e.diff=f,e.check=h},function(t,e,n){function r(t,e,n,r,a,s){o.hasOwnProperty("default")&&(o=o["default"]);var u=[],f={};i(t.length-1,t,e,n,r,a,u,String(t.length-1),f,s),c(u,function(t,e){return t[2]==e[2]?t[0]>e[0]:t[2]>e[2]});var l="";return u.forEach(function(t){l+=t[1]+";"}),l}function i(t,e,n,r,o,u,f,l,h,d){h[l]=!0;var p=[];p.push(e[t]),n[t]&&p.push(n[t]),r[t]&&p.push(r[t]),c(p,function(t,e){return e>t});for(var _=0,v=p.length;v>_;_++)for(var y=p[_],m=_+1;v>m;m++)y+=p[m],p.push(y);for(var _=0,v=p.length;v>_;_++){var m=p[_];if(o.hasOwnProperty(m)){var g=o[m];if(t){o._d&&i(t-1,e,n,r,g,u.parent,f,l+","+(t-1)+":"+_,h);for(var O=t-2;O>=0;O--){var b=l+","+O+":"+_;h.hasOwnProperty(b)||i(O,e,n,r,g,u.parent,f,b,h)}}if(g.hasOwnProperty("_v")&&a(f,g),d&&g.hasOwnProperty("_:")&&g["_:"].forEach(function(t){t[0].forEach(function(t){switch(t){case"hover":u.on(s.DOM,function(){u.element.addEventListener("mouseenter",function(t){u.__hover=!0,u.__updateStyle()}),u.element.addEventListener("mouseleave",function(t){u.__hover=!1,u.__updateStyle()})});break;case"active":u.on(s.DOM,function(){u.element.addEventListener("mousedown",function(t){u.__active=!0,u.__updateStyle()}),document.body.addEventListener("mouseup",function(t){u.__active=!1,u.__updateStyle()},!0),window.addEventListener("blur",function(t){u.__active=!1,u.__updateStyle()}),window.addEventListener("dragend",function(t){u.__active=!1,u.__updateStyle()})})}})}),g.hasOwnProperty("_:")){var w=g["_:"];w.forEach(function(o){var s=o[0],c=!0;t:for(var d=0,p=s.length;p>d;d++)switch(s[d]){case"hover":if(!u.__hover){c=!1;break t}break;case"active":if(!u.__active){c=!1;break t}break;case"first-child":if(!u.isFirst()){c=!1;break t}break;case"last-child":if(!u.isLast()){c=!1;break t}break;default:c=!1}c&&(w=o[1],t&&i(t-1,e,n,r,w,u.parent,f,l+","+(t-1)+":"+d,h),w.hasOwnProperty("_v")&&a(f,w))})}if(g.hasOwnProperty("_[")){var w=g["_["];w.forEach(function(o){var s=o[0],c=!0;t:for(var d=0,p=s.length;p>d;d++){var _=s[d];if(1==_.length){if(!u.__cache.hasOwnProperty(_[0])){c=!1;break}}else{var v=u.__cache[_[0]];if(void 0===v){c=!1;break t}var y=_[2];switch(_[1]){case"=":c=v==y;break;case"^=":c=0==v.indexOf(y);break;case"$=":c=v.length>=y.length&&v.indexOf(y)==v.length-y.length;break;case"~=":var m=new RegExp("\\b"+y+"\\b");c=m.test(v);break;case"*=":c=v.indexOf(y)>-1;break;case"|=":c=0==v.indexOf(y)||0==v.indexOf(y+"-");break;default:c=!1;break t}if(!c)break t}}c&&(w=o[1],t&&i(t-1,e,n,r,w,u.parent,f,l+","+(t-1)+":"+d,h),w.hasOwnProperty("_v")&&a(f,w))})}}}}function a(t,e){e._v.forEach(function(n){n[2]=e._p,t.push(n)})}var o=function(){var t=n(5);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=n(1);return t.hasOwnProperty("default")?t["default"]:t}(),c=function(){var t=n(11);return t.hasOwnProperty("default")?t["default"]:t}();e["default"]=r},function(t,e,n){var r=function(){var t=n(1);return t.hasOwnProperty("default")?t["default"]:t}(),i=function(){var t=n(2);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=n(4);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=n(5);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=n(13);return t.hasOwnProperty("default")?t["default"]:t}(),c=function(){var t=n(12);return t.hasOwnProperty("default")?t["default"]:t;
}(),u=(function(){var t=n(3);return t.hasOwnProperty("default")?t["default"]:t}(),function(){var t=n(6);return t.hasOwnProperty("default")?t["default"]:t}()),f=function(){var t=n(9);return t.hasOwnProperty("default")?t["default"]:t}(),l=function(){var t=n(7);return t.hasOwnProperty("default")?t["default"]:t}(),h={render:function(t,e){return e&&t.inTo(e),t},createCp:function(t,e,n){return new t(e,n)},createVd:function(t,e,n){return l.index?l.get().__reset(t,e,n):new o(t,e,n)},Event:r,eventBus:r.mix({}),Element:i,Component:a,NonVisualComponent:s,CacheComponent:c,VirtualDom:o,Obj:u,Cb:f};"undefined"!=typeof window&&(window.migi=h),e["default"]=h}]);