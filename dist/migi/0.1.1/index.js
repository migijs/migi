!function(t){function e(n){if(r[n])return r[n].exports;var a=r[n]={exports:{},id:n,loaded:!1};return t[n].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){t.exports=r(17)["default"]},function(t,e,r){function n(t){if(t instanceof c)return t;if(i(t))return t;var e=Array.isArray(t)?[]:{};for(var r in t)t.hasOwnProperty(r)&&(t[r]instanceof c?e[r]=t[r]:b.isDate(t[r])?e[r]=new Date(t[r]):e[r]=b.isObject(t[r])?n(t[r]):t[r]);return e}function a(t){return function(e){return u.call(e)=="[object "+t+"]"}}function i(t){return void 0===t||null===t||b.isBoolean(t)||b.isNumber(t)||b.isString(t)}function o(t,e){if(t instanceof c||e instanceof c)return t==e;if(i(t)||i(e))return t===e;if(Array.isArray(t)){if(!Array.isArray(e))return!1;if(t.length!=e.length)return!1;for(var r=0,n=t.length;n>r;r++)if(!o(t[r],e[r]))return!1;return!0}if(b.isDate(t))return b.isDate(e)?t-e==0:!1;if(b.isObject(t)){if(!b.isObject(e))return!1;var a=Object.keys(t),s=Object.keys(e);if(a.length!==s.length)return!1;for(var r=0,n=a.length;n>r;r++)if(!e.hasOwnProperty(r)||!o(t[r],e[r]))return!1;return!0}}function s(t,e){var r="";return t.forEach(function(t){r+=Array.isArray(t)?s(t):t instanceof c?t.toString():void 0===t||null===t?"":b.encodeHtml(t.toString(),e)}),r}var c=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),u={}.toString,f=document.createElement("div"),l=document.createElement("table"),h=document.createElement("tbody"),d=document.createElement("tr"),_=document.createElement("ul"),p=document.createElement("dl"),v=document.createElement("select"),y=document.createElement("menu"),m=!1,b={clone:function(t){return c.hasOwnProperty("default")&&(c=c["default"]),n(t)},isObject:a("Object"),isString:a("String"),isFunction:a("Function"),isNumber:a("Number"),isBoolean:a("Boolean"),isDate:a("Date"),equal:function(t,e){return c.hasOwnProperty("default")&&(c=c["default"]),o(t,e)},encodeHtml:function(t,e){return e?t.replace(/"/g,"&quot;"):t.replace(/</g,"&lt;")},NODE:f,getParent:function(t){switch(t){case"td":return d;case"tr":return h;case"tbody":case"thead":case"col":return l;case"li":return _;case"dt":case"dd":return p;case"option":return v;case"menuitem":return y;default:return f}},lie:m,version:function(){if(m){for(var t=5;f.innerHTML="<!--[if gt IE "+ ++t+"]>1<![endif]-->",f.innerHTML;);return t}}(),joinArray:function(t,e){return c.hasOwnProperty("default")&&(c=c["default"]),s(t,e)}};e["default"]=b},function(t,e,r){function n(){this.__hash={}}n.prototype.on=function(t,e){var r=this;if(Array.isArray(t))t.forEach(function(t){r.on(t,e)});else if(e){r.__hash.hasOwnProperty(t)||(r.__hash[t]=[]);for(var n=0,a=r.__hash[t],i=a.length;i>n;n++)if(a[n]===e)return this;r.__hash[t].push(e)}return this},n.prototype.once=function(t,e){var r=this;return Array.isArray(t)?t.forEach(function(t){r.once(t,e)}):e&&r.on(t,function(n){n=[].slice.call(arguments,0),e.apply(r,n),r.off(t,arguments.callee)}),this},n.prototype.off=function(t,e){var r=this;if(Array.isArray(t))t.forEach(function(t){r.off(t,e)});else if(r.__hash.hasOwnProperty(t))if(e){for(var n=0,a=r.__hash[t],i=a.length;i>n;n++)if(a[n]===e){a.splice(n,1);break}}else delete r.__hash[t];return this},n.prototype.emit=function(t,e){e=[].slice.call(arguments,1);var r=this;if(Array.isArray(t))t.forEach(function(t){r.emit(t,e)});else if(r.__hash.hasOwnProperty(t)){var n=r.__hash[t].slice();n.forEach(function(t){t.apply(r,e)})}return this},n.mix=function(t){t=[].slice.call(arguments,0),t.forEach(function(t){var e=new n;t.__hash={};var r=["on","once","off","emit"];r.forEach(function(r){t[r]=e[r]})})},n.DOM="__0",n.DESTROY="__1",n.DATA="__2",n.CACHE_DATA="__3",e["default"]=n},function(t,e,r){function n(t){return o.isString(t)?document.querySelector(t):t}function a(t,e,r){i.call(this),this.__uid=s++,this.__reset(t,e,r)}var i=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),s=0;!function(){var t=Object.create(i.prototype);t.constructor=a,a.prototype=t}(),a.prototype.__reset=function(t,e,r){this.__name=t,this.__props=e,this.__children=r,this.__element=null,this.__parent=null,this.__style=null,this.__dom=!1,this.once(i.DOM,this.__onDom)},a.prototype.__clean=function(){this.$dom&&this.$element.parentNode.removeChild(this.$element)},a.prototype.__onDom=function(){this.__dom=!0};var c={};c.$name={},c.$name.get=function(){return this.__name},c.$props={},c.$props.get=function(){return this.__props},c.$children={},c.$children.get=function(){return this.__children},c.$parent={},c.$parent.get=function(){return this.__parent},c.$uid={},c.$uid.get=function(){return this.__uid},c.$element={},c.$element.get=function(){return this.__element||(this.__element=document.querySelector(this.$name+'[migi-uid="'+this.$uid+'"]'))},c.$dom={},c.$dom.get=function(){return this.__dom},a.prototype.$inTo=function(t){this.__clean();var e=this.toString();n(t).innerHTML=e,this.emit(i.DOM)},a.prototype.$appendTo=function(t){this.__clean();var e=this.toString();t=n(t),t.insertAdjacentHTML("beforeend",e),this.emit(i.DOM)},a.prototype.$prependTo=function(t){this.__clean();var e=this.toString();t=n(t),t.insertAdjacentHTML("afterbegin",e),this.emit(i.DOM)},a.prototype.$before=function(t){this.__clean();var e=this.toString();t=n(t),t.insertAdjacentHTML("beforebegin",e),this.emit(i.DOM)},a.prototype.$after=function(t){this.__clean();var e=this.toString();t=n(t),t.insertAdjacentHTML("afterend",e),this.emit(i.DOM)},a.prototype.$replace=function(t){this.__clean();var e=this.toString();t=n(t),t.insertAdjacentHTML("afterend",e),t.parentNode.removeChild(t),this.emit(i.DOM)},a.__clean=function(){s=0},Object.keys(c).forEach(function(t){Object.defineProperty(a.prototype,t,c[t])}),Object.keys(i).forEach(function(t){a[t]=i[t]}),e["default"]=a},function(t,e,r){function n(t,e){void 0===t&&(t={}),void 0===e&&(e=[]);var r=this,n=r.constructor.toString();n=/^function\s+([\w$]+)/.exec(n)[1],i.call(this,n,t,e),r.__virtualDom=null,Object.keys(t).forEach(function(e){if(/^on[A-Z]/.test(e)){var n=e.slice(2).replace(/[A-Z]/g,function(t){return t.toLowerCase()}),a=t[e];r.on(n,function(t){t=[].slice.call(arguments,0),a.apply(this,[].concat(Array.from(t)))})}}),r.on(a.DATA,r.__onData)}var a=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),i=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=r(5);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),c=function(){var t=r(10);return t.hasOwnProperty("default")?t["default"]:t}(),u={},f={};!function(){var t=Object.create(i.prototype);t.constructor=n,n.prototype=t}(),n.prototype.render=function(){return new o("div",this.$props,this.$children)},n.prototype.toString=function(){return this.__virtualDom=this.render(),this.$virtualDom.__parent=this,this.__style&&(this.$virtualDom.$style=this.__style),this.$virtualDom.toString()},n.prototype.$findChild=function(t){return this.$findChildren(t,!0)[0]},n.prototype.$findChildren=function(t,e){for(var r=[],a=0,o=this.$children.length;o>a;a++){var c=this.$children[a];if(c instanceof i)if(c instanceof n){if((c.$name==t||s.isFunction(t)&&c instanceof t)&&(r.push(c),e))break}else{if((c.$name==t||s.isFunction(t)&&c instanceof t)&&(r.push(c),e))break;if(r=r.concat(c.$findAll(t)),e&&r.length)break}}return r},n.prototype.$find=function(t){return this.$findAll(t,!0)[0]},n.prototype.$findAll=function(t,e){return this.$virtualDom.$findAll(t,e)},n.prototype.__bicb=function(t,e,r,n){if(!u.hasOwnProperty(t.$uid)){u[t.$uid]=!0,t.__flag=!0,Array.isArray(e)||(e=[e]);for(var a=0,i=e.length;i>a;a++){var o=e[a];(!r||r.indexOf(o)>-1)&&(n&&-1!=n.indexOf(o)||(t[o]=this[o]))}t.__flag=!1}},n.prototype.$bind=function(t,e,r){var i=this;if(t==this)throw new Error("can not bind self: "+i.$name);if(!(t instanceof c||t instanceof n))throw new Error("can only bind to EventBus/Component: "+i.$name);i.on(i instanceof migi.CacheComponent?a.CACHE_DATA:a.DATA,function(n,a){a!=i.__bicb&&(u={},u[i.$uid]=!0),i.__bicb(t,n,e,r)}),t.on(t instanceof migi.CacheComponent?a.CACHE_DATA:a.DATA,function(n,a){a!=t.__bicb&&(u={},u[t.$uid]=!0),t.__bicb(i,n,e,r)})},n.prototype.$bindTo=function(t,e,r){t.$bind(this,e,r)},n.prototype.__brcb=function(t,e,r){if(!f.hasOwnProperty(t.$uid)){f[t.$uid]=!0,t.__flag=!0,Array.isArray(e)||(e=[e]);for(var n=0,i=e.length;i>n;n++){var o=e[n];if(r.hasOwnProperty(o)){var u=r[o];if(t instanceof c){if(s.isFunction(u))t.emit(a.DATA,o,u(this[o]));else if(s.isString(u))t.emit(a.DATA,u,this[o]);else if(u.name){var l=u.middleware?u.middleware.call(this,this[o]):this[o];t.emit(a.DATA,u.name,l)}}else if(s.isFunction(u))t[o]=u(this[o]);else if(s.isString(u))t[u]=this[o];else if(u.name){var l=u.middleware?u.middleware.call(this,this[o]):this[o];t[u.name]=l}}}t.__flag=!1}},n.prototype.$bridge=function(t,e){var r=this;if(t==this)throw new Error("can not bridge self: "+r.$name);if(!(t instanceof c||t instanceof n))throw new Error("can only bridge to EventBus/Component: "+r.$name);r.on(r instanceof migi.CacheComponent?a.CACHE_DATA:a.DATA,function(n,a){a!=r.__brcb&&a!=t.__brcb&&(f={},f[r.$uid]=!0),r.__brcb(t,n,e)})},n.prototype.$bridgeTo=function(t,e){t.$bridge(this,e)};var l={};l.$virtualDom={},l.$virtualDom.get=function(){return this.__virtualDom},l.$element={},l.$element.get=function(){return this.$virtualDom?this.$virtualDom.$element:null},l.$style={},l.$style.set=function(t){this.__style=t},n.prototype.__onDom=function(){function t(t){t=t||window.event,t.target!=e.$element&&t.srcElement!=e.$element&&t.stopPropagation()}i.prototype.__onDom.call(this);var e=this;e.$virtualDom.emit(a.DOM),e.$element.setAttribute("migi-name",this.$name),e.$props.allowPropagation||["click","dblclick","focus","blur","change","contextmenu","mousedown","mousemove","mouseover","mouseup","mouseout","mousewheel","resize","scroll","select","submit","DOMActivate","DOMFocusIn","DOMFocusOut","keydown","keypress","keyup","drag","dragstart","dragover","dragenter","dragleave","dragend","drop","formchange","forminput","input","cut","paste","reset","touch","touchstart","touchmove","touchend"].forEach(function(r){e.$element.addEventListener(r,t)})},n.prototype.__onData=function(t,e){this.$virtualDom&&this.$virtualDom.__onData(t),this.$children.forEach(function(r){r instanceof n?r.emit(a.DATA,t,e):r instanceof o&&r.__onData(t)})},n.prototype.__destroy=function(){return this.emit(a.DESTROY),this.__hash={},this.$virtualDom.__destroy()},Object.keys(l).forEach(function(t){Object.defineProperty(n.prototype,t,l[t])}),Object.keys(i).forEach(function(t){n[t]=i[t]}),e["default"]=n},function(t,e,r){function n(t,e,r){if(void 0===e&&(e={}),void 0===r&&(r=[]),c.hasOwnProperty("default")&&(c=c["default"]),y.hasOwnProperty(t)&&r.length)throw new Error("self-close tag can not has chilren nodes: "+t);s.call(this,t,e,r);var n=this;n.__cache={},n.__names=null,n.__classes=null,n.__ids=null,n.__inline=null,n.__hover=!1,n.__active=!1,n.__listener=null,n.__init(t,r)}function a(t){return void 0===t||null===t||!t.toString()}function i(t){if(void 0===t||null===t)return"";if(t instanceof s||t instanceof f)return t.toString();if(Array.isArray(t)){var e="";return t.forEach(function(t){e+=i(t)}),e}return u.encodeHtml(t.toString())}var o=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),c=function(){var t=r(4);return t.hasOwnProperty("default")?t["default"]:t}(),u=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),f=function(){var t=r(7);return t.hasOwnProperty("default")?t["default"]:t}(),l=function(){var t=r(6);return t.hasOwnProperty("default")?t["default"]:t}(),h=function(){var t=r(12);return t.hasOwnProperty("default")?t["default"]:t}(),d=function(){var t=r(16);return t.hasOwnProperty("default")?t["default"]:t}(),_=function(){var t=r(8);return t.hasOwnProperty("default")?t["default"]:t}(),p=function(){var t=r(15);return t.hasOwnProperty("default")?t["default"]:t}(),v=function(){var t=r(9);return t.hasOwnProperty("default")?t["default"]:t}(),y={img:!0,meta:!0,link:!0,br:!0,basefont:!0,base:!0,col:!0,embed:!0,frame:!0,hr:!0,input:!0,keygen:!0,area:!0,param:!0,source:!0,track:!0,wbr:!0},m={checked:!0,selected:!0,selectedIndex:!0,readOnly:!0,multiple:!0,defaultValue:!0,autofocus:!0,async:!0,tagName:!0,nodeName:!0,nodeType:!0};!function(){var t=Object.create(s.prototype);t.constructor=n,n.prototype=t}(),n.prototype.toString=function(){var t=this,e="<"+t.$name;if(Object.keys(t.$props).forEach(function(r){var n=t.__renderProp(r);e+=n}),t.__style){var r=t.__match(!0);r&&(e=e.indexOf(' style="')>1?e.replace(/ style="[^"]*"/,' style="'+r+'"'):e+' style="'+r+'"')}return e+=' migi-uid="'+t.$uid+'"',t.__checkListener(),t.__selfClose?e+"/>":(e+=">",e+=t.__renderChildren(),e+="</"+t.$name+">")},n.prototype.$isFirst=function(t){if(this.$parent instanceof c)return!0;t=t||this.$parent.$children;for(var e=0,r=t.length;r>e;e++){var a=t[e];if(Array.isArray(a)&&a.length)return this.$isFirst(a);if(a==this)return!0;if(a instanceof n)return!1;if(a instanceof f&&(a=a.v,Array.isArray(a)&&a.length))return this.$isFirst(a)}},n.prototype.$isLast=function(t){if(this.$parent instanceof c)return!0;t=t||this.$parent.$children;for(var e=t.length-1;e>=0;e--){var r=t[e];if(Array.isArray(r)&&r.length)return this.$isLast(r);if(r==this)return!0;if(r instanceof n)return!1;if(r instanceof f&&(r=r.v,Array.isArray(r)&&r.length))return this.$isLast(r)}},n.prototype.__renderProp=function(t){var e=this,r=e.$props[t],n="";if(/^on[A-Z]/.test(t))e.once(o.DOM,function(){var r=t.slice(2).replace(/[A-Z]/g,function(t){return t.toLowerCase()});e.__addListener(r,function(r){var n=e.$props[t];n instanceof l?n.cb.call(n.context,r):n(r)})});else if(r instanceof f){var a=r.toString(!0);if("dangerouslySetInnerHTML"==t)return e.once(o.DOM,function(){e.$element.innerHTML=a}),"";e.__cache[t]=a,(!m.hasOwnProperty(t)||r.v)&&(n=" "+t+'="'+u.encodeHtml(a,!0)+'"')}else{var a=Array.isArray(r)?u.joinArray(r):void 0===r||null===r?"":r.toString();if("dangerouslySetInnerHTML"==t)return e.once(o.DOM,function(){e.$element.innerHTML=a}),"";"className"==t&&(t="class"),e.__cache[t]=a,(!m.hasOwnProperty(t)||r)&&(n=" "+t+'="'+u.encodeHtml(a,!0)+'"')}if(e.__style)switch(t){case"class":case"id":n=" migi-"+n.slice(1)}return n},n.prototype.__renderChildren=function(){var t=this,e="";return t.$children.forEach(function(t){e+=i(t)}),e},n.prototype.__checkListener=function(){var t=this;if("input"==t.$name){if(t.$props.hasOwnProperty("value")){var e=t.$props.value;e instanceof f&&t.once(o.DOM,function(){function r(){e.v=this.value;var t=e.k;e.context[t]=this.value}var n=t.__cache.type;switch((void 0===n||null===n)&&(n=""),n.toLowerCase()){case"button":case"hidden":case"image":case"file":case"reset":case"submit":break;case"checkbox":case"radio":case"range":case"color":t.__addListener("change",r);break;default:t.__addListener(["input","paste","cut"],r)}})}}else if("select"==t.$name){if(t.$props.hasOwnProperty("value")){var e=t.$props.value;e instanceof f&&t.once(o.DOM,function(){function r(){e.v=this.value;var t=e.k;e.context[t]=this.value}t.__addListener("change",r)})}}else if("textarea"==t.$name&&1==t.$children.length){var r=t.$children[0];r instanceof f&&t.once(o.DOM,function(){function e(t){r.v=this.value;var e=r.k;r.context[e]=this.value}t.__addListener(["input","paste","cut"],e)})}},n.prototype.__addListener=function(t,e){var r=this;if(Array.isArray(t))t.forEach(function(t){r.__addListener(t,e)});else{if(r.__listener=r.__listener||{},r.__listener.hasOwnProperty(t)){var n=r.__listener[t];Array.isArray(n)?n.push(e):r.__listener[t]=[n,e]}else r.__listener[t]=e;r.$element.addEventListener(t,e)}},n.prototype.__removeListener=function(){var t=this;t.__listener&&Object.keys(t.__listener).forEach(function(e){var r=t.__listener[e];Array.isArray(r)?r.forEach(function(r){t.$element.removeEventListener(e,r)}):t.$element.removeEventListener(e,r)})},n.prototype.$find=function(t){return this.$findAll(t,!0)[0]},n.prototype.$findAll=function(t,e){return this.__findAll(t,this.$children,[],e)},n.prototype.__findAll=function(t,e,r,n){for(var a=0,i=e.length;i>a;a++){var o=e[a];if(o instanceof s?r=this.__findEq(t,o,r,n):o instanceof f?(o=o.v,Array.isArray(o)?this.__findAll(t,o,r,n):o instanceof s&&(r=this.__findEq(t,o,r,n))):Array.isArray(o)&&this.__findAll(t,o,r,n),n&&r.length)break}return r},n.prototype.__findEq=function(t,e,r,n){if(e instanceof c)(e.$name==t||u.isFunction(t)&&e instanceof t)&&r.push(e);else{if((e.$name==t||u.isFunction(t)&&e instanceof t)&&(r.push(e),n))return r;r=r.concat(e.$findAll(t,n))}return r};var b={};b.$names={},b.$names.get=function(){return this.__names||(this.__names=[])},b.$style={},b.$style.set=function(t){var e=this;e.__style=t,e.$parent instanceof n?e.__names=e.$parent.$names.slice():e.__names=[],e.__names.push(e.$name),e.$children.forEach(function(e){e instanceof n&&(e.$style=t)})},n.prototype.__onDom=function(){s.prototype.__onDom.call(this);for(var t=this,e={start:0,first:!0},r=0,n=t.$children.length;n>r;r++){var a=t.$children[r];t.__domChild(a,r,n,e)}e.empty&&t.__insertBlank(e.start)},n.prototype.__domChild=function(t,e,r,n){var i=this;if(Array.isArray(t)&&t.length)t.forEach(function(t){i.__domChild(t,e,r,n)});else if(t instanceof s&&!(t instanceof migi.NonVisualComponent))n.empty&&(i.__insertBlank(n.start),n.empty=!1),t.emit(o.DOM),n.start++,n.first||n.prev==v.TEXT&&n.start++,n.prev=v.DOM;else if(t instanceof f)i.__domChild(t.v,e,r,n);else if(a(t)){if(t instanceof migi.NonVisualComponent&&t.emit(o.DOM),!n.first&&n.prev==v.TEXT)return;n.empty=!0,n.prev=v.TEXT}else n.empty=!1,n.prev=v.TEXT;n.first=!1},n.prototype.__insertBlank=function(t){var e=document.createTextNode(""),r=this.$element,n=r.childNodes,a=n.length;!a||t>=a?r.appendChild(e):r.insertBefore(e,n[t])},n.prototype.__onData=function(t){var e=this;for(var r in e.$props){var n=e.$props[r];if(n instanceof f){var a=!1;if(Array.isArray(n.k)?a=n.k.indexOf(t)>-1:t==n.k&&(a=!0),a){var i=n.v,o=n.cb.call(n.context);i!=o&&(n.v=o,e.__updateAttr(r,o))}}}for(var s,c=[],u={start:0,record:[],first:!0},l=e.$children,d=0,_=l.length;_>d;d++){var p=l[d];s=[d],e.__checkObj(t,p,d,_,c,u,s)}if(c.length){if("textarea"==e.$name)return void e.__updateAttr("value",h.value(c[0],e.$children));c.forEach(function(t){h.update(t,e.$children,e.$element)})}},n.prototype.__checkObj=function(t,e,r,a,i,o,c){var u=this;if(e instanceof f){var l=!1,d=Array.isArray(t)?1:0,_=Array.isArray(e.k)?2:0;switch(d+_){case 0:l=t==e.k;break;case 1:l=t.indexOf(e.k)>-1;break;case 2:l=e.k.indexOf(t)>-1;break;case 3:var y={};t.forEach(function(t){y[t]=!0});for(var m=e.k,b=0,a=m.length;a>b;b++)if(y.hasOwnProperty(m[b])){l=!0;break}}if(l){var g=e.v;e.update(g)&&p.diff(this.$element,g,e.v,i,o,c)}}else e instanceof s?(delete o.t2d,delete o.d2t,e instanceof n&&e.__onData(t),o.start++,o.first||o.prev!=v.TEXT||o.start++,o.prev=v.DOM):Array.isArray(e)&&e.length?(c.push(0),e.forEach(function(e,n){c[c.length-1]=n,u.__checkObj(t,e,r,a,i,o,c)}),c.pop()):(p.check(o,this.$element,e,i,c),h.record(c,o),o.prev=v.TEXT);o.first=!1},n.prototype.__updateAttr=function(t,e){if("dangerouslySetInnerHTML"==t)return void(this.$element.innerHTML=e||"");switch(t){case"value":this.$element[t]=e||"";break;case"checked":case"selected":case"selectedIndex":case"readOnly":case"multiple":case"defaultValue":case"autofocus":case"async":case"tagName":case"nodeName":case"nodeType":this.$element[t]=e||!1;break;case"className":t="class";case"id":case"class":if(this.__style){null===e||void 0===e?this.$element.removeAttribute("migi-"+t):this.$element.setAttribute("migi-"+t,e);break}default:null===e||void 0===e?this.$element.removeAttribute(t):this.$element.setAttribute(t,e)}this.__cache[t]=e,this.__style&&this.__updateStyle()},n.prototype.__match=function(t){this.__inline=this.__cache.style||"",this.$parent instanceof n?(this.__classes=this.$parent.__classes.slice(),this.__ids=this.$parent.__ids.slice()):(this.__classes=[],this.__ids=[]);var e=(this.__cache["class"]||"").trim();e?(e=e.split(/\s+/),_(e,function(t,e){return e>t}),this.__classes.push("."+e.join("."))):this.__classes.push("");var r=(this.__cache.id||"").trim();r?this.__ids.push("#"+r):this.__ids.push("");var a=d(this.__names,this.__classes,this.__ids,this.__style,this,t);return a+this.__inline},n.prototype.__updateStyle=function(){var t=this.__match();this.$element.getAttribute("style")!=t&&this.$element.setAttribute("style",t),this.$children.forEach(function(t){t instanceof n&&t.__updateStyle()})},n.prototype.__init=function(t,e){var r=this;r.__selfClose=y.hasOwnProperty(t),e.forEach(function(t){t instanceof s&&(t.__parent=r)})},n.prototype.__reset=function(t,e,r){return void 0===e&&(e={}),void 0===r&&(r=[]),s.prototype.__reset.call(this,t,e,r),this.__init(t,r),this.__hasDes=!1,this},n.prototype.__destroy=function(){return this.__hash={},this.__cache={},this.__names=null,this.__classes=null,this.__ids=null,this.__inline=null,this.__hover=!1,this.__active=!1,this.__listener=null,this.__hasDes=!0,this},Object.keys(b).forEach(function(t){Object.defineProperty(n.prototype,t,b[t])}),Object.keys(s).forEach(function(t){n[t]=s[t]}),e["default"]=n},function(t,e,r){function n(t,e){this.__context=t,this.__cb=e}var a={};a.context={},a.context.get=function(){return this.__context},a.cb={},a.cb.get=function(){return this.__cb},Object.keys(a).forEach(function(t){Object.defineProperty(n.prototype,t,a[t])}),e["default"]=n},function(t,e,r){function n(t,e,r){a.hasOwnProperty("default")&&(a=a["default"]),this.__k=t,this.__context=e,this.__cb=r,this.v=r.call(e)}var a=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),i=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),o={};o.k={},o.k.get=function(){return this.__k},o.context={},o.context.get=function(){return this.__context},o.v={},o.v.get=function(){return this.__v},o.v.set=function(t){this.__v=i.clone(t)},o.cb={},o.cb.get=function(){return this.__cb},n.prototype.toString=function(t){if(Array.isArray(this.v))return i.joinArray(this.v,t);if(void 0===this.v||null===this.v)return"";var e=this.v.toString();return t?i.encodeHtml(e,t):this.v instanceof a?e:i.encodeHtml(e,t)},n.prototype.update=function(t){var e=this.cb.call(this.context);return i.equal(t,e)?void 0:(this.v=e,!0)},Object.keys(o).forEach(function(t){Object.defineProperty(n.prototype,t,o[t])}),e["default"]=n},function(t,e,r){function n(t,e,r,i){if(!(e>=r)){var o=e,s=r,c=o,u=t[c],f=!0;t:for(;s>o;)if(f){for(;s>o;s--)if(i&&i.call(t,u,t[s])||!i&&u>t[s]){a(t,c,s),c=s,f=!f;continue t}}else for(;s>o;o++)if(i&&i.call(t,t[o],u)||!i&&u<t[o]){a(t,c,o),c=o,f=!f;continue t}n(t,e,c,i),n(t,c+1,r,i)}}function a(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}t.exports=function(t,e){if(!Array.isArray(t))throw new Error("quick sort need an array");return t.length<2?t:(n(t,0,t.length-1,e),t)}},function(t,e,r){e["default"]={TEXT:0,DOM:1}},function(t,e,r){function n(){a.call(this),this.uid=-1,this.__listener={},this.on(a.DATA,this.__brcb)}var a=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),i=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}();!function(){var t=Object.create(a.prototype);t.constructor=n,n.prototype=t}(),n.prototype.__brcb=function(t,e){if(this.__listener.hasOwnProperty(t))for(var r=this.__listener[t],n=0,a=r.length;a>n;n++){var o=r[n],s=o.target,c=o.v;if(s.__flag=!0,i.isFunction(c))s[t]=c(e);else if(i.isString(c))s[c]=e;else if(c.name){var u=c.middleware?c.middleware.call(this,e):e;s[c.name]=u}s.__flag=!1}},n.prototype.$bridge=function(t,e){var r=this;Object.keys(e).forEach(function(n){r.__listener[n]=r.__listener[n]||[],r.__listener[n].push({target:t,v:e[n]})})},n.prototype.$bridgeTo=function(t,e){t.$bridge(this,e)},Object.keys(a).forEach(function(t){n[t]=a[t]}),e["default"]=n},function(t,e,r){var n=4096,a=new Array(n),i={index:0,add:function(t){!t.__hasDes&&this.index<n&&(a[this.index++]=t)},get:function(){return a[--this.index]}};e["default"]=i},function(t,e,r){function n(t,e,r){for(var i="",o=t.shift(),s=e.length;s>o;o++){var u=e[o];if(t.length){if(i+=u instanceof f?n(t,u.v,r):n(t,u,r),r.end)break}else if(u instanceof f)if(Array.isArray(u.v)){if(i+=a(u.v,r),r.end)break}else{if(u.v instanceof c){r.end=!0;break}i+=u.toString()}else{if(u instanceof c){r.end=!0;break}if(Array.isArray(u)){if(i+=a(u,r),r.end)break}else i+=void 0===u||null===u?"":u.toString()}}return i}function a(t,e){for(var r="",n=0,i=t.length;i>n;n++){var o=t[n];if(e.end)break;if(Array.isArray(o))r+=a(o,e);else{if(o instanceof c){e.end=!0;break}r+=void 0===o||null===o?"":o.toString()}}return r}function i(t,e,r){u.hasOwnProperty("default")&&(u=u["default"]);var a=n(t.index,e,{}),i=r.childNodes,o=i[t.start];if(1!=o.nodeType){var s=l.lie?o.innerText:o.textContent;if(a!=s)if(a)if(l.lie||/&([a-z]+|#\d+);/i.test(a)){var c=l.NODE;c.innerHTML=l.encodeHtml(a),r.replaceChild(c.firstChild,o)}else o.textContent=a;else l.lie?o.innerText="":o.textContent=""}}function o(t,e){return u.hasOwnProperty("default")&&(u=u["default"]),n(t.index,e,{})}function s(t,e){(e.first||e.prev==h.DOM)&&(e.record=t.slice())}var c=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),u=function(){var t=r(5);return t.hasOwnProperty("default")?t["default"]:t}(),f=function(){var t=r(7);return t.hasOwnProperty("default")?t["default"]:t}(),l=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),h=function(){var t=r(9);return t.hasOwnProperty("default")?t["default"]:t}();e.update=i,e.value=o,e.record=s},function(t,e,r){function n(t){t=[].slice.call(arguments,0),i.apply(this,[].concat(Array.from(t))),this.__handler={},this.__bridgeHandler={},this.__ccb=null,this.__bcb=null,this.__flag=!1}var a=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),i=function(){var t=r(4);return t.hasOwnProperty("default")?t["default"]:t}();(function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t})();!function(){var t=Object.create(i.prototype);t.constructor=n,n.prototype=t}(),n.prototype.__onData=function(t){var e=this,r=this;return r.__flag?void r.__bridgeData(t):void(r.__handler.hasOwnProperty(t)||(r.__handler[t]=!0,r.__ccb||(r.__ccb=!0,setTimeout(function(){var t=Object.keys(r.__handler);r.__handler={},r.__ccb=null,t=t.length>1?t:t[0],i.prototype.__onData.call(e,t),r.emit(a.CACHE_DATA,t)},1))))},n.prototype.__bridgeData=function(t){var e=this,r=this;r.__bridgeHandler.hasOwnProperty(t)||(r.__bridgeHandler[t]=!0,r.__bcb||(r.__bcb=!0,setTimeout(function(){var t=Object.keys(r.__bridgeHandler);r.__handler={},r.__bcb=null,t=t.length>1?t:t[0],i.prototype.__onData.call(e,t)},1)))},Object.keys(i).forEach(function(t){n[t]=i[t]}),e["default"]=n},function(t,e,r){function n(t){t=[].slice.call(arguments,0),a.apply(this,[].concat(Array.from(t)))}var a=(function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),function(){var t=r(4);return t.hasOwnProperty("default")?t["default"]:t}());!function(){var t=Object.create(a.prototype);t.constructor=n,n.prototype=t}(),n.prototype.toString=function(){return""},n.prototype.__onDom=function(){this.__dom=!0},Object.keys(a).forEach(function(t){n[t]=a[t]}),e["default"]=n},function(t,e,r){function n(t,e,r,n,a){var i;if(a){var o=void 0===n||null===n?"":n.toString();if(o){var s=m.NODE;s.innerHTML=m.encodeHtml(o),i=s.firstChild}else i=document.createTextNode("");r>=e.length?t.appendChild(i):t.replaceChild(i,e[r]),n instanceof migi.NonVisualComponent&&n.emit(_.DOM)}else{if(i=n.toString(),r>=e.length)t.insertAdjacentHTML("beforeend",i);else if(1==e[r].nodeType)e[r].insertAdjacentHTML("afterend",i),t.removeChild(e[r]);else{var s=m.getParent(n.$name);s.innerHTML=i,t.replaceChild(s.firstChild,e[r])}n.emit(_.DOM)}}function a(t,e,r,n,a){var i;if(a){var o=void 0===n||null===n?"":n.toString();if(o){var s=m.NODE;s.innerHTML=m.encodeHtml(o),i=s.firstChild}else i=document.createTextNode("");r>=e.length?t.appendChild(i):t.insertBefore(i,e[r]),n instanceof migi.NonVisualComponent&&n.emit(_.DOM)}else{if(i=n.toString(),r>=e.length)t.insertAdjacentHTML("beforeend",i);else if(1==e[r].nodeType)e[r].insertAdjacentHTML("beforebegin",i);else{var s=m.getParent(n.$name);s.innerHTML=i,t.insertBefore(s.firstChild,e[r])}n.emit(_.DOM)}}function i(t,e,r,n,o,s,c){if(Array.isArray(e)){o.push(0);for(var f=0,l=Math.max(e.length,1);l>f;f++){var h=e[f];o[o.length-1]=f,i(t,h,r,n,o,s,c&&f==l-1)}o.pop()}else if(e instanceof p&&!(e instanceof migi.NonVisualComponent)){if(s.hasOwnProperty("prev")){if(n.prev==O.TEXT&&n.start++,a(t,t.childNodes,n.start++,e),c)switch(s.state){case k:case $:n.t2d=!0;break;default:delete n.d2t}}else{switch(s.state=n.state,n.state){case $:n.start++;break;case k:u(r,n),n.start++,n.t2d=!0;break;case A:n.t2d=!0}a(t,t.childNodes,n.start++,e)}s.d=!0,s.prev=n.prev=O.DOM,n.state=w}else{if(s.hasOwnProperty("prev")){if(n.prev==O.DOM?(b.record(o,n),a(t,t.childNodes,n.start,e,!0)):u(r,n),c&&s.d)switch(u(r,n),s.state){case w:case A:delete n.t2d;break;default:delete n.d2t}}else switch(d(n,t,e,r,o),s.state=n.state,n.state){case $:n.d2t=!0;case k:u(r,n);break;case A:b.record(o,n),a(t,t.childNodes,n.start,e,!0),u(r,n);break;case w:b.record(o,n),a(t,t.childNodes,n.start,e,!0),n.d2t=!0}s.prev=n.prev=O.TEXT,n.state=k}}function o(t,e,r,n,a,i){if(Array.isArray(e)){var c=e.length;e.forEach(function(e,s){o(t,e,r,n,a,i&&s==c-1)})}else if(e instanceof p&&!(e instanceof migi.NonVisualComponent)){if(a.hasOwnProperty("prev")){if(a.prev==O.TEXT?(a.d&&s(t,n.start+1),s(t,n.start+1)):n.prev==O.TEXT?s(t,n.start+1):s(t,n.start),i)switch(n.state){case k:case $:n.d2t=!0;break;default:delete n.t2d}}else switch(n.state){case $:s(t,n.start+1),n.state=k,n.prev=O.TEXT,n.d2t=!0;break;case k:s(t,n.start+1),n.prev=O.TEXT,n.d2t=!0;break;case A:s(t,n.start),n.state=w,n.prev=O.DOM;break;case w:s(t,n.start),n.prev=O.DOM}a.d=!0,a.prev=O.DOM,g.add(e.__destroy())}else{if(a.hasOwnProperty("prev")){if(a.prev==O.DOM&&u(r,n),i&&a.d)switch(s(t,n.start+1),n.state){case w:case A:n.t2d=!0;break;default:delete n.d2t}}else switch(n.state){case $:s(t,n.start+1),u(r,n),n.state=k,n.prev=O.TEXT;break;case k:u(r,n),n.prev=O.TEXT;break;case w:s(t,n.start),n.state=w,n.prev=O.DOM,n.t2d=!0;break;case A:n.prev=O.DOM,n.t2d=!0}a.prev=O.TEXT}}function s(t,e){t.removeChild(t.childNodes[e])}function c(t,e){return(void 0===t||null===t)&&(t=""),(void 0===e||null===e)&&(e=""),t.toString()==e.toString()}function u(t,e){var r=t.length;(!r||t[r-1].start<e.start)&&t.push({start:e.start,index:e.record.slice()})}function f(t,e){if(t!==e){var r=t.$element;e.__uid=t.$uid,e.__element=r;var n=Object.keys(t.$props),a=Object.keys(e.$props),s={};n.forEach(function(r){if(!/^on[A-Z]/.test(r)){s[r]=!0;var n=t.$props[r],a=e.$props[r];n!==a&&t.__updateAttr(r,a)}}),t.__removeListener(),a.forEach(function(t){if(/^on[A-Z]/.test(t)){var r=t.slice(2).replace(/[A-Z]/g,function(t){return t.toLowerCase()});e.__addListener(r,function(r){var n=e.$props[t];n instanceof y?n.cb.call(n.context,r):n(r)})}else s.hasOwnProperty(t)||e.__updateAttr(t,e.$props[t])});for(var c,u=t.$children.length,f=e.$children.length,l=[],d={start:0,record:[],first:!0},_=0,p=Math.min(u,f);p>_;_++){var v=t.$children[_],m=e.$children[_];c=[_],h(r,v,m,l,d,c)}var O={};if(u>_)for(;u>_;_++)o(r,t.$children[_],l,d,O,_==u-1);else if(f>_)for(;f>_;_++)c[c.length-1]=_,i(r,e.$children[_],l,d,c,O,_==f-1);if(l.length){if("textarea"==e.$name)return void e.__updateAttr("value",b.value(l[0],e.$children));l.forEach(function(t){b.update(t,e.$children,r)})}g.add(t.__destroy())}}function l(t,e,r,n,a,i){v.hasOwnProperty("default")&&(v=v["default"]),a.first||(a.prev==O.TEXT?a.state=k:a.state=w),h(t,e,r,n,a,i,!0),a.t2d||a.d2t||(a.state==A?a.t2d=!0:a.state==$&&(a.d2t=!0))}function h(t,e,r,s,l,y){var m=Array.isArray(e),P=Array.isArray(r);if(m&&P){var E=e.length,D=r.length,T=E?1:0,C=D?2:0;
switch(y.push(0),l.first&&b.record(y,l),T+C){case 0:l.state=k,l.prev=O.TEXT;break;case 1:h(t,e[0],r[0],s,l,y);for(var M={},x=1;E>x;x++)o(t,e[x],s,l,M,x==E-1);break;case 2:h(t,e[0],r[0],s,l,y);for(var M={},x=1;D>x;x++)y[y.length-1]=x,i(t,r[x],s,l,y,M,x==D-1);break;case 3:for(var x=0,S=Math.min(E,D);S>x;x++)y[y.length-1]=x,h(t,e[x],r[x],s,l,y);var M={};if(E>x)for(;E>x;x++)o(t,e[x],s,l,M,x==E-1);else if(D>x)for(;D>x;x++)y[y.length-1]=x,i(t,r[x],s,l,y,M,x==D-1)}y.pop()}else if(m){h(t,e[0],r,s,l,y);for(var M={},x=1,S=e.length;S>x;x++)o(t,e[x],s,l,M,x==S-1)}else if(P){y.push(0),h(t,e,r[0],s,l,y);for(var M={},x=1,S=r.length;S>x;x++)y[y.length-1]=x,i(t,r[x],s,l,y,M,x==S-1);y.pop()}else{var j=e instanceof p&&!(e instanceof migi.NonVisualComponent)?1:0,L=r instanceof p&&!(r instanceof migi.NonVisualComponent)?2:0;switch(j+L){case 0:l.first||d(l,t,r,s,y),b.record(y,l);var H=t.childNodes;if(l.first)c(e,r)||u(s,l);else if(c(e,r))switch(l.state){case $:u(s,l),t.removeChild(H[l.start+1]);break;case A:u(s,l),a(t,H,l.start,r,!0)}else switch(l.state){case $:u(s,l),t.removeChild(H[l.start+1]);break;case A:u(s,l),a(t,H,l.start,r,!0);break;case w:b.record(y,l);case k:c(e,r)||u(s,l)}l.state=k,l.prev=O.TEXT;break;case 1:b.record(y,l);var H=t.childNodes;if(l.first)n(t,H,l.start,r,!0);else switch(l.state){case $:case k:u(s,l),t.removeChild(H[l.start+1]);break;case A:n(t,H,l.start++,r,!0);break;case w:n(t,H,l.start,r,!0)}g.add(e.__destroy()),l.state=$,l.prev=O.TEXT;break;case 2:var H=t.childNodes;if(l.first)n(t,H,l.start++,r);else switch(l.state){case $:l.start++;case w:n(t,H,l.start++,r);break;case A:a(t,H,l.start++,r);break;case k:u(s,l),a(t,H,++l.start,r),l.start++}l.state=A,l.prev=O.DOM;break;case 3:if(!l.first){switch(l.state){case $:case k:l.start++}delete l.t2d,delete l.d2t}var N=e instanceof v?1:0,X=r instanceof v?2:0;switch(N+X){case 0:e.$name==r.$name?f(e,r):(t.insertAdjacentHTML("afterend",r.toString()),t.parentNode.removeChild(t));break;case 1:f(e.$virtualDom,r);break;case 2:f(e,r.$virtualDom);break;case 3:e.constructor==r.constructor?(r.toString(),f(e.$virtualDom,r.$virtualDom)):t.innerHTML=r.toString()}l.state=w,l.prev=O.DOM,l.start++,g.add(e.__destroy())}r instanceof v&&r.emit(_.DOM)}l.first=!1}function d(t,e,r,n,i){t.t2d?(delete t.t2d,b.record(i,t),a(e,e.childNodes,t.start,r,!0)):t.d2t&&(delete t.d2t,u(n,t),s(e,t.start+1))}var _=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),p=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),v=function(){var t=r(4);return t.hasOwnProperty("default")?t["default"]:t}(),y=function(){var t=r(6);return t.hasOwnProperty("default")?t["default"]:t}(),m=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),b=function(){var t=r(12);return t.hasOwnProperty("default")?t["default"]:t}(),g=function(){var t=r(11);return t.hasOwnProperty("default")?t["default"]:t}(),O=function(){var t=r(9);return t.hasOwnProperty("default")?t["default"]:t}(),$=0,w=1,A=2,k=3;e.diff=l,e.check=d},function(t,e,r){function n(t,e,r,n,i,s){o.hasOwnProperty("default")&&(o=o["default"]);var u=[],f={};a(t.length-1,t,e,r,n,i,u,String(t.length-1),f,s),c(u,function(t,e){return t[2]==e[2]?t[0]>e[0]:t[2]>e[2]});var l="";return u.forEach(function(t){l+=t[1]+";"}),l}function a(t,e,r,n,o,u,f,l,h,d){h[l]=!0;var _=[];_.push(e[t]);var p=0;r[t]&&(_.push(r[t]),p=1);var v=0;switch(n[t]&&(_.push(n[t]),v=2),c(_,function(t,e){return e>t}),o.hasOwnProperty("_*")&&_.push("*"),p+v){case 1:_.push(_[0]+_[1]),o.hasOwnProperty("_*.")&&_.push("*"+_[1]);break;case 2:_.push(_[0]+_[1]),o.hasOwnProperty("_*#")&&_.push("*"+_[1]);break;case 3:_.push(_[0]+_[1]),_.push(_[0]+_[2]),_.push(_[1]+_[2]),_.push(_[0]+_[1]+_[2]),o.hasOwnProperty("_*.")&&_.push("*"+_[1]),o.hasOwnProperty("_*#")&&_.push("*"+_[2]),o.hasOwnProperty("_*.#")&&_.push("*"+_[1]+_[2])}for(var y=0,m=_.length;m>y;y++){var b=_[y];if(o.hasOwnProperty(b)){var g=o[b];if(t){o._d&&a(t-1,e,r,n,g,u.$parent,f,l+","+(t-1)+":"+y,h);for(var O=t-2;O>=0;O--){var $=l+","+O+":"+y;h.hasOwnProperty($)||a(O,e,r,n,g,u.$parent,f,$,h)}}if(g.hasOwnProperty("_v")&&i(f,g),d&&g.hasOwnProperty("_:")&&g["_:"].forEach(function(t){t[0].forEach(function(t){switch(t){case"hover":u.on(s.DOM,function(){u.$element.addEventListener("mouseenter",function(t){u.__hover=!0,u.__updateStyle()}),u.$element.addEventListener("mouseleave",function(t){u.__hover=!1,u.__updateStyle()})});break;case"active":u.on(s.DOM,function(){u.$element.addEventListener("mousedown",function(t){u.__active=!0,u.__updateStyle()}),document.body.addEventListener("mouseup",function(t){u.__active=!1,u.__updateStyle()},!0),window.addEventListener("blur",function(t){u.__active=!1,u.__updateStyle()}),window.addEventListener("dragend",function(t){u.__active=!1,u.__updateStyle()})})}})}),g.hasOwnProperty("_:")){var w=g["_:"];w.forEach(function(o){var s=o[0],c=!0;t:for(var d=0,_=s.length;_>d;d++)switch(s[d]){case"hover":if(!u.__hover){c=!1;break t}break;case"active":if(!u.__active){c=!1;break t}break;case"first-child":if(!u.$isFirst()){c=!1;break t}break;case"last-child":if(!u.$isLast()){c=!1;break t}break;default:c=!1}c&&(w=o[1],t&&a(t-1,e,r,n,w,u.$parent,f,l+","+(t-1)+":"+d,h),w.hasOwnProperty("_v")&&i(f,w))})}if(g.hasOwnProperty("_[")){var w=g["_["];w.forEach(function(o){var s=o[0],c=!0;t:for(var d=0,_=s.length;_>d;d++){var p=s[d];if(1==p.length){if(!u.__cache.hasOwnProperty(p[0])){c=!1;break}}else{var v=u.__cache[p[0]];if(void 0===v){c=!1;break t}var y=p[2];switch(p[1]){case"=":c=v==y;break;case"^=":c=0==v.indexOf(y);break;case"$=":c=v.length>=y.length&&v.indexOf(y)==v.length-y.length;break;case"~=":var m=new RegExp("\\b"+y+"\\b");c=m.test(v);break;case"*=":c=v.indexOf(y)>-1;break;case"|=":c=0==v.indexOf(y)||0==v.indexOf(y+"-");break;default:c=!1;break t}if(!c)break t}}c&&(w=o[1],t&&a(t-1,e,r,n,w,u.$parent,f,l+","+(t-1)+":"+d,h),w.hasOwnProperty("_v")&&i(f,w))})}}}}function i(t,e){e._v.forEach(function(r){r[2]=e._p,t.push(r)})}var o=function(){var t=r(5);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),c=function(){var t=r(8);return t.hasOwnProperty("default")?t["default"]:t}();e["default"]=n},function(t,e,r){var n=function(){var t=r(2);return t.hasOwnProperty("default")?t["default"]:t}(),a=function(){var t=r(3);return t.hasOwnProperty("default")?t["default"]:t}(),i=function(){var t=r(10);return t.hasOwnProperty("default")?t["default"]:t}(),o=function(){var t=r(4);return t.hasOwnProperty("default")?t["default"]:t}(),s=function(){var t=r(5);return t.hasOwnProperty("default")?t["default"]:t}(),c=function(){var t=r(14);return t.hasOwnProperty("default")?t["default"]:t}(),u=function(){var t=r(13);return t.hasOwnProperty("default")?t["default"]:t}(),f=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),l=function(){var t=r(7);return t.hasOwnProperty("default")?t["default"]:t}(),h=function(){var t=r(6);return t.hasOwnProperty("default")?t["default"]:t}(),d=function(){var t=r(11);return t.hasOwnProperty("default")?t["default"]:t}(),f=function(){var t=r(1);return t.hasOwnProperty("default")?t["default"]:t}(),_=function(){var t=r(8);return t.hasOwnProperty("default")?t["default"]:t}(),p={render:function(t,e){return e&&t.$inTo(e),t},createCp:function(t,e,r){return new t(e,r)},createVd:function(t,e,r){return d.index?d.get().__reset(t,e,r):new s(t,e,r)},Event:n,EventBus:i,eventBus:new i,Element:a,Component:o,NonVisualComponent:c,CacheComponent:u,VirtualDom:s,Obj:l,Cb:h,util:f,sort:_};"undefined"!=typeof window&&(window.migi=p),e["default"]=p}]);