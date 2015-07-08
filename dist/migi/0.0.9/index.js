!function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={exports:{},id:n,loaded:!1};return e[n].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){e.exports=r(17)["default"]},function(e,t,r){function n(){this.__hash={}}n.prototype.on=function(e,t){var r=this;if(Array.isArray(e))e.forEach(function(e){r.on(e,t)});else if(t){r.__hash.hasOwnProperty(e)||(r.__hash[e]=[]);for(var n=0,i=r.__hash[e],a=i.length;a>n;n++)if(i[n]===t)return this;r.__hash[e].push(t)}return this},n.prototype.once=function(e,t){var r=this;return Array.isArray(e)?e.forEach(function(e){r.once(e,t)}):t&&r.on(e,function(n){n=[].slice.call(arguments,0),t.apply(r,n),r.off(e,arguments.callee)}),this},n.prototype.off=function(e,t){var r=this;if(Array.isArray(e))e.forEach(function(e){r.off(e,t)});else if(r.__hash.hasOwnProperty(e))if(t){for(var n=0,i=r.__hash[e],a=i.length;a>n;n++)if(i[n]===t){i.splice(n,1);break}}else delete r.__hash[e];return this},n.prototype.emit=function(e,t){t=[].slice.call(arguments,1);var r=this;if(Array.isArray(e))e.forEach(function(e){r.emit(e,t)});else if(r.__hash.hasOwnProperty(e)){var n=r.__hash[e].slice();n.forEach(function(e){e.apply(r,t)})}return this},n.mix=function(e){return e=[].slice.call(arguments,0),e.forEach(function(e){var t=new n;e.__hash={};var r=["on","once","off","emit"];r.forEach(function(r){e[r]=t[r]})}),this},n.DOM="__0",n.DATA="__1",n.CACHE_DATA="__2",t["default"]=n},function(e,t,r){function n(e){if(e instanceof c)return e;if(a(e))return e;var t=Array.isArray(e)?[]:{};for(var r in e)e.hasOwnProperty(r)&&(e[r]instanceof c?t[r]=e[r]:b.isDate(e[r])?t[r]=new Date(e[r]):t[r]=b.isObject(e[r])?n(e[r]):e[r]);return t}function i(e){return function(t){return u.call(t)=="[object "+e+"]"}}function a(e){return b.isBoolean(e)||b.isNull(e)||b.isNumber(e)||b.isUndefined(e)||b.isString(e)}function o(e,t){if(e instanceof c||t instanceof c)return e==t;if(a(e)||a(t))return e===t;if(b.isArray(e)){if(!b.isArray(t))return!1;if(e.length!==t.length)return!1;for(var r=0,n=e.length;n>r;r++)if(!o(e[r],t[r]))return!1;return!0}if(b.isDate(e))return b.isDate(t)?e-t==0:!1;if(b.isObject(e)){if(!b.isObject(t))return!1;var i=Object.keys(e),s=Object.keys(t);if(i.length!==s.length)return!1;for(var r=0,n=i.length;n>r;r++)if(!t.hasOwnProperty(r)||!o(e[r],t[r]))return!1;return!0}}function s(e,t,r){var n="";return e.forEach(function(e){if(Array.isArray(e))n+=s(e);else if(e instanceof c)n+=e.toString();else if(void 0===e||null===e)n+="";else{if(r)return e.toString();n+=b.encodeHtml(e.toString(),t)}}),n}var c=function(){var e=r(3);return e.hasOwnProperty("default")?e["default"]:e}(),u={}.toString,f=document.createElement("div"),l=document.createElement("table"),h=document.createElement("tbody"),d=document.createElement("tr"),_=document.createElement("ul"),p=document.createElement("dl"),v=document.createElement("select"),y=document.createElement("menu"),m=!1,b={clone:function(e){return c.hasOwnProperty("default")&&(c=c["default"]),n(e)},isObject:i("Object"),isString:i("String"),isArray:Array.isArray||i("Array"),isFunction:i("Function"),isUndefined:i("Undefined"),isNumber:i("Number"),isNull:i("Null"),isBoolean:i("Boolean"),isDate:i("Date"),equal:function(e,t){return c.hasOwnProperty("default")&&(c=c["default"]),o(e,t)},encodeHtml:function(e,t){return t?e.replace(/"/g,"&quot;"):e.replace(/</g,"&lt;")},NODE:f,getParent:function(e){switch(e){case"td":return d;case"tr":return h;case"tbody":case"thead":case"col":return l;case"li":return _;case"dt":case"dd":return p;case"option":return v;case"menuitem":return y;default:return f}},lie:m,version:function(){if(m){for(var e=5;f.innerHTML="<!--[if gt IE "+ ++e+"]>1<![endif]-->",f.innerHTML;);return e}}(),joinArray:function(e,t){return c.hasOwnProperty("default")&&(c=c["default"]),s(e,t)}};t["default"]=b},function(e,t,r){function n(e){return o.isString(e)?document.querySelector(e):e}function i(e,t,r){a.call(this),this.__uid=s++,this.__reset(e,t,r)}var a=function(){var e=r(1);return e.hasOwnProperty("default")?e["default"]:e}(),o=function(){var e=r(2);return e.hasOwnProperty("default")?e["default"]:e}(),s=0;!function(){var e=Object.create(a.prototype);e.constructor=i,i.prototype=e}(),i.prototype.__reset=function(e,t,r){this.__name=e,this.__props=t,this.__children=r,this.__element=null,this.__parent=null,this.__style=null,this.__dom=!1,this.once(a.DOM,this.__onDom),this.on(a.DATA,this.__onData)},i.prototype.__clean=function(){this.dom&&this.element.parentNode.removeChild(this.element)},i.prototype.__onDom=function(){this.__dom=!0};var c={};c.name={},c.name.get=function(){return this.__name},c.props={},c.props.get=function(){return this.__props},c.children={},c.children.get=function(){return this.__children},c.parent={},c.parent.get=function(){return this.__parent},c.uid={},c.uid.get=function(){return this.__uid},c.element={},c.element.get=function(){return this.__element||(this.__element=document.querySelector(this.name+'[migi-uid="'+this.uid+'"]'))},c.dom={},c.dom.get=function(){return this.__dom},i.prototype.inTo=function(e){this.__clean();var t=this.toString();n(e).innerHTML=t,this.emit(a.DOM)},i.prototype.appendTo=function(e){this.__clean();var t=this.toString();e=n(e),e.insertAdjacentHTML("beforeend",t),this.emit(a.DOM)},i.prototype.prependTo=function(e){this.__clean();var t=this.toString();e=n(e),e.insertAdjacentHTML("afterbegin",t),this.emit(a.DOM)},i.prototype.before=function(e){this.__clean();var t=this.toString();e=n(e),e.insertAdjacentHTML("beforebegin",t),this.emit(a.DOM)},i.prototype.after=function(e){this.__clean();var t=this.toString();e=n(e),e.insertAdjacentHTML("afterend",t),this.emit(a.DOM)},i.prototype.replace=function(e){this.__clean();var t=this.toString();e=n(e),e.insertAdjacentHTML("afterend",t),e.parentNode.removeChild(e),this.emit(a.DOM)},i.clean=function(){s=0},Object.keys(c).forEach(function(e){Object.defineProperty(i.prototype,e,c[e])}),Object.keys(a).forEach(function(e){i[e]=a[e]}),t["default"]=i},function(e,t,r){function n(e,t){void 0===e&&(e={}),void 0===t&&(t=[]);var r=this,n=r.constructor.toString();n=/^function\s+([\w$]+)/.exec(n)[1],a.call(this,n,e,t),r.__virtualDom=null,Object.keys(e).forEach(function(t){if(/^on[A-Z]/.test(t)){var n=t.slice(2).replace(/[A-Z]/g,function(e){return e.toLowerCase()}),i=e[t];r.on(n,function(e){e=[].slice.call(arguments,0),i.apply(this,[].concat(Array.from(e)))})}})}var i=function(){var e=r(1);return e.hasOwnProperty("default")?e["default"]:e}(),a=function(){var e=r(3);return e.hasOwnProperty("default")?e["default"]:e}(),o=function(){var e=r(5);return e.hasOwnProperty("default")?e["default"]:e}(),s=function(){var e=r(2);return e.hasOwnProperty("default")?e["default"]:e}(),c=function(){var e=r(10);return e.hasOwnProperty("default")?e["default"]:e}(),u={},f={};!function(){var e=Object.create(a.prototype);e.constructor=n,n.prototype=e}(),n.prototype.render=function(){return new o("div",this.props,this.children)},n.prototype.toString=function(){return this.__virtualDom=this.render(),this.virtualDom.__parent=this,this.__style&&(this.virtualDom.style=this.__style),this.virtualDom.toString()},n.prototype.findChild=function(e){return this.findChildren(e,!0)[0]},n.prototype.findChildren=function(e,t){for(var r=[],i=0,o=this.children.length;o>i;i++){var c=this.children[i];if(c instanceof a)if(c instanceof n){if((c.name==e||s.isFunction(e)&&c instanceof e)&&(r.push(c),t))break}else{if((c.name==e||s.isFunction(e)&&c instanceof e)&&(r.push(c),t))break;if(r=r.concat(c.findAll(e)),t&&r.length)break}}return r},n.prototype.find=function(e){return this.findAll(e,!0)[0]},n.prototype.findAll=function(e,t){return this.virtualDom.findAll(e,t)},n.prototype.__bicb=function(e,t,r,n){if(!u.hasOwnProperty(e.uid)){u[e.uid]=!0,e.__flag=!0,Array.isArray(t)||(t=[t]);for(var i=0,a=t.length;a>i;i++){var o=t[i];(!r||r.indexOf(o)>-1)&&(n&&-1!=n.indexOf(o)||(e[o]=this[o]))}e.__flag=!1}},n.prototype.bind=function(e,t,r){var a=this;if(e==this)throw new Error("can not bind self: "+a.name);if(e!=c&&!(e instanceof n))throw new Error("can only bind to eventBus/Component: "+a.name);a.on(a instanceof migi.CacheComponent?i.CACHE_DATA:i.DATA,function(n,i){i!=a.__bicb&&(u={},u[a.uid]=!0),a.__bicb(e,n,t,r)}),e.on(e instanceof migi.CacheComponent?i.CACHE_DATA:i.DATA,function(n,i){i!=e.__bicb&&(u={},u[e.uid]=!0),e.__bicb(a,n,t,r)})},n.prototype.bindTo=function(e,t,r){e.bind(this,t,r)},n.prototype.__brcb=function(e,t,r){if(!f.hasOwnProperty(e.uid)){f[e.uid]=!0,e.__flag=!0,Array.isArray(t)||(t=[t]);for(var n=0,a=t.length;a>n;n++){var o=t[n];if(r.hasOwnProperty(o)){var u=r[o];if(e==c){if(s.isFunction(u))e.emit(i.DATA,o,u(this[o]));else if(s.isString(u))e.emit(i.DATA,u,this[o]);else if(u.name){var l=u.middleware?u.middleware.call(this,this[o]):this[o];e.emit(i.DATA,u.name,l)}}else if(s.isFunction(u))e[o]=u(this[o]);else if(s.isString(u))e[u]=this[o];else if(u.name){var l=u.middleware?u.middleware.call(this,this[o]):this[o];e[u.name]=l}}}e.__flag=!1}},n.prototype.bridge=function(e,t){var r=this;if(e==this)throw new Error("can not bridge self: "+r.name);if(e!=c&&!(e instanceof n))throw new Error("can only bridge to eventBus/Component: "+r.name);r.on(r instanceof migi.CacheComponent?i.CACHE_DATA:i.DATA,function(n,i){i!=r.__brcb&&i!=c.__brcb&&(f={},f[r.uid]=!0),r.__brcb(e,n,t)})},n.prototype.bridgeTo=function(e,t){e.bridge(this,t)};var l={};l.virtualDom={},l.virtualDom.get=function(){return this.__virtualDom},l.element={},l.element.get=function(){return this.virtualDom?this.virtualDom.element:null},l.style={},l.style.set=function(e){this.__style=e},n.prototype.__onDom=function(){function e(e){e.target!=t.element&&e.stopPropagation()}a.prototype.__onDom.call(this);var t=this;t.virtualDom.emit(i.DOM),t.element.setAttribute("migi-name",this.name),t.children.forEach(function(e){e instanceof a&&e.emit(i.DOM)}),["click","dblclick","focus","blur","change","abort","error","load","mousedown","mousemove","mouseover","mouseup","mouseout","reset","resize","scroll","select","submit","unload","DOMActivate","DOMFocusIn","DOMFocusOut"].forEach(function(r){t.element.addEventListener(r,e)})},n.prototype.__onData=function(e){this.virtualDom&&this.virtualDom.emit(i.DATA,e),this.children.forEach(function(t){t.emit(i.DATA,e)})},n.prototype.__destroy=function(){return this.virtualDom.__destroy()},Object.keys(l).forEach(function(e){Object.defineProperty(n.prototype,e,l[e])}),Object.keys(a).forEach(function(e){n[e]=a[e]}),t["default"]=n},function(e,t,r){function n(e,t,r){if(void 0===t&&(t={}),void 0===r&&(r=[]),o.hasOwnProperty("default")&&(o=o["default"]),p.hasOwnProperty(e)&&r.length)throw new Error("self-close tag can not has chilren nodes: "+e);a.call(this,e,t,r);var n=this;n.__cache={},n.__names=null,n.__classes=null,n.__ids=null,n.__inline=null,n.__hover=!1,n.__active=!1,n.__listener=null,n.__init(e,r)}var i=function(){var e=r(1);return e.hasOwnProperty("default")?e["default"]:e}(),a=function(){var e=r(3);return e.hasOwnProperty("default")?e["default"]:e}(),o=function(){var e=r(4);return e.hasOwnProperty("default")?e["default"]:e}(),s=function(){var e=r(2);return e.hasOwnProperty("default")?e["default"]:e}(),c=function(){var e=r(7);return e.hasOwnProperty("default")?e["default"]:e}(),u=function(){var e=r(6);return e.hasOwnProperty("default")?e["default"]:e}(),f=function(){var e=r(11);return e.hasOwnProperty("default")?e["default"]:e}(),l=function(){var e=r(16);return e.hasOwnProperty("default")?e["default"]:e}(),h=function(){var e=r(12);return e.hasOwnProperty("default")?e["default"]:e}(),d=function(){var e=r(15);return e.hasOwnProperty("default")?e["default"]:e}(),_=(function(){var e=r(8);return e.hasOwnProperty("default")?e["default"]:e}(),function(){var e=r(9);return e.hasOwnProperty("default")?e["default"]:e}()),p={img:!0,meta:!0,link:!0,br:!0,basefont:!0,base:!0,col:!0,embed:!0,frame:!0,hr:!0,input:!0,keygen:!0,area:!0,param:!0,source:!0,track:!0,wbr:!0},v={checked:!0,selected:!0,selectedIndex:!0,readOnly:!0,multiple:!0,defaultValue:!0,autofocus:!0,async:!0,tagName:!0,nodeName:!0,nodeType:!0};!function(){var e=Object.create(a.prototype);e.constructor=n,n.prototype=e}(),n.prototype.toString=function(){var e=this,t="<"+e.name;if(Object.keys(e.props).forEach(function(r){var n=e.__renderProp(r);t+=n}),e.__style){var r=e.__match(!0);r&&(t=t.indexOf(' style="')>1?t.replace(/ style="[^"]*"/,' style="'+r+'"'):t+' style="'+r+'"')}return t+=' migi-uid="'+e.uid+'"',e.__checkListener(),e.__selfClose?t+"/>":(t+=">",t+=e.__renderChildren(),t+="</"+e.name+">")},n.prototype.isFirst=function(e){if(this.parent instanceof o)return!0;e=e||this.parent.children;for(var t=0,r=e.length;r>t;t++){var i=e[t];if(Array.isArray(i)&&i.length)return this.isFirst(i);if(i==this)return!0;if(i instanceof n)return!1;if(i instanceof c&&(i=i.v,Array.isArray(i)&&i.length))return this.isFirst(i)}},n.prototype.isLast=function(e){if(this.parent instanceof o)return!0;e=e||this.parent.children;for(var t=e.length-1;t>=0;t--){var r=e[t];if(Array.isArray(r)&&r.length)return this.isLast(r);if(r==this)return!0;if(r instanceof n)return!1;if(r instanceof c&&(r=r.v,Array.isArray(r)&&r.length))return this.isLast(r)}},n.prototype.__renderProp=function(e){var t=this,r=t.props[e],n="";if(/^on[A-Z]/.test(e))t.once(i.DOM,function(){var r=e.slice(2).replace(/[A-Z]/g,function(e){return e.toLowerCase()});t.__addListener(r,function(r){var n=t.props[e];n instanceof u?n.cb.call(n.context,r):n(r)})});else if(r instanceof c){var a=r.toString(!0);if("dangerouslySetInnerHTML"==e)return t.once(i.DOM,function(){t.element.innerHTML=a}),"";t.__cache[e]=a,(!v.hasOwnProperty(e)||r.v)&&(n=" "+e+'="'+s.encodeHtml(a,!0)+'"')}else{var a=Array.isArray(r)?s.joinArray(r):void 0===r||null===r?"":r.toString();if("dangerouslySetInnerHTML"==e)return t.once(i.DOM,function(){t.element.innerHTML=a}),"";"className"==e&&(e="class"),t.__cache[e]=a,(!v.hasOwnProperty(e)||r)&&(n=" "+e+'="'+s.encodeHtml(a,!0)+'"')}if(t.__style)switch(e){case"class":case"id":n=" migi-"+n.slice(1)}return n},n.prototype.__renderChildren=function(){var e=this,t="";return e.children.forEach(function(e){t+=n.renderChild(e)}),t},n.prototype.__checkListener=function(){var e=this;if("input"==e.name){if(e.props.hasOwnProperty("value")){var t=e.props.value;t instanceof c&&e.once(i.DOM,function(){function r(){t.v=this.value;var e=t.k;t.context[e]=this.value}var n=e.__cache.type;switch((void 0===n||null===n)&&(n=""),n.toLowerCase()){case"button":case"hidden":case"image":case"file":case"reset":case"submit":break;case"checkbox":case"radio":case"range":case"color":e.__addListener("change",r);break;default:e.__addListener(["input","paste","cut"],r)}})}}else if("select"==e.name){if(e.props.hasOwnProperty("value")){var t=e.props.value;t instanceof c&&e.once(i.DOM,function(){function r(){t.v=this.value;var e=t.k;t.context[e]=this.value}e.__addListener("change",r)})}}else if("textarea"==e.name&&1==e.children.length){var r=e.children[0];r instanceof c&&e.once(i.DOM,function(){function t(e){r.v=this.value;var t=r.k;r.context[t]=this.value}e.__addListener(["input","paste","cut"],t)})}},n.prototype.__addListener=function(e,t){var r=this;if(Array.isArray(e))e.forEach(function(e){r.__addListener(e,t)});else{if(r.__listener=r.__listener||{},r.__listener.hasOwnProperty(e)){var n=r.__listener[e];Array.isArray(n)?n.push(t):r.__listener[e]=[n,t]}else r.__listener[e]=t;r.element.addEventListener(e,t)}},n.prototype.__removeListener=function(){var e=this;e.__listener&&Object.keys(e.__listener).forEach(function(t){var r=e.__listener[t];Array.isArray(r)?r.forEach(function(r){e.element.removeEventListener(t,r)}):e.element.removeEventListener(t,r)})},n.prototype.find=function(e){return this.findAll(e,!0)[0]},n.prototype.findAll=function(e,t){for(var r=[],n=0,i=this.children.length;i>n;n++){var c=this.children[n];if(c instanceof a)if(c instanceof o){if((c.name==e||s.isFunction(e)&&c instanceof e)&&(r.push(c),t))break}else{if((c.name==e||s.isFunction(e)&&c instanceof e)&&(r.push(c),t))break;if(r=r.concat(c.findAll(e)),t&&r.length)break}}return r};var y={};y.names={},y.names.get=function(){return this.__names||(this.__names=[])},y.style={},y.style.set=function(e){var t=this;t.__style=e,t.parent instanceof n?t.__names=t.parent.names.slice():t.__names=[],t.__names.push(t.name),t.children.forEach(function(t){t instanceof n&&(t.style=e)})},n.prototype.__onDom=function(){a.prototype.__onDom.call(this);for(var e=this,t={start:0,first:!0},r=0,n=e.children.length;n>r;r++){var i=e.children[r];e.__domChild(i,r,n,t)}t.empty&&e.__insertBlank(t.start)},n.prototype.__domChild=function(e,t,r,s,u){var f=this;if(Array.isArray(e)&&e.length)e.forEach(function(e,n){f.__domChild(e,t,r,s,n)});else if(e instanceof a)s.empty&&(f.__insertBlank(s.start),s.empty=!1),e.emit(i.DOM),s.start++,s.first||s.prev==_.TEXT&&s.start++,s.prev=_.DOM,e instanceof o&&e.emit(i.DOM);else if(e instanceof c)f.__domChild(e.v,t,r,s,u);else if(n.isEmptyText(e)){if(!s.first&&s.prev==_.TEXT)return;s.empty=!0,s.prev=_.TEXT}else s.empty=!1,s.prev=_.TEXT;s.first=!1},n.prototype.__insertBlank=function(e){var t=document.createTextNode(""),r=this.element,n=r.childNodes,i=n.length;!i||e>=i?r.appendChild(t):r.insertBefore(t,n[e])},n.prototype.__onData=function(e){var t=this;for(var r in t.props){var n=t.props[r];if(n instanceof c){var i=!1;if(Array.isArray(n.k)?i=n.k.indexOf(e)>-1:e==n.k&&(i=!0),i){var a=n.v,o=n.cb.call(n.context);a!=o&&(n.v=o,t.__updateAttr(r,o))}}}for(var s,u=[],l={start:0,record:[],first:!0},h=t.children,d=0,_=h.length;_>d;d++){var p=h[d];s=[d],t.__checkObj(e,p,d,_,u,l,s)}if(f.merge(u),u.length){if("textarea"==t.name)return void t.__updateAttr("value",f.value(u[0],t.children));u.forEach(function(e){f.update(e,t.children,t.element)})}},n.prototype.__checkObj=function(e,t,r,n,o,s,u){var l=this;if(t instanceof c){var h=!1,p=Array.isArray(e)?1:0,v=Array.isArray(t.k)?2:0;switch(p+v){case 0:h=e==t.k;break;case 1:h=e.indexOf(t.k)>-1;break;case 2:h=t.k.indexOf(e)>-1;break;case 3:var y={};e.forEach(function(e){y[e]=!0});for(var m=t.k,b=0,n=m.length;n>b;b++)if(y.hasOwnProperty(m[b])){h=!0;break}}if(h){var g=t.v;t.update(g)&&d.diff(this.element,g,t.v,o,s,u)}}else t instanceof a?(delete s.t2d,delete s.d2t,t.emit(i.DATA,e),s.start++,s.first||s.prev!=_.TEXT||s.start++,s.prev=_.DOM):Array.isArray(t)&&t.length?(u.push(0),t.forEach(function(t,i){u[u.length-1]=i,l.__checkObj(e,t,r,n,o,s,u)}),u.pop()):(d.check(s,this.element,t,o,u),f.record(u,s),s.prev=_.TEXT);s.first=!1},n.prototype.__updateAttr=function(e,t){if("dangerouslySetInnerHTML"==e)return void(this.element.innerHTML=t||"");switch(e){case"value":this.element[e]=t||"";break;case"checked":case"selected":case"selectedIndex":case"readOnly":case"multiple":case"defaultValue":case"autofocus":case"async":case"tagName":case"nodeName":case"nodeType":this.element[e]=t||!1;break;case"className":e="class";case"id":case"class":if(this.__style){null===t||void 0===t?this.element.removeAttribute("migi-"+e):this.element.setAttribute("migi-"+e,t);break}default:null===t||void 0===t?this.element.removeAttribute(e):this.element.setAttribute(e,t)}this.__cache[e]=t,this.__style&&this.__updateStyle()},n.prototype.__match=function(e){this.__inline=this.__cache.style||"",this.parent instanceof n?(this.__classes=this.parent.__classes.slice(),this.__ids=this.parent.__ids.slice()):(this.__classes=[],this.__ids=[]);var t=(this.__cache["class"]||"").trim();t?(t=t.split(/\s+/),h(t,function(e,t){return t>e}),this.__classes.push("."+t.join("."))):this.__classes.push("");var r=(this.__cache.id||"").trim();r?this.__ids.push("#"+r):this.__ids.push("");var i=l(this.__names,this.__classes,this.__ids,this.__style,this,e);return i+this.__inline},n.prototype.__updateStyle=function(){var e=this.__match();this.element.getAttribute("style")!=e&&this.element.setAttribute("style",e),this.children.forEach(function(e){e instanceof n&&e.__updateStyle()})},n.prototype.__init=function(e,t){var r=this;r.__selfClose=p.hasOwnProperty(e),t.forEach(function(e){e instanceof a&&(e.__parent=r)})},n.prototype.__reset=function(e,t,r){return void 0===t&&(t={}),void 0===r&&(r=[]),a.prototype.__reset.call(this,e,t,r),this.__init(e,r),this.__hasDes=!1,this},n.prototype.__destroy=function(){return this.__cache={},this.__names=null,this.__classes=null,this.__ids=null,this.__inline=null,this.__hover=!1,this.__active=!1,this.__listener=null,this.__hasDes=!0,this},n.isEmptyText=function(e){return void 0===e||null===e||!e.toString()},n.renderChild=function(e){if(void 0===e||null===e)return"";if(e instanceof a||e instanceof c)return e.toString();if(Array.isArray(e)){var t="";return e.forEach(function(e){t+=n.renderChild(e)}),t}return s.encodeHtml(e.toString())},Object.keys(y).forEach(function(e){Object.defineProperty(n.prototype,e,y[e])}),Object.keys(a).forEach(function(e){n[e]=a[e]}),t["default"]=n},function(e,t,r){function n(e,t){this.__context=e,this.__cb=t}var i={};i.context={},i.context.get=function(){return this.__context},i.cb={},i.cb.get=function(){return this.__cb},Object.keys(i).forEach(function(e){Object.defineProperty(n.prototype,e,i[e])}),t["default"]=n},function(e,t,r){function n(e,t,r){i.hasOwnProperty("default")&&(i=i["default"]),this.__k=e,this.__context=t,this.__cb=r,this.v=r.call(t)}var i=function(){var e=r(3);return e.hasOwnProperty("default")?e["default"]:e}(),a=function(){var e=r(2);return e.hasOwnProperty("default")?e["default"]:e}(),o={};o.k={},o.k.get=function(){return this.__k},o.context={},o.context.get=function(){return this.__context},o.v={},o.v.get=function(){return this.__v},o.v.set=function(e){this.__v=a.clone(e)},o.cb={},o.cb.get=function(){return this.__cb},n.prototype.toString=function(e){if(Array.isArray(this.v))return a.joinArray(this.v,e);if(void 0===this.v||null===this.v)return"";var t=this.v.toString();return e?a.encodeHtml(t,e):this.v instanceof i?t:a.encodeHtml(t,e)},n.prototype.update=function(e){var t=this.cb.call(this.context);return a.equal(e,t)?void 0:(this.v=t,!0)},Object.keys(o).forEach(function(e){Object.defineProperty(n.prototype,e,o[e])}),t["default"]=n},function(e,t,r){var n=4096,i=new Array(n),a={index:0,add:function(e){!e.__hasDes&&this.index<n&&(i[this.index++]=e)},get:function(){return i[--this.index]}};t["default"]=a},function(e,t,r){t["default"]={TEXT:0,DOM:1}},function(e,t,r){var n=function(){var e=r(1);return e.hasOwnProperty("default")?e["default"]:e}(),i=function(){var e=r(2);return e.hasOwnProperty("default")?e["default"]:e}(),a=new n;a.uid=-1;var o={};a.__brcb=function(e,t){if(o.hasOwnProperty(e))for(var r=o[e],n=0,a=r.length;a>n;n++){var s=r[n],c=s.target,u=s.v;if(c.__flag=!0,i.isFunction(u))c[e]=u(t);else if(i.isString(u))c[u]=t;else if(u.name){var f=u.middleware?u.middleware.call(this,t):t;c[u.name]=f}c.__flag=!1}},a.on(n.DATA,a.__brcb),a.bridge=function(e,t){Object.keys(t).forEach(function(r){o[r]=o[r]||[],o[r].push({target:e,v:t[r]})})},a.bridgeTo=function(e,t){e.bridge(this,t)},t["default"]=a},function(e,t,r){function n(e){for(var t=0,r=e.length;r-1>t;t++){var n=e[t],i=e[t+1];n.start==i.start&&(e.splice(t+1,1),t--,r--)}}function i(e,t,r){for(var n="",o=e.shift(),s=t.length;s>o;o++){var c=t[o];if(e.length){if(c instanceof l?(console.log(e,c.v),n+=i(e,c.v,r)):n+=i(e,c,r),r.end)break}else if(c instanceof l)if(Array.isArray(c.v)){if(n+=a(c.v,r),r.end)break}else{if(c.v instanceof u){r.end=!0;break}n+=c.toString()}else{if(c instanceof u){r.end=!0;break}n+=Array.isArray(c)?h.joinArray(c,null,!0):void 0===c||null===c?"":c.toString()}}return n}function a(e,t){for(var r="",n=0,i=e.length;i>n;n++){var o=e[n];if(t.end)break;if(Array.isArray(o))r+=a(o,t);else{if(o instanceof u){t.end=!0;break}r+=void 0===o||null===o?"":o.toString()}}return r}function o(e,t,r){f.hasOwnProperty("default")&&(f=f["default"]);var n=i(e.index,t,{}),a=r.childNodes,o=a[e.start];if(1!=o.nodeType){var s=h.lie?o.innerText:o.textContent;if(n!=s)if(n)if(h.lie||/&([a-z]+|#\d+);/i.test(n)){var c=h.NODE;c.innerHTML=h.encodeHtml(n),r.replaceChild(c.firstChild,o)}else o.textContent=n;else h.lie?o.innerText="":o.textContent=""}}function s(e,t){return f.hasOwnProperty("default")&&(f=f["default"]),i(e.index,t,{})}function c(e,t){(t.first||t.prev==d.DOM)&&(t.record=e.slice())}var u=function(){var e=r(3);return e.hasOwnProperty("default")?e["default"]:e}(),f=function(){var e=r(5);return e.hasOwnProperty("default")?e["default"]:e}(),l=function(){var e=r(7);return e.hasOwnProperty("default")?e["default"]:e}(),h=function(){var e=r(2);return e.hasOwnProperty("default")?e["default"]:e}(),d=function(){var e=r(9);return e.hasOwnProperty("default")?e["default"]:e}();t.merge=n,t.update=o,t.value=s,t.record=c},function(e,t,r){function n(e,t,r,a){if(!(t>=r)){var o=t,s=r,c=o,u=e[c],f=!0;e:for(;s>o;)if(f){for(;s>o;s--)if(a&&a.call(e,u,e[s])||!a&&u>e[s]){i(e,c,s),c=s,f=!f;continue e}}else for(;s>o;o++)if(a&&a.call(e,e[o],u)||!a&&u<e[o]){i(e,c,o),c=o,f=!f;continue e}n(e,t,c,a),n(e,c+1,r,a)}}function i(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}e.exports=function(e,t){if(!Array.isArray(e))throw new Error("quick sort need an array");return e.length<2?e:(n(e,0,e.length-1,t),e)}},function(e,t,r){function n(e){e=[].slice.call(arguments,0),a.apply(this,[].concat(Array.from(e))),this.__handler={},this.__bridgeHandler={},this.__ccb=null,this.__bcb=null,this.__flag=!1}var i=function(){var e=r(1);return e.hasOwnProperty("default")?e["default"]:e}(),a=function(){var e=r(4);return e.hasOwnProperty("default")?e["default"]:e}();(function(){var e=r(2);return e.hasOwnProperty("default")?e["default"]:e})();!function(){var e=Object.create(a.prototype);e.constructor=n,n.prototype=e}(),n.prototype.__onData=function(e){var t=this,r=this;return r.__flag?void r.__bridgeData(e):void(r.__handler.hasOwnProperty(e)||(r.__handler[e]=!0,r.__ccb||(r.__ccb=!0,setTimeout(function(){var e=Object.keys(r.__handler);r.__handler={},r.__ccb=null,e=e.length>1?e:e[0],a.prototype.__onData.call(t,e),r.emit(i.CACHE_DATA,e)},1))))},n.prototype.__bridgeData=function(e){var t=this,r=this;r.__bridgeHandler.hasOwnProperty(e)||(r.__bridgeHandler[e]=!0,r.__bcb||(r.__bcb=!0,setTimeout(function(){var e=Object.keys(r.__bridgeHandler);r.__handler={},r.__bcb=null,e=e.length>1?e:e[0],a.prototype.__onData.call(t,e)},1)))},Object.keys(a).forEach(function(e){n[e]=a[e]}),t["default"]=n},function(e,t,r){function n(e){e=[].slice.call(arguments,0),i.apply(this,[].concat(Array.from(e)))}var i=(function(){var e=r(1);return e.hasOwnProperty("default")?e["default"]:e}(),function(){var e=r(4);return e.hasOwnProperty("default")?e["default"]:e}());!function(){var e=Object.create(i.prototype);e.constructor=n,n.prototype=e}(),n.prototype.toString=function(){return this.children.length?i.prototype.toString.call(this):""},n.prototype.__onDom=function(){this.__dom=!0},Object.keys(i).forEach(function(e){n[e]=i[e]}),t["default"]=n},function(e,t,r){function n(e,t,r,n,i){var a;if(i){if(n=void 0===n||null===n?"":n.toString()){var o=m.NODE;o.innerHTML=m.encodeHtml(n),a=o.firstChild}else a=document.createTextNode("");r>=t.length?e.appendChild(a):e.replaceChild(a,t[r])}else{if(a=n.toString(),r>=t.length)e.insertAdjacentHTML("beforeend",a);else if(1==t[r].nodeType)t[r].insertAdjacentHTML("afterend",a),e.removeChild(t[r]);else{var o=m.getParent(n.name);o.innerHTML=a,e.replaceChild(o.firstChild,t[r])}n.emit(_.DOM)}}function i(e,t,r,n,i){var a;if(i){if(n=void 0===n||null===n?"":n.toString()){var o=m.NODE;o.innerHTML=m.encodeHtml(n),a=o.firstChild}else a=document.createTextNode("");r>=t.length?e.appendChild(a):e.insertBefore(a,t[r])}else{if(a=n.toString(),r>=t.length)e.insertAdjacentHTML("beforeend",a);else if(1==t[r].nodeType)t[r].insertAdjacentHTML("beforebegin",a);else{var o=m.getParent(n.name);o.innerHTML=a,e.insertBefore(o.firstChild,t[r])}n.emit(_.DOM)}}function a(e,t,r,n,a){if(t instanceof p){switch(n.state){case w:n.start++;break;case P:u(r,n),n.start++,n.t2d=!0;break;case k:n.t2d=!0}i(e,e.childNodes,n.start++,t),n.state=A,n.prev=O.DOM}else{switch(d(n,e,t,r,a),n.state){case w:n.d2t=!0;case P:u(r,n);break;case k:b.record(a,n),i(e,e.childNodes,n.start,t,!0),u(r,n);break;case A:b.record(a,n),i(e,e.childNodes,n.start,t,!0),n.d2t=!0}n.state=P,n.prev=O.TEXT}}function o(e,t,r,n,i){if(t instanceof p){switch(n.state){case w:s(e,n.start+1),n.prev=O.TEXT,n.d2t=!0;break;case P:s(e,n.start+1),n.prev=O.TEXT,n.d2t=!0;break;case k:s(e,n.start),n.state=A,n.prev=O.DOM;break;case A:s(e,n.start),n.prev=O.DOM}g.add(t.__destroy())}else switch(n.state){case w:s(e,n.start+1),u(r,n),n.state=P,n.prev=O.TEXT;break;case P:u(r,n),n.prev=O.TEXT;break;case A:s(e,n.start),n.prev=O.DOM,n.t2d=!0;break;case k:n.prev=O.DOM,n.t2d=!0}}function s(e,t){e.removeChild(e.childNodes[t])}function c(e,t){return(void 0===e||null===e)&&(e=""),(void 0===t||null===t)&&(t=""),e.toString()==t.toString()}function u(e,t){e.push({start:t.start,index:t.record.slice()})}function f(e,t){if(e!==t){var r=e.element;t.__uid=e.uid,t.__element=r;var n=Object.keys(e.props),i=Object.keys(t.props),s={};n.forEach(function(r){if(!/^on[A-Z]/.test(r)){s[r]=!0;var n=e.props[r],i=t.props[r];n!==i&&e.__updateAttr(r,i)}}),e.__removeListener(),i.forEach(function(e){if(/^on[A-Z]/.test(e)){var r=e.slice(2).replace(/[A-Z]/g,function(e){return e.toLowerCase()});t.__addListener(r,function(r){var n=t.props[e];n instanceof y?n.cb.call(n.context,r):n(r)})}else s.hasOwnProperty(e)||t.__updateAttr(e,t.props[e])});for(var c,u=e.children.length,f=t.children.length,l=[],d={start:0,record:[],first:!0},_=0,p=Math.min(u,f);p>_;_++){var v=e.children[_],m=t.children[_];c=[_],h(r,v,m,l,d,c)}for(var O=_;u>O;O++)o(r,e.children[O],l,d,c);for(var O=_;f>O;O++)c[c.length-1]=_,a(r,t.children[O],l,d,c);if(b.merge(l),l.length){if("textarea"==t.name)return void t.__updateAttr("value",b.value(l[0],t.children));l.forEach(function(e){b.update(e,t.children,r)})}g.add(e.__destroy())}}function l(e,t,r,n,i,a){v.hasOwnProperty("default")&&(v=v["default"]),i.first||(i.prev==O.TEXT?i.state=P:i.state=A),h(e,t,r,n,i,a,!0),i.t2d||i.d2t||(i.state==k?i.t2d=!0:i.state==w&&(i.d2t=!0))}function h(e,t,r,s,l,y,m){var D=Array.isArray(t),E=Array.isArray(r);if(D&&E){var T=t.length,M=r.length,C=T?1:0,x=M?2:0;switch(y.push(0),l.first&&b.record(y,l),C+x){case 0:l.state=P,l.prev=O.TEXT;break;case 1:h(e,t[0],r[0],s,l,y,m);for(var S=1;T>S;S++)o(e,t[S],s,l,y);break;case 2:h(e,t[0],r[0],s,l,y,m);for(var S=1;M>S;S++)y[y.length-1]=S,a(e,r[S],s,l,y);break;case 3:for(var S=0,j=Math.min(T,M);j>S;S++)y[y.length-1]=S,h(e,t[S],r[S],s,l,y,m&&!S);for(var L=S;T>L;L++)o(e,t[L],s,l,y);for(var L=S;M>L;L++)y[y.length-1]=S,a(e,r[L],s,l,y)}y.pop()}else if(D){h(e,t[0],r,s,l,y,m);for(var S=1,j=t.length;j>S;S++)o(e,t[S],s,l,y)}else if(E){y.push(0),h(e,t,r[0],s,l,y,m);for(var S=1,j=r.length;j>S;S++)y[y.length-1]=S,a(e,r[S],s,l,y);y.pop()}else{var H=t instanceof p?1:0,N=r instanceof p?2:0;switch(H+N){case 0:!l.first&&m&&d(l,e,r,s,y),b.record(y,l);var X=e.childNodes;if(l.first)c(t,r)||u(s,l);else if(c(t,r))switch(l.state){case w:u(s,l),e.removeChild(X[l.start+1]);break;case k:u(s,l),i(e,X,l.start,r,!0)}else switch(l.state){case w:u(s,l),e.removeChild(X[l.start+1]);break;case k:u(s,l),i(e,X,l.start,r,!0);break;case A:b.record(y,l);case P:c(t,r)||u(s,l)}l.state=P,l.prev=O.TEXT;break;case 1:b.record(y,l);var X=e.childNodes;if(l.first)n(e,X,l.start,r,!0);else switch(l.state){case w:case P:u(s,l),e.removeChild(X[l.start+1]);break;case k:n(e,X,l.start++,r,!0);break;case A:n(e,X,l.start,r,!0)}g.add(t.__destroy()),l.state=w,l.prev=O.TEXT;break;case 2:var X=e.childNodes;if(l.first)n(e,X,l.start++,r);else switch(l.state){case w:l.start++;case A:n(e,X,l.start++,r);break;case k:i(e,X,l.start++,r);break;case P:u(s,l),i(e,X,++l.start,r),l.start++}l.state=k,l.prev=O.DOM;break;case 3:if(!l.first){switch(l.state){case w:case P:l.start++}delete l.t2d,delete l.d2t}var F=t instanceof v?1:0,B=r instanceof v?2:0;switch(F+B){case 0:t.name==r.name?f(t,r):(e.insertAdjacentHTML("afterend",r.toString()),e.parentNode.removeChild(e),r.emit(_.DOM));break;case 1:f(t.virtualDom,r);break;case 2:f(t,r.virtualDom);
break;case 3:t.constructor==r.constructor?(r.toString(),f(t.virtualDom,r.virtualDom)):e.innerHTML=r.toString(),r.emit(_.DOM)}l.state=A,l.prev=O.DOM,l.start++,g.add(t.__destroy())}}l.first=!1}function d(e,t,r,n,a){e.t2d?(delete e.t2d,b.record(a,e),i(t,t.childNodes,e.start,r,!0)):e.d2t&&(delete e.d2t,u(n,e),s(t,e.start+1))}var _=function(){var e=r(1);return e.hasOwnProperty("default")?e["default"]:e}(),p=function(){var e=r(3);return e.hasOwnProperty("default")?e["default"]:e}(),v=function(){var e=r(4);return e.hasOwnProperty("default")?e["default"]:e}(),y=function(){var e=r(6);return e.hasOwnProperty("default")?e["default"]:e}(),m=function(){var e=r(2);return e.hasOwnProperty("default")?e["default"]:e}(),b=function(){var e=r(11);return e.hasOwnProperty("default")?e["default"]:e}(),g=function(){var e=r(8);return e.hasOwnProperty("default")?e["default"]:e}(),O=function(){var e=r(9);return e.hasOwnProperty("default")?e["default"]:e}(),w=0,A=1,k=2,P=3;t.diff=l,t.check=d},function(e,t,r){function n(e,t,r,n,a,s){o.hasOwnProperty("default")&&(o=o["default"]);var u=[],f={};i(e.length-1,e,t,r,n,a,u,String(e.length-1),f,s),c(u,function(e,t){return e[2]==t[2]?e[0]>t[0]:e[2]>t[2]});var l="";return u.forEach(function(e){l+=e[1]+";"}),l}function i(e,t,r,n,o,u,f,l,h,d){h[l]=!0;var _=[];_.push(t[e]);var p=0;r[e]&&(_.push(r[e]),p=1);var v=0;switch(n[e]&&(_.push(n[e]),v=2),c(_,function(e,t){return t>e}),o.hasOwnProperty("_*")&&_.push("*"),p+v){case 1:_.push(_[0]+_[1]),o.hasOwnProperty("_*.")&&_.push("*"+_[1]);break;case 2:_.push(_[0]+_[1]),o.hasOwnProperty("_*#")&&_.push("*"+_[1]);break;case 3:_.push(_[0]+_[1]),_.push(_[0]+_[2]),_.push(_[1]+_[2]),_.push(_[0]+_[1]+_[2]),o.hasOwnProperty("_*.")&&_.push("*"+_[1]),o.hasOwnProperty("_*#")&&_.push("*"+_[2]),o.hasOwnProperty("_*.#")&&_.push("*"+_[1]+_[2])}for(var y=0,m=_.length;m>y;y++){var b=_[y];if(o.hasOwnProperty(b)){var g=o[b];if(e){o._d&&i(e-1,t,r,n,g,u.parent,f,l+","+(e-1)+":"+y,h);for(var O=e-2;O>=0;O--){var w=l+","+O+":"+y;h.hasOwnProperty(w)||i(O,t,r,n,g,u.parent,f,w,h)}}if(g.hasOwnProperty("_v")&&a(f,g),d&&g.hasOwnProperty("_:")&&g["_:"].forEach(function(e){e[0].forEach(function(e){switch(e){case"hover":u.on(s.DOM,function(){u.element.addEventListener("mouseenter",function(e){u.__hover=!0,u.__updateStyle()}),u.element.addEventListener("mouseleave",function(e){u.__hover=!1,u.__updateStyle()})});break;case"active":u.on(s.DOM,function(){u.element.addEventListener("mousedown",function(e){u.__active=!0,u.__updateStyle()}),document.body.addEventListener("mouseup",function(e){u.__active=!1,u.__updateStyle()},!0),window.addEventListener("blur",function(e){u.__active=!1,u.__updateStyle()}),window.addEventListener("dragend",function(e){u.__active=!1,u.__updateStyle()})})}})}),g.hasOwnProperty("_:")){var A=g["_:"];A.forEach(function(o){var s=o[0],c=!0;e:for(var d=0,_=s.length;_>d;d++)switch(s[d]){case"hover":if(!u.__hover){c=!1;break e}break;case"active":if(!u.__active){c=!1;break e}break;case"first-child":if(!u.isFirst()){c=!1;break e}break;case"last-child":if(!u.isLast()){c=!1;break e}break;default:c=!1}c&&(A=o[1],e&&i(e-1,t,r,n,A,u.parent,f,l+","+(e-1)+":"+d,h),A.hasOwnProperty("_v")&&a(f,A))})}if(g.hasOwnProperty("_[")){var A=g["_["];A.forEach(function(o){var s=o[0],c=!0;e:for(var d=0,_=s.length;_>d;d++){var p=s[d];if(1==p.length){if(!u.__cache.hasOwnProperty(p[0])){c=!1;break}}else{var v=u.__cache[p[0]];if(void 0===v){c=!1;break e}var y=p[2];switch(p[1]){case"=":c=v==y;break;case"^=":c=0==v.indexOf(y);break;case"$=":c=v.length>=y.length&&v.indexOf(y)==v.length-y.length;break;case"~=":var m=new RegExp("\\b"+y+"\\b");c=m.test(v);break;case"*=":c=v.indexOf(y)>-1;break;case"|=":c=0==v.indexOf(y)||0==v.indexOf(y+"-");break;default:c=!1;break e}if(!c)break e}}c&&(A=o[1],e&&i(e-1,t,r,n,A,u.parent,f,l+","+(e-1)+":"+d,h),A.hasOwnProperty("_v")&&a(f,A))})}}}}function a(e,t){t._v.forEach(function(r){r[2]=t._p,e.push(r)})}var o=function(){var e=r(5);return e.hasOwnProperty("default")?e["default"]:e}(),s=function(){var e=r(1);return e.hasOwnProperty("default")?e["default"]:e}(),c=function(){var e=r(12);return e.hasOwnProperty("default")?e["default"]:e}();t["default"]=n},function(e,t,r){var n=function(){var e=r(1);return e.hasOwnProperty("default")?e["default"]:e}(),i=function(){var e=r(3);return e.hasOwnProperty("default")?e["default"]:e}(),a=function(){var e=r(4);return e.hasOwnProperty("default")?e["default"]:e}(),o=function(){var e=r(5);return e.hasOwnProperty("default")?e["default"]:e}(),s=function(){var e=r(14);return e.hasOwnProperty("default")?e["default"]:e}(),c=function(){var e=r(13);return e.hasOwnProperty("default")?e["default"]:e}(),u=(function(){var e=r(2);return e.hasOwnProperty("default")?e["default"]:e}(),function(){var e=r(7);return e.hasOwnProperty("default")?e["default"]:e}()),f=function(){var e=r(6);return e.hasOwnProperty("default")?e["default"]:e}(),l=function(){var e=r(8);return e.hasOwnProperty("default")?e["default"]:e}(),h=function(){var e=r(10);return e.hasOwnProperty("default")?e["default"]:e}(),d={render:function(e,t){return t&&e.inTo(t),e},createCp:function(e,t,r){return new e(t,r)},createVd:function(e,t,r){return l.index?l.get().__reset(e,t,r):new o(e,t,r)},Event:n,eventBus:h,Element:i,Component:a,NonVisualComponent:s,CacheComponent:c,VirtualDom:o,Obj:u,Cb:f};"undefined"!=typeof window&&(window.migi=d),t["default"]=d}]);