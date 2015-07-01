!function(t){function e(n){if(r[n])return r[n].exports;var i=r[n]={exports:{},id:n,loaded:!1};return t[n].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){t.exports=r(16)["default"]},function(t,e,r){function n(){this.__hash={}}n.prototype.on=function(t,e){var r=this;if(Array.isArray(t))t.forEach(function(t){r.on(t,e)});else if(e){r.__hash.hasOwnProperty(t)||(r.__hash[t]=[]);for(var n=0,i=r.__hash[t],a=i.length;a>n;n++)if(i[n]===e)return this;r.__hash[t].push(e)}return this},n.prototype.once=function(t,e){var r=this;return Array.isArray(t)?t.forEach(function(t){r.once(t,e)}):e&&r.on(t,function(n){n=[].slice.call(arguments,0),e.apply(r,n),r.off(t,arguments.callee)}),this},n.prototype.off=function(t,e){var r=this;if(Array.isArray(t))t.forEach(function(t){r.off(t,e)});else if(r.__hash.hasOwnProperty(t))if(e){for(var n=0,i=r.__hash[t],a=i.length;a>n;n++)if(i[n]===e){i.splice(n,1);break}}else delete r.__hash[t];return this},n.prototype.emit=function(t,e){e=[].slice.call(arguments,1);var r=this;if(Array.isArray(t))t.forEach(function(t){r.emit(t,e)});else if(r.__hash.hasOwnProperty(t)){var n=r.__hash[t].slice();n.forEach(function(t){t.apply(r,e)})}return this},n.mix=function(t){return t=[].slice.call(arguments,0),t.forEach(function(t){var e=new n;t.__hash={};var r=["on","once","off","emit"];r.forEach(function(r){t[r]=e[r]})}),this},n.DOM="__0",n.DATA="__1",n.CACHE_DATA="__2",e["default"]=n},function(t,e,r){function n(t){if(t instanceof c)return t;if(a(t))return t;var e=Array.isArray(t)?[]:{};for(var r in t)t.hasOwnProperty(r)&&(t[r]instanceof c?e[r]=t[r]:m.isDate(t[r])?e[r]=new Date(t[r]):e[r]=m.isObject(t[r])?n(t[r]):t[r]);return e}function i(t){return function(e){return f.call(e)=="[object "+t+"]"}}function a(t){return m.isBoolean(t)||m.isNull(t)||m.isNumber(t)||m.isUndefined(t)||m.isString(t)}function o(t,e){if(t instanceof c||e instanceof c)return t==e;if(a(t)||a(e))return t===e;if(m.isArray(t)){if(!m.isArray(e))return!1;if(t.length!==e.length)return!1;for(var r=0,n=t.length;n>r;r++)if(!o(t[r],e[r]))return!1;return!0}if(m.isDate(t))return m.isDate(e)?t-e==0:!1;if(m.isObject(t)){if(!m.isObject(e))return!1;var i=Object.keys(t),s=Object.keys(e);if(i.length!==s.length)return!1;for(var r=0,n=i.length;n>r;r++)if(!e.hasOwnProperty(r)||!o(t[r],e[r]))return!1;return!0}}function s(t){var e="";return t.forEach(function(t){e+=Array.isArray(t)?s(t):t.toString()}),e}var c=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),f={}.toString,u=document.createElement("div"),l=document.createElement("table"),h=document.createElement("tbody"),d=document.createElement("tr"),_=document.createElement("ul"),p=document.createElement("dl"),v=document.createElement("select"),y=!1,m={clone:function(t){return c.hasOwnProperty("default")&&(c=c["default"]),n(t)},isObject:i("Object"),isString:i("String"),isArray:Array.isArray||i("Array"),isFunction:i("Function"),isUndefined:i("Undefined"),isNumber:i("Number"),isNull:i("Null"),isBoolean:i("Boolean"),isDate:i("Date"),equal:function(t,e){return c.hasOwnProperty("default")&&(c=c["default"]),o(t,e)},encodeHtml:function(t,e){return e?t.replace(/"/g,"&quot;"):t.replace(/</g,"&lt;")},NODE:u,getParent:function(t){switch(t.toLowerCase()){case"td":return d;case"tr":return h;case"tbody":case"thead":return l;case"li":return _;case"dt":case"dd":return p;case"option":return v;default:return u}},lie:y,version:function(){if(y){for(var t=5;u.innerHTML="<!--[if gt IE "+ ++t+"]>1<![endif]-->",u.innerHTML;);return t}}(),joinArray:s};e["default"]=m},function(t,e,r){function n(t){return o.isString(t)?document.querySelector(t):t}function i(t,e,r){a.call(this),this.__uid=s++,this.__reset(t,e,r)}var a=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),s=0;!function(){var t=Object.create(a.prototype);t.constructor=i,i.prototype=t}(),i.prototype.__reset=function(t,e,r){this.__name=t,this.__props=e,this.__children=r,this.__element=null,this.__parent=null,this.__style=null,this.__dom=!1,this.once(a.DOM,this.__onDom),this.on(a.DATA,this.__onData)},i.prototype.__clean=function(){this.dom&&this.element.parentNode.removeChild(this.element)},i.prototype.__onDom=function(){this.__dom=!0};var c={};c.name={},c.name.get=function(){return this.__name},c.props={},c.props.get=function(){return this.__props},c.children={},c.children.get=function(){return this.__children},c.parent={},c.parent.get=function(){return this.__parent},c.uid={},c.uid.get=function(){return this.__uid},c.element={},c.element.get=function(){return this.__element||(this.__element=document.querySelector(this.name+'[migi-uid="'+this.uid+'"]'))},c.dom={},c.dom.get=function(){return this.__dom},c.html={},c.html.get=function(){return this.element.innerHTML},c.html.set=function(t){this.element.innerHTML=t},c.text={},c.text.get=function(){return o.lie?this.element.innerText:this.element.textContent},c.text.set=function(t){this.element.innerHTML=o.encodeHtml(t)},i.prototype.inTo=function(t){this.__clean();var e=this.toString();n(t).innerHTML=e,this.emit(a.DOM)},i.prototype.appendTo=function(t){this.__clean();var e=this.toString();t=n(t),t.insertAdjacentHTML("beforeend",e),this.emit(a.DOM)},i.prototype.prependTo=function(t){this.__clean();var e=this.toString();t=n(t),t.insertAdjacentHTML("afterbegin",e),this.emit(a.DOM)},i.prototype.before=function(t){this.__clean();var e=this.toString();t=n(t),t.insertAdjacentHTML("beforebegin",e),this.emit(a.DOM)},i.prototype.after=function(t){this.__clean();var e=this.toString();t=n(t),t.insertAdjacentHTML("afterend",e),this.emit(a.DOM)},i.prototype.replace=function(t){this.__clean();var e=this.toString();t=n(t),t.insertAdjacentHTML("afterend",e),t.parentNode.removeChild(t),this.emit(a.DOM)},i.clean=function(){s=0},Object.keys(c).forEach(function(t){Object.defineProperty(i.prototype,t,c[t])}),Object.keys(a).forEach(function(t){i[t]=a[t]}),e["default"]=i},function(t,e,r){function n(t,e){void 0===t&&(t={}),void 0===e&&(e=[]);var r=this,n=r.constructor.toString();n=/^function\s+([\w$]+)/.exec(n)[1],a.call(this,n,t,e),r.__virtualDom=null,Object.keys(t).forEach(function(e){if(/^on[A-Z]/.test(e)){var n=e.slice(2).replace(/[A-Z]/g,function(t){return t.toLowerCase()}),i=t[e];r.on(n,function(t){t=[].slice.call(arguments,0),i.apply(this,[].concat(Array.from(t)))})}})}var i=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=r(5);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}();!function(){var t=Object.create(a.prototype);t.constructor=n,n.prototype=t}(),n.prototype.render=function(){return new o("div",this.props,this.children)},n.prototype.toString=function(){return this.__virtualDom=this.render(),this.virtualDom.__parent=this,this.__style&&(this.virtualDom.style=this.__style),this.virtualDom.toString()},n.prototype.findChild=function(t){return this.findChildren(t,!0)[0]},n.prototype.findChildren=function(t,e){for(var r=[],i=0,o=this.children.length;o>i;i++){var c=this.children[i];if(c instanceof a)if(c instanceof n){if((c.name==t||s.isFunction(t)&&c instanceof t)&&(r.push(c),e))break}else{if((c.name==t||s.isFunction(t)&&c instanceof t)&&(r.push(c),e))break;if(r=r.concat(c.findAll(t)),e&&r.length)break}}return r},n.prototype.find=function(t){return this.findAll(t,!0)[0]},n.prototype.findAll=function(t,e){return this.virtualDom.findAll(t,e)},n.prototype.bind=function(t,e,r){function n(n,i){if(i!=a){t.__flag=!0,Array.isArray(n)||(n=[n]);for(var s=0,c=n.length;c>s;s++){var f=n[s];(!e||e.indexOf(f)>-1)&&(r&&-1!=r.indexOf(f)||(t[f]=o[f]))}t.__flag=!1}}function a(i,a){if(a!=n){o.__flag=!0,Array.isArray(i)||(i=[i]);for(var s=0,c=i.length;c>s;s++){var f=i[s];(!e||e.indexOf(f)>-1)&&(r&&-1!=r.indexOf(f)||(o[f]=t[f]))}o.__flag=!1}}var o=this;if(t==this)throw new Error("can not bind self: "+o.name);o.on(o.__handler?i.CACHE_DATA:i.DATA,n),t.on(t.__handler?i.CACHE_DATA:i.DATA,a)},n.prototype.bindTo=function(t,e,r){t.bind(this,e,r)},n.prototype.__bcb=function(t,e,r,n){if(n!=t.__bcb){if(t.__flag=!0,s.isFunction(r))t[e]=r(this[e]);else if(s.isString(r))t[r]=this[e];else if(r.name){var i=r.middleware?r.middleware.call(this,this[e]):this[e];t[r.name]=i}t.__flag=!1}},n.prototype.bridge=function(t,e){var r=this;if(t==this)throw new Error("can not bridge self: "+r.name);r.on(r.__handler?i.CACHE_DATA:i.DATA,function(n,i){Array.isArray(n)||(n=[n]),n.forEach(function(n){if(e.hasOwnProperty(n)){var a=e[n];r.__bcb(t,n,a,i)}})})},n.prototype.bridgeTo=function(t,e){t.bridge(this,e)};var c={};c.virtualDom={},c.virtualDom.get=function(){return this.__virtualDom},c.element={},c.element.get=function(){return this.virtualDom?this.virtualDom.element:null},c.style={},c.style.set=function(t){this.__style=t},n.prototype.__onDom=function(){function t(t){t.target!=e.element&&t.stopPropagation()}a.prototype.__onDom.call(this);var e=this;e.virtualDom.emit(i.DOM),e.element.setAttribute("migi-name",this.name),e.children.forEach(function(t){t instanceof n&&t.emit(i.DOM)}),["click","dblclick","focus","blur","change","abort","error","load","mousedown","mousemove","mouseover","mouseup","mouseout","reset","resize","scroll","select","submit","unload","DOMActivate","DOMFocusIn","DOMFocusOut"].forEach(function(r){e.element.addEventListener(r,t)})},n.prototype.__onData=function(t){this.virtualDom&&this.virtualDom.emit(i.DATA,t),this.children.forEach(function(e){e.emit(i.DATA,t)})},Object.keys(c).forEach(function(t){Object.defineProperty(n.prototype,t,c[t])}),Object.keys(a).forEach(function(t){n[t]=a[t]}),e["default"]=n},function(t,e,r){function n(t,e,r){if(void 0===e&&(e={}),void 0===r&&(r=[]),o.hasOwnProperty("default")&&(o=o["default"]),p.hasOwnProperty(t)&&r.length)throw new Error("self-close tag can not has chilren nodes: "+t);a.call(this,t,e,r);var n=this;n.__cache={},n.__names=null,n.__classes=null,n.__ids=null,n.__inline=null,n.__hover=!1,n.__active=!1,n.__listener=null,n.__init(t,r)}var i=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=r(4);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),c=function(){var t=r(6);return t.hasOwnProperty("default")?t["default"]:t}(),f=function(){var t=r(9);return t.hasOwnProperty("default")?t["default"]:t}(),u=function(){var t=r(10);return t.hasOwnProperty("default")?t["default"]:t}(),l=function(){var t=r(15);return t.hasOwnProperty("default")?t["default"]:t}(),h=function(){var t=r(11);return t.hasOwnProperty("default")?t["default"]:t}(),d=function(){var t=r(14);return t.hasOwnProperty("default")?t["default"]:t}(),_=(function(){var t=r(7);return t.hasOwnProperty("default")?t["default"]:t}(),function(){var t=r(8);return t.hasOwnProperty("default")?t["default"]:t}()),p={img:!0,meta:!0,link:!0,br:!0,basefont:!0,base:!0,col:!0,embed:!0,frame:!0,hr:!0,input:!0,keygen:!0,area:!0,param:!0,source:!0,track:!0},v={checked:!0,selected:!0,selectedIndex:!0,readOnly:!0,multiple:!0,defaultValue:!0,autofocus:!0,async:!0,tagName:!0,nodeName:!0,nodeType:!0};!function(){var t=Object.create(a.prototype);t.constructor=n,n.prototype=t}(),n.prototype.toString=function(){var t=this,e="<"+t.name;if(Object.keys(t.props).forEach(function(r){var n=t.__renderProp(r);e+=n}),t.__style){var r=t.__match(!0);r&&(e=e.indexOf(' style="')>1?e.replace(/ style="[^"]*"/,' style="'+r+'"'):e+' style="'+r+'"')}return e+=' migi-uid="'+t.uid+'"',t.__checkListener(),t.__selfClose?e+"/>":(e+=">",e+=t.__renderChildren(),e+="</"+t.name+">")},n.prototype.isFirst=function(t){if(this.parent instanceof o)return!0;t=t||this.parent.children;for(var e=0,r=t.length;r>e;e++){var i=t[e];if(Array.isArray(i)&&i.length)return this.isFirst(i);if(i==this)return!0;if(i instanceof n)return!1;if(i instanceof c&&(i=i.v,Array.isArray(i)&&i.length))return this.isFirst(i)}},n.prototype.isLast=function(t){if(this.parent instanceof o)return!0;t=t||this.parent.children;for(var e=t.length-1;e>=0;e--){var r=t[e];if(Array.isArray(r)&&r.length)return this.isLast(r);if(r==this)return!0;if(r instanceof n)return!1;if(r instanceof c&&(r=r.v,Array.isArray(r)&&r.length))return this.isLast(r)}},n.prototype.__renderProp=function(t){var e=this,r=e.props[t],n="";if(/^on[A-Z]/.test(t))e.once(i.DOM,function(){var r=t.slice(2).replace(/[A-Z]/g,function(t){return t.toLowerCase()});e.__addListener(r,function(r){var n=e.props[t];n instanceof f?n.cb.call(n.context,r):n(r)})});else if(r instanceof c){var a=r.toString();if("dangerouslySetInnerHTML"==t)return e.once(i.DOM,function(){e.element.innerHTML=a}),"";e.__cache[t]=a,(!v.hasOwnProperty(t)||r.v)&&(n=" "+t+'="'+s.encodeHtml(a,!0)+'"')}else{var a=Array.isArray(r)?s.joinArray(r):void 0===r||null===r?"":r.toString();if("dangerouslySetInnerHTML"==t)return e.once(i.DOM,function(){e.element.innerHTML=a}),"";"className"==t&&(t="class"),e.__cache[t]=a,(!v.hasOwnProperty(t)||r)&&(n=" "+t+'="'+s.encodeHtml(a,!0)+'"')}if(e.__style)switch(t){case"class":case"id":n=" migi-"+n.slice(1)}return n},n.prototype.__renderChildren=function(){var t=this,e="";return t.children.forEach(function(t){e+=n.renderChild(t)}),e},n.prototype.__checkListener=function(){var t=this;if("input"==t.name){if(t.props.hasOwnProperty("value")){var e=t.props.value;e instanceof c&&t.once(i.DOM,function(){function r(){e.v=this.value;var t=e.k;e.context[t]=this.value}var n=t.__cache.type;switch((void 0===n||null===n)&&(n=""),n.toLowerCase()){case"button":case"hidden":case"image":case"file":case"reset":case"submit":break;case"checkbox":case"radio":case"range":case"color":t.__addListener("change",r);break;default:t.__addListener(["input","paste","cut"],r)}})}}else if("select"==t.name){if(t.props.hasOwnProperty("value")){var e=t.props.value;e instanceof c&&t.once(i.DOM,function(){function r(){e.v=this.value;var t=e.k;e.context[t]=this.value}t.__addListener("change",r)})}}else if("textarea"==t.name&&1==t.children.length){var r=t.children[0];r instanceof c&&t.once(i.DOM,function(){function e(t){r.v=this.value;var e=r.k;r.context[e]=this.value}t.__addListener(["input","paste","cut"],e)})}},n.prototype.__addListener=function(t,e){var r=this;if(Array.isArray(t))t.forEach(function(t){r.__addListener(t,e)});else{if(r.__listener=r.__listener||{},r.__listener.hasOwnProperty(t)){var n=r.__listener[t];Array.isArray(n)?n.push(e):r.__listener[t]=[n,e]}else r.__listener[t]=e;r.element.addEventListener(t,e)}},n.prototype.__removeListener=function(){var t=this;t.__listener&&Object.keys(t.__listener).forEach(function(e){var r=t.__listener[e];Array.isArray(r)?r.forEach(function(r){t.element.removeEventListener(e,r)}):t.element.removeEventListener(e,r)})},n.prototype.find=function(t){return this.findAll(t,!0)[0]},n.prototype.findAll=function(t,e){for(var r=[],n=0,i=this.children.length;i>n;n++){var c=this.children[n];if(c instanceof a)if(c instanceof o){if((c.name==t||s.isFunction(t)&&c instanceof t)&&(r.push(c),e))break}else{if((c.name==t||s.isFunction(t)&&c instanceof t)&&(r.push(c),e))break;if(r=r.concat(c.findAll(t)),e&&r.length)break}}return r};var y={};y.names={},y.names.get=function(){return this.__names||(this.__names=[])},y.style={},y.style.set=function(t){var e=this;e.__style=t,e.parent instanceof n?e.__names=e.parent.names.slice():e.__names=[],e.__names.push(e.name),e.children.forEach(function(e){e instanceof n&&(e.style=t)})},n.prototype.__onDom=function(){a.prototype.__onDom.call(this);for(var t=this,e={start:0,first:!0},r=0,n=t.children.length;n>r;r++){var i=t.children[r];t.__domChild(i,r,n,e)}e.empty&&t.__insertBlank(e)},n.prototype.__domChild=function(t,e,r,o,s){var f=this;if(Array.isArray(t)&&t.length)t.forEach(function(t,n){f.__domChild(t,e,r,o,n)});else if(t instanceof a)o.empty&&(f.__insertBlank(o),o.empty=!1),t.emit(i.DOM),o.start++,o.first||o.prev==_.TEXT&&o.start++,o.prev=_.DOM;else if(t instanceof c)f.__domChild(t.v,e,r,o,s);else if(n.isEmptyText(t)){if(!o.first&&o.prev==_.TEXT)return;o.empty=!0,o.prev=_.TEXT}else o.empty=!1,o.prev=_.TEXT;o.first=!1},n.prototype.__insertBlank=function(t){var e=document.createTextNode(""),r=this.element,n=r.childNodes,i=n.length;!i||t.start>=i?r.appendChild(e):r.insertBefore(e,n[t.start])},n.prototype.__onData=function(t){var e=this;for(var r in e.props){var n=e.props[r];if(n instanceof c){var i=!1;if(Array.isArray(n.k)?i=n.k.indexOf(t)>-1:t==n.k&&(i=!0),i){var a=n.v,o=n.cb.call(n.context);a!=o&&(n.v=o,e.__updateAttr(r,o))}}}for(var s,f=[],l={start:0,record:[],first:!0},h=e.children,d=0,_=h.length;_>d;d++){var p=h[d];s=[d],e.__checkObj(t,p,d,_,f,l,s)}if(u.merge(f),f.length){if("textarea"==e.name)return void e.__updateAttr("value",u.value(f[0],e.children));f.forEach(function(t){u.update(t,e.children,e.element)})}},n.prototype.__checkObj=function(t,e,r,n,o,s,f){var l=this;if(e instanceof c){var h=!1,p=Array.isArray(t)?1:0,v=Array.isArray(e.k)?2:0;switch(p+v){case 0:h=t==e.k;break;case 1:h=t.indexOf(e.k)>-1;break;case 2:h=e.k.indexOf(t)>-1;break;case 3:var y={};t.forEach(function(t){y[t]=!0});for(var m=e.k,g=0,n=m.length;n>g;g++)if(y.hasOwnProperty(m[g])){h=!0;break}}if(h){var O=e.v;e.update(O)&&d.diff(this.element,O,e.v,o,s,f)}}else e instanceof a?(delete s.t2d,delete s.d2t,e.emit(i.DATA,t),s.start++,s.first||s.prev!=_.TEXT||s.start++,s.prev=_.DOM):Array.isArray(e)&&e.length?(f.push(0),e.forEach(function(e,i){f[f.length-1]=i,l.__checkObj(t,e,r,n,o,s,f)}),f.pop()):(d.check(s,this.element,e,o,f),u.record(f,s),s.prev=_.TEXT);s.first=!1},n.prototype.__updateAttr=function(t,e){if("dangerouslySetInnerHTML"==t)return void(this.element.innerHTML=e||"");switch(t){case"value":this.element[t]=e||"";break;case"checked":case"selected":case"selectedIndex":case"readOnly":case"multiple":case"defaultValue":case"autofocus":case"async":case"tagName":case"nodeName":case"nodeType":this.element[t]=e||!1;break;case"className":t="class";case"id":case"class":if(this.__style){null===e||void 0===e?this.element.removeAttribute("migi-"+t):this.element.setAttribute("migi-"+t,e);break}default:null===e||void 0===e?this.element.removeAttribute(t):this.element.setAttribute(t,e)}this.__cache[t]=e,this.__style&&this.__updateStyle()},n.prototype.__match=function(t){this.__inline=this.__cache.style||"",this.parent instanceof n?(this.__classes=this.parent.__classes.slice(),this.__ids=this.parent.__ids.slice()):(this.__classes=[],this.__ids=[]);var e=(this.__cache["class"]||"").trim();e?(e=e.split(/\s+/),h(e,function(t,e){return e>t}),this.__classes.push("."+e.join("."))):this.__classes.push("");var r=(this.__cache.id||"").trim();r?this.__ids.push("#"+r):this.__ids.push("");var i=l(this.__names,this.__classes,this.__ids,this.__style,this,t);return i+this.__inline},n.prototype.__updateStyle=function(){var t=this.__match();this.element.getAttribute("style")!=t&&this.element.setAttribute("style",t),this.children.forEach(function(t){t instanceof n&&t.__updateStyle()})},n.prototype.__init=function(t,e){var r=this;r.__selfClose=p.hasOwnProperty(t),e.forEach(function(t){t instanceof a&&(t.__parent=r)})},n.prototype.__reset=function(t,e,r){return void 0===e&&(e={}),void 0===r&&(r=[]),a.prototype.__reset.call(this,t,e,r),this.__init(t,r),this.__hasDes=!1,this},n.prototype.__destroy=function(){return this.__cache={},this.__names=null,this.__classes=null,this.__ids=null,this.__inline=null,this.__hover=!1,this.__active=!1,this.__listener=null,this.__hasDes=!0,this},n.isEmptyText=function(t){return void 0===t||null===t||!t.toString()},n.renderChild=function(t){if(void 0===t||null===t)return"";if(t instanceof a)return t.toString();if(t instanceof c)return t.toString();if(Array.isArray(t)){var e="";return t.forEach(function(t){e+=n.renderChild(t)}),e}return s.encodeHtml(t.toString())},Object.keys(y).forEach(function(t){Object.defineProperty(n.prototype,t,y[t])}),Object.keys(a).forEach(function(t){n[t]=a[t]}),e["default"]=n},function(t,e,r){function n(t,e,r){i.hasOwnProperty("default")&&(i=i["default"]),this.__k=t,this.__context=e,this.__cb=r,this.v=r.call(e)}var i=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),o={};o.k={},o.k.get=function(){return this.__k},o.context={},o.context.get=function(){return this.__context},o.v={},o.v.get=function(){return this.__v},o.v.set=function(t){this.__v=a.clone(t)},o.cb={},o.cb.get=function(){return this.__cb},n.prototype.toString=function(){var t=Array.isArray(this.v)?a.joinArray(this.v):this.v;return void 0===t||null===t?"":t.toString()},n.prototype.update=function(t){var e=this.cb.call(this.context);return a.equal(t,e)?void 0:(this.v=e,!0)},Object.keys(o).forEach(function(t){Object.defineProperty(n.prototype,t,o[t])}),e["default"]=n},function(t,e,r){var n=4096,i=new Array(n),a={index:0,add:function(t){!t.__hasDes&&this.index<n&&(i[this.index++]=t)},get:function(){return i[--this.index]}};e["default"]=a},function(t,e,r){e["default"]={TEXT:0,DOM:1}},function(t,e,r){function n(t,e){this.__context=t,this.__cb=e}var i={};i.context={},i.context.get=function(){return this.__context},i.cb={},i.cb.get=function(){return this.__cb},Object.keys(i).forEach(function(t){Object.defineProperty(n.prototype,t,i[t])}),e["default"]=n},function(t,e,r){function n(t){for(var e=0,r=t.length;r-1>e;e++){var n=t[e],i=t[e+1];n.start==i.start&&(t.splice(e+1,1),e--,r--)}}function i(t,e,r){for(var n="",o=t.shift(),s=e.length;s>o;o++){var c=e[o];if(t.length){if(n+=c instanceof l?i(t,c.v,r):i(t,c,r),r.end)break}else if(c instanceof l)if(Array.isArray(c.v)){if(n+=a(c.v,r),r.end)break}else{if(c.v instanceof f){r.end=!0;break}n+=c.toString()}else{if(c instanceof f){r.end=!0;break}n+=void 0===c||null===c?"":c.toString()}}return n}function a(t,e){for(var r="",n=0,i=t.length;i>n;n++){var o=t[n];if(e.end)break;if(Array.isArray(o))r+=a(o,e);else{if(o instanceof f){e.end=!0;break}r+=void 0===o||null===o?"":o.toString()}}return r}function o(t,e,r){u.hasOwnProperty("default")&&(u=u["default"]);var n=i(t.index,e,{}),a=r.childNodes,o=a[t.start];if(1!=o.nodeType){var s=h.lie?o.innerText:o.textContent;if(n!=s)if(n)if(h.lie||/&([a-z]+|#\d+);/i.test(n)){var c=h.NODE;c.innerHTML=h.encodeHtml(n),r.replaceChild(c.firstChild,o)}else o.textContent=n;else h.lie?o.innerText="":o.textContent=""}}function s(t,e){return u.hasOwnProperty("default")&&(u=u["default"]),i(t.index,e,{})}function c(t,e){(e.first||e.prev==d.DOM)&&(e.record=t.slice())}var f=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),u=function(){var t=r(5);return t.hasOwnProperty("default")?t["default"]:t}(),l=function(){var t=r(6);return t.hasOwnProperty("default")?t["default"]:t}(),h=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),d=function(){var t=r(8);return t.hasOwnProperty("default")?t["default"]:t}();e.merge=n,e.update=o,e.value=s,e.record=c},function(t,e,r){function n(t,e,r,a){if(!(e>=r)){var o=e,s=r,c=o,f=t[c],u=!0;t:for(;s>o;)if(u){for(;s>o;s--)if(a&&a.call(t,f,t[s])||!a&&f>t[s]){i(t,c,s),c=s,u=!u;continue t}}else for(;s>o;o++)if(a&&a.call(t,t[o],f)||!a&&f<t[o]){i(t,c,o),c=o,u=!u;continue t}n(t,e,c,a),n(t,c+1,r,a)}}function i(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}t.exports=function(t,e){if(!Array.isArray(t))throw new Error("quick sort need an array");return t.length<2?t:(n(t,0,t.length-1,e),t)}},function(t,e,r){function n(t){t=[].slice.call(arguments,0),a.apply(this,[].concat(Array.from(t))),this.__handler={},this.__cb=null,this.__flag=!1}var i=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=r(4);return t.hasOwnProperty("default")?t["default"]:t}();(function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t})();!function(){var t=Object.create(a.prototype);t.constructor=n,n.prototype=t}(),n.prototype.__onData=function(t){var e=this,r=this;return r.__flag?void a.prototype.__onData.call(e,t):void(r.__handler.hasOwnProperty(t)||(r.__handler[t]=!0,r.__cb||(r.__cb=!0,setTimeout(function(){var t=Object.keys(r.__handler);r.__handler={},r.__cb=null,t=t.length>1?t:t[0],a.prototype.__onData.call(e,t),r.emit(i.CACHE_DATA,t)},1))))},Object.keys(a).forEach(function(t){n[t]=a[t]}),e["default"]=n},function(t,e,r){function n(t){t=[].slice.call(arguments,0),i.apply(this,[].concat(Array.from(t)))}var i=(function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),function(){var t=r(4);return t.hasOwnProperty("default")?t["default"]:t}());!function(){var t=Object.create(i.prototype);t.constructor=n,n.prototype=t}(),n.prototype.toString=function(){return this.children.length?i.prototype.toString.call(this):""},n.prototype.__onDom=function(){this.__dom=!0},Object.keys(i).forEach(function(t){n[t]=i[t]}),e["default"]=n},function(t,e,r){function n(t,e,r,n,i){var a;if(i){if(n=void 0===n||null===n?"":n.toString()){var o=v.NODE;o.innerHTML=v.encodeHtml(n),a=o.firstChild}else a=document.createTextNode("");r>=e.length?t.appendChild(a):t.replaceChild(a,e[r])}else{if(a=n.toString(),r>=e.length)t.insertAdjacentHTML("beforeend",a);else if(1==e[r].nodeType)e[r].insertAdjacentHTML("afterend",a),t.removeChild(e[r]);else{var o=v.getParent(n.name);o.innerHTML=a,t.replaceChild(o.firstChild,e[r])}n.emit(_.DOM)}}function i(t,e,r,n,i){var a;if(i){if(n=void 0===n||null===n?"":n.toString()){var o=v.NODE;o.innerHTML=v.encodeHtml(n),a=o.firstChild}else a=document.createTextNode("");r>=e.length?t.appendChild(a):t.insertBefore(a,e[r])}else{if(a=n.toString(),r>=e.length)t.insertAdjacentHTML("beforeend",a);else if(1==e[r].nodeType)e[r].insertAdjacentHTML("beforebegin",a);else{var o=v.getParent(n.name);o.innerHTML=a,t.insertBefore(o.firstChild,e[r])}n.emit(_.DOM)}}function a(t,e,r,n,a){if(e instanceof p){switch(n.state){case O:n.start++;break;case w:f(r,n),n.start++,n.t2d=!0;break;case A:n.t2d=!0}i(t,t.childNodes,n.start++,e),n.state=b,n.prev=g.DOM}else{switch(d(n,t,e,r,a),n.state){case O:n.d2t=!0;case w:f(r,n);break;case A:y.record(a,n),i(t,t.childNodes,n.start,e,!0),f(r,n);break;case b:y.record(a,n),i(t,t.childNodes,n.start,e,!0),n.d2t=!0}n.state=w,n.prev=g.TEXT}}function o(t,e,r,n,i){if(e instanceof p){switch(n.state){case O:s(t,n.start+1),n.prev=g.TEXT,n.d2t=!0;break;case w:s(t,n.start+1),n.prev=g.TEXT,n.d2t=!0;break;case A:s(t,n.start),n.state=b,n.prev=g.DOM;break;case b:s(t,n.start),n.prev=g.DOM}m.add(e.__destroy())}else switch(n.state){case O:s(t,n.start+1),f(r,n),n.state=w,n.prev=g.TEXT;break;case w:f(r,n),n.prev=g.TEXT;break;case b:s(t,n.start),n.prev=g.DOM,n.t2d=!0;break;case A:n.prev=g.DOM,n.t2d=!0}}function s(t,e){t.removeChild(t.childNodes[e])}function c(t,e){return(void 0===t||null===t)&&(t=""),(void 0===e||null===e)&&(e=""),t.toString()==e.toString()}function f(t,e){t.push({start:e.start,index:e.record.slice()})}function u(t,e){if(t!==e){var r=t.element;e.__uid=t.uid,e.__element=r;var n=Object.keys(t.props),i=Object.keys(e.props),a={};n.forEach(function(r){if(!/^on[A-Z]/.test(r)){a[r]=!0;var n=t.props[r],i=e.props[r];n!==i&&t.__updateAttr(r,i)}}),t.__removeListener(),i.forEach(function(t){if(/^on[A-Z]/.test(t)){var r=t.slice(2).replace(/[A-Z]/g,function(t){return t.toLowerCase()});e.__addListener(r,function(r){var n=e.props[t];n(r)})}else a.hasOwnProperty(t)||e.__updateAttr(t,e.props[t])});for(var o,s=[],c={start:0,record:[],first:!0},f=0,u=Math.min(t.children.length,e.children.length);u>f;f++){var l=t.children[f],d=e.children[f];o=[f],h(r,l,d,s,c,o)}if(y.merge(s),s.length){if("textarea"==e.name)return void e.__updateAttr("value",y.value(s[0],e.children));s.forEach(function(t){y.update(t,e.children,r)})}m.add(t.__destroy())}}function l(t,e,r,n,i,a){i.first||(i.prev==g.TEXT?i.state=w:i.state=b),h(t,e,r,n,i,a,!0),i.t2d||i.d2t||(i.state==A?i.t2d=!0:i.state==O&&(i.d2t=!0))}function h(t,e,r,s,l,v,k){var E=Array.isArray(e),P=Array.isArray(r);if(E&&P){var T=e.length,D=r.length,x=T?1:0,M=D?2:0;switch(v.push(0),l.first&&y.record(v,l),x+M){case 0:l.state=w,l.prev=g.TEXT;break;case 1:h(t,e[0],r[0],s,l,v,k);for(var C=1;T>C;C++)o(t,e[C],s,l,v);break;case 2:h(t,e[0],r[0],s,l,v,k);for(var C=1;D>C;C++)v[v.length-1]=C,a(t,r[C],s,l,v);break;case 3:for(var C=0,L=Math.min(T,D);L>C;C++)v[v.length-1]=C,h(t,e[C],r[C],s,l,v,k&&!C);for(var j=C;T>j;j++)o(t,e[j],s,l,v);for(var j=C;D>j;j++)v[v.length-1]=C,a(t,r[j],s,l,v)}v.pop()}else if(E){h(t,e[0],r,s,l,v,k);for(var C=1,L=e.length;L>C;C++)o(t,e[C],s,l,v)}else if(P){v.push(0),h(t,e,r[0],s,l,v,k);for(var C=1,L=r.length;L>C;C++)v[v.length-1]=C,a(t,r[C],s,l,v);v.pop()}else{var S=e instanceof p?1:0,H=r instanceof p?2:0;switch(S+H){case 0:!l.first&&k&&d(l,t,r,s,v),y.record(v,l);var N=t.childNodes;if(l.first)c(e,r)||f(s,l);else if(c(e,r))switch(l.state){case O:f(s,l),t.removeChild(N[l.start+1]);break;case A:f(s,l),i(t,N,l.start,r,!0)}else switch(l.state){case O:f(s,l),t.removeChild(N[l.start+1]);break;case A:f(s,l),i(t,N,l.start,r,!0);break;case b:y.record(v,l);case w:c(e,r)||f(s,l)}l.state=w,l.prev=g.TEXT;break;case 1:y.record(v,l);var N=t.childNodes;if(l.first)n(t,N,l.start,r,!0);else switch(l.state){case O:case w:f(s,l),t.removeChild(N[l.start+1]);break;case A:n(t,N,l.start++,r,!0);break;case b:n(t,N,l.start,r,!0)}m.add(e.__destroy()),l.state=O,l.prev=g.TEXT;break;case 2:var N=t.childNodes;if(l.first)n(t,N,l.start++,r);else switch(l.state){case O:l.start++;case b:n(t,N,l.start++,r);break;case A:i(t,N,l.start++,r);break;case w:f(s,l),i(t,N,++l.start,r),l.start++}l.state=A,l.prev=g.DOM;break;case 3:if(!l.first){switch(l.state){case O:case w:l.start++}delete l.t2d,delete l.d2t}e.name==r.name?u(e,r):(t.insertAdjacentHTML("afterend",r.toString()),t.parentNode.removeChild(t),r.emit(_.DOM),m.add(e.__destroy())),l.state=b,l.prev=g.DOM,l.start++}}l.first=!1}function d(t,e,r,n,a){t.t2d?(delete t.t2d,y.record(a,t),i(e,e.childNodes,t.start,r,!0)):t.d2t&&(delete t.d2t,f(n,t),s(e,t.start+1))}var _=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),p=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),v=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),y=function(){var t=r(10);return t.hasOwnProperty("default")?t["default"]:t}(),m=function(){var t=r(7);return t.hasOwnProperty("default")?t["default"]:t}(),g=function(){var t=r(8);return t.hasOwnProperty("default")?t["default"]:t}(),O=0,b=1,A=2,w=3;e.diff=l,e.check=d},function(t,e,r){function n(t,e,r,n,a,s){o.hasOwnProperty("default")&&(o=o["default"]);var f=[],u={};i(t.length-1,t,e,r,n,a,f,String(t.length-1),u,s),c(f,function(t,e){return t[2]==e[2]?t[0]>e[0]:t[2]>e[2]});var l="";return f.forEach(function(t){l+=t[1]+";"}),l}function i(t,e,r,n,o,f,u,l,h,d){h[l]=!0;var _=[];_.push(e[t]),r[t]&&_.push(r[t]),n[t]&&_.push(n[t]),c(_,function(t,e){return e>t});for(var p=0,v=_.length;v>p;p++)for(var y=_[p],m=p+1;v>m;m++)y+=_[m],_.push(y);for(var p=0,v=_.length;v>p;p++){var m=_[p];if(o.hasOwnProperty(m)){var g=o[m];if(t){o._d&&i(t-1,e,r,n,g,f.parent,u,l+","+(t-1)+":"+p,h);for(var O=t-2;O>=0;O--){var b=l+","+O+":"+p;h.hasOwnProperty(b)||i(O,e,r,n,g,f.parent,u,b,h)}}if(g.hasOwnProperty("_v")&&a(u,g),d&&g.hasOwnProperty("_:")&&g["_:"].forEach(function(t){t[0].forEach(function(t){switch(t){case"hover":f.on(s.DOM,function(){f.element.addEventListener("mouseenter",function(t){f.__hover=!0,f.__updateStyle()}),f.element.addEventListener("mouseleave",function(t){f.__hover=!1,f.__updateStyle()})});break;case"active":f.on(s.DOM,function(){f.element.addEventListener("mousedown",function(t){f.__active=!0,f.__updateStyle()}),document.body.addEventListener("mouseup",function(t){f.__active=!1,f.__updateStyle()},!0),window.addEventListener("blur",function(t){f.__active=!1,f.__updateStyle()}),window.addEventListener("dragend",function(t){f.__active=!1,f.__updateStyle()})})}})}),g.hasOwnProperty("_:")){var A=g["_:"];A.forEach(function(o){
var s=o[0],c=!0;t:for(var d=0,_=s.length;_>d;d++)switch(s[d]){case"hover":if(!f.__hover){c=!1;break t}break;case"active":if(!f.__active){c=!1;break t}break;case"first-child":if(!f.isFirst()){c=!1;break t}break;case"last-child":if(!f.isLast()){c=!1;break t}break;default:c=!1}c&&(A=o[1],t&&i(t-1,e,r,n,A,f.parent,u,l+","+(t-1)+":"+d,h),A.hasOwnProperty("_v")&&a(u,A))})}if(g.hasOwnProperty("_[")){var A=g["_["];A.forEach(function(o){var s=o[0],c=!0;t:for(var d=0,_=s.length;_>d;d++){var p=s[d];if(1==p.length){if(!f.__cache.hasOwnProperty(p[0])){c=!1;break}}else{var v=f.__cache[p[0]];if(void 0===v){c=!1;break t}var y=p[2];switch(p[1]){case"=":c=v==y;break;case"^=":c=0==v.indexOf(y);break;case"$=":c=v.length>=y.length&&v.indexOf(y)==v.length-y.length;break;case"~=":var m=new RegExp("\\b"+y+"\\b");c=m.test(v);break;case"*=":c=v.indexOf(y)>-1;break;case"|=":c=0==v.indexOf(y)||0==v.indexOf(y+"-");break;default:c=!1;break t}if(!c)break t}}c&&(A=o[1],t&&i(t-1,e,r,n,A,f.parent,u,l+","+(t-1)+":"+d,h),A.hasOwnProperty("_v")&&a(u,A))})}}}}function a(t,e){e._v.forEach(function(r){r[2]=e._p,t.push(r)})}var o=function(){var t=r(5);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),c=function(){var t=r(11);return t.hasOwnProperty("default")?t["default"]:t}();e["default"]=n},function(t,e,r){var n=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),i=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=r(4);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=r(5);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=r(13);return t.hasOwnProperty("default")?t["default"]:t}(),c=function(){var t=r(12);return t.hasOwnProperty("default")?t["default"]:t}(),f=(function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),function(){var t=r(6);return t.hasOwnProperty("default")?t["default"]:t}()),u=function(){var t=r(9);return t.hasOwnProperty("default")?t["default"]:t}(),l=function(){var t=r(7);return t.hasOwnProperty("default")?t["default"]:t}(),h={render:function(t,e){return e&&t.inTo(e),t},createCp:function(t,e,r){return new t(e,r)},createVd:function(t,e,r){return l.index?l.get().__reset(t,e,r):new o(t,e,r)},Event:n,eventBus:n.mix({}),Element:i,Component:a,NonVisualComponent:s,CacheComponent:c,VirtualDom:o,Obj:f,Cb:u};"undefined"!=typeof window&&(window.migi=h),e["default"]=h}]);