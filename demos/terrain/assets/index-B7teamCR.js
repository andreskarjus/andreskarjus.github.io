var e=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var t=e((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m){if(n(c)!==null)m=!0,S||(S=!0,T());else{var t=n(l);t!==null&&O(x,t.startTime-e)}}}var S=!1,C=-1,w=5,ee=-1;function te(){return g?!0:!(e.unstable_now()-ee<w)}function ne(){if(g=!1,S){var t=e.unstable_now();ee=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(C),C=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&te());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&O(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}}}finally{i?T():S=!1}}}var T;if(typeof y==`function`)T=function(){y(ne)};else if(typeof MessageChannel<`u`){var E=new MessageChannel,D=E.port2;E.port1.onmessage=ne,T=function(){D.postMessage(null)}}else T=function(){_(ne,0)};function O(t,n){C=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):w=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(C),C=-1):h=!0,O(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,T()))),r},e.unstable_shouldYield=te,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),n=e(((e,n)=>{n.exports=t()})),r=e((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var S=Array.isArray;function C(){}var w={H:null,A:null,T:null,S:null},ee=Object.prototype.hasOwnProperty;function te(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function ne(e,t){return te(e.type,t,e.props)}function T(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function E(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var D=/\/+/g;function O(e,t){return typeof e==`object`&&e&&e.key!=null?E(``+e.key):t.toString(36)}function re(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(C,C):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function ie(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,ie(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+O(e,0):a,S(o)?(i=``,c!=null&&(i=c.replace(D,`$&/`)+`/`),ie(o,r,i,``,function(e){return e})):o!=null&&(T(o)&&(o=ne(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(D,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(S(e))for(var u=0;u<e.length;u++)a=e[u],s=l+O(a,u),c+=ie(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+O(a,u++),c+=ie(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return ie(re(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function k(e,t,n){if(e==null)return e;var r=[],i=0;return ie(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function A(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var j=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},M={map:k,forEach:function(e,t,n){k(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return k(e,function(){t++}),t},toArray:function(e){return k(e,function(e){return e})||[]},only:function(e){if(!T(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=M,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=w,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return w.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!ee.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return te(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)ee.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return te(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=T,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:A}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=w.T,n={};w.T=n;try{var r=e(),i=w.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(C,j)}catch(e){j(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),w.T=t}},e.unstable_useCacheRefresh=function(){return w.H.useCacheRefresh()},e.use=function(e){return w.H.use(e)},e.useActionState=function(e,t,n){return w.H.useActionState(e,t,n)},e.useCallback=function(e,t){return w.H.useCallback(e,t)},e.useContext=function(e){return w.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return w.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return w.H.useEffect(e,t)},e.useEffectEvent=function(e){return w.H.useEffectEvent(e)},e.useId=function(){return w.H.useId()},e.useImperativeHandle=function(e,t,n){return w.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return w.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return w.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return w.H.useMemo(e,t)},e.useOptimistic=function(e,t){return w.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return w.H.useReducer(e,t,n)},e.useRef=function(e){return w.H.useRef(e)},e.useState=function(e){return w.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return w.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return w.H.useTransition()},e.version=`19.2.6`})),i=e(((e,t)=>{t.exports=r()})),a=e((e=>{var t=i();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var a={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},o=Symbol.for(`react.portal`);function s(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:o,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var c=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function l(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=a,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return s(e,t,null,r)},e.flushSync=function(e){var t=c.T,n=a.p;try{if(c.T=null,a.p=2,e)return e()}finally{c.T=t,a.p=n,a.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,a.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&a.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=l(n,t.crossOrigin),i=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?a.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:i,fetchPriority:o}):n===`script`&&a.d.X(e,{crossOrigin:r,integrity:i,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=l(t.as,t.crossOrigin);a.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??a.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=l(n,t.crossOrigin);a.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=l(t.as,t.crossOrigin);a.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else a.d.m(e)}},e.requestFormReset=function(e){a.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return c.H.useFormState(e,t,n)},e.useFormStatus=function(){return c.H.useHostTransitionStatus()},e.version=`19.2.6`})),o=e(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=a()})),s=e((e=>{var t=n(),r=i(),a=o();function s(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function c(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function l(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function u(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function d(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function f(e){if(l(e)!==e)throw Error(s(188))}function p(e){var t=e.alternate;if(!t){if(t=l(e),t===null)throw Error(s(188));return t===e?e:null}for(var n=e,r=t;;){var i=n.return;if(i===null)break;var a=i.alternate;if(a===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===a.child){for(a=i.child;a;){if(a===n)return f(i),e;if(a===r)return f(i),t;a=a.sibling}throw Error(s(188))}if(n.return!==r.return)n=i,r=a;else{for(var o=!1,c=i.child;c;){if(c===n){o=!0,n=i,r=a;break}if(c===r){o=!0,r=i,n=a;break}c=c.sibling}if(!o){for(c=a.child;c;){if(c===n){o=!0,n=a,r=i;break}if(c===r){o=!0,r=a,n=i;break}c=c.sibling}if(!o)throw Error(s(189))}}if(n.alternate!==r)throw Error(s(190))}if(n.tag!==3)throw Error(s(188));return n.stateNode.current===n?e:t}function m(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=m(e),t!==null)return t;e=e.sibling}return null}var h=Object.assign,g=Symbol.for(`react.element`),_=Symbol.for(`react.transitional.element`),v=Symbol.for(`react.portal`),y=Symbol.for(`react.fragment`),b=Symbol.for(`react.strict_mode`),x=Symbol.for(`react.profiler`),S=Symbol.for(`react.consumer`),C=Symbol.for(`react.context`),w=Symbol.for(`react.forward_ref`),ee=Symbol.for(`react.suspense`),te=Symbol.for(`react.suspense_list`),ne=Symbol.for(`react.memo`),T=Symbol.for(`react.lazy`),E=Symbol.for(`react.activity`),D=Symbol.for(`react.memo_cache_sentinel`),O=Symbol.iterator;function re(e){return typeof e!=`object`||!e?null:(e=O&&e[O]||e[`@@iterator`],typeof e==`function`?e:null)}var ie=Symbol.for(`react.client.reference`);function k(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===ie?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case y:return`Fragment`;case x:return`Profiler`;case b:return`StrictMode`;case ee:return`Suspense`;case te:return`SuspenseList`;case E:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case v:return`Portal`;case C:return e.displayName||`Context`;case S:return(e._context.displayName||`Context`)+`.Consumer`;case w:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case ne:return t=e.displayName||null,t===null?k(e.type)||`Memo`:t;case T:t=e._payload,e=e._init;try{return k(e(t))}catch{}}return null}var A=Array.isArray,j=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,M=a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ae={pending:!1,data:null,method:null,action:null},oe=[],N=-1;function se(e){return{current:e}}function P(e){0>N||(e.current=oe[N],oe[N]=null,N--)}function F(e,t){N++,oe[N]=e.current,e.current=t}var ce=se(null),le=se(null),ue=se(null),de=se(null);function fe(e,t){switch(F(ue,t),F(le,e),F(ce,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Vd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Vd(t),e=Hd(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}P(ce),F(ce,e)}function pe(){P(ce),P(le),P(ue)}function me(e){e.memoizedState!==null&&F(de,e);var t=ce.current,n=Hd(t,e.type);t!==n&&(F(le,e),F(ce,n))}function he(e){le.current===e&&(P(ce),P(le)),de.current===e&&(P(de),Qf._currentValue=ae)}var ge,_e;function ve(e){if(ge===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);ge=t&&t[1]||``,_e=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+ge+e+_e}var ye=!1;function be(e,t){if(!e||ye)return``;ye=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{ye=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?ve(n):``}function xe(e,t){switch(e.tag){case 26:case 27:case 5:return ve(e.type);case 16:return ve(`Lazy`);case 13:return e.child!==t&&t!==null?ve(`Suspense Fallback`):ve(`Suspense`);case 19:return ve(`SuspenseList`);case 0:case 15:return be(e.type,!1);case 11:return be(e.type.render,!1);case 1:return be(e.type,!0);case 31:return ve(`Activity`);default:return``}}function Se(e){try{var t=``,n=null;do t+=xe(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Ce=Object.prototype.hasOwnProperty,we=t.unstable_scheduleCallback,Te=t.unstable_cancelCallback,Ee=t.unstable_shouldYield,De=t.unstable_requestPaint,Oe=t.unstable_now,ke=t.unstable_getCurrentPriorityLevel,Ae=t.unstable_ImmediatePriority,je=t.unstable_UserBlockingPriority,I=t.unstable_NormalPriority,Me=t.unstable_LowPriority,Ne=t.unstable_IdlePriority,Pe=t.log,Fe=t.unstable_setDisableYieldValue,Ie=null,Le=null;function Re(e){if(typeof Pe==`function`&&Fe(e),Le&&typeof Le.setStrictMode==`function`)try{Le.setStrictMode(Ie,e)}catch{}}var ze=Math.clz32?Math.clz32:He,Be=Math.log,Ve=Math.LN2;function He(e){return e>>>=0,e===0?32:31-(Be(e)/Ve|0)|0}var Ue=256,We=262144,Ge=4194304;function Ke(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function qe(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=Ke(n))):i=Ke(o):i=Ke(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=Ke(n))):i=Ke(o)):i=Ke(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function Je(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Ye(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Xe(){var e=Ge;return Ge<<=1,!(Ge&62914560)&&(Ge=4194304),e}function Ze(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Qe(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function $e(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-ze(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&et(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function et(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-ze(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function tt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-ze(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function nt(e,t){var n=t&-t;return n=n&42?1:rt(n),(n&(e.suspendedLanes|t))===0?n:0}function rt(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function it(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function at(){var e=M.p;return e===0?(e=window.event,e===void 0?32:mp(e.type)):e}function ot(e,t){var n=M.p;try{return M.p=e,t()}finally{M.p=n}}var st=Math.random().toString(36).slice(2),L=`__reactFiber$`+st,ct=`__reactProps$`+st,lt=`__reactContainer$`+st,ut=`__reactEvents$`+st,dt=`__reactListeners$`+st,ft=`__reactHandles$`+st,pt=`__reactResources$`+st,mt=`__reactMarker$`+st;function ht(e){delete e[L],delete e[ct],delete e[ut],delete e[dt],delete e[ft]}function gt(e){var t=e[L];if(t)return t;for(var n=e.parentNode;n;){if(t=n[lt]||n[L]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=df(e);e!==null;){if(n=e[L])return n;e=df(e)}return t}e=n,n=e.parentNode}return null}function _t(e){if(e=e[L]||e[lt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function vt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(s(33))}function yt(e){var t=e[pt];return t||=e[pt]={hoistableStyles:new Map,hoistableScripts:new Map},t}function bt(e){e[mt]=!0}var xt=new Set,St={};function Ct(e,t){wt(e,t),wt(e+`Capture`,t)}function wt(e,t){for(St[e]=t,e=0;e<t.length;e++)xt.add(t[e])}var Tt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Et={},Dt={};function Ot(e){return Ce.call(Dt,e)?!0:Ce.call(Et,e)?!1:Tt.test(e)?Dt[e]=!0:(Et[e]=!0,!1)}function kt(e,t,n){if(Ot(t)){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}}function At(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function jt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function Mt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Nt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Pt(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ft(e){if(!e._valueTracker){var t=Nt(e)?`checked`:`value`;e._valueTracker=Pt(e,t,``+e[t])}}function It(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Nt(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}function Lt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var Rt=/[\n"\\]/g;function zt(e){return e.replace(Rt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function Bt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+Mt(t)):e.value!==``+Mt(t)&&(e.value=``+Mt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Ht(e,o,Mt(n)):Ht(e,o,Mt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+Mt(s):e.removeAttribute(`name`)}function Vt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Ft(e);return}n=n==null?``:``+Mt(n),t=t==null?n:``+Mt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Ft(e)}function Ht(e,t,n){t===`number`&&Lt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Ut(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+Mt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Wt(e,t,n){if(t!=null&&(t=``+Mt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+Mt(n)}function Gt(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(s(92));if(A(r)){if(1<r.length)throw Error(s(93));r=r[0]}n=r}n??=``,t=n}n=Mt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Ft(e)}function Kt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var qt=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function Jt(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||qt.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function Yt(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(s(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var i in t)r=t[i],t.hasOwnProperty(i)&&n[i]!==r&&Jt(e,i,r)}else for(var a in t)t.hasOwnProperty(a)&&Jt(e,a,t[a])}function Xt(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var Zt=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),Qt=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function $t(e){return Qt.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function en(){}var tn=null;function nn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var rn=null,an=null;function on(e){var t=_t(e);if(t&&(e=t.stateNode)){var n=e[ct]||null;a:switch(e=t.stateNode,t.type){case`input`:if(Bt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+zt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var i=r[ct]||null;if(!i)throw Error(s(90));Bt(r,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&It(r)}break a;case`textarea`:Wt(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Ut(e,!!n.multiple,t,!1)}}}var sn=!1;function cn(e,t,n){if(sn)return e(t,n);sn=!0;try{return e(t)}finally{if(sn=!1,(rn!==null||an!==null)&&(bu(),rn&&(t=rn,e=an,an=rn=null,on(t),e)))for(t=0;t<e.length;t++)on(e[t])}}function ln(e,t){var n=e.stateNode;if(n===null)return null;var r=n[ct]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(s(231,t,typeof n));return n}var un=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),dn=!1;if(un)try{var fn={};Object.defineProperty(fn,"passive",{get:function(){dn=!0}}),window.addEventListener(`test`,fn,fn),window.removeEventListener(`test`,fn,fn)}catch{dn=!1}var pn=null,mn=null,hn=null;function gn(){if(hn)return hn;var e,t=mn,n=t.length,r,i=`value`in pn?pn.value:pn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return hn=i.slice(e,1<r?1-r:void 0)}function _n(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function vn(){return!0}function yn(){return!1}function bn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?vn:yn,this.isPropagationStopped=yn,this}return h(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=vn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=vn)},persist:function(){},isPersistent:vn}),t}var xn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Sn=bn(xn),Cn=h({},xn,{view:0,detail:0}),wn=bn(Cn),Tn,En,R,Dn=h({},Cn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Rn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==R&&(R&&e.type===`mousemove`?(Tn=e.screenX-R.screenX,En=e.screenY-R.screenY):En=Tn=0,R=e),Tn)},movementY:function(e){return`movementY`in e?e.movementY:En}}),On=bn(Dn),kn=bn(h({},Dn,{dataTransfer:0})),An=bn(h({},Cn,{relatedTarget:0})),jn=bn(h({},xn,{animationName:0,elapsedTime:0,pseudoElement:0})),Mn=bn(h({},xn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Nn=bn(h({},xn,{data:0})),Pn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Fn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},In={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Ln(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=In[e])?!!t[e]:!1}function Rn(){return Ln}var zn=bn(h({},Cn,{key:function(e){if(e.key){var t=Pn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=_n(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Fn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Rn,charCode:function(e){return e.type===`keypress`?_n(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?_n(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Bn=bn(h({},Dn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Vn=bn(h({},Cn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Rn})),Hn=bn(h({},xn,{propertyName:0,elapsedTime:0,pseudoElement:0})),Un=bn(h({},Dn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Wn=bn(h({},xn,{newState:0,oldState:0})),Gn=[9,13,27,32],Kn=un&&`CompositionEvent`in window,qn=null;un&&`documentMode`in document&&(qn=document.documentMode);var Jn=un&&`TextEvent`in window&&!qn,Yn=un&&(!Kn||qn&&8<qn&&11>=qn),Xn=` `,Zn=!1;function Qn(e,t){switch(e){case`keyup`:return Gn.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function $n(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var er=!1;function tr(e,t){switch(e){case`compositionend`:return $n(t);case`keypress`:return t.which===32?(Zn=!0,Xn):null;case`textInput`:return e=t.data,e===Xn&&Zn?null:e;default:return null}}function nr(e,t){if(er)return e===`compositionend`||!Kn&&Qn(e,t)?(e=gn(),hn=mn=pn=null,er=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return Yn&&t.locale!==`ko`?null:t.data;default:return null}}var rr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ir(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!rr[e.type]:t===`textarea`}function ar(e,t,n,r){rn?an?an.push(r):an=[r]:rn=r,t=Ed(t,`onChange`),0<t.length&&(n=new Sn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var or=null,sr=null;function cr(e){yd(e,0)}function lr(e){if(It(vt(e)))return e}function ur(e,t){if(e===`change`)return t}var dr=!1;if(un){var fr;if(un){var pr=`oninput`in document;if(!pr){var mr=document.createElement(`div`);mr.setAttribute(`oninput`,`return;`),pr=typeof mr.oninput==`function`}fr=pr}else fr=!1;dr=fr&&(!document.documentMode||9<document.documentMode)}function hr(){or&&(or.detachEvent(`onpropertychange`,gr),sr=or=null)}function gr(e){if(e.propertyName===`value`&&lr(sr)){var t=[];ar(t,sr,e,nn(e)),cn(cr,t)}}function _r(e,t,n){e===`focusin`?(hr(),or=t,sr=n,or.attachEvent(`onpropertychange`,gr)):e===`focusout`&&hr()}function vr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return lr(sr)}function yr(e,t){if(e===`click`)return lr(t)}function br(e,t){if(e===`input`||e===`change`)return lr(t)}function xr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Sr=typeof Object.is==`function`?Object.is:xr;function Cr(e,t){if(Sr(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Ce.call(t,i)||!Sr(e[i],t[i]))return!1}return!0}function wr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Tr(e,t){var n=wr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=wr(n)}}function Er(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Er(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Dr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Lt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Lt(e.document)}return t}function Or(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var kr=un&&`documentMode`in document&&11>=document.documentMode,Ar=null,jr=null,Mr=null,Nr=!1;function Pr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Nr||Ar==null||Ar!==Lt(r)||(r=Ar,`selectionStart`in r&&Or(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Mr&&Cr(Mr,r)||(Mr=r,r=Ed(jr,`onSelect`),0<r.length&&(t=new Sn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Ar)))}function Fr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Ir={animationend:Fr(`Animation`,`AnimationEnd`),animationiteration:Fr(`Animation`,`AnimationIteration`),animationstart:Fr(`Animation`,`AnimationStart`),transitionrun:Fr(`Transition`,`TransitionRun`),transitionstart:Fr(`Transition`,`TransitionStart`),transitioncancel:Fr(`Transition`,`TransitionCancel`),transitionend:Fr(`Transition`,`TransitionEnd`)},Lr={},Rr={};un&&(Rr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Ir.animationend.animation,delete Ir.animationiteration.animation,delete Ir.animationstart.animation),`TransitionEvent`in window||delete Ir.transitionend.transition);function zr(e){if(Lr[e])return Lr[e];if(!Ir[e])return e;var t=Ir[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Rr)return Lr[e]=t[n];return e}var Br=zr(`animationend`),Vr=zr(`animationiteration`),Hr=zr(`animationstart`),Ur=zr(`transitionrun`),Wr=zr(`transitionstart`),Gr=zr(`transitioncancel`),Kr=zr(`transitionend`),qr=new Map,z=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);z.push(`scrollEnd`);function Jr(e,t){qr.set(e,t),Ct(t,[e])}var Yr=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},B=[],Xr=0,Zr=0;function Qr(){for(var e=Xr,t=Zr=Xr=0;t<e;){var n=B[t];B[t++]=null;var r=B[t];B[t++]=null;var i=B[t];B[t++]=null;var a=B[t];if(B[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&ni(n,i,a)}}function $r(e,t,n,r){B[Xr++]=e,B[Xr++]=t,B[Xr++]=n,B[Xr++]=r,Zr|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function ei(e,t,n,r){return $r(e,t,n,r),ri(e)}function ti(e,t){return $r(e,null,null,t),ri(e)}function ni(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-ze(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function ri(e){if(50<du)throw du=0,fu=null,Error(s(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ii={};function ai(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function oi(e,t,n,r){return new ai(e,t,n,r)}function si(e){return e=e.prototype,!(!e||!e.isReactComponent)}function ci(e,t){var n=e.alternate;return n===null?(n=oi(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function li(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function ui(e,t,n,r,i,a){var o=0;if(r=e,typeof e==`function`)si(e)&&(o=1);else if(typeof e==`string`)o=Uf(e,n,ce.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case E:return e=oi(31,n,t,i),e.elementType=E,e.lanes=a,e;case y:return di(n.children,i,a,t);case b:o=8,i|=24;break;case x:return e=oi(12,n,t,i|2),e.elementType=x,e.lanes=a,e;case ee:return e=oi(13,n,t,i),e.elementType=ee,e.lanes=a,e;case te:return e=oi(19,n,t,i),e.elementType=te,e.lanes=a,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case C:o=10;break a;case S:o=9;break a;case w:o=11;break a;case ne:o=14;break a;case T:o=16,r=null;break a}o=29,n=Error(s(130,e===null?`null`:typeof e,``)),r=null}return t=oi(o,n,t,i),t.elementType=e,t.type=r,t.lanes=a,t}function di(e,t,n,r){return e=oi(7,e,r,t),e.lanes=n,e}function fi(e,t,n){return e=oi(6,e,null,t),e.lanes=n,e}function pi(e){var t=oi(18,null,null,0);return t.stateNode=e,t}function mi(e,t,n){return t=oi(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var hi=new WeakMap;function gi(e,t){if(typeof e==`object`&&e){var n=hi.get(e);return n===void 0?(t={value:e,source:t,stack:Se(t)},hi.set(e,t),t):n}return{value:e,source:t,stack:Se(t)}}var _i=[],vi=0,yi=null,bi=0,xi=[],Si=0,Ci=null,wi=1,Ti=``;function Ei(e,t){_i[vi++]=bi,_i[vi++]=yi,yi=e,bi=t}function Di(e,t,n){xi[Si++]=wi,xi[Si++]=Ti,xi[Si++]=Ci,Ci=e;var r=wi;e=Ti;var i=32-ze(r)-1;r&=~(1<<i),n+=1;var a=32-ze(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,wi=1<<32-ze(t)+i|n<<i|r,Ti=a+e}else wi=1<<a|n<<i|r,Ti=e}function Oi(e){e.return!==null&&(Ei(e,1),Di(e,1,0))}function ki(e){for(;e===yi;)yi=_i[--vi],_i[vi]=null,bi=_i[--vi],_i[vi]=null;for(;e===Ci;)Ci=xi[--Si],xi[Si]=null,Ti=xi[--Si],xi[Si]=null,wi=xi[--Si],xi[Si]=null}function Ai(e,t){xi[Si++]=wi,xi[Si++]=Ti,xi[Si++]=Ci,wi=t.id,Ti=t.overflow,Ci=e}var ji=null,V=null,H=!1,Mi=null,Ni=!1,Pi=Error(s(519));function Fi(e){throw Vi(gi(Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),Pi}function Ii(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[L]=e,t[ct]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<_d.length;n++)Q(_d[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),Vt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),Gt(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||Md(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=en),t=!0):t=!1,t||Fi(e,!0)}function Li(e){for(ji=e.return;ji;)switch(ji.tag){case 5:case 31:case 13:Ni=!1;return;case 27:case 3:Ni=!0;return;default:ji=ji.return}}function Ri(e){if(e!==ji)return!1;if(!H)return Li(e),H=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=n===`form`||n===`button`||Ud(e.type,e.memoizedProps)),n=!n),n&&V&&Fi(e),Li(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(s(317));V=uf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(s(317));V=uf(e)}else t===27?(t=V,Zd(e.type)?(e=lf,lf=null,V=e):V=t):V=ji?cf(e.stateNode.nextSibling):null;return!0}function zi(){V=ji=null,H=!1}function Bi(){var e=Mi;return e!==null&&(Zl===null?Zl=e:Zl.push.apply(Zl,e),Mi=null),e}function Vi(e){Mi===null?Mi=[e]:Mi.push(e)}var Hi=se(null),Ui=null,Wi=null;function Gi(e,t,n){F(Hi,t._currentValue),t._currentValue=n}function Ki(e){e._currentValue=Hi.current,P(Hi)}function U(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function qi(e,t,n,r){var i=e.child;for(i!==null&&(i.return=e);i!==null;){var a=i.dependencies;if(a!==null){var o=i.child;a=a.firstContext;a:for(;a!==null;){var c=a;a=i;for(var l=0;l<t.length;l++)if(c.context===t[l]){a.lanes|=n,c=a.alternate,c!==null&&(c.lanes|=n),U(a.return,n,e),r||(o=null);break a}a=c.next}}else if(i.tag===18){if(o=i.return,o===null)throw Error(s(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),U(o,n,e),o=null}else o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===e){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}}function Ji(e,t,n,r){e=null;for(var i=t,a=!1;i!==null;){if(!a){if(i.flags&524288)a=!0;else if(i.flags&262144)break}if(i.tag===10){var o=i.alternate;if(o===null)throw Error(s(387));if(o=o.memoizedProps,o!==null){var c=i.type;Sr(i.pendingProps.value,o.value)||(e===null?e=[c]:e.push(c))}}else if(i===de.current){if(o=i.alternate,o===null)throw Error(s(387));o.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(e===null?e=[Qf]:e.push(Qf))}i=i.return}e!==null&&qi(t,e,n,r),t.flags|=262144}function W(e){for(e=e.firstContext;e!==null;){if(!Sr(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Yi(e){Ui=e,Wi=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Xi(e){return Qi(Ui,e)}function Zi(e,t){return Ui===null&&Yi(e),Qi(e,t)}function Qi(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Wi===null){if(e===null)throw Error(s(308));Wi=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Wi=Wi.next=t;return n}var $i=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},ea=t.unstable_scheduleCallback,ta=t.unstable_NormalPriority,na={$$typeof:C,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function ra(){return{controller:new $i,data:new Map,refCount:0}}function ia(e){e.refCount--,e.refCount===0&&ea(ta,function(){e.controller.abort()})}var aa=null,oa=0,sa=0,ca=null;function la(e,t){if(aa===null){var n=aa=[];oa=0,sa=dd(),ca={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return oa++,t.then(ua,ua),t}function ua(){if(--oa===0&&aa!==null){ca!==null&&(ca.status=`fulfilled`);var e=aa;aa=null,sa=0,ca=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function da(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var fa=j.S;j.S=function(e,t){eu=Oe(),typeof t==`object`&&t&&typeof t.then==`function`&&la(e,t),fa!==null&&fa(e,t)};var pa=se(null);function ma(){var e=pa.current;return e===null?Rl.pooledCache:e}function ha(e,t){t===null?F(pa,pa.current):F(pa,t.pool)}function ga(){var e=ma();return e===null?null:{parent:na._currentValue,pool:e}}var _a=Error(s(460)),va=Error(s(474)),ya=Error(s(542)),ba={then:function(){}};function xa(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Sa(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(en,en),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Ea(e),e;default:if(typeof t.status==`string`)t.then(en,en);else{if(e=Rl,e!==null&&100<e.shellSuspendCounter)throw Error(s(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Ea(e),e}throw wa=t,_a}}function Ca(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(wa=e,_a):e}}var wa=null;function Ta(){if(wa===null)throw Error(s(459));var e=wa;return wa=null,e}function Ea(e){if(e===_a||e===ya)throw Error(s(483))}var Da=null,Oa=0;function ka(e){var t=Oa;return Oa+=1,Da===null&&(Da=[]),Sa(Da,e,t)}function Aa(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function ja(e,t){throw t.$$typeof===g?Error(s(525)):(e=Object.prototype.toString.call(t),Error(s(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function Ma(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function i(e,t){return e=ci(e,t),e.index=0,e.sibling=null,e}function a(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function o(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=fi(n,e.mode,r),t.return=e,t):(t=i(t,n),t.return=e,t)}function l(e,t,n,r){var a=n.type;return a===y?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===a||typeof a==`object`&&a&&a.$$typeof===T&&Ca(a)===t.type)?(t=i(t,n.props),Aa(t,n),t.return=e,t):(t=ui(n.type,n.key,n.props,null,e.mode,r),Aa(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=mi(n,e.mode,r),t.return=e,t):(t=i(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,a){return t===null||t.tag!==7?(t=di(n,e.mode,r,a),t.return=e,t):(t=i(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=fi(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case _:return n=ui(t.type,t.key,t.props,null,e.mode,n),Aa(n,t),n.return=e,n;case v:return t=mi(t,e.mode,n),t.return=e,t;case T:return t=Ca(t),f(e,t,n)}if(A(t)||re(t))return t=di(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,ka(t),n);if(t.$$typeof===C)return f(e,Zi(e,t),n);ja(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case _:return n.key===i?l(e,t,n,r):null;case v:return n.key===i?u(e,t,n,r):null;case T:return n=Ca(n),p(e,t,n,r)}if(A(n)||re(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,ka(n),r);if(n.$$typeof===C)return p(e,t,Zi(e,n),r);ja(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case _:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case v:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case T:return r=Ca(r),m(e,t,n,r,i)}if(A(r)||re(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,ka(r),i);if(r.$$typeof===C)return m(e,t,n,Zi(t,r),i);ja(t,r)}return null}function h(i,o,s,c){for(var l=null,u=null,d=o,h=o=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),o=a(_,o,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),H&&Ei(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(o=a(d,o,h),u===null?l=d:u.sibling=d,u=d);return H&&Ei(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),o=a(g,o,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),H&&Ei(i,h),l}function g(i,o,c,l){if(c==null)throw Error(s(151));for(var u=null,d=null,h=o,g=o=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(i,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(i,h),o=a(y,o,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(i,h),H&&Ei(i,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(i,v.value,l),v!==null&&(o=a(v,o,g),d===null?u=v:d.sibling=v,d=v);return H&&Ei(i,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,i,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),o=a(v,o,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(i,e)}),H&&Ei(i,g),u}function b(e,r,a,c){if(typeof a==`object`&&a&&a.type===y&&a.key===null&&(a=a.props.children),typeof a==`object`&&a){switch(a.$$typeof){case _:a:{for(var l=a.key;r!==null;){if(r.key===l){if(l=a.type,l===y){if(r.tag===7){n(e,r.sibling),c=i(r,a.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===T&&Ca(l)===r.type){n(e,r.sibling),c=i(r,a.props),Aa(c,a),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}a.type===y?(c=di(a.props.children,e.mode,c,a.key),c.return=e,e=c):(c=ui(a.type,a.key,a.props,null,e.mode,c),Aa(c,a),c.return=e,e=c)}return o(e);case v:a:{for(l=a.key;r!==null;){if(r.key===l){if(r.tag===4&&r.stateNode.containerInfo===a.containerInfo&&r.stateNode.implementation===a.implementation){n(e,r.sibling),c=i(r,a.children||[]),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}c=mi(a,e.mode,c),c.return=e,e=c}return o(e);case T:return a=Ca(a),b(e,r,a,c)}if(A(a))return h(e,r,a,c);if(re(a)){if(l=re(a),typeof l!=`function`)throw Error(s(150));return a=l.call(a),g(e,r,a,c)}if(typeof a.then==`function`)return b(e,r,ka(a),c);if(a.$$typeof===C)return b(e,r,Zi(e,a),c);ja(e,a)}return typeof a==`string`&&a!==``||typeof a==`number`||typeof a==`bigint`?(a=``+a,r!==null&&r.tag===6?(n(e,r.sibling),c=i(r,a),c.return=e,e=c):(n(e,r),c=fi(a,e.mode,c),c.return=e,e=c),o(e)):n(e,r)}return function(e,t,n,r){try{Oa=0;var i=b(e,t,n,r);return Da=null,i}catch(t){if(t===_a||t===ya)throw t;var a=oi(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var Na=Ma(!0),Pa=Ma(!1),Fa=!1;function Ia(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function La(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Ra(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function za(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,q&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=ri(e),ni(e,null,n),t}return $r(e,r,t,n),ri(e)}function Ba(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,tt(e,n)}}function Va(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Ha=!1;function Ua(){if(Ha){var e=ca;if(e!==null)throw e}}function Wa(e,t,n,r){Ha=!1;var i=e.updateQueue;Fa=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(Y&f)===f:(r&f)===f){f!==0&&f===sa&&(Ha=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var m=e,g=s;f=t;var _=n;switch(g.tag){case 1:if(m=g.payload,typeof m==`function`){d=m.call(_,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=g.payload,f=typeof m==`function`?m.call(_,d,f):m,f==null)break a;d=h({},d,f);break a;case 2:Fa=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),Gl|=o,e.lanes=o,e.memoizedState=d}}function Ga(e,t){if(typeof e!=`function`)throw Error(s(191,e));e.call(t)}function Ka(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Ga(n[e],t)}var qa=se(null),Ja=se(0);function Ya(e,t){e=Ul,F(Ja,e),F(qa,t),Ul=e|t.baseLanes}function Xa(){F(Ja,Ul),F(qa,qa.current)}function Za(){Ul=Ja.current,P(qa),P(Ja)}var Qa=se(null),$a=null;function eo(e){var t=e.alternate;F(ao,ao.current&1),F(Qa,e),$a===null&&(t===null||qa.current!==null||t.memoizedState!==null)&&($a=e)}function to(e){F(ao,ao.current),F(Qa,e),$a===null&&($a=e)}function no(e){e.tag===22?(F(ao,ao.current),F(Qa,e),$a===null&&($a=e)):ro(e)}function ro(){F(ao,ao.current),F(Qa,Qa.current)}function io(e){P(Qa),$a===e&&($a=null),P(ao)}var ao=se(0);function oo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||of(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var so=0,G=null,K=null,co=null,lo=!1,uo=!1,fo=!1,po=0,mo=0,ho=null,go=0;function _o(){throw Error(s(321))}function vo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Sr(e[n],t[n]))return!1;return!0}function yo(e,t,n,r,i,a){return so=a,G=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,j.H=e===null||e.memoizedState===null?Is:Ls,fo=!1,a=n(r,i),fo=!1,uo&&(a=xo(t,n,r,i)),bo(e),a}function bo(e){j.H=Fs;var t=K!==null&&K.next!==null;if(so=0,co=K=G=null,lo=!1,mo=0,ho=null,t)throw Error(s(300));e===null||ec||(e=e.dependencies,e!==null&&W(e)&&(ec=!0))}function xo(e,t,n,r){G=e;var i=0;do{if(uo&&(ho=null),mo=0,uo=!1,25<=i)throw Error(s(301));if(i+=1,co=K=null,e.updateQueue!=null){var a=e.updateQueue;a.lastEffect=null,a.events=null,a.stores=null,a.memoCache!=null&&(a.memoCache.index=0)}j.H=Rs,a=t(n,r)}while(uo);return a}function So(){var e=j.H,t=e.useState()[0];return t=typeof t.then==`function`?ko(t):t,e=e.useState()[0],(K===null?null:K.memoizedState)!==e&&(G.flags|=1024),t}function Co(){var e=po!==0;return po=0,e}function wo(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function To(e){if(lo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}lo=!1}so=0,co=K=G=null,uo=!1,mo=po=0,ho=null}function Eo(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return co===null?G.memoizedState=co=e:co=co.next=e,co}function Do(){if(K===null){var e=G.alternate;e=e===null?null:e.memoizedState}else e=K.next;var t=co===null?G.memoizedState:co.next;if(t!==null)co=t,K=e;else{if(e===null)throw G.alternate===null?Error(s(467)):Error(s(310));K=e,e={memoizedState:K.memoizedState,baseState:K.baseState,baseQueue:K.baseQueue,queue:K.queue,next:null},co===null?G.memoizedState=co=e:co=co.next=e}return co}function Oo(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ko(e){var t=mo;return mo+=1,ho===null&&(ho=[]),e=Sa(ho,e,t),t=G,(co===null?t.memoizedState:co.next)===null&&(t=t.alternate,j.H=t===null||t.memoizedState===null?Is:Ls),e}function Ao(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return ko(e);if(e.$$typeof===C)return Xi(e)}throw Error(s(438,String(e)))}function jo(e){var t=null,n=G.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=G.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=Oo(),G.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=D;return t.index++,n}function Mo(e,t){return typeof t==`function`?t(e):t}function No(e){return Po(Do(),K,e)}function Po(e,t,n){var r=e.queue;if(r===null)throw Error(s(311));r.lastRenderedReducer=n;var i=e.baseQueue,a=r.pending;if(a!==null){if(i!==null){var o=i.next;i.next=a.next,a.next=o}t.baseQueue=i=a,r.pending=null}if(a=e.baseState,i===null)e.memoizedState=a;else{t=i.next;var c=o=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(so&f)===f:(Y&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===sa&&(d=!0);else if((so&p)===p){u=u.next,p===sa&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,o=a):l=l.next=f,G.lanes|=p,Gl|=p;f=u.action,fo&&n(a,f),a=u.hasEagerState?u.eagerState:n(a,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,o=a):l=l.next=p,G.lanes|=f,Gl|=f;u=u.next}while(u!==null&&u!==t);if(l===null?o=a:l.next=c,!Sr(a,e.memoizedState)&&(ec=!0,d&&(n=ca,n!==null)))throw n;e.memoizedState=a,e.baseState=o,e.baseQueue=l,r.lastRenderedState=a}return i===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Fo(e){var t=Do(),n=t.queue;if(n===null)throw Error(s(311));n.lastRenderedReducer=e;var r=n.dispatch,i=n.pending,a=t.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do a=e(a,o.action),o=o.next;while(o!==i);Sr(a,t.memoizedState)||(ec=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function Io(e,t,n){var r=G,i=Do(),a=H;if(a){if(n===void 0)throw Error(s(407));n=n()}else n=t();var o=!Sr((K||i).memoizedState,n);if(o&&(i.memoizedState=n,ec=!0),i=i.queue,ss(zo.bind(null,r,i,e),[e]),i.getSnapshot!==t||o||co!==null&&co.memoizedState.tag&1){if(r.flags|=2048,ns(9,{destroy:void 0},Ro.bind(null,r,i,n,t),null),Rl===null)throw Error(s(349));a||so&127||Lo(r,t,n)}return n}function Lo(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=G.updateQueue,t===null?(t=Oo(),G.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Ro(e,t,n,r){t.value=n,t.getSnapshot=r,Bo(t)&&Vo(e)}function zo(e,t,n){return n(function(){Bo(t)&&Vo(e)})}function Bo(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Sr(e,n)}catch{return!0}}function Vo(e){var t=ti(e,2);t!==null&&hu(t,e,2)}function Ho(e){var t=Eo();if(typeof e==`function`){var n=e;if(e=n(),fo){Re(!0);try{n()}finally{Re(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mo,lastRenderedState:e},t}function Uo(e,t,n,r){return e.baseState=n,Po(e,K,typeof r==`function`?r:Mo)}function Wo(e,t,n,r,i){if(Ms(e))throw Error(s(485));if(e=t.action,e!==null){var a={payload:i,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){a.listeners.push(e)}};j.T===null?a.isTransition=!1:n(!0),r(a),n=t.pending,n===null?(a.next=t.pending=a,Go(t,a)):(a.next=n.next,t.pending=n.next=a)}}function Go(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=j.T,o={};j.T=o;try{var s=n(i,r),c=j.S;c!==null&&c(o,s),Ko(e,t,s)}catch(n){Jo(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),j.T=a}}else try{a=n(i,r),Ko(e,t,a)}catch(n){Jo(e,t,n)}}function Ko(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){qo(e,t,n)},function(n){return Jo(e,t,n)}):qo(e,t,n)}function qo(e,t,n){t.status=`fulfilled`,t.value=n,Yo(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Go(e,n)))}function Jo(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,Yo(t),t=t.next;while(t!==r)}e.action=null}function Yo(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Xo(e,t){return t}function Zo(e,t){if(H){var n=Rl.formState;if(n!==null){a:{var r=G;if(H){if(V){b:{for(var i=V,a=Ni;i.nodeType!==8;){if(!a){i=null;break b}if(i=cf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){V=cf(i.nextSibling),r=i.data===`F!`;break a}}Fi(r)}r=!1}r&&(t=n[0])}}return n=Eo(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Xo,lastRenderedState:t},n.queue=r,n=ks.bind(null,G,r),r.dispatch=n,r=Ho(!1),a=js.bind(null,G,!1,r.queue),r=Eo(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Wo.bind(null,G,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function Qo(e){return $o(Do(),K,e)}function $o(e,t,n){if(t=Po(e,t,Xo)[0],e=No(Mo)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=ko(t)}catch(e){throw e===_a?ya:e}else r=t;t=Do();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(G.flags|=2048,ns(9,{destroy:void 0},es.bind(null,i,n),null)),[r,a,e]}function es(e,t){e.action=t}function ts(e){var t=Do(),n=K;if(n!==null)return $o(t,n,e);Do(),t=t.memoizedState,n=Do();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function ns(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=G.updateQueue,t===null&&(t=Oo(),G.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function rs(){return Do().memoizedState}function is(e,t,n,r){var i=Eo();G.flags|=e,i.memoizedState=ns(1|t,{destroy:void 0},n,r===void 0?null:r)}function as(e,t,n,r){var i=Do();r=r===void 0?null:r;var a=i.memoizedState.inst;K!==null&&r!==null&&vo(r,K.memoizedState.deps)?i.memoizedState=ns(t,a,n,r):(G.flags|=e,i.memoizedState=ns(1|t,a,n,r))}function os(e,t){is(8390656,8,e,t)}function ss(e,t){as(2048,8,e,t)}function cs(e){G.flags|=4;var t=G.updateQueue;if(t===null)t=Oo(),G.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function ls(e){var t=Do().memoizedState;return cs({ref:t,nextImpl:e}),function(){if(q&2)throw Error(s(440));return t.impl.apply(void 0,arguments)}}function us(e,t){return as(4,2,e,t)}function ds(e,t){return as(4,4,e,t)}function fs(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function ps(e,t,n){n=n==null?null:n.concat([e]),as(4,4,fs.bind(null,t,e),n)}function ms(){}function hs(e,t){var n=Do();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&vo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function gs(e,t){var n=Do();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&vo(t,r[1]))return r[0];if(r=e(),fo){Re(!0);try{e()}finally{Re(!1)}}return n.memoizedState=[r,t],r}function _s(e,t,n){return n===void 0||so&1073741824&&!(Y&261930)?e.memoizedState=t:(e.memoizedState=n,e=mu(),G.lanes|=e,Gl|=e,n)}function vs(e,t,n,r){return Sr(n,t)?n:qa.current===null?!(so&42)||so&1073741824&&!(Y&261930)?(ec=!0,e.memoizedState=n):(e=mu(),G.lanes|=e,Gl|=e,t):(e=_s(e,n,r),Sr(e,t)||(ec=!0),e)}function ys(e,t,n,r,i){var a=M.p;M.p=a!==0&&8>a?a:8;var o=j.T,s={};j.T=s,js(e,!1,t,n);try{var c=i(),l=j.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?As(e,t,da(c,r),pu(e)):As(e,t,r,pu(e))}catch(n){As(e,t,{then:function(){},status:`rejected`,reason:n},pu())}finally{M.p=a,o!==null&&s.types!==null&&(o.types=s.types),j.T=o}}function bs(){}function xs(e,t,n,r){if(e.tag!==5)throw Error(s(476));var i=Ss(e).queue;ys(e,i,t,ae,n===null?bs:function(){return Cs(e),n(r)})}function Ss(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:ae,baseState:ae,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mo,lastRenderedState:ae},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mo,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Cs(e){var t=Ss(e);t.next===null&&(t=e.alternate.memoizedState),As(e,t.next.queue,{},pu())}function ws(){return Xi(Qf)}function Ts(){return Do().memoizedState}function Es(){return Do().memoizedState}function Ds(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=pu();e=Ra(n);var r=za(t,e,n);r!==null&&(hu(r,t,n),Ba(r,t,n)),t={cache:ra()},e.payload=t;return}t=t.return}}function Os(e,t,n){var r=pu();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Ms(e)?Ns(t,n):(n=ei(e,t,n,r),n!==null&&(hu(n,e,r),Ps(n,t,r)))}function ks(e,t,n){As(e,t,n,pu())}function As(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ms(e))Ns(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Sr(s,o))return $r(e,t,i,0),Rl===null&&Qr(),!1}catch{}if(n=ei(e,t,i,r),n!==null)return hu(n,e,r),Ps(n,t,r),!0}return!1}function js(e,t,n,r){if(r={lane:2,revertLane:dd(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Ms(e)){if(t)throw Error(s(479))}else t=ei(e,n,r,2),t!==null&&hu(t,e,2)}function Ms(e){var t=e.alternate;return e===G||t!==null&&t===G}function Ns(e,t){uo=lo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Ps(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,tt(e,n)}}var Fs={readContext:Xi,use:Ao,useCallback:_o,useContext:_o,useEffect:_o,useImperativeHandle:_o,useLayoutEffect:_o,useInsertionEffect:_o,useMemo:_o,useReducer:_o,useRef:_o,useState:_o,useDebugValue:_o,useDeferredValue:_o,useTransition:_o,useSyncExternalStore:_o,useId:_o,useHostTransitionStatus:_o,useFormState:_o,useActionState:_o,useOptimistic:_o,useMemoCache:_o,useCacheRefresh:_o};Fs.useEffectEvent=_o;var Is={readContext:Xi,use:Ao,useCallback:function(e,t){return Eo().memoizedState=[e,t===void 0?null:t],e},useContext:Xi,useEffect:os,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),is(4194308,4,fs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return is(4194308,4,e,t)},useInsertionEffect:function(e,t){is(4,2,e,t)},useMemo:function(e,t){var n=Eo();t=t===void 0?null:t;var r=e();if(fo){Re(!0);try{e()}finally{Re(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=Eo();if(n!==void 0){var i=n(t);if(fo){Re(!0);try{n(t)}finally{Re(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=Os.bind(null,G,e),[r.memoizedState,e]},useRef:function(e){var t=Eo();return e={current:e},t.memoizedState=e},useState:function(e){e=Ho(e);var t=e.queue,n=ks.bind(null,G,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:ms,useDeferredValue:function(e,t){return _s(Eo(),e,t)},useTransition:function(){var e=Ho(!1);return e=ys.bind(null,G,e.queue,!0,!1),Eo().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=G,i=Eo();if(H){if(n===void 0)throw Error(s(407));n=n()}else{if(n=t(),Rl===null)throw Error(s(349));Y&127||Lo(r,t,n)}i.memoizedState=n;var a={value:n,getSnapshot:t};return i.queue=a,os(zo.bind(null,r,a,e),[e]),r.flags|=2048,ns(9,{destroy:void 0},Ro.bind(null,r,a,n,t),null),n},useId:function(){var e=Eo(),t=Rl.identifierPrefix;if(H){var n=Ti,r=wi;n=(r&~(1<<32-ze(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=po++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=go++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:ws,useFormState:Zo,useActionState:Zo,useOptimistic:function(e){var t=Eo();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=js.bind(null,G,!0,n),n.dispatch=t,[e,t]},useMemoCache:jo,useCacheRefresh:function(){return Eo().memoizedState=Ds.bind(null,G)},useEffectEvent:function(e){var t=Eo(),n={impl:e};return t.memoizedState=n,function(){if(q&2)throw Error(s(440));return n.impl.apply(void 0,arguments)}}},Ls={readContext:Xi,use:Ao,useCallback:hs,useContext:Xi,useEffect:ss,useImperativeHandle:ps,useInsertionEffect:us,useLayoutEffect:ds,useMemo:gs,useReducer:No,useRef:rs,useState:function(){return No(Mo)},useDebugValue:ms,useDeferredValue:function(e,t){return vs(Do(),K.memoizedState,e,t)},useTransition:function(){var e=No(Mo)[0],t=Do().memoizedState;return[typeof e==`boolean`?e:ko(e),t]},useSyncExternalStore:Io,useId:Ts,useHostTransitionStatus:ws,useFormState:Qo,useActionState:Qo,useOptimistic:function(e,t){return Uo(Do(),K,e,t)},useMemoCache:jo,useCacheRefresh:Es};Ls.useEffectEvent=ls;var Rs={readContext:Xi,use:Ao,useCallback:hs,useContext:Xi,useEffect:ss,useImperativeHandle:ps,useInsertionEffect:us,useLayoutEffect:ds,useMemo:gs,useReducer:Fo,useRef:rs,useState:function(){return Fo(Mo)},useDebugValue:ms,useDeferredValue:function(e,t){var n=Do();return K===null?_s(n,e,t):vs(n,K.memoizedState,e,t)},useTransition:function(){var e=Fo(Mo)[0],t=Do().memoizedState;return[typeof e==`boolean`?e:ko(e),t]},useSyncExternalStore:Io,useId:Ts,useHostTransitionStatus:ws,useFormState:ts,useActionState:ts,useOptimistic:function(e,t){var n=Do();return K===null?(n.baseState=e,[e,n.queue.dispatch]):Uo(n,K,e,t)},useMemoCache:jo,useCacheRefresh:Es};Rs.useEffectEvent=ls;function zs(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:h({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Bs={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=pu(),i=Ra(r);i.payload=t,n!=null&&(i.callback=n),t=za(e,i,r),t!==null&&(hu(t,e,r),Ba(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=pu(),i=Ra(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=za(e,i,r),t!==null&&(hu(t,e,r),Ba(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=pu(),r=Ra(n);r.tag=2,t!=null&&(r.callback=t),t=za(e,r,n),t!==null&&(hu(t,e,n),Ba(t,e,n))}};function Vs(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Cr(n,r)||!Cr(i,a):!0}function Hs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Bs.enqueueReplaceState(t,t.state,null)}function Us(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=h({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Ws(e){Yr(e)}function Gs(e){console.error(e)}function Ks(e){Yr(e)}function qs(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function Js(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function Ys(e,t,n){return n=Ra(n),n.tag=3,n.payload={element:null},n.callback=function(){qs(e,t)},n}function Xs(e){return e=Ra(e),e.tag=3,e}function Zs(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){Js(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){Js(t,n,r),typeof i!=`function`&&(ru===null?ru=new Set([this]):ru.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function Qs(e,t,n,r,i){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&Ji(t,n,i,!0),n=Qa.current,n!==null){switch(n.tag){case 31:case 13:return $a===null?Du():n.alternate===null&&Wl===0&&(Wl=3),n.flags&=-257,n.flags|=65536,n.lanes=i,r===ba?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Gu(e,r,i)),!1;case 22:return n.flags|=65536,r===ba?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Gu(e,r,i)),!1}throw Error(s(435,n.tag))}return Gu(e,r,i),Du(),!1}if(H)return t=Qa.current,t===null?(r!==Pi&&(t=Error(s(423),{cause:r}),Vi(gi(t,n))),e=e.current.alternate,e.flags|=65536,i&=-i,e.lanes|=i,r=gi(r,n),i=Ys(e.stateNode,r,i),Va(e,i),Wl!==4&&(Wl=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=i,r!==Pi&&(e=Error(s(422),{cause:r}),Vi(gi(e,n)))),!1;var a=Error(s(520),{cause:r});if(a=gi(a,n),Xl===null?Xl=[a]:Xl.push(a),Wl!==4&&(Wl=2),t===null)return!0;r=gi(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=i&-i,n.lanes|=e,e=Ys(n.stateNode,r,e),Va(n,e),!1;case 1:if(t=n.type,a=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||a!==null&&typeof a.componentDidCatch==`function`&&(ru===null||!ru.has(a))))return n.flags|=65536,i&=-i,n.lanes|=i,i=Xs(i),Zs(i,e,n,r),Va(n,i),!1}n=n.return}while(n!==null);return!1}var $s=Error(s(461)),ec=!1;function tc(e,t,n,r){t.child=e===null?Pa(t,null,n,r):Na(t,e.child,n,r)}function nc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return Yi(t),r=yo(e,t,n,o,a,i),s=Co(),e!==null&&!ec?(wo(e,t,i),Ec(e,t,i)):(H&&s&&Oi(t),t.flags|=1,tc(e,t,r,i),t.child)}function rc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!si(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,ic(e,t,a,r,i)):(e=ui(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Dc(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Cr:n,n(o,r)&&e.ref===t.ref)return Ec(e,t,i)}return t.flags|=1,e=ci(a,r),e.ref=t.ref,e.return=t,t.child=e}function ic(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Cr(a,r)&&e.ref===t.ref){if(ec=!1,t.pendingProps=r=a,Dc(e,i))e.flags&131072&&(ec=!0);else return t.lanes=e.lanes,Ec(e,t,i)}}return fc(e,t,n,r,i)}function ac(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return sc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&ha(t,a===null?null:a.cachePool),a===null?Xa():Ya(t,a),no(t);else return r=t.lanes=536870912,sc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&ha(t,null),Xa(),ro(t)):(ha(t,a.cachePool),Ya(t,a),ro(t),t.memoizedState=null);return tc(e,t,i,n),t.child}function oc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function sc(e,t,n,r,i){var a=ma();return a=a===null?null:{parent:na._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&ha(t,null),Xa(),no(t),e!==null&&Ji(e,t,r,!0),t.childLanes=i,null}function cc(e,t){return t=xc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function lc(e,t,n){return Na(t,e.child,null,n),e=cc(t,t.pendingProps),e.flags|=2,io(t),t.memoizedState=null,e}function uc(e,t,n){var r=t.pendingProps,i=!!(t.flags&128);if(t.flags&=-129,e===null){if(H){if(r.mode===`hidden`)return e=cc(t,r),t.lanes=536870912,oc(null,e);if(to(t),(e=V)?(e=rf(e,Ni),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ci===null?null:{id:wi,overflow:Ti},retryLane:536870912,hydrationErrors:null},n=pi(e),n.return=t,t.child=n,ji=t,V=null)):e=null,e===null)throw Fi(t);return t.lanes=536870912,null}return cc(t,r)}var a=e.memoizedState;if(a!==null){var o=a.dehydrated;if(to(t),i){if(t.flags&256)t.flags&=-257,t=lc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(s(558))}else if(ec||Ji(e,t,n,!1),i=(n&e.childLanes)!==0,ec||i){if(r=Rl,r!==null&&(o=nt(r,n),o!==0&&o!==a.retryLane))throw a.retryLane=o,ti(e,o),hu(r,e,o),$s;Du(),t=lc(e,t,n)}else e=a.treeContext,V=cf(o.nextSibling),ji=t,H=!0,Mi=null,Ni=!1,e!==null&&Ai(t,e),t=cc(t,r),t.flags|=4096;return t}return e=ci(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function dc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(s(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function fc(e,t,n,r,i){return Yi(t),n=yo(e,t,n,r,void 0,i),r=Co(),e!==null&&!ec?(wo(e,t,i),Ec(e,t,i)):(H&&r&&Oi(t),t.flags|=1,tc(e,t,n,i),t.child)}function pc(e,t,n,r,i,a){return Yi(t),t.updateQueue=null,n=xo(t,r,n,i),bo(e),r=Co(),e!==null&&!ec?(wo(e,t,a),Ec(e,t,a)):(H&&r&&Oi(t),t.flags|=1,tc(e,t,n,a),t.child)}function mc(e,t,n,r,i){if(Yi(t),t.stateNode===null){var a=ii,o=n.contextType;typeof o==`object`&&o&&(a=Xi(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Bs,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},Ia(t),o=n.contextType,a.context=typeof o==`object`&&o?Xi(o):ii,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(zs(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&Bs.enqueueReplaceState(a,a.state,null),Wa(t,r,a,i),Ua(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Us(n,s);a.props=c;var l=a.context,u=n.contextType;o=ii,typeof u==`object`&&u&&(o=Xi(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&Hs(t,a,r,o),Fa=!1;var f=t.memoizedState;a.state=f,Wa(t,r,a,i),Ua(),l=t.memoizedState,s||f!==l||Fa?(typeof d==`function`&&(zs(t,n,d,r),l=t.memoizedState),(c=Fa||Vs(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,La(e,t),o=t.memoizedProps,u=Us(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=ii,typeof l==`object`&&l&&(c=Xi(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&Hs(t,a,r,c),Fa=!1,f=t.memoizedState,a.state=f,Wa(t,r,a,i),Ua();var p=t.memoizedState;o!==d||f!==p||Fa||e!==null&&e.dependencies!==null&&W(e.dependencies)?(typeof s==`function`&&(zs(t,n,s,r),p=t.memoizedState),(u=Fa||Vs(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&W(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,dc(e,t),r=!!(t.flags&128),a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=Na(t,e.child,null,i),t.child=Na(t,null,n,i)):tc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=Ec(e,t,i),e}function hc(e,t,n,r){return zi(),t.flags|=256,tc(e,t,n,r),t.child}var gc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function _c(e){return{baseLanes:e,cachePool:ga()}}function vc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=Jl),e}function yc(e,t,n){var r=t.pendingProps,i=!1,a=!!(t.flags&128),o;if((o=a)||(o=e!==null&&e.memoizedState===null?!1:!!(ao.current&2)),o&&(i=!0,t.flags&=-129),o=!!(t.flags&32),t.flags&=-33,e===null){if(H){if(i?eo(t):ro(t),(e=V)?(e=rf(e,Ni),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ci===null?null:{id:wi,overflow:Ti},retryLane:536870912,hydrationErrors:null},n=pi(e),n.return=t,t.child=n,ji=t,V=null)):e=null,e===null)throw Fi(t);return of(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,i?(ro(t),i=t.mode,c=xc({mode:`hidden`,children:c},i),r=di(r,i,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=_c(n),r.childLanes=vc(e,o,n),t.memoizedState=gc,oc(null,r)):(eo(t),bc(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(a)t.flags&256?(eo(t),t.flags&=-257,t=Sc(e,t,n)):t.memoizedState===null?(ro(t),c=r.fallback,i=t.mode,r=xc({mode:`visible`,children:r.children},i),c=di(c,i,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,Na(t,e.child,null,n),r=t.child,r.memoizedState=_c(n),r.childLanes=vc(e,o,n),t.memoizedState=gc,t=oc(null,r)):(ro(t),t.child=e.child,t.flags|=128,t=null);else if(eo(t),of(c)){if(o=c.nextSibling&&c.nextSibling.dataset,o)var u=o.dgst;o=u,r=Error(s(419)),r.stack=``,r.digest=o,Vi({value:r,source:null,stack:null}),t=Sc(e,t,n)}else if(ec||Ji(e,t,n,!1),o=(n&e.childLanes)!==0,ec||o){if(o=Rl,o!==null&&(r=nt(o,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,ti(e,r),hu(o,e,r),$s;af(c)||Du(),t=Sc(e,t,n)}else af(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,V=cf(c.nextSibling),ji=t,H=!0,Mi=null,Ni=!1,e!==null&&Ai(t,e),t=bc(t,r.children),t.flags|=4096);return t}return i?(ro(t),c=r.fallback,i=t.mode,l=e.child,u=l.sibling,r=ci(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=di(c,i,n,null),c.flags|=2):c=ci(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,oc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=_c(n):(i=c.cachePool,i===null?i=ga():(l=na._currentValue,i=i.parent===l?i:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:i}),r.memoizedState=c,r.childLanes=vc(e,o,n),t.memoizedState=gc,oc(e.child,r)):(eo(t),n=e.child,e=n.sibling,n=ci(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(o=t.deletions,o===null?(t.deletions=[e],t.flags|=16):o.push(e)),t.child=n,t.memoizedState=null,n)}function bc(e,t){return t=xc({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function xc(e,t){return e=oi(22,e,null,t),e.lanes=0,e}function Sc(e,t,n){return Na(t,e.child,null,n),e=bc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Cc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),U(e.return,t,n)}function wc(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function Tc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=ao.current,s=!!(o&2);if(s?(o=o&1|2,t.flags|=128):o&=1,F(ao,o),tc(e,t,r,n),r=H?bi:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Cc(e,n,t);else if(e.tag===19)Cc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&oo(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),wc(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&oo(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}wc(t,!0,n,null,a,r);break;case`together`:wc(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function Ec(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Gl|=t.lanes,(n&t.childLanes)===0){if(e!==null){if(Ji(e,t,n,!1),(n&t.childLanes)===0)return null}else return null}if(e!==null&&t.child!==e.child)throw Error(s(153));if(t.child!==null){for(e=t.child,n=ci(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=ci(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Dc(e,t){return(e.lanes&t)!==0||(e=e.dependencies,!!(e!==null&&W(e)))}function Oc(e,t,n){switch(t.tag){case 3:fe(t,t.stateNode.containerInfo),Gi(t,na,e.memoizedState.cache),zi();break;case 27:case 5:me(t);break;case 4:fe(t,t.stateNode.containerInfo);break;case 10:Gi(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,to(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(eo(t),e=Ec(e,t,n),e===null?null:e.sibling):yc(e,t,n):(eo(t),t.flags|=128,null);eo(t);break;case 19:var i=!!(e.flags&128);if(r=(n&t.childLanes)!==0,r||=(Ji(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return Tc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),F(ao,ao.current),r)break;return null;case 22:return t.lanes=0,ac(e,t,n,t.pendingProps);case 24:Gi(t,na,e.memoizedState.cache)}return Ec(e,t,n)}function kc(e,t,n){if(e!==null){if(e.memoizedProps!==t.pendingProps)ec=!0;else{if(!Dc(e,n)&&!(t.flags&128))return ec=!1,Oc(e,t,n);ec=!!(e.flags&131072)}}else ec=!1,H&&t.flags&1048576&&Di(t,bi,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=Ca(t.elementType),t.type=e,typeof e==`function`)si(e)?(r=Us(e,r),t.tag=1,t=mc(null,t,e,r,n)):(t.tag=0,t=fc(null,t,e,r,n));else{if(e!=null){var i=e.$$typeof;if(i===w){t.tag=11,t=nc(null,t,e,r,n);break a}if(i===ne){t.tag=14,t=rc(null,t,e,r,n);break a}}throw t=k(e)||e,Error(s(306,t,``))}}return t;case 0:return fc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,i=Us(r,t.pendingProps),mc(e,t,r,i,n);case 3:a:{if(fe(t,t.stateNode.containerInfo),e===null)throw Error(s(387));r=t.pendingProps;var a=t.memoizedState;i=a.element,La(e,t),Wa(t,r,null,n);var o=t.memoizedState;if(r=o.cache,Gi(t,na,r),r!==a.cache&&qi(t,[na],n,!0),Ua(),r=o.element,a.isDehydrated){if(a={element:r,isDehydrated:!1,cache:o.cache},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){t=hc(e,t,r,n);break a}if(r!==i){i=gi(Error(s(424)),t),Vi(i),t=hc(e,t,r,n);break a}switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(V=cf(e.firstChild),ji=t,H=!0,Mi=null,Ni=!0,n=Pa(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(zi(),r===i){t=Ec(e,t,n);break a}tc(e,t,r,n)}t=t.child}return t;case 26:return dc(e,t),e===null?(n=kf(t.type,null,t.pendingProps,null))?t.memoizedState=n:H||(n=t.type,e=t.pendingProps,r=Bd(ue.current).createElement(n),r[L]=t,r[ct]=e,Pd(r,n,e),bt(r),t.stateNode=r):t.memoizedState=kf(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return me(t),e===null&&H&&(r=t.stateNode=ff(t.type,t.pendingProps,ue.current),ji=t,Ni=!0,i=V,Zd(t.type)?(lf=i,V=cf(r.firstChild)):V=i),tc(e,t,t.pendingProps.children,n),dc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&H&&((i=r=V)&&(r=tf(r,t.type,t.pendingProps,Ni),r===null?i=!1:(t.stateNode=r,ji=t,V=cf(r.firstChild),Ni=!1,i=!0)),i||Fi(t)),me(t),i=t.type,a=t.pendingProps,o=e===null?null:e.memoizedProps,r=a.children,Ud(i,a)?r=null:o!==null&&Ud(i,o)&&(t.flags|=32),t.memoizedState!==null&&(i=yo(e,t,So,null,null,n),Qf._currentValue=i),dc(e,t),tc(e,t,r,n),t.child;case 6:return e===null&&H&&((e=n=V)&&(n=nf(n,t.pendingProps,Ni),n===null?e=!1:(t.stateNode=n,ji=t,V=null,e=!0)),e||Fi(t)),null;case 13:return yc(e,t,n);case 4:return fe(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Na(t,null,r,n):tc(e,t,r,n),t.child;case 11:return nc(e,t,t.type,t.pendingProps,n);case 7:return tc(e,t,t.pendingProps,n),t.child;case 8:return tc(e,t,t.pendingProps.children,n),t.child;case 12:return tc(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,Gi(t,t.type,r.value),tc(e,t,r.children,n),t.child;case 9:return i=t.type._context,r=t.pendingProps.children,Yi(t),i=Xi(i),r=r(i),t.flags|=1,tc(e,t,r,n),t.child;case 14:return rc(e,t,t.type,t.pendingProps,n);case 15:return ic(e,t,t.type,t.pendingProps,n);case 19:return Tc(e,t,n);case 31:return uc(e,t,n);case 22:return ac(e,t,n,t.pendingProps);case 24:return Yi(t),r=Xi(na),e===null?(i=ma(),i===null&&(i=Rl,a=ra(),i.pooledCache=a,a.refCount++,a!==null&&(i.pooledCacheLanes|=n),i=a),t.memoizedState={parent:r,cache:i},Ia(t),Gi(t,na,i)):((e.lanes&n)!==0&&(La(e,t),Wa(t,null,null,n),Ua()),i=e.memoizedState,a=t.memoizedState,i.parent===r?(r=a.cache,Gi(t,na,r),r!==i.cache&&qi(t,[na],n,!0)):(i={parent:r,cache:r},t.memoizedState=i,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=i),Gi(t,na,r))),tc(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(s(156,t.tag))}function Ac(e){e.flags|=4}function jc(e,t,n,r,i){if((t=!!(e.mode&32))&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i){if(e.stateNode.complete)e.flags|=8192;else if(wu())e.flags|=8192;else throw wa=ba,va}}else e.flags&=-16777217}function Mc(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Wf(t)){if(wu())e.flags|=8192;else throw wa=ba,va}}function Nc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:Xe(),e.lanes|=t,Yl|=t)}function Pc(e,t){if(!H)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Fc(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Ic(e,t,n){var r=t.pendingProps;switch(ki(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Fc(t),null;case 1:return Fc(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),Ki(na),pe(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Ri(t)?Ac(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Bi())),Fc(t),null;case 26:var i=t.type,a=t.memoizedState;return e===null?(Ac(t),a===null?(Fc(t),jc(t,i,null,r,n)):(Fc(t),Mc(t,a))):a?a===e.memoizedState?(Fc(t),t.flags&=-16777217):(Ac(t),Fc(t),Mc(t,a)):(e=e.memoizedProps,e!==r&&Ac(t),Fc(t),jc(t,i,e,r,n)),null;case 27:if(he(t),n=ue.current,i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Ac(t);else{if(!r){if(t.stateNode===null)throw Error(s(166));return Fc(t),null}e=ce.current,Ri(t)?Ii(t,e):(e=ff(i,r,n),t.stateNode=e,Ac(t))}return Fc(t),null;case 5:if(he(t),i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Ac(t);else{if(!r){if(t.stateNode===null)throw Error(s(166));return Fc(t),null}if(a=ce.current,Ri(t))Ii(t,a);else{var o=Bd(ue.current);switch(a){case 1:a=o.createElementNS(`http://www.w3.org/2000/svg`,i);break;case 2:a=o.createElementNS(`http://www.w3.org/1998/Math/MathML`,i);break;default:switch(i){case`svg`:a=o.createElementNS(`http://www.w3.org/2000/svg`,i);break;case`math`:a=o.createElementNS(`http://www.w3.org/1998/Math/MathML`,i);break;case`script`:a=o.createElement(`div`),a.innerHTML=`<script><\/script>`,a=a.removeChild(a.firstChild);break;case`select`:a=typeof r.is==`string`?o.createElement(`select`,{is:r.is}):o.createElement(`select`),r.multiple?a.multiple=!0:r.size&&(a.size=r.size);break;default:a=typeof r.is==`string`?o.createElement(i,{is:r.is}):o.createElement(i)}}a[L]=t,a[ct]=r;a:for(o=t.child;o!==null;){if(o.tag===5||o.tag===6)a.appendChild(o.stateNode);else if(o.tag!==4&&o.tag!==27&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===t)break a;for(;o.sibling===null;){if(o.return===null||o.return===t)break a;o=o.return}o.sibling.return=o.return,o=o.sibling}t.stateNode=a;a:switch(Pd(a,i,r),i){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&Ac(t)}}return Fc(t),jc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&Ac(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(s(166));if(e=ue.current,Ri(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,i=ji,i!==null)switch(i.tag){case 27:case 5:r=i.memoizedProps}e[L]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||Md(e.nodeValue,n)),e||Fi(t,!0)}else e=Bd(e).createTextNode(r),e[L]=t,t.stateNode=e}return Fc(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Ri(t),n!==null){if(e===null){if(!r)throw Error(s(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(s(557));e[L]=t}else zi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Fc(t),e=!1}else n=Bi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(io(t),t):(io(t),null);if(t.flags&128)throw Error(s(558))}return Fc(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(i=Ri(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(s(318));if(i=t.memoizedState,i=i===null?null:i.dehydrated,!i)throw Error(s(317));i[L]=t}else zi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Fc(t),i=!1}else i=Bi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),i=!0;if(!i)return t.flags&256?(io(t),t):(io(t),null)}return io(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,i=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(i=r.alternate.memoizedState.cachePool.pool),a=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(a=r.memoizedState.cachePool.pool),a!==i&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Nc(t,t.updateQueue),Fc(t),null);case 4:return pe(),e===null&&Sd(t.stateNode.containerInfo),Fc(t),null;case 10:return Ki(t.type),Fc(t),null;case 19:if(P(ao),r=t.memoizedState,r===null)return Fc(t),null;if(i=!!(t.flags&128),a=r.rendering,a===null){if(i)Pc(r,!1);else{if(Wl!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(a=oo(e),a!==null){for(t.flags|=128,Pc(r,!1),e=a.updateQueue,t.updateQueue=e,Nc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)li(n,e),n=n.sibling;return F(ao,ao.current&1|2),H&&Ei(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Oe()>tu&&(t.flags|=128,i=!0,Pc(r,!1),t.lanes=4194304)}}else{if(!i){if(e=oo(a),e!==null){if(t.flags|=128,i=!0,e=e.updateQueue,t.updateQueue=e,Nc(t,e),Pc(r,!0),r.tail===null&&r.tailMode===`hidden`&&!a.alternate&&!H)return Fc(t),null}else 2*Oe()-r.renderingStartTime>tu&&n!==536870912&&(t.flags|=128,i=!0,Pc(r,!1),t.lanes=4194304)}r.isBackwards?(a.sibling=t.child,t.child=a):(e=r.last,e===null?t.child=a:e.sibling=a,r.last=a)}return r.tail===null?(Fc(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Oe(),e.sibling=null,n=ao.current,F(ao,i?n&1|2:n&1),H&&Ei(t,r.treeForkCount),e);case 22:case 23:return io(t),Za(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(Fc(t),t.subtreeFlags&6&&(t.flags|=8192)):Fc(t),n=t.updateQueue,n!==null&&Nc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&P(pa),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),Ki(na),Fc(t),null;case 25:return null;case 30:return null}throw Error(s(156,t.tag))}function Lc(e,t){switch(ki(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Ki(na),pe(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return he(t),null;case 31:if(t.memoizedState!==null){if(io(t),t.alternate===null)throw Error(s(340));zi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(io(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(s(340));zi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return P(ao),null;case 4:return pe(),null;case 10:return Ki(t.type),null;case 22:case 23:return io(t),Za(),e!==null&&P(pa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Ki(na),null;case 25:return null;default:return null}}function Rc(e,t){switch(ki(t),t.tag){case 3:Ki(na),pe();break;case 26:case 27:case 5:he(t);break;case 4:pe();break;case 31:t.memoizedState!==null&&io(t);break;case 13:io(t);break;case 19:P(ao);break;case 10:Ki(t.type);break;case 22:case 23:io(t),Za(),e!==null&&P(pa);break;case 24:Ki(na)}}function zc(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Z(t,t.return,e)}}function Bc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Z(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Z(t,t.return,e)}}function Vc(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Ka(t,n)}catch(t){Z(e,e.return,t)}}}function Hc(e,t,n){n.props=Us(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Z(e,t,n)}}function Uc(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Z(e,t,n)}}function Wc(e,t){var n=e.ref,r=e.refCleanup;if(n!==null){if(typeof r==`function`)try{r()}catch(n){Z(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Z(e,t,n)}else n.current=null}}function Gc(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Z(e,e.return,t)}}function Kc(e,t,n){try{var r=e.stateNode;Fd(r,e.type,n,t),r[ct]=t}catch(t){Z(e,e.return,t)}}function qc(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Zd(e.type)||e.tag===4}function Jc(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||qc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Zd(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Yc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=en));else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Yc(e,t,n),e=e.sibling;e!==null;)Yc(e,t,n),e=e.sibling}function Xc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Xc(e,t,n),e=e.sibling;e!==null;)Xc(e,t,n),e=e.sibling}function Zc(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Pd(t,r,n),t[L]=e,t[ct]=n}catch(t){Z(e,e.return,t)}}var Qc=!1,$c=!1,el=!1,tl=typeof WeakSet==`function`?WeakSet:Set,nl=null;function rl(e,t){if(e=e.containerInfo,Rd=sp,e=Dr(e),Or(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break a}var o=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||i!==0&&f.nodeType!==3||(c=o+i),f!==a||r!==0&&f.nodeType!==3||(l=o+r),f.nodeType===3&&(o+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===i&&(c=o),p===a&&++d===r&&(l=o),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(zd={focusedElem:e,selectionRange:n},sp=!1,nl=t;nl!==null;)if(t=nl,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,nl=e;else for(;nl!==null;){switch(t=nl,a=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)i=e[n],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&a!==null){e=void 0,n=t,i=a.memoizedProps,a=a.memoizedState,r=n.stateNode;try{var h=Us(n.type,i);e=r.getSnapshotBeforeUpdate(h,a),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){Z(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)ef(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:ef(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(s(163))}if(e=t.sibling,e!==null){e.return=t.return,nl=e;break}nl=t.return}}function il(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:yl(e,n),r&4&&zc(5,n);break;case 1:if(yl(e,n),r&4){if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Z(n,n.return,e)}else{var i=Us(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Z(n,n.return,e)}}}r&64&&Vc(n),r&512&&Uc(n,n.return);break;case 3:if(yl(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Ka(e,t)}catch(e){Z(n,n.return,e)}}break;case 27:t===null&&r&4&&Zc(n);case 26:case 5:yl(e,n),t===null&&r&4&&Gc(n),r&512&&Uc(n,n.return);break;case 12:yl(e,n);break;case 31:yl(e,n),r&4&&ul(e,n);break;case 13:yl(e,n),r&4&&dl(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Ju.bind(null,n),sf(e,n))));break;case 22:if(r=n.memoizedState!==null||Qc,!r){t=t!==null&&t.memoizedState!==null||$c,i=Qc;var a=$c;Qc=r,($c=t)&&!a?xl(e,n,!!(n.subtreeFlags&8772)):yl(e,n),Qc=i,$c=a}break;case 30:break;default:yl(e,n)}}function al(e){var t=e.alternate;t!==null&&(e.alternate=null,al(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&ht(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var ol=null,sl=!1;function cl(e,t,n){for(n=n.child;n!==null;)ll(e,t,n),n=n.sibling}function ll(e,t,n){if(Le&&typeof Le.onCommitFiberUnmount==`function`)try{Le.onCommitFiberUnmount(Ie,n)}catch{}switch(n.tag){case 26:$c||Wc(n,t),cl(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:$c||Wc(n,t);var r=ol,i=sl;Zd(n.type)&&(ol=n.stateNode,sl=!1),cl(e,t,n),pf(n.stateNode),ol=r,sl=i;break;case 5:$c||Wc(n,t);case 6:if(r=ol,i=sl,ol=null,cl(e,t,n),ol=r,sl=i,ol!==null){if(sl)try{(ol.nodeType===9?ol.body:ol.nodeName===`HTML`?ol.ownerDocument.body:ol).removeChild(n.stateNode)}catch(e){Z(n,t,e)}else try{ol.removeChild(n.stateNode)}catch(e){Z(n,t,e)}}break;case 18:ol!==null&&(sl?(e=ol,Qd(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Np(e)):Qd(ol,n.stateNode));break;case 4:r=ol,i=sl,ol=n.stateNode.containerInfo,sl=!0,cl(e,t,n),ol=r,sl=i;break;case 0:case 11:case 14:case 15:Bc(2,n,t),$c||Bc(4,n,t),cl(e,t,n);break;case 1:$c||(Wc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&Hc(n,t,r)),cl(e,t,n);break;case 21:cl(e,t,n);break;case 22:$c=(r=$c)||n.memoizedState!==null,cl(e,t,n),$c=r;break;default:cl(e,t,n)}}function ul(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Np(e)}catch(e){Z(t,t.return,e)}}}function dl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Np(e)}catch(e){Z(t,t.return,e)}}function fl(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new tl),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new tl),t;default:throw Error(s(435,e.tag))}}function pl(e,t){var n=fl(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=Yu.bind(null,e,t);t.then(r,r)}})}function ml(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r],a=e,o=t,c=o;a:for(;c!==null;){switch(c.tag){case 27:if(Zd(c.type)){ol=c.stateNode,sl=!1;break a}break;case 5:ol=c.stateNode,sl=!1;break a;case 3:case 4:ol=c.stateNode.containerInfo,sl=!0;break a}c=c.return}if(ol===null)throw Error(s(160));ll(a,o,i),ol=null,sl=!1,a=i.alternate,a!==null&&(a.return=null),i.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)gl(t,e),t=t.sibling}var hl=null;function gl(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:ml(t,e),_l(e),r&4&&(Bc(3,e,e.return),zc(3,e),Bc(5,e,e.return));break;case 1:ml(t,e),_l(e),r&512&&($c||n===null||Wc(n,n.return)),r&64&&Qc&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var i=hl;if(ml(t,e),_l(e),r&512&&($c||n===null||Wc(n,n.return)),r&4){var a=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null){if(r===null){if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,i=i.ownerDocument||i;b:switch(r){case`title`:a=i.getElementsByTagName(`title`)[0],(!a||a[mt]||a[L]||a.namespaceURI===`http://www.w3.org/2000/svg`||a.hasAttribute(`itemprop`))&&(a=i.createElement(r),i.head.insertBefore(a,i.querySelector(`head > title`))),Pd(a,r,n),a[L]=e,bt(a),r=a;break a;case`link`:var o=Vf(`link`,`href`,i).get(r+(n.href||``));if(o){for(var c=0;c<o.length;c++)if(a=o[c],a.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&a.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&a.getAttribute(`title`)===(n.title==null?null:n.title)&&a.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){o.splice(c,1);break b}}a=i.createElement(r),Pd(a,r,n),i.head.appendChild(a);break;case`meta`:if(o=Vf(`meta`,`content`,i).get(r+(n.content||``))){for(c=0;c<o.length;c++)if(a=o[c],a.getAttribute(`content`)===(n.content==null?null:``+n.content)&&a.getAttribute(`name`)===(n.name==null?null:n.name)&&a.getAttribute(`property`)===(n.property==null?null:n.property)&&a.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&a.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){o.splice(c,1);break b}}a=i.createElement(r),Pd(a,r,n),i.head.appendChild(a);break;default:throw Error(s(468,r))}a[L]=e,bt(a),r=a}e.stateNode=r}else Hf(i,e.type,e.stateNode)}else e.stateNode=If(i,r,e.memoizedProps)}else a===r?r===null&&e.stateNode!==null&&Kc(e,e.memoizedProps,n.memoizedProps):(a===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):a.count--,r===null?Hf(i,e.type,e.stateNode):If(i,r,e.memoizedProps))}break;case 27:ml(t,e),_l(e),r&512&&($c||n===null||Wc(n,n.return)),n!==null&&r&4&&Kc(e,e.memoizedProps,n.memoizedProps);break;case 5:if(ml(t,e),_l(e),r&512&&($c||n===null||Wc(n,n.return)),e.flags&32){i=e.stateNode;try{Kt(i,``)}catch(t){Z(e,e.return,t)}}r&4&&e.stateNode!=null&&(i=e.memoizedProps,Kc(e,i,n===null?i:n.memoizedProps)),r&1024&&(el=!0);break;case 6:if(ml(t,e),_l(e),r&4){if(e.stateNode===null)throw Error(s(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){Z(e,e.return,t)}}break;case 3:if(Bf=null,i=hl,hl=gf(t.containerInfo),ml(t,e),hl=i,_l(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Np(t.containerInfo)}catch(t){Z(e,e.return,t)}el&&(el=!1,vl(e));break;case 4:r=hl,hl=gf(e.stateNode.containerInfo),ml(t,e),_l(e),hl=r;break;case 12:ml(t,e),_l(e);break;case 31:ml(t,e),_l(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,pl(e,r)));break;case 13:ml(t,e),_l(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&($l=Oe()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,pl(e,r)));break;case 22:i=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=Qc,d=$c;if(Qc=u||i,$c=d||l,ml(t,e),$c=d,Qc=u,_l(e),r&8192)a:for(t=e.stateNode,t._visibility=i?t._visibility&-2:t._visibility|1,i&&(n===null||l||Qc||$c||bl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(a=l.stateNode,i)o=a.style,typeof o.setProperty==`function`?o.setProperty(`display`,`none`,`important`):o.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){Z(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=i?``:l.memoizedProps}catch(e){Z(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;i?$d(m,!0):$d(l.stateNode,!1)}catch(e){Z(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,pl(e,n))));break;case 19:ml(t,e),_l(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,pl(e,r)));break;case 30:break;case 21:break;default:ml(t,e),_l(e)}}function _l(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(qc(r)){n=r;break}r=r.return}if(n==null)throw Error(s(160));switch(n.tag){case 27:var i=n.stateNode;Xc(e,Jc(e),i);break;case 5:var a=n.stateNode;n.flags&32&&(Kt(a,``),n.flags&=-33),Xc(e,Jc(e),a);break;case 3:case 4:var o=n.stateNode.containerInfo;Yc(e,Jc(e),o);break;default:throw Error(s(161))}}catch(t){Z(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function vl(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;vl(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function yl(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)il(e,t.alternate,t),t=t.sibling}function bl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Bc(4,t,t.return),bl(t);break;case 1:Wc(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&Hc(t,t.return,n),bl(t);break;case 27:pf(t.stateNode);case 26:case 5:Wc(t,t.return),bl(t);break;case 22:t.memoizedState===null&&bl(t);break;case 30:bl(t);break;default:bl(t)}e=e.sibling}}function xl(e,t,n){for(n&&=!!(t.subtreeFlags&8772),t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:xl(i,a,n),zc(4,a);break;case 1:if(xl(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Z(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)Ga(c[i],s)}catch(e){Z(r,r.return,e)}}n&&o&64&&Vc(a),Uc(a,a.return);break;case 27:Zc(a);case 26:case 5:xl(i,a,n),n&&r===null&&o&4&&Gc(a),Uc(a,a.return);break;case 12:xl(i,a,n);break;case 31:xl(i,a,n),n&&o&4&&ul(i,a);break;case 13:xl(i,a,n),n&&o&4&&dl(i,a);break;case 22:a.memoizedState===null&&xl(i,a,n),Uc(a,a.return);break;case 30:break;default:xl(i,a,n)}t=t.sibling}}function Sl(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&ia(n))}function Cl(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ia(e))}function wl(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Tl(e,t,n,r),t=t.sibling}function Tl(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:wl(e,t,n,r),i&2048&&zc(9,t);break;case 1:wl(e,t,n,r);break;case 3:wl(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ia(e)));break;case 12:if(i&2048){wl(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){Z(t,t.return,e)}}else wl(e,t,n,r);break;case 31:wl(e,t,n,r);break;case 13:wl(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?wl(e,t,n,r):(a._visibility|=2,El(e,t,n,r,!!(t.subtreeFlags&10256)||!1)):a._visibility&2?wl(e,t,n,r):Dl(e,t),i&2048&&Sl(o,t);break;case 24:wl(e,t,n,r),i&2048&&Cl(t.alternate,t);break;default:wl(e,t,n,r)}}function El(e,t,n,r,i){for(i&&=!!(t.subtreeFlags&10256)||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:El(a,o,s,c,i),zc(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,El(a,o,s,c,i)):u._visibility&2?El(a,o,s,c,i):Dl(a,o),i&&l&2048&&Sl(o.alternate,o);break;case 24:El(a,o,s,c,i),i&&l&2048&&Cl(o.alternate,o);break;default:El(a,o,s,c,i)}t=t.sibling}}function Dl(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Dl(n,r),i&2048&&Sl(r.alternate,r);break;case 24:Dl(n,r),i&2048&&Cl(r.alternate,r);break;default:Dl(n,r)}t=t.sibling}}var Ol=8192;function kl(e,t,n){if(e.subtreeFlags&Ol)for(e=e.child;e!==null;)Al(e,t,n),e=e.sibling}function Al(e,t,n){switch(e.tag){case 26:kl(e,t,n),e.flags&Ol&&e.memoizedState!==null&&Gf(n,hl,e.memoizedState,e.memoizedProps);break;case 5:kl(e,t,n);break;case 3:case 4:var r=hl;hl=gf(e.stateNode.containerInfo),kl(e,t,n),hl=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Ol,Ol=16777216,kl(e,t,n),Ol=r):kl(e,t,n));break;default:kl(e,t,n)}}function jl(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Ml(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];nl=r,Fl(r,e)}jl(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Nl(e),e=e.sibling}function Nl(e){switch(e.tag){case 0:case 11:case 15:Ml(e),e.flags&2048&&Bc(9,e,e.return);break;case 3:Ml(e);break;case 12:Ml(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Pl(e)):Ml(e);break;default:Ml(e)}}function Pl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];nl=r,Fl(r,e)}jl(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Bc(8,t,t.return),Pl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Pl(t));break;default:Pl(t)}e=e.sibling}}function Fl(e,t){for(;nl!==null;){var n=nl;switch(n.tag){case 0:case 11:case 15:Bc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:ia(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,nl=r;else a:for(n=e;nl!==null;){r=nl;var i=r.sibling,a=r.return;if(al(r),r===n){nl=null;break a}if(i!==null){i.return=a,nl=i;break a}nl=a}}}var Il={getCacheForType:function(e){var t=Xi(na),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Xi(na).controller.signal}},Ll=typeof WeakMap==`function`?WeakMap:Map,q=0,Rl=null,J=null,Y=0,X=0,zl=null,Bl=!1,Vl=!1,Hl=!1,Ul=0,Wl=0,Gl=0,Kl=0,ql=0,Jl=0,Yl=0,Xl=null,Zl=null,Ql=!1,$l=0,eu=0,tu=1/0,nu=null,ru=null,iu=0,au=null,ou=null,su=0,cu=0,lu=null,uu=null,du=0,fu=null;function pu(){return q&2&&Y!==0?Y&-Y:j.T===null?at():dd()}function mu(){if(Jl===0){if(!(Y&536870912)||H){var e=We;We<<=1,!(We&3932160)&&(We=262144),Jl=e}else Jl=536870912}return e=Qa.current,e!==null&&(e.flags|=32),Jl}function hu(e,t,n){(e===Rl&&(X===2||X===9)||e.cancelPendingCommit!==null)&&(Su(e,0),yu(e,Y,Jl,!1)),Qe(e,n),(!(q&2)||e!==Rl)&&(e===Rl&&(!(q&2)&&(Kl|=n),Wl===4&&yu(e,Y,Jl,!1)),rd(e))}function gu(e,t,n){if(q&6)throw Error(s(327));var r=!n&&!(t&127)&&(t&e.expiredLanes)===0||Je(e,t),i=r?Au(e,t):Ou(e,t,!0),a=r;do{if(i===0){Vl&&!r&&yu(e,t,0,!1);break}if(n=e.current.alternate,a&&!vu(n)){i=Ou(e,t,!1),a=!1;continue}if(i===2){if(a=t,e.errorRecoveryDisabledLanes&a)var o=0;else o=e.pendingLanes&-536870913,o=o===0?o&536870912?536870912:0:o;if(o!==0){t=o;a:{var c=e;i=Xl;var l=c.current.memoizedState.isDehydrated;if(l&&(Su(c,o).flags|=256),o=Ou(c,o,!1),o!==2){if(Hl&&!l){c.errorRecoveryDisabledLanes|=a,Kl|=a,i=4;break a}a=Zl,Zl=i,a!==null&&(Zl===null?Zl=a:Zl.push.apply(Zl,a))}i=o}if(a=!1,i!==2)continue}}if(i===1){Su(e,0),yu(e,t,0,!0);break}a:{switch(r=e,a=i,a){case 0:case 1:throw Error(s(345));case 4:if((t&4194048)!==t)break;case 6:yu(r,t,Jl,!Bl);break a;case 2:Zl=null;break;case 3:case 5:break;default:throw Error(s(329))}if((t&62914560)===t&&(i=$l+300-Oe(),10<i)){if(yu(r,t,Jl,!Bl),qe(r,0,!0)!==0)break a;su=t,r.timeoutHandle=Kd(_u.bind(null,r,n,Zl,nu,Ql,t,Jl,Kl,Yl,Bl,a,`Throttled`,-0,0),i);break a}_u(r,n,Zl,nu,Ql,t,Jl,Kl,Yl,Bl,a,null,-0,0)}break}while(1);rd(e)}function _u(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:en},Al(t,a,d);var m=(a&62914560)===a?$l-Oe():(a&4194048)===a?eu-Oe():0;if(m=qf(d,m),m!==null){su=a,e.cancelPendingCommit=m(Lu.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),yu(e,a,o,!l);return}}Lu(e,t,a,n,r,i,o,s,c)}function vu(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Sr(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function yu(e,t,n,r){t&=~ql,t&=~Kl,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-ze(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&et(e,n,t)}function bu(){return q&6?!0:(id(0,!1),!1)}function xu(){if(J!==null){if(X===0)var e=J.return;else e=J,Wi=Ui=null,To(e),Da=null,Oa=0,e=J;for(;e!==null;)Rc(e.alternate,e),e=e.return;J=null}}function Su(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,qd(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),su=0,xu(),Rl=e,J=n=ci(e.current,null),Y=t,X=0,zl=null,Bl=!1,Vl=Je(e,t),Hl=!1,Yl=Jl=ql=Kl=Gl=Wl=0,Zl=Xl=null,Ql=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-ze(r),a=1<<i;t|=e[i],r&=~a}return Ul=t,Qr(),n}function Cu(e,t){G=null,j.H=Fs,t===_a||t===ya?(t=Ta(),X=3):t===va?(t=Ta(),X=4):X=t===$s?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,zl=t,J===null&&(Wl=1,qs(e,gi(t,e.current)))}function wu(){var e=Qa.current;return e===null?!0:(Y&4194048)===Y?$a===null:(Y&62914560)===Y||Y&536870912?e===$a:!1}function Tu(){var e=j.H;return j.H=Fs,e===null?Fs:e}function Eu(){var e=j.A;return j.A=Il,e}function Du(){Wl=4,Bl||(Y&4194048)!==Y&&Qa.current!==null||(Vl=!0),!(Gl&134217727)&&!(Kl&134217727)||Rl===null||yu(Rl,Y,Jl,!1)}function Ou(e,t,n){var r=q;q|=2;var i=Tu(),a=Eu();(Rl!==e||Y!==t)&&(nu=null,Su(e,t)),t=!1;var o=Wl;a:do try{if(X!==0&&J!==null){var s=J,c=zl;switch(X){case 8:xu(),o=6;break a;case 3:case 2:case 9:case 6:Qa.current===null&&(t=!0);var l=X;if(X=0,zl=null,Pu(e,s,c,l),n&&Vl){o=0;break a}break;default:l=X,X=0,zl=null,Pu(e,s,c,l)}}ku(),o=Wl;break}catch(t){Cu(e,t)}while(1);return t&&e.shellSuspendCounter++,Wi=Ui=null,q=r,j.H=i,j.A=a,J===null&&(Rl=null,Y=0,Qr()),o}function ku(){for(;J!==null;)Mu(J)}function Au(e,t){var n=q;q|=2;var r=Tu(),i=Eu();Rl!==e||Y!==t?(nu=null,tu=Oe()+500,Su(e,t)):Vl=Je(e,t);a:do try{if(X!==0&&J!==null){t=J;var a=zl;b:switch(X){case 1:X=0,zl=null,Pu(e,t,a,1);break;case 2:case 9:if(xa(a)){X=0,zl=null,Nu(t);break}t=function(){X!==2&&X!==9||Rl!==e||(X=7),rd(e)},a.then(t,t);break a;case 3:X=7;break a;case 4:X=5;break a;case 7:xa(a)?(X=0,zl=null,Nu(t)):(X=0,zl=null,Pu(e,t,a,7));break;case 5:var o=null;switch(J.tag){case 26:o=J.memoizedState;case 5:case 27:var c=J;if(o?Wf(o):c.stateNode.complete){X=0,zl=null;var l=c.sibling;if(l!==null)J=l;else{var u=c.return;u===null?J=null:(J=u,Fu(u))}break b}}X=0,zl=null,Pu(e,t,a,5);break;case 6:X=0,zl=null,Pu(e,t,a,6);break;case 8:xu(),Wl=6;break a;default:throw Error(s(462))}}ju();break}catch(t){Cu(e,t)}while(1);return Wi=Ui=null,j.H=r,j.A=i,q=n,J===null?(Rl=null,Y=0,Qr(),Wl):0}function ju(){for(;J!==null&&!Ee();)Mu(J)}function Mu(e){var t=kc(e.alternate,e,Ul);e.memoizedProps=e.pendingProps,t===null?Fu(e):J=t}function Nu(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=pc(n,t,t.pendingProps,t.type,void 0,Y);break;case 11:t=pc(n,t,t.pendingProps,t.type.render,t.ref,Y);break;case 5:To(t);default:Rc(n,t),t=J=li(t,Ul),t=kc(n,t,Ul)}e.memoizedProps=e.pendingProps,t===null?Fu(e):J=t}function Pu(e,t,n,r){Wi=Ui=null,To(t),Da=null,Oa=0;var i=t.return;try{if(Qs(e,i,t,n,Y)){Wl=1,qs(e,gi(n,e.current)),J=null;return}}catch(t){if(i!==null)throw J=i,t;Wl=1,qs(e,gi(n,e.current)),J=null;return}t.flags&32768?(H||r===1?e=!0:Vl||Y&536870912?e=!1:(Bl=e=!0,(r===2||r===9||r===3||r===6)&&(r=Qa.current,r!==null&&r.tag===13&&(r.flags|=16384))),Iu(t,e)):Fu(t)}function Fu(e){var t=e;do{if(t.flags&32768){Iu(t,Bl);return}e=t.return;var n=Ic(t.alternate,t,Ul);if(n!==null){J=n;return}if(t=t.sibling,t!==null){J=t;return}J=t=e}while(t!==null);Wl===0&&(Wl=5)}function Iu(e,t){do{var n=Lc(e.alternate,e);if(n!==null){n.flags&=32767,J=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){J=e;return}J=e=n}while(e!==null);Wl=6,J=null}function Lu(e,t,n,r,i,a,o,c,l){e.cancelPendingCommit=null;do Hu();while(iu!==0);if(q&6)throw Error(s(327));if(t!==null){if(t===e.current)throw Error(s(177));if(a=t.lanes|t.childLanes,a|=Zr,$e(e,n,a,o,c,l),e===Rl&&(J=Rl=null,Y=0),ou=t,au=e,su=n,cu=a,lu=i,uu=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,Xu(I,function(){return Uu(),null})):(e.callbackNode=null,e.callbackPriority=0),r=!!(t.flags&13878),t.subtreeFlags&13878||r){r=j.T,j.T=null,i=M.p,M.p=2,o=q,q|=4;try{rl(e,t,n)}finally{q=o,M.p=i,j.T=r}}iu=1,Ru(),zu(),Bu()}}function Ru(){if(iu===1){iu=0;var e=au,t=ou,n=!!(t.flags&13878);if(t.subtreeFlags&13878||n){n=j.T,j.T=null;var r=M.p;M.p=2;var i=q;q|=4;try{gl(t,e);var a=zd,o=Dr(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&Er(s.ownerDocument.documentElement,s)){if(c!==null&&Or(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Tr(s,h),v=Tr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}sp=!!Rd,zd=Rd=null}finally{q=i,M.p=r,j.T=n}}e.current=t,iu=2}}function zu(){if(iu===2){iu=0;var e=au,t=ou,n=!!(t.flags&8772);if(t.subtreeFlags&8772||n){n=j.T,j.T=null;var r=M.p;M.p=2;var i=q;q|=4;try{il(e,t.alternate,t)}finally{q=i,M.p=r,j.T=n}}iu=3}}function Bu(){if(iu===4||iu===3){iu=0,De();var e=au,t=ou,n=su,r=uu;t.subtreeFlags&10256||t.flags&10256?iu=5:(iu=0,ou=au=null,Vu(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(ru=null),it(n),t=t.stateNode,Le&&typeof Le.onCommitFiberRoot==`function`)try{Le.onCommitFiberRoot(Ie,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=j.T,i=M.p,M.p=2,j.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{j.T=t,M.p=i}}su&3&&Hu(),rd(e),i=e.pendingLanes,n&261930&&i&42?e===fu?du++:(du=0,fu=e):du=0,id(0,!1)}}function Vu(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,ia(t)))}function Hu(){return Ru(),zu(),Bu(),Uu()}function Uu(){if(iu!==5)return!1;var e=au,t=cu;cu=0;var n=it(su),r=j.T,i=M.p;try{M.p=32>n?32:n,j.T=null,n=lu,lu=null;var a=au,o=su;if(iu=0,ou=au=null,su=0,q&6)throw Error(s(331));var c=q;if(q|=4,Nl(a.current),Tl(a,a.current,o,n),q=c,id(0,!1),Le&&typeof Le.onPostCommitFiberRoot==`function`)try{Le.onPostCommitFiberRoot(Ie,a)}catch{}return!0}finally{M.p=i,j.T=r,Vu(e,t)}}function Wu(e,t,n){t=gi(n,t),t=Ys(e.stateNode,t,2),e=za(e,t,2),e!==null&&(Qe(e,2),rd(e))}function Z(e,t,n){if(e.tag===3)Wu(e,e,n);else for(;t!==null;){if(t.tag===3){Wu(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(ru===null||!ru.has(r))){e=gi(n,e),n=Xs(2),r=za(t,n,2),r!==null&&(Zs(n,r,t,e),Qe(r,2),rd(r));break}}t=t.return}}function Gu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Ll;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Hl=!0,i.add(n),e=Ku.bind(null,e,t,n),t.then(e,e))}function Ku(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Rl===e&&(Y&n)===n&&(Wl===4||Wl===3&&(Y&62914560)===Y&&300>Oe()-$l?!(q&2)&&Su(e,0):ql|=n,Yl===Y&&(Yl=0)),rd(e)}function qu(e,t){t===0&&(t=Xe()),e=ti(e,t),e!==null&&(Qe(e,t),rd(e))}function Ju(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),qu(e,n)}function Yu(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(s(314))}r!==null&&r.delete(t),qu(e,n)}function Xu(e,t){return we(e,t)}var Zu=null,Qu=null,$u=!1,ed=!1,td=!1,nd=0;function rd(e){e!==Qu&&e.next===null&&(Qu===null?Zu=Qu=e:Qu=Qu.next=e),ed=!0,$u||($u=!0,ud())}function id(e,t){if(!td&&ed){td=!0;do for(var n=!1,r=Zu;r!==null;){if(!t){if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-ze(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,ld(r,a))}else a=Y,a=qe(r,r===Rl?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||Je(r,a)||(n=!0,ld(r,a))}r=r.next}while(n);td=!1}}function ad(){od()}function od(){ed=$u=!1;var e=0;nd!==0&&Gd()&&(e=nd);for(var t=Oe(),n=null,r=Zu;r!==null;){var i=r.next,a=sd(r,t);a===0?(r.next=null,n===null?Zu=i:n.next=i,i===null&&(Qu=n)):(n=r,(e!==0||a&3)&&(ed=!0)),r=i}iu!==0&&iu!==5||id(e,!1),nd!==0&&(nd=0)}function sd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-ze(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=Ye(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=Rl,n=Y,n=qe(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(X===2||X===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Te(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||Je(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Te(r),it(n)){case 2:case 8:n=je;break;case 32:n=I;break;case 268435456:n=Ne;break;default:n=I}return r=cd.bind(null,e),n=we(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Te(r),e.callbackPriority=2,e.callbackNode=null,2}function cd(e,t){if(iu!==0&&iu!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Hu()&&e.callbackNode!==n)return null;var r=Y;return r=qe(e,e===Rl?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(gu(e,r,t),sd(e,Oe()),e.callbackNode!=null&&e.callbackNode===n?cd.bind(null,e):null)}function ld(e,t){if(Hu())return null;gu(e,t,!0)}function ud(){Yd(function(){q&6?we(Ae,ad):od()})}function dd(){if(nd===0){var e=sa;e===0&&(e=Ue,Ue<<=1,!(Ue&261888)&&(Ue=256)),nd=e}return nd}function fd(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:$t(``+e)}function pd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function md(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=fd((i[ct]||null).action),o=r.submitter;o&&(t=(t=o[ct]||null)?fd(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new Sn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(nd!==0){var e=o?pd(i,o):new FormData(i);xs(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?pd(i,o):new FormData(i),xs(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var hd=0;hd<z.length;hd++){var gd=z[hd];Jr(gd.toLowerCase(),`on`+(gd[0].toUpperCase()+gd.slice(1)))}Jr(Br,`onAnimationEnd`),Jr(Vr,`onAnimationIteration`),Jr(Hr,`onAnimationStart`),Jr(`dblclick`,`onDoubleClick`),Jr(`focusin`,`onFocus`),Jr(`focusout`,`onBlur`),Jr(Ur,`onTransitionRun`),Jr(Wr,`onTransitionStart`),Jr(Gr,`onTransitionCancel`),Jr(Kr,`onTransitionEnd`),wt(`onMouseEnter`,[`mouseout`,`mouseover`]),wt(`onMouseLeave`,[`mouseout`,`mouseover`]),wt(`onPointerEnter`,[`pointerout`,`pointerover`]),wt(`onPointerLeave`,[`pointerout`,`pointerover`]),Ct(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),Ct(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),Ct(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),Ct(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),Ct(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),Ct(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var _d=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),vd=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(_d));function yd(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){Yr(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){Yr(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[ut];n===void 0&&(n=t[ut]=new Set);var r=e+`__bubble`;n.has(r)||(Cd(t,e,2,!1),n.add(r))}function bd(e,t,n){var r=0;t&&(r|=4),Cd(n,e,r,t)}var xd=`_reactListening`+Math.random().toString(36).slice(2);function Sd(e){if(!e[xd]){e[xd]=!0,xt.forEach(function(t){t!==`selectionchange`&&(vd.has(t)||bd(t,!1,e),bd(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[xd]||(t[xd]=!0,bd(`selectionchange`,!1,t))}}function Cd(e,t,n,r){switch(mp(t)){case 2:var i=cp;break;case 8:i=lp;break;default:i=up}n=i.bind(null,t,n,e),i=void 0,!dn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function wd(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var s=r.stateNode.containerInfo;if(s===i)break;if(o===4)for(o=r.return;o!==null;){var c=o.tag;if((c===3||c===4)&&o.stateNode.containerInfo===i)return;o=o.return}for(;s!==null;){if(o=gt(s),o===null)return;if(c=o.tag,c===5||c===6||c===26||c===27){r=a=o;continue a}s=s.parentNode}}r=r.return}cn(function(){var r=a,i=nn(n),o=[];a:{var s=qr.get(e);if(s!==void 0){var c=Sn,u=e;switch(e){case`keypress`:if(_n(n)===0)break a;case`keydown`:case`keyup`:c=zn;break;case`focusin`:u=`focus`,c=An;break;case`focusout`:u=`blur`,c=An;break;case`beforeblur`:case`afterblur`:c=An;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:c=On;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:c=kn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:c=Vn;break;case Br:case Vr:case Hr:c=jn;break;case Kr:c=Hn;break;case`scroll`:case`scrollend`:c=wn;break;case`wheel`:c=Un;break;case`copy`:case`cut`:case`paste`:c=Mn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:c=Bn;break;case`toggle`:case`beforetoggle`:c=Wn}var d=!!(t&4),f=!d&&(e===`scroll`||e===`scrollend`),p=d?s===null?null:s+`Capture`:s;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=ln(m,p),g!=null&&d.push(Td(m,g,h))),f)break;m=m.return}0<d.length&&(s=new c(s,u,null,n,i),o.push({event:s,listeners:d}))}}if(!(t&7)){a:{if(s=e===`mouseover`||e===`pointerover`,c=e===`mouseout`||e===`pointerout`,s&&n!==tn&&(u=n.relatedTarget||n.fromElement)&&(gt(u)||u[lt]))break a;if((c||s)&&(s=i.window===i?i:(s=i.ownerDocument)?s.defaultView||s.parentWindow:window,c?(u=n.relatedTarget||n.toElement,c=r,u=u?gt(u):null,u!==null&&(f=l(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(c=null,u=r),c!==u)){if(d=On,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=Bn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=c==null?s:vt(c),h=u==null?s:vt(u),s=new d(g,m+`leave`,c,n,i),s.target=f,s.relatedTarget=h,g=null,gt(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,c&&u)b:{for(d=Dd,p=c,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;c!==null&&Od(o,s,c,d,!1),u!==null&&f!==null&&Od(o,f,u,d,!0)}}a:{if(s=r?vt(r):window,c=s.nodeName&&s.nodeName.toLowerCase(),c===`select`||c===`input`&&s.type===`file`)var v=ur;else if(ir(s)){if(dr)v=br;else{v=vr;var y=_r}}else c=s.nodeName,!c||c.toLowerCase()!==`input`||s.type!==`checkbox`&&s.type!==`radio`?r&&Xt(r.elementType)&&(v=ur):v=yr;if(v&&=v(e,r)){ar(o,v,n,i);break a}y&&y(e,s,r),e===`focusout`&&r&&s.type===`number`&&r.memoizedProps.value!=null&&Ht(s,`number`,s.value)}switch(y=r?vt(r):window,e){case`focusin`:(ir(y)||y.contentEditable===`true`)&&(Ar=y,jr=r,Mr=null);break;case`focusout`:Mr=jr=Ar=null;break;case`mousedown`:Nr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Nr=!1,Pr(o,n,i);break;case`selectionchange`:if(kr)break;case`keydown`:case`keyup`:Pr(o,n,i)}var b;if(Kn)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else er?Qn(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&(Yn&&n.locale!==`ko`&&(er||x!==`onCompositionStart`?x===`onCompositionEnd`&&er&&(b=gn()):(pn=i,mn=`value`in pn?pn.value:pn.textContent,er=!0)),y=Ed(r,x),0<y.length&&(x=new Nn(x,e,null,n,i),o.push({event:x,listeners:y}),b?x.data=b:(b=$n(n),b!==null&&(x.data=b)))),(b=Jn?tr(e,n):nr(e,n))&&(x=Ed(r,`onBeforeInput`),0<x.length&&(y=new Nn(`onBeforeInput`,`beforeinput`,null,n,i),o.push({event:y,listeners:x}),y.data=b)),md(o,e,r,n,i)}yd(o,t)})}function Td(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ed(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=ln(e,n),i!=null&&r.unshift(Td(e,i,a)),i=ln(e,t),i!=null&&r.push(Td(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Dd(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Od(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=ln(n,a),l!=null&&o.unshift(Td(n,l,c))):i||(l=ln(n,a),l!=null&&o.push(Td(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var kd=/\r\n?/g,Ad=/\u0000|\uFFFD/g;function jd(e){return(typeof e==`string`?e:``+e).replace(kd,`
`).replace(Ad,``)}function Md(e,t){return t=jd(t),jd(e)===t}function $(e,t,n,r,i,a){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||Kt(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&Kt(e,``+r);break;case`className`:At(e,`class`,r);break;case`tabIndex`:At(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:At(e,n,r);break;case`style`:Yt(e,r,a);break;case`data`:if(t!==`object`){At(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=$t(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}if(typeof a==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,i.name,i,null),$(e,t,`formEncType`,i.formEncType,i,null),$(e,t,`formMethod`,i.formMethod,i,null),$(e,t,`formTarget`,i.formTarget,i,null)):($(e,t,`encType`,i.encType,i,null),$(e,t,`method`,i.method,i,null),$(e,t,`target`,i.target,i,null))),r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=$t(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=en);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(s(61));if(n=r.__html,n!=null){if(i.children!=null)throw Error(s(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=$t(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),kt(e,`popover`,r);break;case`xlinkActuate`:jt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:jt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:jt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:jt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:jt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:jt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:jt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:jt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:jt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:kt(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=Zt.get(n)||n,kt(e,n,r))}}function Nd(e,t,n,r,i,a){switch(n){case`style`:Yt(e,r,a);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(s(61));if(n=r.__html,n!=null){if(i.children!=null)throw Error(s(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?Kt(e,r):(typeof r==`number`||typeof r==`bigint`)&&Kt(e,``+r);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=en);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!St.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(i=n.endsWith(`Capture`),t=n.slice(2,i?n.length-7:void 0),a=e[ct]||null,a=a==null?null:a[n],typeof a==`function`&&e.removeEventListener(t,a,i),typeof r==`function`)){typeof a!=`function`&&a!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,i);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):kt(e,n,r)}}}function Pd(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,i=!1,a;for(a in n)if(n.hasOwnProperty(a)){var o=n[a];if(o!=null)switch(a){case`src`:r=!0;break;case`srcSet`:i=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(s(137,t));default:$(e,t,a,o,n,null)}}i&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=a=o=i=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:i=d;break;case`type`:o=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:a=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(s(137,t));break;default:$(e,t,r,d,n,null)}}Vt(e,a,c,l,u,o,i,!1);return;case`select`:for(i in Q(`invalid`,e),r=o=a=null,n)if(n.hasOwnProperty(i)&&(c=n[i],c!=null))switch(i){case`value`:a=c;break;case`defaultValue`:o=c;break;case`multiple`:r=c;default:$(e,t,i,c,n,null)}t=a,n=o,e.multiple=!!r,t==null?n!=null&&Ut(e,!!r,n,!0):Ut(e,!!r,t,!1);return;case`textarea`:for(o in Q(`invalid`,e),a=i=r=null,n)if(n.hasOwnProperty(o)&&(c=n[o],c!=null))switch(o){case`value`:r=c;break;case`defaultValue`:i=c;break;case`children`:a=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(s(91));break;default:$(e,t,o,c,n,null)}Gt(e,r,i,a);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<_d.length;r++)Q(_d[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(s(137,t));default:$(e,t,u,r,n,null)}return;default:if(Xt(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&Nd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}function Fd(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var i=null,a=null,o=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:a=m;break;case`name`:i=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:o=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(s(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}Bt(e,o,c,l,u,d,a,i);return;case`select`:for(a in m=o=c=p=null,n)if(l=n[a],n.hasOwnProperty(a)&&l!=null)switch(a){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(a)||$(e,t,a,null,r,l)}for(i in r)if(a=r[i],l=n[i],r.hasOwnProperty(i)&&(a!=null||l!=null))switch(i){case`value`:p=a;break;case`defaultValue`:c=a;break;case`multiple`:o=a;default:a!==l&&$(e,t,i,a,r,l)}t=c,n=o,r=m,p==null?!!r!=!!n&&(t==null?Ut(e,!!n,n?[]:``,!1):Ut(e,!!n,t,!0)):Ut(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(i=n[c],n.hasOwnProperty(c)&&i!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,i)}for(o in r)if(i=r[o],a=n[o],r.hasOwnProperty(o)&&(i!=null||a!=null))switch(o){case`value`:p=i;break;case`defaultValue`:m=i;break;case`children`:break;case`dangerouslySetInnerHTML`:if(i!=null)throw Error(s(91));break;default:i!==a&&$(e,t,o,i,r,a)}Wt(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(s(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(Xt(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&Nd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||Nd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function Id(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Ld(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Id(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Id(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var Rd=null,zd=null;function Bd(e){return e.nodeType===9?e:e.ownerDocument}function Vd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Hd(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Ud(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Wd=null;function Gd(){var e=window.event;return e&&e.type===`popstate`?e!==Wd&&(Wd=e,!0):(Wd=null,!1)}var Kd=typeof setTimeout==`function`?setTimeout:void 0,qd=typeof clearTimeout==`function`?clearTimeout:void 0,Jd=typeof Promise==`function`?Promise:void 0,Yd=typeof queueMicrotask==`function`?queueMicrotask:Jd===void 0?Kd:function(e){return Jd.resolve(null).then(e).catch(Xd)};function Xd(e){setTimeout(function(){throw e})}function Zd(e){return e===`head`}function Qd(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8){if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Np(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)pf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,pf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[mt]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&pf(e.ownerDocument.body)}n=i}while(n);Np(t)}function $d(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8){if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++}n=r}while(n)}function ef(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:ef(n),ht(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function tf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r){if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e}else if(!e[mt])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=cf(e.nextSibling),e===null)break}return null}function nf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=cf(e.nextSibling),e===null))return null;return e}function rf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=cf(e.nextSibling),e===null))return null;return e}function af(e){return e.data===`$?`||e.data===`$~`}function of(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function sf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function cf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var lf=null;function uf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return cf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function df(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function ff(e,t,n){switch(t=Bd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(s(452));return e;case`head`:if(e=t.head,!e)throw Error(s(453));return e;case`body`:if(e=t.body,!e)throw Error(s(454));return e;default:throw Error(s(451))}}function pf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);ht(e)}var mf=new Map,hf=new Set;function gf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var _f=M.d;M.d={f:vf,r:yf,D:Sf,C:Cf,L:wf,m:Tf,X:Df,S:Ef,M:Of};function vf(){var e=_f.f(),t=bu();return e||t}function yf(e){var t=_t(e);t!==null&&t.tag===5&&t.type===`form`?Cs(t):_f.r(e)}var bf=typeof document>`u`?null:document;function xf(e,t,n){var r=bf;if(r&&typeof t==`string`&&t){var i=zt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),hf.has(i)||(hf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),Pd(t,`link`,e),bt(t),r.head.appendChild(t)))}}function Sf(e){_f.D(e),xf(`dns-prefetch`,e,null)}function Cf(e,t){_f.C(e,t),xf(`preconnect`,e,t)}function wf(e,t,n){_f.L(e,t,n);var r=bf;if(r&&e&&t){var i=`link[rel="preload"][as="`+zt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+zt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+zt(n.imageSizes)+`"]`)):i+=`[href="`+zt(e)+`"]`;var a=i;switch(t){case`style`:a=Af(e);break;case`script`:a=Pf(e)}mf.has(a)||(e=h({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),mf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(jf(a))||t===`script`&&r.querySelector(Ff(a))||(t=r.createElement(`link`),Pd(t,`link`,e),bt(t),r.head.appendChild(t)))}}function Tf(e,t){_f.m(e,t);var n=bf;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+zt(r)+`"][href="`+zt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Pf(e)}if(!mf.has(a)&&(e=h({rel:`modulepreload`,href:e},t),mf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Ff(a)))return}r=n.createElement(`link`),Pd(r,`link`,e),bt(r),n.head.appendChild(r)}}}function Ef(e,t,n){_f.S(e,t,n);var r=bf;if(r&&e){var i=yt(r).hoistableStyles,a=Af(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(jf(a)))s.loading=5;else{e=h({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=mf.get(a))&&Rf(e,n);var c=o=r.createElement(`link`);bt(c),Pd(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Lf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Df(e,t){_f.X(e,t);var n=bf;if(n&&e){var r=yt(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=h({src:e,async:!0},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),bt(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Of(e,t){_f.M(e,t);var n=bf;if(n&&e){var r=yt(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=h({src:e,async:!0,type:`module`},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),bt(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function kf(e,t,n,r){var i=(i=ue.current)?gf(i):null;if(!i)throw Error(s(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=Af(n.href),n=yt(i).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Af(n.href);var a=yt(i).hoistableStyles,o=a.get(e);if(o||(i=i.ownerDocument||i,o={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},a.set(e,o),(a=i.querySelector(jf(e)))&&!a._p&&(o.instance=a,o.state.loading=5),mf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mf.set(e,n),a||Nf(i,e,n,o.state))),t&&r===null)throw Error(s(528,``));return o}if(t&&r!==null)throw Error(s(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Pf(n),n=yt(i).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(s(444,e))}}function Af(e){return`href="`+zt(e)+`"`}function jf(e){return`link[rel="stylesheet"][`+e+`]`}function Mf(e){return h({},e,{"data-precedence":e.precedence,precedence:null})}function Nf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),Pd(t,`link`,n),bt(t),e.head.appendChild(t))}function Pf(e){return`[src="`+zt(e)+`"]`}function Ff(e){return`script[async]`+e}function If(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+zt(n.href)+`"]`);if(r)return t.instance=r,bt(r),r;var i=h({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),bt(r),Pd(r,`style`,i),Lf(r,n.precedence,e),t.instance=r;case`stylesheet`:i=Af(n.href);var a=e.querySelector(jf(i));if(a)return t.state.loading|=4,t.instance=a,bt(a),a;r=Mf(n),(i=mf.get(i))&&Rf(r,i),a=(e.ownerDocument||e).createElement(`link`),bt(a);var o=a;return o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Pd(a,`link`,r),t.state.loading|=4,Lf(a,n.precedence,e),t.instance=a;case`script`:return a=Pf(n.src),(i=e.querySelector(Ff(a)))?(t.instance=i,bt(i),i):(r=n,(i=mf.get(a))&&(r=h({},n),zf(r,i)),e=e.ownerDocument||e,i=e.createElement(`script`),bt(i),Pd(i,`link`,r),e.head.appendChild(i),t.instance=i);case`void`:return null;default:throw Error(s(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Lf(r,n.precedence,e));return t.instance}function Lf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function zf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Bf=null;function Vf(e,t,n){if(Bf===null){var r=new Map,i=Bf=new Map;i.set(n,r)}else i=Bf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[mt]||a[L]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Hf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Uf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Wf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Gf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Af(r.href),a=t.querySelector(jf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=Jf.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,bt(a);return}a=t.ownerDocument||t,r=Mf(r),(i=mf.get(i))&&Rf(r,i),a=a.createElement(`link`),bt(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Pd(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=Jf.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Kf=0;function qf(e,t){return e.stylesheets&&e.count===0&&Xf(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Kf===0&&(Kf=62500*Ld());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Kf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function Jf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xf(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Yf=null;function Xf(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yf=new Map,t.forEach(Zf,e),Yf=null,Jf.call(e))}function Zf(e,t){if(!(t.state.loading&4)){var n=Yf.get(e);if(n)var r=n.get(null);else{n=new Map,Yf.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=Jf.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Qf={$$typeof:C,Provider:null,Consumer:null,_currentValue:ae,_currentValue2:ae,_threadCount:0};function $f(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ze(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ze(0),this.hiddenUpdates=Ze(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function ep(e,t,n,r,i,a,o,s,c,l,u,d){return e=new $f(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=oi(3,null,null,t),e.current=a,a.stateNode=e,t=ra(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},Ia(a),e}function tp(e){return e?(e=ii,e):ii}function np(e,t,n,r,i,a){i=tp(i),r.context===null?r.context=i:r.pendingContext=i,r=Ra(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=za(e,r,t),n!==null&&(hu(n,e,t),Ba(n,e,t))}function rp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ip(e,t){rp(e,t),(e=e.alternate)&&rp(e,t)}function ap(e){if(e.tag===13||e.tag===31){var t=ti(e,67108864);t!==null&&hu(t,e,67108864),ip(e,67108864)}}function op(e){if(e.tag===13||e.tag===31){var t=pu();t=rt(t);var n=ti(e,t);n!==null&&hu(n,e,t),ip(e,t)}}var sp=!0;function cp(e,t,n,r){var i=j.T;j.T=null;var a=M.p;try{M.p=2,up(e,t,n,r)}finally{M.p=a,j.T=i}}function lp(e,t,n,r){var i=j.T;j.T=null;var a=M.p;try{M.p=8,up(e,t,n,r)}finally{M.p=a,j.T=i}}function up(e,t,n,r){if(sp){var i=dp(r);if(i===null)wd(e,t,r,fp,n),Cp(e,r);else if(Tp(i,e,t,n,r))r.stopPropagation();else if(Cp(e,r),t&4&&-1<Sp.indexOf(e)){for(;i!==null;){var a=_t(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=Ke(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-ze(o);s.entanglements[1]|=c,o&=~c}rd(a),!(q&6)&&(tu=Oe()+500,id(0,!1))}}break;case 31:case 13:s=ti(a,2),s!==null&&hu(s,a,2),bu(),ip(a,2)}if(a=dp(r),a===null&&wd(e,t,r,fp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else wd(e,t,r,null,n)}}function dp(e){return e=nn(e),pp(e)}var fp=null;function pp(e){if(fp=null,e=gt(e),e!==null){var t=l(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=u(t),e!==null)return e;e=null}else if(n===31){if(e=d(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return fp=e,null}function mp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(ke()){case Ae:return 2;case je:return 8;case I:case Me:return 32;case Ne:return 268435456;default:return 32}default:return 32}}var hp=!1,gp=null,_p=null,vp=null,yp=new Map,bp=new Map,xp=[],Sp=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Cp(e,t){switch(e){case`focusin`:case`focusout`:gp=null;break;case`dragenter`:case`dragleave`:_p=null;break;case`mouseover`:case`mouseout`:vp=null;break;case`pointerover`:case`pointerout`:yp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:bp.delete(t.pointerId)}}function wp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=_t(t),t!==null&&ap(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Tp(e,t,n,r,i){switch(t){case`focusin`:return gp=wp(gp,e,t,n,r,i),!0;case`dragenter`:return _p=wp(_p,e,t,n,r,i),!0;case`mouseover`:return vp=wp(vp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return yp.set(a,wp(yp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,bp.set(a,wp(bp.get(a)||null,e,t,n,r,i)),!0}return!1}function Ep(e){var t=gt(e.target);if(t!==null){var n=l(t);if(n!==null){if(t=n.tag,t===13){if(t=u(n),t!==null){e.blockedOn=t,ot(e.priority,function(){op(n)});return}}else if(t===31){if(t=d(n),t!==null){e.blockedOn=t,ot(e.priority,function(){op(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Dp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=dp(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);tn=r,n.target.dispatchEvent(r),tn=null}else return t=_t(n),t!==null&&ap(t),e.blockedOn=n,!1;t.shift()}return!0}function Op(e,t,n){Dp(e)&&n.delete(t)}function kp(){hp=!1,gp!==null&&Dp(gp)&&(gp=null),_p!==null&&Dp(_p)&&(_p=null),vp!==null&&Dp(vp)&&(vp=null),yp.forEach(Op),bp.forEach(Op)}function Ap(e,n){e.blockedOn===n&&(e.blockedOn=null,hp||(hp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,kp)))}var jp=null;function Mp(e){jp!==e&&(jp=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){jp===e&&(jp=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(pp(r||n)===null)continue;break}var a=_t(n);a!==null&&(e.splice(t,3),t-=3,xs(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Np(e){function t(t){return Ap(t,e)}gp!==null&&Ap(gp,e),_p!==null&&Ap(_p,e),vp!==null&&Ap(vp,e),yp.forEach(t),bp.forEach(t);for(var n=0;n<xp.length;n++){var r=xp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<xp.length&&(n=xp[0],n.blockedOn===null);)Ep(n),n.blockedOn===null&&xp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[ct]||null;if(typeof a==`function`)o||Mp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[ct]||null)s=o.formAction;else if(pp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Mp(n)}}}function Pp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Fp(e){this._internalRoot=e}Ip.prototype.render=Fp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(s(409));var n=t.current;np(n,pu(),e,t,null,null)},Ip.prototype.unmount=Fp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;np(e.current,2,null,e,null,null),bu(),t[lt]=null}};function Ip(e){this._internalRoot=e}Ip.prototype.unstable_scheduleHydration=function(e){if(e){var t=at();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xp.length&&t!==0&&t<xp[n].priority;n++);xp.splice(n,0,e),n===0&&Ep(e)}};var Lp=r.version;if(Lp!==`19.2.6`)throw Error(s(527,Lp,`19.2.6`));M.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(s(188)):(e=Object.keys(e).join(`,`),Error(s(268,e)));return e=p(t),e=e===null?null:m(e),e=e===null?null:e.stateNode,e};var Rp={bundleType:0,version:`19.2.6`,rendererPackageName:`react-dom`,currentDispatcherRef:j,reconcilerVersion:`19.2.6`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var zp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zp.isDisabled&&zp.supportsFiber)try{Ie=zp.inject(Rp),Le=zp}catch{}}e.createRoot=function(e,t){if(!c(e))throw Error(s(299));var n=!1,r=``,i=Ws,a=Gs,o=Ks;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(i=t.onUncaughtError),t.onCaughtError!==void 0&&(a=t.onCaughtError),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=ep(e,1,!1,null,null,n,r,null,i,a,o,Pp),e[lt]=t.current,Sd(e),new Fp(t)}})),c=e(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=s()})),l=i(),u=c(),d=10*Float32Array.BYTES_PER_ELEMENT;Object.freeze({position:Object.freeze({offsetFloats:0,components:3}),normal:Object.freeze({offsetFloats:3,components:3}),color:Object.freeze({offsetFloats:6,components:4}),strideFloats:10,strideBytes:d});var f=[0,1,0],p=[0,-1,0],m=1e-7,h=[.51,.35,.16,1],g=[.29,.14,.075,1],_=[.43,.255,.135,1],v=[.27,.145,.075,1],y=[.35,.205,.105,1],b=[.39,.235,.12,1],x=[.29,.17,.09,1],S=[.18,.35,.09,1],C=[.37,.43,.13,1],w=[.14,.3,.105,1],ee=[.25,.39,.14,1],te=[.34,.38,.16,1],ne=class{constructor(){this.vertexValues=[],this.indexValues=[],this.minX=1/0,this.minY=1/0,this.minZ=1/0,this.maxX=-1/0,this.maxY=-1/0,this.maxZ=-1/0}vertex(e,t,n){let r=k(t,f),i=this.vertexValues.length/10;return this.vertexValues.push(e[0],e[1],e[2],r[0],r[1],r[2],n[0],n[1],n[2],n[3]),this.minX=Math.min(this.minX,e[0]),this.minY=Math.min(this.minY,e[1]),this.minZ=Math.min(this.minZ,e[2]),this.maxX=Math.max(this.maxX,e[0]),this.maxY=Math.max(this.maxY,e[1]),this.maxZ=Math.max(this.maxZ,e[2]),i}triangle(e,t,n){this.indexValues.push(e,t,n)}flatQuad(e,t,n,r,i,a){let o=k(i,f),s=this.vertex(e,o,a),c=this.vertex(t,o,a),l=this.vertex(n,o,a),u=this.vertex(r,o,a);O(re(E(t,e),E(n,e)),o)>=0?(this.triangle(s,c,l),this.triangle(s,l,u)):(this.triangle(s,l,c),this.triangle(s,u,l))}flatTriangle(e,t,n,r,i){let a=k(r,f),o=this.vertex(e,a,i),s=this.vertex(t,a,i),c=this.vertex(n,a,i);O(re(E(t,e),E(n,e)),a)>=0?this.triangle(o,s,c):this.triangle(o,c,s)}build(){if(this.vertexValues.length===0)return{vertices:new Float32Array,indices:new Uint32Array,vertexStride:10,topology:`triangle-list`,bounds:{min:[0,0,0],max:[0,0,0],center:[0,0,0],radius:0}};let e=[(this.minX+this.maxX)*.5,(this.minY+this.maxY)*.5,(this.minZ+this.maxZ)*.5],t=0;for(let n=0;n<this.vertexValues.length;n+=10){let r=this.vertexValues[n]-e[0],i=this.vertexValues[n+1]-e[1],a=this.vertexValues[n+2]-e[2];t=Math.max(t,r*r+i*i+a*a)}return{vertices:new Float32Array(this.vertexValues),indices:new Uint32Array(this.indexValues),vertexStride:10,topology:`triangle-list`,bounds:{min:[this.minX,this.minY,this.minZ],max:[this.maxX,this.maxY,this.maxZ],center:e,radius:Math.sqrt(t)}}}};function T(e,t){return[e[0]+t[0],e[1]+t[1],e[2]+t[2]]}function E(e,t){return[e[0]-t[0],e[1]-t[1],e[2]-t[2]]}function D(e,t){return[e[0]*t,e[1]*t,e[2]*t]}function O(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function re(e,t){return[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]]}function ie(e){return Math.hypot(e[0],e[1],e[2])}function k(e,t=f){let n=ie(e);return n>m?D(e,1/n):t}function A(e,t,n){return e+(t-e)*n}function j(e,t,n){return[A(e[0],t[0],n),A(e[1],t[1],n),A(e[2],t[2],n),A(e[3],t[3],n)]}function M(e,t){return[Math.max(0,Math.min(1,e[0]*t)),Math.max(0,Math.min(1,e[1]*t)),Math.max(0,Math.min(1,e[2]*t)),e[3]]}function ae(e,t){return Number.isFinite(e)&&e>0?e:t}function oe(e,t,n){return Number.isFinite(e)?Math.max(n,Math.floor(e)):t}function N(e){let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)}function se(e){let t=k(e,f),n=k(re(Math.abs(t[1])<.92?f:[1,0,0],t),[1,0,0]);return[n,k(re(t,n),[0,0,1])]}function P(e,t,n,r,i,a,o,s=!1,c=!1){let l=k(E(n,t),f),[u,d]=se(l),p=Math.max(3,Math.floor(a)),m=[],h=[];for(let e=0;e<p;e+=1){let a=e/p*Math.PI*2,o=T(D(u,Math.cos(a)),D(d,Math.sin(a)));m.push(T(t,D(o,r))),h.push(T(n,D(o,i)))}for(let n=0;n<p;n+=1){let r=(n+1)%p,i=k(T(E(m[n],t),E(m[r],t)),E(m[n],t));e.flatQuad(m[n],m[r],h[r],h[n],i,M(o,n%2==0?1.035:.93))}if(s)for(let n=0;n<p;n+=1)e.flatTriangle(t,m[(n+1)%p],m[n],D(l,-1),o);if(c)for(let t=0;t<p;t+=1)e.flatTriangle(n,h[t],h[(t+1)%p],l,o)}function F(e,t,n,r,i,a,o=M(a,.72)){let s=k(i,f);e.flatTriangle(t,n,r,s,a),e.flatTriangle(t,r,n,D(s,-1),o)}function ce(e,t,n,r,i,a,o,s=M(o,.72)){let c=k(a,f);e.flatQuad(t,n,r,i,c,o),e.flatQuad(t,i,r,n,D(c,-1),s)}function le(e,t,n,r,i=0){let a=t[0]-n[0],o=t[0]+n[0],s=t[1]-n[1],c=t[1]+n[1],l=t[2]-n[2],u=t[2]+n[2],d=i*Math.min(n[0],n[2]),m=[a,s,l],h=[o,s,l],g=[o,s,u],_=[a,s,u],v=[a+d,c,l],y=[o+d,c,l],b=[o-d,c,u],x=[a-d,c,u];e.flatQuad(v,y,b,x,f,M(r,1.08)),e.flatQuad(_,g,h,m,p,M(r,.58)),e.flatQuad(m,h,y,v,[0,0,-1],M(r,.9)),e.flatQuad(h,g,b,y,[1,0,0],M(r,1.01)),e.flatQuad(g,_,x,b,[0,0,1],M(r,.82)),e.flatQuad(_,m,v,x,[-1,0,0],M(r,.94))}function ue(e,t,n,r,i,a,o){let s=Math.max(6,Math.floor(i)),c=Math.max(3,Math.floor(a));for(let i=0;i<s;i+=1){let a=(i+1)%s,l=i/s*Math.PI*2,u=a/s*Math.PI*2,d=[Math.cos(l),0,Math.sin(l)],f=[Math.cos(u),0,Math.sin(u)];for(let i=0;i<c;i+=1){let a=(i+1)%c,s=i/c*Math.PI*2,l=a/c*Math.PI*2,u=T(t,T(D(d,n+Math.cos(s)*r),[0,Math.sin(s)*r,0])),p=T(t,T(D(f,n+Math.cos(s)*r),[0,Math.sin(s)*r,0])),m=T(t,T(D(f,n+Math.cos(l)*r),[0,Math.sin(l)*r,0])),h=T(t,T(D(d,n+Math.cos(l)*r),[0,Math.sin(l)*r,0])),g=k(T(D(T(d,f),Math.cos((s+l)*.5)),[0,Math.sin((s+l)*.5)*2,0]));e.flatQuad(u,p,m,h,g,M(o,i===0?1.08:.93))}}}function de(e={}){let t=ae(e.width??48,48),n=ae(e.depth??t,t),r=oe(e.columns??128,128,1),i=oe(e.rows??r,r,1),a=Number.isFinite(e.y)?e.y:0,o=e.centered??!0,s=e.color??[.72,.55,.26,1],c=new ne;for(let e=0;e<=i;e+=1){let l=e/i,u=(o?l-.5:l)*n;for(let e=0;e<=r;e+=1){let n=e/r,i=(o?n-.5:n)*t;c.vertex([i,a,u],f,s)}}let l=r+1;for(let e=0;e<i;e+=1)for(let t=0;t<r;t+=1){let n=0+e*l+t,r=n+1,i=n+l,a=i+1;c.triangle(n,i,r),c.triangle(r,i,a)}return c.build()}function fe(e={}){let t=ae(e.height??4.8,4.8),n=ae(e.trunkBaseRadius??t*.055,t*.055),r=oe(e.trunkSegments??8,8,3),i=oe(e.trunkSides??7,7,5),a=oe(e.frondCount??13,13,6),o=oe(e.frondSegments??6,6,3),s=Number.isFinite(e.variation)?e.variation:0,c=Number.isFinite(e.leanX)?e.leanX:t*(N(s+2.1)-.5)*.12,l=Number.isFinite(e.leanZ)?e.leanZ:t*(N(s+8.7)-.5)*.12,u=new ne,d=[],p=[];for(let e=0;e<=r;e+=1){let i=e/r,a=Math.sin(i*Math.PI*1.35+s*.31)*t*.018*Math.sin(i*Math.PI),o=Math.cos(i*Math.PI*1.1+s*.23)*t*.014*Math.sin(i*Math.PI);d.push([c*i*i+a,t*i,l*i*i+o]),p.push(n*A(1,.31,i**.83)*(1+Math.sin(e*2.17+s)*.035))}for(let e=0;e<r;e+=1){let n=e%2==0?b:y;if(P(u,d[e],d[e+1],p[e],p[e+1],i,n,e===0,e===r-1),e>0){let n=d[e-1],r=d[e+1],a=k(E(r,n),f),o=t*.0045;P(u,T(d[e],D(a,-o)),T(d[e],D(a,o)),p[e]*1.032,p[e]*1.022,i,x)}}let h=T(d[d.length-1],[0,t*.025,0]);P(u,T(h,[0,-t*.055,0]),T(h,[0,t*.045,0]),n*.38,n*.58,i,[.31,.24,.075,1],!0,!0);for(let e=0;e<a;e+=1){let n=(N(s*17+e*3.9)-.5)*.18,r=e/a*Math.PI*2+n,i=[Math.cos(r),0,Math.sin(r)],c=[-Math.sin(r),0,Math.cos(r)],l=t*A(.24,.36,N(s+e*6.17)),d=t*A(.045,.095,N(s*2.7+e)),p=t*A(.1,.22,N(s*4.3+e*1.7)),g=(N(s*9.1+e*2.3)-.5)*l*.16,_=[],v=[];for(let e=0;e<=o;e+=1){let t=e/o,n=Math.sin(t*Math.PI);_.push(T(h,T(D(i,l*t),T(D(c,g*n),[0,d*n-p*t**1.65,0]))));let r=Math.sin(t**.72*Math.PI);v.push(l*(.018+r*.075)*(1-t**6))}for(let t=0;t<o;t+=1){let n=_[t],r=_[t+1],i=T(n,D(c,v[t])),a=T(n,D(c,-v[t])),s=T(r,D(c,v[t+1])),l=T(r,D(c,-v[t+1])),d=k(re(c,E(r,n)),f),p=t/Math.max(1,o-1),h=j(e%3==0?C:S,[.22,.39,.105,1],p*.52);v[t+1]<=m?F(u,i,a,r,d,h):ce(u,i,a,l,s,d,h)}}return u.build()}function pe(){let e=new ne;for(let t=0;t<13;t+=1){let n=t/13*Math.PI*2+(N(t*7.31+1.7)-.5)*.22,r=[Math.cos(n),0,Math.sin(n)],i=[-Math.sin(n),0,Math.cos(n)],a=A(.58,.92,N(t*5.13+4.2)),o=A(.105,.17,N(t*3.71+8.9)),s=D(r,A(.02,.11,N(t+12.3))),c=T(D(r,a*.57),[0,A(.24,.43,N(t*9.2+3.1)),0]),l=T(D(r,a),[0,A(.06,.2,N(t*11.7+5.6)),0]),u=T(T(s,D(i,o*.28)),[0,.045,0]),d=T(T(s,D(i,-o*.28)),[0,.045,0]),f=T(c,D(i,o)),p=T(c,D(i,-o)),m=k(re(i,E(c,s)),[0,1,0]),h=j(t%4==0?te:w,ee,N(t*4.83+6.4)*.58);ce(e,u,d,p,f,m,h),F(e,f,p,l,m,M(h,.92))}for(let t=0;t<9;t+=1){let n=t/9*Math.PI*2+(N(t*8.7+2.2)-.5)*.38,r=[Math.cos(n),0,Math.sin(n)],i=[-Math.sin(n),0,Math.cos(n)],a=D(r,A(.08,.42,N(t*2.9+.7))),o=A(.48,.88,N(t*5.4+9.1)),s=A(.055,.095,N(t*3.6+1.4)),c=D(r,A(.08,.25,N(t*7.2+6.8))),l=T(T(a,c),[0,o*.64,0]),u=T(T(a,D(c,1.5)),[0,o,0]),d=T(T(a,D(i,s)),[0,.025,0]),f=T(T(a,D(i,-s)),[0,.025,0]),p=T(l,D(i,s*.55)),m=T(l,D(i,-s*.55)),h=j(w,t%3==0?te:ee,.3+N(t*9.9+3.4)*.42);ce(e,d,f,m,p,r,h),F(e,p,m,u,r,M(h,1.05))}return e.build()}function me(e,t){return[e.offsetX+Math.cos(t)*e.radius,e.y,e.offsetZ+Math.sin(t)*e.radius]}function he(e={}){let t=ae(e.width??2.1,2.1),n=ae(e.height??2.8,2.8),r=oe(e.bodySides??11,11,7),i=Number.isFinite(e.variation)?e.variation:0,a=e.bodyColor??_,o=e.roofColor??h,s=e.flag??!1,c=t*.5,l=new ne,u=n*.575,d=[{y:.025*n,radius:c*.94,offsetX:0,offsetZ:0},{y:.19*n,radius:c*.965,offsetX:c*.008,offsetZ:-c*.006},{y:.405*n,radius:c*.935,offsetX:-c*.012,offsetZ:c*.008},{y:u,radius:c*.84,offsetX:c*.012,offsetZ:0}];for(let e=0;e<d.length-1;e+=1){let t=d[e],n=d[e+1];for(let o=0;o<r;o+=1){let s=(o+1)%r,c=o/r*Math.PI*2,u=s/r*Math.PI*2,d=me(t,c),f=me(t,u),p=me(n,u),m=me(n,c),h=k([Math.cos((c+u)*.5),.035,Math.sin((c+u)*.5)]),g=.88+N(i*13.7+o*2.1+e*17)*.2;l.flatQuad(d,f,p,m,h,M(a,g))}}for(let e=0;e<r;e+=2){let a=e/r*Math.PI*2;if(Math.sin(a)>.79&&Math.abs(Math.cos(a))<.46)continue;let o=d[0].radius*1.012,s=d[3].radius*1.018,c=[Math.cos(a)*o,d[0].y,Math.sin(a)*o],f=[d[3].offsetX+Math.cos(a)*s,u+n*.008,d[3].offsetZ+Math.sin(a)*s],p=.86+N(i*9.7+e*4.3)*.2;P(l,c,f,t*.025,t*.019,5,M(v,p),!0,!0)}let m=[0,d[0].y,0];for(let e=0;e<r;e+=1){let t=me(d[0],e/r*Math.PI*2),n=me(d[0],(e+1)/r*Math.PI*2);l.flatTriangle(m,n,t,p,M(a,.68))}let y=c*.968,b=t*.135,x=n*.026,S=n*.23,C=b,w=[0,S,y+t*.0025],ee=[[-b,x,w[2]],[b,x,w[2]],[b,S,w[2]]];for(let e=1;e<=5;e+=1){let t=e/5*Math.PI;ee.push([Math.cos(t)*C,S+Math.sin(t)*C,w[2]])}let te=[.075,.038,.024,1];for(let e=0;e<ee.length;e+=1){let t=(e+1)%ee.length;l.flatTriangle(w,ee[e],ee[t],[0,0,1],te)}let O=t*.019,ie=v;P(l,[-b,x,w[2]+.008],[-b,S,w[2]+.008],O,O,5,ie),P(l,[b,x,w[2]+.008],[b,S,w[2]+.008],O,O,5,ie);for(let e=0;e<5;e+=1){let t=e/5*Math.PI,n=(e+1)/5*Math.PI;P(l,[Math.cos(t)*C,S+Math.sin(t)*C,w[2]+.008],[Math.cos(n)*C,S+Math.sin(n)*C,w[2]+.008],O,O,5,ie)}let j=Math.max(17,r+6),se=c*1.095,ce=u-n*.025,le=n*.72,ue=n*.842,de=[c*(N(i*4.7+1.2)-.5)*.28,n*A(.89,.945,N(i*15.1+3.7)),c*(N(i*7.3+5.6)-.5)*.28],fe=[],pe=[],he=[],ge=[];for(let e=0;e<j;e+=1){let t=e/j*Math.PI*2+(N(i*8.1+e*5.9)-.5)*.075,r=se*A(.92,1.085,N(i*11.7+e*3.1)),a=se*A(.5,.64,N(i*13.9+e*6.3)),o=se*A(.25,.36,N(i*21.3+e*4.1)),s=se*A(.055,.105,N(i*23.7+e*2.9));fe.push([Math.cos(t)*r,ce+n*A(-.035,.025,N(i*5.1+e*9.7)),Math.sin(t)*r]),pe.push([Math.cos(t+.026)*a,le+n*A(-.02,.022,N(i*17.3+e*2.7)),Math.sin(t+.026)*a]),he.push([de[0]+Math.cos(t-.018)*o,ue+n*A(-.016,.018,N(i*29.1+e*7.1)),de[2]+Math.sin(t-.018)*o]),ge.push([de[0]+Math.cos(t+.04)*s,de[1]-n*A(.012,.038,N(i*31.7+e*4.7)),de[2]+Math.sin(t+.04)*s])}for(let e=0;e<j;e+=1){let t=(e+1)%j,r=fe[e],a=fe[t],s=pe[e],c=pe[t],u=he[e],d=he[t],p=ge[e],m=ge[t],h=k(re(E(s,r),E(a,r)),f),g=k(re(E(u,s),E(c,s)),f),_=k(re(E(p,u),E(d,u)),f),v=M(o,.89+N(i*5.3+e*3.7)*.16);l.flatQuad(r,a,c,s,h,v),l.flatQuad(s,c,d,u,g,M(v,.98)),l.flatQuad(u,d,m,p,_,M(v,1.015)),l.flatTriangle(p,m,de,k(re(E(m,p),E(de,p)),f),M(v,.96));let y=D(T(r,a),.5),b=1.035+N(i*19.1+e*4.9)*.055;F(l,r,a,[y[0]*b,Math.min(r[1],a[1])-n*A(.035,.082,N(i+e*7.7)),y[2]*b],k([y[0],.16,y[2]]),M(v,.82))}let _e=t*.025;for(let e of[-c*.62,c*.62])P(l,[e,0,-c*.25],[e*.96,u*.48,-c*.23],_e*1.1,_e*.78,5,v,!0);if(s){P(l,de,[de[0],n*1.16,de[2]],t*.018,t*.012,5,g,!1,!0);let e=de[2]+t*.018;F(l,[de[0],n*1.12,e],[de[0]+t*.39,n*1.055,e],[de[0],n*.99,e],[0,0,1],[.66,.12,.055,1])}return l.build()}function ge(e={}){let t=ae(e.radius??.82,.82),n=Number.isFinite(e.variation)?e.variation:0,r=new ne,i=[.29,.27,.22,1],a=[.095,.055,.032,1],o=t*.47,s=[0,t*.035,0];for(let e=0;e<9;e+=1){let t=e/9*Math.PI*2,i=(e+1)/9*Math.PI*2,c=o*(.84+N(n*5.1+e*3.7)*.2),l=o*(.84+N(n*5.1+(e+1)*3.7)*.2);r.flatTriangle(s,[Math.cos(t)*c,s[1],Math.sin(t)*c],[Math.cos(i)*l,s[1],Math.sin(i)*l],f,M(a,.82+N(n*2.7+e*7.3)*.3))}for(let e=0;e<10;e+=1){let a=e/10*Math.PI*2+(N(n*11.3+e*4.9)-.5)*.09,o=t*(.81+N(n*7.7+e*8.1)*.08),s=Math.cos(a)*o,c=Math.sin(a)*o,l=t*(.19+N(n*13.1+e*6.7)*.035),u=t*(.21+N(n*17.9+e*5.3)*.09),d=(N(n*19.1+e*9.7)-.5)*t*.07,f=(N(n*23.3+e*2.9)-.5)*t*.07,p=.78+N(n*29.7+e*10.1)*.34;P(r,[s,t*.025,c],[s+d,t*.025+u,c+f],l,l*.73,5,M(i,p),!0,!0)}let c=t*1.2,l=t*.125,u=[.62,-.72];for(let e=0;e<u.length;e+=1){let i=u[e]+(N(n*31.7+e*14.3)-.5)*.08,a=[Math.cos(i),0,Math.sin(i)],o=c*.5,s=t*(.25+e*.13);P(r,[-a[0]*o,s,-a[2]*o],[a[0]*o,s,a[2]*o],l,l*.94,6,M(g,e===0?.82:.94),!0,!0)}return r.build()}function _e(e={}){let t=ae(e.height??1.7,1.7)/1.7,n=Number.isFinite(e.variation)?e.variation:0,r=new ne,i=(e,t)=>[e[0],e[1],e[2],t],a=i(j([.46,.22,.105,1],[.76,.43,.235,1],N(n*7.13+1.9)),1),o=M(a,1.12),s=i(j([.075,.038,.022,1],[.22,.095,.038,1],N(n*3.77+8.4)),4),c=[[.67,.2,.08,1],[.84,.47,.1,1],[.24,.43,.28,1],[.22,.34,.47,1]],l=i(e.tunicColor??c[Math.floor(N(n*11.31+2.6)*c.length)%c.length],2),u=i(e.accentColor??j([.96,.67,.2,1],[.82,.79,.53,1],N(n*5.17+4.2)),3),d=[.16,.075,.034,5],f=[.09,.04,.025,4],p=[u[0],u[1],u[2],6],m=[s[0],s[1],s[2],7];for(let e of[-1,1]){let n=e*.105*t;P(r,[n,.075*t,-.025*t],[n,.07*t,.16*t],.085*t,.065*t,5,d,!0,!0),P(r,[n,.105*t,0],[n+e*.012*t,.63*t,0],.078*t,.09*t,6,M(a,e<0?.91:.98),!0,!1)}P(r,[0,.56*t,0],[0,1.13*t,0],.285*t,.215*t,7,l,!0,!1),P(r,[0,.82*t,0],[0,.89*t,0],.275*t,.255*t,7,u,!1,!1),P(r,[0,1.08*t,0],[0,1.25*t,0],.215*t,.235*t,7,M(l,1.04),!1,!0);for(let e of[-1,1]){let i=[e*.19*t,1.17*t,0],o=[e*(.305+(N(n+e*3.1)-.5)*.025)*t,.91*t,e*.025*t],s=[e*.275*t,.7*t,.065*t];P(r,i,o,.08*t,.065*t,5,M(l,e<0?.94:1.07),!0,!1),P(r,o,s,.058*t,.052*t,5,M(a,e<0?.95:1.04),!1,!0)}P(r,[0,1.23*t,0],[0,1.35*t,0],.075*t,.082*t,6,a,!1,!1),P(r,[0,1.32*t,0],[0,1.43*t,0],.11*t,.148*t,7,a,!0,!1),P(r,[0,1.43*t,0],[0,1.58*t,0],.148*t,.135*t,7,o,!1,!0),P(r,[0,1.565*t,-.004*t],[0,1.68*t,-.012*t],.142*t,.075*t,7,s,!1,!0),ue(r,[0,1.555*t,0],.139*t,.012*t,9,3,p),P(r,[0,1.64*t,-.012*t],[0,1.755*t,-.018*t],.058*t,.026*t,6,m,!1,!0),P(r,[0,1.485*t,.132*t],[0,1.48*t,.169*t],.021*t,.007*t,4,o,!1,!0);for(let e of[-1,1]){let n=e*.03*t,i=e*.058*t;r.flatQuad([n,1.515*t,.139*t],[i,1.515*t,.132*t],[i,1.497*t,.137*t],[n,1.499*t,.143*t],[0,0,1],f)}return r.flatQuad([-.032*t,1.443*t,.139*t],[.032*t,1.443*t,.139*t],[.025*t,1.434*t,.141*t],[-.025*t,1.434*t,.141*t],[0,0,1],M(f,.78)),r.build()}function ve(){let e=new ne,t=[-.58,-.055,-.13],n=[.5,-.04,-.095],r=[.43,-.045,.105],i=[-.53,-.052,.15],a=[-.54,.058,-.105],o=[.46,.08,-.075],s=[.39,.095,.085],c=[-.49,.065,.12],l=[.82,.8,.75,1],u=[.74,.72,.67,1],d=[.64,.63,.59,1];return e.flatQuad(a,o,s,c,f,l),e.flatQuad(t,i,r,n,p,[.5,.49,.46,1]),e.flatQuad(t,n,o,a,[0,.12,-1],d),e.flatQuad(n,r,s,o,[1,.12,.18],u),e.flatQuad(r,i,c,s,[0,.12,1],d),e.flatQuad(i,t,a,c,[-1,.12,.08],u),e.build()}function ye(e={}){let t=ae(e.length??2.2,2.2),n=ae(e.width??.92,.92),r=ae(e.height??2.75,2.75),i=Number.isFinite(e.variation)?e.variation:0,a=e.crenellated??!0,o=new ne,s=[.64,.455,.265,1],c=[.53,.305,.16,1],l=r*.78/4;le(o,[0,r*.018,0],[t*.505,r*.018,n*.505],M(c,.76));for(let e=0;e<4;e+=1){let r=e%2==0?0:t*.13;for(let a=0;a<3;a+=1){let u=t/3,d=-t*.5+u*(a+.5)+r,f=Math.max(-t*.5+u*.38,Math.min(t*.5-u*.38,d)),p=N(i*17.9+e*11.3+a*5.7),m=j(s,c,.16+N(i*7.3+e*4.1+a)*.42);le(o,[f,l*(e+.5),(p-.5)*n*.035],[u*(.43+p*.035),l*.46,n*(.47+(p-.5)*.025)],M(m,.86+p*.22),(p-.5)*.12)}}if(le(o,[0,r*.815,0],[t*.51,r*.045,n*.55],M(s,1.06),(N(i*31.1)-.5)*.08),a)for(let e of[-t*.36,0,t*.36])le(o,[e,r*.93,0],[t*.105,r*.105,n*.49],M(j(s,c,.22),.94+N(i+e*7.3)*.15),(N(i*13.7+e)-.5)*.1);return o.build()}function be(e={}){let t=ae(e.radius??1.72,1.72),n=ae(e.height??4.35,4.35),r=oe(e.sides??10,10,8),i=Number.isFinite(e.variation)?e.variation:0,a=new ne,o=[.605,.415,.235,1],s=[.49,.275,.145,1];P(a,[0,0,0],[0,n*.78,0],t*1.06,t*.92,r,M(j(o,s,.24),.93),!0,!0),P(a,[0,n*.76,0],[0,n*.84,0],t*1.05,t*1.05,r,M(o,1.04),!1,!0);let c=Math.max(4,Math.floor(r/2));for(let e=0;e<c;e+=1){let r=e/c*Math.PI*2+i*.017,l=t*.78,u=t*Math.PI/c*.42;le(a,[Math.cos(r)*l,n*.925,Math.sin(r)*l],[u,n*.09,t*.22],M(j(o,s,.12+N(i+e*3.1)*.34),.9+N(i+e*9.7)*.18),(N(i*7.1+e)-.5)*.1)}return a.build()}function xe(e={}){let t=ae(e.radius??1,1),n=Math.min(t*.9,ae(e.thickness??t*.085,t*.085)),r=ae(e.height??t*.022,t*.022),i=oe(e.segments??64,64,8),a=e.color??[1,.79,.22,.88],o=new ne,s=t,c=t-n,l=r*.5,u=-r*.5;for(let e=0;e<i;e+=1){let t=e/i*Math.PI*2,n=(e+1)/i*Math.PI*2,r=[Math.cos(t),0,Math.sin(t)],d=[Math.cos(n),0,Math.sin(n)],m=T(D(r,s),[0,l,0]),h=T(D(d,s),[0,l,0]),g=T(D(r,c),[0,l,0]),_=T(D(d,c),[0,l,0]),v=T(D(r,s),[0,u,0]),y=T(D(d,s),[0,u,0]),b=T(D(r,c),[0,u,0]),x=T(D(d,c),[0,u,0]),S=k(T(r,d),[1,0,0]);o.flatQuad(g,m,h,_,f,a),o.flatQuad(x,y,v,b,p,M(a,.68)),o.flatQuad(v,y,h,m,S,M(a,.86)),o.flatQuad(x,b,g,_,D(S,-1),M(a,.72))}return o.build()}function Se(e={}){let t=ae(e.width??1,1),n=ae(e.height??t,t),r=e.color??[.78,.94,1,.72],i=e.doubleSided??!0,a=new ne,o=t*.5,s=n*.5,c=[-o,-s,0],l=[o,-s,0],u=[o,s,0],d=[-o,s,0];return i?ce(a,c,l,u,d,[0,0,1],r):a.flatQuad(c,l,u,d,[0,0,1],r),a.build()}function Ce(e,t){return[e[0]-t[0],e[1]-t[1],e[2]-t[2]]}function we(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function Te(e,t){return[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]]}function Ee(e){let t=Math.hypot(e[0],e[1],e[2]);return t<1e-8?[0,0,0]:[e[0]/t,e[1]/t,e[2]/t]}function De(e,t,n,r){let i=1/Math.tan(e*.5),a=new Float32Array(16);return a[0]=i/t,a[5]=i,a[10]=r/(n-r),a[11]=-1,a[14]=r*n/(n-r),a}function Oe(e,t,n){let r=Ee(Ce(e,t)),i=Ee(Te(n,r)),a=Te(r,i),o=new Float32Array(16);return o[0]=i[0],o[1]=a[0],o[2]=r[0],o[3]=0,o[4]=i[1],o[5]=a[1],o[6]=r[1],o[7]=0,o[8]=i[2],o[9]=a[2],o[10]=r[2],o[11]=0,o[12]=-we(i,e),o[13]=-we(a,e),o[14]=-we(r,e),o[15]=1,o}function ke(e,t){let n=new Float32Array(16),r=e[0],i=e[1],a=e[2],o=e[3],s=e[4],c=e[5],l=e[6],u=e[7],d=e[8],f=e[9],p=e[10],m=e[11],h=e[12],g=e[13],_=e[14],v=e[15],y=t[0],b=t[1],x=t[2],S=t[3];return n[0]=y*r+b*s+x*d+S*h,n[1]=y*i+b*c+x*f+S*g,n[2]=y*a+b*l+x*p+S*_,n[3]=y*o+b*u+x*m+S*v,y=t[4],b=t[5],x=t[6],S=t[7],n[4]=y*r+b*s+x*d+S*h,n[5]=y*i+b*c+x*f+S*g,n[6]=y*a+b*l+x*p+S*_,n[7]=y*o+b*u+x*m+S*v,y=t[8],b=t[9],x=t[10],S=t[11],n[8]=y*r+b*s+x*d+S*h,n[9]=y*i+b*c+x*f+S*g,n[10]=y*a+b*l+x*p+S*_,n[11]=y*o+b*u+x*m+S*v,y=t[12],b=t[13],x=t[14],S=t[15],n[12]=y*r+b*s+x*d+S*h,n[13]=y*i+b*c+x*f+S*g,n[14]=y*a+b*l+x*p+S*_,n[15]=y*o+b*u+x*m+S*v,n}function Ae(e){let t=new Float32Array(16),n=e[0],r=e[1],i=e[2],a=e[3],o=e[4],s=e[5],c=e[6],l=e[7],u=e[8],d=e[9],f=e[10],p=e[11],m=e[12],h=e[13],g=e[14],_=e[15],v=n*s-r*o,y=n*c-i*o,b=n*l-a*o,x=r*c-i*s,S=r*l-a*s,C=i*l-a*c,w=u*h-d*m,ee=u*g-f*m,te=u*_-p*m,ne=d*g-f*h,T=d*_-p*h,E=f*_-p*g,D=v*E-y*T+b*ne+x*te-S*ee+C*w;if(Math.abs(D)<1e-9)return t;let O=1/D;return t[0]=(s*E-c*T+l*ne)*O,t[1]=(i*T-r*E-a*ne)*O,t[2]=(h*C-g*S+_*x)*O,t[3]=(f*S-d*C-p*x)*O,t[4]=(c*te-o*E-l*ee)*O,t[5]=(n*E-i*te+a*ee)*O,t[6]=(g*b-m*C-_*y)*O,t[7]=(u*C-f*b+p*y)*O,t[8]=(o*T-s*te+l*w)*O,t[9]=(r*te-n*T-a*w)*O,t[10]=(m*S-h*b+_*v)*O,t[11]=(d*b-u*S-p*v)*O,t[12]=(s*ee-o*ne-c*w)*O,t[13]=(n*ne-r*ee+i*w)*O,t[14]=(h*y-m*x-g*v)*O,t[15]=(u*x-d*y+f*v)*O,t}function je(e,t){let[n,r,i,a]=t;return[e[0]*n+e[4]*r+e[8]*i+e[12]*a,e[1]*n+e[5]*r+e[9]*i+e[13]*a,e[2]*n+e[6]*r+e[10]*i+e[14]*a,e[3]*n+e[7]*r+e[11]*i+e[15]*a]}var I=String.raw`
struct SimUniforms {
  grid: vec4f,
  physics: vec4f,
  rayOriginRadius: vec4f,
  rayDirAmount: vec4f,
  brush: vec4f,
  world: vec4f,
  pad0: vec4f,
  pad1: vec4f,
}

struct StateBuffer {
  values: array<vec4f>,
}

struct ElementBuffer {
  // x lava depth, y oil depth, z fire intensity, w heat
  values: array<vec4f>,
}

struct ScalarBuffer {
  values: array<f32>,
}

struct HitBuffer {
  value: vec4f,
  material: vec4f,
}

struct ReservoirBuffer {
  sand: atomic<i32>,
  dirt: atomic<i32>,
  water: atomic<i32>,
  lava: atomic<i32>,
  oil: atomic<i32>,
  materialLock: atomic<i32>,
  pad0: i32,
  pad1: i32,
}

// Walls remain a sparse structural layer, while their hydraulic effect is
// rasterized into a compact four-edge cell field. Edge crests use atomics so
// several touching wall blocks can safely publish the highest shared saddle.
struct WallEdgeCell {
  north: atomic<u32>,
  east: atomic<u32>,
  south: atomic<u32>,
  west: atomic<u32>,
}

struct WallEdgeBuffer {
  values: array<WallEdgeCell>,
}

const WALL_CREST_OFFSET_METERS: f32 = 128.0;
const WALL_CREST_QUANTIZATION: f32 = 4096.0;

fn encodeWallCrest(crest: f32) -> u32 {
  return 1u + u32(clamp(
    round((crest + WALL_CREST_OFFSET_METERS) * WALL_CREST_QUANTIZATION),
    0.0,
    4294967040.0
  ));
}

fn decodeWallCrest(encoded: u32) -> f32 {
  if (encoded == 0u) {
    return -1000000.0;
  }
  return f32(encoded - 1u) / WALL_CREST_QUANTIZATION
    - WALL_CREST_OFFSET_METERS;
}

fn encodedWallEdge(
  buffer: ptr<storage, WallEdgeBuffer, read_write>,
  position: vec2i,
  direction: vec2i
) -> u32 {
  let cell = clampCell(position);
  let index = gridIndex(cell.x, cell.y);
  if (direction.y < 0) {
    return atomicLoad(&(*buffer).values[index].north);
  }
  if (direction.x > 0) {
    return atomicLoad(&(*buffer).values[index].east);
  }
  if (direction.y > 0) {
    return atomicLoad(&(*buffer).values[index].south);
  }
  if (direction.x < 0) {
    return atomicLoad(&(*buffer).values[index].west);
  }
  return 0u;
}

fn wallCrestBetween(
  buffer: ptr<storage, WallEdgeBuffer, read_write>,
  source: vec2i,
  destination: vec2i
) -> f32 {
  let offset = destination - source;
  var encodedCrest = 0u;
  if (offset.x > 0) {
    encodedCrest = max(
      encodedCrest,
      max(
        encodedWallEdge(buffer, source, vec2i(1, 0)),
        encodedWallEdge(buffer, destination, vec2i(-1, 0))
      )
    );
  } else if (offset.x < 0) {
    encodedCrest = max(
      encodedCrest,
      max(
        encodedWallEdge(buffer, source, vec2i(-1, 0)),
        encodedWallEdge(buffer, destination, vec2i(1, 0))
      )
    );
  }
  if (offset.y > 0) {
    encodedCrest = max(
      encodedCrest,
      max(
        encodedWallEdge(buffer, source, vec2i(0, 1)),
        encodedWallEdge(buffer, destination, vec2i(0, -1))
      )
    );
  } else if (offset.y < 0) {
    encodedCrest = max(
      encodedCrest,
      max(
        encodedWallEdge(buffer, source, vec2i(0, -1)),
        encodedWallEdge(buffer, destination, vec2i(0, 1))
      )
    );
  }
  return decodeWallCrest(encodedCrest);
}

fn gridSize() -> u32 {
  return u32(uniforms.grid.x);
}

fn gridIndex(x: u32, y: u32) -> u32 {
  return y * gridSize() + x;
}

fn clampCell(p: vec2i) -> vec2u {
  let hi = i32(gridSize()) - 1;
  return vec2u(clamp(p, vec2i(0), vec2i(hi)));
}

fn surfaceAt(buffer: ptr<storage, StateBuffer, read>, p: vec2i) -> f32 {
  let cell = clampCell(p);
  let value = (*buffer).values[gridIndex(cell.x, cell.y)];
  return value.x + value.y + value.z;
}

fn terrainAt(buffer: ptr<storage, StateBuffer, read>, p: vec2i) -> f32 {
  let cell = clampCell(p);
  let value = (*buffer).values[gridIndex(cell.x, cell.y)];
  return value.x + value.y;
}

fn wallSupportEnvelope(
  buffer: ptr<storage, StateBuffer, read>,
  center: vec2i,
  n: i32
) -> vec4f {
  let centerTerrain = terrainAt(buffer, center);
  var minimumTerrain = centerTerrain;
  var maximumTerrain = centerTerrain;
  var maximumWater = 0.0;
  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      let samplePosition = clamp(
        center + vec2i(ox, oy),
        vec2i(0),
        vec2i(n - 1)
      );
      let sampleCell = vec2u(samplePosition);
      let sampleValue = (*buffer).values[gridIndex(sampleCell.x, sampleCell.y)];
      let sampleTerrain = sampleValue.x + sampleValue.y;
      minimumTerrain = min(minimumTerrain, sampleTerrain);
      maximumTerrain = max(maximumTerrain, sampleTerrain);
      maximumWater = max(maximumWater, sampleValue.z);
    }
  }
  return vec4f(centerTerrain, minimumTerrain, maximumTerrain, maximumWater);
}

fn hash21(p: vec2f) -> f32 {
  let p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  let q = p3 + dot(p3, p3.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

fn noise2(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p0: vec2f) -> f32 {
  var p = p0;
  var amplitude = 0.5;
  var total = 0.0;
  for (var octave = 0; octave < 5; octave = octave + 1) {
    total = total + noise2(p) * amplitude;
    p = mat2x2f(1.71, 1.02, -1.02, 1.71) * p + vec2f(7.7, 3.1);
    amplitude = amplitude * 0.5;
  }
  return total;
}

fn gradientDirection(cell: vec2f) -> vec2f {
  // Eight fixed, normalized gradients preserve smooth Perlin-style variation
  // without evaluating sine and cosine four times per noise sample.
  let selector = u32(
    floor(hash21(cell + vec2f(19.17, 73.41)) * 8.0)
  );
  switch selector {
    case 0u: { return vec2f(1.0, 0.0); }
    case 1u: { return vec2f(-1.0, 0.0); }
    case 2u: { return vec2f(0.0, 1.0); }
    case 3u: { return vec2f(0.0, -1.0); }
    case 4u: { return vec2f(0.70710678, 0.70710678); }
    case 5u: { return vec2f(-0.70710678, 0.70710678); }
    case 6u: { return vec2f(0.70710678, -0.70710678); }
    default: { return vec2f(-0.70710678, -0.70710678); }
  }
}

fn gradientNoise2(p: vec2f) -> f32 {
  let cell = floor(p);
  let local = fract(p);
  let fade = local * local * local * (local * (local * 6.0 - 15.0) + 10.0);
  let n00 = dot(gradientDirection(cell), local);
  let n10 = dot(gradientDirection(cell + vec2f(1.0, 0.0)), local - vec2f(1.0, 0.0));
  let n01 = dot(gradientDirection(cell + vec2f(0.0, 1.0)), local - vec2f(0.0, 1.0));
  let n11 = dot(gradientDirection(cell + vec2f(1.0, 1.0)), local - vec2f(1.0, 1.0));
  return mix(mix(n00, n10, fade.x), mix(n01, n11, fade.x), fade.y) * 1.41421356;
}

fn gradientFbm(p0: vec2f) -> f32 {
  var p = p0;
  var amplitude = 0.54;
  var total = 0.0;
  var weight = 0.0;
  for (var octave = 0; octave < 4; octave = octave + 1) {
    total = total + gradientNoise2(p) * amplitude;
    weight = weight + amplitude;
    p = mat2x2f(1.63, 1.11, -1.11, 1.63) * p + vec2f(5.3, -2.7);
    amplitude = amplitude * 0.49;
  }
  return total / weight;
}
`,Me=String.raw`
struct SoilCell {
  dirtDepth: f32,
  suspendedSand: f32,
  suspendedDirt: f32,
  compaction: f32,
}

struct SoilBuffer {
  values: array<SoilCell>,
}

struct DirtFluxBuffer {
  // x total outgoing dirt, y bounded outflow scale; z/w remain reserved.
  values: array<vec4f>,
}
`,Ne=String.raw`
const MAX_WALL_BLOCKS: u32 = 1024u;

struct WallBlock {
  // xy grid cell, z captured foundation height, w 10 + yaw radians (0 inactive)
  gridFoundation: vec4f,
  // x integrity, y saturation, z captured minimum support, w nominal wall height
  condition: vec4f,
}

struct WallBlockBuffer {
  values: array<WallBlock>,
}

struct WallDiagnosticsBuffer {
  // 0 next slot/count, 1 active, 2 damaged, 3 collapsed,
  // 4 maximum damage step Q1e6, 5 successful builds, 6 rejected builds.
  values: array<atomic<u32>>,
}

struct WallCollapseDepositBuffer {
  // Pending loose-sand depth in millionths of a metre. A separate cell field
  // avoids races where several adjacent wall pieces collapse together.
  values: array<atomic<u32>>,
}
`,Pe=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read_write> stateA: StateBuffer;
@group(0) @binding(2) var<storage, read_write> stateB: StateBuffer;
@group(0) @binding(3) var<storage, read_write> waterFlux: StateBuffer;
@group(0) @binding(4) var<storage, read_write> sandFlux: StateBuffer;
@group(0) @binding(5) var<storage, read_write> vegetationA: ScalarBuffer;
@group(0) @binding(6) var<storage, read_write> vegetationB: ScalarBuffer;
@group(0) @binding(7) var<storage, read_write> groundwater: ScalarBuffer;
@group(0) @binding(8) var<storage, read_write> elementA: ElementBuffer;
@group(0) @binding(9) var<storage, read_write> elementB: ElementBuffer;
@group(0) @binding(10) var<storage, read_write> elementFlux: StateBuffer;

fn landscape(worldXZ: vec2f) -> vec3f {
  // Keep the physical island footprint unchanged when the outer ocean domain
  // grows. 92 is the original 184-unit world's half extent.
  let q = worldXZ / 92.0;

  let islandA = 1.0 - smoothstep(
    0.24,
    1.02,
    length((q - vec2f(-0.12, 0.025)) * vec2f(0.87, 1.11))
  );
  let islandB = 1.0 - smoothstep(
    0.16,
    0.68,
    length((q - vec2f(0.4, -0.18)) * vec2f(1.02, 1.38))
  );
  let islandC = 1.0 - smoothstep(
    0.13,
    0.56,
    length((q - vec2f(0.29, 0.25)) * vec2f(1.08, 1.3))
  );
  let island = clamp(max(islandA, max(islandB, islandC)), 0.0, 1.0);

  let broad = fbm(q * 2.15 + vec2f(4.7, 9.3));
  let gradientBroad = gradientFbm(q * 2.7 + vec2f(-1.8, 7.6));
  let folded = abs(fbm(q * 4.6 + vec2f(14.1, 2.8)) - 0.5) * 2.0;
  let ridge = pow(folded, 2.4);
  let cragFold = abs(gradientFbm(q * 8.4 + vec2f(8.4, -3.7)));
  let crag = pow(smoothstep(0.1, 0.54, cragFold), 2.8);
  let dunes = fbm(q * 8.0 + vec2f(-2.2, 11.4));

  let villageDeltaA = (worldXZ - vec2f(-28.0, 12.0)) / vec2f(18.0, 14.0);
  let villageDeltaB = (worldXZ - vec2f(28.0, 18.0)) / vec2f(17.0, 13.0);
  let villageShelfA = exp(-dot(villageDeltaA, villageDeltaA) * 2.15);
  let villageShelfB = exp(-dot(villageDeltaB, villageDeltaB) * 2.2);
  let villageShelves = max(villageShelfA, villageShelfB);

  let channelCenter = -11.0 + sin(worldXZ.y * 0.041) * 8.2;
  let channel = exp(-abs(worldXZ.x - channelCenter) * 0.16)
    * smoothstep(-72.0, 34.0, worldXZ.y);
  let volcanoCenter = vec2f(46.0, -28.0);
  let volcanoLocal = worldXZ - volcanoCenter;
  let volcanoDistance = distance(worldXZ, volcanoCenter);
  let volcanoAngle = atan2(volcanoLocal.y, volcanoLocal.x);
  let volcanoErosionNoise = gradientNoise2(
    worldXZ * 0.135 + vec2f(-5.7, 9.4)
  );
  let volcanoRimWarp = volcanoErosionNoise * 1.55
    + sin(volcanoAngle * 5.0 + 0.8) * 0.72
    + sin(volcanoAngle * 9.0 - 1.7) * 0.31;
  let volcanoMouthDistance = volcanoDistance + volcanoRimWarp;
  let volcanoConeDistance = volcanoDistance
    + volcanoErosionNoise * 0.86
    + sin(volcanoAngle * 3.0 - 0.45) * 0.38;

  let beach = smoothstep(0.08, 0.7, island) * (1.0 - smoothstep(0.74, 0.98, island));
  let gentle = 1.0 - smoothstep(0.48, 0.9, ridge);
  let softRelief = island * (
    8.4
      + broad * 7.1
      + max(0.0, gradientBroad) * 2.7
      + ridge * 3.5
  );
  let brokenRimField = volcanoErosionNoise
    + sin(volcanoAngle * 4.0 + 1.2) * 0.42;
  let brokenRockRim = exp(
    -pow(volcanoMouthDistance - 7.1, 2.0) * 0.5
  ) * mix(
    0.12,
    1.0,
    smoothstep(-0.38, 0.48, brokenRimField)
  );
  let runnelPattern = pow(
    max(
      0.0,
      cos(volcanoAngle * 5.0 + volcanoErosionNoise * 3.2 - 0.6)
    ),
    9.0
  );
  let erodedRunnels = runnelPattern
    * smoothstep(7.2, 10.0, volcanoDistance)
    * (1.0 - smoothstep(17.0, 22.0, volcanoDistance));
  let volcanoCone = (
    1.0 - smoothstep(5.5, 22.0, volcanoConeDistance)
  ) * 5.1
    + brokenRockRim * 0.82
    - erodedRunnels * 1.08;
  let volcanoCrater = (
    1.0 - smoothstep(0.0, 6.35, volcanoMouthDistance)
  ) * (4.12 + max(0.0, -volcanoErosionNoise) * 0.42);
  let oilBasinDelta = (worldXZ - vec2f(42.0, 20.0)) / vec2f(7.5, 5.8);
  let oilBasinRadius = length(oilBasinDelta);
  let oilBasin = exp(-dot(oilBasinDelta, oilBasinDelta) * 2.4) * 2.08;
  // A raised, irregular lip keeps the demonstration pool readable and stops
  // it draining to the nearby coast before the player interacts with it.
  let oilBasinRim = exp(-pow(oilBasinRadius - 1.0, 2.0) * 18.0)
    * (1.58 + gradientNoise2(worldXZ * 0.13 + vec2f(2.4, -5.7)) * 0.22);
  // A broad, shallow spring basin interrupts the central channel. The source
  // itself is simulated below; this depression merely gives its first water a
  // natural lake bed before the outflow finds the existing channel.
  let springBasinDelta = (
    worldXZ - vec2f(-11.0, -2.0)
  ) / vec2f(10.5, 7.2);
  let springBasin = exp(
    -dot(springBasinDelta, springBasinDelta) * 2.15
  ) * 1.45;
  let springBasinRadius = length(springBasinDelta);
  let springBasinRim = exp(
    -pow(springBasinRadius - 1.0, 2.0) * 16.0
  ) * (
    0.46
      + gradientNoise2(worldXZ * 0.12 + vec2f(-8.1, 3.7)) * 0.1
  );
  let landProfile = -5.2
    + softRelief
    + villageShelfA * 2.25
    + villageShelfB * 2.05
    - channel * island * 3.8
    + volcanoCone
    - volcanoCrater
    - springBasin
    + springBasinRim
    - oilBasin
    + oilBasinRim;

  // Rock is a spatially limited terrain stratum rather than the shape of the
  // whole island. Most of the island is a deep, movable sand/earth mantle over
  // a low foundation; clustered, sharper masks lift that immutable stratum
  // through the mantle as genuine outcrops.
  let rockPatchNoise = gradientFbm(q * 5.1 + vec2f(11.8, -6.4));
  let rockPatch = smoothstep(0.11, 0.42, rockPatchNoise + ridge * 0.36);
  let rockKnuckle = smoothstep(0.48, 0.82, ridge)
    * smoothstep(0.2, 0.72, crag);
  let outcropDeltaA = (worldXZ - vec2f(6.0, 43.0)) / vec2f(13.0, 9.0);
  let outcropDeltaB = (worldXZ - vec2f(-53.0, -14.0)) / vec2f(12.0, 9.0);
  let outcropDeltaC = (worldXZ - vec2f(-9.0, -51.0)) / vec2f(11.0, 12.0);
  let rockKnots = max(
    exp(-dot(outcropDeltaA, outcropDeltaA) * 1.8),
    max(
      exp(-dot(outcropDeltaB, outcropDeltaB) * 1.9),
      exp(-dot(outcropDeltaC, outcropDeltaC) * 1.75)
    )
  ) * (0.92 + crag * 0.08);
  let interiorMask = smoothstep(0.18, 0.68, island);
  var outcropMask = clamp(
    max(
      rockPatch * smoothstep(0.25, 0.78, crag),
      max(rockKnuckle, rockKnots)
    ) * interiorMask,
    0.0,
    1.0
  );
  // Settlements sit on deep movable ground. Generic outcrops stop short of the
  // volcano because its dedicated immutable core and crater are built below.
  outcropMask = outcropMask
    * smoothstep(9.0, 20.0, volcanoDistance)
    * (1.0 - villageShelves * 0.88);
  let earthyMantle = island * gentle * (0.18 + dunes * 0.34) + beach * (0.4 + dunes * 0.48);
  // The ocean has the same layered terrain model as the island: immutable
  // stone below a noisy sand shelf. The shelf overlaps the whole submerged
  // shoulder instead of beginning outside one material contour, so transparent
  // water reveals one continuous sandy slope rather than a bedrock seam.
  let seabedNoise = gradientFbm(q * 3.7 + vec2f(-12.4, 4.8));
  let seabedShelf = 1.0 - smoothstep(0.34, 0.96, island);
  let seabedMantle = seabedShelf * (0.94 + seabedNoise * 0.2);
  // The protected outer simulation belt descends gently before the finite
  // domain edge. Rock and its sand mantle receive the same offset, preserving
  // the sediment thickness while avoiding a flat tabletop beneath deep water.
  let domainRadius = length(worldXZ) / (uniforms.world.x * 0.5);
  let outerShelfDrop = smoothstep(0.76, 0.985, domainRadius) * 1.8;
  let targetSurface = landProfile
    + earthyMantle
    + seabedMantle
    - outerShelfDrop;
  let foundation = -5.7
    + island * (0.92 + broad * 0.58)
    + seabedNoise * 0.12 * (1.0 - island)
    - channel * island * 0.42
    - outerShelfDrop;
  let cragDetail = gradientNoise2(
    worldXZ * 0.17
      + vec2f(
        gradientNoise2(worldXZ * 0.052 + vec2f(8.2, -3.1)),
        gradientNoise2(worldXZ.yx * 0.047 + vec2f(-5.4, 11.7))
      ) * 1.6
  );
  let outcropLift = outcropMask * (
    0.48
      + crag * 1.28
      + ridge * 0.56
      + max(0.0, cragDetail) * 0.72
  ) + rockKnots * rockKnots * 0.68;
  // Exposed stone rises through the target sandy surface instead of reading as
  // a gray depression. Outside the sparse mask, the immutable foundation stays
  // well below the deep movable mantle.
  let exposedRockTop = targetSurface + outcropLift;
  let regionalRock = mix(
    foundation,
    exposedRockTop,
    smoothstep(0.27, 0.72, outcropMask)
  );
  // The volcano is a real rock landform beneath its movable sandy apron. Its
  // exposed crown follows the crater-shaped target surface, leaving a durable
  // stone bowl for the lava instead of a combustible blanket of hidden ground
  // cover. Farther down the cone, an increasing sand shell hides the same core.
  let volcanoCore = 1.0 - smoothstep(10.0, 22.5, volcanoConeDistance);
  let volcanoBareCrown = 1.0 - smoothstep(
    10.2,
    15.0,
    volcanoMouthDistance - erodedRunnels * 1.8
  );
  let volcanoSandShell = mix(
    0.0,
    4.15,
    smoothstep(9.6, 21.2, volcanoConeDistance)
  );
  let volcanoRockTop = targetSurface - volcanoSandShell;
  let rock = max(
    regionalRock,
    mix(foundation, volcanoRockTop, volcanoCore)
  );
  let outcropClearance = max(
    smoothstep(0.58, 0.88, outcropMask),
    volcanoBareCrown
  );
  var sand = max(0.0, targetSurface - rock);
  sand = sand * (1.0 - outcropClearance);
  // A soft sandy apron resumes below the bare rim. The rock core remains under
  // it, so digging the flank exposes stone instead of manufacturing water or
  // an arbitrary bottom layer.
  let volcanoSandApron = smoothstep(12.0, 15.2, volcanoConeDistance)
    * (1.0 - smoothstep(18.0, 22.0, volcanoConeDistance));
  sand = max(
    sand,
    volcanoSandApron
      * mix(0.45, 3.4, smoothstep(12.0, 20.0, volcanoConeDistance))
  );

  // Keep the island mask alongside the two height layers so initial water can
  // be restricted to the exterior ocean. A low inland excavation is dry
  // unless a mission explicitly supplies groundwater.
  return vec3f(rock, max(0.0, sand), island);
}

fn segmentDistance2d(point: vec2f, start: vec2f, end: vec2f) -> f32 {
  let edge = end - start;
  let projection = clamp(
    dot(point - start, edge) / max(dot(edge, edge), 0.0001),
    0.0,
    1.0
  );
  return distance(point, start + edge * projection);
}

// Shared by terrain carving and initial water placement so every visible
// river cell follows the same channel all the way into its finite edge seep.
fn quietInlandRiverDistance(worldXZ: vec2f) -> f32 {
  let y = worldXZ.y;
  var centerX = -47.0;
  if (y < -5.0) {
    let t = smoothstep(-31.0, -5.0, y);
    centerX = mix(-47.0, -64.0, t) + sin(t * 6.2831853) * 3.2;
  } else if (y < 7.0) {
    let t = smoothstep(-5.0, 7.0, y);
    centerX = mix(-64.0, -57.0, t) - sin(t * 3.14159265) * 2.8;
  } else {
    let t = smoothstep(7.0, 29.0, y);
    centerX = mix(-57.0, -74.0, t) + sin(t * 6.2831853) * 3.7;
  }
  let outsideRange = max(max(-31.0 - y, y - 29.0), 0.0);
  return length(vec2f(worldXZ.x - centerX, outsideRange));
}

fn strongInlandRiverDistance(worldXZ: vec2f) -> f32 {
  let y = worldXZ.y;
  var centerX = 25.0;
  if (y > 6.0) {
    let t = smoothstep(0.0, 1.0, clamp((36.0 - y) / 30.0, 0.0, 1.0));
    centerX = mix(25.0, 10.0, t) + sin(t * 6.2831853) * 4.8;
  } else if (y > -31.0) {
    let t = smoothstep(0.0, 1.0, clamp((6.0 - y) / 37.0, 0.0, 1.0));
    centerX = mix(10.0, 26.0, t) - sin(t * 6.2831853) * 5.6;
  } else if (y > -45.0) {
    let t = smoothstep(0.0, 1.0, clamp((-31.0 - y) / 14.0, 0.0, 1.0));
    centerX = mix(26.0, 20.0, t) + sin(t * 3.14159265) * 3.2;
  } else {
    let t = smoothstep(0.0, 1.0, clamp((-45.0 - y) / 27.0, 0.0, 1.0));
    centerX = mix(20.0, 69.0, t) - sin(t * 6.2831853) * 6.2;
  }
  let outsideRange = max(max(y - 36.0, -72.0 - y), 0.0);
  return length(vec2f(worldXZ.x - centerX, outsideRange));
}

fn inlandLandscape(worldXZ: vec2f) -> vec3f {
  // Broadly level old earth with a few deliberate hills. Terrain becomes the
  // same flat earth before the editable limit, then stays flat throughout the
  // protected simulation margin. This avoids turning the map into a bowl and
  // gives the far-earth mesh an exact, featureless seam to meet.
  let halfWorld = uniforms.world.x * 0.5;
  let q = worldXZ / max(halfWorld, 1.0);
  let domainRadius = max(abs(q.x), abs(q.y));
  // The last editable metres settle onto a mildly raised shoulder; a protected
  // flat apron then meets the continuation mesh at exactly the same height.
  let editableShoulder = smoothstep(0.66, 0.72, domainRadius);
  let outerEarthBlend = smoothstep(0.72, 0.79, domainRadius);
  let broadEarth = gradientFbm(q * 2.35 + vec2f(7.4, -3.8));
  let rollingEarth = gradientFbm(q * 5.7 + vec2f(-11.2, 6.1));
  let fineEarth = gradientNoise2(worldXZ * 0.047 + vec2f(3.7, 19.2));

  let hillADelta = (worldXZ - vec2f(-50.0, 50.0)) / vec2f(19.0, 15.0);
  let hillBDelta = (worldXZ - vec2f(43.0, 50.0)) / vec2f(17.0, 13.0);
  let hillCDelta = (worldXZ - vec2f(-5.0, -54.0)) / vec2f(21.0, 14.0);
  let hillA = exp(-dot(hillADelta, hillADelta) * 1.9);
  let hillB = exp(-dot(hillBDelta, hillBDelta) * 2.0);
  let hillC = exp(-dot(hillCDelta, hillCDelta) * 2.05);

  let lakeADelta = (worldXZ - vec2f(-47.0, -31.0)) / vec2f(15.0, 11.0);
  let lakeBDelta = (worldXZ - vec2f(25.0, 36.0)) / vec2f(11.0, 8.5);
  let lakeCDelta = (worldXZ - vec2f(49.0, 5.0)) / vec2f(8.0, 6.0);
  let lakeA = exp(-dot(lakeADelta, lakeADelta) * 2.15);
  let lakeB = exp(-dot(lakeBDelta, lakeBDelta) * 2.2);
  let lakeC = exp(-dot(lakeCDelta, lakeCDelta) * 2.35);
  let lakeRimA = exp(-pow(length(lakeADelta) - 1.0, 2.0) * 13.0);
  let lakeRimB = exp(-pow(length(lakeBDelta) - 1.0, 2.0) * 14.0);
  let lakeRimC = exp(-pow(length(lakeCDelta) - 1.0, 2.0) * 15.0);

  let marshADelta = (worldXZ - vec2f(-58.0, 9.0)) / vec2f(12.0, 9.0);
  let marshBDelta = (worldXZ - vec2f(19.0, -53.0)) / vec2f(10.0, 8.0);
  let marshA = exp(-dot(marshADelta, marshADelta) * 2.0);
  let marshB = exp(-dot(marshBDelta, marshBDelta) * 2.05);

  // Two real terrain channels start at central basins and continue to the
  // protected earth margin. Their water is ordinary finite water until the
  // explicit edge-seep sink removes it.
  let quietRiverDistance = quietInlandRiverDistance(worldXZ);
  let strongRiverDistance = strongInlandRiverDistance(worldXZ);
  // Broad two-stage banks avoid the narrow serrated "tube" profile produced
  // when a channel is only a few simulation vertices wide.
  let riverAPath = 1.0 - smoothstep(1.15, 5.9, quietRiverDistance);
  let riverBPath = 1.0 - smoothstep(1.35, 7.2, strongRiverDistance);
  let quietRiverProgress = clamp(
    distance(worldXZ, vec2f(-47.0, -31.0)) / 66.0,
    0.0,
    1.0
  );
  let strongRiverProgress = clamp(
    distance(worldXZ, vec2f(25.0, 36.0)) / 117.0,
    0.0,
    1.0
  );
  let springADelta = (worldXZ - vec2f(-47.0, -31.0)) / vec2f(8.0, 6.2);
  let springBDelta = (worldXZ - vec2f(25.0, 36.0)) / vec2f(9.5, 7.2);
  let springBasinA = exp(-dot(springADelta, springADelta) * 2.2);
  let springBasinB = exp(-dot(springBDelta, springBDelta) * 2.0);

  let villageADelta = (worldXZ - vec2f(-39.0, 24.0)) / vec2f(18.0, 14.0);
  let villageBDelta = (worldXZ - vec2f(39.0, -17.0)) / vec2f(17.0, 13.0);
  let villageShelfA = exp(-dot(villageADelta, villageADelta) * 2.1);
  let villageShelfB = exp(-dot(villageBDelta, villageBDelta) * 2.2);

  let volcanoCenter = vec2f(2.0, 55.0);
  let volcanoLocal = worldXZ - volcanoCenter;
  let volcanoDistance = length(volcanoLocal);
  let volcanoAngle = atan2(volcanoLocal.y, volcanoLocal.x);
  let volcanoWarp = gradientNoise2(worldXZ * 0.16 + vec2f(9.0, -5.0))
    + sin(volcanoAngle * 5.0) * 0.28;
  let volcanoCone = (1.0 - smoothstep(3.4, 14.0, volcanoDistance + volcanoWarp))
    * 4.15;
  let volcanoCrater = (1.0 - smoothstep(0.0, 3.7, volcanoDistance + volcanoWarp))
    * 2.85;

  let interiorSurface = 5.9
    + broadEarth * 0.72
    + rollingEarth * 0.26
    + fineEarth * 0.1
    + hillA * 2.45
    + hillB * 1.95
    + hillC * 1.55
    + villageShelfA * 0.8
    + villageShelfB * 0.7
    + volcanoCone
    - volcanoCrater
    - lakeA * 5.7
    - lakeB * 5.25
    - lakeC * 5.45
    + lakeRimA * 0.42
    + lakeRimB * 0.38
    + lakeRimC * 0.32
    - marshA * 2.1
    - marshB * 2.25;
  let settledEarthSurface = mix(
    interiorSurface + editableShoulder * (1.0 - outerEarthBlend) * 0.24,
    6.1,
    outerEarthBlend
  );
  let baseSurface = settledEarthSurface
    - riverAPath * mix(0.58, 1.38, quietRiverProgress)
    - riverBPath * mix(0.78, 1.92, strongRiverProgress)
    - springBasinA * 0.72
    - springBasinB * 0.88;

  let rockyUpland = smoothstep(0.3, 0.68, broadEarth + rollingEarth * 0.35)
    * (1.0 - outerEarthBlend);
  let volcanoCore = 1.0 - smoothstep(6.0, 13.0, volcanoDistance);
  let foundation = baseSurface
    - mix(4.8, 2.4, rockyUpland);
  let volcanoRockTop = baseSurface
    - mix(0.12, 2.6, smoothstep(4.0, 13.0, volcanoDistance));
  let rock = mix(
    foundation,
    volcanoRockTop,
    volcanoCore
  );
  let movable = max(0.0, baseSurface - rock);
  return vec3f(rock, movable, 1.0);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let uv = vec2f(gid.xy) / f32(n - 1u);
  let worldXZ = (uv - vec2f(0.5)) * uniforms.world.x;
  let inlandMode = step(0.5, uniforms.pad1.z);
  let coastalTerrain = landscape(worldXZ);
  let inlandTerrain = inlandLandscape(worldXZ);
  let terrain = mix(coastalTerrain, inlandTerrain, inlandMode);
  let height = terrain.x + terrain.y;
  let coastalLavaDistance = distance(worldXZ, vec2f(46.0, -28.0));
  let inlandLavaDistance = distance(worldXZ, vec2f(2.0, 55.0));
  let lavaDistance = mix(coastalLavaDistance, inlandLavaDistance, inlandMode);
  let coastalSpringDistance = distance(worldXZ, vec2f(-11.0, -2.0));
  let inlandSpringDistanceA = distance(worldXZ, vec2f(-47.0, -31.0));
  let inlandSpringDistanceB = distance(worldXZ, vec2f(25.0, 36.0));
  let springDistance = mix(
    coastalSpringDistance,
    min(inlandSpringDistanceA, inlandSpringDistanceB),
    inlandMode
  );
  let coastalOilDelta = (worldXZ - vec2f(42.0, 20.0)) / vec2f(6.3, 4.7);
  let inlandOilDeltaA = (worldXZ - vec2f(-60.0, 8.0)) / vec2f(3.8);
  let inlandOilDeltaB = (worldXZ - vec2f(-53.0, 12.0)) / vec2f(2.5);
  let inlandOilDeltaC = (worldXZ - vec2f(17.0, -54.0)) / vec2f(3.2);
  let coastalLava = (1.0 - smoothstep(3.1, 6.2, coastalLavaDistance))
    * (0.92 + noise2(worldXZ * 0.21) * 0.28);
  let inlandLava = (1.0 - smoothstep(1.9, 4.0, inlandLavaDistance))
    * (0.46 + noise2(worldXZ * 0.24 + vec2f(8.0, -3.0)) * 0.16);
  let lava = mix(coastalLava, inlandLava, inlandMode);
  let coastalOil = exp(-dot(coastalOilDelta, coastalOilDelta) * 2.35)
    * (0.31 + noise2(worldXZ * 0.27 + vec2f(4.3, 8.1)) * 0.11);
  let inlandOilMask = max(
    max(
      exp(-dot(inlandOilDeltaA, inlandOilDeltaA) * 2.15),
      exp(-dot(inlandOilDeltaB, inlandOilDeltaB) * 2.2)
    ),
    exp(-dot(inlandOilDeltaC, inlandOilDeltaC) * 2.2)
  );
  let inlandOil = inlandOilMask
    * (0.18 + noise2(worldXZ * 0.22 + vec2f(-7.3, 4.1)) * 0.08);
  let oil = mix(coastalOil, inlandOil, inlandMode);
  // Connectivity is decided by the exterior island mask, but connected cells
  // receive their full depth to sea level. Multiplying the depth by a mask
  // created a sloping water curtain and a visible coastal seam.
  // Only cells that actually begin submerged belong to the inexhaustible sea
  // reservoir. The soft procedural island mask also covers dry beach cells;
  // tagging those as sea caused water to be manufactured beneath their sand
  // as soon as the player dug below sea level.
  let initialSeaDepth = uniforms.physics.w - height;
  // Initial submergence is only an initial condition. Dynamic hydraulic
  // connectivity later decides whether water remains connected to the
  // external ocean; birthplace is never retained as reservoir identity.
  let startsInInitialSea = terrain.z < 0.9995 && initialSeaDepth > 0.012;
  let exteriorWater = select(
    0.0,
    max(0.0, uniforms.physics.w - height),
    startsInInitialSea && inlandMode < 0.5
  );
  // Start with a readable shallow lake rather than a damp spot. The persistent
  // source still has room to raise it into the central channel and river.
  let coastalSpringPool = (
    1.0 - smoothstep(2.8, 9.6, springDistance)
  ) * 0.78;
  let inlandLakeADelta = (worldXZ - vec2f(-47.0, -31.0)) / vec2f(15.0, 11.0);
  let inlandLakeBDelta = (worldXZ - vec2f(25.0, 36.0)) / vec2f(11.0, 8.5);
  let inlandLakeCDelta = (worldXZ - vec2f(49.0, 5.0)) / vec2f(8.0, 6.0);
  let inlandLakeWater = max(
    (1.0 - smoothstep(0.72, 1.0, length(inlandLakeADelta)))
      * max(0.0, 1.8 - height),
    max(
      (1.0 - smoothstep(0.72, 1.0, length(inlandLakeBDelta)))
        * max(0.0, 4.2 - height),
      (1.0 - smoothstep(0.7, 1.0, length(inlandLakeCDelta)))
        * max(0.0, 0.9 - height)
    )
  );
  let inlandMarshWater = inlandOilMask * max(0.0, 4.35 - height);
  let inlandSpringPool = max(
    (1.0 - smoothstep(2.3, 7.0, inlandSpringDistanceA)) * 0.38,
    (1.0 - smoothstep(2.8, 8.4, inlandSpringDistanceB)) * 0.72
  );
  // Pre-wet both complete channels to a gently descending free surface. The
  // water remains ordinary finite water; unequal persistent springs and the
  // two bounded seep patches take over as soon as simulation begins.
  let quietRiverDistance = quietInlandRiverDistance(worldXZ);
  let strongRiverDistance = strongInlandRiverDistance(worldXZ);
  let quietRiverShape = 1.0 - smoothstep(0.9, 3.75, quietRiverDistance);
  let strongRiverShape = 1.0 - smoothstep(1.05, 4.65, strongRiverDistance);
  let quietRiverProgress = clamp(
    distance(worldXZ, vec2f(-47.0, -31.0)) / 66.0,
    0.0,
    1.0
  );
  let strongRiverProgress = clamp(
    distance(worldXZ, vec2f(25.0, 36.0)) / 117.0,
    0.0,
    1.0
  );
  // Seed a real finite ribbon by depth rather than assuming one planar free
  // surface across the whole watershed. Each river follows its sloping bed
  // immediately, then the ordinary solver establishes riffles and pools.
  let quietInitialRiver = quietRiverShape
    * mix(0.55, 0.75, quietRiverProgress);
  let strongInitialRiver = strongRiverShape
    * mix(0.75, 1.05, strongRiverProgress);
  let inlandRiverWater = max(quietInitialRiver, strongInitialRiver);
  let inlandWater = max(
    inlandLakeWater,
    max(inlandMarshWater, max(inlandSpringPool, inlandRiverWater))
  );
  var water = mix(
    max(exteriorWater, coastalSpringPool),
    inlandWater,
    inlandMode
  );
  // A crater is hot dry rock at initialization. Lakes and river masks may not
  // leave an impossible blue film in or immediately around the lava mouth.
  water = water * (1.0 - inlandMode * (1.0 - smoothstep(4.2, 7.0, inlandLavaDistance)));
  let state = vec4f(terrain.x, terrain.y, min(water, 14.0), clamp(water * 0.2, 0.0, 1.0));
  let index = gridIndex(gid.x, gid.y);

  stateA.values[index] = state;
  stateB.values[index] = state;
  waterFlux.values[index] = vec4f(0.0);
  // z stores settled-surface age for the cosmetic ripple/debris layer. w is
  // finite cosmetic openness; ocean connectivity is never stored here.
  sandFlux.values[index] = vec4f(0.0, 0.0, 1.0, 0.0);
  let initialElements = vec4f(lava, oil, 0.0, smoothstep(0.0, 0.28, lava));
  elementA.values[index] = initialElements;
  elementB.values[index] = initialElements;
  elementFlux.values[index] = vec4f(0.0);

  // Aquifers are deliberately a separate mission layer, not an implicit
  // consequence of digging beneath sea level. world.z is zero in this demo;
  // future missions can opt in without changing the surface-water model.
  let aquiferNoise = gradientFbm(worldXZ * 0.052 + vec2f(17.3, -8.6));
  let aquiferPocket = smoothstep(0.13, 0.46, aquiferNoise)
    * smoothstep(0.31, 0.72, terrain.z)
    * (1.1 + max(0.0, aquiferNoise) * 2.2);
  let missionGroundwater = select(
    0.0,
    aquiferPocket,
    uniforms.world.z > 0.5
  );
  // The spring mouth needs an immutable record of its original rock and sand
  // layers so poured sand or newly cooled lava can physically bury it. Pack
  // both 1/16 m baselines into the otherwise-unused negative range of the
  // groundwater field; ordinary aquifers remain non-negative and the hand
  // already ignores negative values.
  let springMetadata = springDistance < 2.8;
  let baselineRockUnits = floor(
    clamp(terrain.x + 32.0, 0.0, 127.9375) * 16.0 + 0.5
  );
  let baselineSandUnits = floor(
    clamp(terrain.y, 0.0, 127.9375) * 16.0 + 0.5
  );
  let packedSourceFloor = baselineRockUnits * 2048.0 + baselineSandUnits;
  groundwater.values[index] = select(
    missionGroundwater,
    -(packedSourceFloor + 1.0),
    springMetadata
  );

  let seed = hash21(vec2f(gid.xy) + vec2f(31.7, 12.9));
  let lowland = 1.0 - smoothstep(uniforms.physics.w + 10.0, uniforms.physics.w + 17.0, height);
  let dry = 1.0 - smoothstep(0.02, 0.18, water);
  let sandSuitability = smoothstep(0.28, 1.3, terrain.y);
  let elementalClearance = 1.0
    - max(smoothstep(0.015, 0.16, lava), smoothstep(0.01, 0.12, oil));
  let initialGrowth = select(
    0.0,
    (0.66 + seed * 0.32) * lowland * dry * sandSuitability * elementalClearance,
    seed > 0.32
  );
  vegetationA.values[index] = initialGrowth;
  vegetationB.values[index] = initialGrowth;
}
`,Fe=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read_write> hit: HitBuffer;
@group(0) @binding(3) var<storage, read> elements: ElementBuffer;
@group(0) @binding(4) var<storage, read> soil: SoilBuffer;

fn stateAtWorld(worldXZ: vec2f) -> vec4f {
  let uv = worldXZ / uniforms.world.x + vec2f(0.5);
  let gridP = vec2i(round(uv * f32(gridSize() - 1u)));
  let cell = clampCell(gridP);
  return state.values[gridIndex(cell.x, cell.y)];
}

fn elementsAtWorld(worldXZ: vec2f) -> vec4f {
  let uv = worldXZ / uniforms.world.x + vec2f(0.5);
  let gridP = vec2i(round(uv * f32(gridSize() - 1u)));
  let cell = clampCell(gridP);
  return elements.values[gridIndex(cell.x, cell.y)];
}

fn soilAtWorld(worldXZ: vec2f) -> SoilCell {
  let uv = worldXZ / uniforms.world.x + vec2f(0.5);
  let gridP = vec2i(round(uv * f32(gridSize() - 1u)));
  let cell = clampCell(gridP);
  return soil.values[gridIndex(cell.x, cell.y)];
}

fn stateAtCell(p: vec2i) -> vec4f {
  let cell = clampCell(p);
  return state.values[gridIndex(cell.x, cell.y)];
}

fn elementsAtCell(p: vec2i) -> vec4f {
  let cell = clampCell(p);
  return elements.values[gridIndex(cell.x, cell.y)];
}

fn stateSurfaceAtCell(p: vec2i) -> f32 {
  let value = stateAtCell(p);
  return value.x + value.y + value.z;
}

fn stableWaterDepthAtCell(p: vec2i) -> f32 {
  let center = stateAtCell(p);
  return center.z * 0.34
    + (
      stateAtCell(p + vec2i(-1, 0)).z
        + stateAtCell(p + vec2i(1, 0)).z
        + stateAtCell(p + vec2i(0, -1)).z
        + stateAtCell(p + vec2i(0, 1)).z
    ) * 0.11
    + (
      stateAtCell(p + vec2i(-1, -1)).z
        + stateAtCell(p + vec2i(1, -1)).z
        + stateAtCell(p + vec2i(-1, 1)).z
        + stateAtCell(p + vec2i(1, 1)).z
    ) * 0.04
    + (
      stateAtCell(p + vec2i(-2, 0)).z
        + stateAtCell(p + vec2i(2, 0)).z
        + stateAtCell(p + vec2i(0, -2)).z
        + stateAtCell(p + vec2i(0, 2)).z
    ) * 0.015;
}

fn stableStateSurfaceAtCell(p: vec2i) -> f32 {
  return stateSurfaceAtCell(p) * 0.34
    + (
      stateSurfaceAtCell(p + vec2i(-1, 0))
        + stateSurfaceAtCell(p + vec2i(1, 0))
        + stateSurfaceAtCell(p + vec2i(0, -1))
        + stateSurfaceAtCell(p + vec2i(0, 1))
    ) * 0.11
    + (
      stateSurfaceAtCell(p + vec2i(-1, -1))
        + stateSurfaceAtCell(p + vec2i(1, -1))
        + stateSurfaceAtCell(p + vec2i(-1, 1))
        + stateSurfaceAtCell(p + vec2i(1, 1))
    ) * 0.04
    + (
      stateSurfaceAtCell(p + vec2i(-2, 0))
        + stateSurfaceAtCell(p + vec2i(2, 0))
        + stateSurfaceAtCell(p + vec2i(0, -2))
        + stateSurfaceAtCell(p + vec2i(0, 2))
    ) * 0.015;
}

fn stableOilAtCell(p: vec2i) -> f32 {
  return elementsAtCell(p).y * 0.42
    + (
      elementsAtCell(p + vec2i(-1, 0)).y
        + elementsAtCell(p + vec2i(1, 0)).y
        + elementsAtCell(p + vec2i(0, -1)).y
        + elementsAtCell(p + vec2i(0, 1)).y
    ) * 0.105
    + (
      elementsAtCell(p + vec2i(-1, -1)).y
        + elementsAtCell(p + vec2i(1, -1)).y
        + elementsAtCell(p + vec2i(-1, 1)).y
        + elementsAtCell(p + vec2i(1, 1)).y
    ) * 0.04;
}

fn heightAtWorld(worldXZ: vec2f) -> f32 {
  let uv = worldXZ / uniforms.world.x + vec2f(0.5);
  let p = vec2i(round(uv * f32(gridSize() - 1u)));
  let value = stateAtCell(p);
  let elementValue = elementsAtCell(p);
  let filteredDepth = stableWaterDepthAtCell(p);
  let stableWaterSurface = stableStateSurfaceAtCell(p);
  // Oil needs only a physically present skin of water to float. The previous
  // 2–16 cm blend left shallow ponds in a half-land/half-water state, so the
  // interaction plane could sit visibly beneath the rendered film.
  let waterSupport = smoothstep(0.00035, 0.0015, filteredDepth);
  let landSurface = value.x + value.y + elementValue.x + elementValue.y;
  let floatingOil = mix(
    elementValue.y,
    min(stableOilAtCell(p), 0.018),
    waterSupport
  );
  // The interaction plane follows the same low-pass physical water surface as
  // the rendered mesh. Cosmetic waves never move it, so the cursor cannot
  // jitter while a calm shoreline or blast disturbance finishes settling.
  return mix(
    landSurface,
    stableWaterSurface + elementValue.x + floatingOil,
    waterSupport
  );
}

fn insideWorld(worldXZ: vec2f) -> bool {
  let halfWorld = uniforms.world.x * 0.5;
  return abs(worldXZ.x) <= halfWorld && abs(worldXZ.y) <= halfWorld;
}

@compute @workgroup_size(1)
fn main() {
  let origin = uniforms.rayOriginRadius.xyz;
  let direction = normalize(uniforms.rayDirAmount.xyz);
  var previousT = 0.0;
  var previousDifference = 100000.0;
  var found = false;
  var result = vec4f(0.0);
  var resultMaterial = vec4f(0.0);

  for (var stepIndex = 0; stepIndex < 160; stepIndex = stepIndex + 1) {
    let t = f32(stepIndex) * 1.35;
    let point = origin + direction * t;
    if (!insideWorld(point.xz)) {
      previousT = t;
      continue;
    }
    let difference = point.y - heightAtWorld(point.xz);
    if (difference <= 0.0 && previousDifference > 0.0) {
      var lowT = previousT;
      var highT = t;
      for (var refine = 0; refine < 7; refine = refine + 1) {
        let midT = (lowT + highT) * 0.5;
        let midPoint = origin + direction * midT;
        let midDifference = midPoint.y - heightAtWorld(midPoint.xz);
        if (midDifference > 0.0) {
          lowT = midT;
        } else {
          highT = midT;
        }
      }
      let finalPoint = origin + direction * ((lowT + highT) * 0.5);
      let finalHeight = heightAtWorld(finalPoint.xz);
      let finalValue = stateAtWorld(finalPoint.xz);
      let finalElements = elementsAtWorld(finalPoint.xz);
      let finalSoil = soilAtWorld(finalPoint.xz);
      let hasWater = finalValue.z >= 0.018;
      let dirtDepth = clamp(finalSoil.dirtDepth, 0.0, finalValue.y);
      let sandDepth = max(0.0, finalValue.y - dirtDepth);
      let hasMovableGround = finalValue.y >= 0.018;
      let dirtFraction = dirtDepth / max(finalValue.y, 0.0001);
      // Material IDs are shared with the hand reservoir: 0 empty/rock,
      // 1 sand, 2 dirt, 3 water, 4 lava, 5 oil.
      var materialType = 2.0;
      var selectedDepth = 0.0;
      if (!hasMovableGround) {
        materialType = 0.0;
      } else if (dirtFraction >= 0.55 && dirtDepth >= 0.018) {
        materialType = 2.0;
        selectedDepth = dirtDepth;
      } else if (sandDepth >= 0.018) {
        materialType = 1.0;
        selectedDepth = sandDepth;
      }
      if (hasWater) {
        materialType = 3.0;
        selectedDepth = finalValue.z;
      }
      if (finalElements.x >= 0.018) {
        materialType = 4.0;
        selectedDepth = finalElements.x;
      }
      // Match the opaque floating-film threshold so every visible patch can be
      // gathered directly from its water-surface position.
      if (finalElements.y >= 0.00075) {
        materialType = 5.0;
        selectedDepth = finalElements.y;
      }
      result = vec4f(finalPoint.x, finalPoint.z, finalHeight, 1.0);
      resultMaterial = vec4f(
        materialType,
        finalValue.y,
        selectedDepth,
        finalElements.z
      );
      found = true;
      break;
    }
    previousDifference = difference;
    previousT = t;
  }

  if (!found) {
    result = vec4f(0.0);
  }
  hit.value = result;
  hit.material = resultMaterial;
}
`,Ie=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read_write> state: StateBuffer;
@group(0) @binding(2) var<storage, read_write> reservoir: ReservoirBuffer;
@group(0) @binding(3) var<storage, read> hit: HitBuffer;
@group(0) @binding(4) var<storage, read_write> groundwater: ScalarBuffer;
@group(0) @binding(5) var<storage, read_write> elements: ElementBuffer;
@group(0) @binding(6) var<storage, read_write> soil: SoilBuffer;

fn ensureMaterialLock(material: i32) -> bool {
  var current = atomicLoad(&reservoir.materialLock);
  loop {
    if (current == material) {
      return true;
    }
    if (current != 0) {
      return false;
    }
    let attempt = atomicCompareExchangeWeak(
      &reservoir.materialLock,
      0,
      material
    );
    if (attempt.exchanged) {
      return true;
    }
    current = attempt.old_value;
  }
}

fn claimSand(requested: i32) -> i32 {
  var available = atomicLoad(&reservoir.sand);
  loop {
    if (available <= 0) {
      return 0;
    }
    let taken = min(available, requested);
    let attempt = atomicCompareExchangeWeak(
      &reservoir.sand,
      available,
      available - taken
    );
    if (attempt.exchanged) {
      return taken;
    }
    available = attempt.old_value;
  }
}

fn claimDirt(requested: i32) -> i32 {
  var available = atomicLoad(&reservoir.dirt);
  loop {
    if (available <= 0) {
      return 0;
    }
    let taken = min(available, requested);
    let attempt = atomicCompareExchangeWeak(
      &reservoir.dirt,
      available,
      available - taken
    );
    if (attempt.exchanged) {
      return taken;
    }
    available = attempt.old_value;
  }
}

fn claimWater(requested: i32) -> i32 {
  var available = atomicLoad(&reservoir.water);
  loop {
    if (available <= 0) {
      return 0;
    }
    let taken = min(available, requested);
    let attempt = atomicCompareExchangeWeak(
      &reservoir.water,
      available,
      available - taken
    );
    if (attempt.exchanged) {
      return taken;
    }
    available = attempt.old_value;
  }
}

fn claimLava(requested: i32) -> i32 {
  var available = atomicLoad(&reservoir.lava);
  loop {
    if (available <= 0) {
      return 0;
    }
    let taken = min(available, requested);
    let attempt = atomicCompareExchangeWeak(
      &reservoir.lava,
      available,
      available - taken
    );
    if (attempt.exchanged) {
      return taken;
    }
    available = attempt.old_value;
  }
}

fn claimOil(requested: i32) -> i32 {
  var available = atomicLoad(&reservoir.oil);
  loop {
    if (available <= 0) {
      return 0;
    }
    let taken = min(available, requested);
    let attempt = atomicCompareExchangeWeak(
      &reservoir.oil,
      available,
      available - taken
    );
    if (attempt.exchanged) {
      return taken;
    }
    available = attempt.old_value;
  }
}

fn insideManipulationArea(worldXZ: vec2f) -> bool {
  let limit = uniforms.world.x * 0.5 - max(0.0, uniforms.world.w);
  return abs(worldXZ.x) <= limit && abs(worldXZ.y) <= limit;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n || uniforms.brush.z < 0.5 || hit.value.w < 0.5) {
    return;
  }

  let uv = vec2f(gid.xy) / f32(n - 1u);
  let worldXZ = (uv - vec2f(0.5)) * uniforms.world.x;
  if (!insideManipulationArea(hit.value.xy) || !insideManipulationArea(worldXZ)) {
    return;
  }
  let distanceToBrush = distance(worldXZ, hit.value.xy);
  let radius = uniforms.rayOriginRadius.w;
  if (distanceToBrush >= radius) {
    return;
  }

  let normalizedRadius = distanceToBrush / radius;
  let smoothWeight = 1.0 - smoothstep(0.0, 1.0, normalizedRadius);
  let staticGrain = hash21(vec2f(gid.xy) * 0.73 + vec2f(17.2, 4.9));
  let movingGrain = noise2(
    worldXZ * 0.58 + vec2f(uniforms.grid.w * 2.7, -uniforms.grid.w * 1.9)
  );
  let irregularity = mix(0.76, 1.18, staticGrain) * mix(0.9, 1.1, movingGrain);
  let granularWeight = pow(smoothWeight, 1.55) * irregularity;
  // Cohesive dirt uses one static irregular radial footprint. It must not
  // acquire a new cell mask from movingGrain every rendered frame.
  let stableDirtWeight = pow(smoothWeight, 1.45)
    * mix(0.86, 1.14, staticGrain);
  // Liquids must not receive a different cell-scale footprint every rendered
  // frame. That moving grain was appropriate for sand, but it continuously
  // injected high-frequency pits and mounds into water before the 30 Hz solver
  // could respond. Keep only a faint static asymmetry around a smooth radial
  // brush for water, lava, and oil.
  let fluidWeight = pow(smoothWeight, 1.35) * mix(0.94, 1.06, staticGrain);
  let granularRequestedDepth = uniforms.rayDirAmount.w * granularWeight;
  let dirtRequestedDepth = uniforms.rayDirAmount.w * stableDirtWeight;
  let fluidRequestedDepth = uniforms.rayDirAmount.w * fluidWeight;
  let quantization = uniforms.world.y;
  let index = gridIndex(gid.x, gid.y);
  var value = state.values[index];
  var elementValue = elements.values[index];
  var soilValue = soil.values[index];
  let action = uniforms.brush.x;

  if (action < -0.5) {
    if (hit.material.x < 0.5) {
      // Immutable rock/empty ground cannot be gathered.
    } else if (hit.material.x < 1.5) {
      if (ensureMaterialLock(1)) {
        let sandDepth = max(0.0, value.y - soilValue.dirtDepth);
        let availableDepth = min(sandDepth, granularRequestedDepth);
        let units = max(0, i32(floor(availableDepth * quantization)));
        let actualDepth = f32(units) / quantization;
        value.y = max(0.0, value.y - actualDepth);
        atomicAdd(&reservoir.sand, units);
        // Optional mission aquifers seep only after their overlying sand is
        // nearly gone. With the default zeroed field this branch is inert.
        let storedGroundwater = groundwater.values[index];
        if (value.y < 0.055 && storedGroundwater > 0.0) {
          let released = min(storedGroundwater, granularRequestedDepth * 0.16);
          groundwater.values[index] = storedGroundwater - released;
          value.z = value.z + released;
        }
      }
    } else if (hit.material.x < 2.5) {
      if (ensureMaterialLock(2)) {
        let availableDepth = min(soilValue.dirtDepth, dirtRequestedDepth);
        let units = max(0, i32(floor(availableDepth * quantization)));
        let actualDepth = f32(units) / quantization;
        value.y = max(0.0, value.y - actualDepth);
        soilValue.dirtDepth = max(0.0, soilValue.dirtDepth - actualDepth);
        // Excavation tears through the rooted top layer immediately. Leaving
        // the old compaction nearly intact kept the grass tint and dirt
        // cohesion on freshly dug faces, making soil behave like painted sand.
        if (actualDepth > 0.0) {
          soilValue.compaction = min(
            0.1,
            max(0.0, soilValue.compaction - actualDepth * 0.5)
          );
        }
        atomicAdd(&reservoir.dirt, units);
      }
    } else if (hit.material.x < 3.5) {
      if (ensureMaterialLock(3)) {
        let availableDepth = min(value.z, fluidRequestedDepth);
        let units = max(0, i32(floor(availableDepth * quantization)));
        let actualDepth = f32(units) / quantization;
        value.z = max(0.0, value.z - actualDepth);
        atomicAdd(&reservoir.water, units);
      }
    } else if (hit.material.x < 4.5) {
      if (ensureMaterialLock(4)) {
        let availableDepth = min(elementValue.x, fluidRequestedDepth);
        let units = max(0, i32(floor(availableDepth * quantization)));
        let actualDepth = f32(units) / quantization;
        elementValue.x = max(0.0, elementValue.x - actualDepth);
        atomicAdd(&reservoir.lava, units);
      }
    } else if (hit.material.x >= 4.5) {
      if (ensureMaterialLock(5)) {
        let availableDepth = min(elementValue.y, fluidRequestedDepth);
        let units = max(0, i32(floor(availableDepth * quantization)));
        let actualDepth = f32(units) / quantization;
        elementValue.y = max(0.0, elementValue.y - actualDepth);
        atomicAdd(&reservoir.oil, units);
      }
    }
  } else if (action > 0.5) {
    let material = atomicLoad(&reservoir.materialLock);
    // Dense, viscous lava leaves the hand deliberately rather than producing
    // a full brush-width lake from a single tap. Holding RMB still pours
    // continuously; the two-button dump remains the explicit all-at-once path.
    let pourRate = select(1.0, 0.24, material == 4);
    let granularPourDepth = select(
      granularRequestedDepth,
      dirtRequestedDepth,
      material == 2
    );
    let requestedDepth = select(
      fluidRequestedDepth,
      granularPourDepth,
      material == 1 || material == 2
    );
    let requestedUnits = max(
      0,
      i32(floor(requestedDepth * pourRate * quantization))
    );
    if (material >= 1 && material <= 5) {
      var granted = 0;
      if (material == 1) {
        granted = claimSand(requestedUnits);
      } else if (material == 2) {
        granted = claimDirt(requestedUnits);
      } else if (material == 3) {
        granted = claimWater(requestedUnits);
      } else if (material == 4) {
        granted = claimLava(requestedUnits);
      } else {
        granted = claimOil(requestedUnits);
      }
      let grantedDepth = f32(granted) / quantization;
      if (material == 1) {
        value.y = value.y + grantedDepth;
        elementValue.z = max(0.0, elementValue.z - grantedDepth * 3.8);
        elementValue.w = max(0.0, elementValue.w - grantedDepth * 0.7);
        if (atomicLoad(&reservoir.sand) <= 0) {
          _ = atomicCompareExchangeWeak(&reservoir.materialLock, 1, 0);
        }
      } else if (material == 2) {
        value.y = value.y + grantedDepth;
        soilValue.dirtDepth = min(value.y, soilValue.dirtDepth + grantedDepth);
        soilValue.compaction = mix(
          soilValue.compaction,
          0.015,
          clamp(grantedDepth * 2.8, 0.0, 1.0)
        );
        if (grantedDepth > 0.0) {
          soilValue.compaction = min(soilValue.compaction, 0.015);
        }
        elementValue.z = max(0.0, elementValue.z - grantedDepth * 3.2);
        elementValue.w = max(0.0, elementValue.w - grantedDepth * 0.55);
        if (atomicLoad(&reservoir.dirt) <= 0) {
          _ = atomicCompareExchangeWeak(&reservoir.materialLock, 2, 0);
        }
      } else if (material == 3) {
        value.z = value.z + grantedDepth;
        elementValue.z = max(0.0, elementValue.z - grantedDepth * 5.2);
        elementValue.w = max(0.0, elementValue.w - grantedDepth * 1.35);
        if (atomicLoad(&reservoir.water) <= 0) {
          _ = atomicCompareExchangeWeak(&reservoir.materialLock, 3, 0);
        }
      } else if (material == 4) {
        elementValue.x = elementValue.x + grantedDepth;
        elementValue.w = max(elementValue.w, smoothstep(0.0, 0.18, grantedDepth));
        if (atomicLoad(&reservoir.lava) <= 0) {
          _ = atomicCompareExchangeWeak(&reservoir.materialLock, 4, 0);
        }
      } else {
        elementValue.y = elementValue.y + grantedDepth;
        if (atomicLoad(&reservoir.oil) <= 0) {
          _ = atomicCompareExchangeWeak(&reservoir.materialLock, 5, 0);
        }
      }
    }
  }

  state.values[index] = value;
  elements.values[index] = elementValue;
  soil.values[index] = soilValue;
}
`,Le=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read_write> state: StateBuffer;
@group(0) @binding(2) var<storage, read_write> reservoir: ReservoirBuffer;
@group(0) @binding(3) var<storage, read> hit: HitBuffer;
@group(0) @binding(4) var<storage, read_write> elements: ElementBuffer;
@group(0) @binding(5) var<storage, read_write> soil: SoilBuffer;

var<workgroup> dumpedMaterial: i32;
var<workgroup> dumpedUnits: i32;
var<workgroup> portions: array<i32, 225>;

fn distributionWeight(index: u32) -> i32 {
  let x = i32(index % 15u) - 7;
  let y = i32(index / 15u) - 7;
  let radialDistance = length(vec2f(f32(x), f32(y)));
  return max(0, i32(floor(8.15 - radialDistance)));
}

@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) localIndex: u32) {
  // Every invocation observes the same ray hit, so this uniform early return
  // cannot strand another invocation at a workgroup barrier.
  if (hit.value.w < 0.5) {
    return;
  }
  let manipulationLimit = uniforms.world.x * 0.5 - max(0.0, uniforms.world.w);
  if (
    abs(hit.value.x) > manipulationLimit
    || abs(hit.value.y) > manipulationLimit
  ) {
    return;
  }

  if (localIndex == 0u) {
    let material = atomicLoad(&reservoir.materialLock);
    dumpedMaterial = material;
    dumpedUnits = 0;
    if (material == 1) {
      dumpedUnits = atomicExchange(&reservoir.sand, 0);
    } else if (material == 2) {
      dumpedUnits = atomicExchange(&reservoir.dirt, 0);
    } else if (material == 3) {
      dumpedUnits = atomicExchange(&reservoir.water, 0);
    } else if (material == 4) {
      dumpedUnits = atomicExchange(&reservoir.lava, 0);
    } else if (material == 5) {
      dumpedUnits = atomicExchange(&reservoir.oil, 0);
    }

    var totalWeight = 0;
    for (var index = 0u; index < 225u; index = index + 1u) {
      totalWeight = totalWeight + distributionWeight(index);
    }
    var assigned = 0;
    for (var index = 0u; index < 225u; index = index + 1u) {
      let portion = i32(
        floor(
          f32(max(0, dumpedUnits))
            * f32(distributionWeight(index))
            / f32(totalWeight)
        )
      );
      portions[index] = portion;
      assigned = assigned + portion;
    }
    // Integer apportionment residue belongs at the highest-weight cell, not a
    // corner, keeping even tiny dumps visually centered and circular.
    portions[112] = portions[112] + max(0, dumpedUnits - assigned);

    if (material >= 1 && material <= 5) {
      atomicStore(&reservoir.materialLock, 0);
    }
  }
  workgroupBarrier();

  if (
    localIndex >= 225u
    || dumpedUnits <= 0
    || dumpedMaterial < 1
    || dumpedMaterial > 5
  ) {
    return;
  }

  let n = i32(gridSize());
  let hitUv = hit.value.xy / uniforms.world.x + vec2f(0.5);
  let center = vec2i(round(hitUv * f32(n - 1)));
  // Shift, rather than clamp, the whole 15x15 stamp near an edge. This keeps
  // one invocation per destination cell and avoids storage-buffer data races.
  let marginCells = max(
    0,
    i32(ceil(max(0.0, uniforms.world.w) / max(uniforms.grid.y, 0.0001)))
  );
  let protectedLow = marginCells;
  let protectedHigh = n - 1 - marginCells;
  let stampOrigin = clamp(
    center - vec2i(7),
    vec2i(protectedLow),
    vec2i(max(protectedLow, protectedHigh - 14))
  );
  let cell = stampOrigin + vec2i(
    i32(localIndex % 15u),
    i32(localIndex / 15u)
  );
  let index = gridIndex(u32(cell.x), u32(cell.y));
  var value = state.values[index];
  var elementValue = elements.values[index];
  var soilValue = soil.values[index];
  let depth = f32(portions[localIndex]) / uniforms.world.y;
  if (dumpedMaterial == 1) {
    value.y = value.y + depth;
    elementValue.z = max(0.0, elementValue.z - depth * 3.8);
    elementValue.w = max(0.0, elementValue.w - depth * 0.7);
  } else if (dumpedMaterial == 2) {
    value.y = value.y + depth;
    soilValue.dirtDepth = min(value.y, soilValue.dirtDepth + depth);
    soilValue.compaction = mix(
      soilValue.compaction,
      0.01,
      clamp(depth * 2.4, 0.0, 1.0)
    );
    if (depth > 0.0) {
      soilValue.compaction = min(soilValue.compaction, 0.01);
    }
    elementValue.z = max(0.0, elementValue.z - depth * 3.2);
    elementValue.w = max(0.0, elementValue.w - depth * 0.55);
  } else if (dumpedMaterial == 3) {
    value.z = value.z + depth;
    elementValue.z = max(0.0, elementValue.z - depth * 5.2);
    elementValue.w = max(0.0, elementValue.w - depth * 1.35);
  } else if (dumpedMaterial == 4) {
    elementValue.x = elementValue.x + depth;
    elementValue.w = max(elementValue.w, smoothstep(0.0, 0.18, depth));
  } else {
    elementValue.y = elementValue.y + depth;
  }
  state.values[index] = value;
  elements.values[index] = elementValue;
  soil.values[index] = soilValue;
}
`,Re=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct WaterConnectivityBuffer {
  // x hydraulic-connected, y broad-ocean-connected,
  // z hydraulically passable, w broad-width passable
  values: array<vec4u>,
}

@group(0) @binding(2) var<storage, read_write> connectivityOut: WaterConnectivityBuffer;
@group(0) @binding(3) var<storage, read_write> wallEdges: WallEdgeBuffer;

fn insideTopologyCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

fn overflowHeadPassable(p: vec2i) -> bool {
  let cell = vec2u(p);
  let value = state.values[gridIndex(cell.x, cell.y)];
  let terrain = value.x + value.y;
  let hydraulicHead = terrain + value.z;
  // A wet path remains connected at low depth. A newly excavated dry path can
  // also become connected when the verified sea-level overflow head reaches it.
  let wetPassage = value.z > 0.0007 && hydraulicHead > terrain + 0.0005;
  let overflowPassage = terrain < uniforms.physics.w + 0.012;
  return wetPassage || overflowPassage;
}

fn broadWidthPassable(p: vec2i, n: i32) -> bool {
  if (!overflowHeadPassable(p)) {
    return false;
  }

  // Requiring a seven-cell cross plus diagonal shoulders prevents a narrow
  // river or breach from becoming a virtual ocean boundary. It can still carry
  // ordinary hydraulic connectivity through x.
  for (var radius = 1; radius <= 3; radius = radius + 1) {
    let r = i32(radius);
    let offsets = array<vec2i, 8>(
      vec2i(r, 0), vec2i(-r, 0), vec2i(0, r), vec2i(0, -r),
      vec2i(r, r), vec2i(-r, r), vec2i(r, -r), vec2i(-r, -r)
    );
    for (var direction = 0u; direction < 8u; direction = direction + 1u) {
      let samplePosition = p + offsets[direction];
      if (!insideTopologyCell(samplePosition, n)) {
        continue;
      }
      let sampleCell = vec2u(samplePosition);
      let sampleValue = state.values[gridIndex(sampleCell.x, sampleCell.y)];
      let sampleTerrain = sampleValue.x + sampleValue.y;
      let safelyBelowSea = sampleTerrain < uniforms.physics.w - 0.018;
      let alreadyDeepWater = sampleValue.z > 0.075;
      if (!(safelyBelowSea || alreadyDeepWater)) {
        return false;
      }
    }
  }
  return true;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let position = vec2i(gid.xy);
  let ni = i32(n);
  let passable = overflowHeadPassable(position);
  let broadPassable = passable && broadWidthPassable(position, ni);
  let domainEdge = gid.x == 0u || gid.y == 0u || gid.x + 1u == n || gid.y + 1u == n;
  var openDomainEdge = true;
  let openCrest = uniforms.physics.w + 0.012;
  if (gid.y == 0u) {
    openDomainEdge = openDomainEdge && decodeWallCrest(
      encodedWallEdge(&wallEdges, position, vec2i(0, -1))
    ) <= openCrest;
  }
  if (gid.x + 1u == n) {
    openDomainEdge = openDomainEdge && decodeWallCrest(
      encodedWallEdge(&wallEdges, position, vec2i(1, 0))
    ) <= openCrest;
  }
  if (gid.y + 1u == n) {
    openDomainEdge = openDomainEdge && decodeWallCrest(
      encodedWallEdge(&wallEdges, position, vec2i(0, 1))
    ) <= openCrest;
  }
  if (gid.x == 0u) {
    openDomainEdge = openDomainEdge && decodeWallCrest(
      encodedWallEdge(&wallEdges, position, vec2i(-1, 0))
    ) <= openCrest;
  }
  // Inland edges are earth drains, never ocean reservoir seeds.
  let edgeSeed = domainEdge && openDomainEdge && uniforms.pad1.z < 0.5;
  connectivityOut.values[gridIndex(gid.x, gid.y)] = vec4u(
    select(0u, 1u, edgeSeed && passable),
    select(0u, 1u, edgeSeed && broadPassable),
    select(0u, 1u, passable),
    select(0u, 1u, broadPassable)
  );
}
`,ze=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;

struct WaterConnectivityBuffer {
  // x hydraulic-connected, y broad-ocean-connected,
  // z hydraulically passable, w broad-width passable
  values: array<vec4u>,
}
struct WaterTopologyConvergenceBuffer {
  changed: atomic<u32>,
  pad0: u32,
  pad1: u32,
  pad2: u32,
}
@group(0) @binding(1) var<storage, read> connectivityIn: WaterConnectivityBuffer;
@group(0) @binding(2) var<storage, read_write> connectivityOut: WaterConnectivityBuffer;
@group(0) @binding(3) var<storage, read_write> convergence: WaterTopologyConvergenceBuffer;
@group(0) @binding(4) var<storage, read> state: StateBuffer;
@group(0) @binding(5) var<storage, read_write> wallEdges: WallEdgeBuffer;

fn insideTopologyCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let index = gridIndex(gid.x, gid.y);
  let flags = connectivityIn.values[index];
  var hydraulicConnected = flags.x != 0u;
  var broadOceanConnected = flags.y != 0u;
  let position = vec2i(gid.xy);
  let ni = i32(n);
  let cardinal = array<vec2i, 4>(
    vec2i(1, 0), vec2i(-1, 0), vec2i(0, 1), vec2i(0, -1)
  );

  for (var direction = 0u; direction < 4u; direction = direction + 1u) {
    let neighbor = position + cardinal[direction];
    if (!insideTopologyCell(neighbor, ni)) {
      continue;
    }
    let neighborCell = vec2u(neighbor);
    let neighborFlags = connectivityIn.values[gridIndex(neighborCell.x, neighborCell.y)];
    let neighborIndex = gridIndex(neighborCell.x, neighborCell.y);
    let sourceSurface = surfaceAt(&state, position);
    let neighborSurface = surfaceAt(&state, neighbor);
    let edgeCrest = wallCrestBetween(&wallEdges, position, neighbor);
    // Overtopping admits ordinary finite water connectivity. Broad ocean
    // infinity crosses only a genuinely low/breached edge; a narrow overtopped
    // seawall therefore cannot turn its protected basin into a reservoir.
    let hydraulicEdgeOpen = max(sourceSurface, neighborSurface)
      > edgeCrest + 0.0007;
    let broadOceanEdgeOpen = edgeCrest <= uniforms.physics.w + 0.012;
    hydraulicConnected = hydraulicConnected || (
      flags.z != 0u && neighborFlags.x != 0u && hydraulicEdgeOpen
    );
    broadOceanConnected = broadOceanConnected
      || (
        flags.w != 0u
        && neighborFlags.y != 0u
        && broadOceanEdgeOpen
      );
  }

  // The CPU scheduler publishes a label only after bounded confirmation ticks,
  // with separate connect/disconnect hysteresis. A transient one-pass label is
  // therefore never enough to turn an inland component into an infinite source.
  let nextFlags = vec4u(
    select(0u, 1u, hydraulicConnected),
    select(0u, 1u, broadOceanConnected),
    flags.z,
    flags.w
  );
  if (nextFlags.x != flags.x || nextFlags.y != flags.y) {
    atomicStore(&convergence.changed, 1u);
  }
  connectivityOut.values[index] = nextFlags;
}
`,Be=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> waterFlux: StateBuffer;

struct WaterConnectivityBuffer {
  values: array<vec4u>,
}
struct WaterTileMetric {
  // primary: total depth, maximum depth, maximum flux, maximum surface residual
  primary: vec4f,
  // secondary: hydraulic cells, broad-ocean cells, wet cells, activity score
  secondary: vec4f,
}
struct WaterTileMetricsBuffer {
  values: array<WaterTileMetric>,
}
@group(0) @binding(3) var<storage, read> stableConnectivity: WaterConnectivityBuffer;
@group(0) @binding(4) var<storage, read_write> metrics: WaterTileMetricsBuffer;
@group(0) @binding(5) var<storage, read> soil: SoilBuffer;
@group(0) @binding(6) var<storage, read> erosionMemory: ScalarBuffer;

const WATER_TILE_SIZE: u32 = 8u;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  let tileCount = (n + WATER_TILE_SIZE - 1u) / WATER_TILE_SIZE;
  let tileIndex = gid.x;
  if (tileIndex >= tileCount * tileCount) {
    return;
  }

  let tile = vec2u(tileIndex % tileCount, tileIndex / tileCount);
  let origin = tile * WATER_TILE_SIZE;
  var totalDepth = 0.0;
  var maximumDepth = 0.0;
  var maximumFlux = 0.0;
  var maximumSurfaceResidual = 0.0;
  var hydraulicCells = 0.0;
  var broadOceanCells = 0.0;
  var wetCells = 0.0;
  var totalSuspendedSediment = 0.0;
  var maximumErosionMemory = 0.0;
  var maximumLooseDirtRelief = 0.0;

  for (var oy = 0u; oy < WATER_TILE_SIZE; oy = oy + 1u) {
    for (var ox = 0u; ox < WATER_TILE_SIZE; ox = ox + 1u) {
      let cell = origin + vec2u(ox, oy);
      if (cell.x >= n || cell.y >= n) {
        continue;
      }
      let index = gridIndex(cell.x, cell.y);
      let value = state.values[index];
      let surface = value.x + value.y + value.z;
      let localFlux = max(waterFlux.values[index].x, length(waterFlux.values[index].zw));
      let soilValue = soil.values[index];
      let suspendedLoad = max(0.0, soilValue.suspendedSand)
        + max(0.0, soilValue.suspendedDirt);
      totalSuspendedSediment = min(
        1.0,
        totalSuspendedSediment + suspendedLoad
      );
      maximumErosionMemory = max(
        maximumErosionMemory,
        max(0.0, erosionMemory.values[index])
      );
      totalDepth = totalDepth + value.z;
      maximumDepth = max(maximumDepth, value.z);
      maximumFlux = max(maximumFlux, localFlux);
      wetCells = wetCells + select(0.0, 1.0, value.z > 0.0007);
      let connectivity = stableConnectivity.values[index];
      hydraulicCells = hydraulicCells + select(0.0, 1.0, connectivity.x != 0u);
      broadOceanCells = broadOceanCells + select(0.0, 1.0, connectivity.y != 0u);

      if (cell.x + 1u < n) {
        let eastValue = state.values[gridIndex(cell.x + 1u, cell.y)];
        let eastSurface = eastValue.x + eastValue.y + eastValue.z;
        let eastTerrain = eastValue.x + eastValue.y;
        let looseDirt = smoothstep(0.0, 0.48, 1.0 - soilValue.compaction)
          * smoothstep(0.02, 0.4, soilValue.dirtDepth);
        maximumLooseDirtRelief = max(
          maximumLooseDirtRelief,
          abs((value.x + value.y) - eastTerrain) * looseDirt
        );
        if (value.z > 0.0007 && eastValue.z > 0.0007) {
          maximumSurfaceResidual = max(maximumSurfaceResidual, abs(surface - eastSurface));
        }
      }
      if (cell.y + 1u < n) {
        let southValue = state.values[gridIndex(cell.x, cell.y + 1u)];
        let southSurface = southValue.x + southValue.y + southValue.z;
        let southTerrain = southValue.x + southValue.y;
        let looseDirt = smoothstep(0.0, 0.48, 1.0 - soilValue.compaction)
          * smoothstep(0.02, 0.4, soilValue.dirtDepth);
        maximumLooseDirtRelief = max(
          maximumLooseDirtRelief,
          abs((value.x + value.y) - southTerrain) * looseDirt
        );
        if (value.z > 0.0007 && southValue.z > 0.0007) {
          maximumSurfaceResidual = max(maximumSurfaceResidual, abs(surface - southSurface));
        }
      }
    }
  }

  let soilActivity = smoothstep(0.00001, 0.0005, totalSuspendedSediment) * 0.01
    + smoothstep(0.00018, 0.003, maximumErosionMemory) * 0.01
    + smoothstep(0.55, 1.6, maximumLooseDirtRelief) * 0.018;
  let activityScore = maximumFlux * 8.0
    + maximumSurfaceResidual * 0.65
    + soilActivity;
  metrics.values[tileIndex] = WaterTileMetric(
    vec4f(totalDepth, maximumDepth, maximumFlux, maximumSurfaceResidual),
    vec4f(hydraulicCells, broadOceanCells, wetCells, activityScore)
  );
}
`,Ve=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;

struct WaterTileMetric {
  primary: vec4f,
  secondary: vec4f,
}
struct WaterTileMetricsBuffer {
  values: array<WaterTileMetric>,
}
struct WaterTileStateBuffer {
  // x runtime state: 0 sleeping finite, 1 active, 2 sleeping ocean exterior
  // y calm confirmation ticks, z confirmed broad-ocean membership,
  // w precomputed active-core-or-halo bit consumed by hot solver shaders
  values: array<vec4u>,
}
struct WaterWorkBuffer {
  // Four vec4u records keep all queue cursors and bounded-work accounting.
  values: array<vec4u>,
}
struct WaterDiagnosticsBuffer {
  values: array<atomic<u32>>,
}
@group(0) @binding(1) var<storage, read> metrics: WaterTileMetricsBuffer;
@group(0) @binding(2) var<storage, read> tileStateIn: WaterTileStateBuffer;
@group(0) @binding(3) var<storage, read_write> tileStateOut: WaterTileStateBuffer;
@group(0) @binding(4) var<storage, read_write> work: WaterWorkBuffer;
@group(0) @binding(5) var<storage, read_write> diagnostics: WaterDiagnosticsBuffer;
@group(0) @binding(6) var<storage, read> hit: HitBuffer;

const WATER_TILE_SIZE: u32 = 8u;
const MAX_WATER_WAKE_QUEUE_PER_FRAME: u32 = 96u;
const MAX_NEW_WATER_TILES_PER_FRAME: u32 = 12u;
const WATER_SLEEP_CONFIRMATION_TICKS: u32 = 72u;

fn tileIndexAt(tile: vec2u, tileCount: u32) -> u32 {
  return tile.y * tileCount + tile.x;
}

fn hasActiveNeighbor(tileIndex: u32, tileCount: u32) -> bool {
  let tile = vec2i(i32(tileIndex % tileCount), i32(tileIndex / tileCount));
  let neighbors = array<vec2i, 8>(
    vec2i(1, 0), vec2i(-1, 0), vec2i(0, 1), vec2i(0, -1),
    vec2i(1, 1), vec2i(-1, 1), vec2i(1, -1), vec2i(-1, -1)
  );
  for (var direction = 0u; direction < 8u; direction = direction + 1u) {
    let neighbor = tile + neighbors[direction];
    if (
      neighbor.x >= 0 && neighbor.y >= 0
      && neighbor.x < i32(tileCount) && neighbor.y < i32(tileCount)
    ) {
      let neighborIndex = tileIndexAt(vec2u(neighbor), tileCount);
      if (tileStateIn.values[neighborIndex].x == 1u) {
        return true;
      }
    }
  }
  return false;
}

fn hasActiveOutputNeighbor(tileIndex: u32, tileCount: u32) -> bool {
  let tile = vec2i(i32(tileIndex % tileCount), i32(tileIndex / tileCount));
  let neighbors = array<vec2i, 8>(
    vec2i(1, 0), vec2i(-1, 0), vec2i(0, 1), vec2i(0, -1),
    vec2i(1, 1), vec2i(-1, 1), vec2i(1, -1), vec2i(-1, -1)
  );
  for (var direction = 0u; direction < 8u; direction = direction + 1u) {
    let neighbor = tile + neighbors[direction];
    if (
      neighbor.x >= 0 && neighbor.y >= 0
      && neighbor.x < i32(tileCount) && neighbor.y < i32(tileCount)
    ) {
      let neighborIndex = tileIndexAt(vec2u(neighbor), tileCount);
      if (tileStateOut.values[neighborIndex].x == 1u) {
        return true;
      }
    }
  }
  return false;
}

fn isWakeCandidate(
  tileIndex: u32,
  tileCount: u32,
  interactionCenter: vec2i,
  interactionActive: bool
) -> bool {
  let current = tileStateOut.values[tileIndex];
  if (current.x == 1u) {
    return false;
  }
  let metric = metrics.values[tileIndex];
  let tile = vec2i(i32(tileIndex % tileCount), i32(tileIndex / tileCount));
  let interactionPriority = interactionActive
    && all(abs(tile - interactionCenter) <= vec2i(1));
  let broadOcean = metric.secondary.y > 0.5;
  let soilActive = metric.secondary.w > 0.0008;
  let movingWater = metric.primary.z > 0.000025
    || (metric.primary.w > 0.004 && metric.primary.y > 0.001)
    || soilActive;
  let activeFront = hasActiveNeighbor(tileIndex, tileCount) && movingWater;

  let tileCellCenter = (vec2f(tile) + vec2f(0.5)) * f32(WATER_TILE_SIZE);
  let uv = tileCellCenter / max(f32(gridSize() - 1u), 1.0);
  let worldXZ = (uv - vec2f(0.5)) * uniforms.world.x;
  let coastalSpring = distance(worldXZ, vec2f(-11.0, -2.0));
  let inlandSpring = min(
    distance(worldXZ, vec2f(-47.0, -31.0)),
    distance(worldXZ, vec2f(25.0, 36.0))
  );
  let springDistance = mix(
    coastalSpring,
    inlandSpring,
    step(0.5, uniforms.pad1.z)
  );
  let exposedSpring = uniforms.pad1.y > 0.0
    && uniforms.pad1.x < 0.5
    && springDistance < uniforms.grid.y * 8.0;
  // Broad ocean tiles wake only around an explicit interaction. Propagating
  // energy/neighbor wakes through them would eventually schedule the whole sea.
  return interactionPriority
    || (!broadOcean && (movingWater || activeFront || exposedSpring));
}

fn quantizeDiagnostic(value: f32, scale: f32) -> u32 {
  return u32(clamp(round(max(0.0, value) * scale), 0.0, 4294967040.0));
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  if (gid.x != 0u || gid.y != 0u) {
    return;
  }

  // A single scheduler invocation makes reset/order deterministic without a
  // device-wide barrier. The queue itself still has an explicit hard budget.
  atomicStore(&diagnostics.values[0], 0u);
  atomicStore(&diagnostics.values[1], 0u);
  atomicStore(&diagnostics.values[2], 0u);
  atomicStore(&diagnostics.values[3], 0u);
  atomicStore(&diagnostics.values[4], 0u);
  atomicStore(&diagnostics.values[5], 0u);
  atomicStore(&diagnostics.values[6], 0u);
  atomicStore(&diagnostics.values[7], 0u);
  atomicStore(&diagnostics.values[8], 0u);
  atomicStore(&diagnostics.values[9], 0u);
  atomicStore(&diagnostics.values[10], 0u);
  atomicStore(&diagnostics.values[11], 0u);
  atomicStore(&diagnostics.values[12], 0u);

  let n = gridSize();
  let tileCount = (n + WATER_TILE_SIZE - 1u) / WATER_TILE_SIZE;
  let tileTotal = tileCount * tileCount;
  let interactionActive = uniforms.brush.z >= 0.5 && hit.value.w >= 0.5;
  let hitUv = hit.value.xy / uniforms.world.x + vec2f(0.5);
  let hitCell = clamp(
    vec2i(round(hitUv * f32(n - 1u))),
    vec2i(0),
    vec2i(i32(n) - 1)
  );
  let interactionCenter = hitCell / i32(WATER_TILE_SIZE);

  var maximumFlux = 0.0;
  // First apply calm/sleep confirmation and copy every tile into the output
  // ping-pong buffer. This scan is fixed by tile count, not queue growth.
  for (var tileIndex = 0u; tileIndex < tileTotal; tileIndex = tileIndex + 1u) {
    let metric = metrics.values[tileIndex];
    let previous = tileStateIn.values[tileIndex];
    let broadOcean = metric.secondary.y > 0.5;
    let soilActive = metric.secondary.w > 0.0008;
    let energetic = metric.primary.z > 0.00002
      || (metric.primary.w > 0.0035 && metric.primary.y > 0.001)
      || soilActive;
    var calmTicks = select(
      min(previous.y + 1u, WATER_SLEEP_CONFIRMATION_TICKS),
      0u,
      energetic
    );
    var runtimeState = previous.x;
    if (runtimeState == 2u && !broadOcean) {
      runtimeState = 0u;
    }
    if (runtimeState == 0u && broadOcean) {
      runtimeState = 2u;
    }
    if (runtimeState == 1u && calmTicks >= WATER_SLEEP_CONFIRMATION_TICKS) {
      runtimeState = select(0u, 2u, broadOcean);
      calmTicks = 0u;
    }
    tileStateOut.values[tileIndex] = vec4u(
      runtimeState,
      calmTicks,
      select(0u, 1u, broadOcean),
      0u
    );
    maximumFlux = max(maximumFlux, metric.primary.z);
  }

  let previousCursor = work.values[0].x % max(tileTotal, 1u);
  let priorityWork = select(0u, 9u, interactionActive);
  var newlyWoken = 0u;
  var queueWork = 0u;

  // The interaction's 3x3 neighborhood occupies the front of the queue. The
  // remaining slots rotate through tiles so distant finite flow is not starved.
  for (
    var queueOffset = 0u;
    queueOffset < MAX_WATER_WAKE_QUEUE_PER_FRAME;
    queueOffset = queueOffset + 1u
  ) {
    var tileIndex = (previousCursor + queueOffset) % max(tileTotal, 1u);
    if (queueOffset < priorityWork) {
      let priorityOffset = vec2i(
        i32(queueOffset % 3u) - 1,
        i32(queueOffset / 3u) - 1
      );
      let priorityTile = clamp(
        interactionCenter + priorityOffset,
        vec2i(0),
        vec2i(i32(tileCount) - 1)
      );
      tileIndex = tileIndexAt(vec2u(priorityTile), tileCount);
    }
    queueWork = queueWork + 1u;
    if (
      newlyWoken < MAX_NEW_WATER_TILES_PER_FRAME
      && isWakeCandidate(tileIndex, tileCount, interactionCenter, interactionActive)
    ) {
      var next = tileStateOut.values[tileIndex];
      next.x = 1u;
      next.y = 0u;
      next.w = 0u;
      tileStateOut.values[tileIndex] = next;
      newlyWoken = newlyWoken + 1u;
    }
  }

  var activeTiles = 0u;
  var sleepingFiniteTiles = 0u;
  var oceanExteriorTiles = 0u;
  var pendingWakeTiles = 0u;
  for (var tileIndex = 0u; tileIndex < tileTotal; tileIndex = tileIndex + 1u) {
    var next = tileStateOut.values[tileIndex];
    if (next.x == 1u) {
      activeTiles = activeTiles + 1u;
    } else if (next.x == 2u) {
      oceanExteriorTiles = oceanExteriorTiles + 1u;
    } else {
      sleepingFiniteTiles = sleepingFiniteTiles + 1u;
    }
    if (isWakeCandidate(tileIndex, tileCount, interactionCenter, interactionActive)) {
      pendingWakeTiles = pendingWakeTiles + 1u;
    }
    let solverActive = next.x == 1u
      || hasActiveOutputNeighbor(tileIndex, tileCount);
    next.w = select(0u, 1u, solverActive);
    tileStateOut.values[tileIndex] = next;
  }

  atomicStore(&diagnostics.values[0], activeTiles);
  atomicStore(&diagnostics.values[1], sleepingFiniteTiles);
  atomicStore(&diagnostics.values[2], oceanExteriorTiles);
  atomicStore(&diagnostics.values[3], newlyWoken);
  atomicStore(&diagnostics.values[4], pendingWakeTiles);
  atomicStore(&diagnostics.values[5], min(queueWork, MAX_WATER_WAKE_QUEUE_PER_FRAME));
  atomicStore(&diagnostics.values[6], quantizeDiagnostic(maximumFlux, 1000000.0));

  work.values[0] = vec4u(
    (previousCursor + MAX_WATER_WAKE_QUEUE_PER_FRAME - priorityWork) % max(tileTotal, 1u),
    min(queueWork, MAX_WATER_WAKE_QUEUE_PER_FRAME),
    newlyWoken,
    pendingWakeTiles
  );
  work.values[1] = vec4u(
    tileTotal,
    select(0u, 1u, interactionActive),
    vec2u(interactionCenter)
  );
  work.values[2] = vec4u(activeTiles, sleepingFiniteTiles, oceanExteriorTiles, 0u);
  work.values[3] = vec4u(0u);
}
`,He=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read_write> flux: StateBuffer;

struct WaterTileStateBuffer {
  values: array<vec4u>,
}
struct WaterDiagnosticsBuffer {
  values: array<atomic<u32>>,
}
@group(0) @binding(3) var<storage, read> tileState: WaterTileStateBuffer;
@group(0) @binding(4) var<storage, read_write> diagnostics: WaterDiagnosticsBuffer;
@group(0) @binding(5) var<storage, read_write> wallEdges: WallEdgeBuffer;

const WATER_TILE_SIZE: u32 = 8u;

fn insideCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

fn solverActiveCell(p: vec2i, n: i32) -> bool {
  let tileCount = (n + i32(WATER_TILE_SIZE) - 1) / i32(WATER_TILE_SIZE);
  let safePosition = clamp(p, vec2i(0), vec2i(n - 1));
  let tile = safePosition / i32(WATER_TILE_SIZE);
  let tileIndex = u32(tile.y * tileCount + tile.x);
  // The scheduler precomputes active-core plus one-tile halo once per frame.
  // Hot cell shaders therefore need one lookup instead of nine per probe.
  return tileState.values[tileIndex].w != 0u;
}

fn quantizedWaterFlux(value: f32) -> u32 {
  return u32(clamp(round(max(0.0, value) * 1000000.0), 0.0, 4294967040.0));
}

fn rawWaterTransfer(source: vec2i, destination: vec2i) -> f32 {
  let fromCell = vec2u(source);
  let toCell = vec2u(destination);
  let fromValue = state.values[gridIndex(fromCell.x, fromCell.y)];
  let toValue = state.values[gridIndex(toCell.x, toCell.y)];
  let fromSurface = fromValue.x + fromValue.y + fromValue.z;
  let toSurface = toValue.x + toValue.y + toValue.z;
  let offset = destination - source;
  let cardinal = offset.x == 0 || offset.y == 0;
  // Diagonal transfers remain available, but carry half a cardinal edge. This
  // puts more of the fixed stability budget into actual downhill travel instead
  // of diffusing a thin film sideways into eight equally strong directions.
  let directionWeight = select(0.5, 1.0, cardinal);
  let effectiveDestinationSurface = max(
    toSurface,
    wallCrestBetween(&wallEdges, source, destination)
  );
  let heightDifference = max(
    0.0,
    fromSurface - effectiveDestinationSurface - 0.0007
  );
  // Almost-level free surfaces remain mobile, so mild terrain slopes do not pin
  // shallow runoff. The aggregate explicit coefficient is still CFL bounded.
  let normalizedSlope = smoothstep(0.0012, 0.12, heightDifference);
  let requestedMobility = mix(0.31, 0.4, normalizedSlope);
  let neighborWeightSum = 6.0;
  let transportScale = uniforms.physics.x * uniforms.grid.z * 1.45;
  let cflMobility = 0.84 / max(
    neighborWeightSum * transportScale,
    0.0001
  );
  let mobility = min(requestedMobility, cflMobility);
  return heightDifference
    * transportScale
    * mobility
    * directionWeight;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let index = gridIndex(gid.x, gid.y);
  let value = state.values[index];
  let position = vec2i(gid.xy);
  let ni = i32(n);
  if (!solverActiveCell(position, ni)) {
    flux.values[index] = vec4f(0.0);
    return;
  }
  var rawOut = 0.0;
  var rawDirection = vec2f(0.0);
  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      if (ox == 0 && oy == 0) {
        continue;
      }
      let neighbor = position + vec2i(ox, oy);
      if (insideCell(neighbor, ni) && solverActiveCell(neighbor, ni)) {
        let transfer = rawWaterTransfer(position, neighbor);
        rawOut = rawOut + transfer;
        rawDirection = rawDirection
          + normalize(vec2f(f32(ox), f32(oy))) * transfer;
      }
    }
  }

  // Flat water retains a conservative cap so neighboring shoreline cells do
  // not swap most of their volume. High transfer pressure unlocks a larger
  // fraction only where a mound, slope, or scoop depression actually exists.
  let outflowPressure = rawOut / max(value.z, 0.025);
  let urgentFlow = smoothstep(0.002, 0.08, outflowPressure);
  // A shallow moving film may release nearly half its local depth per tick. The
  // destination-side CFL coefficient, rather than this source cap, prevents the
  // overfill/reversal mode that caused the original jitter.
  let maximumOut = value.z * mix(0.16, 0.44, urgentFlow);
  let outScale = select(1.0, min(1.0, maximumOut / rawOut), rawOut > 0.000001);
  atomicMax(&diagnostics.values[6], quantizedWaterFlux(rawOut * outScale));
  flux.values[index] = vec4f(
    rawOut * outScale,
    outScale,
    rawDirection * outScale
  );
}
`,Ue=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read_write> stateA: StateBuffer;
@group(0) @binding(2) var<storage, read_write> stateB: StateBuffer;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let index = gridIndex(gid.x, gid.y);
  var a = stateA.values[index];
  var b = stateB.values[index];
  a.z = 0.0;
  b.z = 0.0;
  stateA.values[index] = a;
  stateB.values[index] = b;
}
`,We=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> stateIn: StateBuffer;
@group(0) @binding(2) var<storage, read> flux: StateBuffer;
@group(0) @binding(3) var<storage, read_write> stateOut: StateBuffer;
@group(0) @binding(4) var<storage, read> groundwater: ScalarBuffer;
@group(0) @binding(5) var<storage, read> elements: ElementBuffer;

struct WaterTileStateBuffer {
  values: array<vec4u>,
}
struct WaterConnectivityBuffer {
  values: array<vec4u>,
}
struct WaterDiagnosticsBuffer {
  values: array<atomic<u32>>,
}
@group(0) @binding(6) var<storage, read> tileState: WaterTileStateBuffer;
@group(0) @binding(7) var<storage, read> stableConnectivity: WaterConnectivityBuffer;
@group(0) @binding(8) var<storage, read_write> diagnostics: WaterDiagnosticsBuffer;
// Per-cell signed exchange actually granted by the capped virtual reservoir in
// this tick: positive enters the domain, negative leaves it.
@group(0) @binding(9) var<storage, read_write> externalBoundaryFlux: ScalarBuffer;
@group(0) @binding(10) var<storage, read_write> wallEdges: WallEdgeBuffer;

const WATER_TILE_SIZE: u32 = 8u;
// Sum of granted boundary depth across the whole local patch and all solver
// substeps in one rendered frame. At the current cell area this is roughly a
// half cubic metre, enough for a responsive sea without an unbounded burst.
const VIRTUAL_OCEAN_RESERVOIR_CAP_Q: u32 = 1200000u;

fn insideCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

fn solverActiveCell(p: vec2i, n: i32) -> bool {
  let tileCount = (n + i32(WATER_TILE_SIZE) - 1) / i32(WATER_TILE_SIZE);
  let safePosition = clamp(p, vec2i(0), vec2i(n - 1));
  let tile = safePosition / i32(WATER_TILE_SIZE);
  let tileIndex = u32(tile.y * tileCount + tile.x);
  // The scheduler precomputes active-core plus one-tile halo once per frame.
  // Hot cell shaders therefore need one lookup instead of nine per probe.
  return tileState.values[tileIndex].w != 0u;
}

fn quantizedBoundaryValue(value: f32) -> u32 {
  return u32(clamp(round(max(0.0, value) * 1000000.0), 0.0, 4294967040.0));
}

fn quantizedFiniteResidual(value: f32) -> u32 {
  return u32(clamp(round(max(0.0, value) * 1000000000.0), 0.0, 4294967040.0));
}

fn reserveVirtualOceanExchange(requested: f32, reservationIndex: u32) -> f32 {
  let requestedUnits = quantizedBoundaryValue(abs(requested));
  if (requestedUnits == 0u) {
    return 0.0;
  }
  let previousReservation = atomicAdd(
    &diagnostics.values[reservationIndex],
    requestedUnits
  );
  let availableUnits = select(
    0u,
    VIRTUAL_OCEAN_RESERVOIR_CAP_Q
      - min(previousReservation, VIRTUAL_OCEAN_RESERVOIR_CAP_Q),
    previousReservation < VIRTUAL_OCEAN_RESERVOIR_CAP_Q
  );
  let grantedUnits = min(requestedUnits, availableUnits);
  return sign(requested) * f32(grantedUnits) / 1000000.0;
}

fn rawWaterTransfer(source: vec2i, destination: vec2i) -> f32 {
  let fromCell = vec2u(source);
  let toCell = vec2u(destination);
  let fromValue = stateIn.values[gridIndex(fromCell.x, fromCell.y)];
  let toValue = stateIn.values[gridIndex(toCell.x, toCell.y)];
  let fromSurface = fromValue.x + fromValue.y + fromValue.z;
  let toSurface = toValue.x + toValue.y + toValue.z;
  let offset = destination - source;
  let cardinal = offset.x == 0 || offset.y == 0;
  // Diagonal transfers remain available, but carry half a cardinal edge. This
  // puts more of the fixed stability budget into actual downhill travel instead
  // of diffusing a thin film sideways into eight equally strong directions.
  let directionWeight = select(0.5, 1.0, cardinal);
  let effectiveDestinationSurface = max(
    toSurface,
    wallCrestBetween(&wallEdges, source, destination)
  );
  let heightDifference = max(
    0.0,
    fromSurface - effectiveDestinationSurface - 0.0007
  );
  // Almost-level free surfaces remain mobile, so mild terrain slopes do not pin
  // shallow runoff. The aggregate explicit coefficient is still CFL bounded.
  let normalizedSlope = smoothstep(0.0012, 0.12, heightDifference);
  let requestedMobility = mix(0.31, 0.4, normalizedSlope);
  let neighborWeightSum = 6.0;
  let transportScale = uniforms.physics.x * uniforms.grid.z * 1.45;
  let cflMobility = 0.84 / max(
    neighborWeightSum * transportScale,
    0.0001
  );
  let mobility = min(requestedMobility, cflMobility);
  return heightDifference
    * transportScale
    * mobility
    * directionWeight;
}

fn virtualOceanBoundaryFlux(position: vec2i, value: vec4f) -> vec3f {
  let n = i32(gridSize());
  let currentIndex = gridIndex(u32(position.x), u32(position.y));
  let currentConnectivity = stableConnectivity.values[currentIndex];
  if (
    uniforms.pad1.x >= 0.5
    || uniforms.pad1.z >= 0.5
    || currentConnectivity.y == 0u
    || !solverActiveCell(position, n)
  ) {
    return vec3f(0.0);
  }

  let terrain = value.x + value.y;
  let currentSurface = terrain + value.z;
  let targetOceanSurface = uniforms.physics.w;
  let targetOceanDepth = max(0.0, targetOceanSurface - terrain);
  let cardinal = array<vec2i, 4>(
    vec2i(1, 0), vec2i(-1, 0), vec2i(0, 1), vec2i(0, -1)
  );
  var frontierExchange = 0.0;
  var maximumSpongeResidual = 0.0;
  var frontierEdges = 0.0;

  for (var direction = 0u; direction < 4u; direction = direction + 1u) {
    let neighbor = position + cardinal[direction];
    if (!insideCell(neighbor, n) || solverActiveCell(neighbor, n)) {
      continue;
    }
    let neighborIndex = gridIndex(u32(neighbor.x), u32(neighbor.y));
    let neighborConnectivity = stableConnectivity.values[neighborIndex];
    // Infinite exchange exists only on a verified broad-ocean frontier. A
    // narrow river remains an ordinary finite chain even when hydraulically
    // connected to this broad component.
    if (neighborConnectivity.y == 0u) {
      continue;
    }

    let surfaceResidual = targetOceanSurface - currentSurface;
    maximumSpongeResidual = max(maximumSpongeResidual, abs(surfaceResidual));
    let normalizedSlope = smoothstep(0.0012, 0.12, abs(surfaceResidual));
    let requestedMobility = mix(0.31, 0.4, normalizedSlope);
    let transportScale = uniforms.physics.x * uniforms.grid.z * 1.45;
    let cflMobility = 0.84 / max(6.0 * transportScale, 0.0001);
    let ordinaryMobility = min(requestedMobility, cflMobility);
    let ordinaryEdgeRequest = surfaceResidual * transportScale * ordinaryMobility;

    // The sponge damps a residual at the outer edge of the active patch; it
    // never recenters an interior cell. Its correction is capped by the same
    // safe edge volume available to an ordinary virtual-pipe transfer.
    let spongeCorrection = surfaceResidual
      * clamp(uniforms.grid.z * 1.45, 0.0, 0.12);
    let safeEdgeDepth = max(max(value.z, targetOceanDepth), 0.002);
    let safeEdgeFlux = safeEdgeDepth * 0.16 * 0.25;
    let maximumBoundaryFlux = safeEdgeFlux;
    let edgeExchange = clamp(
      ordinaryEdgeRequest * 0.25 + spongeCorrection,
      -maximumBoundaryFlux,
      maximumBoundaryFlux
    );
    frontierExchange = frontierExchange + edgeExchange;
    frontierEdges = frontierEdges + 1.0;
  }

  // A corner touching several sleeping exterior cells must not gain a larger
  // stability budget than an ordinary source cell.
  let ordinarySafeOutflow = value.z * 0.16;
  let ordinarySafeInflow = max(targetOceanDepth, 0.002) * 0.16;
  frontierExchange = clamp(
    frontierExchange,
    -ordinarySafeOutflow,
    ordinarySafeInflow
  );
  return vec3f(frontierExchange, maximumSpongeResidual, frontierEdges);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let index = gridIndex(gid.x, gid.y);
  externalBoundaryFlux.values[index] = 0.0;
  let value = stateIn.values[index];
  let outflow = flux.values[index].x;
  let position = vec2i(gid.xy);
  let ni = i32(n);
  if (!solverActiveCell(position, ni)) {
    stateOut.values[index] = value;
    return;
  }
  var inflow = 0.0;
  var nearbyWater = value.z;

  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      if (ox == 0 && oy == 0) {
        continue;
      }
      let neighbor = position + vec2i(ox, oy);
      if (insideCell(neighbor, ni) && solverActiveCell(neighbor, ni)) {
        let neighborCell = vec2u(neighbor);
        let neighborIndex = gridIndex(neighborCell.x, neighborCell.y);
        inflow = inflow
          + rawWaterTransfer(neighbor, position) * flux.values[neighborIndex].y;
        nearbyWater = max(nearbyWater, stateIn.values[neighborIndex].z);
      }
    }
  }

  let oceanBoundary = virtualOceanBoundaryFlux(position, value);
  var grantedOceanBoundary = 0.0;
  if (oceanBoundary.x > 0.0) {
    grantedOceanBoundary = reserveVirtualOceanExchange(oceanBoundary.x, 11u);
    atomicAdd(
      &diagnostics.values[7],
      quantizedBoundaryValue(grantedOceanBoundary)
    );
  } else if (oceanBoundary.x < 0.0) {
    grantedOceanBoundary = reserveVirtualOceanExchange(oceanBoundary.x, 12u);
    atomicAdd(
      &diagnostics.values[8],
      quantizedBoundaryValue(-grantedOceanBoundary)
    );
  }
  externalBoundaryFlux.values[index] = grantedOceanBoundary;
  atomicMax(&diagnostics.values[9], quantizedBoundaryValue(oceanBoundary.y));

  let expectedFiniteWater = value.z + inflow - outflow;
  if (stableConnectivity.values[index].y == 0u) {
    let finiteClampResidual = abs(max(0.0, expectedFiniteWater) - expectedFiniteWater);
    atomicAdd(&diagnostics.values[10], quantizedFiniteResidual(finiteClampResidual));
  }
  var water = max(0.0, expectedFiniteWater + grantedOceanBoundary);
  // A persistent freshwater spring occupies the low point of the central
  // basin. Generation is deliberately slow and local; ordinary virtual-pipe
  // flow decides when the pool becomes a river rather than a scripted path.
  let uv = vec2f(gid.xy) / f32(n - 1u);
  let worldXZ = (uv - vec2f(0.5)) * uniforms.world.x;
  let inlandMode = step(0.5, uniforms.pad1.z);
  let coastalSpringDistance = distance(worldXZ, vec2f(-11.0, -2.0));
  let quietSpringDistance = distance(worldXZ, vec2f(-47.0, -31.0));
  let strongSpringDistance = distance(worldXZ, vec2f(25.0, 36.0));
  let springDistance = mix(
    coastalSpringDistance,
    min(quietSpringDistance, strongSpringDistance),
    inlandMode
  );
  let waterSourcesEnabled = 1.0 - step(0.5, uniforms.pad1.x);
  let springOutput = clamp(uniforms.pad1.y, 0.0, 60.0);
  let coastalSourceShape = 1.0 - smoothstep(0.45, 2.65, coastalSpringDistance);
  let quietSourceShape = (1.0 - smoothstep(0.35, 2.4, quietSpringDistance)) * 0.42;
  let strongSourceShape = 1.0 - smoothstep(0.45, 3.1, strongSpringDistance);
  let springSourceShape = mix(
    coastalSourceShape,
    max(quietSourceShape, strongSourceShape),
    inlandMode
  );
  var springOpen = 0.0;
  if (springSourceShape > 0.0001) {
    let sourceMetadata = groundwater.values[index];
    let hasSourceFloor = 1.0 - step(-0.5, sourceMetadata);
    let packedSourceFloor = max(0.0, -sourceMetadata - 1.0);
    let baselineRockUnits = floor(packedSourceFloor / 2048.0);
    let baselineSandUnits = packedSourceFloor - baselineRockUnits * 2048.0;
    let baselineRock = baselineRockUnits / 16.0 - 32.0;
    let baselineSand = baselineSandUnits / 16.0;
    let elementValue = elements.values[index];
    // Removing the original movable soil uncovers the vent. Added sand/dirt,
    // raised immutable rock, oil, or lava closes it again.
    let sandClear = 1.0 - step(baselineSand + 0.11, value.y);
    let rockClear = 1.0 - step(baselineRock + 0.11, value.x);
    let elementClear = (1.0 - step(0.004, elementValue.x))
      * (1.0 - step(0.003, elementValue.y));
    springOpen = hasSourceFloor * sandClear * rockClear * elementClear;
  }
  let springSource = springSourceShape * springOpen;
  // At the new 12× default the lake visibly rises and begins feeding the
  // channel; 60× remains an intentionally extreme validation setting.
  water = water
    + springSource
      * uniforms.grid.z
      * 0.15
      * springOutput
      * waterSourcesEnabled;
  // The innermost vent cannot be permanently emptied while it is exposed.
  // Burial disables this floor as well as generation, so uncovering it later
  // resumes naturally without a scripted toggle.
  let coastalSpringCore = 1.0 - smoothstep(0.25, 0.9, coastalSpringDistance);
  let quietSpringCore = (1.0 - smoothstep(0.18, 0.72, quietSpringDistance)) * 0.42;
  let strongSpringCore = 1.0 - smoothstep(0.22, 0.92, strongSpringDistance);
  let springCore = mix(
    coastalSpringCore,
    max(quietSpringCore, strongSpringCore),
    inlandMode
  );
  water = max(
    water,
    springCore
      * 0.085
      * min(1.0, springOutput)
      * springOpen
      * waterSourcesEnabled
  );
  // Inland river exits are deliberate finite sinks, centered exactly on the
  // two profile outlets. They never confer ocean connectivity or refill any
  // neighbor. The fractional removal is timestep-bounded and approaches zero
  // smoothly outside each protected seep patch.
  let quietSeep = 1.0 - smoothstep(
    5.5,
    9.0,
    distance(worldXZ, vec2f(-74.0, 29.0))
  );
  let strongSeep = 1.0 - smoothstep(
    6.5,
    10.5,
    distance(worldXZ, vec2f(69.0, -72.0))
  );
  let inlandSeepRate = max(quietSeep, strongSeep * 1.35);
  let inlandSeepFraction = clamp(
    inlandMode * inlandSeepRate * uniforms.grid.z,
    0.0,
    0.12
  );
  let inlandSeepSink = min(water, water * inlandSeepFraction);
  water = water - inlandSeepSink;
  atomicAdd(
    &diagnostics.values[13],
    quantizedBoundaryValue(inlandSeepSink)
  );
  let moistureTarget = clamp(nearbyWater * 0.72 + water * 0.5, 0.0, 1.0);
  let moisture = mix(value.w, moistureTarget, clamp(uniforms.grid.z * 0.48, 0.0, 1.0));
  stateOut.values[index] = vec4f(value.x, value.y, water, moisture);
}
`,Ge=I+Ne+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read_write> wallBlocks: WallBlockBuffer;
@group(0) @binding(3) var<storage, read_write> diagnostics: WallDiagnosticsBuffer;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let blockIndex = gid.x;
  if (blockIndex >= MAX_WALL_BLOCKS) {
    return;
  }
  var block = wallBlocks.values[blockIndex];
  if (block.gridFoundation.w < 1.0) {
    return;
  }
  let cell = clampCell(vec2i(round(block.gridFoundation.xy)));
  let support = wallSupportEnvelope(&state, vec2i(cell), i32(gridSize()));
  if (block.gridFoundation.z < -900.0) {
    block.gridFoundation.z = support.x;
  }
  block.condition = vec4f(
    clamp(block.condition.x, 0.0, 1.0),
    clamp(block.condition.y, -8.0, 1.0),
    support.y,
    clamp(block.condition.w, 0.45, 8.0)
  );
  wallBlocks.values[blockIndex] = block;
  atomicAdd(&diagnostics.values[1], 1u);
}
`,Ke=I+Ne+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> hit: HitBuffer;
@group(0) @binding(3) var<storage, read_write> wallBlocks: WallBlockBuffer;
@group(0) @binding(4) var<storage, read_write> diagnostics: WallDiagnosticsBuffer;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  if (gid.x != 0u || hit.value.w < 0.5) {
    return;
  }
  let n = gridSize();
  let uv = clamp(
    hit.value.xy / uniforms.world.x + vec2f(0.5),
    vec2f(0.0),
    vec2f(1.0)
  );
  let cell = vec2u(round(uv * f32(n - 1u)));
  let cellPosition = vec2f(cell);
  let support = wallSupportEnvelope(&state, vec2i(cell), i32(n));
  let centerState = state.values[gridIndex(cell.x, cell.y)];
  let manipulationLimit = uniforms.world.x * 0.5 - max(0.0, uniforms.world.w);
  let outsideEditableGround = abs(hit.value.x) > manipulationLimit
    || abs(hit.value.y) > manipulationLimit;
  let submergedFoundation = centerState.z > 0.055;
  let unsupportedRelief = support.z - support.y > 0.58
    || abs(support.x - hit.value.z) > 0.72;
  if (outsideEditableGround || submergedFoundation || unsupportedRelief) {
    atomicAdd(&diagnostics.values[6], 1u);
    return;
  }
  let occupiedCount = min(atomicLoad(&diagnostics.values[0]), MAX_WALL_BLOCKS);
  var reusableSlot = MAX_WALL_BLOCKS;

  // A second placement on a damaged/collapsed block repairs it in place. The
  // bounded scan happens only on a user click, never in the per-frame solver.
  for (var blockIndex = 0u; blockIndex < occupiedCount; blockIndex = blockIndex + 1u) {
    var existing = wallBlocks.values[blockIndex];
    if (existing.gridFoundation.w < 1.0) {
      reusableSlot = min(reusableSlot, blockIndex);
      continue;
    }
    if (
      all(vec2i(round(existing.gridFoundation.xy)) == vec2i(cell))
    ) {
      existing.gridFoundation.z = support.x;
      existing.condition.x = 1.0;
      existing.condition.y = 0.0;
      existing.condition.z = support.y;
      wallBlocks.values[blockIndex] = existing;
      atomicAdd(&diagnostics.values[5], 1u);
      return;
    }
  }

  var slot = reusableSlot;
  if (slot >= MAX_WALL_BLOCKS) {
    slot = atomicAdd(&diagnostics.values[0], 1u);
  }
  if (slot >= MAX_WALL_BLOCKS) {
    atomicStore(&diagnostics.values[0], MAX_WALL_BLOCKS);
    atomicAdd(&diagnostics.values[6], 1u);
    return;
  }
  wallBlocks.values[slot] = WallBlock(
    vec4f(cellPosition, support.x, 10.0),
    vec4f(1.0, 0.0, support.y, 2.75)
  );
  atomicAdd(&diagnostics.values[5], 1u);
}
`,qe=I+Me+Ne+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> soil: SoilBuffer;
@group(0) @binding(4) var<storage, read_write> wallBlocks: WallBlockBuffer;
@group(0) @binding(5) var<storage, read_write> diagnostics: WallDiagnosticsBuffer;
@group(0) @binding(6) var<storage, read_write> collapseDeposits: WallCollapseDepositBuffer;

const WALL_COLLAPSE_INTEGRITY: f32 = 0.08;
const WALL_MAX_DAMAGE_PER_PASS: f32 = 0.18;
const WALL_UPDATE_INTERVAL_TICKS: f32 = 6.0;
const WALL_COLLAPSE_SAND_RECOVERY: f32 = 0.9;
const WALL_SAND_DEPOSIT_QUANTIZATION: f32 = 1000000.0;

fn wallDamageQuantized(value: f32) -> u32 {
  return u32(clamp(round(max(0.0, value) * 1000000.0), 0.0, 4294967040.0));
}

fn queueWallSandDepth(position: vec2i, depth: f32, n: i32) {
  let cell = vec2u(clamp(position, vec2i(0), vec2i(n - 1)));
  let amount = u32(clamp(
    round(max(0.0, depth) * WALL_SAND_DEPOSIT_QUANTIZATION),
    0.0,
    4294967040.0
  ));
  atomicAdd(&collapseDeposits.values[gridIndex(cell.x, cell.y)], amount);
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let blockIndex = gid.x;
  if (blockIndex >= MAX_WALL_BLOCKS) {
    return;
  }
  var block = wallBlocks.values[blockIndex];
  if (block.gridFoundation.w < 1.0) {
    return;
  }

  let n = i32(gridSize());
  let center = vec2i(clamp(
    round(block.gridFoundation.xy),
    vec2f(0.0),
    vec2f(f32(n - 1))
  ));
  let centerCell = vec2u(center);
  let centerIndex = gridIndex(centerCell.x, centerCell.y);
  let centerValue = state.values[centerIndex];
  let centerTerrain = centerValue.x + centerValue.y;
  let support = wallSupportEnvelope(&state, center, n);
  let cardinal = array<vec2i, 4>(
    vec2i(1, 0), vec2i(-1, 0), vec2i(0, 1), vec2i(0, -1)
  );
  var minimumTerrain = support.y;
  var maximumSurface = centerTerrain + centerValue.z;
  var maximumWaterDepth = support.w;
  for (var direction = 0u; direction < 4u; direction = direction + 1u) {
    let samplePosition = clamp(
      center + cardinal[direction],
      vec2i(0),
      vec2i(n - 1)
    );
    let sampleCell = vec2u(samplePosition);
    let sampleIndex = gridIndex(sampleCell.x, sampleCell.y);
    let sampleValue = state.values[sampleIndex];
    let sampleTerrain = sampleValue.x + sampleValue.y;
    minimumTerrain = min(minimumTerrain, sampleTerrain);
    maximumSurface = max(maximumSurface, sampleTerrain + sampleValue.z);
    maximumWaterDepth = max(maximumWaterDepth, sampleValue.z);
  }

  let referenceFoundation = block.gridFoundation.z;
  let referenceMinimumSupport = block.condition.z;
  let centerSupportLoss = max(0.0, referenceFoundation - centerTerrain);
  let perimeterSupportLoss = max(0.0, referenceMinimumSupport - minimumTerrain);
  let supportLoss = max(centerSupportLoss, perimeterSupportLoss * 0.86);
  let catastrophicSupportLoss = centerSupportLoss > 0.52
    || perimeterSupportLoss > 0.78;
  let structuralDt = min(0.25, uniforms.grid.z * WALL_UPDATE_INTERVAL_TICKS);
  // Authored structures begin while loose procedural terrain is taking its
  // first few solver steps. Their negative saturation seed is a one-shot
  // bedding period: foundations follow only that natural startup settlement,
  // then become ordinary destructible supports. Player-built blocks start at
  // zero and therefore never receive this grace period.
  if (block.condition.y < 0.0) {
    block.gridFoundation.z = centerTerrain;
    block.condition = vec4f(
      block.condition.x,
      min(0.0, block.condition.y + structuralDt),
      minimumTerrain,
      block.condition.w
    );
    wallBlocks.values[blockIndex] = block;
    atomicAdd(&diagnostics.values[1], 1u);
    return;
  }
  let soilValue = soil.values[centerIndex];
  let lowBearingCapacity = 1.0 - clamp(soilValue.compaction, 0.0, 1.0);
  let wallHeight = max(0.45, block.condition.w);
  let crestHeight = referenceFoundation + wallHeight;
  let upstreamHead = max(0.0, maximumSurface - referenceFoundation);
  let overtoppingDepth = max(0.0, maximumSurface - crestHeight);

  let waterContact = smoothstep(0.012, 0.42, maximumWaterDepth);
  let saturationTarget = clamp(
    waterContact * (0.62 + lowBearingCapacity * 0.38),
    0.0,
    1.0
  );
  let saturationResponse = 1.0 - exp(
    -structuralDt / select(7.5, 2.2, saturationTarget > block.condition.y)
  );
  let saturation = clamp(
    mix(block.condition.y, saturationTarget, saturationResponse),
    0.0,
    1.0
  );

  let supportDamageRate = smoothstep(0.055, 0.68, supportLoss) * 1.3;
  let foundationDistress = smoothstep(0.035, 0.34, supportLoss);
  let hydraulicLoad = smoothstep(
    wallHeight * 0.48,
    wallHeight * 1.08,
    upstreamHead
  );
  let saturatedBearingDamageRate = saturation
    * lowBearingCapacity
    * hydraulicLoad
    * foundationDistress
    * 0.065;
  let overtoppingDamageRate = smoothstep(0.025, 0.72, overtoppingDepth)
    * foundationDistress
    * 0.075;
  let scourDamageRate = smoothstep(0.035, 0.72, maximumWaterDepth)
    * smoothstep(0.035, 0.65, supportLoss)
    * 0.085;
  let requestedDamage = structuralDt * (
    supportDamageRate
      + saturatedBearingDamageRate
      + overtoppingDamageRate
      + scourDamageRate
  );
  let boundedDamage = min(
    WALL_MAX_DAMAGE_PER_PASS,
    min(block.condition.x, max(0.0, requestedDamage))
  );
  let damage = min(
    WALL_MAX_DAMAGE_PER_PASS,
    select(boundedDamage, block.condition.x, catastrophicSupportLoss)
  );
  var integrity = select(
    max(0.0, block.condition.x - damage),
    0.0,
    catastrophicSupportLoss
  );
  if (integrity <= WALL_COLLAPSE_INTEGRITY) {
    integrity = 0.0;
    let cellArea = max(0.0001, uniforms.grid.y * uniforms.grid.y);
    let proxyMasonryVolume = wallHeight * 2.2 * 0.92;
    let recoveredSandDepth = proxyMasonryVolume
      * WALL_COLLAPSE_SAND_RECOVERY
      / cellArea;
    let tower = wallHeight >= 4.0;
    if (tower) {
      // Round towers leave a radial apron.
      queueWallSandDepth(center, recoveredSandDepth * 0.2, n);
      for (var direction = 0u; direction < 4u; direction = direction + 1u) {
        queueWallSandDepth(
          center + cardinal[direction],
          recoveredSandDepth * 0.12,
          n
        );
      }
      let diagonals = array<vec2i, 4>(
        vec2i(1, 1), vec2i(-1, 1), vec2i(1, -1), vec2i(-1, -1)
      );
      for (var direction = 0u; direction < 4u; direction = direction + 1u) {
        queueWallSandDepth(
          center + diagonals[direction],
          recoveredSandDepth * 0.08,
          n
        );
      }
    } else {
      // Curtain blocks leave an elongated yaw-aligned strip, matching their
      // rectangular hydraulic footprint and the visible fragment trajectories.
      let yaw = block.gridFoundation.w - 10.0;
      let along = vec2i(round(vec2f(cos(yaw), sin(yaw))));
      let across = vec2i(round(vec2f(-sin(yaw), cos(yaw))));
      queueWallSandDepth(center, recoveredSandDepth * 0.18, n);
      let signs = array<i32, 2>(-1, 1);
      for (var side = 0u; side < 2u; side = side + 1u) {
        let signValue = signs[side];
        queueWallSandDepth(
          center + along * signValue,
          recoveredSandDepth * 0.2,
          n
        );
        queueWallSandDepth(
          center + along * (signValue * 2),
          recoveredSandDepth * 0.12,
          n
        );
        queueWallSandDepth(
          center + across * signValue,
          recoveredSandDepth * 0.06,
          n
        );
      }
      let shoulders = array<vec2i, 4>(
        along + across,
        along - across,
        -along + across,
        -along - across
      );
      for (var shoulder = 0u; shoulder < 4u; shoulder = shoulder + 1u) {
        queueWallSandDepth(
          center + shoulders[shoulder],
          recoveredSandDepth * 0.015,
          n
        );
      }
    }
    // A negative encoded yaw makes the block structurally inactive and
    // immediately removes its hydraulic crest, while preserving enough state
    // for a short bounded collapse animation. The slot remains reusable.
    block.gridFoundation.w = -abs(block.gridFoundation.w);
    atomicAdd(&diagnostics.values[3], 1u);
  } else {
    atomicAdd(&diagnostics.values[1], 1u);
    if (damage > 0.0) {
      atomicAdd(&diagnostics.values[2], 1u);
    }
  }
  atomicMax(&diagnostics.values[4], wallDamageQuantized(damage));
  let conditionZ = select(
    referenceMinimumSupport,
    uniforms.grid.w,
    integrity <= WALL_COLLAPSE_INTEGRITY
  );
  block.condition = vec4f(integrity, saturation, conditionZ, wallHeight);
  wallBlocks.values[blockIndex] = block;
}
`,Je=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read_write> wallEdges: WallEdgeBuffer;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }
  let index = gridIndex(gid.x, gid.y);
  atomicStore(&wallEdges.values[index].north, 0u);
  atomicStore(&wallEdges.values[index].east, 0u);
  atomicStore(&wallEdges.values[index].south, 0u);
  atomicStore(&wallEdges.values[index].west, 0u);
}
`,Ye=I+Ne+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(2) var<storage, read> wallBlocks: WallBlockBuffer;
@group(0) @binding(3) var<storage, read_write> wallEdges: WallEdgeBuffer;

const WALL_COLLAPSE_INTEGRITY: f32 = 0.08;
const WALL_RASTER_RADIUS_CELLS: i32 = 5;

fn publishSolidWallCell(cell: vec2u, encodedCrest: u32) {
  let index = gridIndex(cell.x, cell.y);
  atomicMax(&wallEdges.values[index].north, encodedCrest);
  atomicMax(&wallEdges.values[index].east, encodedCrest);
  atomicMax(&wallEdges.values[index].south, encodedCrest);
  atomicMax(&wallEdges.values[index].west, encodedCrest);
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let blockIndex = gid.x;
  if (blockIndex >= MAX_WALL_BLOCKS) {
    return;
  }
  let block = wallBlocks.values[blockIndex];
  if (
    block.gridFoundation.w < 1.0
    || block.condition.x <= WALL_COLLAPSE_INTEGRITY
  ) {
    return;
  }
  let center = vec2i(round(block.gridFoundation.xy));
  let crest = block.gridFoundation.z + max(0.45, block.condition.w);
  let encodedCrest = encodeWallCrest(crest);
  let yaw = block.gridFoundation.w - 10.0;
  let c = cos(yaw);
  let s = sin(yaw);
  let cellSize = max(0.01, uniforms.grid.y);
  let cellPadding = cellSize * 0.58;
  let tower = block.condition.w >= 4.0;

  // Rendered curtain pieces are about 2.2 x 0.92 metres and towers are about
  // 3.44 metres across. Rasterizing only their centre cell left several open
  // solver cells between visually touching blocks. This bounded footprint loop
  // turns the complete masonry volume into terrain-like solid hydraulic cells.
  for (
    var offsetY = -WALL_RASTER_RADIUS_CELLS;
    offsetY <= WALL_RASTER_RADIUS_CELLS;
    offsetY = offsetY + 1
  ) {
    for (
      var offsetX = -WALL_RASTER_RADIUS_CELLS;
      offsetX <= WALL_RASTER_RADIUS_CELLS;
      offsetX = offsetX + 1
    ) {
      let worldOffset = vec2f(f32(offsetX), f32(offsetY)) * cellSize;
      let localOffset = vec2f(
        worldOffset.x * c + worldOffset.y * s,
        -worldOffset.x * s + worldOffset.y * c
      );
      let insideCurtain = abs(localOffset.x) <= 1.14 + cellPadding
        && abs(localOffset.y) <= 0.61 + cellPadding;
      let insideTower = length(localOffset) <= 1.76 + cellPadding;
      if (select(insideCurtain, insideTower, tower)) {
        publishSolidWallCell(
          clampCell(center + vec2i(offsetX, offsetY)),
          encodedCrest
        );
      }
    }
  }
}
`,Xe=I+Me+Ne+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read_write> state: StateBuffer;
@group(0) @binding(2) var<storage, read_write> soil: SoilBuffer;
@group(0) @binding(3) var<storage, read_write> collapseDeposits: WallCollapseDepositBuffer;

const WALL_SAND_DEPOSIT_QUANTIZATION: f32 = 1000000.0;
// A large fortress failure can overlap several cells. Applying a bounded depth
// per maintenance pass prevents a one-frame terrain spike; any remainder stays
// queued, so recovered volume is delayed rather than discarded.
const WALL_MAX_SAND_DEPOSIT_DEPTH_PER_PASS_Q: u32 = 1400000u;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }
  let index = gridIndex(gid.x, gid.y);
  let pending = atomicLoad(&collapseDeposits.values[index]);
  if (pending == 0u) {
    return;
  }
  let granted = min(pending, WALL_MAX_SAND_DEPOSIT_DEPTH_PER_PASS_Q);
  atomicSub(&collapseDeposits.values[index], granted);
  let depositDepth = f32(granted) / WALL_SAND_DEPOSIT_QUANTIZATION;

  var value = state.values[index];
  var soilValue = soil.values[index];
  let previousMovableDepth = max(0.0, value.y);
  let nextMovableDepth = previousMovableDepth + depositDepth;
  value.y = nextMovableDepth;
  // Collapsed fired earth and sandstone weather into the same loose sand seen
  // around the fragments. Existing dirt is preserved, never manufactured.
  soilValue.dirtDepth = clamp(soilValue.dirtDepth, 0.0, nextMovableDepth);
  state.values[index] = value;
  soil.values[index] = soilValue;
}
`,Ze=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read_write> state: StateBuffer;
@group(0) @binding(2) var<storage, read> waterFlux: StateBuffer;
@group(0) @binding(3) var<storage, read_write> thinFilmAge: ScalarBuffer;
struct WaterConnectivityBuffer { values: array<vec4u>, }
struct WaterDiagnosticsBuffer { values: array<atomic<u32>>, }
@group(0) @binding(4) var<storage, read> stableConnectivity: WaterConnectivityBuffer;
@group(0) @binding(5) var<storage, read_write> diagnostics: WaterDiagnosticsBuffer;

const FILM_CHECK_INTERVAL_SECONDS: f32 = 0.5;
const FILM_PERSISTENCE_SECONDS: f32 = 5.0;
const MAXIMUM_FILM_DEPTH: f32 = 0.052;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) { return; }
  let index = gridIndex(gid.x, gid.y);
  var value = state.values[index];
  let localFlux = max(
    waterFlux.values[index].x,
    length(waterFlux.values[index].zw)
  );
  let finiteInterior = stableConnectivity.values[index].y == 0u;
  let shallowFilm = value.z > 0.0008 && value.z < MAXIMUM_FILM_DEPTH;
  let stagnant = localFlux < 0.0012;
  let qualifying = finiteInterior && shallowFilm && stagnant;
  var age = thinFilmAge.values[index];
  age = select(
    max(0.0, age - FILM_CHECK_INTERVAL_SECONDS * 2.0),
    min(FILM_PERSISTENCE_SECONDS + 12.0, age + FILM_CHECK_INTERVAL_SECONDS),
    qualifying
  );
  if (age >= FILM_PERSISTENCE_SECONDS) {
    let maturity = smoothstep(
      FILM_PERSISTENCE_SECONDS,
      FILM_PERSISTENCE_SECONDS + 4.0,
      age
    );
    let maximumInfiltration = min(0.0022, value.z * 0.16);
    let infiltrated = maximumInfiltration * mix(0.18, 1.0, maturity);
    value.z = max(0.0, value.z - infiltrated);
    value.w = max(0.0, value.w - infiltrated * 0.7);
    state.values[index] = value;
    atomicAdd(
      &diagnostics.values[15],
      u32(clamp(round(infiltrated * 1000000.0), 0.0, 4294967040.0))
    );
  }
  thinFilmAge.values[index] = age;
}
`,Qe=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> waterFlux: StateBuffer;
@group(0) @binding(3) var<storage, read_write> sandFlux: StateBuffer;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let index = gridIndex(gid.x, gid.y);
  let value = state.values[index];
  let cachedOpenness = clamp(sandFlux.values[index].w * 4.0, 0.0, 1.0);

  let flowValue = waterFlux.values[index];
  let localFlow = max(
    flowValue.x,
    length(flowValue.zw) / (value.z + 0.08)
  );
  if (value.z <= 0.018 || localFlow >= 0.018) {
    sandFlux.values[index].w = 0.0;
    return;
  }

  // Openness is now only a calm/deep optical hint. Periodic shoreline ebb is
  // gated separately by verified broad exterior connectivity, so no inland
  // lake acquires a scripted tide merely because it is large.
  let depthOpenness = smoothstep(0.08, 0.9, value.z);
  let calmOpenness = 1.0 - smoothstep(0.004, 0.018, localFlow);
  let opennessTarget = depthOpenness * calmOpenness;
  let opennessResponse = select(
    0.78,
    0.34,
    opennessTarget > cachedOpenness
  );
  sandFlux.values[index].w = mix(
    cachedOpenness,
    opennessTarget,
    opennessResponse
  ) * 0.25;
}
`,$e=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> elements: ElementBuffer;
@group(0) @binding(3) var<storage, read_write> flux: StateBuffer;
@group(0) @binding(4) var<storage, read_write> wallEdges: WallEdgeBuffer;

fn insideCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

fn elementSurface(cell: vec2u, lavaMaterial: bool) -> f32 {
  let terrainValue = state.values[gridIndex(cell.x, cell.y)];
  let elementValue = elements.values[gridIndex(cell.x, cell.y)];
  let terrain = terrainValue.x + terrainValue.y;
  // Lava creeps along the solid bottom beneath water. Oil's hydraulic head is
  // always measured from the carrier-water top (plus submerged lava), never
  // from the seabed; the renderer compresses that volume into a thin film.
  let lavaSurface = terrain + elementValue.x;
  let oilSupportSurface = terrain + elementValue.x + max(0.0, terrainValue.z);
  let oilSurface = oilSupportSurface + elementValue.y;
  return select(oilSurface, lavaSurface, lavaMaterial);
}

fn rawElementTransfer(
  source: vec2i,
  destination: vec2i,
  lavaMaterial: bool
) -> f32 {
  let fromCell = vec2u(source);
  let toCell = vec2u(destination);
  let sourceSurface = elementSurface(fromCell, lavaMaterial);
  let offset = destination - source;
  let cardinal = offset.x == 0 || offset.y == 0;
  if (lavaMaterial && !cardinal) {
    return 0.0;
  }
  var destinationSurface = elementSurface(toCell, lavaMaterial);
  if (lavaMaterial) {
    destinationSurface = max(
      destinationSurface,
      wallCrestBetween(&wallEdges, source, destination)
    );
  }
  let difference = max(0.0, sourceSurface - destinationSurface);
  let directionWeight = select(0.70710678, 1.0, cardinal);
  // Lava is viscous while its surface is nearly level, but a developing mound
  // creates non-linear pressure and drains several times faster. This is still
  // well below water's 12.88 base coefficient, yet prevents an overclocked
  // source or a large hand dump from becoming a one-cell vertical needle.
  let lavaMobility = mix(
    0.34,
    3.2,
    smoothstep(0.07, 1.15, difference)
  );
  let flowRate = select(0.28, lavaMobility, lavaMaterial);
  return difference
    * flowRate
    * min(uniforms.grid.z, 0.05)
    * directionWeight;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let index = gridIndex(gid.x, gid.y);
  let value = elements.values[index];
  let position = vec2i(gid.xy);
  let ni = i32(n);
  var rawLavaOut = 0.0;
  var rawOilOut = 0.0;
  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      if (ox == 0 && oy == 0) {
        continue;
      }
      let neighbor = position + vec2i(ox, oy);
      if (insideCell(neighbor, ni)) {
        rawLavaOut = rawLavaOut
          + rawElementTransfer(position, neighbor, true);
        rawOilOut = rawOilOut
          + rawElementTransfer(position, neighbor, false);
      }
    }
  }

  // Lava may shed at most 7.2% of its local volume per tick. The cap remains
  // lower than water's 9.5%, while allowing high-pressure piles to flatten
  // before their grid vertex can turn into a visible spire.
  let maximumLavaOut = value.x * 0.072;
  let maximumOilOut = value.y * 0.055;
  let lavaScale = select(
    1.0,
    min(1.0, maximumLavaOut / rawLavaOut),
    rawLavaOut > 0.000001
  );
  let oilScale = select(
    1.0,
    min(1.0, maximumOilOut / rawOilOut),
    rawOilOut > 0.000001
  );
  flux.values[index] = vec4f(
    rawLavaOut,
    lavaScale,
    rawOilOut,
    oilScale
  );
}
`,et=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> stateIn: StateBuffer;
@group(0) @binding(2) var<storage, read> elementsIn: ElementBuffer;
@group(0) @binding(3) var<storage, read> flux: StateBuffer;
@group(0) @binding(4) var<storage, read_write> elementsOut: ElementBuffer;
@group(0) @binding(5) var<storage, read_write> vegetation: ScalarBuffer;

struct EventBuffer {
  npcDeaths: atomic<u32>,
  hutCollapses: atomic<u32>,
  explosions: atomic<u32>,
  pad: atomic<u32>,
}

@group(0) @binding(6) var<storage, read_write> events: EventBuffer;
@group(0) @binding(7) var<storage, read_write> stateOut: StateBuffer;
@group(0) @binding(8) var<storage, read_write> treeFuelMask: ScalarBuffer;
@group(0) @binding(9) var<storage, read_write> wallEdges: WallEdgeBuffer;

fn insideCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

fn elementSurface(cell: vec2u, lavaMaterial: bool) -> f32 {
  let terrainValue = stateIn.values[gridIndex(cell.x, cell.y)];
  let elementValue = elementsIn.values[gridIndex(cell.x, cell.y)];
  let terrain = terrainValue.x + terrainValue.y;
  let lavaSurface = terrain + elementValue.x;
  // Keep the update pass identical to the flux pass: any extant water is the
  // supporting layer for oil, while dry cells use their solid terrain surface.
  let oilSupportSurface = terrain + elementValue.x + max(0.0, terrainValue.z);
  let oilSurface = oilSupportSurface + elementValue.y;
  return select(oilSurface, lavaSurface, lavaMaterial);
}

fn rawElementTransfer(
  source: vec2i,
  destination: vec2i,
  lavaMaterial: bool
) -> f32 {
  let fromCell = vec2u(source);
  let toCell = vec2u(destination);
  let sourceSurface = elementSurface(fromCell, lavaMaterial);
  let offset = destination - source;
  let cardinal = offset.x == 0 || offset.y == 0;
  if (lavaMaterial && !cardinal) {
    return 0.0;
  }
  var destinationSurface = elementSurface(toCell, lavaMaterial);
  if (lavaMaterial) {
    destinationSurface = max(
      destinationSurface,
      wallCrestBetween(&wallEdges, source, destination)
    );
  }
  let difference = max(0.0, sourceSurface - destinationSurface);
  let directionWeight = select(0.70710678, 1.0, cardinal);
  let lavaMobility = mix(
    0.34,
    3.2,
    smoothstep(0.07, 1.15, difference)
  );
  let flowRate = select(0.28, lavaMobility, lavaMaterial);
  return difference
    * flowRate
    * min(uniforms.grid.z, 0.05)
    * directionWeight;
}

fn ignitionSource(value: vec4f) -> bool {
  return value.y > 0.003 && (value.x > 0.008 || value.z > 0.12);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let index = gridIndex(gid.x, gid.y);
  let position = vec2i(gid.xy);
  let ni = i32(n);
  let dt = min(uniforms.grid.z, 0.05);
  var terrainValue = stateIn.values[index];
  let previousElement = elementsIn.values[index];
  var plantFuel = treeFuelMask.values[index];
  let treeFuelCell = plantFuel > 0.0;
  let ownFlux = flux.values[index];
  var lavaIn = 0.0;
  var oilIn = 0.0;
  var neighborFire = 0.0;
  var radiantFire = 0.0;
  var radiantLava = 0.0;
  var blastIntensity = 0.0;
  var adjacentLava = 0.0;
  var adjacentWater = 0.0;

  for (var oy = -3; oy <= 3; oy = oy + 1) {
    for (var ox = -3; ox <= 3; ox = ox + 1) {
      let neighbor = position + vec2i(ox, oy);
      if (!insideCell(neighbor, ni)) {
        continue;
      }
      let radius = length(vec2f(f32(ox), f32(oy)));
      let neighborCell = vec2u(neighbor);
      let neighborIndex = gridIndex(neighborCell.x, neighborCell.y);
      let neighborElement = elementsIn.values[neighborIndex];
      if (radius <= 1.5 && (ox != 0 || oy != 0)) {
        neighborFire = max(neighborFire, neighborElement.z);
        adjacentLava = max(adjacentLava, neighborElement.x);
        adjacentWater = max(
          adjacentWater,
          stateIn.values[neighborIndex].z
        );
      }
      if (radius > 0.0 && radius <= 3.35) {
        let radiantFalloff = 1.0 - smoothstep(0.75, 6.25, radius);
        radiantFire = max(
          radiantFire,
          neighborElement.z * radiantFalloff
        );
        radiantLava = max(
          radiantLava,
          smoothstep(0.008, 0.22, neighborElement.x) * radiantFalloff
        );
      }
      if (radius <= 3.35 && ignitionSource(neighborElement)) {
        blastIntensity = max(
          blastIntensity,
          1.0 - smoothstep(0.3, 3.35, radius)
        );
      }
      if (radius <= 1.5 && (ox != 0 || oy != 0)) {
        lavaIn = lavaIn
          + rawElementTransfer(neighbor, position, true)
            * flux.values[neighborIndex].y;
        oilIn = oilIn
          + rawElementTransfer(neighbor, position, false)
            * flux.values[neighborIndex].w;
      }
    }
  }

  // Only actual tree targets pay for the wider ember search. Empty vegetation
  // cells carry no fuel and cannot relay fire, while this exact-target scan
  // still bridges natural gaps inside a grove without a global cascade.
  if (treeFuelCell) {
    for (var emberY = -7; emberY <= 7; emberY = emberY + 1) {
      for (var emberX = -7; emberX <= 7; emberX = emberX + 1) {
        let offset = vec2i(emberX, emberY);
        let radius = length(vec2f(f32(emberX), f32(emberY)));
        if (radius <= 3.35 || radius > 7.25) {
          continue;
        }
        let neighbor = position + offset;
        if (!insideCell(neighbor, ni)) {
          continue;
        }
        let neighborCell = vec2u(neighbor);
        let neighborElement = elementsIn.values[
          gridIndex(neighborCell.x, neighborCell.y)
        ];
        let irregularDrift = mix(
          0.68,
          1.0,
          hash21(vec2f(position + offset * 11))
        );
        let radiantFalloff = (
          1.0 - smoothstep(2.7, 7.25, radius)
        ) * irregularDrift;
        radiantFire = max(
          radiantFire,
          neighborElement.z * radiantFalloff
        );
        radiantLava = max(
          radiantLava,
          smoothstep(0.008, 0.22, neighborElement.x) * radiantFalloff
        );
      }
    }
  }

  var lava = max(0.0, previousElement.x + lavaIn - ownFlux.x * ownFlux.y);
  var oil = max(0.0, previousElement.y + oilIn - ownFlux.z * ownFlux.w);
  var fire = previousElement.z;
  var heat = previousElement.w;
  // The volcanic vent is a true persistent source, not a pre-filled puddle.
  // Cooling still turns moving lava to rock; the gentle surplus eventually
  // raises the crater pool enough to overflow under normal simulation.
  let uv = vec2f(gid.xy) / f32(n - 1u);
  let worldXZ = (uv - vec2f(0.5)) * uniforms.world.x;
  let inlandMode = step(0.5, uniforms.pad1.z);
  let lavaVentCenter = mix(
    vec2f(46.0, -28.0),
    vec2f(2.0, 55.0),
    inlandMode
  );
  let lavaVentDistance = distance(worldXZ, lavaVentCenter);
  let lavaVent = 1.0 - smoothstep(0.38, 2.35, lavaVentDistance);
  let lavaSourceScale = clamp(uniforms.pad1.y / 12.0, 0.0, 5.0);
  // Emit through the compact throat rather than adding the full rate across
  // every cell of the visible vent. Back-pressure throttles a buried/choked
  // source before one grid vertex can become an unlimited vertical needle.
  // The target remains above the 4.12 m crater relief, so the normal 12x vent
  // still fills and eventually overflows; 60x reaches that state sooner and
  // then pressure-driven flux carries the surplus outward.
  let lavaVentEmission = lavaVent * lavaVent;
  let lavaPressureLimit = mix(
    4.78,
    5.28,
    smoothstep(1.0, 5.0, lavaSourceScale)
  );
  let lavaSourceBackPressure = 1.0 - smoothstep(
    lavaPressureLimit - 0.82,
    lavaPressureLimit,
    lava
  );
  lava = lava
    + lavaVentEmission
      * dt
      * 0.14
      * lavaSourceScale
      * lavaSourceBackPressure;
  let lavaVentCore = 1.0 - smoothstep(0.2, 0.82, lavaVentDistance);
  lava = max(lava, lavaVentCore * 0.24 * min(1.0, lavaSourceScale));
  heat = max(heat, lavaVent * 0.52);

  // Count each connected ignition front once from its upper-left edge. All
  // affected cells still apply the same radial blast response independently.
  if (ignitionSource(previousElement)) {
    var hasPredecessor = false;
    let predecessors = array<vec2i, 4>(
      vec2i(-1, 0),
      vec2i(-1, -1),
      vec2i(0, -1),
      vec2i(1, -1)
    );
    for (var p = 0u; p < 4u; p = p + 1u) {
      let candidate = position + predecessors[p];
      if (insideCell(candidate, ni)) {
        let candidateCell = vec2u(candidate);
        hasPredecessor = hasPredecessor || ignitionSource(
          elementsIn.values[gridIndex(candidateCell.x, candidateCell.y)]
        );
      }
    }
    if (!hasPredecessor) {
      atomicAdd(&events.explosions, 1u);
    }
  }

  var vegetationValue = vegetation.values[index];
  if (blastIntensity > 0.0) {
    let blastShape = blastIntensity * blastIntensity;
    oil = oil * (1.0 - smoothstep(0.02, 0.72, blastIntensity));
    lava = lava * (1.0 - blastShape * 0.12);
    // A blast can flash off surface water, but its visual/physical crater must
    // not scale with the full depth of a 14 m sea column.
    let blastEvaporation = min(
      terrainValue.z,
      blastShape * 0.055
    );
    terrainValue.z = terrainValue.z - blastEvaporation;
    let sandDamage = min(
      terrainValue.y,
      blastIntensity * mix(0.8, 2.1, hash21(vec2f(gid.xy) + vec2f(5.2, 19.7)))
    );
    terrainValue.y = terrainValue.y - sandDamage;
    terrainValue.x = terrainValue.x - blastShape * 0.24;
    vegetationValue = vegetationValue * (1.0 - smoothstep(0.05, 0.62, blastIntensity));
    fire = max(fire, smoothstep(0.06, 0.68, blastIntensity));
    heat = max(heat, blastIntensity);
  }

  // Lava vitrifies every movable grain it reaches. The conversion preserves
  // terrain height while making the resulting layer immutable.
  if (lava > 0.012 && terrainValue.y > 0.0) {
    terrainValue.x = terrainValue.x + terrainValue.y;
    terrainValue.y = 0.0;
  }

  // Water in the same cell or immediately beside hot lava becomes steam. The
  // consumed amount is bounded, and that exact contact also advances cooling;
  // a single shallow drop therefore cannot lithify a deep lava pool at once.
  let contact = min(max(lava, adjacentLava * 0.72), terrainValue.z);
  let steam = min(
    terrainValue.z,
    contact * dt * mix(0.38, 1.15, clamp(heat, 0.0, 1.0))
  );
  terrainValue.z = max(0.0, terrainValue.z - steam);
  let thinCooling = (1.0 - smoothstep(0.035, 0.3, lava)) * dt * 0.0035;
  let motionCooling = (lavaIn + ownFlux.x * ownFlux.y) * 0.006;
  let adjacentQuench = min(lava * 0.035, adjacentWater * dt * 0.055);
  let waterCooling = steam * 0.74 + adjacentQuench;
  // Fresh lava remains visibly mobile for tens of seconds on dry terrain.
  // Water still quenches it quickly, while the hot source mouth itself is
  // almost entirely protected from background lithification.
  let ventCoolingProtection = 1.0 - lavaVent * 0.96;
  let cooledLava = min(
    lava,
    (dt * 0.00035 + thinCooling + motionCooling) * ventCoolingProtection
      + waterCooling
  );
  lava = max(0.0, lava - cooledLava);
  terrainValue.x = terrainValue.x + cooledLava;

  let lavaIgnition = treeFuelCell
    && lava > 0.055
    && vegetationValue > 0.1;
  if (lavaIgnition) {
    fire = max(fire, 0.66);
  }
  // Oil is a connected explosive fuel. Ignition jumps to adjacent oil before
  // the radial blast consumes it, producing a rapid chain across one
  // continuous puddle or surface film while leaving disconnected pools alone.
  let oilChainIgnition = oil > 0.003
    && (lava > 0.008 || fire > 0.12 || neighborFire > 0.12);
  if (oilChainIgnition) {
    fire = max(fire, 0.96);
  }

  // Radiant lava and wind-borne embers warm only exact rendered plant cells.
  // The target stores a quiet ember for several seconds before open flame, so
  // a grove spreads deliberately instead of flashing through in one update.
  let dryFuel = 1.0 - smoothstep(0.012, 0.12, terrainValue.z);
  // Nearby lava/fire first appears as heat. Convert sustained high heat into
  // a small real flame seed at the target plant; this closes the gap where a
  // crown could glow indefinitely without ever consuming its persistent fuel.
  let thermalIgnition = treeFuelCell
    && heat > 0.34
    && dryFuel > 0.35;
  if (thermalIgnition) {
    fire = max(
      fire,
      smoothstep(0.34, 0.7, heat) * 0.3
    );
  }
  let vegetationFuel = smoothstep(0.0, 0.18, plantFuel);
  let emberSeedRate = (
    max(0.0, radiantFire - 0.075) * 0.026
      + max(0.0, radiantLava - 0.07) * 0.034
  ) * vegetationFuel * dryFuel;
  if (emberSeedRate > 0.0) {
    fire = min(1.0, fire + emberSeedRate * dt);
  }

  let fuel = max(0.0, plantFuel) + oil * 1.8;
  if (fuel > 0.015 && fire > 0.018) {
    fire = min(1.0, fire + dt * (0.065 + fuel * 0.15));
  } else if (fuel > 0.015 && emberSeedRate > 0.00001) {
    // Accumulating embers must not be erased by the ordinary idle decay.
    fire = max(0.0, fire - dt * 0.00025);
  } else {
    fire = max(0.0, fire - dt * select(0.34, 0.16, plantFuel > -0.72));
  }
  let waterExtinguish = terrainValue.z * dt * 4.8;
  fire = max(0.0, fire - waterExtinguish);
  oil = max(0.0, oil - fire * dt * 0.075);
  // Live plants burn for roughly twelve to eighteen seconds. Once their fuel
  // reaches zero, the same scalar becomes a five-second break/fall/sink clock;
  // untouched bare cells remain at -2 and can never relay or display fire.
  let wasPlantCell = plantFuel > -1.5;
  if (plantFuel > 0.0) {
    let burnIntensity = max(
      fire,
      smoothstep(0.36, 0.72, heat) * 0.58
    );
    plantFuel = max(0.0, plantFuel - burnIntensity * dt * 0.072);
  } else if (wasPlantCell && plantFuel > -0.81) {
    plantFuel = max(-0.82, plantFuel - dt * 0.155);
  }
  vegetationValue = max(
    0.0,
    vegetationValue
      - fire * dt * 0.082 * select(0.0, 1.0, treeFuelCell)
  );
  // Fire is state only where a real rendered tree still has fuel or where oil
  // itself is burning. Blast/radiant heat may cross empty cells, but those
  // cells are never stored as visible or relay-capable fire.
  let supportsTreeFire = wasPlantCell && plantFuel > -0.72;
  let supportsOilFire = oil > 0.003;
  if (!supportsTreeFire && !supportsOilFire) {
    fire = 0.0;
  }
  let localHeat = clamp(
    max(lava * 1.6, fire * 0.82)
      + heat * max(0.0, 1.0 - dt * (0.075 + steam * 1.8)),
    0.0,
    1.0
  );
  // Radiant heat is sourced only by actual fire/lava, never by neighboring
  // heat values, so it cannot recursively flood the map.
  heat = max(
    localHeat,
    max(radiantFire * 0.58, radiantLava * 0.68) * dryFuel
  );
  terrainValue.w = max(
    0.0,
    terrainValue.w - heat * dt * 0.045 + terrainValue.z * dt * 0.03
  );

  stateOut.values[index] = terrainValue;
  vegetation.values[index] = vegetationValue;
  treeFuelMask.values[index] = plantFuel;
  elementsOut.values[index] = vec4f(lava, oil, fire, heat);
}
`,tt=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> elements: ElementBuffer;
@group(0) @binding(3) var<storage, read> waterFlux: StateBuffer;
@group(0) @binding(4) var<storage, read> elementFlux: StateBuffer;

struct FlowAudioBuffer {
  water: atomic<u32>,
  lava: atomic<u32>,
  oil: atomic<u32>,
  fire: atomic<u32>,
  springDepth: atomic<u32>,
  lavaDepth: atomic<u32>,
  lavaReach: atomic<u32>,
  lavaSolidHeight: atomic<u32>,
}

@group(0) @binding(5) var<storage, read_write> audioProbe: FlowAudioBuffer;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }
  let uv = vec2f(gid.xy) / f32(n - 1u);
  let worldXZ = (uv - vec2f(0.5)) * uniforms.world.x;
  let cameraTarget = uniforms.pad0.xy;
  let audibleRadius = clamp(uniforms.pad0.z * 0.72, 18.0, 74.0);
  let listenerDistance = distance(worldXZ, cameraTarget);
  if (listenerDistance >= audibleRadius) {
    return;
  }
  let falloff = 1.0 - smoothstep(0.18, 1.0, listenerDistance / audibleRadius);
  let index = gridIndex(gid.x, gid.y);
  let waterMotion = max(0.0, waterFlux.values[index].x);
  let elementMotion = elementFlux.values[index];
  let lavaMotion = max(0.0, elementMotion.x * elementMotion.y);
  let oilMotion = max(0.0, elementMotion.z * elementMotion.w);
  let elementValue = elements.values[index];
  let terrainValue = state.values[index];
  let inlandMode = step(0.5, uniforms.pad1.z);
  let coastalSpringDistance = distance(worldXZ, vec2f(-11.0, -2.0));
  let quietSpringDistance = distance(worldXZ, vec2f(-47.0, -31.0));
  let strongSpringDistance = distance(worldXZ, vec2f(25.0, 36.0));
  let springDistance = mix(
    coastalSpringDistance,
    min(quietSpringDistance, strongSpringDistance),
    inlandMode
  );
  let inlandSpringStrength = select(
    1.0,
    0.42,
    quietSpringDistance < strongSpringDistance
  );
  let springProbeStrength = mix(1.0, inlandSpringStrength, inlandMode);
  if (springDistance < 0.9) {
    atomicMax(
      &audioProbe.springDepth,
      u32(round(clamp(
        terrainValue.z * springProbeStrength * 4096.0,
        0.0,
        1048575.0
      )))
    );
  }
  let lavaVentCenter = mix(
    vec2f(46.0, -28.0),
    vec2f(2.0, 55.0),
    inlandMode
  );
  let lavaVentDistance = distance(worldXZ, lavaVentCenter);
  if (lavaVentDistance < 0.9) {
    atomicMax(
      &audioProbe.lavaDepth,
      u32(round(clamp(elementValue.x * 4096.0, 0.0, 1048575.0)))
    );
    atomicMax(
      &audioProbe.lavaSolidHeight,
      u32(round(clamp(
        (terrainValue.x + terrainValue.y) * 4096.0,
        0.0,
        1048575.0
      )))
    );
  }
  if (elementValue.x > 0.006) {
    atomicMax(
      &audioProbe.lavaReach,
      u32(round(clamp(lavaVentDistance * 256.0, 0.0, 1048575.0)))
    );
  }
  let audibleFire = elementValue.z
    * (0.45 + elementValue.w * 0.55)
    * (1.0 - smoothstep(0.04, 0.5, terrainValue.z));
  atomicAdd(
    &audioProbe.water,
    u32(round(clamp(waterMotion * falloff * 4096.0, 0.0, 65535.0)))
  );
  atomicAdd(
    &audioProbe.lava,
    u32(round(clamp(lavaMotion * falloff * 8192.0, 0.0, 65535.0)))
  );
  atomicAdd(
    &audioProbe.oil,
    u32(round(clamp(oilMotion * falloff * 6144.0, 0.0, 65535.0)))
  );
  atomicAdd(
    &audioProbe.fire,
    u32(round(clamp(audibleFire * falloff * 1024.0, 0.0, 65535.0)))
  );
}
`,nt=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read_write> flux: StateBuffer;
@group(0) @binding(3) var<storage, read> soil: SoilBuffer;

fn insideCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

fn edgeThreshold(a: vec2i, b: vec2i) -> f32 {
  let edgeCenter = (vec2f(a) + vec2f(b)) * 0.5;
  let variation = mix(0.82, 1.18, hash21(edgeCenter + vec2f(13.7, 41.2)));
  let distanceWeight = length(vec2f(b - a));
  return uniforms.physics.z * uniforms.grid.y * distanceWeight * variation;
}

fn rawSandTransfer(source: vec2i, destination: vec2i) -> f32 {
  let heightDifference = terrainAt(&state, source) - terrainAt(&state, destination);
  let offset = destination - source;
  let cardinal = offset.x == 0 || offset.y == 0;
  let directionWeight = select(0.70710678, 1.0, cardinal);
  return max(0.0, heightDifference - edgeThreshold(source, destination))
    * 0.075
    * directionWeight;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let index = gridIndex(gid.x, gid.y);
  let value = state.values[index];
  let settledSurface = flux.values[index].z;
  let oceanMask = flux.values[index].w;
  let position = vec2i(gid.xy);
  let ni = i32(n);
  var rawOut = 0.0;
  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      if (ox == 0 && oy == 0) {
        continue;
      }
      let neighbor = position + vec2i(ox, oy);
      if (insideCell(neighbor, ni)) {
        rawOut = rawOut + rawSandTransfer(position, neighbor);
      }
    }
  }

  let dirtDepth = clamp(soil.values[index].dirtDepth, 0.0, value.y);
  let availableSand = max(0.0, value.y - dirtDepth);
  let maximumOut = availableSand * 0.14;
  let outScale = select(1.0, min(1.0, maximumOut / rawOut), rawOut > 0.000001);
  flux.values[index] = vec4f(
    rawOut * outScale,
    outScale,
    settledSurface,
    oceanMask
  );
}
`,rt=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> stateIn: StateBuffer;
@group(0) @binding(2) var<storage, read_write> flux: StateBuffer;
@group(0) @binding(3) var<storage, read_write> stateOut: StateBuffer;
@group(0) @binding(4) var<storage, read> soil: SoilBuffer;

fn insideCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

fn edgeThreshold(a: vec2i, b: vec2i) -> f32 {
  let edgeCenter = (vec2f(a) + vec2f(b)) * 0.5;
  let variation = mix(0.82, 1.18, hash21(edgeCenter + vec2f(13.7, 41.2)));
  let distanceWeight = length(vec2f(b - a));
  return uniforms.physics.z * uniforms.grid.y * distanceWeight * variation;
}

fn rawSandTransfer(source: vec2i, destination: vec2i) -> f32 {
  let heightDifference = terrainAt(&stateIn, source) - terrainAt(&stateIn, destination);
  let offset = destination - source;
  let cardinal = offset.x == 0 || offset.y == 0;
  let directionWeight = select(0.70710678, 1.0, cardinal);
  return max(0.0, heightDifference - edgeThreshold(source, destination))
    * 0.075
    * directionWeight;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let index = gridIndex(gid.x, gid.y);
  let value = stateIn.values[index];
  let position = vec2i(gid.xy);
  let ni = i32(n);
  var incoming = 0.0;
  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      if (ox == 0 && oy == 0) {
        continue;
      }
      let neighbor = position + vec2i(ox, oy);
      if (insideCell(neighbor, ni)) {
        let neighborCell = vec2u(neighbor);
        let neighborIndex = gridIndex(neighborCell.x, neighborCell.y);
        incoming = incoming
          + rawSandTransfer(neighbor, position) * flux.values[neighborIndex].y;
      }
    }
  }
  let outgoing = flux.values[index].x;
  let sandMotion = incoming + outgoing;
  // Freshly moving sand loses its settled top dressing. Once stable, faint
  // ripples and debris weather back over roughly twenty seconds.
  let recoveredSurface = min(
    1.0,
    flux.values[index].z + uniforms.grid.z * 0.07
  );
  // Ignore imperceptible background creep; only visible settling or direct
  // manipulation should scrub the surface dressing.
  let disturbance = smoothstep(0.01, 0.14, sandMotion);
  flux.values[index].z = recoveredSurface * (1.0 - disturbance * 0.98);
  stateOut.values[index] = vec4f(
    value.x,
    max(
      clamp(soil.values[index].dirtDepth, 0.0, value.y),
      value.y + incoming - outgoing
    ),
    value.z,
    value.w
  );
}
`,it=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> vegetationIn: ScalarBuffer;
@group(0) @binding(3) var<storage, read_write> vegetationOut: ScalarBuffer;
@group(0) @binding(4) var<storage, read_write> treeFuelMask: ScalarBuffer;
@group(0) @binding(5) var<storage, read> soil: SoilBuffer;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }

  let index = gridIndex(gid.x, gid.y);
  let value = state.values[index];
  let p = vec2i(gid.xy);
  let center = value.x + value.y;
  let dx = terrainAt(&state, p + vec2i(1, 0)) - terrainAt(&state, p + vec2i(-1, 0));
  let dz = terrainAt(&state, p + vec2i(0, 1)) - terrainAt(&state, p + vec2i(0, -1));
  let slope = length(vec2f(dx, dz)) / max(uniforms.grid.y * 2.0, 0.001);

  var nearbyWater = value.z;
  for (var oy = -2; oy <= 2; oy = oy + 1) {
    for (var ox = -2; ox <= 2; ox = ox + 1) {
      let neighbor = clampCell(p + vec2i(ox, oy));
      nearbyWater = max(nearbyWater, state.values[gridIndex(neighbor.x, neighbor.y)].z);
    }
  }

  let soilValue = soil.values[index];
  let dirtDepth = clamp(soilValue.dirtDepth, 0.0, value.y);
  let dirtFraction = dirtDepth / max(value.y, 0.0001);
  let substrateFactor = smoothstep(0.16, 0.62, dirtFraction)
    * smoothstep(0.14, 0.84, value.y);
  let sandTolerance = smoothstep(0.25, 1.15, value.y) * 0.28;
  // Freshly gathered or poured soil carries low compaction and must look
  // disturbed immediately. Mature rooted ground only becomes lush once the
  // bed has settled again; the old non-zero floor left grass on excavations.
  let compactionSuitability = smoothstep(0.22, 0.68, soilValue.compaction);
  let dryFactor = 1.0 - smoothstep(0.035, 0.19, value.z);
  let slopeFactor = 1.0 - smoothstep(0.28, 0.72, slope);
  let lowlandFactor = 1.0 - smoothstep(
    uniforms.physics.w + 10.0,
    uniforms.physics.w + 18.0,
    center
  );
  let ambientMoisture = nearbyWater * 0.24 + lowlandFactor * 0.2;
  let effectiveMoisture = max(value.w, ambientMoisture);
  let moistureFactor = smoothstep(0.015, 0.22, effectiveMoisture)
    * (1.0 - smoothstep(0.72, 0.96, effectiveMoisture));
  let seed = hash21(vec2f(gid.xy) + vec2f(19.3, 77.1));
  var plantFuel = treeFuelMask.values[index];
  let livingPlantedProp = plantFuel > 0.0;
  let proceduralSpacing = smoothstep(0.34, 0.61, seed);
  // Authored palms and scrub are already spatially separated on the CPU.
  // Applying the unrelated field-spacing hash to their exact cells made a
  // mature tree flash down to seedling size on the first vegetation update.
  let spacing = select(proceduralSpacing, 1.0, livingPlantedProp);
  let habitatGrowth = max(sandTolerance, substrateFactor)
    * compactionSuitability
    * dryFactor
    * slopeFactor
    * lowlandFactor
    * moistureFactor
    * spacing;
  let current = vegetationIn.values[index];

  // A planted prop that is completely wiped out by flooding or terrain
  // removal enters a long dormant state. The first negative range remains the
  // five-second burning/fall clock; values at and below -0.82 are a roughly
  // forty-second recovery pause. Bare cells start at -2 and never regrow.
  if (plantFuel > 0.0 && habitatGrowth < 0.015 && current < 0.055) {
    plantFuel = -0.82;
  } else if (plantFuel <= -0.81 && plantFuel > -1.5) {
    plantFuel = max(-1.4, plantFuel - uniforms.grid.z * 0.16);
    if (plantFuel <= -1.38 && habitatGrowth > 0.075) {
      plantFuel = 1.0;
    }
  }
  // Exact prop cells follow their persistent remaining fuel. Other simulation
  // vegetation still grows normally, while a burned rendered plant cannot be
  // resurrected by the moisture pass on the next ping-pong update.
  let persistentFuel = select(
    1.0,
    clamp(plantFuel, 0.0, 1.0),
    plantFuel > -1.5
  );
  // Vegetation density and the scale of an established prop are different
  // quantities. Remap valid habitat for authored plants, retaining their
  // seeded maturity (and therefore the deliberate per-instance size spread).
  // Flooding, erosion, or freshly disturbed low-compaction soil drives the
  // raw habitat below the retention band and still removes them promptly.
  let plantedHabitat = smoothstep(0.025, 0.24, habitatGrowth);
  let maturityRetention = smoothstep(0.025, 0.075, habitatGrowth);
  let plantedTarget = max(plantedHabitat, current * maturityRetention);
  let targetGrowth = select(
    habitatGrowth,
    plantedTarget,
    livingPlantedProp
  ) * persistentFuel;
  let response = select(0.72, 0.34, targetGrowth > current);
  let next = clamp(
    current + (targetGrowth - current) * uniforms.brush.w * response,
    0.0,
    1.0
  );
  vegetationOut.values[index] = next;
  treeFuelMask.values[index] = plantFuel;
}
`,at=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct NpcState {
  pose: vec4f,
  motion: vec4f,
}

struct NpcBuffer {
  values: array<NpcState>,
}

struct HutInstanceBuffer {
  values: array<vec4f>,
}

struct HutDynamics {
  baseline: vec4f,
  collapse: vec4f,
}

struct HutDynamicsBuffer {
  values: array<HutDynamics>,
}

struct EventBuffer {
  npcDeaths: atomic<u32>,
  hutCollapses: atomic<u32>,
  explosions: atomic<u32>,
  pad: atomic<u32>,
}

@group(0) @binding(2) var<storage, read_write> npcs: NpcBuffer;
@group(0) @binding(3) var<storage, read_write> events: EventBuffer;
@group(0) @binding(4) var<storage, read> elements: ElementBuffer;
@group(0) @binding(5) var<storage, read> huts: HutInstanceBuffer;
@group(0) @binding(6) var<storage, read> hutDynamics: HutDynamicsBuffer;

fn stateAtWorld(worldXZ: vec2f) -> vec4f {
  let uv = clamp(
    worldXZ / uniforms.world.x + vec2f(0.5),
    vec2f(0.0),
    vec2f(1.0)
  );
  let cell = vec2u(round(uv * f32(gridSize() - 1u)));
  return state.values[gridIndex(cell.x, cell.y)];
}

fn elementsAtWorld(worldXZ: vec2f) -> vec4f {
  let uv = clamp(
    worldXZ / uniforms.world.x + vec2f(0.5),
    vec2f(0.0),
    vec2f(1.0)
  );
  let cell = vec2u(round(uv * f32(gridSize() - 1u)));
  return elements.values[gridIndex(cell.x, cell.y)];
}

fn insideNpcWorld(worldXZ: vec2f) -> bool {
  let limit = uniforms.world.x * 0.5 - 2.0;
  return abs(worldXZ.x) < limit && abs(worldXZ.y) < limit;
}

fn shortestAngle(goalAngle: f32, currentAngle: f32) -> f32 {
  let difference = goalAngle - currentAngle;
  return atan2(sin(difference), cos(difference));
}

fn rotateNpcTarget(value: vec2f, angle: f32) -> vec2f {
  let c = cos(angle);
  let s = sin(angle);
  return vec2f(value.x * c - value.y * s, value.x * s + value.y * c);
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let npcIndex = gid.x;
  if (npcIndex >= 20u) {
    return;
  }

  var npc = npcs.values[npcIndex];
  let dt = min(uniforms.grid.z, 0.05);
  let time = uniforms.grid.w;
  let timeOfDay = fract(uniforms.pad0.w) * 24.0;

  if (npc.motion.w > 0.0) {
    npc.motion.w = npc.motion.w + dt;
    npc.pose.w = max(0.0, 1.0 - npc.motion.w / 0.65);
    npcs.values[npcIndex] = npc;
    return;
  }

  // Each islander belongs to one village and has a stable assigned hut. A
  // collapsed home is never treated as an indoor destination: search the
  // village's four huts in deterministic order for an intact fallback.
  let villageIndex = npcIndex / 10u;
  let villageFirstHut = villageIndex * 4u;
  let assignedLocalHut = npcIndex % 4u;
  var homeHutIndex = villageFirstHut + assignedLocalHut;
  var shelterAvailable = false;
  for (var homeOffset = 0u; homeOffset < 4u; homeOffset = homeOffset + 1u) {
    let candidateLocal = (assignedLocalHut + homeOffset) % 4u;
    let candidateIndex = villageFirstHut + candidateLocal;
    if (!shelterAvailable && hutDynamics.values[candidateIndex].collapse.x < 0.5) {
      homeHutIndex = candidateIndex;
      shelterAvailable = true;
    }
  }

  let homeHut = huts.values[homeHutIndex];
  let homeOutward = rotateNpcTarget(vec2f(0.0, 1.0), homeHut.z);
  let homeDoor = homeHut.xy + homeOutward * (1.08 * homeHut.w);
  let villageCenter = select(
    vec2f(-28.0, 12.0),
    vec2f(28.0, 18.0),
    villageIndex > 0u
  );
  let seed = npc.motion.z;

  var currentPosition = npc.pose.xy;
  var currentValue = stateAtWorld(currentPosition);
  var currentElement = elementsAtWorld(currentPosition);
  if (
    currentValue.z > 0.22
    || currentElement.x > 0.025
    || currentElement.z > 0.32
  ) {
    // Indoor state and death remain distinct. A sleeping islander caught by a
    // flood/lava still dies, but remains visually inside rather than popping
    // back out for the death animation.
    npc.motion.w = select(max(dt, 0.0001), 0.65, npc.pose.w < 0.0);
    npc.pose.w = max(0.0, 1.0 - npc.motion.w / 0.65);
    atomicAdd(&events.npcDeaths, 1u);
    npcs.values[npcIndex] = npc;
    return;
  }

  // pose.w = -1 is an alive indoor sentinel. Staggered wake-up between
  // 05:27 and 06:36 prevents the whole village appearing in one frame.
  if (npc.pose.w < 0.0) {
    let wakeTime = 5.45 + hash21(vec2f(seed, 61.7)) * 1.15;
    let shouldWake = timeOfDay >= wakeTime && timeOfDay < 19.4;
    let stillInsideValidShelter = shelterAvailable
      && distance(currentPosition, homeHut.xy) < 1.45 * homeHut.w;
    if (stillInsideValidShelter && !shouldWake) {
      npcs.values[npcIndex] = npc;
      return;
    }
    // A collapsed occupied hut forces its residents outside at their current
    // position. They must walk to the selected intact fallback; no teleporting
    // into another building and no invisible occupancy of rubble.
    let wakePosition = select(
      currentPosition,
      homeDoor + homeOutward * 0.18,
      stillInsideValidShelter
    );
    npc.pose.x = wakePosition.x;
    npc.pose.y = wakePosition.y;
    npc.pose.z = atan2(homeOutward.y, homeOutward.x);
    npc.motion.x = npc.pose.z;
    npc.pose.w = 1.0;
    currentPosition = npc.pose.xy;
    currentValue = stateAtWorld(currentPosition);
    currentElement = elementsAtWorld(currentPosition);
  }
  if (npc.pose.w <= 0.0) {
    return;
  }

  // Daily schedule:
  // 06:00-08:15 village morning gathering
  // 08:15-12:15 work/activity patches
  // 12:15-14:00 village midday gathering
  // 14:00-18:09 afternoon activity patches
  // 18:09 onward return home; staggered sleep begins 19:21-20:09.
  // These targets set broad intent only. Terrain/liquid probes below retain
  // control over immediate avoidance and whether a step is actually safe.
  let localIndex = npcIndex % 10u;
  let activityAngle = f32(localIndex) * 2.39996323
    + f32(villageIndex) * 0.73
    + hash21(vec2f(seed, 7.9)) * 0.48;
  let morningTarget = villageCenter
    + vec2f(cos(activityAngle), sin(activityAngle))
      * mix(2.4, 4.8, hash21(vec2f(seed, 13.2)));
  let workAngle = activityAngle
    + select(-0.42, 0.38, (localIndex % 2u) == 0u);
  let workTarget = villageCenter
    + vec2f(cos(workAngle), sin(workAngle))
      * mix(8.0, 13.0, hash21(vec2f(seed, 21.6)));
  let afternoonAngle = activityAngle + 1.17;
  let afternoonTarget = villageCenter
    + vec2f(cos(afternoonAngle), sin(afternoonAngle))
      * mix(6.5, 11.5, hash21(vec2f(seed, 36.4)));
  let middayTarget = villageCenter
    + vec2f(cos(activityAngle + 0.7), sin(activityAngle + 0.7)) * 3.7;

  // One islander per village tends the communal hearth before the settlement
  // retires. Manual time changes immediately select this same schedule target;
  // nobody teleports, so the lighter still has to walk there.
  let campfireDuty = localIndex == 0u
    && timeOfDay >= 17.15
    && timeOfDay < 18.55;
  let returningHome = (
    timeOfDay >= 18.15 || timeOfDay < 6.0
  ) && !campfireDuty;
  var routineTarget = morningTarget;
  if (timeOfDay >= 8.25 && timeOfDay < 12.25) {
    routineTarget = workTarget;
  } else if (timeOfDay >= 12.25 && timeOfDay < 14.0) {
    routineTarget = middayTarget;
  } else if (timeOfDay >= 14.0 && timeOfDay < 18.15) {
    routineTarget = afternoonTarget;
  }
  if (campfireDuty) {
    routineTarget = villageCenter;
  }
  if (returningHome) {
    routineTarget = select(villageCenter, homeDoor, shelterAvailable);
  }

  let toRoutineTarget = routineTarget - currentPosition;
  let routineDistance = length(toRoutineTarget);
  let routineHeading = atan2(toRoutineTarget.y, toRoutineTarget.x);
  let wander = sin(time * 0.43 + seed * 1.73)
    + sin(time * 0.19 + seed * 0.37) * 0.55;
  let wanderScale = select(
    1.0,
    smoothstep(0.45, 3.2, routineDistance),
    returningHome
  );
  npc.motion.x = npc.motion.x + wander * dt * 0.27 * wanderScale;
  let goalDrive = select(
    smoothstep(1.5, 7.0, routineDistance) * 0.72,
    mix(3.1, 4.15, smoothstep(0.35, 3.2, routineDistance)),
    returningHome
  );
  npc.motion.x = npc.motion.x
    + shortestAngle(routineHeading, npc.motion.x) * min(1.0, dt * goalDrive);

  let sleepTime = 19.35 + hash21(vec2f(seed, 83.1)) * 0.8;
  let sleepWindow = timeOfDay >= sleepTime || timeOfDay < 5.45;
  if (
    returningHome
    && sleepWindow
    && shelterAvailable
    && routineDistance < 0.82
  ) {
    // Move the logical point inside the model before hiding it, so hazards at
    // the hut can still reach a sleeping islander on subsequent updates.
    let indoorPosition = homeHut.xy + homeOutward * 0.16;
    npc.pose.x = indoorPosition.x;
    npc.pose.y = indoorPosition.y;
    npc.pose.z = atan2(-homeOutward.y, -homeOutward.x);
    npc.pose.w = -1.0;
    npcs.values[npcIndex] = npc;
    return;
  }

  let desiredDirection = vec2f(cos(npc.motion.x), sin(npc.motion.x));
  let probePosition = currentPosition
    + desiredDirection * (0.72 + npc.motion.y * 0.32);
  let probeValue = stateAtWorld(probePosition);
  let probeElement = elementsAtWorld(probePosition);
  let currentTerrain = currentValue.x + currentValue.y;
  let probeTerrain = probeValue.x + probeValue.y;
  let blocked = !insideNpcWorld(probePosition)
    || probeValue.y < 0.1
    || probeValue.z > 0.1
    || probeElement.x > 0.012
    || probeElement.y > 0.045
    || probeElement.z > 0.12
    || abs(probeTerrain - currentTerrain) > 0.48;

  if (blocked) {
    let turnNoise = hash21(vec2f(seed, floor(time * 2.1) + f32(npcIndex)));
    npc.motion.x = npc.motion.x
      + mix(1.55, 3.0, turnNoise)
      * select(-1.0, 1.0, turnNoise > 0.5);
  }

  npc.pose.z = npc.pose.z
    + shortestAngle(npc.motion.x, npc.pose.z) * min(1.0, dt * 3.9);
  let walkDirection = vec2f(cos(npc.pose.z), sin(npc.pose.z));
  let returnSpeed = select(1.0, 1.22, returningHome && routineDistance > 1.5);
  let nextPosition = currentPosition
    + walkDirection * npc.motion.y * returnSpeed * dt;
  let nextValue = stateAtWorld(nextPosition);
  let nextElement = elementsAtWorld(nextPosition);
  let nextTerrain = nextValue.x + nextValue.y;
  let canAdvance = insideNpcWorld(nextPosition)
    && nextValue.y > 0.075
    && nextValue.z < 0.14
    && nextElement.x < 0.01
    && nextElement.y < 0.04
    && nextElement.z < 0.1
    && abs(nextTerrain - currentTerrain) < 0.42;
  if (canAdvance) {
    npc.pose.x = nextPosition.x;
    npc.pose.y = nextPosition.y;
  } else {
    npc.motion.x = npc.motion.x + 2.35;
  }

  npcs.values[npcIndex] = npc;
}
`,ot=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct HutInstanceBuffer {
  values: array<vec4f>,
}

struct HutDynamics {
  baseline: vec4f,
  collapse: vec4f,
}

struct HutDynamicsBuffer {
  values: array<HutDynamics>,
}

struct EventBuffer {
  npcDeaths: atomic<u32>,
  hutCollapses: atomic<u32>,
  explosions: atomic<u32>,
  pad: atomic<u32>,
}

@group(0) @binding(2) var<storage, read> huts: HutInstanceBuffer;
@group(0) @binding(3) var<storage, read_write> hutDynamics: HutDynamicsBuffer;
@group(0) @binding(4) var<storage, read_write> events: EventBuffer;
@group(0) @binding(5) var<storage, read_write> elements: ElementBuffer;

fn stateAtWorld(worldXZ: vec2f) -> vec4f {
  let uv = clamp(
    worldXZ / uniforms.world.x + vec2f(0.5),
    vec2f(0.0),
    vec2f(1.0)
  );
  let cell = vec2u(round(uv * f32(gridSize() - 1u)));
  return state.values[gridIndex(cell.x, cell.y)];
}

fn elementsAtWorld(worldXZ: vec2f) -> vec4f {
  let uv = clamp(
    worldXZ / uniforms.world.x + vec2f(0.5),
    vec2f(0.0),
    vec2f(1.0)
  );
  let cell = vec2u(round(uv * f32(gridSize() - 1u)));
  return elements.values[gridIndex(cell.x, cell.y)];
}

fn rotate2(value: vec2f, angle: f32) -> vec2f {
  let c = cos(angle);
  let s = sin(angle);
  return vec2f(value.x * c - value.y * s, value.x * s + value.y * c);
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let hutIndex = gid.x;
  if (hutIndex >= 8u) {
    return;
  }

  let hut = huts.values[hutIndex];
  let radius = 1.05 * hut.w;
  let offsets = array<vec2f, 5>(
    vec2f(0.0),
    vec2f(radius, 0.0),
    vec2f(-radius, 0.0),
    vec2f(0.0, radius),
    vec2f(0.0, -radius)
  );

  var terrainSum = 0.0;
  var minimumTerrain = 100000.0;
  var maximumTerrain = -100000.0;
  var maximumWater = 0.0;
  var maximumLava = 0.0;
  var maximumFire = 0.0;
  var maximumHeat = 0.0;
  for (var sampleIndex = 0u; sampleIndex < 5u; sampleIndex = sampleIndex + 1u) {
    let samplePosition = hut.xy + rotate2(offsets[sampleIndex], hut.z);
    let value = stateAtWorld(samplePosition);
    let elementValue = elementsAtWorld(samplePosition);
    let terrain = value.x + value.y;
    terrainSum = terrainSum + terrain;
    minimumTerrain = min(minimumTerrain, terrain);
    maximumTerrain = max(maximumTerrain, terrain);
    maximumWater = max(maximumWater, value.z);
    maximumLava = max(maximumLava, elementValue.x);
    maximumFire = max(maximumFire, elementValue.z);
    maximumHeat = max(maximumHeat, elementValue.w);
  }

  let meanTerrain = terrainSum / 5.0;
  let relief = maximumTerrain - minimumTerrain;
  var dynamics = hutDynamics.values[hutIndex];
  if (dynamics.baseline.w < 0.5) {
    dynamics.baseline = vec4f(meanTerrain, relief, maximumWater, 1.0);
    dynamics.collapse = vec4f(
      0.0,
      0.0,
      hash21(hut.xy + vec2f(f32(hutIndex) * 7.1, 29.4)),
      0.0
    );
    hutDynamics.values[hutIndex] = dynamics;
    return;
  }

  let meanShift = abs(meanTerrain - dynamics.baseline.x);
  let reliefIncrease = relief - dynamics.baseline.y;
  let suddenWater = maximumWater - dynamics.baseline.z;
  let monitorDt = min(uniforms.grid.z, 0.05);
  // collapse.w is accumulated burn exposure. Open flame destroys a hut after
  // roughly 8--12 seconds; sustained radiant heat from nearby lava can ignite
  // it more slowly. Cooling lets the exposure recede instead of permanently
  // condemning a briefly singed hut.
  let radiantBurn = smoothstep(0.36, 0.72, maximumHeat) * 0.62;
  let burnDrive = max(maximumFire, radiantBurn);
  let recovery = select(0.055, 0.0, burnDrive > 0.035);
  dynamics.collapse.w = max(
    0.0,
    dynamics.collapse.w + burnDrive * monitorDt - recovery * monitorDt
  );
  let shouldCollapse = meanShift > 0.85
    || reliefIncrease > 0.75
    || suddenWater > 0.42
    || maximumWater > 1.45
    || maximumLava > 0.025
    || dynamics.collapse.w > 7.0;

  if (dynamics.collapse.x < 0.5 && shouldCollapse) {
    dynamics.collapse.x = 1.0;
    dynamics.collapse.y = uniforms.grid.w;
    atomicAdd(&events.hutCollapses, 1u);
  }
  // A genuinely burning hut is itself a fuel source. Store one invisible
  // element-cell flame at its centre so nearby *real* plants can accumulate
  // embers; elementUpdate clears it from bare sand each tick, and this monitor
  // renews it only while the hut remains intact and actively burning.
  if (dynamics.collapse.x < 0.5 && dynamics.collapse.w > 0.34) {
    let sourceUv = clamp(
      hut.xy / uniforms.world.x + vec2f(0.5),
      vec2f(0.0),
      vec2f(1.0)
    );
    let sourceCell = vec2u(round(sourceUv * f32(gridSize() - 1u)));
    let sourceIndex = gridIndex(sourceCell.x, sourceCell.y);
    var sourceElement = elements.values[sourceIndex];
    let sourceFlame = smoothstep(0.34, 2.25, dynamics.collapse.w);
    sourceElement.z = max(sourceElement.z, sourceFlame * 0.72);
    sourceElement.w = max(sourceElement.w, sourceFlame * 0.82);
    elements.values[sourceIndex] = sourceElement;
  }
  dynamics.baseline.z = maximumWater;
  hutDynamics.values[hutIndex] = dynamics;
}
`,st=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct CampfireInstanceBuffer {
  values: array<vec4f>,
}

struct CampfireDynamics {
  baseline: vec4f,
  status: vec4f,
}

struct CampfireDynamicsBuffer {
  values: array<CampfireDynamics>,
}

struct NpcState {
  pose: vec4f,
  motion: vec4f,
}

struct NpcBuffer {
  values: array<NpcState>,
}

@group(0) @binding(2) var<storage, read> campfires: CampfireInstanceBuffer;
@group(0) @binding(3) var<storage, read_write> dynamicsBuffer: CampfireDynamicsBuffer;
@group(0) @binding(4) var<storage, read_write> elements: ElementBuffer;
@group(0) @binding(5) var<storage, read> npcs: NpcBuffer;

fn campfireStateAtWorld(worldXZ: vec2f) -> vec4f {
  let uv = clamp(
    worldXZ / uniforms.world.x + vec2f(0.5),
    vec2f(0.0),
    vec2f(1.0)
  );
  let cell = vec2u(round(uv * f32(gridSize() - 1u)));
  return state.values[gridIndex(cell.x, cell.y)];
}

fn campfireElementsAtWorld(worldXZ: vec2f) -> vec4f {
  let uv = clamp(
    worldXZ / uniforms.world.x + vec2f(0.5),
    vec2f(0.0),
    vec2f(1.0)
  );
  let cell = vec2u(round(uv * f32(gridSize() - 1u)));
  return elements.values[gridIndex(cell.x, cell.y)];
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let campfireIndex = gid.x;
  if (campfireIndex >= 2u) {
    return;
  }

  let campfire = campfires.values[campfireIndex];
  let radius = 0.82 * campfire.w;
  let offsets = array<vec2f, 5>(
    vec2f(0.0),
    vec2f(radius, 0.0),
    vec2f(-radius, 0.0),
    vec2f(0.0, radius),
    vec2f(0.0, -radius)
  );
  var terrainSum = 0.0;
  var minimumTerrain = 100000.0;
  var maximumTerrain = -100000.0;
  var maximumWater = 0.0;
  var maximumLava = 0.0;
  for (var sampleIndex = 0u; sampleIndex < 5u; sampleIndex = sampleIndex + 1u) {
    let samplePosition = campfire.xy + offsets[sampleIndex];
    let terrainValue = campfireStateAtWorld(samplePosition);
    let elementValue = campfireElementsAtWorld(samplePosition);
    let terrainHeight = terrainValue.x + terrainValue.y;
    terrainSum = terrainSum + terrainHeight;
    minimumTerrain = min(minimumTerrain, terrainHeight);
    maximumTerrain = max(maximumTerrain, terrainHeight);
    maximumWater = max(maximumWater, terrainValue.z);
    maximumLava = max(maximumLava, elementValue.x);
  }

  let meanTerrain = terrainSum / 5.0;
  let relief = maximumTerrain - minimumTerrain;
  var dynamics = dynamicsBuffer.values[campfireIndex];
  if (dynamics.baseline.w < 0.5) {
    dynamics.baseline = vec4f(meanTerrain, relief, maximumWater, 1.0);
    dynamics.status = vec4f(0.0, 0.0, 0.0, 0.0);
    dynamicsBuffer.values[campfireIndex] = dynamics;
    return;
  }

  let meanShift = abs(meanTerrain - dynamics.baseline.x);
  let reliefIncrease = relief - dynamics.baseline.y;
  let suddenWater = maximumWater - dynamics.baseline.z;
  let shouldCollapse = meanShift > 0.72
    || reliefIncrease > 0.62
    || suddenWater > 0.48
    || maximumWater > 1.15
    || maximumLava > 0.035;
  if (dynamics.status.x < 0.5 && shouldCollapse) {
    dynamics.status.x = 1.0;
    dynamics.status.y = uniforms.grid.w;
    dynamics.status.z = 0.0;
  }

  let timeOfDay = fract(uniforms.pad0.w) * 24.0;
  let eveningWindow = timeOfDay >= 17.15 && timeOfDay < 20.45;
  if (!eveningWindow || maximumWater > 0.085 || dynamics.status.x >= 0.5) {
    dynamics.status.z = 0.0;
  } else if (dynamics.status.z < 0.5) {
    // The designated evening islander walks to the communal center. Lighting
    // happens only after a real, living NPC actually reaches the hearth.
    var villagerArrived = false;
    for (var npcIndex = 0u; npcIndex < 20u; npcIndex = npcIndex + 1u) {
      let npc = npcs.values[npcIndex];
      villagerArrived = villagerArrived || (
        npc.pose.w > 0.0
          && npc.motion.w <= 0.0
          && distance(npc.pose.xy, campfire.xy) < 2.65
      );
    }
    if (villagerArrived) {
      dynamics.status.z = 1.0;
    }
  }

  if (dynamics.status.z > 0.5 && dynamics.status.x < 0.5) {
    let sourceUv = clamp(
      campfire.xy / uniforms.world.x + vec2f(0.5),
      vec2f(0.0),
      vec2f(1.0)
    );
    let sourceCell = vec2u(round(sourceUv * f32(gridSize() - 1u)));
    let sourceIndex = gridIndex(sourceCell.x, sourceCell.y);
    var sourceElement = elements.values[sourceIndex];
    sourceElement.z = max(sourceElement.z, 0.68);
    sourceElement.w = max(sourceElement.w, 0.74);
    elements.values[sourceIndex] = sourceElement;
  }

  dynamics.baseline.z = maximumWater;
  dynamicsBuffer.values[campfireIndex] = dynamics;
}
`,L=String.raw`
struct FrameUniforms {
  viewProjection: mat4x4f,
  inverseViewProjection: mat4x4f,
  cameraPosition: vec4f,
  cameraRight: vec4f,
  cameraUpTime: vec4f,
  world: vec4f,
  sun: vec4f,
  brushVisual: vec4f,
  fog: vec4f,
  pad: vec4f,
}

struct StateBuffer {
  values: array<vec4f>,
}

struct ElementBuffer {
  values: array<vec4f>,
}

struct ScalarBuffer {
  values: array<f32>,
}

struct HitBuffer {
  value: vec4f,
  material: vec4f,
}

fn gridSize() -> u32 {
  return u32(frame.world.y);
}

fn gridIndex(x: u32, y: u32) -> u32 {
  return y * gridSize() + x;
}

fn cellFromWorld(worldXZ: vec2f) -> vec2u {
  let uv = clamp(worldXZ / frame.world.x + vec2f(0.5), vec2f(0.0), vec2f(1.0));
  return vec2u(round(uv * f32(gridSize() - 1u)));
}

fn cellHeight(buffer: ptr<storage, StateBuffer, read>, p: vec2i, includeWater: bool) -> f32 {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  let value = (*buffer).values[gridIndex(cell.x, cell.y)];
  return value.x + value.y + select(0.0, value.z, includeWater);
}

fn terrainNormal(buffer: ptr<storage, StateBuffer, read>, cell: vec2u, includeWater: bool) -> vec3f {
  let p = vec2i(cell);
  let cellSize = frame.world.x / f32(gridSize() - 1u);
  let left = cellHeight(buffer, p + vec2i(-1, 0), includeWater);
  let right = cellHeight(buffer, p + vec2i(1, 0), includeWater);
  let down = cellHeight(buffer, p + vec2i(0, -1), includeWater);
  let up = cellHeight(buffer, p + vec2i(0, 1), includeWater);
  return normalize(vec3f(left - right, cellSize * 2.0, down - up));
}

fn hash21(p: vec2f) -> f32 {
  let p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  let q = p3 + dot(p3, p3.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

fn noise2(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn gradientDirection(cell: vec2f) -> vec2f {
  // A compact fixed gradient table avoids eight trigonometric evaluations per
  // water pixel while retaining the smooth directional variety of Perlin
  // noise. This matters because water often fills most of the screen.
  let selector = u32(
    floor(hash21(cell + vec2f(19.17, 73.41)) * 8.0)
  );
  switch selector {
    case 0u: { return vec2f(1.0, 0.0); }
    case 1u: { return vec2f(-1.0, 0.0); }
    case 2u: { return vec2f(0.0, 1.0); }
    case 3u: { return vec2f(0.0, -1.0); }
    case 4u: { return vec2f(0.70710678, 0.70710678); }
    case 5u: { return vec2f(-0.70710678, 0.70710678); }
    case 6u: { return vec2f(0.70710678, -0.70710678); }
    default: { return vec2f(-0.70710678, -0.70710678); }
  }
}

fn gradientNoiseSigned(p: vec2f) -> f32 {
  let cell = floor(p);
  let local = fract(p);
  let fade = local * local * local * (local * (local * 6.0 - 15.0) + 10.0);
  let n00 = dot(gradientDirection(cell), local);
  let n10 = dot(gradientDirection(cell + vec2f(1.0, 0.0)), local - vec2f(1.0, 0.0));
  let n01 = dot(gradientDirection(cell + vec2f(0.0, 1.0)), local - vec2f(0.0, 1.0));
  let n11 = dot(gradientDirection(cell + vec2f(1.0, 1.0)), local - vec2f(1.0, 1.0));
  return mix(mix(n00, n10, fade.x), mix(n01, n11, fade.x), fade.y) * 1.41421356;
}

fn layeredGradientNoise(p0: vec2f) -> f32 {
  var p = p0;
  var amplitude = 0.58;
  var total = 0.0;
  var weight = 0.0;
  for (var octave = 0; octave < 3; octave = octave + 1) {
    total = total + gradientNoiseSigned(p) * amplitude;
    weight = weight + amplitude;
    p = mat2x2f(1.68, 1.08, -1.08, 1.68) * p + vec2f(5.7, -3.2);
    amplitude = amplitude * 0.48;
  }
  return total / weight;
}

fn waterOpticalField(worldXZ: vec2f, time: f32) -> vec4f {
  // Two long, wind-biased waves supply broad optical relief. Their directions,
  // wavelengths, and speeds are deliberately non-commensurate, and smooth
  // world-space noise bends their phase. This avoids both a crossed-wave bubble
  // grid and any dependence on the simulation cells.
  let driftA = vec2f(time * 0.0024, -time * 0.0016);
  let driftB = vec2f(-time * 0.0017, time * 0.0012);
  let organic = gradientNoiseSigned(
    worldXZ * 0.043 + driftA + vec2f(17.3, -8.6)
  );
  let detail = gradientNoiseSigned(
    mat2x2f(0.62, 0.785, -0.785, 0.62) * worldXZ * 0.108
      + driftB
      + vec2f(-4.7, 23.2)
  );
  let directionA = normalize(vec2f(0.89, 0.456));
  let directionB = normalize(vec2f(0.735, 0.678));
  let phaseA = dot(worldXZ, directionA) * 0.092
    + time * 0.031
    + organic * 0.9
    + detail * 0.22;
  let phaseB = dot(worldXZ, directionB) * 0.163
    - time * 0.044
    + organic * 0.43
    - detail * 0.31;
  let slope = directionA * cos(phaseA) * 0.0125
    + directionB * cos(phaseB) * 0.007;
  return vec4f(organic, detail, slope);
}

fn waterMicroField(worldXZ: vec2f, time: f32, warp: vec2f) -> vec4f {
  // A small spectrum of wind-aligned sine waves provides always-present ripples.
  // The analytic derivatives form the normal directly, following the sum-of-
  // waves method used for real-time water. All directions stay inside one wind
  // fan, so their interference reads as wavelets rather than a bubble lattice.
  let directionA = normalize(vec2f(0.962, 0.273));
  let directionB = normalize(vec2f(0.823, 0.568));
  let directionC = normalize(vec2f(0.668, 0.744));
  let phaseA = dot(worldXZ, directionA) * 0.42
    + time * 0.48
    + warp.x * 0.55
    + warp.y * 0.17;
  let phaseB = dot(worldXZ, directionB) * 0.79
    - time * 0.68
    + warp.x * 0.31
    + warp.y * 0.46;
  let phaseC = dot(worldXZ, directionC) * 1.34
    + time * 0.94
    + warp.x * 0.18
    - warp.y * 0.61;
  let waveA = sin(phaseA);
  let waveB = sin(phaseB);
  let waveC = sin(phaseC);
  let slope = directionA * cos(phaseA) * 0.014
    + directionB * cos(phaseB) * 0.008
    + directionC * cos(phaseC) * 0.0045;
  let signal = clamp(waveA * 0.52 + waveB * 0.31 + waveC * 0.17, -1.0, 1.0);
  let crest = clamp(
    max(0.0, waveA) * 0.5
      + max(0.0, waveB) * 0.34
      + max(0.0, waveC) * 0.16,
    0.0,
    1.0
  );
  return vec4f(slope, signal, crest);
}

fn skyColor(worldPosition: vec3f) -> vec3f {
  let heightTint = clamp((worldPosition.y + 4.0) / 34.0, 0.0, 1.0);
  let dayFactor = frame.pad.w;
  let phase = (frame.world.w * 24.0 - 6.0) / 24.0 * 6.28318530718;
  let twilight = exp(-abs(sin(phase)) * 8.0);
  let nightSky = mix(
    vec3f(0.018, 0.052, 0.105),
    vec3f(0.055, 0.105, 0.17),
    heightTint
  );
  let daySky = mix(
    vec3f(0.16, 0.55, 0.62),
    vec3f(0.39, 0.71, 0.76),
    heightTint
  );
  var color = mix(nightSky, daySky, dayFactor);
  color = color + vec3f(0.35, 0.105, 0.035)
    * twilight
    * (0.35 + dayFactor * 0.45)
    * (1.0 - heightTint);
  return color;
}

fn lightColor(
  worldPosition: vec3f,
  normal: vec3f,
  albedo: vec3f,
  emissive: f32
) -> vec3f {
  let diffuse = max(dot(normal, normalize(frame.sun.xyz)), 0.0);
  let horizon = clamp(normal.y * 0.5 + 0.5, 0.0, 1.0);
  let keyLight = frame.pad.xyz * diffuse * frame.sun.w;
  let nightFill = mix(
    vec3f(0.055, 0.085, 0.15),
    vec3f(0.17, 0.23, 0.33),
    horizon
  ) * 0.78;
  let dayFill = mix(
    vec3f(0.12, 0.2, 0.27),
    vec3f(0.43, 0.63, 0.64),
    horizon
  ) * 0.57;
  // Ambient fill remains throughout the cycle. Only one directional key is
  // ever active: the sun by day and the full moon by night.
  let ambientFill = mix(nightFill, dayFill, frame.pad.w);
  let distanceToCamera = distance(frame.cameraPosition.xyz, worldPosition);
  let fogAmount = smoothstep(frame.fog.x, frame.fog.y, distanceToCamera);
  let lit = albedo * (keyLight + ambientFill) + albedo * emissive;
  return mix(lit, skyColor(worldPosition), fogAmount * 0.82);
}
`,ct=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;

struct SkyOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f,
}

@vertex
fn vertexMain(@location(0) meshPosition: vec3f) -> SkyOutput {
  let uv = meshPosition.xz / frame.world.x + vec2f(0.5);
  let vertical = clamp(uv.y, 0.0, 1.0);
  let dayFactor = frame.pad.w;
  let dayPhase = (frame.world.w * 24.0 - 6.0) / 24.0 * 6.28318530718;
  let twilight = exp(-abs(sin(dayPhase)) * 7.5);
  // Project the active directional light as a point at infinity. w=0 removes
  // camera translation while preserving camera orbit and pitch, so the disc is
  // fixed to its world direction and disappears naturally behind the viewer.
  let celestialClip = frame.viewProjection * vec4f(frame.sun.xyz, 0.0);
  let celestialNdc = celestialClip.xy / max(abs(celestialClip.w), 0.0001);
  let celestialUv = celestialNdc * 0.5 + vec2f(0.5);
  let celestialFront = smoothstep(0.015, 0.12, celestialClip.w);
  let celestialViewport = 1.0 - smoothstep(
    0.94,
    1.08,
    max(abs(celestialNdc.x), abs(celestialNdc.y))
  );
  let celestialVisibility = celestialFront * celestialViewport;
  let horizonGlow = exp(-abs(vertical - 0.76) * 13.0);
  let daySky = mix(
    vec3f(0.11, 0.44, 0.56),
    vec3f(0.30, 0.70, 0.80),
    smoothstep(0.62, 1.0, vertical)
  );
  let nightSky = mix(
    vec3f(0.008, 0.024, 0.068),
    vec3f(0.045, 0.09, 0.17),
    smoothstep(0.54, 1.0, vertical)
  );
  var sky = mix(nightSky, daySky, dayFactor);
  sky = sky + vec3f(0.56, 0.135, 0.025)
    * horizonGlow
    * twilight
    * (0.38 + dayFactor * 0.62);
  let oceanDepth = smoothstep(0.0, 0.76, vertical);
  // The actual simulated sea supplies moving wave detail. The far background
  // stays very broad so its screen-space mesh cannot read as diagonal bands.
  let broadWater = noise2(
    (uv - vec2f(0.5)) * vec2f(2.4, 1.8)
  ) * 2.0 - 1.0;
  let dayOcean = mix(
    vec3f(0.008, 0.15, 0.235),
    vec3f(0.105, 0.52, 0.59),
    oceanDepth
  );
  let nightOcean = mix(
    vec3f(0.004, 0.025, 0.075),
    vec3f(0.018, 0.13, 0.22),
    oceanDepth
  );
  var ocean = mix(nightOcean, dayOcean, dayFactor);
  ocean = ocean + vec3f(0.07, 0.27, 0.31) * broadWater * 0.012;
  let reflectionPath = (
    1.0 - smoothstep(
      0.07,
      0.31,
      abs(uv.x - celestialUv.x)
    )
  ) * celestialVisibility;
  let brokenGlint = smoothstep(0.38, 0.82, broadWater);
  ocean = ocean + frame.pad.xyz
    * reflectionPath
    * (0.006 + brokenGlint * 0.022)
    * frame.sun.w
    * smoothstep(0.05, 0.7, vertical);
  let oceanMask = 1.0 - smoothstep(0.735, 0.79, vertical);
  var color = mix(sky, ocean, oceanMask);
  let inlandMode = step(0.5, frame.brushVisual.w);
  let dayEarthHorizon = mix(
    vec3f(0.2, 0.145, 0.075),
    vec3f(0.38, 0.315, 0.19),
    oceanDepth
  );
  let nightEarthHorizon = mix(
    vec3f(0.035, 0.038, 0.032),
    vec3f(0.09, 0.085, 0.06),
    oceanDepth
  );
  let earthHorizon = mix(nightEarthHorizon, dayEarthHorizon, dayFactor)
    * (1.0 + broadWater * 0.035);
  color = mix(
    color,
    mix(sky, earthHorizon, oceanMask),
    inlandMode
  );
  color = color + mix(
    vec3f(0.075, 0.105, 0.16),
    vec3f(0.27, 0.29, 0.2),
    dayFactor
  ) * horizonGlow * 0.28;
  let celestialDelta = uv - celestialUv;
  let celestialDistance = length(vec2f(
    celestialDelta.x * max(1.0, frame.cameraPosition.w),
    celestialDelta.y
  ));
  let celestialHalo = exp(-celestialDistance * celestialDistance * 238.0);
  let moonDisc = 1.0 - smoothstep(
    0.012,
    0.018,
    celestialDistance
  );
  let sunDisc = 1.0 - smoothstep(
    0.013,
    0.021,
    celestialDistance
  );
  color = color + frame.pad.xyz
    * celestialHalo
    * celestialVisibility
    * max(frame.sun.w, dayFactor * 0.16)
    * mix(0.64, 0.46, dayFactor);
  color = color + mix(
    vec3f(1.16, 0.48, 0.12),
    vec3f(1.12, 1.0, 0.75),
    smoothstep(0.28, 0.8, frame.sun.y)
  )
    * sunDisc
    * celestialVisibility
    * dayFactor
    * (0.42 + frame.sun.w * 0.72);
  color = color + vec3f(0.7, 0.79, 0.94)
    * moonDisc
    * celestialVisibility
    * (1.0 - dayFactor)
    * frame.sun.w
    * 0.62;
  var output: SkyOutput;
  output.position = vec4f(uv * 2.0 - vec2f(1.0), 0.9999, 1.0);
  output.color = color;
  return output;
}

@fragment
fn fragmentMain(input: SkyOutput) -> @location(0) vec4f {
  return vec4f(input.color, 1.0);
}
`,lt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;

struct OceanInput {
  @location(0) position: vec3f,
}

struct OceanOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
}

fn inlandContinuationHeight(worldXZ: vec2f) -> f32 {
  let halfWorld = frame.world.x * 0.5;
  // The simulated margin is exactly 6.1 high. Far-earth relief fades in only
  // after leaving that square, so every coarse continuation triangle shares
  // the same boundary height and cannot expose a diagonal join.
  let outsideDelta = max(
    abs(worldXZ) - vec2f(halfWorld),
    vec2f(0.0)
  );
  let outsideDistance = length(outsideDelta);
  let farReliefBlend = smoothstep(0.0, 150.0, outsideDistance);
  let broadEarth = gradientNoiseSigned(worldXZ * 0.008 + vec2f(7.0, -3.0));
  let rollingEarth = gradientNoiseSigned(worldXZ * 0.026 + vec2f(-11.0, 6.0));
  let continuationHeight = 6.1
    + (broadEarth * 1.15 + rollingEarth * 0.36) * farReliefBlend;
  // The continuation also sits beneath the simulated sheet. The opaque inner
  // terrain normally hides it; its matching flat height is only revealed by
  // the protected-margin alpha blend near the editable world's perimeter.
  return continuationHeight;
}

@vertex
fn vertexMain(input: OceanInput) -> OceanOutput {
  let inlandMode = step(0.5, frame.brushVisual.w);
  let continuationHeight = inlandContinuationHeight(input.position.xz);
  let worldPosition = vec3f(
    input.position.x,
    mix(frame.world.z + 0.045, continuationHeight, inlandMode),
    input.position.z
  );
  var output: OceanOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  return output;
}

@fragment
fn fragmentMain(input: OceanOutput) -> @location(0) vec4f {
  let time = frame.cameraUpTime.w;
  let worldXZ = input.worldPosition.xz;
  let inlandMode = step(0.5, frame.brushVisual.w);
  if (inlandMode > 0.5) {
    let broadEarth = gradientNoiseSigned(worldXZ * 0.018 + vec2f(7.0, -3.0));
    let mesoEarth = gradientNoiseSigned(worldXZ * 0.071 + vec2f(-13.0, 8.0));
    let dayEarth = mix(
      vec3f(0.205, 0.14, 0.07),
      vec3f(0.39, 0.285, 0.14),
      clamp(0.5 + broadEarth * 0.58 + mesoEarth * 0.18, 0.0, 1.0)
    );
    let nightEarth = dayEarth * vec3f(0.16, 0.2, 0.24);
    var earthColor = mix(nightEarth, dayEarth, frame.pad.w);
    let distanceToCamera = distance(frame.cameraPosition.xyz, input.worldPosition);
    earthColor = mix(
      earthColor,
      skyColor(input.worldPosition),
      smoothstep(frame.fog.x, frame.fog.y, distanceToCamera)
    );
    return vec4f(earthColor, 1.0);
  }
  let organic = gradientNoiseSigned(
    worldXZ * 0.043
      + vec2f(time * 0.0024, -time * 0.0016)
      + vec2f(17.3, -8.6)
  );

  // Three non-harmonic, wind-biased waves create fine ripples and analytic
  // normals. Their directions sit in one wind fan rather than crossing at right
  // angles, which prevents the bubble/checker pattern seen at overview zoom.
  let directionA = normalize(vec2f(0.962, 0.273));
  let directionB = normalize(vec2f(0.823, 0.568));
  let directionC = normalize(vec2f(0.668, 0.744));
  let phaseA = dot(worldXZ, directionA) * 0.31
    + time * 0.36
    + organic * 0.72;
  let phaseB = dot(worldXZ, directionB) * 0.61
    - time * 0.53
    + organic * 0.41;
  let phaseC = dot(worldXZ, directionC) * 1.07
    + time * 0.79
    - organic * 0.36;
  let waveA = sin(phaseA);
  let waveB = sin(phaseB);
  let waveC = sin(phaseC);
  let pixelFootprint = length(fwidth(worldXZ));
  let microVisibility = 1.0 - smoothstep(0.72, 2.6, pixelFootprint);
  let slope = (
    directionA * cos(phaseA) * 0.017
      + directionB * cos(phaseB) * 0.009
      + directionC * cos(phaseC) * 0.0045
  ) * microVisibility;
  let normal = normalize(vec3f(-slope.x * 2.7, 1.0, -slope.y * 2.7));
  let waveSignal = clamp(
    waveA * 0.52 + waveB * 0.31 + waveC * 0.17,
    -1.0,
    1.0
  ) * microVisibility;

  let viewDirection = normalize(frame.cameraPosition.xyz - input.worldPosition);
  let sunDirection = normalize(frame.sun.xyz);
  let ndv = max(dot(viewDirection, normal), 0.0);
  let fresnel = 0.04 + 0.96 * pow(1.0 - ndv, 4.4);
  let reflectedView = reflect(-viewDirection, normal);
  let reflectionHeight = smoothstep(-0.16, 0.82, reflectedView.y);
  let dayReflection = mix(
    vec3f(0.13, 0.43, 0.5),
    vec3f(0.4, 0.72, 0.76),
    reflectionHeight
  );
  let nightReflection = mix(
    vec3f(0.014, 0.055, 0.12),
    vec3f(0.085, 0.17, 0.29),
    reflectionHeight
  );
  let reflectedSky = mix(nightReflection, dayReflection, frame.pad.w);

  let textureSignal = clamp(organic * 0.58 + waveSignal * 0.42, -1.0, 1.0);
  let dayWater = mix(
    vec3f(0.012, 0.185, 0.285),
    vec3f(0.055, 0.375, 0.445),
    clamp(0.5 + textureSignal * 0.22, 0.0, 1.0)
  );
  let nightWater = mix(
    vec3f(0.004, 0.03, 0.085),
    vec3f(0.016, 0.12, 0.205),
    clamp(0.5 + textureSignal * 0.18, 0.0, 1.0)
  );
  var color = mix(nightWater, dayWater, frame.pad.w);
  color = mix(
    color,
    reflectedSky,
    clamp(0.12 + fresnel * 0.66, 0.0, 0.9)
  );

  let reflectedLight = max(
    dot(reflect(-sunDirection, normal), viewDirection),
    0.0
  );
  let broadSpecular = pow(reflectedLight, mix(16.0, 24.0, frame.pad.w));
  let broadBreakup = clamp(
    0.48 + waveSignal * 0.24 + organic * 0.14,
    0.0,
    1.0
  );
  color = color + frame.pad.xyz
    * frame.sun.w
    * broadSpecular
    * broadBreakup
    * mix(0.07, 0.15, frame.pad.w);

  // A sharp lobe intersected by two rare smooth-noise events produces only a
  // handful of tiny glints. There is no periodic ridge or decal lattice.
  let sparseGlintMask = smoothstep(0.7, 0.88, organic)
    * smoothstep(0.56, 0.84, waveSignal);
  let sharpSpecular = pow(
    reflectedLight,
    mix(72.0, 108.0, frame.pad.w)
  );
  color = color + frame.pad.xyz
    * frame.sun.w
    * sharpSpecular
    * sparseGlintMask
    * mix(0.42, 0.9, frame.pad.w);

  let distanceToCamera = distance(frame.cameraPosition.xyz, input.worldPosition);
  let fogAmount = smoothstep(frame.fog.x, frame.fog.y, distanceToCamera);
  color = mix(color, skyColor(input.worldPosition), fogAmount);
  return vec4f(color, 1.0);
}
`,ut=L+Me+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> hit: HitBuffer;
@group(0) @binding(3) var<storage, read> sandFlux: StateBuffer;
@group(0) @binding(4) var<storage, read> soil: SoilBuffer;

struct VertexInput {
  @location(0) position: vec3f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) normal: vec3f,
  @location(2) material: vec3f,
  @location(3) settledSurface: f32,
  @location(4) terrainVisibility: f32,
  @location(5) soilMaterial: vec2f,
}

fn terrainVisualSample(position: vec2i) -> vec2f {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(position, vec2i(0), vec2i(hi)));
  let value = state.values[gridIndex(cell.x, cell.y)];
  return vec2f(
    value.x + value.y,
    smoothstep(0.018, 0.16, value.y)
  );
}

fn terrainVertexVisibility(worldPosition: vec3f) -> f32 {
  let horizontalLight = length(frame.sun.xz);
  if (horizontalLight < 0.025 || frame.sun.w < 0.025) {
    return 1.0;
  }
  let toLight = frame.sun.xz / horizontalLight;
  let risePerMeter = frame.sun.y / max(horizontalLight, 0.08);
  let nearDistance = 3.2;
  let farDistance = 7.5;
  let nearSample = terrainVisualSample(
    vec2i(cellFromWorld(worldPosition.xz + toLight * nearDistance))
  );
  let farSample = terrainVisualSample(
    vec2i(cellFromWorld(worldPosition.xz + toLight * farDistance))
  );
  let nearBlocker = nearSample.x
    - (worldPosition.y + risePerMeter * nearDistance + 0.16);
  let farBlocker = farSample.x
    - (worldPosition.y + risePerMeter * farDistance + 0.3);
  let occlusion = max(
    smoothstep(0.1, 1.15, nearBlocker),
    smoothstep(0.18, 1.5, farBlocker) * 0.62
  );
  return 1.0 - occlusion * min(0.34, frame.sun.w * 0.36);
}

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
  let cell = cellFromWorld(input.position.xz);
  let p = vec2i(cell);
  let value = state.values[gridIndex(cell.x, cell.y)];
  let center = terrainVisualSample(p);
  let left = terrainVisualSample(p + vec2i(-1, 0));
  let right = terrainVisualSample(p + vec2i(1, 0));
  let down = terrainVisualSample(p + vec2i(0, -1));
  let up = terrainVisualSample(p + vec2i(0, 1));
  let downLeft = terrainVisualSample(p + vec2i(-1, -1));
  let downRight = terrainVisualSample(p + vec2i(1, -1));
  let upLeft = terrainVisualSample(p + vec2i(-1, 1));
  let upRight = terrainVisualSample(p + vec2i(1, 1));
  // Rock is still physically immutable and cell based. Only its rendered
  // contact with sand is low-pass filtered so procedural outcrops and
  // lava-created stone do not expose square/triangular grid teeth. Interior
  // rock and ordinary sand relief retain their sharper native heightfield.
  let neighborhood = center * 0.4
    + (left + right + down + up) * 0.11
    + (downLeft + downRight + upLeft + upRight) * 0.04;
  let materialEdge = smoothstep(
    0.035,
    0.24,
    abs(center.y - neighborhood.y)
  );
  let visualHeight = mix(center.x, neighborhood.x, materialEdge * 0.72);
  let visualSandCover = mix(center.y, neighborhood.y, materialEdge * 0.86);
  let worldPosition = vec3f(input.position.x, visualHeight, input.position.z);
  var output: VertexOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  output.normal = terrainNormal(&state, cell, false);
  output.material = vec3f(visualSandCover, value.z, value.w);
  output.settledSurface = sandFlux.values[gridIndex(cell.x, cell.y)].z;
  output.terrainVisibility = terrainVertexVisibility(worldPosition);
  let soilValue = soil.values[gridIndex(cell.x, cell.y)];
  output.soilMaterial = vec2f(
    clamp(soilValue.dirtDepth / max(value.y, 0.0001), 0.0, 1.0),
    clamp(soilValue.compaction, 0.0, 1.0)
  );
  return output;
}

fn outerSeabedFade(input: VertexOutput) -> f32 {
  // Only the protected, below-sea-level belt fades. The island and its visible
  // shallow shelf remain real terrain. Combining real bottom depth with a very
  // broad distance ramp prevents the transition itself from tracing a circle:
  // irregular slopes disappear later than the already-deep outer basin.
  let radialDistance = length(input.worldPosition.xz);
  let bedDepth = max(0.0, frame.world.z - input.worldPosition.y);
  let deepBed = smoothstep(1.2, 5.8, bedDepth);
  let protectedBelt = smoothstep(
    frame.world.x * 0.26,
    frame.world.x * 0.47,
    radialDistance
  );
  return protectedBelt * deepBed;
}

fn shadeSubmergedTerrainFast(input: VertexOutput) -> vec4f {
  // Once the bottom is under more than a metre of water, a compact two-noise
  // sand/stone treatment is sufficient; the water supplies the fine optical
  // detail. This keeps the now-continuous seabed substantially cheaper than
  // evaluating the full dry-land debris shader beneath opaque deep water.
  let sandCover = clamp(input.material.x, 0.0, 1.0);
  let submergedSand = vec3f(0.585, 0.505, 0.365);
  let submergedDirt = vec3f(0.235, 0.19, 0.115);
  let submergedRock = vec3f(0.245, 0.27, 0.245);
  let submergedGround = mix(submergedSand, submergedDirt, input.soilMaterial.x);
  let albedo = mix(submergedRock, submergedGround, sandCover);
  var color = lightColor(input.worldPosition, input.normal, albedo, 0.0)
    * mix(0.82, 1.0, input.terrainVisibility);
  let seabedFog = smoothstep(1.25, 7.4, input.material.y);
  let seabedHaze = mix(
    vec3f(0.008, 0.045, 0.075),
    vec3f(0.035, 0.235, 0.255),
    frame.pad.w
  );
  color = mix(color, seabedHaze, seabedFog * 0.82);
  let outerBedMerge = outerSeabedFade(input);
  return vec4f(color, 1.0 - outerBedMerge);
}

fn shadeTerrainFast(input: VertexOutput, detailB: f32) -> vec4f {
  let worldXZ = input.worldPosition.xz;
  let sandCover = clamp(input.material.x, 0.0, 1.0);
  let rotatedXZ = mat2x2f(0.79, 0.61, -0.61, 0.79) * worldXZ;
  let materialWarp = vec2f(
    noise2(worldXZ * 0.036 + vec2f(3.8, -9.1)) * 2.0 - 1.0,
    noise2(rotatedXZ * 0.041 + vec2f(-4.6, 6.3)) * 2.0 - 1.0
  );

  var sandColor = vec3f(0.565, 0.43, 0.285);
  var sandBump = vec2f(0.0);
  var sandMacro = 0.0;
  if (sandCover > 0.002) {
    // The base mantle is intentionally a little darker. Smooth Perlin fields
    // only lift it toward related lighter mineral shades; the separate settled
    // debris layer is not needed for the ground to retain natural variation.
    let sandBroad = gradientNoiseSigned(
      rotatedXZ * 0.018 + materialWarp * 0.22 + vec2f(-7.3, 12.6)
    );
    sandMacro = gradientNoiseSigned(
      worldXZ * 0.058 + materialWarp * 0.34 + vec2f(5.2, -8.7)
    );
    let sandMeso = gradientNoiseSigned(
      mat2x2f(0.51, -0.86, 0.86, 0.51) * worldXZ * 0.19
        - materialWarp * 0.17
        + vec2f(11.0, -3.0)
    );
    let sandFineA = gradientNoiseSigned(
      mat2x2f(0.79, 0.613, -0.613, 0.79) * worldXZ * 2.25
        + vec2f(-3.0, 14.0)
    );
    let sandFineB = gradientNoiseSigned(
      mat2x2f(0.43, -0.903, 0.903, 0.43) * worldXZ * 5.2
        + vec2f(17.0, 31.0)
    );

    let mineralField = clamp(
      0.5 + sandBroad * 0.46 + sandMacro * 0.27 + sandMeso * 0.13,
      0.0,
      1.0
    );
    let baseSand = vec3f(0.49, 0.37, 0.25);
    let warmSand = vec3f(0.62, 0.48, 0.31);
    let lightSand = vec3f(0.73, 0.66, 0.53);
    let weatheredSand = vec3f(0.43, 0.34, 0.27);
    let coolDust = vec3f(0.55, 0.53, 0.46);
    let mineralWarmSand = vec3f(0.58, 0.39, 0.29);
    sandColor = mix(
      baseSand,
      warmSand,
      0.18 + mineralField * 0.42
    );
    let lightPatch = smoothstep(
      0.2,
      0.72,
      sandBroad * 0.58 + sandMeso * 0.42
    );
    sandColor = mix(sandColor, lightSand, lightPatch * 0.18);
    let weatheredPatch = smoothstep(
      0.12,
      0.7,
      -sandBroad * 0.56 + sandMeso * 0.44
    );
    sandColor = mix(sandColor, weatheredSand, weatheredPatch * 0.15);
    let mineralWarmPatch = smoothstep(
      0.2,
      0.76,
      sandMacro * 0.52 + sandMeso * 0.48
    );
    sandColor = mix(
      sandColor,
      mineralWarmSand,
      mineralWarmPatch * 0.12
    );
    let coolPatch = smoothstep(
      0.18,
      0.66,
      -sandMacro + sandBroad * 0.22
    );
    sandColor = mix(sandColor, coolDust, coolPatch * 0.09);
    let sandValueVariation = clamp(
      sandBroad * 0.055
        + sandMacro * 0.036
        + sandMeso * 0.024,
      -0.065,
      0.085
    );
    sandColor = sandColor * (1.0 + sandValueVariation);

    // Two rotated high-frequency fields form stable world-space grains. Close
    // views retain individual specks; distance attenuates the finest octave to a
    // faint meso grain instead of letting it shimmer or disappear completely.
    // This belongs to the base sand material and is independent of settled debris.
    let grainField = sandFineA * 0.62 + sandFineB * 0.38;
    let grainDistance = distance(
      frame.cameraPosition.xyz,
      input.worldPosition
    );
    let grainVisibility = 1.0 - smoothstep(92.0, 218.0, grainDistance);
    let stableGrain = grainField * mix(0.26, 1.0, grainVisibility)
      + sandMeso * (1.0 - grainVisibility) * 0.16;
    let grainAmount = mix(0.006, 0.026, grainVisibility);
    sandColor = sandColor * (1.0 + stableGrain * grainAmount);
    sandColor = sandColor + vec3f(
      stableGrain * 0.0042,
      stableGrain * 0.0027,
      -stableGrain * 0.0015
    ) * grainVisibility;
    sandBump = vec2f(sandFineA, sandFineB)
      * mix(0.004, 0.018, grainVisibility)
      + vec2f(sandMeso, -sandMeso) * 0.0035;
  }

  var rockColor = vec3f(0.105, 0.115, 0.108);
  var rockBump = vec2f(0.0);
  if (sandCover < 0.998) {
    let rockBroad = noise2(
      rotatedXZ * 0.032 + materialWarp * 0.42 + vec2f(-12.0, 4.0)
    ) * 2.0 - 1.0;
    let rockMeso = noise2(
      worldXZ * 0.19 - materialWarp * 0.35 + vec2f(17.0, 5.0)
    ) * 2.0 - 1.0;
    let rockFineA = noise2(
      rotatedXZ * 0.72 + vec2f(3.0, 41.0)
    ) * 2.0 - 1.0;
    let rockFineB = noise2(
      worldXZ * 1.36 + vec2f(43.0, 7.0)
    ) * 2.0 - 1.0;
    // Bedrock shares the island's volcanic origin: charcoal brown in warm
    // light, blue-black in shadow, with restrained mineral faces rather than
    // pale concrete. Existing broad/meso fields retain painterly variation.
    let warmStone = vec3f(0.185, 0.158, 0.112);
    let slateStone = vec3f(0.07, 0.105, 0.12);
    let paleStone = vec3f(0.285, 0.265, 0.215);
    rockColor = mix(
      warmStone,
      slateStone,
      clamp(0.47 + rockBroad * 0.32 + rockMeso * 0.14, 0.0, 1.0)
    );
    rockColor = mix(
      rockColor,
      paleStone,
      smoothstep(0.28, 0.82, rockFineA * 0.55 + rockMeso * 0.45) * 0.28
    );
    let crackWarp = materialWarp * 0.55 + vec2f(rockBroad, rockMeso) * 0.22;
    let crackFieldA = noise2(
      rotatedXZ * 0.55 + crackWarp + vec2f(9.0, 23.0)
    ) * 2.0 - 1.0;
    let crackFieldB = noise2(
      worldXZ * 0.83 - crackWarp.yx + vec2f(-18.0, 7.0)
    ) * 2.0 - 1.0;
    let crackA = 1.0 - smoothstep(0.035, 0.13, abs(crackFieldA));
    let crackB = 1.0 - smoothstep(0.03, 0.105, abs(crackFieldB));
    let mineralSeam = max(crackA, crackB * 0.62);
    rockColor = mix(
      rockColor,
      vec3f(0.025, 0.04, 0.045),
      mineralSeam * 0.34
    );
    let volcanicPores = smoothstep(
      0.46,
      0.9,
      rockFineA * 0.62 + rockFineB * 0.38
    );
    rockColor = mix(rockColor, rockColor * 0.48, volcanicPores * 0.38);
    rockColor = rockColor * (
      0.9 + rockFineA * 0.075 + rockFineB * 0.04
    );
    rockBump = vec2f(
      rockFineA * 0.15 + mineralSeam * 0.08,
      rockFineB * 0.14 - mineralSeam * 0.08
    );
  }

  let dirtFraction = clamp(input.soilMaterial.x, 0.0, 1.0);
  let visibleSandFraction = 1.0 - dirtFraction;
  let compaction = clamp(input.soilMaterial.y, 0.0, 1.0);
  let dirtBroad = gradientNoiseSigned(
    worldXZ * 0.024 + materialWarp * 0.3 + vec2f(8.2, -4.6)
  );
  let dirtMeso = gradientNoiseSigned(
    mat2x2f(0.61, 0.79, -0.79, 0.61) * worldXZ * 0.11
      - materialWarp * 0.22
      + vec2f(-17.0, 9.0)
  );
  let dirtFine = gradientNoiseSigned(
    mat2x2f(0.87, -0.49, 0.49, 0.87) * worldXZ * 0.76
      + vec2f(6.0, 27.0)
  );
  let dryDirt = mix(
    vec3f(0.125, 0.065, 0.027),
    vec3f(0.315, 0.185, 0.07),
    clamp(0.5 + dirtBroad * 0.56 + dirtMeso * 0.23, 0.0, 1.0)
  );
  let dampDirt = vec3f(0.068, 0.047, 0.026);
  var dirtColor = mix(
    dryDirt,
    dampDirt,
    smoothstep(0.18, 0.74, input.material.z)
  );
  dirtColor = dirtColor * (
    1.0 + dirtBroad * 0.16 + dirtMeso * 0.09 + dirtFine * 0.03
  );
  dirtColor = mix(dirtColor, dirtColor * 0.86, compaction * 0.24);
  // Grass is a low-cost material layer, not a screen-space decal or dense
  // geometry carpet. It only covers old, compact, dry dirt; excavation and
  // fresh deposits lower compaction and remove it immediately. Broad smooth
  // fields keep sand/dirt/grass transitions painterly instead of drawing
  // hairline borders along simulation cells.
  // Reuse dirt's existing multiscale fields. Two additional gradient-noise
  // evaluations here cost several textureless hash/interpolation chains for
  // every terrain fragment and nearly halved frame rate at full viewport.
  // The rotated blend keeps grass patches from simply tracing the dirt tint.
  let grassMacro = dirtBroad * 0.82 - dirtMeso * 0.18;
  let grassMeso = dirtMeso * 0.74 + dirtFine * 0.26;
  let grassHabitat = smoothstep(0.38, 0.76, dirtFraction)
    * smoothstep(0.28, 0.7, compaction)
    * (1.0 - smoothstep(0.02, 0.13, input.material.y));
  let grassPatch = smoothstep(
    -0.26,
    0.5,
    grassMacro * 0.72 + dirtBroad * 0.2 + grassMeso * 0.08
  );
  let grassCover = grassHabitat * mix(0.24, 0.94, grassPatch);
  let dryGrass = mix(
    vec3f(0.095, 0.145, 0.043),
    vec3f(0.17, 0.255, 0.065),
    clamp(0.5 + grassMacro * 0.42 + grassMeso * 0.16, 0.0, 1.0)
  );
  let dampGrass = vec3f(0.055, 0.13, 0.047);
  let grassColor = mix(
    dryGrass,
    dampGrass,
    smoothstep(0.22, 0.7, input.material.z)
  );
  dirtColor = mix(dirtColor, grassColor, grassCover * 0.76);
  let dirtBump = vec2f(dirtMeso, dirtFine)
      * mix(0.025, 0.009, compaction)
    + vec2f(grassMeso, -grassMeso) * grassCover * 0.018;
  let groundColor = mix(sandColor, dirtColor, dirtFraction);
  let groundBump = mix(sandBump, dirtBump, dirtFraction);
  var albedo = mix(rockColor, groundColor, sandCover);
  let materialBump = mix(rockBump, groundBump, sandCover);
  let surfaceNormal = normalize(
    input.normal + vec3f(materialBump.x, 0.0, materialBump.y)
  );

  let brushDelta = worldXZ - hit.value.xy;
  let brushDistance = length(brushDelta);
  let brushAngle = atan2(brushDelta.y, brushDelta.x);
  let flowDirection = select(1.0, -1.0, frame.brushVisual.y < -0.5);
  let flowBands = sin(
    brushDistance * 11.0
      + brushAngle * 5.0
      + frame.cameraUpTime.w * 12.0 * flowDirection
      + detailB * 5.0
  ) * 0.5 + 0.5;
  let depositing = step(0.5, frame.brushVisual.y);
  let gatheringSand = 1.0 - step(0.5, hit.material.x);
  let depositingSand = 1.0 - step(0.5, abs(frame.brushVisual.x - 1.0));
  let manipulatingSand = mix(gatheringSand, depositingSand, depositing);
  let sandActivity = frame.brushVisual.z
    * manipulatingSand
    * hit.value.w;
  let brushFlow = (
    1.0 - smoothstep(frame.fog.w * 0.18, frame.fog.w * 1.25, brushDistance)
  )
    * smoothstep(0.0, frame.fog.w * 0.32, brushDistance)
    * sandActivity;
  let brushClear = (
    1.0 - smoothstep(0.0, frame.fog.w * 1.18, brushDistance)
  ) * sandActivity;
  let settledDetail = smoothstep(0.04, 0.68, input.settledSurface)
    * (1.0 - brushClear)
    * sandCover
    * visibleSandFraction;

  if (settledDetail > 0.002) {
    let dressingRegion = smoothstep(
      0.42,
      0.78,
      noise2(worldXZ * 0.075 + materialWarp * 0.35 + vec2f(6.0, 23.0))
    );
    let ripplePhase = dot(
      worldXZ + materialWarp * 2.4,
      vec2f(0.84, 0.5426)
    ) * 1.16;
    let ripple = sin(ripplePhase);
    let rippleDelta = ripple
      * dressingRegion
      * settledDetail
      * 0.04;
    albedo = albedo + vec3f(
      rippleDelta * 0.8,
      rippleDelta * 0.65,
      rippleDelta * 0.43
    );

    let debrisCluster = smoothstep(
      0.56,
      0.83,
      noise2(rotatedXZ * 0.18 + vec2f(-28.0, 16.0))
    );
    let darkGrit = smoothstep(
      0.82,
      0.94,
      noise2(worldXZ * 1.56 + materialWarp * 0.2 + vec2f(9.0, 63.0))
    ) * debrisCluster * settledDetail;
    let paleGrit = smoothstep(
      0.86,
      0.955,
      noise2(rotatedXZ * 2.05 + vec2f(-34.0, 11.0))
    ) * debrisCluster * settledDetail;
    let twigBreak = smoothstep(
      0.72,
      0.88,
      noise2(worldXZ * 0.82 + vec2f(-7.0, 91.0))
    );
    let twigRidge = 1.0 - smoothstep(
      0.035,
      0.13,
      abs(sin(dot(worldXZ, vec2f(0.82, 0.57)) * 0.93 + sandMacro))
    );
    let twigMark = twigRidge
      * twigBreak
      * debrisCluster
      * settledDetail;
    albedo = mix(
      albedo,
      albedo * vec3f(0.72, 0.7, 0.64),
      darkGrit * 0.52 + twigMark * 0.32
    );
    albedo = mix(
      albedo,
      albedo * vec3f(1.1, 1.075, 1.02),
      paleGrit * 0.24
    );
  }

  albedo = mix(
    albedo,
    albedo * mix(
      vec3f(0.7, 0.61, 0.48),
      vec3f(1.25, 1.12, 0.77),
      flowBands
    ),
    brushFlow * 0.42
  );
  let dampness = clamp(
    input.material.z * 0.28
      + smoothstep(0.015, 0.2, input.material.y) * 0.38,
    0.0,
    0.48
  );
  albedo = mix(
    albedo,
    albedo * mix(
      vec3f(0.47, 0.55, 0.53),
      vec3f(0.52, 0.49, 0.42),
      sandCover
    ),
    dampness
  );
  var color = lightColor(input.worldPosition, surfaceNormal, albedo, 0.0)
    * mix(0.78, 1.0, input.terrainVisibility);
  // Deep water progressively absorbs the sandy bottom without ever deleting
  // its geometry. Draining the water restores the untouched sand coloring,
  // making the debug view a truthful inspection of the full seabed mantle.
  let seabedFog = smoothstep(1.65, 7.4, input.material.y);
  let seabedHaze = mix(
    vec3f(0.008, 0.045, 0.075),
    vec3f(0.035, 0.235, 0.255),
    frame.pad.w
  );
  color = mix(color, seabedHaze, seabedFog * 0.74);
  return vec4f(color, 1.0 - outerSeabedFade(input));
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let worldXZ = input.worldPosition.xz;
  // Never switch seabed shading at one depth contour. That produced the second
  // hard line below the shoreline. Blend the normal terrain treatment into
  // the cheap deep-water treatment across a broad absorption range.
  if (input.material.y > 2.8) {
    return shadeSubmergedTerrainFast(input);
  }
  let detailB = noise2(worldXZ * 0.74 + vec2f(8.0, 3.0));
  let terrainShade = shadeTerrainFast(input, detailB);
  if (input.material.y > 0.55) {
    let submergedShade = shadeSubmergedTerrainFast(input);
    return mix(
      terrainShade,
      submergedShade,
      smoothstep(0.55, 2.8, input.material.y)
    );
  }
  let inlandMode = step(0.5, frame.brushVisual.w);
  // The earth-continuation matching field is an inland-only visual. Avoiding
  // its two noise octaves and duplicate fog evaluation on the coastal map
  // recovers the water-heavy island's render budget without changing output.
  if (inlandMode < 0.5) {
    return terrainShade;
  }
  let squareRadius = max(abs(worldXZ.x), abs(worldXZ.y))
    / max(frame.world.x * 0.5, 1.0);
  // Match the protected simulation apron to the far-earth mesh before alpha
  // blending. Geometry becomes deliberately flat first; color follows across
  // a wider band, leaving a readable editable shoulder without a square seam.
  let protectedEarthBlend = smoothstep(0.77, 0.92, squareRadius) * inlandMode;
  if (protectedEarthBlend <= 0.0001) {
    return terrainShade;
  }
  let protectedBroad = gradientNoiseSigned(worldXZ * 0.018 + vec2f(7.0, -3.0));
  let protectedMeso = gradientNoiseSigned(worldXZ * 0.071 + vec2f(-13.0, 8.0));
  let protectedDayEarth = mix(
    vec3f(0.205, 0.14, 0.07),
    vec3f(0.39, 0.285, 0.14),
    clamp(0.5 + protectedBroad * 0.58 + protectedMeso * 0.18, 0.0, 1.0)
  );
  var protectedEarth = mix(
    protectedDayEarth * vec3f(0.16, 0.2, 0.24),
    protectedDayEarth,
    frame.pad.w
  );
  protectedEarth = mix(
    protectedEarth,
    skyColor(input.worldPosition),
    smoothstep(
      frame.fog.x,
      frame.fog.y,
      distance(frame.cameraPosition.xyz, input.worldPosition)
    )
  );
  let matchedTerrainColor = mix(
    terrainShade.rgb,
    protectedEarth,
    protectedEarthBlend
  );
  // Leave a visibly ordinary but protected strip beyond the editable limit,
  // then dissolve the last metres into matching non-editable earth. This hides
  // the simulation sheet's square edge without pretending the outer land can
  // be manipulated.
  let inlandEdgeBlend = smoothstep(0.9, 0.995, squareRadius) * inlandMode;
  return vec4f(matchedTerrainColor, terrainShade.a * (1.0 - inlandEdgeBlend));
}
`;L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> waterFlux: StateBuffer;
@group(0) @binding(3) var<storage, read> sandFlux: StateBuffer;
@group(0) @binding(4) var<storage, read> hit: HitBuffer;

struct VertexInput {
  @location(0) position: vec3f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) normal: vec3f,
  @location(2) depth: f32,
  @location(3) motion: vec3f,
  @location(4) coverage: f32,
  @location(5) ocean: f32,
  @location(6) shoreProfile: f32,
  @location(7) openness: f32,
  @location(8) opticalField: vec4f,
  @location(9) interaction: f32,
}

fn waterSurfaceAt(p: vec2i) -> f32 {
  return cellHeight(&state, p, true);
}

fn stateAtWaterCell(p: vec2i) -> vec4f {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  return state.values[gridIndex(cell.x, cell.y)];
}

fn waterClassAt(p: vec2i) -> f32 {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  return sandFlux.values[gridIndex(cell.x, cell.y)].w;
}

fn validWaterManipulation() -> f32 {
  let handLock = i32(round(frame.brushVisual.x));
  let waterUnderCursor = hit.material.x >= 0.5 && hit.material.x < 1.5;
  let handAcceptsWater = handLock == 0 || handLock == 2;
  let gatheringWater = (
    frame.brushVisual.y < -0.5
    && waterUnderCursor
    && handAcceptsWater
  );
  let pouringWater = frame.brushVisual.y > 0.5 && handLock == 2;
  return select(
    0.0,
    1.0,
    frame.brushVisual.z > 0.5
      && hit.value.w > 0.5
      && (gatheringWater || pouringWater)
  );
}

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
  let cell = cellFromWorld(input.position.xz);
  let p = vec2i(cell);
  let centerValue = stateAtWaterCell(p);
  let encodedWaterClass = waterClassAt(p);
  let oceanField = step(0.75, encodedWaterClass);
  let centerTerrain = centerValue.x + centerValue.y;
  // The exterior sea is rendered as a stable optical sheet and never samples
  // the active water solver for height, motion, alpha, or shoreline. Only
  // finite inland water needs reconstruction from the physical grid.
  var surfaceSum = 0.0;
  var depthSum = 0.0;
  var wetSurfaceWeight = 0.0;
  var kernelWeight = 0.0;
  var wetProfileSum = 0.0;
  var terrainSum = 0.0;
  var flowSum = vec4f(0.0);
  if (oceanField < 0.5) {
    for (var oy = -1; oy <= 1; oy = oy + 1) {
      for (var ox = -1; ox <= 1; ox = ox + 1) {
        let offset = vec2i(ox, oy);
        let hi = i32(gridSize()) - 1;
        let sampleCell = vec2u(clamp(p + offset, vec2i(0), vec2i(hi)));
        let sampleIndex = gridIndex(sampleCell.x, sampleCell.y);
        let sampleValue = state.values[sampleIndex];
        let sampleDepth = sampleValue.z;
        let distanceSquared = f32(ox * ox + oy * oy);
        let kernel = exp(-distanceSquared * 0.58);
        let wet = smoothstep(0.0, 0.2, sampleDepth);
        let sampleWeight = kernel * wet;
        surfaceSum = surfaceSum
          + (sampleValue.x + sampleValue.y + sampleDepth) * sampleWeight;
        wetSurfaceWeight = wetSurfaceWeight + sampleWeight;
        depthSum = depthSum + sampleDepth * kernel;
        wetProfileSum = wetProfileSum + wet * kernel;
        terrainSum = terrainSum + (sampleValue.x + sampleValue.y) * kernel;
        flowSum = flowSum + waterFlux.values[sampleIndex] * kernel;
        kernelWeight = kernelWeight + kernel;
      }
    }
  }
  let inlandKernelWeight = max(kernelWeight, 0.0001);
  let filteredHeight = select(
    centerTerrain + centerValue.z,
    surfaceSum / max(wetSurfaceWeight, 0.0001),
    oceanField < 0.5 && wetSurfaceWeight > 0.0001
  );
  let filteredDepth = select(
    centerValue.z,
    depthSum / inlandKernelWeight,
    oceanField < 0.5
  );
  let physicalShoreProfile = select(
    smoothstep(0.0, 0.2, centerValue.z),
    wetProfileSum / inlandKernelWeight,
    oceanField < 0.5
  );
  let filteredTerrain = select(
    centerTerrain,
    terrainSum / inlandKernelWeight,
    oceanField < 0.5
  );
  let filteredFlow = select(
    vec4f(0.0),
    flowSum / inlandKernelWeight,
    oceanField < 0.5
  );
  let cachedOpenness = clamp(
    (encodedWaterClass - oceanField) * 4.0,
    0.0,
    1.0
  );
  // The persistent mask identifies the infinite reservoir, but raised sand or
  // rock turns the same location back into ordinary flowing water. This keeps
  // runoff visible on its way toward the sea and lets poured sand reshape the
  // coast instead of being hidden by an immutable ocean render override.
  let activeOcean = oceanField * (
    1.0 - smoothstep(
      frame.world.z - 0.08,
      frame.world.z + 0.22,
      filteredTerrain
    )
  );
  // Sea openness is known from its persistent mask. Inland width is cached by
  // a low-frequency compute pass so the vertex stage never performs radial
  // storage probes on every rendered frame.
  let openness = select(
    cachedOpenness,
    1.0,
    activeOcean >= 0.5
  );
  let reservoirDepth = max(0.0, frame.world.z - filteredTerrain);
  let gatherDistance = distance(input.position.xz, hit.value.xy);
  let interactionRadius = max(1.2, frame.fog.w * 1.32);
  let interactionEnvelope = (
    1.0 - smoothstep(interactionRadius * 0.28, interactionRadius, gatherDistance)
  );
  let interaction = interactionEnvelope * validWaterManipulation();
  let brushDisplacement = interaction * select(
    0.115,
    -0.16,
    frame.brushVisual.y < -0.5
  );
  var height = filteredHeight + 0.055;
  if (oceanField >= 0.5) {
    // A smooth analytic dimple/mound communicates scooping and pouring while
    // the underlying volume simulation remains free to update. Crucially, no
    // connected-sea solver value reaches the rendered sea surface.
    height = frame.world.z + 0.055
      + brushDisplacement * smoothstep(0.015, 0.24, reservoirDepth);
  }
  // The spring is a small upwelling rather than a rigid prop. Its low lift is
  // visible through shallow water and remains below the scale of terrain
  // manipulation, so it does not destabilize the physical solver.
  let springDistance = distance(input.position.xz, vec2f(-11.0, -2.0));
  let springLift = (
    1.0 - smoothstep(0.18, 2.15, springDistance)
  ) * (
    0.045
      + sin(frame.cameraUpTime.w * 0.72 + springDistance * 2.1) * 0.012
  );
  height = height + springLift * smoothstep(0.006, 0.08, filteredDepth);
  let worldPosition = vec3f(input.position.x, height, input.position.z);
  var output: VertexOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  // Flow is represented by foam and the physical surface height. A flat base
  // normal keeps the simulation grid out of reflections; slow optical normals
  // are added continuously in the fragment shader.
  output.normal = vec3f(0.0, 1.0, 0.0);
  let visualDepth = select(filteredDepth, reservoirDepth, oceanField >= 0.5);
  let reservoirShoreProfile = smoothstep(0.0, 0.86, reservoirDepth);
  let visualShoreProfile = select(
    physicalShoreProfile,
    reservoirShoreProfile,
    oceanField >= 0.5
  );
  output.depth = visualDepth;
  output.motion = vec3f(
    filteredFlow.x,
    filteredFlow.z,
    filteredFlow.w
  );
  output.coverage = visualDepth;
  // Use the immutable reservoir classification for visual gating. Physical
  // solver corrections remain non-zero around the reservoir's sloping edge;
  // passing the fractional activeOcean value made those corrections illuminate
  // the entire coastline whenever any water action occurred.
  output.ocean = oceanField;
  output.shoreProfile = visualShoreProfile;
  output.openness = openness;
  // Evaluate the two Perlin layers once per existing simulation vertex rather
  // than once per screen pixel. Interpolation keeps the optical normal smooth
  // while avoiding millions of hash/gradient operations in wide ocean views.
  output.opticalField = waterOpticalField(
    worldPosition.xz,
    frame.cameraUpTime.w
  );
  output.interaction = interaction;
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let time = frame.cameraUpTime.w;
  let ocean = input.ocean;
  let deep = smoothstep(0.18, 3.2, input.depth);
  let opticalField = input.opticalField;
  let bodyNoise = clamp(
    opticalField.x * 0.55 + opticalField.y * 0.45,
    -1.0,
    1.0
  );
  let smallBodyNoise = clamp(
    opticalField.y * 0.65 - opticalField.x * 0.35,
    -1.0,
    1.0
  );
  let fineSlope = opticalField.zw;
  let fineSignal = clamp(
    0.5 + bodyNoise * 0.075 + smallBodyNoise * 0.035,
    0.0,
    1.0
  );
  let normal = normalize(
    input.normal
      + vec3f(-fineSlope.x, 0.0, -fineSlope.y)
        * mix(0.62, 1.0, ocean)
  );
  let viewDirection = normalize(frame.cameraPosition.xyz - input.worldPosition);
  let ndv = max(dot(viewDirection, normal), 0.0);
  let fresnel = 0.025 + 0.975 * pow(1.0 - ndv, 4.6);
  let reflectedView = reflect(-viewDirection, normal);
  let reflectionHeight = smoothstep(-0.18, 0.84, reflectedView.y);
  let dayReflection = mix(
    vec3f(0.12, 0.47, 0.54),
    vec3f(0.4, 0.73, 0.77),
    reflectionHeight
  );
  let nightReflection = mix(
    vec3f(0.02, 0.075, 0.13),
    vec3f(0.09, 0.19, 0.3),
    reflectionHeight
  );
  let reflectedSky = mix(nightReflection, dayReflection, frame.pad.w);

  let shallowColor = mix(
    vec3f(0.08, 0.5, 0.49),
    vec3f(0.15, 0.64, 0.59),
    clamp(0.5 + bodyNoise * 0.12 + smallBodyNoise * 0.035, 0.0, 1.0)
  );
  let deepColor = mix(
    vec3f(0.012, 0.18, 0.27),
    vec3f(0.035, 0.34, 0.42),
    clamp(0.5 + bodyNoise * 0.1, 0.0, 1.0)
  );
  let dayBody = mix(shallowColor, deepColor, deep);
  let nightBody = mix(
    vec3f(0.045, 0.235, 0.245),
    vec3f(0.012, 0.075, 0.135),
    deep
  ) * mix(0.94, 1.06, clamp(0.5 + bodyNoise * 0.18, 0.0, 1.0));
  var color = mix(nightBody, dayBody, frame.pad.w);
  color = mix(color, reflectedSky, clamp(0.11 + fresnel * 0.5, 0.0, 0.76));
  let opticalTexture = clamp(
    0.5
      + (fineSignal - 0.5) * 0.82
      + smallBodyNoise * 0.035
      + bodyNoise * 0.02,
    0.0,
    1.0
  );
  color = color * mix(0.925, 1.075, opticalTexture);

  let sunDirection = normalize(frame.sun.xyz);
  let sunA = max(dot(reflect(-sunDirection, normal), viewDirection), 0.0);
  // Never add a broad specular term to this shared water sheet. Even with
  // spatial breakup, a camera/light lobe made the sea brighten almost at once
  // and then blink out. Only sparse, static organic flecks may catch light.
  let glintSpatial = smoothstep(
    -0.58,
    0.48,
    bodyNoise * 0.76 + smallBodyNoise * 0.34
  );
  // Sparse micro-glints follow the Perlin normal field and the real light
  // angle. Unlike the former cell threshold, this produces irregular flowing
  // flecks without one highlight per simulation/noise tile.
  let glintAA = max(0.018, fwidth(smallBodyNoise) * 0.8);
  let glintRidge = (
    1.0 - smoothstep(
      glintAA,
      glintAA * 3.4,
      abs(smallBodyNoise - 0.17)
    )
  ) * smoothstep(0.04, 0.42, bodyNoise);
  let lightFacing = pow(max(dot(normal, sunDirection), 0.0), 5.0);
  let scatteredGlint = glintRidge
    * lightFacing
    * smoothstep(0.42, 0.92, sunA)
    * glintSpatial
    * 0.24;
  color = color + frame.pad.xyz
    * frame.sun.w
    * scatteredGlint
    * mix(0.014, 0.038, frame.pad.w);

  // Actual bulk motion drives thin, soft, broken foam marks. Exterior-reservoir
  // motion was already zeroed in the vertex stage; finite water receives a
  // smoothed 3x3 flow vector, so raw cell velocity cannot jitter the pattern.
  let shallowFlowMask = mix(
    1.0 - smoothstep(1.35, 3.4, input.depth),
    0.72,
    ocean
  );
  let flowSpeed = length(input.motion.yz) / (input.depth + 0.08);
  let bulkFlowStrength = max(
    smoothstep(0.0002, 0.06, input.motion.x),
    smoothstep(0.001, 0.1, flowSpeed)
  ) * shallowFlowMask;
  let flowStrength = bulkFlowStrength * 0.34;
  let flowDirection = normalize(
    select(
      vec2f(0.74, 0.67),
      input.motion.yz,
      length(input.motion.yz) > 0.0001
    )
  );
  let flowCross = vec2f(-flowDirection.y, flowDirection.x);
  let flowAlong = dot(input.worldPosition.xz, flowDirection);
  let flowAcross = dot(input.worldPosition.xz, flowCross);
  let flowPhase = flowAlong * 1.72
    - time * 0.34
    + smallBodyNoise * 0.72;
  let crestCarrier = smoothstep(
    0.72,
    0.94,
    sin(flowPhase) * 0.5 + 0.5
  );
  let dashEnvelope = smoothstep(
    0.38,
    0.82,
    sin(flowAcross * 0.68 + bodyNoise * 1.4 - time * 0.035) * 0.5 + 0.5
  );
  let flowPatch = crestCarrier * dashEnvelope;
  color = mix(
    color,
    vec3f(0.57, 0.76, 0.76),
    flowStrength * (0.012 + flowPatch * 0.052)
  );

  // One soft wetness contour advances and retreats over eight seconds.
  // It is computed from the current water occupancy, so altered coastlines
  // follow naturally, but it never displaces the simulation mesh.
  let ebb01 = 0.5 + 0.5 * sin(time * (6.28318530718 / 8.0));
  // Wave amplitude is a continuous water-body-width signal. Broad seas and
  // large player-made lakes receive a readable wash; narrow streams and small
  // puddles converge toward zero rather than being classified by material.
  let waterBodyEbb = pow(input.openness, 3.2)
    * smoothstep(0.12, 0.65, input.coverage);
  let visualEbb = clamp(waterBodyEbb, 0.0, 1.0);
  let movingWashCenter = mix(0.14, 0.82, ebb01)
    + bodyNoise * 0.07;
  let washCenter = mix(
    0.5 + bodyNoise * 0.025,
    movingWashCenter,
    visualEbb
  );
  let washAA = max(0.022, fwidth(input.shoreProfile) * 0.64);
  let washBand = (
    1.0 - smoothstep(
      washAA * 0.25,
      washAA * 2.75,
      abs(input.shoreProfile - washCenter)
    )
  ) * smoothstep(0.008, 0.1, input.coverage);
  let brokenFoam = mix(
    0.52,
    1.0,
    smoothstep(-0.58, 0.48, smallBodyNoise)
  );
  let shoreReveal = smoothstep(
    washCenter - 0.24,
    washCenter + 0.28,
    input.shoreProfile
  );
  let revealFront = pow(
    clamp(4.0 * shoreReveal * (1.0 - shoreReveal), 0.0, 1.0),
    1.25
  );
  let visibleDepthFront = mix(
    0.36 + bodyNoise * 0.025,
    mix(0.18, 0.76, ebb01) + bodyNoise * 0.08,
    visualEbb
  );
  let depthFoam = (
    1.0 - smoothstep(
      0.075,
      0.42,
      abs(input.depth - visibleDepthFront)
    )
  ) * smoothstep(0.012, 0.11, input.coverage);
  let shoreline = max(
    max(washBand, revealFront * 0.72),
    depthFoam * 0.88
  )
    * brokenFoam
    * smoothstep(0.008, 0.1, input.coverage);
  let seaShoreline = shoreline * ocean;
  // A manipulation cue is evaluated per fragment and spatially locked to the
  // actual brush. It restores the converging scoop / spreading pour response
  // without writing any phase into the connected water simulation.
  let manipulationDistance = distance(
    input.worldPosition.xz,
    hit.value.xy
  );
  let manipulationRadius = max(1.2, frame.fog.w * 1.28);
  let manipulation01 = clamp(
    manipulationDistance / manipulationRadius,
    0.0,
    1.0
  );
  let pickupDirection = select(
    1.0,
    -1.0,
    frame.brushVisual.y < -0.5
  );
  let manipulationPhase = manipulation01 * 13.0
    + time * 4.2 * pickupDirection
    + bodyNoise * 2.4;
  let manipulationArc = smoothstep(
    0.77,
    0.965,
    sin(manipulationPhase) * 0.5 + 0.5
  );
  let manipulationBreak = smoothstep(
    -0.45,
    0.54,
    smallBodyNoise
      + sin(
        atan2(
          input.worldPosition.z - hit.value.y,
          input.worldPosition.x - hit.value.x
        ) * 5.0
      ) * 0.22
  );
  let disturbanceFoam = input.interaction
    * validWaterManipulation()
    * (1.0 - smoothstep(0.12, 1.0, manipulation01))
    * (0.12 + manipulationArc * manipulationBreak * 0.6);
  color = mix(
    color,
    vec3f(0.8, 0.94, 0.9),
    clamp(
      shoreline * mix(0.22, 0.82, max(ocean, input.openness * 0.24))
        + disturbanceFoam * 0.72,
      0.0,
      0.88
    )
  );
  // Procedural spring tell: faint rings are born at the mouth, travel outward,
  // and dissolve over a long loop. This reads as a slow upwelling instead of
  // the former pair of static target circles.
  let springDistance = distance(input.worldPosition.xz, vec2f(-11.0, -2.0));
  let springCore = 1.0 - smoothstep(0.18, 1.25, springDistance);
  let springAA = max(0.055, fwidth(springDistance) * 0.72);
  let springCycleA = fract(time * 0.085);
  let springCycleB = fract(springCycleA + 0.5);
  let springRadiusA = mix(0.42, 3.6, springCycleA);
  let springRadiusB = mix(0.42, 3.6, springCycleB);
  let springLifeA = smoothstep(0.0, 0.13, springCycleA)
    * (1.0 - smoothstep(0.68, 1.0, springCycleA));
  let springLifeB = smoothstep(0.0, 0.13, springCycleB)
    * (1.0 - smoothstep(0.68, 1.0, springCycleB));
  let springRingA = (
    1.0 - smoothstep(
      springAA,
      springAA * 3.4,
      abs(springDistance - springRadiusA)
    )
  ) * springLifeA * smoothstep(0.006, 0.12, input.coverage);
  let springRingB = (
    1.0 - smoothstep(
      springAA,
      springAA * 3.4,
      abs(springDistance - springRadiusB)
    )
  ) * springLifeB * smoothstep(0.006, 0.12, input.coverage);
  let springBreak = mix(
    0.5,
    1.0,
    smoothstep(
      -0.45,
      0.52,
      sin(
        dot(input.worldPosition.xz, vec2f(1.37, -0.82))
          + time * 0.09
      )
    )
  );
  let springCue = springCore * 0.18
    + (springRingA + springRingB) * 0.22 * springBreak;
  color = mix(
    color,
    vec3f(0.54, 0.9, 0.83),
    clamp(springCue, 0.0, 0.48)
  );
  let calmSeaVariation = clamp(
    0.5 + bodyNoise * 0.08 + smallBodyNoise * 0.025,
    0.0,
    1.0
  );
  let dayCalmSea = mix(
    vec3f(0.028, 0.285, 0.38),
    vec3f(0.1, 0.49, 0.525),
    calmSeaVariation
  );
  let nightCalmSea = mix(
    vec3f(0.004, 0.045, 0.11),
    vec3f(0.018, 0.15, 0.23),
    calmSeaVariation
  );
  let calmSeaColor = mix(nightCalmSea, dayCalmSea, frame.pad.w);
  let aliveCalmSea = calmSeaColor * (
    1.0 + (fineSignal - 0.5) * mix(0.035, 0.065, frame.pad.w)
  );
  // A slight base-tone blend keeps distant water coherent without overwriting
  // the normals, highlights, moving crests, flow foam, or shoreline waves.
  color = mix(color, aliveCalmSea, ocean * 0.08);
  color = mix(
    color,
    vec3f(0.72, 0.86, 0.81),
    seaShoreline * brokenFoam * 0.15
  );
  // Merge the distant ocean into atmospheric haze before its geometry reaches
  // the square simulation boundary. This removes both the former deep-water
  // opacity contour and the radial "sea dome" silhouette.
  let radialDistance = length(input.worldPosition.xz);
  let outerMerge = smoothstep(
    frame.world.x * 0.28,
    frame.world.x * 0.48,
    radialDistance
  );
  let distanceToCamera = distance(frame.cameraPosition.xyz, input.worldPosition);
  let fogAmount = smoothstep(frame.fog.x, frame.fog.y, distanceToCamera);
  // Keep distant water in the same tonal family as the background ocean.
  // Mixing it toward the brighter generic sky color made the finite mesh read
  // as a pale circular bubble when the camera was fully zoomed out.
  let seaHaze = mix(
    calmSeaColor,
    mix(
      vec3f(0.025, 0.085, 0.16),
      vec3f(0.075, 0.42, 0.49),
      frame.pad.w
    ),
    0.66
  );
  color = mix(color, seaHaze, fogAmount * 0.86);
  // Apply the domain merge after distance fog so the final outer band cannot
  // be brightened back into a visible dome.
  color = mix(color, seaHaze, outerMerge);
  // Preserve a tiny smooth optical variation after atmospheric merging. It
  // remains low-contrast; the readable surface structure primarily comes from
  // the light-responsive Perlin normal rather than a painted albedo pattern.
  color = color * (
    1.0
      + (
        (fineSignal - 0.5) * 0.07
      )
        * ocean
        * (1.0 - outerMerge)
  );
  // The finite water sheet now dissolves only through the same broad circular
  // blend used by the terrain. A real far-ocean plane sits underneath, so the
  // old rounded-square product of radial and axis-aligned fades is unnecessary.
  let radialFade = 1.0 - outerMerge;
  let coverage = smoothstep(
    0.002,
    0.32,
    input.coverage
  );
  // Two broad absorption ranges keep freshly poured shallows transparent while
  // obscuring the bottom continuously in truly deep sea. The previous curve
  // became less opaque again at depth, making the seabed cutoff conspicuous.
  let shallowOpacity = smoothstep(0.015, 2.25, input.depth);
  let deepOpacity = smoothstep(1.65, 8.8, input.depth);
  let openSeaOpacity = clamp(
    shallowOpacity * 0.43 + deepOpacity * 0.57,
    0.0,
    1.0
  );
  let baseAlpha = 0.045
    + shallowOpacity * 0.37
    + deepOpacity * 0.545;
  let alpha = clamp(
    (
      baseAlpha
        + fresnel * mix(0.06, 0.11, openSeaOpacity)
        + shoreline * mix(0.08, 0.2, ocean)
        + disturbanceFoam * 0.055
        + springCue * 0.085
        + flowStrength * (0.005 + flowPatch * 0.026)
    )
      * radialFade * coverage,
    0.0,
    0.985
  );
  if (alpha < 0.008) {
    discard;
  }
  return vec4f(color, alpha);
}
`;var dt=L+Me+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> waterFlux: StateBuffer;
@group(0) @binding(3) var<storage, read> sandFlux: StateBuffer;
@group(0) @binding(4) var<storage, read> soil: SoilBuffer;

struct WaterConnectivityBuffer {
  values: array<vec4u>,
}
@group(0) @binding(5) var<storage, read> stableConnectivity: WaterConnectivityBuffer;

struct VertexInput {
  @location(0) position: vec3f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) depth: f32,
  @location(2) coverage: f32,
  @location(3) shoreProfile: f32,
  @location(4) openness: f32,
  @location(5) oceanMask: f32,
  @location(6) flowHint: f32,
  @location(7) opticalField: vec4f,
  @location(8) flowVector: vec2f,
  @location(9) physicalSurfaceSlope: vec2f,
  @location(10) flowCompression: f32,
  @location(11) turbidity: vec2f,
}

struct WaterVisualSample {
  surface: f32,
  depth: f32,
  wetness: f32,
  shoreProfile: f32,
  openness: f32,
  ocean: f32,
  flow: f32,
  flowVector: vec2f,
}

fn stateAtCell(p: vec2i) -> vec4f {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  return state.values[gridIndex(cell.x, cell.y)];
}

fn waterClassAtCell(p: vec2i) -> f32 {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  return sandFlux.values[gridIndex(cell.x, cell.y)].w;
}

fn flowAtCell(p: vec2i) -> vec4f {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  return waterFlux.values[gridIndex(cell.x, cell.y)];
}

fn cubicWeights(t: f32) -> vec4f {
  // Uniform cubic B-spline reconstruction is a convex, low-pass interpolation.
  // Unlike nearest-cell sampling, it cannot magnify the simulation's alternating
  // cell mode into a large 192-versus-288 render-grid moire pattern.
  let t2 = t * t;
  let t3 = t2 * t;
  return vec4f(
    (1.0 - 3.0 * t + 3.0 * t2 - t3) / 6.0,
    (4.0 - 6.0 * t2 + 3.0 * t3) / 6.0,
    (1.0 + 3.0 * t + 3.0 * t2 - 3.0 * t3) / 6.0,
    t3 / 6.0
  );
}

fn suspendedSedimentAtCell(p: vec2i) -> vec2f {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  let soilValue = soil.values[gridIndex(cell.x, cell.y)];
  return max(
    vec2f(0.0),
    vec2f(soilValue.suspendedSand, soilValue.suspendedDirt)
  );
}

fn cubicDerivativeWeights(t: f32) -> vec4f {
  let t2 = t * t;
  return vec4f(
    (-3.0 + 6.0 * t - 3.0 * t2) / 6.0,
    (-12.0 * t + 9.0 * t2) / 6.0,
    (3.0 + 6.0 * t - 9.0 * t2) / 6.0,
    (3.0 * t2) / 6.0
  );
}

fn waterVisualAtCell(p: vec2i) -> WaterVisualSample {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  let index = gridIndex(cell.x, cell.y);
  let value = stateAtCell(p);
  let terrainHeight = value.x + value.y;
  let physicalDepth = max(0.0, value.z);
  let visualDepth = physicalDepth;
  let surface = terrainHeight + physicalDepth;
  let wetness = smoothstep(0.002, 0.055, visualDepth);
  let shoreProfile = smoothstep(0.0, 0.72, visualDepth);
  let openness = clamp(waterClassAtCell(p) * 4.0, 0.0, 1.0);
  let flux = flowAtCell(p);
  let rawFlow = max(
    flux.x,
    length(flux.zw) / (physicalDepth + 0.12)
  );
  // The CFL-bounded solver moves less per tick than the former unstable one.
  // Lower visual thresholds recover readable whitewater without feeding flow
  // back into geometry, alpha, or the shoreline classification.
  let flow = smoothstep(0.0012, 0.055, rawFlow) * wetness;
  let directionLength = length(flux.zw);
  let flowVector = select(
    vec2f(0.0),
    flux.zw / max(directionLength, 0.000001) * flow,
    directionLength > 0.000001
  );
  return WaterVisualSample(
    surface,
    visualDepth,
    wetness,
    shoreProfile,
    openness,
    select(0.0, 1.0, stableConnectivity.values[index].y != 0u),
    flow,
    flowVector
  );
}

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
  let uv = clamp(
    input.position.xz / frame.world.x + vec2f(0.5),
    vec2f(0.0),
    vec2f(1.0)
  );
  let gridPosition = uv * f32(gridSize() - 1u);
  let integerPosition = vec2i(floor(gridPosition));
  let fraction = fract(gridPosition);
  let weightX = cubicWeights(fraction.x);
  let weightY = cubicWeights(fraction.y);
  let derivativeWeightX = cubicDerivativeWeights(fraction.x);
  let derivativeWeightY = cubicDerivativeWeights(fraction.y);

  var surfaceSum = 0.0;
  var wetSurfaceWeight = 0.0;
  var surfaceDerivativeXSum = 0.0;
  var surfaceDerivativeYSum = 0.0;
  var wetWeightDerivativeX = 0.0;
  var wetWeightDerivativeY = 0.0;
  var depthSum = 0.0;
  var coverageSum = 0.0;
  var opennessSum = 0.0;
  var oceanSum = 0.0;
  var flowSum = 0.0;
  var flowVectorSum = vec2f(0.0);
  var flowVectorDerivativeXSum = vec2f(0.0);
  var flowVectorDerivativeYSum = vec2f(0.0);
  var turbiditySum = vec2f(0.0);
  for (var sampleY = 0; sampleY < 4; sampleY = sampleY + 1) {
    for (var sampleX = 0; sampleX < 4; sampleX = sampleX + 1) {
      let samplePosition = integerPosition
        + vec2i(sampleX - 1, sampleY - 1);
      let sampleValue = waterVisualAtCell(samplePosition);
      let sampleWeight = weightX[u32(sampleX)] * weightY[u32(sampleY)];
      let sampleDerivativeX = derivativeWeightX[u32(sampleX)]
        * weightY[u32(sampleY)];
      let sampleDerivativeY = weightX[u32(sampleX)]
        * derivativeWeightY[u32(sampleY)];
      let wetWeight = sampleWeight * sampleValue.wetness;
      surfaceSum = surfaceSum + sampleValue.surface * wetWeight;
      wetSurfaceWeight = wetSurfaceWeight + wetWeight;
      surfaceDerivativeXSum = surfaceDerivativeXSum
        + sampleValue.surface * sampleValue.wetness * sampleDerivativeX;
      surfaceDerivativeYSum = surfaceDerivativeYSum
        + sampleValue.surface * sampleValue.wetness * sampleDerivativeY;
      wetWeightDerivativeX = wetWeightDerivativeX
        + sampleValue.wetness * sampleDerivativeX;
      wetWeightDerivativeY = wetWeightDerivativeY
        + sampleValue.wetness * sampleDerivativeY;
      depthSum = depthSum + sampleValue.depth * sampleWeight;
      coverageSum = coverageSum + sampleValue.wetness * sampleWeight;
      opennessSum = opennessSum + sampleValue.openness * wetWeight;
      oceanSum = oceanSum + sampleValue.ocean * wetWeight;
      flowSum = flowSum + sampleValue.flow * wetWeight;
      flowVectorSum = flowVectorSum + sampleValue.flowVector * wetWeight;
      flowVectorDerivativeXSum = flowVectorDerivativeXSum
        + sampleValue.flowVector * sampleValue.wetness * sampleDerivativeX;
      flowVectorDerivativeYSum = flowVectorDerivativeYSum
        + sampleValue.flowVector * sampleValue.wetness * sampleDerivativeY;
      turbiditySum = turbiditySum
        + suspendedSedimentAtCell(samplePosition) * wetWeight;
    }
  }

  // Treat wetness as the rational B-spline weight. The quotient derivative
  // reconstructs the physical free-surface slope analytically from these same
  // sixteen samples, avoiding extra state reads and finite-difference shimmer.
  let inverseWetWeight = 1.0 / max(wetSurfaceWeight, 0.0001);
  let reconstructedSurface = surfaceSum * inverseWetWeight;
  let gridSurfaceSlope = vec2f(
    (surfaceDerivativeXSum
      - reconstructedSurface * wetWeightDerivativeX) * inverseWetWeight,
    (surfaceDerivativeYSum
      - reconstructedSurface * wetWeightDerivativeY) * inverseWetWeight
  );
  let gridToWorld = f32(gridSize() - 1u) / frame.world.x;
  let physicalSurfaceSlope = gridSurfaceSlope
    * gridToWorld
    * smoothstep(0.015, 0.2, wetSurfaceWeight);
  let visualDepth = max(0.0, depthSum);
  let coverage = clamp(coverageSum, 0.0, 1.0);
  // Derive the visible shoreline coordinate after depth reconstruction. Averaging
  // a pre-thresholded per-cell contour left piecewise corners on curved beaches;
  // this broad post-filter mapping follows the smooth B-spline depth field.
  let shoreProfile = smoothstep(0.0, 0.78, visualDepth);
  let openness = clamp(opennessSum * inverseWetWeight, 0.0, 1.0);
  let oceanMask = clamp(oceanSum * inverseWetWeight, 0.0, 1.0);
  let flowHint = clamp(flowSum * inverseWetWeight, 0.0, 1.0);
  let flowVector = flowVectorSum * inverseWetWeight;
  let flowDerivativeX = (
    flowVectorDerivativeXSum - flowVector * wetWeightDerivativeX
  ) * inverseWetWeight * gridToWorld;
  let flowDerivativeY = (
    flowVectorDerivativeYSum - flowVector * wetWeightDerivativeY
  ) * inverseWetWeight * gridToWorld;
  let flowDivergence = flowDerivativeX.x + flowDerivativeY.y;
  let flowCompression = max(0.0, -flowDivergence)
    * smoothstep(0.015, 0.2, wetSurfaceWeight);

  // Geometry follows only the conservative physical state. Hand interaction,
  // spring supply, breaches, and wakes become visible after the solver moves
  // mass; the renderer does not add bowls, radial lifts, or scripted waves.
  let surfaceHeight = reconstructedSurface + 0.055;

  let worldPosition = vec3f(
    input.position.x,
    surfaceHeight,
    input.position.z
  );
  var output: VertexOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  output.depth = visualDepth;
  output.coverage = coverage;
  output.shoreProfile = shoreProfile;
  output.openness = openness;
  output.oceanMask = oceanMask;
  output.flowHint = flowHint;
  output.flowVector = flowVector;
  output.physicalSurfaceSlope = physicalSurfaceSlope;
  output.flowCompression = flowCompression;
  // Same convex 4x4 reconstruction as depth/flow; no per-cell opacity grid.
  output.turbidity = max(vec2f(0.0), turbiditySum * inverseWetWeight);
  // This field is continuous in world space and independent of every simulation
  // buffer. Evaluating it per vertex is far cheaper than three gradient-noise
  // evaluations per water pixel and supplies coherent light-responsive normals.
  output.opticalField = waterOpticalField(
    worldPosition.xz,
    frame.cameraUpTime.w
  );
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let time = frame.cameraUpTime.w;
  let worldXZ = input.worldPosition.xz;
  let depth = input.depth;
  let day = frame.pad.w;
  let opticalField = input.opticalField;
  let surfaceNoise = clamp(
    opticalField.x * 0.68 + opticalField.y * 0.32,
    -1.0,
    1.0
  );
  let detailNoise = gradientNoiseSigned(
    mat2x2f(0.71, 0.704, -0.704, 0.71) * worldXZ * 0.34
      + vec2f(time * 0.008, -time * 0.006)
      + vec2f(7.0, 41.0)
      + vec2f(surfaceNoise * 0.21, opticalField.y * 0.17)
  );

  let microField = waterMicroField(worldXZ, time, opticalField.xy);
  let microFootprint = length(fwidth(worldXZ));
  let microVisibility = 1.0 - smoothstep(
    0.68,
    2.45,
    microFootprint
  );
  let microSlope = microField.xy * microVisibility;
  let microSignal = microField.z * microVisibility;
  let microCrest = microField.w * microVisibility;

  let flowVectorLength = length(input.flowVector);
  let streamDirection = select(
    vec2f(0.0),
    input.flowVector / max(flowVectorLength, 0.0001),
    flowVectorLength > 0.0001
  );
  let meaningfulFlow = smoothstep(0.025, 0.14, flowVectorLength)
    * smoothstep(0.04, 0.18, input.flowHint);
  // Constant-phase lines of dot(position, flowDirection) are orthogonal to the
  // actual flow vector. A derivative-sized zero crossing keeps them thin.
  let streamPhase = dot(worldXZ, streamDirection) * 3.4
    - time * (1.35 + input.flowHint * 2.8)
    + detailNoise * 0.46;
  let streamCarrier = sin(streamPhase);
  let streamAA = max(0.018, fwidth(streamCarrier) * 0.76);
  let streamBreak = smoothstep(
    -0.18,
    0.5,
    detailNoise * 0.82 + opticalField.y * 0.18
  );
  let fastFlow = smoothstep(0.035, 0.22, input.flowHint);
  let rapidFlow = smoothstep(0.2, 0.56, input.flowHint);
  let flowOpticalSlope = streamDirection
    * cos(streamPhase)
    * fastFlow
    * meaningfulFlow
    * streamBreak
    * 0.0075;

  let waterBodyScale = max(
    input.oceanMask,
    smoothstep(0.28, 0.92, input.openness)
  );
  let surfaceActivity = mix(
    0.24,
    1.0,
    waterBodyScale
  ) * smoothstep(0.008, 0.18, input.coverage);
  let macroStrength = mix(
    1.65,
    2.35,
    smoothstep(0.08, 2.8, depth)
  );
  let microStrength = mix(0.78, 1.45, waterBodyScale);
  let physicalSlopeLength = length(input.physicalSurfaceSlope);
  let boundedPhysicalSurfaceSlope = input.physicalSurfaceSlope
    / max(1.0, physicalSlopeLength / 0.72);
  let opticalSlope = boundedPhysicalSurfaceSlope
    + opticalField.zw
    * macroStrength
    * surfaceActivity
    + microSlope * microStrength * surfaceActivity
    + flowOpticalSlope;
  let normal = normalize(vec3f(
    -opticalSlope.x,
    1.0,
    -opticalSlope.y
  ));

  let viewDirection = normalize(
    frame.cameraPosition.xyz - input.worldPosition
  );
  let sunDirection = normalize(frame.sun.xyz);
  let ndv = max(dot(normal, viewDirection), 0.0);
  let fresnel = 0.025 + 0.975 * pow(1.0 - ndv, 4.8);
  let reflectedView = reflect(-viewDirection, normal);
  let skyHeight = smoothstep(-0.2, 0.82, reflectedView.y);
  let daySky = mix(
    vec3f(0.11, 0.42, 0.5),
    vec3f(0.37, 0.7, 0.75),
    skyHeight
  );
  let nightSky = mix(
    vec3f(0.012, 0.05, 0.11),
    vec3f(0.075, 0.16, 0.27),
    skyHeight
  );
  let reflectedSky = mix(nightSky, daySky, day);

  let depthBlend = smoothstep(0.45, 6.4, depth);
  // Shallow water contributes only a restrained turquoise absorption tint; the
  // bed remains visible until depth actually warrants a saturated water body.
  let shallowDay = vec3f(0.12, 0.385, 0.365);
  let deepDay = vec3f(0.014, 0.18, 0.285);
  let shallowNight = vec3f(0.028, 0.145, 0.17);
  let deepNight = vec3f(0.005, 0.045, 0.105);
  let dayBody = mix(shallowDay, deepDay, depthBlend);
  let nightBody = mix(shallowNight, deepNight, depthBlend);
  var color = mix(nightBody, dayBody, day);
  let sedimentConcentration = input.turbidity / max(depth, 0.08);
  let sandTurbidity = smoothstep(0.008, 0.22, sedimentConcentration.x);
  let dirtTurbidity = smoothstep(0.003, 0.14, sedimentConcentration.y);
  let turbidityTint = mix(
    vec3f(0.61, 0.52, 0.35),
    vec3f(0.29, 0.255, 0.155),
    dirtTurbidity / max(sandTurbidity + dirtTurbidity, 0.0001)
  );
  let depthAwareTurbidity = (sandTurbidity * 0.07 + dirtTurbidity * 0.17)
    * smoothstep(0.02, 0.2, input.coverage)
    * (1.0 - smoothstep(5.5, 9.0, depth));
  color = mix(
    color,
    turbidityTint,
    clamp(depthAwareTurbidity, 0.0, 0.2)
  );
  let surfaceTexture = clamp(
    surfaceNoise * 0.4
      + opticalField.y * 0.16
      + microSignal * 0.34
      + detailNoise * 0.1,
    -1.0,
    1.0
  );
  color = color * (
    1.0 + surfaceTexture * mix(0.028, 0.046, day)
  );
  let reflectionWeight = clamp(
    0.075
      + fresnel * 0.56
      + microCrest * surfaceActivity * 0.035,
    0.0,
    0.79
  );
  color = mix(color, reflectedSky, reflectionWeight);

  // The wind spectrum makes reflected light break into short moving wavelets.
  // A separate high-exponent lobe is gated by two rare smooth-noise events, so
  // only a few tiny glints appear instead of a field of repeated decals.
  let reflectedLight = max(
    dot(reflect(-sunDirection, normal), viewDirection),
    0.0
  );
  let broadSpecular = pow(reflectedLight, mix(16.0, 24.0, day));
  let broadBreakup = clamp(
    0.46 + microSignal * 0.24 + surfaceNoise * 0.14,
    0.0,
    1.0
  );
  color = color + frame.pad.xyz
    * frame.sun.w
    * broadSpecular
    * broadBreakup
    * mix(0.065, 0.145, day);
  let glintMask = smoothstep(0.72, 0.9, detailNoise)
    * smoothstep(0.52, 0.8, opticalField.y)
    * surfaceActivity;
  let sharpSpecular = pow(
    reflectedLight,
    mix(78.0, 112.0, day)
  );
  let glintStrength = sharpSpecular
    * glintMask
    * frame.sun.w
    * mix(0.45, 0.95, day);
  color = color + frame.pad.xyz * glintStrength;

  // Periodic ebb belongs only to the verified broad exterior sea. Inland lakes,
  // rivers, and newly trapped components retain a still physical shoreline.
  let ebb01 = 0.5 + 0.5 * sin(time * (6.28318530718 / 8.0));
  let oceanBodyScale = input.oceanMask
    * smoothstep(0.006, 0.12, input.coverage);
  let washCenter = mix(0.16, 0.7, ebb01) + surfaceNoise * 0.018;
  let washAA = max(0.035, fwidth(input.shoreProfile) * 1.45);
  let washBand = (
    1.0 - smoothstep(
      washAA * 0.45,
      washAA * 5.0,
      abs(input.shoreProfile - washCenter)
    )
  ) * oceanBodyScale;
  let trailingCenter = washCenter - 0.115;
  let trailingBand = (
    1.0 - smoothstep(
      washAA * 0.55,
      washAA * 4.2,
      abs(input.shoreProfile - trailingCenter)
    )
  ) * oceanBodyScale * 0.38;
  let washBreakup = mix(
    0.78,
    1.0,
    smoothstep(
      -0.62,
      0.52,
      surfaceNoise * 0.82 + opticalField.y * 0.18
    )
  );
  let shoreline = clamp(washBand + trailingBand, 0.0, 1.0)
    * washBreakup;
  let shoreSheen = smoothstep(
    washCenter - 0.24,
    washCenter - 0.035,
    input.shoreProfile
  ) * (
    1.0 - smoothstep(
      washCenter + 0.035,
      washCenter + 0.24,
      input.shoreProfile
    )
  ) * oceanBodyScale;

  // Flow crests are derivative-sized and orthogonal to the reconstructed flow
  // vector. Normal distortion carries ordinary motion; only strong shallow flow
  // becomes whitewater, so no cyan body-colour ribbons are painted over water.
  let shallowRapid = 1.0 - smoothstep(1.15, 3.6, depth);
  let compressionGate = smoothstep(0.025, 0.32, input.flowCompression);
  let surfaceSlopeGate = smoothstep(0.075, 0.36, physicalSlopeLength);
  let physicalBreakGate = clamp(compressionGate + surfaceSlopeGate, 0.0, 1.0);
  let thinWhitewaterCrest = 1.0 - smoothstep(
    streamAA,
    streamAA * 2.8,
    abs(streamCarrier)
  );
  let flowFoam = rapidFlow
    * meaningfulFlow
    * physicalBreakGate
    * thinWhitewaterCrest
    * streamBreak
    * shallowRapid
    * smoothstep(-0.05, 0.58, detailNoise);

  color = mix(
    color,
    vec3f(0.94, 0.98, 0.96),
    clamp(
      shoreline * 0.58
        + shoreSheen * 0.1
        + flowFoam * 0.72,
      0.0,
      0.82
    )
  );

  let radialDistance = length(worldXZ);
  let outerMerge = smoothstep(
    frame.world.x * 0.28,
    frame.world.x * 0.48,
    radialDistance
  ) * input.oceanMask;
  let distanceToCamera = distance(
    frame.cameraPosition.xyz,
    input.worldPosition
  );
  let fogAmount = smoothstep(frame.fog.x, frame.fog.y, distanceToCamera);
  let seaHaze = mix(
    vec3f(0.018, 0.07, 0.14),
    vec3f(0.055, 0.34, 0.43),
    day
  );
  let texturedSeaHaze = seaHaze * (
    1.0 + surfaceTexture * mix(0.028, 0.05, day)
  );
  color = mix(color, texturedSeaHaze, fogAmount * 0.74);
  color = mix(color, texturedSeaHaze, outerMerge);

  let coverageAA = max(0.012, fwidth(input.coverage) * 1.4);
  let coverage = smoothstep(
    0.006 - coverageAA,
    0.15 + coverageAA,
    input.coverage
  );
  // Beer-Lambert-like absorption keeps centimetres of water genuinely clear,
  // while deep water becomes opaque continuously. Reflections remain visible in
  // shallows without requiring a flat blue body-colour veil.
  let absorptionOpacity = 1.0 - exp(-depth * 0.42);
  let alpha = clamp(
    (
      0.025
        + absorptionOpacity * 0.62
        + fresnel * 0.12
        + broadSpecular * 0.025
        + shoreline * 0.12
        + shoreSheen * 0.025
        + flowFoam * 0.08
    )
      * (1.0 - outerMerge)
      * coverage,
    0.0,
    0.985
  );
  if (alpha < 0.008) {
    discard;
  }
  return vec4f(color, alpha);
}
`,ft=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> elements: ElementBuffer;

struct VertexInput {
  @location(0) position: vec3f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) normal: vec3f,
  @location(2) element: vec4f,
  @location(3) waterDepth: f32,
}

fn elementSurfaceAt(p: vec2i) -> f32 {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  let index = gridIndex(cell.x, cell.y);
  let terrainValue = state.values[index];
  let elementValue = elements.values[index];
  let waterFilm = smoothstep(0.00035, 0.0015, terrainValue.z);
  let visibleOilThickness = mix(
    elementValue.y,
    min(elementValue.y, 0.018),
    waterFilm
  );
  return terrainValue.x
    + terrainValue.y
    + terrainValue.z
    + elementValue.x
    + visibleOilThickness;
}

fn elementWaterDepthAt(p: vec2i) -> f32 {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  return state.values[gridIndex(cell.x, cell.y)].z;
}

fn oilDepthAt(p: vec2i) -> f32 {
  let hi = i32(gridSize()) - 1;
  let cell = vec2u(clamp(p, vec2i(0), vec2i(hi)));
  return elements.values[gridIndex(cell.x, cell.y)].y;
}

fn stableOilDepthAt(p: vec2i) -> f32 {
  return oilDepthAt(p) * 0.34
    + (
      oilDepthAt(p + vec2i(-1, 0))
        + oilDepthAt(p + vec2i(1, 0))
        + oilDepthAt(p + vec2i(0, -1))
        + oilDepthAt(p + vec2i(0, 1))
    ) * 0.11
    + (
      oilDepthAt(p + vec2i(-1, -1))
        + oilDepthAt(p + vec2i(1, -1))
        + oilDepthAt(p + vec2i(-1, 1))
        + oilDepthAt(p + vec2i(1, 1))
    ) * 0.04
    + (
      oilDepthAt(p + vec2i(-2, 0))
        + oilDepthAt(p + vec2i(2, 0))
        + oilDepthAt(p + vec2i(0, -2))
        + oilDepthAt(p + vec2i(0, 2))
    ) * 0.015;
}

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
  let cell = cellFromWorld(input.position.xz);
  let p = vec2i(cell);
  let index = gridIndex(cell.x, cell.y);
  let elementValue = elements.values[index];
  let center = elementSurfaceAt(p);
  let left = elementSurfaceAt(p + vec2i(-1, 0));
  let right = elementSurfaceAt(p + vec2i(1, 0));
  let down = elementSurfaceAt(p + vec2i(0, -1));
  let up = elementSurfaceAt(p + vec2i(0, 1));
  let waterCenter = cellHeight(&state, p, true);
  let waterLeft = cellHeight(&state, p + vec2i(-1, 0), true);
  let waterRight = cellHeight(&state, p + vec2i(1, 0), true);
  let waterDown = cellHeight(&state, p + vec2i(0, -1), true);
  let waterUp = cellHeight(&state, p + vec2i(0, 1), true);
  let waterDownLeft = cellHeight(&state, p + vec2i(-1, -1), true);
  let waterDownRight = cellHeight(&state, p + vec2i(1, -1), true);
  let waterUpLeft = cellHeight(&state, p + vec2i(-1, 1), true);
  let waterUpRight = cellHeight(&state, p + vec2i(1, 1), true);
  let waterFarLeft = cellHeight(&state, p + vec2i(-2, 0), true);
  let waterFarRight = cellHeight(&state, p + vec2i(2, 0), true);
  let waterFarDown = cellHeight(&state, p + vec2i(0, -2), true);
  let waterFarUp = cellHeight(&state, p + vec2i(0, 2), true);
  // Match the water mesh's wet-neighbor filter exactly. Floating oil is an
  // opaque cap on that stable skin, not a second grid-shaped water sheet.
  var waterSurfaceSum = 0.0;
  var waterDepthSum = 0.0;
  var waterWeightSum = 0.0;
  for (var oy = -2; oy <= 2; oy = oy + 1) {
    for (var ox = -2; ox <= 2; ox = ox + 1) {
      let offset = vec2i(ox, oy);
      let sampleDepth = elementWaterDepthAt(p + offset);
      let distanceSquared = f32(ox * ox + oy * oy);
      let kernel = exp(-distanceSquared * 0.42);
      let wet = smoothstep(0.002, 0.075, sampleDepth);
      let sampleWeight = kernel * wet;
      waterSurfaceSum = waterSurfaceSum
        + cellHeight(&state, p + offset, true) * sampleWeight;
      waterDepthSum = waterDepthSum + sampleDepth * sampleWeight;
      waterWeightSum = waterWeightSum + sampleWeight;
    }
  }
  let filteredWaterHeight = select(
    waterCenter,
    waterSurfaceSum / waterWeightSum,
    waterWeightSum > 0.0001
  );
  let filteredWaterDepth = select(
    elementWaterDepthAt(p),
    waterDepthSum / waterWeightSum,
    waterWeightSum > 0.0001
  );
  let filteredOilDepth = stableOilDepthAt(p);
  let centerTerrain = state.values[index];
  let filteredWaterSurface = filteredWaterHeight + 0.055;
  // Treat millimetres of water as a support layer. This keeps shallow streams
  // and pond margins on the exact same oil-film path as the deep sea without
  // tying geometry to cosmetic shoreline ebbing.
  let waterFilm = smoothstep(
    0.00035,
    0.0015,
    filteredWaterDepth
  );
  let cellSize = frame.world.x / f32(gridSize() - 1u);
  let landElementNormal = normalize(vec3f(
    left - right,
    cellSize * 2.0,
    down - up
  ));
  let filteredWaterNormal = normalize(vec3f(
    clamp(waterLeft - waterRight, -0.38, 0.38),
    cellSize * 5.5,
    clamp(waterDown - waterUp, -0.38, 0.38)
  ));
  let floatingOilNormal = normalize(mix(
    filteredWaterNormal,
    vec3f(0.0, 1.0, 0.0),
    0.88
  ));
  // Raise the whole anti-aliased oil neighborhood onto the water skin before
  // it becomes visibly opaque. Without this wider geometry mask, transparent
  // edge vertices fell to the bottom and stretched the oil into black tents.
  let floatingOilGeometry = waterFilm * smoothstep(
    0.00004,
    0.0014,
    filteredOilDepth
  );
  let surfaceNormal = normalize(mix(
    landElementNormal,
    floatingOilNormal,
    floatingOilGeometry
  ));
  let solidElementSurface = centerTerrain.x
    + centerTerrain.y
    + elementValue.x
    + elementValue.y;
  let worldPosition = vec3f(
    input.position.x,
    mix(
      solidElementSurface + 0.075,
      filteredWaterSurface + 0.018,
      floatingOilGeometry
    ),
    input.position.z
  );
  var output: VertexOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  output.normal = surfaceNormal;
  output.element = vec4f(
    elementValue.x,
    mix(elementValue.y, filteredOilDepth, waterFilm),
    elementValue.z,
    elementValue.w
  );
  output.waterDepth = filteredWaterDepth;
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let lavaDepth = input.element.x;
  let oilDepth = input.element.y;
  let waterFilm = smoothstep(0.00035, 0.0015, input.waterDepth);
  let oilVisibilityThreshold = mix(0.006, 0.00075, waterFilm);
  if (lavaDepth < 0.006 && oilDepth < oilVisibilityThreshold) {
    discard;
  }

  let time = frame.cameraUpTime.w;
  let worldXZ = input.worldPosition.xz;
  let lavaWarp = gradientNoiseSigned(
    worldXZ * 0.28 + vec2f(time * 0.0028, -time * 0.0019)
  ) * 0.13;
  let lavaCell = gradientNoiseSigned(
    worldXZ * 1.18
      + vec2f(-time * 0.0042, time * 0.0032)
      + lavaWarp * vec2f(0.18, -0.14)
  );
  let lavaBreak = gradientNoiseSigned(
    mat2x2f(0.53, 0.85, -0.85, 0.53) * worldXZ * 1.72
      + vec2f(time * 0.0025, time * 0.0036)
      - lavaWarp * 0.12
  );
  let lavaWidthA = max(0.012, fwidth(lavaCell) * 0.38);
  let lavaWidthB = max(0.01, fwidth(lavaBreak) * 0.34);
  let crackA = (
    1.0 - smoothstep(
      lavaWidthA,
      lavaWidthA * 2.0,
      abs(lavaCell)
    )
  )
    * smoothstep(-0.24, 0.2, lavaBreak);
  let crackB = (
    1.0 - smoothstep(
      lavaWidthB,
      lavaWidthB * 1.9,
      abs(lavaBreak)
    )
  )
    * smoothstep(-0.18, 0.28, -lavaCell);
  let brokenCell = clamp(
    0.5
      + gradientNoiseSigned(
        worldXZ * 0.66
          + vec2f(time * 0.0018, -time * 0.0012)
      ) * 0.5,
    0.0,
    1.0
  );
  let finePores = smoothstep(
    0.63,
    0.9,
    gradientNoiseSigned(worldXZ * 2.7 - vec2f(time * 0.002, 0.0))
      * 0.5 + 0.5
  );
  let crack = max(crackA, crackB * 0.76)
    * mix(0.54, 0.88, brokenCell)
    + finePores * 0.1;
  let hot = clamp(
    input.element.w * 0.72
      + smoothstep(0.025, 0.38, lavaDepth) * 0.42,
    0.0,
    1.0
  );
  let crust = mix(
    vec3f(0.13, 0.064, 0.032),
    vec3f(0.042, 0.031, 0.025),
    clamp(
      0.38
        + (brokenCell - 0.5) * 0.2
        + lavaWarp * 0.06,
      0.0,
      1.0
    )
  );
  let molten = mix(
    vec3f(0.95, 0.17, 0.015),
    vec3f(1.0, 0.61, 0.065),
    clamp(0.46 + lavaCell * 0.26 + lavaBreak * 0.12 + hot * 0.22, 0.0, 1.0)
  );
  let simmer = 0.965 + 0.035 * sin(
    time * 0.14 + lavaCell * 3.2 + lavaBreak * 1.7
  );
  let lavaNormal = normalize(
    input.normal + vec3f(lavaCell, 0.0, lavaBreak) * 0.021
  );
  var lavaColor = lightColor(
    input.worldPosition,
    lavaNormal,
    mix(crust, molten, crack * mix(0.38, 0.78, hot)),
    0.12
  );
  lavaColor = lavaColor
    + molten * crack * (0.2 + hot * 0.72) * simmer
    + vec3f(0.26, 0.023, 0.004) * hot * 0.14;
  // A compact bright vent and slowly breathing ring mark the persistent source
  // at the crater floor without adding another draw call.
  let lavaVentCenter = mix(
    vec2f(46.0, -28.0),
    vec2f(2.0, 55.0),
    step(0.5, frame.brushVisual.w)
  );
  let lavaVentDistance = distance(worldXZ, lavaVentCenter);
  let lavaVentCore = 1.0 - smoothstep(0.24, 1.75, lavaVentDistance);
  let lavaVentAA = max(0.06, fwidth(lavaVentDistance) * 0.78);
  let lavaVentRingRadius = 1.55 + 0.13 * sin(time * 0.34);
  let lavaVentRing = (
    1.0 - smoothstep(
      lavaVentAA,
      lavaVentAA * 3.2,
      abs(lavaVentDistance - lavaVentRingRadius)
    )
  ) * lavaVentCore;
  let lavaVentBubble = smoothstep(
    0.62,
    0.94,
    sin(
      lavaVentDistance * 4.6
        - time * 0.24
        + gradientNoiseSigned(worldXZ * 1.3) * 2.2
    ) * 0.5 + 0.5
  ) * lavaVentCore;
  lavaColor = lavaColor
    + vec3f(0.95, 0.23, 0.018)
      * lavaVentCore
      * (0.18 + lavaVentBubble * 0.3)
    + vec3f(1.0, 0.66, 0.09)
      * lavaVentRing
      * 0.34;

  // Floating oil moves mostly with the water body, so its tar mottling drifts
  // much more slowly than a thick land puddle instead of visibly trembling.
  let oilMotion = 1.0 - waterFilm;
  let oilWarp = vec2f(
    gradientNoiseSigned(
      worldXZ * 0.31
        + vec2f(time * 0.021, -time * 0.017) * oilMotion
    ),
    gradientNoiseSigned(
      worldXZ.yx * 0.37
        + vec2f(-time * 0.018, time * 0.024) * oilMotion
    )
  );
  let oilNormal = normalize(input.normal + vec3f(oilWarp.x, 0.0, oilWarp.y) * 0.038);
  let viewDirection = normalize(frame.cameraPosition.xyz - input.worldPosition);
  let fresnel = pow(1.0 - max(dot(viewDirection, oilNormal), 0.0), 3.2);
  let film = dot(worldXZ, vec2f(0.21, -0.17))
    + layeredGradientNoise(worldXZ * 0.16 + oilWarp) * 4.2
    - time * mix(0.045, 0.0, waterFilm);
  let iridescence = vec3f(
    0.5 + 0.5 * cos(film + 0.0),
    0.5 + 0.5 * cos(film + 2.094),
    0.5 + 0.5 * cos(film + 4.189)
  );
  let landOilBody = mix(
    vec3f(0.007, 0.008, 0.007),
    vec3f(0.032, 0.025, 0.018),
    smoothstep(-0.4, 0.42, oilWarp.x + oilWarp.y * 0.4)
  );
  let floatingOilBody = mix(
    vec3f(0.004, 0.006, 0.006),
    vec3f(0.019, 0.022, 0.017),
    smoothstep(-0.46, 0.5, oilWarp.x + oilWarp.y * 0.32)
  );
  let oilBody = mix(landOilBody, floatingOilBody, waterFilm);
  var oilColor = lightColor(
    input.worldPosition,
    oilNormal,
    oilBody,
    0.02
  );
  let iridescentStrength = mix(
    0.022 + fresnel * 0.09,
    0.014 + fresnel * 0.055,
    waterFilm
  );
  oilColor = oilColor
    + iridescence * iridescentStrength
    + vec3f(0.12, 0.145, 0.12) * fresnel * mix(0.18, 0.12, waterFilm);

  // Over water, filtered oil coverage becomes an opaque floating cap. The
  // smooth coverage ramp is the anti-aliased border; water remains visible
  // only through that narrow edge. Land oil keeps its viscous puddle treatment.
  let oilCover = smoothstep(
    mix(0.0055, 0.00065, waterFilm),
    mix(0.06, 0.0065, waterFilm),
    oilDepth
  );
  var color = mix(lavaColor, oilColor, oilCover);
  let distanceToCamera = distance(frame.cameraPosition.xyz, input.worldPosition);
  let fogAmount = smoothstep(frame.fog.x, frame.fog.y, distanceToCamera);
  color = mix(color, skyColor(input.worldPosition), fogAmount * 0.72);
  let submergedLava = smoothstep(0.14, 2.4, input.waterDepth);
  let lavaAlpha = smoothstep(0.004, 0.035, lavaDepth)
    * mix(0.84, 0.07, submergedLava);
  let landOilAlpha = smoothstep(0.004, 0.04, oilDepth) * 0.91;
  let floatingOilAlpha = smoothstep(0.00065, 0.0055, oilDepth) * 0.98;
  let oilAlpha = mix(landOilAlpha, floatingOilAlpha, waterFilm);
  return vec4f(color, mix(lavaAlpha, oilAlpha, oilCover));
}
`,pt=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> elements: ElementBuffer;

struct HutInstanceBuffer {
  values: array<vec4f>,
}

struct HutDynamics {
  baseline: vec4f,
  collapse: vec4f,
}

struct HutDynamicsBuffer {
  values: array<HutDynamics>,
}

struct LocalLightBuffer {
  values: array<vec4f>,
}

@group(0) @binding(2) var<storage, read> huts: HutInstanceBuffer;
@group(0) @binding(3) var<storage, read> hutDynamics: HutDynamicsBuffer;
@group(0) @binding(4) var<storage, read_write> lightField: LocalLightBuffer;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let lightSize = (gridSize() + 3u) / 4u;
  if (gid.x >= lightSize || gid.y >= lightSize) {
    return;
  }
  let lightIndex = gid.y * lightSize + gid.x;
  let blockStart = gid.xy * 4u;
  var lavaLight = 0.0;
  var fireLight = 0.0;
  for (var sampleY = 0u; sampleY < 4u; sampleY = sampleY + 1u) {
    for (var sampleX = 0u; sampleX < 4u; sampleX = sampleX + 1u) {
      let cell = min(blockStart + vec2u(sampleX, sampleY), vec2u(gridSize() - 1u));
      let element = elements.values[gridIndex(cell.x, cell.y)];
      lavaLight = max(lavaLight, smoothstep(0.005, 0.22, element.x));
      fireLight = max(fireLight, smoothstep(0.035, 0.76, element.z));
    }
  }

  let worldXZ = (
    vec2f(gid.xy) / f32(lightSize - 1u) - vec2f(0.5)
  ) * uniforms.world.x;
  var doorwayLight = 0.0;
  for (var hutIndex = 0u; hutIndex < 8u; hutIndex = hutIndex + 1u) {
    let hut = huts.values[hutIndex];
    let intact = 1.0 - step(0.5, hutDynamics.values[hutIndex].collapse.x);
    let outward = vec2f(-sin(hut.z), cos(hut.z));
    let doorwayPosition = hut.xy + outward * (1.12 * hut.w);
    let delta = worldXZ - doorwayPosition;
    let longitudinal = dot(delta, outward);
    let lateral = dot(delta, vec2f(outward.y, -outward.x));
    let doorwayDistance = length(vec2f(lateral * 1.35, longitudinal * 0.68));
    let pool = 1.0 - smoothstep(0.75, 7.5 * hut.w, doorwayDistance);
    doorwayLight = max(
      doorwayLight,
      intact * pool * pool * smoothstep(-2.0, 1.2, longitudinal)
    );
  }

  let radiance =
      vec3f(1.0, 0.18, 0.02) * lavaLight * 1.25
    + vec3f(1.0, 0.47, 0.065) * fireLight * 1.65
    + vec3f(1.0, 0.36, 0.055) * doorwayLight * 0.72;
  lightField.values[lightIndex] = vec4f(
    radiance,
    max(radiance.r, max(radiance.g, radiance.b))
  );
}
`,mt=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;

struct LocalLightBuffer {
  values: array<vec4f>,
}

@group(0) @binding(1) var<storage, read> lightIn: LocalLightBuffer;
@group(0) @binding(2) var<storage, read_write> lightOut: LocalLightBuffer;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let lightSize = (gridSize() + 3u) / 4u;
  if (gid.x >= lightSize || gid.y >= lightSize) {
    return;
  }
  let weights = array<f32, 7>(0.045, 0.09, 0.19, 0.35, 0.19, 0.09, 0.045);
  var blurred = vec4f(0.0);
  for (var offset = -3; offset <= 3; offset = offset + 1) {
    let sampleX = u32(clamp(i32(gid.x) + offset, 0, i32(lightSize) - 1));
    blurred = blurred
      + lightIn.values[gid.y * lightSize + sampleX] * weights[u32(offset + 3)];
  }
  lightOut.values[gid.y * lightSize + gid.x] = blurred;
}
`,ht=I+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;

struct LocalLightBuffer {
  values: array<vec4f>,
}

@group(0) @binding(1) var<storage, read> lightIn: LocalLightBuffer;
@group(0) @binding(2) var<storage, read_write> lightOut: LocalLightBuffer;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let lightSize = (gridSize() + 3u) / 4u;
  if (gid.x >= lightSize || gid.y >= lightSize) {
    return;
  }
  let weights = array<f32, 7>(0.045, 0.09, 0.19, 0.35, 0.19, 0.09, 0.045);
  var blurred = vec4f(0.0);
  for (var offset = -3; offset <= 3; offset = offset + 1) {
    let sampleY = u32(clamp(i32(gid.y) + offset, 0, i32(lightSize) - 1));
    blurred = blurred
      + lightIn.values[sampleY * lightSize + gid.x] * weights[u32(offset + 3)];
  }
  lightOut.values[gid.y * lightSize + gid.x] = blurred;
}
`,gt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> elements: ElementBuffer;

struct LocalLightBuffer {
  values: array<vec4f>,
}

@group(0) @binding(3) var<storage, read> cachedLightField: LocalLightBuffer;

struct VertexInput {
  @location(0) position: vec3f,
}

struct LocalLightOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) radiance: vec3f,
}

@vertex
fn vertexMain(input: VertexInput) -> LocalLightOutput {
  let directCell = cellFromWorld(input.position.xz);
  let directValue = state.values[gridIndex(directCell.x, directCell.y)];
  let directElement = elements.values[gridIndex(directCell.x, directCell.y)];
  let directGround = directValue.x + directValue.y;
  let directSurface = max(
    directGround,
    max(
      directGround + directValue.z,
      directGround + max(directElement.x, directElement.y)
    )
  );
  let lightSize = (gridSize() + 3u) / 4u;
  let lightUv = clamp(
    input.position.xz / frame.world.x + vec2f(0.5),
    vec2f(0.0),
    vec2f(1.0)
  );
  let lightCell = vec2u(round(lightUv * f32(lightSize - 1u)));
  let cachedRadiance = cachedLightField.values[
    lightCell.y * lightSize + lightCell.x
  ];
  let directWorldPosition = vec3f(
    input.position.x,
    directSurface + 0.075,
    input.position.z
  );
  var directOutput: LocalLightOutput;
  directOutput.position = frame.viewProjection
    * vec4f(directWorldPosition, 1.0);
  directOutput.worldPosition = directWorldPosition;
  directOutput.radiance = cachedRadiance.xyz;
  return directOutput;
}

@fragment
fn fragmentMain(input: LocalLightOutput) -> @location(0) vec4f {
  let night = pow(clamp(1.0 - frame.pad.w, 0.0, 1.0), 1.18);
  let strength = max(input.radiance.r, max(input.radiance.g, input.radiance.b));
  if (night * strength < 0.004) {
    discard;
  }
  let flicker = 0.97 + sin(
    frame.cameraUpTime.w * 5.1
      + input.worldPosition.x * 0.31
      - input.worldPosition.z * 0.23
  ) * 0.03;
  let distanceToCamera = distance(frame.cameraPosition.xyz, input.worldPosition);
  let fogVisibility = 1.0 - smoothstep(frame.fog.x, frame.fog.y, distanceToCamera);
  let alpha = clamp(night * strength * fogVisibility * 0.66, 0.0, 0.68);
  return vec4f(input.radiance * flicker, alpha);
}
`,_t=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> elements: ElementBuffer;

struct VertexInput {
  @location(0) position: vec3f,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) response: vec4f,
}

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
  let cell = cellFromWorld(input.position.xz);
  let index = gridIndex(cell.x, cell.y);
  let terrainValue = state.values[index];
  let elementValue = elements.values[index];
  let steam = clamp(
    elementValue.w
      * smoothstep(0.012, 0.3, terrainValue.z)
      * (1.0 - smoothstep(0.32, 0.86, elementValue.z)),
    0.0,
    1.0
  );
  let pulse = sin(
    frame.cameraUpTime.w * 5.7
      + input.position.x * 0.72
      - input.position.z * 0.61
  ) * 0.5 + 0.5;
  let oilFire = elementValue.z * smoothstep(0.0015, 0.018, elementValue.y);
  let surfaceHeight = terrainValue.x
    + terrainValue.y
    + terrainValue.z
    + elementValue.x
    + elementValue.y;
  let lift = oilFire * mix(0.15, 0.5, pulse) + steam * 0.22;
  let worldPosition = vec3f(
    input.position.x,
    surfaceHeight + 0.12 + lift,
    input.position.z
  );
  var output: VertexOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  output.response = vec4f(oilFire, steam, elementValue.w, pulse);
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  // The grid-sheet effect is reserved for oil fire and steam. Palms and huts
  // render their flames on their own meshes, so ordinary sand can never become
  // a bright additive fire blanket.
  let fire = input.response.x;
  let steam = input.response.y;
  if (fire < 0.008 && steam < 0.012) {
    discard;
  }
  let time = frame.cameraUpTime.w;
  let turbulentA = gradientNoiseSigned(
    input.worldPosition.xz * 0.47
      + vec2f(time * 0.12, -time * 0.16)
  );
  let turbulentB = gradientNoiseSigned(
    mat2x2f(0.62, 0.78, -0.78, 0.62) * input.worldPosition.xz * 0.91
      + vec2f(-time * 0.19, time * 0.14)
  );
  let turbulent = turbulentA * 0.68 + turbulentB * 0.32;
  let flicker = clamp(
    0.52 + turbulent * 0.55 + input.response.w * 0.23,
    0.0,
    1.0
  );
  let ember = vec3f(0.96, 0.13, 0.015);
  let flame = mix(
    ember,
    vec3f(1.0, 0.78, 0.18),
    smoothstep(0.12, 0.86, flicker)
  );
  let smoke = mix(
    vec3f(0.56, 0.58, 0.55),
    vec3f(0.88, 0.9, 0.84),
    smoothstep(-0.2, 0.52, turbulent)
  );
  let fireAlpha = fire * mix(0.38, 0.82, flicker);
  let steamAlpha = steam * mix(0.12, 0.34, flicker);
  let responseMix = steamAlpha / max(0.0001, fireAlpha + steamAlpha);
  let color = mix(flame * (1.1 + input.response.z * 0.38), smoke, responseMix);
  return vec4f(color, clamp(fireAlpha + steamAlpha, 0.0, 0.88));
}
`,vt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> elements: ElementBuffer;
@group(0) @binding(3) var<storage, read> treeFuelMask: ScalarBuffer;

struct SmokeInput {
  @location(0) position: vec3f,
}

struct SmokeOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) response: vec4f,
  @location(2) worldPosition: vec3f,
}

@vertex
fn vertexMain(
  input: SmokeInput,
  @builtin(instance_index) instanceIndex: u32
) -> SmokeOutput {
  // One source represents a 4x4 simulation block and owns three independently
  // cycling puffs. This is far cheaper and more stable than connecting every
  // smoking grid cell into one enormous translucent height-field sheet.
  let layers = 3u;
  let layer = instanceIndex % layers;
  let sourceIndex = instanceIndex / layers;
  let sourceWidth = (gridSize() + 3u) / 4u;
  let sourceX = sourceIndex % sourceWidth;
  let sourceY = sourceIndex / sourceWidth;
  let blockOrigin = vec2u(sourceX * 4u, sourceY * 4u);

  var bestCell = min(blockOrigin, vec2u(gridSize() - 1u));
  var bestStrength = 0.0;
  var bestSoot = 0.0;
  var bestLava = 0.0;
  var bestPlant = 0.0;
  var bestBlast = 0.0;
  for (var oy = 0u; oy < 4u; oy = oy + 1u) {
    for (var ox = 0u; ox < 4u; ox = ox + 1u) {
      let sampleCell = min(
        blockOrigin + vec2u(ox, oy),
        vec2u(gridSize() - 1u)
      );
      let sampleIndex = gridIndex(sampleCell.x, sampleCell.y);
      let sampleElement = elements.values[sampleIndex];
      let plantFuel = treeFuelMask.values[sampleIndex];
      let renderedPlant = plantFuel > -1.5;
      let smolderSmoke = smoothstep(-0.76, -0.04, plantFuel)
        * (1.0 - step(0.0, plantFuel))
        * sampleElement.w
        * 0.55;
      let plantSmoke = max(
        sampleElement.z * select(0.0, 1.0, renderedPlant),
        smolderSmoke
      );
      let oilSmoke = sampleElement.z
        * smoothstep(0.002, 0.025, sampleElement.y);
      // Huts and campfires renew a persistent non-oil flame on their centre
      // cell. Bare sand cannot retain fire in elementUpdate.
      let structureSmoke = sampleElement.z
        * select(1.0, 0.0, renderedPlant)
        * (1.0 - smoothstep(0.001, 0.016, sampleElement.y));
      let lavaSmoke = smoothstep(0.018, 0.3, sampleElement.x)
        * mix(
          0.22,
          0.48,
          hash21(vec2f(sampleCell) + vec2f(71.0, -29.0))
        );
      let blastSmoke = smoothstep(0.66, 0.96, sampleElement.w)
        * (1.0 - smoothstep(0.01, 0.08, sampleElement.z))
        * (1.0 - smoothstep(0.01, 0.08, sampleElement.x));
      let steamSmoke = smoothstep(0.34, 0.82, sampleElement.w)
        * smoothstep(0.012, 0.22, state.values[sampleIndex].z)
        * (1.0 - smoothstep(0.16, 0.72, sampleElement.z))
        * 0.5;
      let sampleStrength = max(
        max(plantSmoke, structureSmoke * 0.92),
        max(max(oilSmoke * 0.9, lavaSmoke), max(blastSmoke, steamSmoke))
      );
      if (sampleStrength > bestStrength) {
        bestStrength = sampleStrength;
        bestCell = sampleCell;
        bestSoot = clamp(
          max(
            max(plantSmoke, max(structureSmoke, oilSmoke)) * 1.12,
            max(blastSmoke, lavaSmoke * 0.28)
          ),
          0.0,
          1.0
        );
        bestLava = lavaSmoke;
        bestPlant = select(0.0, 1.0, renderedPlant);
        bestBlast = blastSmoke;
      }
    }
  }

  if (bestStrength < 0.012) {
    var emptyOutput: SmokeOutput;
    emptyOutput.position = vec4f(-2.0, -2.0, 0.0, 1.0);
    emptyOutput.uv = vec2f(0.5);
    emptyOutput.response = vec4f(0.0);
    emptyOutput.worldPosition = vec3f(0.0);
    return emptyOutput;
  }

  let bestIndex = gridIndex(bestCell.x, bestCell.y);
  let terrainValue = state.values[bestIndex];
  let elementValue = elements.values[bestIndex];
  let uv = vec2f(bestCell) / f32(gridSize() - 1u);
  let sourceXZ = (uv - vec2f(0.5)) * frame.world.x;
  let seed = hash21(
    vec2f(f32(sourceIndex), f32(layer)) + vec2f(19.7, 73.2)
  );
  let age = fract(
    frame.cameraUpTime.w * mix(0.075, 0.11, seed)
      + f32(layer) / f32(layers)
      + seed
  );
  let easeAge = age * age * (3.0 - 2.0 * age);
  let sourceHeight = terrainValue.x
    + terrainValue.y
    + terrainValue.z
    + elementValue.x
    + elementValue.y;
  let sourceLift = bestPlant * 2.35 + bestBlast * 0.4;
  let plumeScale = mix(0.58, 1.0, bestSoot)
    * mix(0.68, 1.0, smoothstep(0.08, 0.65, bestStrength));
  let rise = mix(0.38, 8.2, easeAge) * plumeScale
    * mix(0.78, 1.0, 1.0 - bestLava);
  let drift = vec2f(0.78, -0.36) * easeAge * (0.65 + plumeScale)
    + vec2f(
      sin(seed * 18.0 + age * 5.1),
      cos(seed * 13.0 + age * 4.3)
    ) * easeAge * 0.24;
  let center = vec3f(
    sourceXZ.x + drift.x,
    sourceHeight + sourceLift + rise,
    sourceXZ.y + drift.y
  );
  let size = mix(0.62, 3.0, easeAge)
    * mix(0.55, 1.0, smoothstep(0.04, 0.72, bestStrength))
    * mix(1.0, 2.2, bestBlast);
  let billboardPosition = center
    + frame.cameraRight.xyz * input.position.x * size
    + frame.cameraUpTime.xyz * input.position.y * size;
  var output: SmokeOutput;
  output.position = frame.viewProjection * vec4f(billboardPosition, 1.0);
  output.uv = input.position.xy + vec2f(0.5);
  output.response = vec4f(
    bestStrength,
    bestSoot,
    age,
    seed
  );
  output.worldPosition = billboardPosition;
  return output;
}

@fragment
fn fragmentMain(input: SmokeOutput) -> @location(0) vec4f {
  let strength = input.response.x;
  if (strength < 0.012) {
    discard;
  }
  let centered = (input.uv - vec2f(0.5)) * 2.0;
  let edgeWarp = (
    noise2(
    centered * 1.8
      + vec2f(input.response.w * 17.0, input.response.z * 2.4)
    ) * 2.0 - 1.0
  ) * 0.13;
  let radial = length(centered * vec2f(0.88, 1.05)) + edgeWarp;
  let softBody = 1.0 - smoothstep(0.28, 1.0, radial);
  let ageFade = smoothstep(0.0, 0.13, input.response.z)
    * (1.0 - smoothstep(0.8, 1.0, input.response.z));
  let soot = input.response.y;
  let color = mix(
    vec3f(0.49, 0.51, 0.48),
    vec3f(0.105, 0.095, 0.082),
    soot * 0.88
  );
  let distanceToCamera = distance(frame.cameraPosition.xyz, input.worldPosition);
  let fogAmount = smoothstep(frame.fog.x, frame.fog.y, distanceToCamera);
  let smokeColor = mix(color, skyColor(input.worldPosition), fogAmount * 0.62);
  let alpha = strength
    * softBody
    * softBody
    * ageFade
    * mix(0.22, 0.46, soot);
  if (alpha < 0.004) {
    discard;
  }
  return vec4f(smokeColor, clamp(alpha, 0.0, 0.38));
}
`,yt=String.raw`
@fragment
fn fragmentMain(input: ShadowOutput) -> @location(0) vec4f {
  let along = clamp(input.uv.y, 0.0, 1.0);
  let taper = mix(1.0, 0.34, smoothstep(0.18, 1.0, along));
  let across = abs(input.uv.x * 2.0 - 1.0) / taper;
  let ellipticalDistance = sqrt(
    across * across
      + pow((along - 0.43) / 0.66, 2.0)
  );
  let feather = 1.0 - smoothstep(0.48, 1.0, ellipticalDistance);
  let softRoot = smoothstep(-0.02, 0.12, along);
  let alpha = input.opacity
    * feather
    * feather
    * softRoot;
  if (alpha < 0.004) {
    discard;
  }
  return vec4f(vec3f(0.032, 0.045, 0.06), alpha);
}
`,bt=String.raw`
@fragment
fn fragmentMain(input: ContactShadowOutput) -> @location(0) vec4f {
  let centered = (input.uv - vec2f(0.5)) * 2.0;
  let warped = centered + vec2f(
    noise2(centered * 1.23 + vec2f(input.seed * 0.13, -7.2)) - 0.5,
    noise2(centered.yx * 1.07 + vec2f(11.4, input.seed * 0.09)) - 0.5
  ) * 0.075;
  let distanceFromBase = length(warped * vec2f(0.91, 1.04));
  let feather = 1.0 - smoothstep(0.16, 1.0, distanceFromBase);
  let contactCore = 1.0 - smoothstep(0.04, 0.48, distanceFromBase);
  let mottling = mix(
    0.8,
    1.0,
    noise2(centered * 1.7 + vec2f(input.seed * 0.17, -input.seed * 0.11))
  );
  let alpha = input.opacity
    * (pow(feather, 1.18) * 0.8 + contactCore * 0.2)
    * mottling;
  if (alpha < 0.003) {
    discard;
  }
  // Contact masks are terrain stains, not emissive decals. Their earthy
  // source albedo follows the global day/night envelope so it remains visible
  // by day without turning into a warm glow over moonlit terrain.
  let moonFill = (1.0 - frame.pad.w) * frame.sun.w * 0.024;
  let globalGroundingLight = clamp(
    mix(0.052, 0.72, frame.pad.w) + moonFill,
    0.052,
    0.72
  );
  return vec4f(input.color * globalGroundingLight, alpha);
}
`,xt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> vegetation: ScalarBuffer;
@group(0) @binding(3) var<storage, read> elements: ElementBuffer;

struct ContactShadowInput {
  @location(0) position: vec3f,
  @location(3) instance: vec4f,
}

struct ContactShadowOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) opacity: f32,
  @location(2) seed: f32,
  @location(3) color: vec3f,
}

@vertex
fn vertexMain(input: ContactShadowInput) -> ContactShadowOutput {
  let baseCell = cellFromWorld(input.instance.xy);
  let baseIndex = gridIndex(baseCell.x, baseCell.y);
  let terrainValue = state.values[baseIndex];
  let elementValue = elements.values[baseIndex];
  let growth = smoothstep(0.035, 0.72, vegetation.values[baseIndex]);
  let burning = max(
    smoothstep(0.06, 0.72, elementValue.z),
    smoothstep(0.46, 0.94, elementValue.w) * 0.58
  );
  let submerged = smoothstep(0.06, 0.24, terrainValue.z);
  let belowSea = 1.0 - smoothstep(
    frame.world.z - 0.38,
    frame.world.z + 0.16,
    terrainValue.x + terrainValue.y
  );
  let visibleGrowth = max(growth, burning * 0.64)
    * (1.0 - max(submerged, belowSea));
  let forward = vec2f(cos(input.instance.z), sin(input.instance.z));
  let across = vec2f(-forward.y, forward.x);
  let radius = input.instance.w * mix(0.48, 0.88, visibleGrowth);
  let local = vec2f(input.position.x * 2.78, input.position.y * 2.28) * radius;
  let shadowXZ = input.instance.xy + forward * local.x + across * local.y;
  let baseP = vec2i(baseCell);
  let cellSize = frame.world.x / f32(gridSize() - 1u);
  let baseHeight = terrainValue.x + terrainValue.y;
  let slope = vec2f(
    cellHeight(&state, baseP + vec2i(1, 0), false)
      - cellHeight(&state, baseP + vec2i(-1, 0), false),
    cellHeight(&state, baseP + vec2i(0, 1), false)
      - cellHeight(&state, baseP + vec2i(0, -1), false)
  ) / (cellSize * 2.0);
  let tangentHeight = baseHeight + dot(slope, shadowXZ - input.instance.xy);
  let worldPosition = vec3f(shadowXZ.x, tangentHeight + 0.12, shadowXZ.y);
  var output: ContactShadowOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.uv = input.position.xy + vec2f(0.5);
  output.opacity = mix(0.2, 0.27, frame.pad.w)
    * smoothstep(0.045, 0.22, visibleGrowth);
  output.seed = input.instance.z * 4.3 + input.instance.x * 0.13;
  output.color = vec3f(0.19, 0.135, 0.065);
  return output;
}
`+bt,St=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> vegetation: ScalarBuffer;
@group(0) @binding(3) var<storage, read> elements: ElementBuffer;

struct ContactShadowInput {
  @location(0) position: vec3f,
  @location(3) instance: vec4f,
}

struct ContactShadowOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) opacity: f32,
  @location(2) seed: f32,
  @location(3) color: vec3f,
}

@vertex
fn vertexMain(input: ContactShadowInput) -> ContactShadowOutput {
  let baseCell = cellFromWorld(input.instance.xy);
  let baseIndex = gridIndex(baseCell.x, baseCell.y);
  let terrainValue = state.values[baseIndex];
  let elementValue = elements.values[baseIndex];
  let growth = smoothstep(0.035, 0.72, vegetation.values[baseIndex]);
  let burning = max(
    smoothstep(0.06, 0.72, elementValue.z),
    smoothstep(0.46, 0.94, elementValue.w) * 0.58
  );
  let submerged = smoothstep(0.06, 0.24, terrainValue.z);
  let belowSea = 1.0 - smoothstep(
    frame.world.z - 0.38,
    frame.world.z + 0.16,
    terrainValue.x + terrainValue.y
  );
  let visibleGrowth = max(growth, burning * 0.64)
    * (1.0 - max(submerged, belowSea));
  let forward = vec2f(cos(input.instance.z), sin(input.instance.z));
  let across = vec2f(-forward.y, forward.x);
  let radius = input.instance.w * mix(0.5, 0.95, visibleGrowth);
  let local = vec2f(input.position.x * 3.8, input.position.y * 3.2) * radius;
  let shadowXZ = input.instance.xy + forward * local.x + across * local.y;
  let baseP = vec2i(baseCell);
  let cellSize = frame.world.x / f32(gridSize() - 1u);
  let baseHeight = terrainValue.x + terrainValue.y;
  let slope = vec2f(
    cellHeight(&state, baseP + vec2i(1, 0), false)
      - cellHeight(&state, baseP + vec2i(-1, 0), false),
    cellHeight(&state, baseP + vec2i(0, 1), false)
      - cellHeight(&state, baseP + vec2i(0, -1), false)
  ) / (cellSize * 2.0);
  let tangentHeight = baseHeight + dot(slope, shadowXZ - input.instance.xy);
  let worldPosition = vec3f(shadowXZ.x, tangentHeight + 0.12, shadowXZ.y);
  var output: ContactShadowOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.uv = input.position.xy + vec2f(0.5);
  output.opacity = mix(0.2, 0.28, frame.pad.w)
    * smoothstep(0.045, 0.22, visibleGrowth);
  output.seed = input.instance.z * 4.7 + input.instance.y * 0.11;
  output.color = vec3f(0.17, 0.2, 0.065);
  return output;
}
`+bt,Ct=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct HutDynamics {
  baseline: vec4f,
  collapse: vec4f,
}

struct HutDynamicsBuffer {
  values: array<HutDynamics>,
}

@group(0) @binding(2) var<storage, read> hutDynamics: HutDynamicsBuffer;

struct ContactShadowInput {
  @location(0) position: vec3f,
  @location(3) instance: vec4f,
}

struct ContactShadowOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) opacity: f32,
  @location(2) seed: f32,
  @location(3) color: vec3f,
}

@vertex
fn vertexMain(
  input: ContactShadowInput,
  @builtin(instance_index) instanceIndex: u32
) -> ContactShadowOutput {
  let dynamics = hutDynamics.values[instanceIndex];
  let visible = 1.0 - step(0.5, dynamics.collapse.x);
  let forward = vec2f(cos(input.instance.z), sin(input.instance.z));
  let across = vec2f(-forward.y, forward.x);
  let local = vec2f(
    input.position.x * 7.4,
    input.position.y * 6.6
  ) * input.instance.w;
  let shadowXZ = input.instance.xy + forward * local.x + across * local.y;
  let baseCell = cellFromWorld(input.instance.xy);
  let baseP = vec2i(baseCell);
  let baseValue = state.values[gridIndex(baseCell.x, baseCell.y)];
  let cellSize = frame.world.x / f32(gridSize() - 1u);
  let slope = vec2f(
    cellHeight(&state, baseP + vec2i(1, 0), false)
      - cellHeight(&state, baseP + vec2i(-1, 0), false),
    cellHeight(&state, baseP + vec2i(0, 1), false)
      - cellHeight(&state, baseP + vec2i(0, -1), false)
  ) / (cellSize * 2.0);
  let tangentHeight = baseValue.x
    + baseValue.y
    + dot(slope, shadowXZ - input.instance.xy);
  let worldPosition = vec3f(shadowXZ.x, tangentHeight + 0.14, shadowXZ.y);
  var output: ContactShadowOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.uv = input.position.xy + vec2f(0.5);
  output.opacity = mix(0.25, 0.34, frame.pad.w) * visible;
  output.seed = input.instance.z * 5.1 + f32(instanceIndex) * 0.83;
  output.color = vec3f(0.255, 0.125, 0.043);
  return output;
}
`+bt,wt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> vegetation: ScalarBuffer;
@group(0) @binding(3) var<storage, read> elements: ElementBuffer;

struct ShadowInput {
  @location(0) position: vec3f,
  @location(3) instance: vec4f,
}

struct ShadowOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) opacity: f32,
}

@vertex
fn vertexMain(input: ShadowInput) -> ShadowOutput {
  let baseCell = cellFromWorld(input.instance.xy);
  let baseIndex = gridIndex(baseCell.x, baseCell.y);
  let terrainValue = state.values[baseIndex];
  let elementValue = elements.values[baseIndex];
  let growth = smoothstep(0.035, 0.72, vegetation.values[baseIndex]);
  let burning = max(
    smoothstep(0.06, 0.72, elementValue.z),
    smoothstep(0.46, 0.94, elementValue.w) * 0.58
  );
  let submerged = smoothstep(0.06, 0.24, terrainValue.z);
  let belowSea = 1.0 - smoothstep(
    frame.world.z - 0.38,
    frame.world.z + 0.16,
    terrainValue.x + terrainValue.y
  );
  let visibleGrowth = max(growth, burning * 0.64)
    * (1.0 - max(submerged, belowSea));
  let castDirection = -normalize(
    select(vec2f(0.72, 0.69), frame.sun.xz, length(frame.sun.xz) > 0.025)
  );
  let acrossDirection = vec2f(-castDirection.y, castDirection.x);
  let objectScale = input.instance.w * visibleGrowth;
  let objectHeight = 5.5 * objectScale;
  let castLength = min(
    14.0,
    objectHeight * length(frame.sun.xz) / max(frame.sun.y, 0.16)
  );
  let along = input.position.y + 0.5;
  let width = mix(0.85, 3.5, smoothstep(0.0, 1.0, along))
    * objectScale;
  let shadowXZ = input.instance.xy
    + castDirection * castLength * along
    + acrossDirection * input.position.x * width;
  let cell = cellFromWorld(shadowXZ);
  let value = state.values[gridIndex(cell.x, cell.y)];
  let worldPosition = vec3f(shadowXZ.x, value.x + value.y + 0.075, shadowXZ.y);
  var output: ShadowOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.uv = input.position.xy + vec2f(0.5);
  output.opacity = frame.sun.w
    * mix(0.085, 0.14, frame.pad.w)
    * smoothstep(0.045, 0.22, visibleGrowth);
  return output;
}
`+yt,Tt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct HutDynamics {
  baseline: vec4f,
  collapse: vec4f,
}

struct HutDynamicsBuffer {
  values: array<HutDynamics>,
}

@group(0) @binding(2) var<storage, read> hutDynamics: HutDynamicsBuffer;

struct ShadowInput {
  @location(0) position: vec3f,
  @location(3) instance: vec4f,
}

struct ShadowOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) opacity: f32,
}

@vertex
fn vertexMain(
  input: ShadowInput,
  @builtin(instance_index) instanceIndex: u32
) -> ShadowOutput {
  let dynamics = hutDynamics.values[instanceIndex];
  let visible = 1.0 - step(0.5, dynamics.collapse.x);
  let castDirection = -normalize(
    select(vec2f(0.72, 0.69), frame.sun.xz, length(frame.sun.xz) > 0.025)
  );
  let acrossDirection = vec2f(-castDirection.y, castDirection.x);
  let objectHeight = 4.25 * input.instance.w;
  let castLength = min(
    12.5,
    objectHeight * length(frame.sun.xz) / max(frame.sun.y, 0.16)
  );
  let along = input.position.y + 0.5;
  let width = mix(3.15, 2.28, along) * input.instance.w;
  let shadowXZ = input.instance.xy
    + castDirection * castLength * along
    + acrossDirection * input.position.x * width;
  let cell = cellFromWorld(shadowXZ);
  let value = state.values[gridIndex(cell.x, cell.y)];
  let worldPosition = vec3f(shadowXZ.x, value.x + value.y + 0.08, shadowXZ.y);
  var output: ShadowOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.uv = input.position.xy + vec2f(0.5);
  output.opacity = frame.sun.w
    * mix(0.09, 0.15, frame.pad.w)
    * visible;
  return output;
}
`+yt,Et=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct NpcState {
  pose: vec4f,
  motion: vec4f,
}

struct NpcBuffer {
  values: array<NpcState>,
}

@group(0) @binding(2) var<storage, read> npcs: NpcBuffer;

struct ShadowInput {
  @location(0) position: vec3f,
}

struct ShadowOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) opacity: f32,
}

@vertex
fn vertexMain(
  input: ShadowInput,
  @builtin(instance_index) instanceIndex: u32
) -> ShadowOutput {
  let npc = npcs.values[instanceIndex];
  let visible = step(0.005, npc.pose.w);
  let castDirection = -normalize(
    select(vec2f(0.72, 0.69), frame.sun.xz, length(frame.sun.xz) > 0.025)
  );
  let acrossDirection = vec2f(-castDirection.y, castDirection.x);
  let castLength = min(
    4.4,
    1.72 * length(frame.sun.xz) / max(frame.sun.y, 0.16)
  );
  let along = input.position.y + 0.5;
  let width = mix(0.7, 0.42, along);
  let shadowXZ = npc.pose.xy
    + castDirection * castLength * along
    + acrossDirection * input.position.x * width;
  let cell = cellFromWorld(shadowXZ);
  let value = state.values[gridIndex(cell.x, cell.y)];
  let worldPosition = vec3f(shadowXZ.x, value.x + value.y + 0.07, shadowXZ.y);
  var output: ShadowOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.uv = input.position.xy + vec2f(0.5);
  output.opacity = frame.sun.w
    * mix(0.07, 0.115, frame.pad.w)
    * visible;
  return output;
}
`+yt,Dt=String.raw`
@fragment
fn fragmentMain(
  input: PropOutput,
  @builtin(front_facing) frontFacing: bool
) -> @location(0) vec4f {
  let faceNormal = select(-input.normal, input.normal, frontFacing);
  let color = lightColor(
    input.worldPosition,
    normalize(faceNormal),
    input.color.rgb,
    input.color.a * 0.08
  );
  return vec4f(color, 1.0);
}
`,Ot=String.raw`
@fragment
fn fragmentMain(
  input: PropOutput,
  @builtin(front_facing) frontFacing: bool
) -> @location(0) vec4f {
  let faceNormal = select(-input.normal, input.normal, frontFacing);
  var color = lightColor(
    input.worldPosition,
    normalize(faceNormal),
    input.color.rgb,
    input.color.a * 0.08
  );
  let night = pow(clamp(1.0 - frame.pad.w, 0.0, 1.0), 1.15);
  let distanceToCamera = distance(frame.cameraPosition.xyz, input.worldPosition);
  let fogVisibility = 1.0 - smoothstep(frame.fog.x, frame.fog.y, distanceToCamera);
  let doorwayWarmth = smoothstep(0.28, 0.95, input.doorwayEmission);
  let doorwayColor = mix(
    vec3f(0.57, 0.255, 0.095),
    vec3f(0.94, 0.61, 0.3),
    doorwayWarmth
  );
  color = color
    + doorwayColor
      * input.doorwayEmission
      * night
      * fogVisibility
      * 0.76;
  return vec4f(color, 1.0);
}
`,kt=L+Ne+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> wallBlocks: WallBlockBuffer;

struct WallRenderUniform {
  // 0 intact curtain, 1 intact tower, 2 curtain debris, 3 tower debris.
  mode: u32,
  pad0: u32,
  pad1: u32,
  pad2: u32,
}
@group(0) @binding(3) var<uniform> render: WallRenderUniform;

struct PropInput {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
}

struct PropOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
}

fn hiddenWallVertex() -> PropOutput {
  var hidden: PropOutput;
  hidden.position = vec4f(2.0, 2.0, 2.0, 1.0);
  hidden.worldPosition = vec3f(0.0);
  hidden.normal = vec3f(0.0, 1.0, 0.0);
  hidden.color = vec4f(0.0);
  return hidden;
}

fn wallRotateY(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x * c - value.z * s, value.y, value.x * s + value.z * c);
}

fn wallRotateX(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x, value.y * c - value.z * s, value.y * s + value.z * c);
}

fn wallRotateZ(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x * c - value.y * s, value.x * s + value.y * c, value.z);
}

@vertex
fn vertexMain(
  input: PropInput,
  @builtin(instance_index) instanceIndex: u32
) -> PropOutput {
  if (instanceIndex >= MAX_WALL_BLOCKS) {
    return hiddenWallVertex();
  }
  let block = wallBlocks.values[instanceIndex];
  let encodedYaw = block.gridFoundation.w;
  let isActive = encodedYaw >= 1.0;
  let collapsed = encodedYaw <= -1.0 && block.condition.x <= 0.08;
  let intact = block.condition.x > 0.08;
  let tower = block.condition.w >= 4.0;
  let collapseAge = frame.cameraUpTime.w - block.condition.z;
  let debrisVisible = collapsed && collapseAge >= 0.0 && collapseAge < 2.85;
  let visible = (
    isActive && (
      (render.mode == 0u && intact && !tower)
        || (render.mode == 1u && intact && tower)
    )
  ) || (
    debrisVisible && (
      (render.mode == 2u && !tower)
        || (render.mode == 3u && tower)
    )
  );
  if (!visible) {
    return hiddenWallVertex();
  }

  let n = max(2u, gridSize());
  let uv = block.gridFoundation.xy / f32(n - 1u);
  let worldXZ = (uv - vec2f(0.5)) * frame.world.x;
  let yaw = abs(encodedYaw) - 10.0;
  let damage = clamp(1.0 - block.condition.x, 0.0, 1.0);
  let seed = hash21(block.gridFoundation.xy + vec2f(31.7, -12.4));
  var local = input.position;
  var localNormal = input.normal;
  let debrisMode = render.mode >= 2u;

  if (render.mode == 0u || render.mode == 2u) {
    local.y = local.y * (block.condition.w / 2.75);
  } else {
    local.y = local.y * (block.condition.w / 4.35);
  }

  if (intact && damage > 0.02) {
    let lean = damage * mix(-0.13, 0.13, seed);
    local = wallRotateZ(local, lean);
    localNormal = wallRotateZ(localNormal, lean);
  }
  var worldPosition: vec3f;
  if (debrisMode) {
    // The masonry meshes already contain separate coursed stones. Quantizing
    // nearby vertices into bounded fragment groups lets those stones tumble as
    // visible pieces without allocating another GPU lifecycle buffer.
    let pieceSpan = select(
      vec3f(0.72, 0.62, 0.54),
      vec3f(0.86, 0.74, 0.86),
      tower
    );
    let pieceCoordinate = floor(local / pieceSpan);
    let pieceOrigin = (pieceCoordinate + vec3f(0.5)) * pieceSpan;
    let pieceKey = dot(pieceCoordinate, vec3f(5.7, 13.1, 23.9));
    let pieceSeed = hash21(
      block.gridFoundation.xy + vec2f(pieceKey, pieceKey * 0.37 + 17.2)
    );
    let pieceSeedB = hash21(vec2f(pieceSeed * 83.1, pieceKey + 41.7));
    let releaseDelay = mix(0.0, 0.28, pieceSeedB);
    let fallTime = max(0.0, collapseAge - releaseDelay);
    let flightTime = min(fallTime, 1.05);
    let lateralDirection = normalize(
      vec2f(pieceSeed - 0.5, pieceSeedB - 0.5) + vec2f(0.001, -0.001)
    );
    let outwardTravel = mix(0.15, 0.62, pieceSeed) * flightTime;
    let liftAndFall = mix(0.08, 0.38, pieceSeedB) * flightTime
      - 2.15 * flightTime * flightTime;
    let tumble = smoothstep(0.0, 0.92, fallTime)
      * mix(0.74, 2.35, pieceSeedB);
    let fragmentScale = 1.0 - smoothstep(2.42, 2.85, collapseAge);
    var fragment = (local - pieceOrigin) * fragmentScale;
    fragment = wallRotateX(
      fragment,
      tumble * mix(-0.82, 0.92, pieceSeed)
    );
    fragment = wallRotateZ(
      fragment,
      tumble * mix(0.68, -0.76, pieceSeedB)
    );
    fragment = wallRotateY(fragment, tumble * 0.31);
    localNormal = wallRotateX(
      localNormal,
      tumble * mix(-0.82, 0.92, pieceSeed)
    );
    localNormal = wallRotateZ(
      localNormal,
      tumble * mix(0.68, -0.76, pieceSeedB)
    );
    localNormal = wallRotateY(localNormal, tumble * 0.31 + yaw);

    var movingOrigin = pieceOrigin + vec3f(
      lateralDirection.x * outwardTravel,
      liftAndFall,
      lateralDirection.y * outwardTravel
    );
    let rotatedOrigin = wallRotateY(movingOrigin, yaw);
    let rotatedFragment = wallRotateY(fragment, yaw);
    let fragmentWorldXZ = worldXZ + rotatedOrigin.xz;
    let terrainCell = cellFromWorld(fragmentWorldXZ);
    let terrainValue = state.values[gridIndex(terrainCell.x, terrainCell.y)];
    let terrainHeight = terrainValue.x + terrainValue.y;
    let sink = smoothstep(1.05, 2.85, collapseAge)
      * mix(0.48, 0.92, pieceSeedB);
    let fragmentOriginY = max(
      terrainHeight + 0.08 - sink,
      block.gridFoundation.z + movingOrigin.y
    );
    worldPosition = vec3f(
      fragmentWorldXZ.x + rotatedFragment.x,
      fragmentOriginY + rotatedFragment.y,
      fragmentWorldXZ.y + rotatedFragment.z
    );
  } else {
    local = wallRotateY(local, yaw);
    localNormal = wallRotateY(localNormal, yaw);
    worldPosition = vec3f(
      worldXZ.x + local.x,
      block.gridFoundation.z + local.y + 0.025,
      worldXZ.y + local.z
    );
  }
  let wetDarkening = block.condition.y * 0.28;
  let damageDarkening = damage * 0.22;
  let stoneVariation = mix(0.91, 1.08, seed);
  let burial = select(0.0, smoothstep(0.72, 2.55, collapseAge), debrisMode);
  let looseSandColor = mix(
    vec3f(0.46, 0.315, 0.17),
    vec3f(0.62, 0.445, 0.25),
    seed
  );
  let masonryColor = input.color.rgb
    * stoneVariation
    * (1.0 - wetDarkening - damageDarkening);

  var output: PropOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  output.normal = localNormal;
  output.color = vec4f(
    mix(masonryColor, looseSandColor, burial * 0.72),
    input.color.a
  );
  return output;
}
`+Dt,At=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct CampfireDynamics {
  baseline: vec4f,
  status: vec4f,
}

struct CampfireDynamicsBuffer {
  values: array<CampfireDynamics>,
}

@group(0) @binding(2) var<storage, read> dynamicsBuffer: CampfireDynamicsBuffer;

struct PropInput {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
  @location(3) instance: vec4f,
}

struct PropOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
}

fn campfireRotateY(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x * c - value.z * s, value.y, value.x * s + value.z * c);
}

@vertex
fn vertexMain(
  input: PropInput,
  @builtin(instance_index) instanceIndex: u32
) -> PropOutput {
  let dynamics = dynamicsBuffer.values[instanceIndex];
  let collapsed = step(0.5, dynamics.status.x);
  let collapseAge = max(0.0, frame.cameraUpTime.w - dynamics.status.y);
  let collapseProgress = collapsed * smoothstep(0.0, 3.8, collapseAge);
  let seed = hash21(vec2f(f32(instanceIndex), 42.7));
  var local = input.position * input.instance.w;
  let fallDirection = normalize(vec2f(
    cos(seed * 6.28318530718),
    sin(seed * 6.28318530718)
  ));
  local.x = local.x + fallDirection.x * collapseProgress * 0.42;
  local.z = local.z + fallDirection.y * collapseProgress * 0.42;
  local.y = local.y
    + sin(collapseProgress * 3.14159265) * 0.18
    - collapseProgress * collapseProgress * 1.35;
  let rotated = campfireRotateY(local, input.instance.z);
  let cell = cellFromWorld(input.instance.xy);
  let terrainValue = state.values[gridIndex(cell.x, cell.y)];
  let worldPosition = vec3f(
    input.instance.x + rotated.x,
    terrainValue.x + terrainValue.y + rotated.y + 0.045,
    input.instance.y + rotated.z
  );
  var output: PropOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  output.normal = campfireRotateY(input.normal, input.instance.z);
  let lit = dynamics.status.z * (1.0 - collapsed);
  let innerMaterial = 1.0 - smoothstep(0.38, 0.78, length(input.position.xz));
  let emberPulse = 0.55 + sin(
    frame.cameraUpTime.w * 7.6 + input.position.x * 4.1
  ) * 0.45;
  let emberMask = lit
    * innerMaterial
    * smoothstep(0.035, 0.32, input.position.y)
    * emberPulse;
  let emberColor = mix(
    vec3f(0.78, 0.08, 0.015),
    vec3f(1.0, 0.56, 0.055),
    emberPulse
  );
  output.color = vec4f(
    mix(input.color.rgb, emberColor, emberMask * 0.72),
    max(input.color.a, emberMask * 5.5)
  );
  return output;
}
`+Dt,jt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct CampfireInstanceBuffer {
  values: array<vec4f>,
}

struct CampfireDynamics {
  baseline: vec4f,
  status: vec4f,
}

struct CampfireDynamicsBuffer {
  values: array<CampfireDynamics>,
}

@group(0) @binding(2) var<storage, read> campfires: CampfireInstanceBuffer;
@group(0) @binding(3) var<storage, read> dynamicsBuffer: CampfireDynamicsBuffer;

struct FlameInput {
  @location(0) position: vec3f,
}

struct FlameOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) response: vec3f,
}

@vertex
fn vertexMain(
  input: FlameInput,
  @builtin(instance_index) instanceIndex: u32
) -> FlameOutput {
  let layerCount = 3u;
  let campfireIndex = instanceIndex / layerCount;
  let layer = instanceIndex % layerCount;
  let campfire = campfires.values[campfireIndex];
  let dynamics = dynamicsBuffer.values[campfireIndex];
  let visible = dynamics.status.z
    * (1.0 - step(0.5, dynamics.status.x));
  let cell = cellFromWorld(campfire.xy);
  let terrainValue = state.values[gridIndex(cell.x, cell.y)];
  let seed = hash21(vec2f(f32(campfireIndex), f32(layer)) + vec2f(4.3, 28.0));
  let flicker = sin(
    frame.cameraUpTime.w * mix(6.8, 9.1, seed)
      + f32(layer) * 2.1
  ) * 0.5 + 0.5;
  let layerPosition = campfire.xy
    + vec2f(cos(seed * 6.28318530718), sin(seed * 6.28318530718))
      * (0.08 + f32(layer) * 0.07);
  let center = vec3f(
    layerPosition.x,
    terrainValue.x + terrainValue.y + 0.52 + f32(layer) * 0.2,
    layerPosition.y
  );
  let size = mix(0.66, 1.0, flicker) * campfire.w
    * mix(1.0, 0.72, f32(layer) / 2.0);
  let billboardPosition = center
    + frame.cameraRight.xyz * input.position.x * size
    + frame.cameraUpTime.xyz * input.position.y * size * 1.45;
  var output: FlameOutput;
  output.position = frame.viewProjection * vec4f(billboardPosition, 1.0);
  output.uv = input.position.xy + vec2f(0.5);
  output.response = vec3f(visible, flicker, seed);
  return output;
}

@fragment
fn fragmentMain(input: FlameOutput) -> @location(0) vec4f {
  if (input.response.x < 0.5) {
    discard;
  }
  let centered = (input.uv - vec2f(0.5)) * 2.0;
  let taper = mix(1.0, 0.28, smoothstep(-0.75, 0.9, centered.y));
  let shape = 1.0 - smoothstep(
    0.35,
    1.0,
    length(vec2f(centered.x / taper, centered.y * 0.86))
  );
  let turbulence = gradientNoiseSigned(
    centered * 2.2
      + vec2f(input.response.z * 11.0, frame.cameraUpTime.w * 0.72)
  );
  let body = shape * smoothstep(-0.52, 0.28, turbulence + shape);
  let hotCenter = 1.0 - smoothstep(0.0, 0.72, length(centered));
  let color = mix(
    vec3f(0.98, 0.11, 0.012),
    vec3f(1.0, 0.82, 0.18),
    hotCenter
  ) * mix(0.82, 1.18, input.response.y);
  let alpha = body * mix(0.28, 0.72, hotCenter);
  if (alpha < 0.01) {
    discard;
  }
  return vec4f(color, alpha);
}
`,Mt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> vegetation: ScalarBuffer;
@group(0) @binding(3) var<storage, read> elements: ElementBuffer;
@group(0) @binding(4) var<storage, read> treeFuelMask: ScalarBuffer;

struct PropInput {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
  @location(3) instance: vec4f,
}

struct PropOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
}

fn rotateY(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x * c - value.z * s, value.y, value.x * s + value.z * c);
}

fn rotateX(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x, value.y * c - value.z * s, value.y * s + value.z * c);
}

fn rotateZ(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x * c - value.y * s, value.x * s + value.y * c, value.z);
}

@vertex
fn vertexMain(input: PropInput) -> PropOutput {
  let cell = cellFromWorld(input.instance.xy);
  let cellIndex = gridIndex(cell.x, cell.y);
  let value = state.values[cellIndex];
  let elementValue = elements.values[cellIndex];
  let plantFuel = treeFuelMask.values[cellIndex];
  let growth = smoothstep(0.035, 0.72, vegetation.values[cellIndex]);
  let fire = smoothstep(0.06, 0.72, elementValue.z);
  let radiantBurn = smoothstep(0.46, 0.94, elementValue.w) * 0.58;
  let burning = max(fire, radiantBurn);
  let debrisAge = max(0.0, -plantFuel / 0.155);
  let livePresence = select(0.0, 1.0, plantFuel > 0.0);
  let debrisPresence = select(
    0.0,
    1.0 - smoothstep(4.25, 5.25, debrisAge),
    plantFuel > -1.5 && plantFuel <= 0.0
  );
  // A burning plant keeps its silhouette instead of shrinking. Once the fuel
  // is gone, geometry bands separate, topple, and sink over five seconds.
  // Shore trees are removed once their base is genuinely submerged so buried
  // crowns cannot poke through the sea as long comb-like edge artifacts.
  let submerged = smoothstep(0.06, 0.24, value.z);
  let baseHeight = value.x + value.y;
  let belowSea = 1.0 - smoothstep(
    frame.world.z - 0.38,
    frame.world.z + 0.16,
    baseHeight
  );
  let liveGrowth = max(growth, burning * 0.82) * livePresence;
  let visibleGrowth = max(liveGrowth, debrisPresence * 0.86)
    * (1.0 - max(submerged, belowSea));
  if (visibleGrowth < 0.045) {
    var hidden: PropOutput;
    hidden.position = vec4f(2.0, 2.0, 2.0, 1.0);
    hidden.worldPosition = vec3f(0.0);
    hidden.normal = vec3f(0.0, 1.0, 0.0);
    hidden.color = vec4f(0.0);
    return hidden;
  }
  let scale = input.instance.w * visibleGrowth;
  var local = input.position * scale;
  var localNormal = input.normal;
  let windWeight = smoothstep(1.8, 8.5, input.position.y);
  local.x = local.x + sin(frame.cameraUpTime.w * 1.17 + input.instance.z * 3.1) * windWeight * 0.24 * scale;
  local.z = local.z + cos(frame.cameraUpTime.w * 0.91 + input.instance.z * 2.4) * windWeight * 0.14 * scale;
  if (debrisAge > 0.0) {
    let heightBand = min(3.0, floor(max(0.0, input.position.y) * 0.38));
    let pieceSeed = hash21(
      vec2f(
        heightBand * 13.7,
        input.instance.z * 17.3 + input.instance.x * 0.11
      )
    );
    let pieceSeedB = hash21(vec2f(pieceSeed * 71.2, input.instance.y * 0.17));
    let release = smoothstep(
      heightBand * 0.16,
      0.72 + heightBand * 0.16,
      debrisAge
    );
    let pivotY = (heightBand * 2.2 + 0.42) * scale;
    var piece = local - vec3f(0.0, pivotY, 0.0);
    let tiltX = release * mix(-0.46, 0.5, pieceSeed);
    let tiltZ = release * mix(0.62, -0.68, pieceSeedB);
    piece = rotateX(piece, tiltX);
    piece = rotateZ(piece, tiltZ);
    localNormal = rotateX(localNormal, tiltX);
    localNormal = rotateZ(localNormal, tiltZ);
    local = piece + vec3f(0.0, pivotY, 0.0);
    // Pieces separate only by a few centimetres, then topple and sink. This
    // keeps the ember silhouette readable instead of exploding the wide palm
    // crown into screen-sized triangles.
    local.x = local.x + (pieceSeed - 0.5) * release * 0.34 * scale;
    local.z = local.z + (pieceSeedB - 0.5) * release * 0.34 * scale;
    local.y = local.y - smoothstep(0.62, 5.25, debrisAge)
      * (0.34 + heightBand * 0.3);
  }
  local = rotateY(local, input.instance.z);
  let worldPosition = vec3f(
    input.instance.x + local.x,
    value.x + value.y + local.y,
    input.instance.y + local.z
  );
  var output: PropOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  output.normal = rotateY(localNormal, input.instance.z);
  let fuelLoss = clamp(1.0 - max(0.0, plantFuel), 0.0, 1.0);
  let charProgress = clamp(
    smoothstep(0.08, 0.88, fuelLoss) * (0.34 + burning * 0.8),
    0.0,
    1.0
  );
  let charColor = mix(
    vec3f(0.16, 0.105, 0.052),
    vec3f(0.018, 0.016, 0.013),
    charProgress
  );
  let flameBand = sin(
    input.position.y * 4.9
      + input.position.x * 3.3
      - input.position.z * 2.7
      + frame.cameraUpTime.w * 8.4
      + input.instance.z * 5.1
  ) * 0.5 + 0.5;
  let flameMask = burning
    * smoothstep(0.28, 0.78, flameBand)
    * smoothstep(0.18, 1.15, input.position.y);
  let emberColor = mix(
    vec3f(0.96, 0.12, 0.018),
    vec3f(1.0, 0.72, 0.08),
    flameBand
  );
  let burnedColor = mix(input.color.rgb, charColor, charProgress);
  output.color = vec4f(
    mix(burnedColor, emberColor, flameMask * 0.88),
    max(input.color.a, flameMask * 7.5)
  );
  return output;
}
`+Dt,Nt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct HutDynamics {
  baseline: vec4f,
  collapse: vec4f,
}

struct HutDynamicsBuffer {
  values: array<HutDynamics>,
}

@group(0) @binding(2) var<storage, read> hutDynamics: HutDynamicsBuffer;

struct PropInput {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
  @location(3) instance: vec4f,
}

struct PropOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
  @location(3) doorwayEmission: f32,
}

fn rotateY(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x * c - value.z * s, value.y, value.x * s + value.z * c);
}

@vertex
fn vertexMain(
  input: PropInput,
  @builtin(instance_index) instanceIndex: u32
) -> PropOutput {
  let dynamics = hutDynamics.values[instanceIndex];
  if (dynamics.collapse.x >= 0.5) {
    var hidden: PropOutput;
    hidden.position = vec4f(2.0, 2.0, 2.0, 1.0);
    hidden.worldPosition = vec3f(0.0);
    hidden.normal = vec3f(0.0, 1.0, 0.0);
    hidden.color = vec4f(0.0);
    hidden.doorwayEmission = 0.0;
    return hidden;
  }
  let cell = cellFromWorld(input.instance.xy);
  let value = state.values[gridIndex(cell.x, cell.y)];
  let instanceSeed = hash21(
    input.instance.xy * vec2f(0.073, 0.091) + vec2f(input.instance.z, 8.7)
  );
  let roofWeight = smoothstep(1.88, 3.32, input.position.y);
  let roofDirection = vec2f(
    cos(instanceSeed * 6.28318530718),
    sin(instanceSeed * 6.28318530718)
  );
  var shapedLocal = input.position;
  shapedLocal = vec3f(
    shapedLocal.x
      + roofDirection.x * roofWeight * mix(0.02, 0.12, instanceSeed),
    shapedLocal.y,
    shapedLocal.z
      + roofDirection.y * roofWeight * mix(0.02, 0.12, instanceSeed)
  );
  let local = rotateY(shapedLocal * input.instance.w, input.instance.z);
  let worldPosition = vec3f(
    input.instance.x + local.x,
    value.x + value.y + local.y + 0.04,
    input.instance.y + local.z
  );
  var output: PropOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  output.normal = rotateY(input.normal, input.instance.z);
  let burnExposure = dynamics.collapse.w;
  let charProgress = smoothstep(0.16, 6.8, burnExposure);
  let burning = smoothstep(0.045, 0.52, burnExposure);
  let charColor = mix(
    vec3f(0.19, 0.075, 0.025),
    vec3f(0.025, 0.019, 0.014),
    charProgress
  );
  let flameBand = sin(
    input.position.y * 5.3
      + input.position.x * 3.7
      - input.position.z * 2.9
      + frame.cameraUpTime.w * 8.8
      + input.instance.z * 4.1
  ) * 0.5 + 0.5;
  let upperStructure = mix(
    0.42,
    1.0,
    smoothstep(0.28, 2.15, input.position.y)
  );
  let flameMask = burning
    * smoothstep(0.34, 0.79, flameBand)
    * upperStructure;
  let emberColor = mix(
    vec3f(0.98, 0.105, 0.012),
    vec3f(1.0, 0.71, 0.075),
    flameBand
  );
  let scorchedColor = mix(input.color.rgb, charColor, charProgress * 0.86);
  output.color = vec4f(
    mix(scorchedColor, emberColor, flameMask * 0.9),
    max(input.color.a, flameMask * 7.2)
  );
  // The very dark doorway material is unique in the procedural hut mesh.
  // Preserve it as a material tag before lighting so it can emit warm light
  // at night without another mesh or per-hut light draw.
  let doorwayMaterial = 1.0 - smoothstep(
    0.105,
    0.19,
    length(input.color.rgb)
  );
  let doorwayVertical = smoothstep(0.015, 0.82, input.position.y);
  let doorwayCenter = 1.0 - smoothstep(0.08, 0.34, abs(input.position.x));
  output.doorwayEmission = doorwayMaterial
    * (0.38 + doorwayVertical * 0.5 + doorwayCenter * 0.12);
  return output;
}
`+Ot,Pt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct HutInstanceBuffer {
  values: array<vec4f>,
}

struct HutDynamics {
  baseline: vec4f,
  collapse: vec4f,
}

struct HutDynamicsBuffer {
  values: array<HutDynamics>,
}

@group(0) @binding(2) var<storage, read> huts: HutInstanceBuffer;
@group(0) @binding(3) var<storage, read> hutDynamics: HutDynamicsBuffer;

struct PropInput {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
}

struct PropOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
}

fn rotateX(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x, value.y * c - value.z * s, value.y * s + value.z * c);
}

fn rotateY(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x * c - value.z * s, value.y, value.x * s + value.z * c);
}

fn rotateZ(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x * c - value.y * s, value.x * s + value.y * c, value.z);
}

fn hiddenProp() -> PropOutput {
  var output: PropOutput;
  output.position = vec4f(2.0, 2.0, 2.0, 1.0);
  output.worldPosition = vec3f(0.0);
  output.normal = vec3f(0.0, 1.0, 0.0);
  output.color = vec4f(0.0);
  return output;
}

@vertex
fn vertexMain(
  input: PropInput,
  @builtin(instance_index) instanceIndex: u32
) -> PropOutput {
  let hutIndex = instanceIndex / 14u;
  let pieceIndex = instanceIndex % 14u;
  let dynamics = hutDynamics.values[hutIndex];
  let age = frame.cameraUpTime.w - dynamics.collapse.y;
  if (dynamics.collapse.x < 0.5 || age < 0.0 || age >= 5.2) {
    return hiddenProp();
  }

  let hut = huts.values[hutIndex];
  let seed = hash21(
    vec2f(
      dynamics.collapse.z * 37.1 + f32(pieceIndex) * 11.7,
      f32(hutIndex) * 19.3 + f32(pieceIndex) * 3.9
    )
  );
  let seedB = hash21(vec2f(seed * 83.1, f32(pieceIndex) + 7.4));
  let angle = 6.28318530718
    * (f32(pieceIndex) / 14.0 + (seed - 0.5) * 0.09);
  var shellRadius = mix(0.48, 1.18, seedB) * hut.w;
  var shellHeight = mix(0.42, 2.15, seed) * hut.w;
  if (pieceIndex >= 6u && pieceIndex < 11u) {
    shellRadius = mix(0.82, 1.42, seedB) * hut.w;
    shellHeight = mix(2.2, 3.0, seed) * hut.w;
  } else if (pieceIndex >= 11u) {
    shellRadius = mix(0.58, 1.08, seedB) * hut.w;
    shellHeight = mix(0.55, 2.35, seed) * hut.w;
  }

  let releaseDelay = mix(0.0, 0.52, seedB);
  let fallTime = max(0.0, age - releaseDelay);
  let settleTime = min(fallTime, 1.65);
  let outwardSpeed = mix(0.12, 0.46, seed) * hut.w;
  let liftSpeed = mix(0.08, 0.34, seedB) * hut.w;
  var pieceOffset = vec3f(
    cos(angle) * (shellRadius + outwardSpeed * settleTime),
    shellHeight + liftSpeed * settleTime - 1.38 * settleTime * settleTime,
    sin(angle) * (shellRadius + outwardSpeed * settleTime)
  );
  pieceOffset.y = max(0.08, pieceOffset.y);

  let sink = smoothstep(2.7, 5.2, age);
  let fadeScale = 1.0 - smoothstep(4.65, 5.2, age);
  let tumble = smoothstep(0.0, 1.45, fallTime) * mix(0.72, 2.1, seedB);
  var local = input.position * hut.w * mix(0.58, 0.84, seed) * fadeScale;
  local = rotateX(local, tumble * mix(-0.8, 1.0, seed));
  local = rotateZ(local, tumble * mix(0.55, -0.72, seedB));
  local = rotateY(local, angle + tumble * 0.31);

  let rotatedOffset = rotateY(pieceOffset, hut.z);
  let worldXZ = hut.xy + rotatedOffset.xz;
  let cell = cellFromWorld(worldXZ);
  let terrainValue = state.values[gridIndex(cell.x, cell.y)];
  let groundHeight = terrainValue.x + terrainValue.y;
  let rotatedLocal = rotateY(local, hut.z);
  let worldPosition = vec3f(
    worldXZ.x + rotatedLocal.x,
    groundHeight + pieceOffset.y - sink * 1.35 * hut.w + rotatedLocal.y,
    worldXZ.y + rotatedLocal.z
  );

  var localNormal = input.normal;
  localNormal = rotateX(localNormal, tumble * mix(-0.8, 1.0, seed));
  localNormal = rotateZ(localNormal, tumble * mix(0.55, -0.72, seedB));
  localNormal = rotateY(localNormal, angle + tumble * 0.31 + hut.z);

  let timber = mix(
    vec3f(0.16, 0.067, 0.024),
    vec3f(0.36, 0.17, 0.058),
    seed
  );
  let thatch = mix(
    vec3f(0.31, 0.19, 0.072),
    vec3f(0.56, 0.39, 0.15),
    seedB
  );
  let wood = mix(
    vec3f(0.12, 0.047, 0.018),
    vec3f(0.29, 0.12, 0.038),
    seed
  );
  var materialColor = timber;
  if (pieceIndex >= 6u && pieceIndex < 11u) {
    materialColor = thatch;
  } else if (pieceIndex >= 11u) {
    materialColor = wood;
  }
  let meshShade = dot(input.color.rgb, vec3f(0.333333));

  var output: PropOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  output.normal = normalize(localNormal);
  output.color = vec4f(
    materialColor * mix(0.8, 1.17, meshShade),
    input.color.a
  );
  return output;
}
`+Dt,Ft=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

struct NpcState {
  pose: vec4f,
  motion: vec4f,
}

struct NpcBuffer {
  values: array<NpcState>,
}

@group(0) @binding(2) var<storage, read> npcs: NpcBuffer;

struct PropInput {
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
}

struct PropOutput {
  @builtin(position) position: vec4f,
  @location(0) worldPosition: vec3f,
  @location(1) normal: vec3f,
  @location(2) color: vec4f,
}

fn rotateX(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x, value.y * c - value.z * s, value.y * s + value.z * c);
}

fn rotateY(value: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(value.x * c - value.z * s, value.y, value.x * s + value.z * c);
}

fn npcSkinPalette(seed: f32) -> vec3f {
  let tone = hash21(vec2f(seed, 17.31));
  if (tone < 0.34) {
    return mix(
      vec3f(0.255, 0.12, 0.058),
      vec3f(0.47, 0.245, 0.125),
      tone / 0.34
    );
  }
  if (tone < 0.7) {
    return mix(
      vec3f(0.47, 0.245, 0.125),
      vec3f(0.67, 0.385, 0.215),
      (tone - 0.34) / 0.36
    );
  }
  return mix(
    vec3f(0.67, 0.385, 0.215),
    vec3f(0.845, 0.585, 0.36),
    (tone - 0.7) / 0.3
  );
}

fn npcTunicPalette(seed: f32) -> vec3f {
  let choice = hash21(vec2f(seed, 29.7));
  if (choice < 0.16) {
    return vec3f(0.61, 0.17, 0.075);
  }
  if (choice < 0.33) {
    return vec3f(0.78, 0.41, 0.075);
  }
  if (choice < 0.5) {
    return vec3f(0.22, 0.405, 0.25);
  }
  if (choice < 0.67) {
    return vec3f(0.135, 0.35, 0.45);
  }
  if (choice < 0.84) {
    return vec3f(0.32, 0.265, 0.51);
  }
  return vec3f(0.55, 0.22, 0.29);
}

fn npcAccentPalette(seed: f32) -> vec3f {
  let choice = hash21(vec2f(seed, 43.2));
  if (choice < 0.25) {
    return vec3f(0.94, 0.66, 0.19);
  }
  if (choice < 0.5) {
    return vec3f(0.78, 0.77, 0.54);
  }
  if (choice < 0.75) {
    return vec3f(0.29, 0.69, 0.61);
  }
  return vec3f(0.9, 0.39, 0.21);
}

fn npcHairPalette(seed: f32) -> vec3f {
  let tone = hash21(vec2f(seed, 58.6));
  if (tone < 0.72) {
    return mix(
      vec3f(0.035, 0.022, 0.018),
      vec3f(0.2, 0.085, 0.035),
      tone / 0.72
    );
  }
  return mix(
    vec3f(0.2, 0.085, 0.035),
    vec3f(0.36, 0.25, 0.16),
    (tone - 0.72) / 0.28
  );
}

fn hiddenProp() -> PropOutput {
  var output: PropOutput;
  output.position = vec4f(2.0, 2.0, 2.0, 1.0);
  output.worldPosition = vec3f(0.0);
  output.normal = vec3f(0.0, 1.0, 0.0);
  output.color = vec4f(0.0);
  return output;
}

@vertex
fn vertexMain(
  input: PropInput,
  @builtin(instance_index) instanceIndex: u32
) -> PropOutput {
  let npc = npcs.values[instanceIndex];
  if (npc.pose.w <= 0.005) {
    return hiddenProp();
  }

  let seed = npc.motion.z;
  let materialTag = i32(round(input.color.a));
  let headStyle = hash21(vec2f(seed, 71.4));
  // Tags six and seven are optional, mutually exclusive head silhouettes.
  // Keeping them in the shared mesh is cheaper than separate model draws.
  if (
    (materialTag == 6 && headStyle >= 0.4)
      || (materialTag == 7 && headStyle <= 0.72)
  ) {
    return hiddenProp();
  }

  let deathProgress = clamp(npc.motion.w / 0.65, 0.0, 1.0);
  let alive = 1.0 - step(0.0001, npc.motion.w);
  let stride = sin(
    frame.cameraUpTime.w * npc.motion.y * 6.1
      + npc.motion.z * 2.7
  ) * alive;
  var local = input.position;
  let legBand = 1.0 - smoothstep(0.52, 0.76, local.y);
  let armBand = smoothstep(0.72, 0.95, local.y)
    * (1.0 - smoothstep(1.22, 1.44, local.y))
    * smoothstep(0.14, 0.26, abs(local.x));
  local.z = local.z
    + sign(local.x) * stride * 0.075 * legBand
    - sign(local.x) * stride * 0.055 * armBand;
  local.y = local.y + abs(stride) * 0.026 * alive;
  // A single shared mesh still yields recognizably different islanders:
  // stature, build, and head proportions are stable functions of the NPC seed.
  let stature = mix(0.9, 1.1, hash21(vec2f(seed, 83.1)));
  let build = mix(0.86, 1.14, hash21(vec2f(seed, 91.7)));
  let headSize = mix(0.91, 1.09, hash21(vec2f(seed, 102.4)));
  let headBand = smoothstep(1.23, 1.42, local.y);
  let horizontalScale = mix(build, headSize, headBand);
  local.x = local.x * horizontalScale;
  local.z = local.z * mix(build * 0.95, headSize, headBand);
  local.y = local.y * stature;
  local = local * mix(1.0, 0.76, deathProgress);
  local = rotateX(local, deathProgress * 1.48);
  // The mesh is authored facing local +Z while simulation heading zero points
  // along world +X.
  let facingAngle = npc.pose.z - 1.57079632679;
  local = rotateY(local, facingAngle);

  let cell = cellFromWorld(npc.pose.xy);
  let terrainValue = state.values[gridIndex(cell.x, cell.y)];
  let terrainHeight = terrainValue.x + terrainValue.y;
  let worldPosition = vec3f(
    npc.pose.x + local.x,
    terrainHeight + local.y - deathProgress * 0.48,
    npc.pose.y + local.z
  );

  var transformedNormal = rotateX(input.normal, deathProgress * 1.48);
  transformedNormal = rotateY(transformedNormal, facingAngle);
  var materialColor = input.color.rgb;
  if (materialTag == 1) {
    materialColor = npcSkinPalette(seed);
  } else if (materialTag == 2) {
    materialColor = npcTunicPalette(seed);
  } else if (materialTag == 3 || materialTag == 6) {
    materialColor = npcAccentPalette(seed);
  } else if (materialTag == 4 || materialTag == 7) {
    materialColor = npcHairPalette(seed);
  } else if (materialTag == 5) {
    materialColor = mix(
      vec3f(0.095, 0.047, 0.026),
      vec3f(0.22, 0.11, 0.052),
      hash21(vec2f(seed, 113.8))
    );
  }

  var output: PropOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.worldPosition = worldPosition;
  output.normal = normalize(transformedNormal);
  output.color = vec4f(
    materialColor * mix(1.0, 0.55, deathProgress),
    1.0
  );
  return output;
}
`+Dt,It=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> hit: HitBuffer;

struct CursorInput {
  @location(0) position: vec3f,
}

struct CursorOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
}

fn visualMaterial(depositing: bool) -> f32 {
  if (!depositing) {
    return hit.material.x;
  }
  let lock = i32(round(frame.brushVisual.x));
  return f32(lock);
}

fn cursorMaterialColor(material: f32) -> vec3f {
  if (material < 0.5) {
    return vec3f(0.48, 0.5, 0.47);
  }
  if (material < 1.5) {
    return vec3f(0.96, 0.73, 0.35);
  }
  if (material < 2.5) {
    return vec3f(0.49, 0.285, 0.12);
  }
  if (material < 3.5) {
    return vec3f(0.22, 0.94, 1.0);
  }
  if (material < 4.5) {
    return vec3f(1.0, 0.18, 0.025);
  }
  return vec3f(0.045, 0.052, 0.055);
}

@vertex
fn vertexMain(input: CursorInput) -> CursorOutput {
  let pulse = 1.0 + sin(frame.cameraUpTime.w * 3.1) * 0.055;
  let radius = 2.85 * pulse;
  let worldPosition = vec3f(
    hit.value.x + input.position.x * radius,
    hit.value.z + 0.16,
    hit.value.y + input.position.z * radius
  );
  let depositing = frame.brushVisual.y > 0.5;
  let color = cursorMaterialColor(visualMaterial(depositing));
  var output: CursorOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.color = vec4f(color, hit.value.w * 0.9);
  return output;
}

@fragment
fn fragmentMain(input: CursorOutput) -> @location(0) vec4f {
  return input.color;
}
`,Lt=L+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> hit: HitBuffer;

struct ReservoirReadBuffer {
  values: array<i32>,
}

@group(0) @binding(2) var<storage, read> reservoir: ReservoirReadBuffer;

struct ParticleInput {
  @location(0) position: vec3f,
}

struct ParticleOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) color: vec4f,
}

fn hash11(value: f32) -> f32 {
  return fract(sin(value * 127.1) * 43758.5453);
}

fn visualMaterial(depositing: bool) -> f32 {
  if (!depositing) {
    return hit.material.x;
  }
  let lock = i32(round(frame.brushVisual.x));
  return f32(lock);
}

fn gatherLockForMaterial(material: f32) -> i32 {
  let materialId = i32(round(material));
  if (materialId < 1 || materialId > 5) {
    return 0;
  }
  return materialId;
}

fn particleMaterialColor(material: f32, seed: f32) -> vec3f {
  if (material < 0.5) {
    return vec3f(0.35, 0.37, 0.34);
  }
  if (material < 1.5) {
    return mix(vec3f(0.68, 0.48, 0.24), vec3f(0.92, 0.79, 0.53), seed);
  }
  if (material < 2.5) {
    return mix(vec3f(0.2, 0.105, 0.045), vec3f(0.52, 0.33, 0.14), seed);
  }
  if (material < 3.5) {
    return mix(vec3f(0.46, 0.75, 0.79), vec3f(0.9, 0.98, 0.96), seed);
  }
  if (material < 4.5) {
    return mix(vec3f(0.78, 0.035, 0.008), vec3f(1.0, 0.57, 0.055), seed);
  }
  return mix(vec3f(0.018, 0.022, 0.024), vec3f(0.12, 0.14, 0.135), seed);
}

@vertex
fn vertexMain(
  input: ParticleInput,
  @builtin(instance_index) instanceIndex: u32
) -> ParticleOutput {
  let seed = f32(instanceIndex) + 1.0;
  let power = clamp(frame.fog.z, 1.0, 60.0);
  let normalizedPower = (power - 1.0) / 59.0;
  let phase = fract(
    frame.cameraUpTime.w
      * (0.58 + hash11(seed) * 0.31)
      * mix(1.0, 2.35, normalizedPower)
      + hash11(seed * 4.7)
  );
  let pickup = step(frame.brushVisual.y, -0.5);
  let lift = mix(1.0 - phase, phase, pickup);
  let angle = hash11(seed * 2.1) * 6.2831853;
  let spread = (0.25 + hash11(seed * 9.4) * mix(1.8, 2.65, normalizedPower))
    * (1.0 - lift * 0.72);
  let jitter = vec2f(cos(angle), sin(angle)) * spread;
  let streamHeight = lift
    * mix(7.3, 10.8, normalizedPower)
    + sin(phase * 9.0 + seed) * normalizedPower * 0.5;
  let center = vec3f(
    hit.value.x + jitter.x,
    hit.value.z + 0.28 + streamHeight,
    hit.value.y + jitter.y
  );
  let depositing = frame.brushVisual.y > 0.5;
  let material = visualMaterial(depositing);
  let waterParticle = material >= 2.5 && material < 3.5;
  let waterKeep = select(
    1.0,
    step(0.82, hash11(seed * 13.7 + 5.1)),
    waterParticle
  );
  let size = mix(0.34, 0.11, lift)
    * (0.65 + hash11(seed * 7.2) * 0.72)
    * select(1.0, 0.58, waterParticle);
  let local = frame.cameraRight.xyz * input.position.x * size
    + frame.cameraUpTime.xyz * input.position.y * size;
  let gatheringRock = select(0.0, 1.0, !depositing && material < 0.5);
  let color = particleMaterialColor(material, hash11(seed));
  let exactReservoirUnits = reservoir.values[0]
    + reservoir.values[1]
    + reservoir.values[2]
    + reservoir.values[3]
    + reservoir.values[4];
  let hasLockedMaterial = reservoir.values[5] > 0 && exactReservoirUnits > 0;
  let emptyPour = depositing && !hasLockedMaterial;
  let gatherSourceLock = gatherLockForMaterial(material);
  let handLock = reservoir.values[5];
  let invalidGather = !depositing && (
    gatherSourceLock == 0
      || (handLock != 0 && handLock != gatherSourceLock)
  );
  let visible = frame.brushVisual.z
    * hit.value.w
    * (1.0 - gatheringRock)
    * waterKeep
    * select(1.0, 0.0, emptyPour || invalidGather);
  var output: ParticleOutput;
  output.position = frame.viewProjection * vec4f(center + local, 1.0);
  output.uv = input.position.xy + vec2f(0.5);
  output.color = vec4f(
    color,
    visible
      * (0.38 + 0.58 * sin(phase * 3.1415926))
      * select(1.0, 0.58, waterParticle)
  );
  return output;
}

@fragment
fn fragmentMain(input: ParticleOutput) -> @location(0) vec4f {
  let radial = length(input.uv - vec2f(0.5)) * 2.0;
  let alpha = input.color.a * (1.0 - smoothstep(0.25, 1.0, radial));
  if (alpha < 0.01) {
    discard;
  }
  return vec4f(input.color.rgb, alpha);
}
`,Rt=String.raw`
struct PainterlyUniforms {
  resolution: vec2f,
  time: f32,
  mode: f32,
  strength: f32,
  strokeScale: f32,
  pad: vec2f,
}

@group(0) @binding(0) var sceneTexture: texture_2d<f32>;
@group(0) @binding(1) var sceneSampler: sampler;
@group(0) @binding(2) var<uniform> style: PainterlyUniforms;

struct PainterlyOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

fn painterHash21(p: vec2f) -> f32 {
  let p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  let q = p3 + dot(p3, p3.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

fn painterNoise2(p: vec2f) -> f32 {
  let cell = floor(p);
  let local = fract(p);
  let fade = local * local * (3.0 - 2.0 * local);
  let a = painterHash21(cell);
  let b = painterHash21(cell + vec2f(1.0, 0.0));
  let c = painterHash21(cell + vec2f(0.0, 1.0));
  let d = painterHash21(cell + vec2f(1.0, 1.0));
  return mix(mix(a, b, fade.x), mix(c, d, fade.x), fade.y);
}

fn painterLuminance(color: vec3f) -> f32 {
  return dot(color, vec3f(0.2126, 0.7152, 0.0722));
}

fn painterSafeDirection(value: vec2f, fallback: vec2f) -> vec2f {
  let magnitude = length(value);
  if (magnitude < 0.0001) {
    return fallback;
  }
  return value / magnitude;
}

fn painterSample(uv: vec2f) -> vec3f {
  return textureSample(
    sceneTexture,
    sceneSampler,
    clamp(uv, vec2f(0.0005), vec2f(0.9995))
  ).rgb;
}

fn painterGradient(uv: vec2f, pixelSize: vec2f, radius: f32) -> vec2f {
  let offsetX = vec2f(pixelSize.x * radius, 0.0);
  let offsetY = vec2f(0.0, pixelSize.y * radius);
  let left = painterLuminance(painterSample(uv - offsetX));
  let right = painterLuminance(painterSample(uv + offsetX));
  let up = painterLuminance(painterSample(uv - offsetY));
  let down = painterLuminance(painterSample(uv + offsetY));
  return vec2f(right - left, down - up);
}

fn oilPaint(uv: vec2f, base: vec3f) -> vec3f {
  let resolution = max(style.resolution, vec2f(1.0));
  let pixelSize = vec2f(1.0) / resolution;
  let pixel = uv * resolution;
  let scale = clamp(style.strokeScale, 0.55, 1.8);
  let radius = 6.4 * scale;
  let gradient = painterGradient(uv, pixelSize, 1.7 * scale);
  let edgeMagnitude = length(gradient);

  let directionNoise = painterNoise2(pixel * 0.011 + vec2f(17.0, -9.0));
  let directionWarp = painterNoise2(pixel * 0.0035 + vec2f(-31.0, 14.0));
  let angle = directionNoise * 6.28318530718 + (directionWarp - 0.5) * 1.6;
  let wanderingDirection = vec2f(cos(angle), sin(angle));
  let edgeTangent = painterSafeDirection(
    vec2f(-gradient.y, gradient.x),
    wanderingDirection
  );
  let edgeAlignment = smoothstep(0.018, 0.19, edgeMagnitude);
  let direction = painterSafeDirection(
    mix(wanderingDirection, edgeTangent, edgeAlignment * 0.88),
    wanderingDirection
  );
  let across = vec2f(-direction.y, direction.x);
  let alongUv = direction * pixelSize * radius;
  let acrossUv = across * pixelSize * radius;

  // Anisotropic scene sampling lays colour along local image contours. This is
  // a compact directional filter rather than a costly full Kuwahara solve.
  var painted = base * 0.18;
  painted = painted + painterSample(uv - alongUv * 0.42) * 0.16;
  painted = painted + painterSample(uv + alongUv * 0.42) * 0.16;
  painted = painted + painterSample(uv - alongUv * 0.92) * 0.10;
  painted = painted + painterSample(uv + alongUv * 0.92) * 0.10;
  painted = painted + painterSample(uv - acrossUv * 0.30) * 0.08;
  painted = painted + painterSample(uv + acrossUv * 0.30) * 0.08;
  painted = painted
    + painterSample(uv + alongUv * 0.62 + acrossUv * 0.24) * 0.07;
  painted = painted
    + painterSample(uv - alongUv * 0.62 - acrossUv * 0.24) * 0.07;

  // Preserve object boundaries while allowing flat regions to merge into long
  // loaded strokes.
  painted = mix(painted, base, smoothstep(0.045, 0.28, edgeMagnitude) * 0.24);

  let originalLum = painterLuminance(painted);
  let paletteDither = painterNoise2(
    pixel / max(radius * 1.35, 1.0) + vec2f(41.0, 7.0)
  ) - 0.5;
  let quantizedLum = floor(originalLum * 13.0 + 0.5 + paletteDither * 0.7)
    / 13.0;
  let chroma = painted - vec3f(originalLum);
  painted = vec3f(quantizedLum) + chroma * 1.08;

  // Analytic bristle ridges form a height-like field. Its slope receives a
  // fixed screen-space grazing light, producing an impasto sheen without a
  // normal map or canvas texture.
  let localAlong = dot(pixel, direction) / max(radius, 1.0);
  let localAcross = dot(pixel, across) / max(radius * 0.36, 1.0);
  let ridgeWarp = painterNoise2(
    vec2f(localAlong * 0.31, localAcross * 0.12) + vec2f(5.0, 23.0)
  );
  let ridgePhase = localAcross * 6.28318530718 + ridgeWarp * 3.1;
  let ridgeSignal = 0.5 + 0.5 * sin(ridgePhase);
  let brokenLoad = painterNoise2(
    vec2f(localAlong * 0.52, localAcross * 0.21) + vec2f(-18.0, 37.0)
  );
  let bristleHighlight = smoothstep(0.62, 0.96, ridgeSignal)
    * mix(0.28, 1.0, brokenLoad);
  let ridgeSlope = cos(ridgePhase) * mix(0.25, 0.72, brokenLoad);
  let dabSlope = (directionWarp - 0.5) * 0.34;
  let impastoNormal = normalize(vec3f(
    -across.x * ridgeSlope - direction.x * dabSlope,
    across.y * ridgeSlope + direction.y * dabSlope,
    1.0
  ));
  let impastoLight = max(
    dot(impastoNormal, normalize(vec3f(-0.42, -0.31, 0.86))),
    0.0
  );
  painted = painted * (0.88 + impastoLight * 0.24);
  painted = painted
    + vec3f(1.0, 0.93, 0.78) * bristleHighlight * 0.038;
  painted = painted
    * (1.0 - smoothstep(0.035, 0.24, edgeMagnitude) * 0.075);

  return clamp(
    mix(base, painted, clamp(style.strength, 0.0, 1.25)),
    vec3f(0.0),
    vec3f(1.35)
  );
}

fn monetPaint(uv: vec2f, base: vec3f) -> vec3f {
  let resolution = max(style.resolution, vec2f(1.0));
  let pixelSize = vec2f(1.0) / resolution;
  let pixel = uv * resolution;
  let scale = clamp(style.strokeScale, 0.55, 1.8);
  let radius = 4.8 * scale;
  let gradient = painterGradient(uv, pixelSize, 1.25 * scale);
  let edgeMagnitude = length(gradient);

  let directionNoise = painterNoise2(pixel * 0.014 + vec2f(-7.0, 29.0));
  let angle = directionNoise * 6.28318530718
    + painterNoise2(pixel * 0.004 + vec2f(12.0, -33.0)) * 1.3;
  let wanderingDirection = vec2f(cos(angle), sin(angle));
  let tangent = painterSafeDirection(vec2f(-gradient.y, gradient.x), wanderingDirection);
  let direction = painterSafeDirection(
    mix(
      wanderingDirection,
      tangent,
      smoothstep(0.015, 0.15, edgeMagnitude) * 0.72
    ),
    wanderingDirection
  );
  let across = vec2f(-direction.y, direction.x);
  let alongUv = direction * pixelSize * radius;
  let acrossUv = across * pixelSize * radius;

  let warmTint = vec3f(1.065, 1.012, 0.91);
  let coolTint = vec3f(0.91, 0.985, 1.105);
  let warmA = painterSample(uv + alongUv * 0.68) * warmTint;
  let warmB = painterSample(uv - acrossUv * 0.54) * warmTint;
  let coolA = painterSample(uv - alongUv * 0.62) * coolTint;
  let coolB = painterSample(uv + acrossUv * 0.58) * coolTint;
  let diagonalA = painterSample(uv + alongUv * 0.42 + acrossUv * 0.42);
  let diagonalB = painterSample(uv - alongUv * 0.42 - acrossUv * 0.42);

  // Broken warm/cool dabs are combined rather than averaged into neutral grey.
  // The local noise decides which pigment remains dominant within each stroke.
  let temperature = painterNoise2(
    pixel / max(radius * 1.7, 1.0) + vec2f(53.0, -11.0)
  );
  var painted = base * 0.16;
  painted = painted + mix(coolA, warmA, temperature) * 0.23;
  painted = painted + mix(warmB, coolB, temperature) * 0.21;
  painted = painted + diagonalA * 0.20;
  painted = painted + diagonalB * 0.20;

  let lum = painterLuminance(painted);
  let shadow = 1.0 - smoothstep(0.24, 0.66, lum);
  let highlight = smoothstep(0.52, 0.92, lum);
  painted = painted
    + vec3f(-0.018, 0.008, 0.058)
      * shadow
      * mix(0.35, 1.0, 1.0 - temperature);
  painted = painted
    + vec3f(0.052, 0.026, -0.018)
      * highlight
      * mix(0.3, 1.0, temperature);

  let paintedLum = painterLuminance(painted);
  let gentleStep = floor(
    paintedLum * 18.0
      + 0.5
      + (painterNoise2(pixel / max(radius, 1.0)) - 0.5) * 0.45
  ) / 18.0;
  painted = vec3f(gentleStep)
    + (painted - vec3f(paintedLum)) * 1.16;

  let localAlong = dot(pixel, direction) / max(radius * 0.72, 1.0);
  let localAcross = dot(pixel, across) / max(radius * 0.46, 1.0);
  let dabWarp = painterNoise2(
    vec2f(localAlong * 0.28, localAcross * 0.34) + vec2f(19.0, 61.0)
  );
  let dabSignal = sin(localAlong + dabWarp * 2.6)
    * sin(localAcross * 1.17 - dabWarp * 1.8);
  let dabValue = 0.5 + dabSignal * 0.5;
  painted = painted * mix(0.94, 1.075, dabValue);

  // Impressionist edges remain chromatic and soft rather than becoming inked.
  painted = mix(
    painted,
    base * mix(coolTint, warmTint, temperature),
    smoothstep(0.08, 0.3, edgeMagnitude) * 0.14
  );

  return clamp(
    mix(base, painted, clamp(style.strength, 0.0, 1.25)),
    vec3f(0.0),
    vec3f(1.35)
  );
}

fn watercolorPaint(uv: vec2f, base: vec3f) -> vec3f {
  let resolution = max(style.resolution, vec2f(1.0));
  let pixelSize = vec2f(1.0) / resolution;
  let pixel = uv * resolution;
  let scale = clamp(style.strokeScale, 0.55, 1.8);
  let radius = 2.25 * scale;
  let offsetX = vec2f(pixelSize.x * radius, 0.0);
  let offsetY = vec2f(0.0, pixelSize.y * radius);

  let left = painterSample(uv - offsetX);
  let right = painterSample(uv + offsetX);
  let up = painterSample(uv - offsetY);
  let down = painterSample(uv + offsetY);
  let upLeft = painterSample(uv - offsetX - offsetY);
  let upRight = painterSample(uv + offsetX - offsetY);
  let downLeft = painterSample(uv - offsetX + offsetY);
  let downRight = painterSample(uv + offsetX + offsetY);

  let blurred = (
    base * 4.0
      + (left + right + up + down) * 2.0
      + upLeft + upRight + downLeft + downRight
  ) / 16.0;

  let gradientX = painterLuminance(right) - painterLuminance(left)
    + (
      painterLuminance(upRight)
        + painterLuminance(downRight)
        - painterLuminance(upLeft)
        - painterLuminance(downLeft)
    ) * 0.5;
  let gradientY = painterLuminance(down) - painterLuminance(up)
    + (
      painterLuminance(downLeft)
        + painterLuminance(downRight)
        - painterLuminance(upLeft)
        - painterLuminance(upRight)
    ) * 0.5;
  let edgeMagnitude = length(vec2f(gradientX, gradientY));

  let paperBroad = painterNoise2(pixel * 0.018 + vec2f(7.0, 43.0));
  let paperFine = painterNoise2(pixel * 0.23 + vec2f(-17.0, 5.0));
  let paperFibre = (
    sin(pixel.x * 0.63 + paperBroad * 5.0)
      + sin(pixel.y * 0.47 - paperFine * 3.4)
  ) * 0.25 + 0.5;
  let paper = mix(
    vec3f(0.958, 0.944, 0.91),
    vec3f(0.986, 0.978, 0.954),
    clamp(paperBroad * 0.68 + paperFibre * 0.32, 0.0, 1.0)
  );

  // Approximate subtractive pigment by diffusing optical density, then
  // converting it back to reflected colour. Dark pigments granulate more than
  // light washes, as real particles settle into paper valleys.
  let absorbance = -log(max(blurred, vec3f(0.025)));
  let pigmentLoad = clamp(1.0 - painterLuminance(blurred), 0.0, 1.0);
  let granulation = painterNoise2(pixel * 0.071 + vec2f(31.0, -19.0))
    * 0.58 + paperFine * 0.42;
  let density = 0.91
    + (granulation - 0.5) * (0.09 + pigmentLoad * 0.22);
  let pigment = exp(-absorbance * density);
  var painted = mix(paper, pigment, 0.88);

  let edgePool = smoothstep(0.025, 0.19, edgeMagnitude)
    * mix(0.48, 1.0, granulation);
  painted = painted * (1.0 - edgePool * 0.14);

  // Low-frequency wash boundaries produce restrained back-runs and blooms.
  let washField = painterNoise2(pixel * 0.014 + vec2f(-52.0, 27.0));
  let backrun = 1.0 - smoothstep(0.025, 0.12, abs(washField - 0.56));
  let quietWash = 1.0 - smoothstep(0.03, 0.17, edgeMagnitude);
  painted = mix(painted, paper, backrun * quietWash * 0.032);
  painted = mix(
    painted,
    paper,
    smoothstep(0.68, 0.98, paperFibre) * (0.012 + pigmentLoad * 0.018)
  );

  let paintedLum = painterLuminance(painted);
  painted = vec3f(paintedLum)
    + (painted - vec3f(paintedLum)) * 0.92;
  painted = mix(painted, paper, 0.018 + (1.0 - pigmentLoad) * 0.018);

  return clamp(
    mix(base, painted, clamp(style.strength, 0.0, 1.25)),
    vec3f(0.0),
    vec3f(1.25)
  );
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> PainterlyOutput {
  let triangleUv = vec2f(
    f32((vertexIndex << 1u) & 2u),
    f32(vertexIndex & 2u)
  );
  var output: PainterlyOutput;
  output.position = vec4f(triangleUv * 2.0 - vec2f(1.0), 0.0, 1.0);
  output.uv = vec2f(triangleUv.x, 1.0 - triangleUv.y);
  return output;
}

@fragment
fn fragmentMain(input: PainterlyOutput) -> @location(0) vec4f {
  let base = painterSample(input.uv);
  var color = base;
  if (style.mode < 0.5) {
    color = base;
  } else if (style.mode < 1.5) {
    color = oilPaint(input.uv, base);
  } else if (style.mode < 2.5) {
    color = monetPaint(input.uv, base);
  } else {
    color = watercolorPaint(input.uv, base);
  }
  return vec4f(color, 1.0);
}
`,zt=String.raw`
fn rawWaterTransfer(source: vec2i, destination: vec2i) -> f32 {
  let fromCell = vec2u(source);
  let toCell = vec2u(destination);
  let fromValue = stateIn.values[gridIndex(fromCell.x, fromCell.y)];
  let toValue = stateIn.values[gridIndex(toCell.x, toCell.y)];
  let fromSurface = fromValue.x + fromValue.y + fromValue.z;
  let toSurface = toValue.x + toValue.y + toValue.z;
  let offset = destination - source;
  let cardinal = offset.x == 0 || offset.y == 0;
  // Diagonal transfers remain available, but carry half a cardinal edge. This
  // puts more of the fixed stability budget into actual downhill travel instead
  // of diffusing a thin film sideways into eight equally strong directions.
  let directionWeight = select(0.5, 1.0, cardinal);
  let effectiveDestinationSurface = max(
    toSurface,
    wallCrestBetween(&wallEdges, source, destination)
  );
  let heightDifference = max(
    0.0,
    fromSurface - effectiveDestinationSurface - 0.0007
  );
  // Almost-level free surfaces remain mobile, so mild terrain slopes do not pin
  // shallow runoff. The aggregate explicit coefficient is still CFL bounded.
  let normalizedSlope = smoothstep(0.0012, 0.12, heightDifference);
  let requestedMobility = mix(0.31, 0.4, normalizedSlope);
  let neighborWeightSum = 6.0;
  let transportScale = uniforms.physics.x * uniforms.grid.z * 1.45;
  let cflMobility = 0.84 / max(
    neighborWeightSum * transportScale,
    0.0001
  );
  let mobility = min(requestedMobility, cflMobility);
  return heightDifference
    * transportScale
    * mobility
    * directionWeight;
}
`,Bt=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read_write> soilOut: SoilBuffer;
@group(0) @binding(3) var<storage, read_write> erosionMemory: ScalarBuffer;
@group(0) @binding(4) var<storage, read_write> dirtFlux: DirtFluxBuffer;

fn soilSegmentDistance2d(point: vec2f, start: vec2f, end: vec2f) -> f32 {
  let edge = end - start;
  let projection = clamp(
    dot(point - start, edge) / max(dot(edge, edge), 0.0001),
    0.0,
    1.0
  );
  return distance(point, start + edge * projection);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }
  let index = gridIndex(gid.x, gid.y);
  let value = state.values[index];
  let uv = vec2f(gid.xy) / f32(n - 1u);
  let worldXZ = (uv - vec2f(0.5)) * uniforms.world.x;
  let inlandMode = step(0.5, uniforms.pad1.z);
  let terrainHeight = value.x + value.y;
  let dryInterior = smoothstep(
    uniforms.physics.w + 0.18,
    uniforms.physics.w + 2.6,
    terrainHeight
  ) * (1.0 - smoothstep(0.035, 0.22, value.z));
  let broadComposition = gradientFbm(worldXZ * 0.025 + vec2f(8.2, -4.7));
  // Coastal groves are rooted in coherent loamy pockets rather than palms
  // being sprinkled uniformly over pure sand. Elliptical smooth fields blend
  // the dirt/sand composition without hairline material seams.
  let coastalForestA = 1.0 - smoothstep(
    0.52,
    1.2,
    length((worldXZ - vec2f(-53.0, 2.0)) / vec2f(15.0, 12.0))
  );
  let coastalForestB = 1.0 - smoothstep(
    0.52,
    1.2,
    length((worldXZ - vec2f(-29.0, -38.0)) / vec2f(14.0, 11.0))
  );
  let coastalForestC = 1.0 - smoothstep(
    0.52,
    1.2,
    length((worldXZ - vec2f(24.0, 46.0)) / vec2f(15.0, 10.0))
  );
  let coastalForestSoil = max(
    coastalForestA,
    max(coastalForestB, coastalForestC)
  );
  let coastalDirtFraction = clamp(
    dryInterior * (
      0.13
        + broadComposition * 0.12
        + coastalForestSoil * 0.72
    ),
    0.0,
    0.92
  );

  let lakeA = length((worldXZ - vec2f(-47.0, -31.0)) / vec2f(15.0, 11.0));
  let lakeB = length((worldXZ - vec2f(25.0, 36.0)) / vec2f(11.0, 8.5));
  let lakeC = length((worldXZ - vec2f(49.0, 5.0)) / vec2f(8.0, 6.0));
  let sandyLakeAndShore = 1.0 - smoothstep(
    0.72,
    1.38,
    min(lakeA, min(lakeB, lakeC))
  );
  let quietRiverDistance = min(
    soilSegmentDistance2d(worldXZ, vec2f(-47.0, -31.0), vec2f(-53.0, -14.0)),
    min(
      soilSegmentDistance2d(worldXZ, vec2f(-53.0, -14.0), vec2f(-57.0, 7.0)),
      soilSegmentDistance2d(worldXZ, vec2f(-57.0, 7.0), vec2f(-74.0, 29.0))
    )
  );
  let strongRiverDistance = min(
    soilSegmentDistance2d(worldXZ, vec2f(25.0, 36.0), vec2f(10.0, 6.0)),
    min(
      soilSegmentDistance2d(worldXZ, vec2f(10.0, 6.0), vec2f(26.0, -31.0)),
      soilSegmentDistance2d(worldXZ, vec2f(26.0, -31.0), vec2f(69.0, -72.0))
    )
  );
  let sandyRiverBed = 1.0 - smoothstep(
    1.0,
    5.2,
    min(quietRiverDistance, strongRiverDistance)
  );
  // Inland movable ground is cohesive dirt through its full depth. A blended
  // fraction made every excavation expose progressively paler hidden sand.
  // Sand can still arrive physically through hydraulic transport or the hand.
  let inlandDirtFraction = 1.0;
  let dirtFraction = mix(coastalDirtFraction, inlandDirtFraction, inlandMode);
  let initialDirtDepth = clamp(value.y * dirtFraction, 0.0, value.y);
  let rootedInterior = smoothstep(0.28, 1.4, value.y)
    * (1.0 - sandyLakeAndShore * inlandMode);
  let initialCompaction = clamp(
    mix(0.52, 0.82, rootedInterior)
      + broadComposition * 0.06
      - smoothstep(0.05, 0.6, value.z) * 0.18,
    0.18,
    0.9
  );
  // Named invariants for the positional WGSL constructor:
  // suspendedSand: 0.0, suspendedDirt: 0.0.
  soilOut.values[index] = SoilCell(
    initialDirtDepth,
    0.0,
    0.0,
    initialCompaction
  );
  erosionMemory.values[index] = 0.0;
  dirtFlux.values[index] = vec4f(0.0);
}
`,Vt=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> stateIn: StateBuffer;
@group(0) @binding(2) var<storage, read> waterFlux: StateBuffer;
@group(0) @binding(3) var<storage, read> soilIn: SoilBuffer;
@group(0) @binding(4) var<storage, read_write> soilOut: SoilBuffer;

struct WaterTileStateBuffer { values: array<vec4u>, }
struct WaterConnectivityBuffer { values: array<vec4u>, }
struct SoilDiagnosticsBuffer { values: array<atomic<u32>>, }
@group(0) @binding(5) var<storage, read> tileState: WaterTileStateBuffer;
@group(0) @binding(6) var<storage, read> stableConnectivity: WaterConnectivityBuffer;
@group(0) @binding(7) var<storage, read_write> diagnostics: SoilDiagnosticsBuffer;
// Signed exchange written by waterUpdateShader earlier in this command stream.
@group(0) @binding(8) var<storage, read> externalBoundaryFlux: ScalarBuffer;
@group(0) @binding(9) var<storage, read_write> wallEdges: WallEdgeBuffer;

const WATER_TILE_SIZE: u32 = 8u;
const MINIMUM_SEDIMENT_WATER_DEPTH: f32 = 0.0025;
const SAND_TRANSPORT_FRACTION: f32 = 0.46;
const DIRT_TRANSPORT_FRACTION: f32 = 0.82;
const MAX_EDGE_SEDIMENT_FLUX: f32 = 0.02;

fn insideSoilCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

fn soilTileFlags(p: vec2i, n: i32) -> vec4u {
  let tileCount = (n + i32(WATER_TILE_SIZE) - 1) / i32(WATER_TILE_SIZE);
  let safePosition = clamp(p, vec2i(0), vec2i(n - 1));
  let tile = safePosition / i32(WATER_TILE_SIZE);
  return tileState.values[u32(tile.y * tileCount + tile.x)];
}

fn activeSedimentCell(p: vec2i, n: i32) -> bool {
  let flags = soilTileFlags(p, n);
  let cell = vec2u(clamp(p, vec2i(0), vec2i(n - 1)));
  let connectivity = stableConnectivity.values[gridIndex(cell.x, cell.y)];
  let virtualOceanSponge = flags.x == 2u && connectivity.y != 0u;
  return flags.w != 0u && !virtualOceanSponge;
}

fn inlandSedimentSinkFraction(p: vec2i) -> f32 {
  let cell = vec2u(p);
  let uv = vec2f(cell) / f32(gridSize() - 1u);
  let worldXZ = (uv - vec2f(0.5)) * uniforms.world.x;
  let inlandMode = step(0.5, uniforms.pad1.z);
  let quietSeep = 1.0 - smoothstep(
    5.5, 9.0, distance(worldXZ, vec2f(-74.0, 29.0))
  );
  let strongSeep = 1.0 - smoothstep(
    6.5, 10.5, distance(worldXZ, vec2f(69.0, -72.0))
  );
  let inlandSink = inlandMode
    * max(quietSeep, strongSeep * 1.35)
    * uniforms.grid.z;
  return clamp(inlandSink, 0.0, 0.12);
}

fn quantizedSedimentSink(value: f32) -> u32 {
  return u32(clamp(round(max(0.0, value) * 1000000.0), 0.0, 4294967040.0));
}

fn rawWaterTransfer(source: vec2i, destination: vec2i) -> f32 {
  let fromCell = vec2u(source);
  let toCell = vec2u(destination);
  let fromValue = stateIn.values[gridIndex(fromCell.x, fromCell.y)];
  let toValue = stateIn.values[gridIndex(toCell.x, toCell.y)];
  let fromSurface = fromValue.x + fromValue.y + fromValue.z;
  let toSurface = toValue.x + toValue.y + toValue.z;
  let offset = destination - source;
  let cardinal = offset.x == 0 || offset.y == 0;
  // Diagonal transfers remain available, but carry half a cardinal edge. This
  // puts more of the fixed stability budget into actual downhill travel instead
  // of diffusing a thin film sideways into eight equally strong directions.
  let directionWeight = select(0.5, 1.0, cardinal);
  let effectiveDestinationSurface = max(
    toSurface,
    wallCrestBetween(&wallEdges, source, destination)
  );
  let heightDifference = max(
    0.0,
    fromSurface - effectiveDestinationSurface - 0.0007
  );
  // Almost-level free surfaces remain mobile, so mild terrain slopes do not pin
  // shallow runoff. The aggregate explicit coefficient is still CFL bounded.
  let normalizedSlope = smoothstep(0.0012, 0.12, heightDifference);
  let requestedMobility = mix(0.31, 0.4, normalizedSlope);
  let neighborWeightSum = 6.0;
  let transportScale = uniforms.physics.x * uniforms.grid.z * 1.45;
  let cflMobility = 0.84 / max(
    neighborWeightSum * transportScale,
    0.0001
  );
  let mobility = min(requestedMobility, cflMobility);
  return heightDifference
    * transportScale
    * mobility
    * directionWeight;
}

fn physicalSedimentEdgeTransfer(
  source: vec2i,
  destination: vec2i,
  suspended: f32,
  transportFraction: f32
) -> f32 {
  if (suspended <= 0.0) {
    return 0.0;
  }
  let sourceCell = vec2u(source);
  let sourceIndex = gridIndex(sourceCell.x, sourceCell.y);
  let sourceWaterDepth = stateIn.values[sourceIndex].z;
  let sourceOutScale = waterFlux.values[sourceIndex].y;
  let waterTransfer = rawWaterTransfer(source, destination)
    * sourceOutScale;
  let concentration = suspended
    / max(sourceWaterDepth, MINIMUM_SEDIMENT_WATER_DEPTH);
  // The physical water pass caps aggregate outflow to <=44% of source depth,
  // so these fractions hard-bound total sediment outflow below source mass.
  return max(0.0, waterTransfer * concentration * transportFraction);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) {
    return;
  }
  let index = gridIndex(gid.x, gid.y);
  let position = vec2i(gid.xy);
  let ni = i32(n);
  let sourceSoil = soilIn.values[index];
  if (!activeSedimentCell(position, ni)) {
    soilOut.values[index] = sourceSoil;
    return;
  }

  var outgoingSand = 0.0;
  var outgoingDirt = 0.0;
  var incomingSand = 0.0;
  var incomingDirt = 0.0;
  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      if (ox == 0 && oy == 0) { continue; }
      let neighbor = position + vec2i(ox, oy);
      if (!insideSoilCell(neighbor, ni) || !activeSedimentCell(neighbor, ni)) {
        continue;
      }
      outgoingSand = outgoingSand + physicalSedimentEdgeTransfer(
        position, neighbor, sourceSoil.suspendedSand, SAND_TRANSPORT_FRACTION
      );
      outgoingDirt = outgoingDirt + physicalSedimentEdgeTransfer(
        position, neighbor, sourceSoil.suspendedDirt, DIRT_TRANSPORT_FRACTION
      );
      let neighborCell = vec2u(neighbor);
      let neighborSoil = soilIn.values[gridIndex(neighborCell.x, neighborCell.y)];
      incomingSand = incomingSand + physicalSedimentEdgeTransfer(
        neighbor, position, neighborSoil.suspendedSand, SAND_TRANSPORT_FRACTION
      );
      incomingDirt = incomingDirt + physicalSedimentEdgeTransfer(
        neighbor, position, neighborSoil.suspendedDirt, DIRT_TRANSPORT_FRACTION
      );
    }
  }
  // External frontiers carry no incoming sediment. Ocean loss is driven only
  // by the exact negative exchange granted by waterUpdateShader this tick; an
  // inward or zero grant therefore removes exactly zero sediment.
  let sourceWaterDepth = stateIn.values[index].z;
  let grantedOceanOutflow = max(0.0, -externalBoundaryFlux.values[index]);
  let verifiedBroadOcean = stableConnectivity.values[index].y != 0u
    && uniforms.pad1.z < 0.5;
  let oceanWaterOutflow = select(
    0.0,
    grantedOceanOutflow,
    verifiedBroadOcean
  );
  let oceanSandSink = oceanWaterOutflow
    * sourceSoil.suspendedSand
    / max(sourceWaterDepth, MINIMUM_SEDIMENT_WATER_DEPTH)
    * SAND_TRANSPORT_FRACTION;
  let oceanDirtSink = oceanWaterOutflow
    * sourceSoil.suspendedDirt
    / max(sourceWaterDepth, MINIMUM_SEDIMENT_WATER_DEPTH)
    * DIRT_TRANSPORT_FRACTION;
  let inlandSinkFraction = inlandSedimentSinkFraction(position);
  var sinkSand = oceanSandSink
    + sourceSoil.suspendedSand * inlandSinkFraction;
  var sinkDirt = oceanDirtSink
    + sourceSoil.suspendedDirt * inlandSinkFraction;
  let requestedSink = sinkSand + sinkDirt;
  let boundedSinkScale = select(
    1.0,
    min(1.0, MAX_EDGE_SEDIMENT_FLUX / requestedSink),
    requestedSink > 0.000001
  );
  sinkSand = sinkSand * boundedSinkScale;
  sinkDirt = sinkDirt * boundedSinkScale;
  outgoingSand = min(sourceSoil.suspendedSand, outgoingSand + sinkSand);
  outgoingDirt = min(sourceSoil.suspendedDirt, outgoingDirt + sinkDirt);
  atomicAdd(
    &diagnostics.values[14],
    quantizedSedimentSink(sinkSand + sinkDirt)
  );
  soilOut.values[index] = SoilCell(
    clamp(sourceSoil.dirtDepth, 0.0, stateIn.values[index].y),
    max(0.0, sourceSoil.suspendedSand + incomingSand - outgoingSand),
    max(0.0, sourceSoil.suspendedDirt + incomingDirt - outgoingDirt),
    clamp(sourceSoil.compaction, 0.0, 1.0)
  );
}
`,Ht=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> stateIn: StateBuffer;
@group(0) @binding(2) var<storage, read> waterFlux: StateBuffer;
@group(0) @binding(3) var<storage, read> soilIn: SoilBuffer;
@group(0) @binding(4) var<storage, read> erosionMemoryIn: ScalarBuffer;
@group(0) @binding(5) var<storage, read> vegetation: ScalarBuffer;

struct WaterTileStateBuffer { values: array<vec4u>, }
@group(0) @binding(6) var<storage, read> tileState: WaterTileStateBuffer;
@group(0) @binding(7) var<storage, read_write> stateOut: StateBuffer;
@group(0) @binding(8) var<storage, read_write> soilOut: SoilBuffer;
@group(0) @binding(9) var<storage, read_write> erosionMemoryOut: ScalarBuffer;
@group(0) @binding(10) var<storage, read_write> wallEdges: WallEdgeBuffer;

const WATER_TILE_SIZE: u32 = 8u;
const EROSION_PASS_INTERVAL_TICKS: u32 = 3u;
const MAX_EROSION_DEPTH_PER_PASS: f32 = 0.008;
const MAX_EROSION_FRACTION_PER_PASS: f32 = 0.035;
const MAX_DEBUG_EROSION_DEPTH_PER_PASS: f32 = 0.045;
const MAX_DEBUG_EROSION_FRACTION_PER_PASS: f32 = 0.18;
const MINIMUM_EROSIVE_DEPTH: f32 = 0.004;
const EROSION_MEMORY_THRESHOLD: f32 = 0.00018;
const EROSION_IDLE_DECAY_SECONDS: f32 = 14.0;

fn insideErosionCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

fn erosionTileFlags(p: vec2i, n: i32) -> vec4u {
  let tileCount = (n + i32(WATER_TILE_SIZE) - 1) / i32(WATER_TILE_SIZE);
  let safePosition = clamp(p, vec2i(0), vec2i(n - 1));
  let tile = safePosition / i32(WATER_TILE_SIZE);
  return tileState.values[u32(tile.y * tileCount + tile.x)];
}

fn erosionActiveCore(p: vec2i, n: i32) -> bool {
  return erosionTileFlags(p, n).x == 1u;
}

fn virtualOceanSpongeCell(p: vec2i, n: i32) -> bool {
  // Tile state 2 is assigned only after the bounded scheduler has confirmed a
  // broadOcean exterior component, so a second connectivity buffer is redundant.
  // Omitting it keeps this pass within the common 10-storage-buffer limit.
  return erosionTileFlags(p, n).x == 2u;
}
`+zt+String.raw`
@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) { return; }
  let index = gridIndex(gid.x, gid.y);
  let position = vec2i(gid.xy);
  let ni = i32(n);
  let value = stateIn.values[index];
  let soilValue = soilIn.values[index];

  // Inactive and sleeping tiles return before any neighbor read. Verified
  // virtual-ocean sponge cells additionally fade memory without touching bed.
  if (!erosionActiveCore(position, ni)) {
    stateOut.values[index] = value;
    soilOut.values[index] = soilValue;
    erosionMemoryOut.values[index] = erosionMemoryIn.values[index];
    return;
  }
  if (virtualOceanSpongeCell(position, ni)) {
    stateOut.values[index] = value;
    soilOut.values[index] = soilValue;
    erosionMemoryOut.values[index] = max(
      0.0,
      erosionMemoryIn.values[index] - uniforms.grid.z * 0.12
    );
    return;
  }

  let cellSize = max(uniforms.grid.y, 0.0001);
  let left = terrainAt(&stateIn, position + vec2i(-1, 0));
  let right = terrainAt(&stateIn, position + vec2i(1, 0));
  let down = terrainAt(&stateIn, position + vec2i(0, -1));
  let up = terrainAt(&stateIn, position + vec2i(0, 1));
  let terrainGradient = vec2f(right - left, up - down) / (2.0 * cellSize);
  let physicalFlux = waterFlux.values[index];
  let discharge = max(0.0, physicalFlux.x);
  let flowVector = physicalFlux.zw;
  let flowMagnitude = length(flowVector);
  let hasDirection = flowMagnitude > 0.00008;
  let flowDirection = select(
    vec2f(0.0),
    flowVector / max(flowMagnitude, 0.0001),
    hasDirection
  );
  let downstreamSlope = select(
    0.0,
    max(0.0, dot(-terrainGradient, flowDirection)),
    hasDirection
  );

  var incomingWater = 0.0;
  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      if (ox == 0 && oy == 0) { continue; }
      let neighbor = position + vec2i(ox, oy);
      if (insideErosionCell(neighbor, ni) && erosionTileFlags(neighbor, ni).w != 0u) {
        let neighborCell = vec2u(neighbor);
        let neighborIndex = gridIndex(neighborCell.x, neighborCell.y);
        incomingWater = incomingWater
          + rawWaterTransfer(neighbor, position) * waterFlux.values[neighborIndex].y;
      }
    }
  }
  let convergence = clamp(
    (incomingWater - physicalFlux.x) / max(incomingWater + physicalFlux.x, 0.001),
    -1.0,
    1.0
  );
  let convergenceFactor = smoothstep(0.02, 0.65, convergence);
  let depthAccess = 1.0 / (1.0 + value.z * 1.65);
  let stress = select(
    0.0,
    pow(discharge, 0.74)
      * pow(downstreamSlope + 0.0008, 0.82)
      * depthAccess
      * mix(1.0, 1.55, convergenceFactor),
    hasDirection && value.z > MINIMUM_EROSIVE_DEPTH
  );
  let erosionDt = min(
    0.25,
    uniforms.grid.z * f32(EROSION_PASS_INTERVAL_TICKS)
  );
  let previousMemory = max(0.0, erosionMemoryIn.values[index]);
  let erosionStrength = clamp(uniforms.pad1.w, 0.0, 20.0);
  let sustainedFlow = stress > EROSION_MEMORY_THRESHOLD * 0.45;
  let responseSeconds = mix(
    1.55,
    0.16,
    smoothstep(1.0, 20.0, erosionStrength)
  );
  let memoryResponse = 1.0 - exp(-erosionDt / responseSeconds);
  // Active stress rises over ~1.5s; idle memory decays on a separate 14s
  // timescale. A transient splash therefore cannot both create and consume a
  // full erosion capacity in its first reduced-frequency tick.
  var sustainedErosionMemory = select(
    previousMemory * exp(-erosionDt / EROSION_IDLE_DECAY_SECONDS),
    mix(previousMemory, stress, memoryResponse),
    sustainedFlow
  );
  let effectiveErosionMemory = max(
    0.0,
    sustainedErosionMemory - EROSION_MEMORY_THRESHOLD
  ) * erosionStrength;

  let uv = vec2f(gid.xy) / f32(n - 1u);
  let worldXZ = (uv - vec2f(0.5)) * uniforms.world.x;
  let warp = vec2f(
    gradientNoise2(worldXZ * 0.027 + vec2f(3.1, -7.2)),
    gradientNoise2(worldXZ.yx * 0.024 + vec2f(-5.8, 11.0))
  );
  let substrateVariation = 1.0
    + gradientNoise2(worldXZ * 0.11 + warp * 0.8 + vec2f(17.0, -4.0)) * 0.08;
  let dirtDepth = clamp(soilValue.dirtDepth, 0.0, value.y);
  let sandDepth = max(0.0, value.y - dirtDepth);
  let rootProtection = clamp(vegetation.values[index] * 0.72, 0.0, 0.72);
  let compactionProtection = mix(0.72, 2.8, clamp(soilValue.compaction, 0.0, 1.0));
  let sandCapacity = 0.36
    * effectiveErosionMemory
    * substrateVariation
    * (1.0 - rootProtection * 0.38);
  let dirtCapacity = 0.19
    * effectiveErosionMemory
    * substrateVariation
    * (1.0 - rootProtection)
    / max(compactionProtection, 0.01);

  let debugErosionMix = smoothstep(1.0, 20.0, erosionStrength);
  let erosionPassCap = mix(
    MAX_EROSION_DEPTH_PER_PASS,
    MAX_DEBUG_EROSION_DEPTH_PER_PASS,
    debugErosionMix
  );
  let erosionFractionCap = mix(
    MAX_EROSION_FRACTION_PER_PASS,
    MAX_DEBUG_EROSION_FRACTION_PER_PASS,
    debugErosionMix
  );

  let sandDeficit = max(0.0, sandCapacity - soilValue.suspendedSand);
  let dirtDeficit = max(0.0, dirtCapacity - soilValue.suspendedDirt);
  let sandErosionCap = min(
    erosionPassCap,
    sandDepth * erosionFractionCap
  );
  let dirtErosionCap = min(
    erosionPassCap * 0.65,
    dirtDepth * erosionFractionCap
  );
  var erodedSand = min(
    sandErosionCap,
    sandDeficit * erosionDt * 0.62
  );
  var erodedDirt = min(
    dirtErosionCap,
    dirtDeficit * erosionDt * 0.34
  );
  let requestedErosion = erodedSand + erodedDirt;
  let totalErosionScale = select(
    1.0,
    min(1.0, erosionPassCap / requestedErosion),
    requestedErosion > 0.000001
  );
  erodedSand = erodedSand * totalErosionScale;
  erodedDirt = erodedDirt * totalErosionScale;

  let speedProxy = flowMagnitude / max(value.z, MINIMUM_EROSIVE_DEPTH);
  let settling = 1.0 - smoothstep(0.018, 0.24, speedProxy);
  let sandExcess = max(0.0, soilValue.suspendedSand - sandCapacity);
  let dirtExcess = max(0.0, soilValue.suspendedDirt - dirtCapacity);
  var depositedSand = min(
    min(erosionPassCap, soilValue.suspendedSand * 0.05),
    sandExcess * erosionDt * mix(0.18, 1.25, settling)
  );
  var depositedDirt = min(
    min(erosionPassCap * 0.75, soilValue.suspendedDirt * 0.04),
    dirtExcess * erosionDt * mix(0.08, 0.68, settling)
  );
  let requestedAbsoluteDeposit = depositedSand + depositedDirt;
  let totalDepositCapScale = select(
    1.0,
    min(1.0, erosionPassCap / requestedAbsoluteDeposit),
    requestedAbsoluteDeposit > 0.000001
  );
  depositedSand = depositedSand * totalDepositCapScale;
  depositedDirt = depositedDirt * totalDepositCapScale;
  let wetThreshold = MINIMUM_EROSIVE_DEPTH;
  let meaningfulWater = value.z > wetThreshold;
  let isWet = meaningfulWater;
  let totalRequestedDeposit = depositedSand + depositedDirt;
  let wetDepositScale = select(
    1.0,
    min(1.0, max(0.0, value.z - 0.0005) / max(totalRequestedDeposit, 0.000001)),
    isWet && totalRequestedDeposit > 0.0
  );
  depositedSand = depositedSand * wetDepositScale;
  depositedDirt = depositedDirt * wetDepositScale;

  let totalEroded = erodedSand + erodedDirt;
  let totalDeposit = depositedSand + depositedDirt;
  var waterDepth = value.z;
  if (isWet) {
    // Mandatory water-surface invariant: lower bed creates equal physical
    // depth; raised bed displaces the same amount without launching a wave.
    waterDepth = waterDepth + totalEroded;
    waterDepth = max(0.0, waterDepth - totalDeposit);
  }
  let movableDepth = max(0.0, value.y - totalEroded + totalDeposit);
  let nextDirtDepth = clamp(
    dirtDepth - erodedDirt + depositedDirt,
    0.0,
    movableDepth
  );
  let disturbance = clamp((totalEroded + totalDeposit) / 0.008, 0.0, 1.0);
  let stableDrying = (1.0 - smoothstep(0.18, 0.75, value.w))
    * (1.0 - smoothstep(0.0002, 0.004, physicalFlux.x));
  let consolidated = min(
    1.0,
    soilValue.compaction + erosionDt * 0.006 * stableDrying
  );
  let nextCompaction = mix(consolidated, 0.14, disturbance * 0.34);

  // value.x is copied byte-for-byte: hydraulic erosion never edits rock.
  stateOut.values[index] = vec4f(
    value.x,
    movableDepth,
    max(0.0, waterDepth),
    value.w
  );
  soilOut.values[index] = SoilCell(
    nextDirtDepth,
    max(0.0, soilValue.suspendedSand + erodedSand - depositedSand),
    max(0.0, soilValue.suspendedDirt + erodedDirt - depositedDirt),
    clamp(nextCompaction, 0.0, 1.0)
  );
  erosionMemoryOut.values[index] = max(0.0, sustainedErosionMemory);
}
`,Ut=String.raw`
fn insideDirtCell(p: vec2i, n: i32) -> bool {
  return p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
}

fn dirtTileFlags(p: vec2i, n: i32) -> vec4u {
  let tileCount = (n + i32(WATER_TILE_SIZE) - 1) / i32(WATER_TILE_SIZE);
  let safePosition = clamp(p, vec2i(0), vec2i(n - 1));
  let tile = safePosition / i32(WATER_TILE_SIZE);
  return tileState.values[u32(tile.y * tileCount + tile.x)];
}

fn dirtSolverCell(p: vec2i, n: i32) -> bool {
  return dirtTileFlags(p, n).w != 0u;
}

fn dirtCollapseActiveCore(p: vec2i, n: i32) -> bool {
  let flags = dirtTileFlags(p, n);
  let cell = vec2u(clamp(p, vec2i(0), vec2i(n - 1)));
  let connectivity = stableConnectivity.values[gridIndex(cell.x, cell.y)];
  let virtualOceanSponge = flags.x == 2u && connectivity.y != 0u;
  return flags.x == 1u && !virtualOceanSponge;
}

fn rawDirtTransfer(source: vec2i, destination: vec2i) -> f32 {
  let n = i32(gridSize());
  if (
    !insideDirtCell(source, n)
    || !insideDirtCell(destination, n)
    || !dirtCollapseActiveCore(source, n)
    || !dirtSolverCell(destination, n)
  ) {
    return 0.0;
  }
  let sourceCell = vec2u(source);
  let destinationCell = vec2u(destination);
  let sourceIndex = gridIndex(sourceCell.x, sourceCell.y);
  let destinationIndex = gridIndex(destinationCell.x, destinationCell.y);
  let sourceState = stateIn.values[sourceIndex];
  let destinationState = stateIn.values[destinationIndex];
  let sourceSoil = soilIn.values[sourceIndex];
  let availableDirt = clamp(sourceSoil.dirtDepth, 0.0, sourceState.y);
  if (availableDirt <= 0.0001) {
    return 0.0;
  }

  let sourceHeight = sourceState.x + sourceState.y;
  let destinationHeight = destinationState.x + destinationState.y;
  let heightDifference = sourceHeight - destinationHeight;
  let cellDistance = length(vec2f(destination - source)) * uniforms.grid.y;
  let compaction = clamp(sourceSoil.compaction, 0.0, 1.0);
  // Only hand-poured dirt receives near-zero compaction. Excavated faces are
  // left at the existing 0.1 floor, so this narrow band gives deposits a
  // sand-like first slump without softening rooted or merely cut ground.
  let freshDeposit = 1.0 - smoothstep(0.025, 0.085, compaction);
  let moisture = clamp(max(sourceState.w, sourceState.z * 0.75), 0.0, 1.0);
  let vegetationCover = clamp(vegetation.values[sourceIndex], 0.0, 1.0);
  let dampStrength = smoothstep(0.08, 0.38, moisture)
    * (1.0 - smoothstep(0.42, 0.78, moisture));
  let saturationWeakening = smoothstep(0.58, 0.94, moisture);
  let rootStabilization = vegetationCover * 0.72;
  let effectiveReposeDegrees = clamp(
    mix(34.0, 50.0, compaction)
      + dampStrength * 4.0
      + rootStabilization * 9.0
      - freshDeposit * 6.0
      - saturationWeakening * 12.0,
    27.0,
    60.0
  );
  let cohesionHead = max(
    0.04,
    0.1
      + compaction * 0.34
      + dampStrength * 0.17
      + rootStabilization * 0.38
      - freshDeposit * 0.08
      - saturationWeakening * 0.3
  );
  let edgeCenterWorld = (vec2f(source + destination) * 0.5
    / f32(gridSize() - 1u) - vec2f(0.5)) * uniforms.world.x;
  let stableThresholdVariation = 1.0
    + gradientNoise2(edgeCenterWorld * 0.12 + vec2f(7.0, -13.0)) * 0.06;
  let undercutExposure = smoothstep(0.025, 0.22, destinationState.z)
    * smoothstep(0.004, 0.08, erosionMemory.values[destinationIndex]);
  let allowedDrop = (
    cellDistance * tan(effectiveReposeDegrees * 0.01745329252)
      + cohesionHead * (1.0 - undercutExposure * 0.38)
  ) * stableThresholdVariation;
  let excess = max(0.0, heightDifference - allowedDrop);
  // Fresh bare deposits and narrow columns fail quickly; old compact rooted
  // slopes retain a much steeper stable angle. This prevents poured dirt from
  // becoming a needle without making every grassy cut behave like sand.
  let looseFailure = 1.0 - smoothstep(0.18, 0.72, compaction);
  let needleFailure = smoothstep(1.1, 3.4, heightDifference);
  let rapidFreshFailure = max(freshDeposit, needleFailure * 0.68);
  return excess
    * mix(
      mix(0.035, 0.14, max(looseFailure, needleFailure)),
      0.3,
      rapidFreshFailure
    )
    * mix(1.0, 1.65, undercutExposure);
}
`,Wt=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> stateIn: StateBuffer;
@group(0) @binding(2) var<storage, read> soilIn: SoilBuffer;
@group(0) @binding(3) var<storage, read> vegetation: ScalarBuffer;
@group(0) @binding(4) var<storage, read> erosionMemory: ScalarBuffer;
struct WaterTileStateBuffer { values: array<vec4u>, }
struct WaterConnectivityBuffer { values: array<vec4u>, }
@group(0) @binding(5) var<storage, read> tileState: WaterTileStateBuffer;
@group(0) @binding(6) var<storage, read> stableConnectivity: WaterConnectivityBuffer;
@group(0) @binding(7) var<storage, read_write> dirtFlux: DirtFluxBuffer;

const WATER_TILE_SIZE: u32 = 8u;
const DIRT_COLLAPSE_INTERVAL_TICKS: u32 = 6u;
const MAX_DIRT_COLLAPSE_FRACTION: f32 = 0.12;
const MAX_DIRT_COLLAPSE_DEPTH: f32 = 0.085;
const MAX_FRESH_DIRT_COLLAPSE_FRACTION: f32 = 0.34;
const MAX_FRESH_DIRT_COLLAPSE_DEPTH: f32 = 0.2;
// The composed cohesive edge law uses compaction, moisture, vegetation/root
// stabilization, saturation weakening, cohesion through cohesionHead, and allowedDrop. Its
// neighbor offsets cover all 8u surrounding cells before applying these caps.
`+Ut+String.raw`
@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) { return; }
  let index = gridIndex(gid.x, gid.y);
  let position = vec2i(gid.xy);
  let ni = i32(n);
  if (!dirtCollapseActiveCore(position, ni)) {
    dirtFlux.values[index] = vec4f(0.0);
    return;
  }
  // Cohesive failure still inspects all eight neighbors, but transfers only
  // excess above the moisture/compaction/root-dependent allowed drop.
  var rawOut = 0.0;
  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      if (ox == 0 && oy == 0) { continue; }
      rawOut = rawOut + rawDirtTransfer(position, position + vec2i(ox, oy));
    }
  }
  let dirtDepth = clamp(soilIn.values[index].dirtDepth, 0.0, stateIn.values[index].y);
  let freshDeposit = 1.0 - smoothstep(
    0.025,
    0.085,
    clamp(soilIn.values[index].compaction, 0.0, 1.0)
  );
  let maximumOut = min(
    mix(MAX_DIRT_COLLAPSE_DEPTH, MAX_FRESH_DIRT_COLLAPSE_DEPTH, freshDeposit),
    dirtDepth * mix(
      MAX_DIRT_COLLAPSE_FRACTION,
      MAX_FRESH_DIRT_COLLAPSE_FRACTION,
      freshDeposit
    )
  );
  let outScale = select(
    1.0,
    min(1.0, maximumOut / rawOut),
    rawOut > 0.000001
  );
  dirtFlux.values[index] = vec4f(rawOut * outScale, outScale, 0.0, 0.0);
}
`,Gt=I+Me+String.raw`
@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> stateIn: StateBuffer;
@group(0) @binding(2) var<storage, read> soilIn: SoilBuffer;
@group(0) @binding(3) var<storage, read> dirtFlux: DirtFluxBuffer;
@group(0) @binding(4) var<storage, read> vegetation: ScalarBuffer;
@group(0) @binding(5) var<storage, read> erosionMemory: ScalarBuffer;
struct WaterTileStateBuffer { values: array<vec4u>, }
struct WaterConnectivityBuffer { values: array<vec4u>, }
@group(0) @binding(6) var<storage, read> tileState: WaterTileStateBuffer;
@group(0) @binding(7) var<storage, read> stableConnectivity: WaterConnectivityBuffer;
@group(0) @binding(8) var<storage, read_write> stateOut: StateBuffer;
@group(0) @binding(9) var<storage, read_write> soilOut: SoilBuffer;

const WATER_TILE_SIZE: u32 = 8u;
const DIRT_COLLAPSE_INTERVAL_TICKS: u32 = 6u;
const MAX_DIRT_COLLAPSE_FRACTION: f32 = 0.12;
const MAX_DIRT_COLLAPSE_DEPTH: f32 = 0.085;
const MAX_FRESH_DIRT_COLLAPSE_FRACTION: f32 = 0.34;
const MAX_FRESH_DIRT_COLLAPSE_DEPTH: f32 = 0.2;
`+Ut+String.raw`
@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let n = gridSize();
  if (gid.x >= n || gid.y >= n) { return; }
  let index = gridIndex(gid.x, gid.y);
  let position = vec2i(gid.xy);
  let ni = i32(n);
  let value = stateIn.values[index];
  let soilValue = soilIn.values[index];
  if (!dirtSolverCell(position, ni)) {
    stateOut.values[index] = value;
    soilOut.values[index] = soilValue;
    return;
  }

  var incomingBedDirt = 0.0;
  var incomingSuspendedDirt = 0.0;
  for (var oy = -1; oy <= 1; oy = oy + 1) {
    for (var ox = -1; ox <= 1; ox = ox + 1) {
      if (ox == 0 && oy == 0) { continue; }
      let neighbor = position + vec2i(ox, oy);
      if (!insideDirtCell(neighbor, ni)) { continue; }
      let neighborCell = vec2u(neighbor);
      let neighborIndex = gridIndex(neighborCell.x, neighborCell.y);
      let incoming = rawDirtTransfer(neighbor, position)
        * dirtFlux.values[neighborIndex].y;
      let neighborCompaction = soilIn.values[neighborIndex].compaction;
      let suspensionFraction = smoothstep(0.018, 0.26, value.z)
        * mix(0.34, 0.12, clamp(neighborCompaction, 0.0, 1.0));
      incomingBedDirt = incomingBedDirt + incoming * (1.0 - suspensionFraction);
      incomingSuspendedDirt = incomingSuspendedDirt + incoming * suspensionFraction;
    }
  }
  let outgoingDirt = dirtFlux.values[index].x;
  let bedDelta = incomingBedDirt - outgoingDirt;
  let movableDepth = max(0.0, value.y + bedDelta);
  let dirtDepth = clamp(
    soilValue.dirtDepth + bedDelta,
    0.0,
    movableDepth
  );
  var waterDepth = value.z;
  if (value.z > 0.004) {
    waterDepth = max(0.0, waterDepth - bedDelta);
  }
  let collapseDisturbance = clamp(
    (incomingBedDirt + outgoingDirt) / MAX_FRESH_DIRT_COLLAPSE_DEPTH,
    0.0,
    1.0
  );
  stateOut.values[index] = vec4f(
    value.x,
    movableDepth,
    waterDepth,
    value.w
  );
  soilOut.values[index] = SoilCell(
    dirtDepth,
    max(0.0, soilValue.suspendedSand),
    max(0.0, soilValue.suspendedDirt + incomingSuspendedDirt),
    clamp(mix(soilValue.compaction, 0.12, collapseDisturbance * 0.46), 0.0, 1.0)
  );
}
`;String.raw`
fn soilDirtFraction(movableDepth: f32, soilValue: SoilCell) -> f32 {
  let dirtDepth = clamp(soilValue.dirtDepth, 0.0, movableDepth);
  return dirtDepth / max(movableDepth, 0.0001);
}

fn soilGroundColor(
  sandColor: vec3f,
  worldXZ: vec2f,
  moisture: f32,
  compaction: f32,
  dirtFraction: f32
) -> vec3f {
  let broad = gradientNoiseSigned(worldXZ * 0.024 + vec2f(8.2, -4.6));
  let meso = gradientNoiseSigned(
    mat2x2f(0.61, 0.79, -0.79, 0.61) * worldXZ * 0.11
      + vec2f(-17.0, 9.0)
  );
  let dryDirt = mix(
    vec3f(0.245, 0.14, 0.07),
    vec3f(0.43, 0.275, 0.12),
    clamp(0.5 + broad * 0.56 + meso * 0.23, 0.0, 1.0)
  );
  let dampDirt = vec3f(0.145, 0.105, 0.064);
  var dirtColor = mix(dryDirt, dampDirt, smoothstep(0.18, 0.74, moisture));
  dirtColor = dirtColor * (1.0 + broad * 0.13 + meso * 0.07);
  dirtColor = mix(dirtColor, dirtColor * 0.86, compaction * 0.24);
  return mix(sandColor, dirtColor, clamp(dirtFraction, 0.0, 1.0));
}
`,String.raw`
fn soilHabitatFactor(
  movableDepth: f32,
  moisture: f32,
  soilValue: SoilCell
) -> f32 {
  let dirtFraction = soilValue.dirtDepth / max(movableDepth, 0.0001);
  let substrateFactor = smoothstep(0.18, 0.62, dirtFraction)
    * smoothstep(0.12, 0.72, movableDepth);
  let compactionSuitability = mix(0.42, 1.0, soilValue.compaction);
  let moistureSuitability = smoothstep(0.04, 0.28, moisture)
    * (1.0 - smoothstep(0.72, 0.96, moisture));
  return substrateFactor * compactionSuitability * moistureSuitability;
}
`;var Kt=1953064037,qt=1,Jt=60,Yt=.48,Xt=2.4,Zt=(e,t,n)=>Math.min(n,Math.max(t,e)),Qt=(e,t)=>{try{e.stop(t)}catch{}},$t=class e{constructor(e={}){this.context=null,this.master=null,this.ambientBus=null,this.manipulationBus=null,this.flowBus=null,this.effectsBus=null,this.ambient=null,this.manipulation=null,this.flow=null,this.activeEffects=new Set,this.muted=!1,this.destroyed=!1,this.initialSeed=(e.seed??Kt)>>>0,this.randomState=this.initialSeed||Kt,this.volume=Zt(e.volume??.78,0,1),this.wantsAmbient=e.ambient??!0}static get isSupported(){if(typeof globalThis>`u`)return!1;let e=globalThis;return globalThis.AudioContext!==void 0||e.webkitAudioContext!==void 0}get isUnlocked(){return this.context!==null&&this.context.state===`running`}get isMuted(){return this.muted}get isAmbientActive(){return this.ambient!==null}get ambientLevel(){return this.ambientBus?.gain.value??0}async unlock(){if(this.destroyed||!e.isSupported)return!1;try{return this.context||this.createContext(),this.context?(this.context.state===`suspended`&&await this.context.resume(),this.wantsAmbient&&!this.ambient&&this.createAmbient(),this.context.state===`running`):!1}catch{return!1}}async resume(){return this.unlock()}async pause(){let e=this.context;if(!(!e||e.state!==`running`))try{await e.suspend()}catch{}}setMuted(e){this.muted=e,this.updateMasterLevel()}setVolume(e){this.volume=Zt(e,0,1),this.updateMasterLevel()}startAmbient(){this.wantsAmbient=!0,this.context&&!this.ambient&&this.createAmbient()}stopAmbient(){if(this.wantsAmbient=!1,!this.ambient||!this.context)return;let e=this.ambient;this.ambient=null;let t=this.context.currentTime+.04;e.sources.forEach(e=>Qt(e,t)),e.nodes.forEach(e=>e.disconnect())}startManipulation(e,t,n){let r=this.context;!r||r.state===`closed`||this.destroyed||(this.manipulation||=this.createManipulation(),this.updateManipulation({material:e,action:t,intensity:n}))}updateManipulation(e){let t=this.context,n=this.manipulation;if(!t||!n||t.state===`closed`)return;let r=t.currentTime,i=(Zt(e.intensity,qt,Jt)-1)/59,a=Math.sqrt(i),o=e.action===`gather`,s=.5;switch(e.material){case`sand`:n.textureLfo.type=`square`,n.tone.type=`triangle`,n.highpass.frequency.setTargetAtTime(o?520:340,r,.018),n.lowpass.frequency.setTargetAtTime((o?2100:1650)+a*1750,r,.025),n.lowpass.Q.setTargetAtTime(o?1.15:.68,r,.03),n.noiseGain.gain.setTargetAtTime(.018+a*.048,r,.018),n.grainFilter.frequency.setTargetAtTime(2050+a*2300,r,.022),n.grainFilter.Q.setTargetAtTime(1.4,r,.03),n.grainGain.gain.setTargetAtTime(.014+a*.038,r,.014),n.textureLfo.frequency.setTargetAtTime(17+a*22,r,.02),n.textureDepth.gain.setTargetAtTime(.006+a*.009,r,.02),n.tone.frequency.setTargetAtTime(74,r,.03),n.toneGain.gain.setTargetAtTime(35e-5,r,.015),s=.15+a*.23;break;case`water`:n.textureLfo.type=`sine`,n.tone.type=`sine`,n.highpass.frequency.setTargetAtTime(o?72:48,r,.04),n.lowpass.frequency.setTargetAtTime((o?1420:1120)+a*980,r,.055),n.lowpass.Q.setTargetAtTime(o?.18:.22,r,.055),n.noiseGain.gain.setTargetAtTime(.031+a*.064,r,.04),n.grainFilter.frequency.setTargetAtTime((o?520:410)+a*280,r,.05),n.grainFilter.Q.setTargetAtTime(.18,r,.05),n.grainGain.gain.setTargetAtTime(.0015+a*.0045,r,.04),n.textureLfo.frequency.setTargetAtTime(.72+a*.78,r,.055),n.textureDepth.gain.setTargetAtTime(.013+a*.014,r,.055),n.tone.frequency.setTargetAtTime(82,r,.03),n.toneGain.gain.setTargetAtTime(1e-4,r,.012),s=.17+a*.27;break;case`lava`:n.textureLfo.type=`sawtooth`,n.tone.type=`triangle`,n.highpass.frequency.setTargetAtTime(32,r,.025),n.lowpass.frequency.setTargetAtTime((o?520:390)+a*470,r,.035),n.lowpass.Q.setTargetAtTime(1.25,r,.035),n.noiseGain.gain.setTargetAtTime(.022+a*.058,r,.022),n.grainFilter.frequency.setTargetAtTime(720+a*1250,r,.018),n.grainFilter.Q.setTargetAtTime(.95,r,.025),n.grainGain.gain.setTargetAtTime(.012+a*.04,r,.012),n.textureLfo.frequency.setTargetAtTime(7+a*11,r,.02),n.textureDepth.gain.setTargetAtTime(.009+a*.012,r,.02),n.tone.frequency.setTargetAtTime((o?47:36)+a*13,r,.035),n.toneGain.gain.setTargetAtTime(.008+a*.018,r,.028),s=.19+a*.28;break;case`oil`:n.textureLfo.type=`sine`,n.tone.type=`sine`,n.highpass.frequency.setTargetAtTime(24,r,.035),n.lowpass.frequency.setTargetAtTime((o?360:270)+a*310,r,.045),n.lowpass.Q.setTargetAtTime(o?2.4:3.5,r,.045),n.noiseGain.gain.setTargetAtTime(.016+a*.032,r,.035),n.grainFilter.frequency.setTargetAtTime(280+a*440,r,.04),n.grainFilter.Q.setTargetAtTime(2.7,r,.04),n.grainGain.gain.setTargetAtTime(.005+a*.012,r,.03),n.textureLfo.frequency.setTargetAtTime(1.7+a*2.4,r,.04),n.textureDepth.gain.setTargetAtTime(.003+a*.0045,r,.04),n.tone.frequency.setTargetAtTime((o?58:43)+a*11,r,.05),n.toneGain.gain.setTargetAtTime(.004+a*.009,r,.04),s=.15+a*.24}n.envelope.gain.cancelScheduledValues(r),n.envelope.gain.setTargetAtTime(s,r,.018)}stopManipulation(e=.11){let t=this.context,n=this.manipulation;if(!t||!n)return;this.manipulation=null;let r=t.currentTime,i=Zt(e,.02,1);n.envelope.gain.cancelScheduledValues(r),n.envelope.gain.setTargetAtTime(1e-4,r,i*.22),n.sources.forEach(e=>Qt(e,r+i+.04)),n.sources[0]?.addEventListener(`ended`,()=>n.nodes.forEach(e=>e.disconnect()),{once:!0})}playHandDump(e,t){let n=this.context;if(!n||n.state===`closed`||this.destroyed||t<=0)return;let r=Math.sqrt(Zt(t/140,.012,1)),i=.62+r*1.38,a=n.currentTime,o=n.createBufferSource();o.buffer=this.createNoiseBuffer(i+.05,e===`water`?.76:e===`sand`?.08:.27);let s=n.createBiquadFilter();s.type=`highpass`;let c=n.createBiquadFilter();c.type=`lowpass`;let l=n.createGain(),u=80,d=1700,f=360,p=.025+r*.055;e===`water`?(u=46,d=2250,f=430,p=.035+r*.078):e===`lava`?(u=38,d=1120,f=210,p=.033+r*.065):e===`oil`&&(u=28,d=760,f=145,p=.026+r*.052),s.frequency.value=u,c.frequency.setValueAtTime(d,a),c.frequency.exponentialRampToValueAtTime(f,a+i),c.Q.value=e===`oil`?1.2:e===`water`?.24:.42,l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(p,a+Math.min(.22,i*.18)),e===`water`?(l.gain.exponentialRampToValueAtTime(p*.58,a+i*.34),l.gain.exponentialRampToValueAtTime(p*.9,a+i*.5),l.gain.exponentialRampToValueAtTime(p*.5,a+i*.69),l.gain.exponentialRampToValueAtTime(p*.72,a+i*.79)):l.gain.setValueAtTime(p*.82,a+i*.62),l.gain.exponentialRampToValueAtTime(1e-4,a+i),o.connect(s).connect(c).connect(l).connect(this.effectsBus),this.trackEffect(o),o.addEventListener(`ended`,()=>{s.disconnect(),c.disconnect(),l.disconnect()},{once:!0}),o.start(a),o.stop(a+i+.02)}updateFlow(e){let t=this.context;if(!t||t.state===`closed`||this.destroyed)return;let n=Zt(e.water,0,1),r=Zt(e.lava,0,1),i=Zt(e.oil,0,1),a=Zt(e.fire??0,0,1),o=Zt(e.proximity,0,1)**1.35;if(Math.max(n,r,i,a)*o<.001){this.stopFlow();return}this.flow||=this.createFlow();let s=this.flow,c=t.currentTime;s.waterGain.gain.setTargetAtTime(Math.max(1e-4,Math.sqrt(n)*o*.022),c,.12),s.lavaGain.gain.setTargetAtTime(Math.max(1e-4,Math.sqrt(r)*o*.031),c,.14),s.oilGain.gain.setTargetAtTime(Math.max(1e-4,Math.sqrt(i)*o*.024),c,.16),s.fireGain.gain.setTargetAtTime(Math.max(1e-4,Math.sqrt(a)*o*.027),c,.1),s.envelope.gain.setTargetAtTime(1,c,.18)}stopFlow(e=.36){let t=this.context,n=this.flow;if(!t||!n)return;this.flow=null;let r=t.currentTime,i=Zt(e,.04,2);n.envelope.gain.cancelScheduledValues(r),n.envelope.gain.setTargetAtTime(1e-4,r,i*.28);let a=r+i+.08;n.sources.forEach(e=>Qt(e,a)),n.sources[0]?.addEventListener(`ended`,()=>n.nodes.forEach(e=>e.disconnect()),{once:!0})}playNpcDeath(){let e=this.context;if(!e||e.state===`closed`||this.destroyed)return;let t=e.currentTime,n=e.createOscillator();n.type=`sawtooth`,n.frequency.setValueAtTime(168+this.random()*25,t),n.frequency.exponentialRampToValueAtTime(96,t+.3),n.frequency.exponentialRampToValueAtTime(69,t+.58);let r=e.createOscillator();r.type=`sine`,r.frequency.value=5.7+this.random()*.8;let i=e.createGain();i.gain.setValueAtTime(3.5,t),i.gain.linearRampToValueAtTime(8.5,t+.32),r.connect(i).connect(n.frequency);let a=e.createBiquadFilter();a.type=`bandpass`,a.frequency.setValueAtTime(720,t),a.frequency.exponentialRampToValueAtTime(470,t+.52),a.Q.value=4.8;let o=e.createGain();o.gain.value=.72;let s=e.createBiquadFilter();s.type=`bandpass`,s.frequency.setValueAtTime(1190,t),s.frequency.exponentialRampToValueAtTime(830,t+.52),s.Q.value=6.2;let c=e.createGain();c.gain.value=.4;let l=e.createGain();l.gain.setValueAtTime(1e-4,t),l.gain.exponentialRampToValueAtTime(.082,t+.022),l.gain.linearRampToValueAtTime(.062,t+.23),l.gain.exponentialRampToValueAtTime(1e-4,t+.61),n.connect(a).connect(o).connect(l),n.connect(s).connect(c).connect(l),l.connect(this.effectsBus);let u=e.createBufferSource();u.buffer=this.createNoiseBuffer(.55,.16);let d=e.createBiquadFilter();d.type=`bandpass`,d.frequency.setValueAtTime(1120,t),d.frequency.exponentialRampToValueAtTime(610,t+.5),d.Q.value=.82;let f=e.createGain();f.gain.setValueAtTime(1e-4,t),f.gain.exponentialRampToValueAtTime(.034,t+.035),f.gain.exponentialRampToValueAtTime(1e-4,t+.55),u.connect(d).connect(f).connect(this.effectsBus);let p=e.createBufferSource();p.buffer=this.createNoiseBuffer(.34,.22);let m=e.createBiquadFilter();m.type=`bandpass`,m.frequency.value=1050,m.Q.value=.75;let h=e.createGain();h.gain.setValueAtTime(.07,t),h.gain.exponentialRampToValueAtTime(1e-4,t+.34),p.connect(m).connect(h).connect(this.effectsBus),this.trackEffect(n),this.trackEffect(r),this.trackEffect(u),this.trackEffect(p),n.start(t),n.stop(t+.63),r.start(t),r.stop(t+.63),u.start(t),u.stop(t+.56),p.start(t),p.stop(t+.35)}playHutCollapse(){let e=this.context;if(!e||e.state===`closed`||this.destroyed)return;let t=e.currentTime,n=e.createBufferSource();n.buffer=this.createNoiseBuffer(1.72,.82);let r=e.createBiquadFilter();r.type=`lowpass`,r.frequency.setValueAtTime(1180,t),r.frequency.exponentialRampToValueAtTime(145,t+1.66),r.Q.value=.48;let i=e.createGain();i.gain.setValueAtTime(1e-4,t),i.gain.linearRampToValueAtTime(.058,t+.11),i.gain.linearRampToValueAtTime(.088,t+.43),i.gain.exponentialRampToValueAtTime(1e-4,t+1.68),n.connect(r).connect(i).connect(this.effectsBus);let a=e.createOscillator();a.type=`triangle`,a.frequency.setValueAtTime(62,t+.14),a.frequency.exponentialRampToValueAtTime(27,t+.9);let o=e.createGain();o.gain.setValueAtTime(1e-4,t),o.gain.setValueAtTime(1e-4,t+.14),o.gain.linearRampToValueAtTime(.055,t+.25),o.gain.exponentialRampToValueAtTime(1e-4,t+.94),a.connect(o).connect(this.effectsBus),this.trackEffect(n),this.trackEffect(a),n.start(t),n.stop(t+1.74),a.start(t+.14),a.stop(t+.96);for(let n=0;n<7;n+=1){let r=.16+n*.17+this.random()*.08,i=e.createBufferSource();i.buffer=this.createNoiseBuffer(.12,.2);let a=e.createBiquadFilter();a.type=`bandpass`,a.frequency.value=430+this.random()*880,a.Q.value=1.35;let o=e.createGain();o.gain.setValueAtTime(1e-4,t+r),o.gain.linearRampToValueAtTime(.024+this.random()*.018,t+r+.018),o.gain.exponentialRampToValueAtTime(1e-4,t+r+.12),i.connect(a).connect(o).connect(this.effectsBus),this.trackEffect(i),i.start(t+r),i.stop(t+r+.125)}}playOilExplosion(e=1){let t=this.context;if(!t||t.state===`closed`||this.destroyed)return;let n=Zt(e,.2,1.5),r=t.currentTime,i=t.createOscillator();i.type=`triangle`,i.frequency.setValueAtTime(58,r),i.frequency.exponentialRampToValueAtTime(20,r+.96);let a=t.createGain();a.gain.setValueAtTime(1e-4,r),a.gain.exponentialRampToValueAtTime(.34*n,r+.022),a.gain.exponentialRampToValueAtTime(1e-4,r+1.02),i.connect(a).connect(this.effectsBus);let o=t.createOscillator();o.type=`sine`,o.frequency.setValueAtTime(36,r),o.frequency.exponentialRampToValueAtTime(18,r+1.18);let s=t.createGain();s.gain.setValueAtTime(1e-4,r),s.gain.exponentialRampToValueAtTime(.25*n,r+.035),s.gain.exponentialRampToValueAtTime(1e-4,r+1.22),o.connect(s).connect(this.effectsBus);let c=t.createBufferSource();c.buffer=this.createNoiseBuffer(1.48,.42);let l=t.createBiquadFilter();l.type=`lowpass`,l.frequency.setValueAtTime(880,r),l.frequency.exponentialRampToValueAtTime(105,r+1.34),l.Q.value=.42;let u=t.createGain();u.gain.setValueAtTime(1e-4,r),u.gain.exponentialRampToValueAtTime(.24*n,r+.026),u.gain.exponentialRampToValueAtTime(1e-4,r+1.42),c.connect(l).connect(u).connect(this.effectsBus);let d=t.createBufferSource();d.buffer=this.createNoiseBuffer(1.92,.38);let f=t.createBiquadFilter();f.type=`bandpass`,f.frequency.setValueAtTime(1550,r),f.frequency.exponentialRampToValueAtTime(390,r+1.78),f.Q.value=.72;let p=t.createGain();p.gain.setValueAtTime(1e-4,r),p.gain.exponentialRampToValueAtTime(.095*n,r+.06),p.gain.exponentialRampToValueAtTime(1e-4,r+1.88),d.connect(f).connect(p).connect(this.effectsBus),this.trackEffect(i),this.trackEffect(o),this.trackEffect(c),this.trackEffect(d),i.start(r),i.stop(r+1.04),o.start(r),o.stop(r+1.24),c.start(r),c.stop(r+1.46),d.start(r+.015),d.stop(r+1.94)}playExplosion(e=1){this.playOilExplosion(e)}playFireIgnition(e=1){this.playFireGesture(e,!1)}playHutIgnite(e=1){this.playFireGesture(e,!0)}destroy(){if(this.destroyed)return;this.destroyed=!0,this.stopManipulation(.02),this.stopFlow(.04),this.stopAmbient(),this.activeEffects.forEach(e=>Qt(e)),this.activeEffects.clear();let e=this.context;this.master?.disconnect(),this.ambientBus?.disconnect(),this.manipulationBus?.disconnect(),this.flowBus?.disconnect(),this.effectsBus?.disconnect(),this.master=null,this.ambientBus=null,this.manipulationBus=null,this.flowBus=null,this.effectsBus=null,this.context=null,e&&e.state!==`closed`&&e.close().catch(()=>void 0)}playFireGesture(e,t){let n=this.context;if(!n||n.state===`closed`||this.destroyed)return;let r=Zt(e,.15,1.5),i=n.currentTime,a=n.createBufferSource();a.buffer=this.createNoiseBuffer(1.08,.24);let o=n.createBiquadFilter();o.type=`highpass`,o.frequency.value=t?95:150;let s=n.createBiquadFilter();s.type=`lowpass`,s.frequency.setValueAtTime(620,i),s.frequency.exponentialRampToValueAtTime(2850,i+.17),s.frequency.exponentialRampToValueAtTime(520,i+1.02);let c=n.createGain();c.gain.setValueAtTime(1e-4,i),c.gain.exponentialRampToValueAtTime((t?.13:.16)*r,i+.055),c.gain.exponentialRampToValueAtTime(1e-4,i+1.06),a.connect(o).connect(s).connect(c).connect(this.effectsBus),this.trackEffect(a),a.start(i),a.stop(i+1.09);let l=t?7:4;for(let e=0;e<l;e+=1){let a=.045+e*.115+this.random()*.085,o=n.createBufferSource();o.buffer=this.createNoiseBuffer(t?.085:.055,t?.07:.025);let s=n.createBiquadFilter();s.type=`bandpass`,s.frequency.value=(t?620:1250)+this.random()*(t?1050:2400),s.Q.value=t?1.7:2.5;let c=n.createGain();c.gain.setValueAtTime((t?.075:.045)*r,i+a),c.gain.exponentialRampToValueAtTime(1e-4,i+a+(t?.082:.052)),o.connect(s).connect(c).connect(this.effectsBus),this.trackEffect(o),o.start(i+a),o.stop(i+a+(t?.088:.058))}}createContext(){let e=globalThis,t=globalThis.AudioContext===void 0?e.webkitAudioContext:globalThis.AudioContext;if(!t)return;let n=new t,r=n.createGain(),i=n.createGain(),a=n.createGain(),o=n.createGain(),s=n.createGain(),c=n.createDynamicsCompressor();i.gain.value=1e-4,a.gain.value=.72,o.gain.value=.42,s.gain.value=.78,c.threshold.value=-10,c.knee.value=12,c.ratio.value=8,c.attack.value=.004,c.release.value=.18,i.connect(r),a.connect(r),o.connect(r),s.connect(r),r.connect(c).connect(n.destination),this.context=n,this.master=r,this.ambientBus=i,this.manipulationBus=a,this.flowBus=o,this.effectsBus=s,this.updateMasterLevel()}updateMasterLevel(){if(!this.context||!this.master)return;let e=this.context.currentTime,t=this.muted?1e-4:Math.max(1e-4,this.volume);this.master.gain.cancelScheduledValues(e),this.master.gain.setTargetAtTime(t,e,.018)}createAmbient(){let e=this.context;if(!e||!this.ambientBus||this.destroyed)return;let t=e.currentTime;this.ambientBus.gain.cancelScheduledValues(t),this.ambientBus.gain.setValueAtTime(1e-4,t),this.ambientBus.gain.linearRampToValueAtTime(Yt,t+Xt);let n=[],r=[],i=e.createBufferSource();i.buffer=this.createNoiseBuffer(4.1,.58),i.loop=!0;let a=e.createBiquadFilter();a.type=`highpass`,a.frequency.value=75;let o=e.createBiquadFilter();o.type=`lowpass`,o.frequency.value=720;let s=e.createGain();s.gain.value=.028;let c=e.createOscillator();c.type=`sine`,c.frequency.value=.071;let l=e.createGain();l.gain.value=.011,i.connect(a).connect(o).connect(s).connect(this.ambientBus),c.connect(l).connect(s.gain);let u=e.createBufferSource();u.buffer=this.createNoiseBuffer(3.7,.38),u.loop=!0;let d=e.createBiquadFilter();d.type=`bandpass`,d.frequency.value=690,d.Q.value=.62;let f=e.createGain();f.gain.value=.017;let p=e.createOscillator();p.type=`sine`,p.frequency.value=.137;let m=e.createGain();m.gain.value=255,u.connect(d).connect(f).connect(this.ambientBus),p.connect(m).connect(d.frequency);let h=e.createOscillator();h.type=`sine`,h.frequency.value=71;let g=e.createGain();g.gain.value=.0035;let _=e.createOscillator();_.type=`sine`,_.frequency.value=.19;let v=e.createGain();v.gain.value=8,h.connect(g).connect(this.ambientBus),_.connect(v).connect(h.frequency),n.push(i,a,o,s,c,l,u,d,f,p,m,h,g,_,v),r.push(i,c,u,p,h,_),r.forEach(e=>e.start(t)),this.ambient={nodes:n,sources:r}}createManipulation(){let e=this.context,t=this.manipulationBus,n=e.currentTime,r=e.createBufferSource();r.buffer=this.createNoiseBuffer(1.85,.46),r.loop=!0;let i=e.createBiquadFilter();i.type=`highpass`;let a=e.createBiquadFilter();a.type=`lowpass`;let o=e.createGain();o.gain.value=1e-4;let s=e.createBufferSource();s.buffer=this.createNoiseBuffer(2.21,.075),s.loop=!0;let c=e.createBiquadFilter();c.type=`bandpass`;let l=e.createGain();l.gain.value=1e-4;let u=e.createOscillator();u.type=`triangle`;let d=e.createGain();d.gain.value=1e-4;let f=e.createOscillator();f.type=`sine`,f.frequency.value=1;let p=e.createGain();p.gain.value=1e-4;let m=e.createGain();return m.gain.value=1e-4,r.connect(i).connect(a).connect(o).connect(m),s.connect(c).connect(l).connect(m),u.connect(d).connect(m),f.connect(p).connect(o.gain),m.connect(t),r.start(n),s.start(n),u.start(n),f.start(n),{nodes:[r,i,a,o,s,c,l,u,d,f,p,m],sources:[r,s,u,f],envelope:m,noiseGain:o,grainGain:l,grainFilter:c,lowpass:a,highpass:i,tone:u,toneGain:d,textureLfo:f,textureDepth:p}}createFlow(){let e=this.context,t=this.flowBus,n=e.currentTime,r=e.createGain();r.gain.value=1e-4;let i=e.createBufferSource();i.buffer=this.createNoiseBuffer(3.17,.38),i.loop=!0,i.playbackRate.value=1.12;let a=e.createBiquadFilter();a.type=`highpass`,a.frequency.value=140;let o=e.createBiquadFilter();o.type=`bandpass`,o.frequency.value=920,o.Q.value=.55;let s=e.createGain();s.gain.value=1e-4,i.connect(a).connect(o).connect(s).connect(r);let c=e.createBufferSource();c.buffer=this.createNoiseBuffer(2.83,.055),c.loop=!0,c.playbackRate.value=.74;let l=e.createBiquadFilter();l.type=`highpass`,l.frequency.value=42;let u=e.createBiquadFilter();u.type=`lowpass`,u.frequency.value=760,u.Q.value=1.15;let d=e.createGain();d.gain.value=1e-4,c.connect(l).connect(u).connect(d).connect(r);let f=e.createBufferSource();f.buffer=this.createNoiseBuffer(3.91,.9),f.loop=!0,f.playbackRate.value=.46;let p=e.createBiquadFilter();p.type=`bandpass`,p.frequency.value=215,p.Q.value=2.8;let m=e.createGain();m.gain.value=1e-4;let h=e.createOscillator();h.type=`sine`,h.frequency.value=1.85;let g=e.createGain();g.gain.value=78,h.connect(g).connect(p.frequency),f.connect(p).connect(m).connect(r);let _=e.createBufferSource();_.buffer=this.createNoiseBuffer(2.47,.055),_.loop=!0,_.playbackRate.value=.92;let v=e.createBiquadFilter();v.type=`highpass`,v.frequency.value=680;let y=e.createBiquadFilter();y.type=`bandpass`,y.frequency.value=2250,y.Q.value=1.35;let b=e.createGain();b.gain.value=1e-4,_.connect(v).connect(y).connect(b).connect(r),r.connect(t);let x=[i,c,f,h,_];return x.forEach(e=>e.start(n)),{nodes:[r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b],sources:x,envelope:r,waterGain:s,lavaGain:d,oilGain:m,fireGain:b}}createNoiseBuffer(e,t){let n=this.context,r=Math.max(1,Math.ceil(n.sampleRate*e)),i=n.createBuffer(1,r,n.sampleRate),a=i.getChannelData(0),o=Zt(t,0,.98),s=0;for(let e=0;e<r;e+=1){let t=this.random()*2-1;s=s*o+t*(1-o),a[e]=s}return i}trackEffect(e){this.activeEffects.add(e),e.addEventListener(`ended`,()=>{this.activeEffects.delete(e),e.disconnect()},{once:!0})}random(){let e=this.randomState;return e^=e<<13,e^=e>>>17,e^=e<<5,this.randomState=e>>>0,this.randomState/4294967296}},en=`manifests/music.json`,tn=.12,nn=1836413801,rn=6e4,an=/^\/music\/[^?#]+\.(?:mp3|ogg|wav)$/i,on=(e,t,n)=>Math.min(n,Math.max(t,e)),sn=class e{constructor(e={}){this.audio=null,this.tracks=[],this.queue=[],this.failedTracks=new Set,this.preparePromise=null,this.currentTrackValue=null,this.lastTrack=null,this.cooldownTimer=null,this.cooldownStartedAt=0,this.cooldownRemainingMs=0,this.cooldownPending=!1,this.muted=!1,this.paused=!0,this.destroyed=!1,this.onEnded=()=>{this.destroyed||(this.currentTrackValue=null,this.beginCooldown())},this.onError=()=>{this.currentTrackValue&&this.failedTracks.add(this.currentTrackValue),this.currentTrackValue=null,!this.paused&&!this.destroyed&&queueMicrotask(()=>void this.playNext())},this.endpoint=e.endpoint??en,this.volume=on(e.volume??tn,0,1),this.randomState=(e.seed??nn)>>>0||nn,this.interTrackDelayMs=Math.max(0,e.interTrackDelayMs??rn)}static get isSupported(){return typeof globalThis<`u`&&globalThis.Audio!==void 0&&typeof globalThis.fetch==`function`}get isMuted(){return this.muted}get isPaused(){return this.paused}get currentTrack(){return this.currentTrackValue}get trackCount(){return this.tracks.length}prepare(t=!1){return this.destroyed||!e.isSupported?Promise.resolve([]):(!t&&this.preparePromise||(this.preparePromise=this.fetchTracks().then(e=>this.destroyed?[]:(this.tracks=e,this.failedTracks.clear(),this.queue=[],[...e]))),this.preparePromise)}async unlock(){if(this.destroyed||!e.isSupported||(this.paused=!1,(await this.prepare()).length===0||this.destroyed||this.paused))return!1;let t=this.ensureAudio();return t?this.currentTrackValue&&t.src&&!t.ended?this.tryPlay(t):this.cooldownPending?(this.scheduleCooldown(),!0):this.playNext():!1}async resume(){return this.unlock()}pause(){this.pauseCooldown(),this.paused=!0,this.audio?.pause()}async setPaused(e){return e?(this.pause(),!0):this.resume()}setMuted(e){this.muted=e,this.audio&&(this.audio.muted=e)}setVolume(e){this.volume=on(e,0,1),this.audio&&(this.audio.volume=this.volume)}destroy(){if(this.destroyed)return;this.destroyed=!0,this.paused=!0,this.clearCooldown();let e=this.audio;this.audio=null,e&&(e.pause(),e.removeEventListener(`ended`,this.onEnded),e.removeEventListener(`error`,this.onError),e.removeAttribute(`src`),e.load()),this.tracks=[],this.queue=[],this.failedTracks.clear(),this.currentTrackValue=null,this.preparePromise=null}async fetchTracks(){try{let e=await globalThis.fetch(this.endpoint,{headers:{accept:`application/json`},cache:`no-store`});if(!e.ok)return[];let t=await e.json();if(!Array.isArray(t.tracks))return[];let n=t.tracks.map(e=>this.validateTrack(e)).filter(e=>e!==null);return[...new Set(n)]}catch{return[]}}validateTrack(e){if(typeof e!=`string`||globalThis.location===void 0)return null;try{let t=new URL(this.endpoint,globalThis.location.href),n=new URL(`../`,t),r=new URL(e.replace(/^\/+/,``),n),i=r.pathname.slice(n.pathname.length);return r.origin!==globalThis.location.origin||!r.pathname.startsWith(n.pathname)||!an.test(`/${i}`)?null:r.pathname}catch{return null}}ensureAudio(){if(this.audio||globalThis.Audio===void 0)return this.audio;let e=new globalThis.Audio;return e.preload=`auto`,e.loop=!1,e.volume=this.volume,e.muted=this.muted,e.addEventListener(`ended`,this.onEnded),e.addEventListener(`error`,this.onError),this.audio=e,e}async playNext(){if(this.destroyed||this.paused)return!1;let e=this.ensureAudio();if(!e)return!1;this.clearCooldown();let t=this.takeNextTrack();return t?(this.currentTrackValue=t,this.lastTrack=t,e.src=t,e.load(),this.tryPlay(e)):(this.pause(),!1)}async tryPlay(e){try{return await e.play(),!0}catch{return!1}}takeNextTrack(){if(this.queue.length===0){let e=this.tracks.filter(e=>!this.failedTracks.has(e));if(e.length===0)return null;this.queue=this.shuffle(e),this.queue.length>1&&this.lastTrack&&this.queue[0]===this.lastTrack&&([this.queue[0],this.queue[1]]=[this.queue[1],this.queue[0]])}return this.queue.shift()??null}shuffle(e){let t=[...e];for(let e=t.length-1;e>0;--e){let n=Math.floor(this.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}beginCooldown(){this.clearCooldown(),this.cooldownPending=!0,this.cooldownRemainingMs=this.interTrackDelayMs,this.scheduleCooldown()}scheduleCooldown(){if(!(this.destroyed||this.paused||!this.cooldownPending||this.cooldownTimer)){if(this.cooldownRemainingMs<=0){this.cooldownPending=!1,queueMicrotask(()=>void this.playNext());return}this.cooldownStartedAt=Date.now(),this.cooldownTimer=globalThis.setTimeout(()=>{this.cooldownTimer=null,this.cooldownRemainingMs=0,this.cooldownPending=!1,!this.destroyed&&!this.paused&&this.playNext()},this.cooldownRemainingMs)}}pauseCooldown(){if(!this.cooldownTimer)return;let e=Math.max(0,Date.now()-this.cooldownStartedAt);this.cooldownRemainingMs=Math.max(0,this.cooldownRemainingMs-e),globalThis.clearTimeout(this.cooldownTimer),this.cooldownTimer=null}clearCooldown(){this.cooldownTimer&&=(globalThis.clearTimeout(this.cooldownTimer),null),this.cooldownPending=!1,this.cooldownRemainingMs=0}random(){let e=this.randomState;return e^=e<<13,e^=e>>>17,e^=e<<5,this.randomState=e>>>0,this.randomState/4294967296}},cn=`manifests/ambient.json`,ln=.08,un=1.12,dn=1634558569,fn=2e4,pn=25e3,mn=/^\/ambient\/[^?#]+\.(?:mp3|ogg|wav)$/i,hn=(e,t,n)=>Math.min(n,Math.max(t,e)),gn=class e{constructor(e={}){this.audio=null,this.tracks=[],this.failedTracks=new Set,this.preparePromise=null,this.currentTrackValue=null,this.waitTimer=null,this.waitStartedAt=0,this.waitRemainingMs=0,this.waitPending=!1,this.primed=!1,this.priming=!1,this.muted=!1,this.paused=!0,this.quietHours=!1,this.destroyed=!1,this.onEnded=()=>{this.destroyed||this.priming||(this.currentTrackValue=null,this.beginWait())},this.onError=()=>{this.priming||(this.currentTrackValue&&this.failedTracks.add(this.currentTrackValue),this.currentTrackValue=null,!this.paused&&!this.destroyed&&!this.quietHours&&queueMicrotask(()=>void this.playRandomClip()))},this.endpoint=e.endpoint??cn,this.volume=hn(e.volume??ln,0,1),this.randomState=(e.seed??dn)>>>0||dn;let t=Math.max(0,e.minimumDelayMs??fn),n=Math.max(t,e.maximumDelayMs??pn);this.minimumDelayMs=t,this.maximumDelayMs=n}static get isSupported(){return typeof globalThis<`u`&&globalThis.Audio!==void 0&&typeof globalThis.fetch==`function`}get isMuted(){return this.muted}get isPaused(){return this.paused}get isQuietHours(){return this.quietHours}get currentTrack(){return this.currentTrackValue}get trackCount(){return this.tracks.length}prepare(t=!1){return this.destroyed||!e.isSupported?Promise.resolve([]):(!t&&this.preparePromise||(this.preparePromise=this.fetchTracks().then(e=>this.destroyed?[]:(this.tracks=e,this.failedTracks.clear(),[...e]))),this.preparePromise)}async unlock(){if(this.destroyed||!e.isSupported)return!1;this.paused=!1;let t=await this.prepare();if(t.length===0||this.destroyed||this.paused||this.quietHours)return!1;let n=this.ensureAudio();return n?(this.primed||await this.primeAudio(n,t[0]),this.currentTrackValue&&n.src&&!n.ended?this.tryPlay(n):(this.waitPending?this.scheduleWait():this.beginWait(),!0)):!1}async resume(){return this.unlock()}pause(){this.pauseWait(),this.paused=!0,this.audio?.pause()}async setPaused(e){return e?(this.pause(),!0):this.resume()}setMuted(e){this.muted=e,this.audio&&(this.audio.muted=e)}setVolume(e){this.volume=hn(e,0,1),this.audio&&(this.audio.volume=this.outputVolume())}setQuietHours(e){if(!(this.quietHours===e||this.destroyed)){if(this.quietHours=e,e){this.pauseWait(),this.audio&&this.currentTrackValue&&(this.audio.pause(),this.audio.removeAttribute(`src`),this.audio.load(),this.currentTrackValue=null),this.waitPending||this.beginWait();return}this.paused||(this.waitPending?this.scheduleWait():this.beginWait())}}destroy(){if(this.destroyed)return;this.destroyed=!0,this.paused=!0,this.clearWait();let e=this.audio;this.audio=null,e&&(e.pause(),e.removeEventListener(`ended`,this.onEnded),e.removeEventListener(`error`,this.onError),e.removeAttribute(`src`),e.load()),this.tracks=[],this.failedTracks.clear(),this.currentTrackValue=null,this.preparePromise=null}async fetchTracks(){try{let e=await globalThis.fetch(this.endpoint,{headers:{accept:`application/json`},cache:`no-store`});if(!e.ok)return[];let t=await e.json();if(!Array.isArray(t.tracks))return[];let n=t.tracks.map(e=>this.validateTrack(e)).filter(e=>e!==null);return[...new Set(n)]}catch{return[]}}validateTrack(e){if(typeof e!=`string`||globalThis.location===void 0)return null;try{let t=new URL(this.endpoint,globalThis.location.href),n=new URL(`../`,t),r=new URL(e.replace(/^\/+/,``),n),i=r.pathname.slice(n.pathname.length);return r.origin!==globalThis.location.origin||!r.pathname.startsWith(n.pathname)||!mn.test(`/${i}`)?null:r.pathname}catch{return null}}ensureAudio(){if(this.audio||globalThis.Audio===void 0)return this.audio;let e=new globalThis.Audio;return e.preload=`auto`,e.loop=!1,e.volume=this.outputVolume(),e.muted=this.muted,e.addEventListener(`ended`,this.onEnded),e.addEventListener(`error`,this.onError),this.audio=e,e}async primeAudio(e,t){this.priming=!0,e.volume=0,e.src=t,e.load();try{await e.play(),e.pause(),e.currentTime=0,this.primed=!0}catch{}finally{e.removeAttribute(`src`),e.load(),e.volume=this.outputVolume(),e.muted=this.muted,this.priming=!1}}async playRandomClip(){if(this.destroyed||this.paused||this.quietHours)return!1;let e=this.ensureAudio();if(!e)return!1;this.clearWait();let t=this.takeRandomTrack();return t?(this.currentTrackValue=t,e.src=t,e.load(),this.tryPlay(e)):(this.pause(),!1)}async tryPlay(e){try{return await e.play(),!0}catch{return!1}}takeRandomTrack(){let e=this.tracks.filter(e=>!this.failedTracks.has(e));return e.length===0?null:e[Math.floor(this.random()*e.length)]??null}outputVolume(){return hn(this.volume*un,0,1)}beginWait(){this.clearWait(),this.waitPending=!0,this.waitRemainingMs=this.minimumDelayMs+this.random()*(this.maximumDelayMs-this.minimumDelayMs),this.scheduleWait()}scheduleWait(){if(!(this.destroyed||this.paused||this.quietHours||!this.waitPending||this.waitTimer)){if(this.waitRemainingMs<=0){this.waitPending=!1,queueMicrotask(()=>void this.playRandomClip());return}this.waitStartedAt=Date.now(),this.waitTimer=globalThis.setTimeout(()=>{this.waitTimer=null,this.waitRemainingMs=0,this.waitPending=!1,!this.destroyed&&!this.paused&&!this.quietHours&&this.playRandomClip()},this.waitRemainingMs)}}pauseWait(){if(!this.waitTimer)return;let e=Math.max(0,Date.now()-this.waitStartedAt);this.waitRemainingMs=Math.max(0,this.waitRemainingMs-e),globalThis.clearTimeout(this.waitTimer),this.waitTimer=null}clearWait(){this.waitTimer&&=(globalThis.clearTimeout(this.waitTimer),null),this.waitPending=!1,this.waitRemainingMs=0}random(){let e=this.randomState;return e^=e<<13,e^=e>>>17,e^=e<<5,this.randomState=e>>>0,this.randomState/4294967296}},_n=[0,1,0],vn=1e-7,yn=class{constructor(){this.vertexValues=[],this.indexValues=[],this.minX=1/0,this.minY=1/0,this.minZ=1/0,this.maxX=-1/0,this.maxY=-1/0,this.maxZ=-1/0}vertex(e,t,n){let r=Tn(t,_n),i=this.vertexValues.length/10;return this.vertexValues.push(e[0],e[1],e[2],r[0],r[1],r[2],n[0],n[1],n[2],n[3]),this.minX=Math.min(this.minX,e[0]),this.minY=Math.min(this.minY,e[1]),this.minZ=Math.min(this.minZ,e[2]),this.maxX=Math.max(this.maxX,e[0]),this.maxY=Math.max(this.maxY,e[1]),this.maxZ=Math.max(this.maxZ,e[2]),i}flatTriangle(e,t,n,r,i){let a=i??Tn(wn(xn(t,e),xn(n,e)),_n),o=t,s=n;Cn(wn(xn(o,e),xn(s,e)),a)<0&&(o=n,s=t),a=Tn(a,_n);let c=this.vertex(e,a,r),l=this.vertex(o,a,r),u=this.vertex(s,a,r);this.indexValues.push(c,l,u)}doubleTriangle(e,t,n,r,i=En(r,.72)){let a=Tn(wn(xn(t,e),xn(n,e)),_n);this.flatTriangle(e,t,n,r,a),this.flatTriangle(e,n,t,i,Sn(a,-1))}doubleQuad(e,t,n,r,i,a=En(i,.72)){this.doubleTriangle(e,t,n,i,a),this.doubleTriangle(e,n,r,i,a)}build(){let e=this.vertexValues.length===0?{min:[0,0,0],max:[0,0,0],center:[0,0,0],radius:0}:this.calculateBounds();return{vertices:new Float32Array(this.vertexValues),indices:new Uint32Array(this.indexValues),vertexStride:10,topology:`triangle-list`,bounds:e}}calculateBounds(){let e=[(this.minX+this.maxX)*.5,(this.minY+this.maxY)*.5,(this.minZ+this.maxZ)*.5],t=0;for(let n=0;n<this.vertexValues.length;n+=10){let r=this.vertexValues[n]-e[0],i=this.vertexValues[n+1]-e[1],a=this.vertexValues[n+2]-e[2];t=Math.max(t,r*r+i*i+a*a)}return{min:[this.minX,this.minY,this.minZ],max:[this.maxX,this.maxY,this.maxZ],center:e,radius:Math.sqrt(t)}}};function bn(e,t){return[e[0]+t[0],e[1]+t[1],e[2]+t[2]]}function xn(e,t){return[e[0]-t[0],e[1]-t[1],e[2]-t[2]]}function Sn(e,t){return[e[0]*t,e[1]*t,e[2]*t]}function Cn(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function wn(e,t){return[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]]}function Tn(e,t=_n){let n=Math.hypot(e[0],e[1],e[2]);return n>vn?Sn(e,1/n):t}function En(e,t){return[Math.max(0,Math.min(1,e[0]*t)),Math.max(0,Math.min(1,e[1]*t)),Math.max(0,Math.min(1,e[2]*t)),e[3]]}function R(e,t,n,r){return[e,t,n,r]}function Dn(e,t,n,r,i,a){for(let o=0;o<r;o+=1){let s=o/r,c=(o+1)/r,l=-Math.PI*.5+s*Math.PI,u=-Math.PI*.5+c*Math.PI;for(let s=0;s<i;s+=1){let c=s/i,d=(s+1)/i,f=c*Math.PI*2,p=d*Math.PI*2,m=(e,t)=>[Math.cos(e)*Math.cos(t),Math.sin(e),Math.cos(e)*Math.sin(t)],h=e=>[t[0]+e[0]*n[0],t[1]+e[1]*n[1],t[2]+e[2]*n[2]],g=m(l,f),_=m(l,p),v=m(u,f),y=m(u,p),b=a(Tn([g[0]+_[0]+v[0]+y[0],g[1]+_[1]+v[1]+y[1],g[2]+_[2]+v[2]+y[2]]));o>0&&e.flatTriangle(h(g),h(_),h(y),b),o<r-1&&e.flatTriangle(h(g),h(y),h(v),b)}}}function On(e,t,n,r,i){let a=Tn(xn(n,t),[0,0,1]),o=Tn(wn(Math.abs(a[1])<.9?_n:[1,0,0],a),[1,0,0]),s=Tn(wn(a,o),[0,0,1]);for(let a=0;a<4;a+=1){let c=(a+1)%4,l=e=>bn(Sn(o,Math.cos(e/4*Math.PI*2)*r),Sn(s,Math.sin(e/4*Math.PI*2)*r)),u=bn(t,l(a)),d=bn(t,l(c)),f=bn(n,l(c)),p=bn(n,l(a));e.doubleQuad(u,d,f,p,En(i,a%2?.86:1.04))}}function kn(){let e=new yn;Dn(e,[0,0,.02],[.155,.315,.45],5,8,e=>e[2]>.63?R(.075,.07,.055,1):e[2]>.29?R(.94,.91,.68,1):e[2]<-.58?R(.1,.095,.07,1):e[1]>.42?R(.96,.68,.08,1):R(.91,.51,.055,1));let t=R(.96,.66,.07,2);e.doubleTriangle([0,0,-.38],[0,.285,-.77],[0,.02,-.66],t),e.doubleTriangle([0,0,-.38],[0,.02,-.66],[0,-.285,-.77],En(t,.91));let n=R(.98,.67,.08,3);e.doubleTriangle([0,.25,.27],[0,.49,-.12],[0,.22,-.31],n),e.doubleTriangle([0,-.25,.2],[0,-.4,-.12],[0,-.2,-.29],En(n,.84));for(let t of[-1,1])e.doubleTriangle([t*.13,.01,.05],[t*.31,-.045,-.1],[t*.12,-.08,-.17],En(n,t<0?.82:.94)),Dn(e,[t*.15,.105,.29],[.022,.025,.026],3,5,()=>R(.018,.018,.014,1));return e.build()}function An(){let e=new yn;Dn(e,[0,0,.035],[.17,.245,.53],5,9,e=>e[1]>.48||e[2]<-.15&&e[1]>.05?R(.025,.105,.23,1):e[1]<-.5?R(.045,.31,.59,1):R(.055,.42,.76,1));let t=R(.97,.77,.08,2);e.doubleTriangle([0,0,-.45],[0,.245,-.78],[0,0,-.68],t),e.doubleTriangle([0,0,-.45],[0,0,-.68],[0,-.245,-.78],En(t,.9));let n=R(.035,.19,.39,3);e.doubleTriangle([0,.19,.34],[0,.37,-.13],[0,.19,-.39],n),e.doubleTriangle([0,-.19,.27],[0,-.31,-.12],[0,-.17,-.35],En(n,.82));for(let t of[-1,1])e.doubleTriangle([t*.135,-.01,.08],[t*.29,-.07,-.1],[t*.125,-.1,-.19],R(.055,.34,.63,3)),Dn(e,[t*.165,.07,.39],[.021,.023,.024],3,5,()=>R(.012,.018,.025,1));return e.build()}function jn(){let e=new yn;Dn(e,[0,.035,-.015],[.047,.032,.074],4,6,e=>e[0]>0?R(.78,.25,.045,1):R(.57,.105,.025,1)),Dn(e,[0,.035,.064],[.038,.029,.038],3,6,()=>R(.19,.065,.022,1));let t=R(.13,.045,.016,2);for(let n of[-1,1]){for(let r=0;r<3;r+=1){let i=.045-r*.052,a=n<0?2:3,o=[n*.036,.035,i],s=[n*(.073+r*.006),.022,i+(r-1)*.015],c=[n*(.1+r*.004),.006,i+(r-1)*.029],l=R(t[0],t[1],t[2],a);On(e,o,s,.006,l),On(e,s,c,.0045,l)}On(e,[n*.018,.052,.091],[n*.063,.055,.145],.0035,R(.12,.04,.015,n<0?2:3))}return e.build()}function Mn(){let e=new yn;Dn(e,[0,.015,0],[.095,.105,.34],4,7,e=>e[1]>.15?R(.985,.99,.965,1):R(.74,.79,.78,1)),Dn(e,[0,.055,.305],[.088,.085,.105],3,6,()=>R(.97,.98,.95,1)),e.doubleTriangle([-.035,.055,.402],[.035,.055,.402],[0,.045,.51],R(.84,.57,.12,1),R(.55,.34,.07,1));let t=R(.965,.98,.96,2),n=R(.62,.69,.7,2);for(let r of[-1,1]){let i=r<0?2:3,a=R(t[0],t[1],t[2],i),o=R(n[0],n[1],n[2],i);e.doubleQuad([r*.045,.05,.13],[r*.52,.035,.015],[r*.86,.015,-.16],[r*.1,.035,-.19],a,o),e.doubleTriangle([r*.1,.035,-.19],[r*.86,.015,-.16],[r*.51,.005,-.35],En(a,.93),En(o,.86))}return e.doubleTriangle([-.018,.015,-.28],[-.22,.01,-.53],[0,.025,-.43],R(.88,.91,.89,1)),e.doubleTriangle([.018,.015,-.28],[0,.025,-.43],[.22,.01,-.53],R(.94,.96,.93,1)),e.build()}var Nn=`coastal`,Pn={coastal:{kind:`coastal`,label:`Coastal island`,menuDescription:`Open sea, beaches, villages, marsh oil and a volcano.`,seed:2047989219,edge:{mode:`ocean`,editableHalfExtent:90,transitionWidth:22},terrain:{primaryMaterial:`sand`,dirtFraction:.22,broadVariation:.18,detailVariation:.08,grassCoverage:.32},villageCenters:[[-28,12],[28,18]],volcanoCenter:[46,-28],lakes:[],marshes:[{id:`east-marsh`,center:[42,20],radius:{x:8.5,z:7},wetness:.92,oilPuddles:[{center:[42,20],radius:4.6,depth:.7}]}],forests:[{center:[-53,2],radius:{x:15,z:12},density:.75},{center:[-29,-38],radius:{x:14,z:11},density:.68},{center:[24,46],radius:{x:15,z:10},density:.64}],springs:[],structures:{forts:[{center:[-18,-19],rotation:.16,towerCount:3},{center:[28,18],rotation:-.18,towerCount:4}],dam:null}},inland:{kind:`inland`,label:`Inland watershed`,menuDescription:`Earth, forests, lakes and two spring-fed rivers.`,seed:440510167,edge:{mode:`earth-drain`,editableHalfExtent:74,transitionWidth:26,outsideSoilDepth:4.8,seepBandWidth:5.5},terrain:{primaryMaterial:`dirt`,dirtFraction:1,broadVariation:.34,detailVariation:.16,grassCoverage:.58},villageCenters:[[-39,24],[39,-17]],volcanoCenter:[2,55],lakes:[{id:`reed-lake`,center:[-47,-31],radius:{x:15,z:11},waterLevel:1.8,maximumDepth:3.9,sandyBottomDepth:1.35,sandyShoreWidth:4.6},{id:`high-lake`,center:[25,36],radius:{x:11,z:8.5},waterLevel:4.2,maximumDepth:2.8,sandyBottomDepth:1.05,sandyShoreWidth:3.8},{id:`village-mere`,center:[49,5],radius:{x:8,z:6},waterLevel:.9,maximumDepth:2.1,sandyBottomDepth:.9,sandyShoreWidth:3.1}],marshes:[{id:`western-marsh`,center:[-58,9],radius:{x:12,z:9},wetness:.94,oilPuddles:[{center:[-60,8],radius:3.8,depth:.62},{center:[-53,12],radius:2.5,depth:.44}]},{id:`southern-marsh`,center:[19,-53],radius:{x:10,z:8},wetness:.88,oilPuddles:[{center:[17,-54],radius:3.2,depth:.53}]}],forests:[{center:[-55,41],radius:{x:18,z:15},density:.9},{center:[-14,-42],radius:{x:17,z:13},density:.8},{center:[28,17],radius:{x:14,z:12},density:.74},{center:[58,-38],radius:{x:12,z:15},density:.68}],springs:[{id:`quiet-spring`,center:[-47,-31],output:.42,sourceRadius:2.4,riverPath:[[-47,-31],[-57,-25],[-53,-14],[-64,-5],[-57,7],[-68,18],[-74,29]],edgeSink:{center:[-74,29],radius:5.5,seepRate:1}},{id:`strong-spring`,center:[25,36],output:1,sourceRadius:3.1,riverPath:[[25,36],[13,27],[22,17],[10,6],[21,-5],[12,-18],[26,-31],[20,-45],[34,-57],[51,-67],[69,-72]],edgeSink:{center:[69,-72],radius:6.5,seepRate:1.35}}],structures:{forts:[{center:[-24,41],rotation:.08,towerCount:4},{center:[43,22],rotation:-.34,towerCount:3}],dam:{center:[26,-31],rotation:.29,length:17,riverId:`strong-spring`}}}};function Fn(e){return Pn[e]}var In=[[-28,12],[28,18]],Ln=[42,20],Rn=In.length,zn=2.15,Bn=Object.freeze({role:`curtain`,length:2.2,width:.92,height:2.75,foundationDepth:.85,initialHealth:1,hydraulicCrest:2.75}),Vn=[.38,.7],Hn=Math.PI*2,Un=[70,63],Wn=1.45,Gn=.62,Kn=12.5,qn=15,Jn=8.5,Yn=[68,60],Xn=1.15,Zn=23,Qn=8.2,$n=[[-53,2],[-46,38],[-29,-38],[-8,42],[2,-37],[24,46],[45,42],[60,4],[25,-49]];function er(e){return Fn(e).villageCenters}function tr(e){return Fn(e).marshes[0]?.oilPuddles[0]?.center??Ln}function nr(e){let t=Fn(e).forests;return t.length>0?t.map(e=>e.center):$n}var rr=[[-57,7],[-48,34],[-34,-34],[-19,42],[-7,-29],[8,36],[23,-45],[37,42],[55,7],[-58,-21],[15,2]],ir=[[-5.3,-3.5],[4.7,-3.9],[-4.5,4.8],[5.4,4.5]];function ar(e){let t=e>>>0;return()=>{t+=1831565813;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function or(e,t,n){let r=e-n[0],i=t-n[1];return r*r+i*i}function sr(e,t,n,r,i){let a=(e-n[0])/Math.max(.001,r),o=(t-n[1])/Math.max(.001,i);return a*a+o*o}function cr(e,t,n,r){let i=r[0]-n[0],a=r[1]-n[1],o=i*i+a*a;if(o<=1e-6)return or(e,t,n);let s=Math.max(0,Math.min(1,((e-n[0])*i+(t-n[1])*a)/o)),c=n[0]+i*s,l=n[1]+a*s,u=e-c,d=t-l;return u*u+d*d}function lr(e,t){return e===`coastal`?t===0?[5.7,4.5]:[11.2,9.2]:[7.6+t*.9,5.9+t*.65]}function ur(e,t,n,r){let i=Fn(n).structures;for(let[a,o]of i.forts.entries()){let i=Math.cos(-o.rotation),s=Math.sin(-o.rotation),c=e-o.center[0],l=t-o.center[1],u=c*i-l*s,d=c*s+l*i,[f,p]=lr(n,a);if(Math.abs(u)<=f+r&&Math.abs(d)<=p+r)return!0}if(i.dam){let n=i.dam,a=Math.cos(n.rotation)*n.length*.5,o=Math.sin(n.rotation)*n.length*.5;if(cr(e,t,[n.center[0]-a,n.center[1]-o],[n.center[0]+a,n.center[1]+o])<=(r+1.7)**2)return!0}return!1}function dr(e,t,n){let r=Fn(`inland`),i=n===`tree`;for(let n of r.lakes){let r=n.sandyShoreWidth+(i?2.2:.8);if(sr(e,t,n.center,n.radius.x+r,n.radius.z+r)<=1)return!0}for(let n of r.marshes){let r=i?2.8:.7;if(sr(e,t,n.center,n.radius.x+r,n.radius.z+r)<=1)return!0;for(let r of n.oilPuddles){let n=r.radius+(i?3.1:1.1);if(or(e,t,r.center)<=n**2)return!0}}for(let n of r.springs){let r=n.sourceRadius+(i?3.4:1.4);if(or(e,t,n.center)<=r**2)return!0;let a=Math.max(i?4.6:2.7,n.sourceRadius+(i?1.8:.5));for(let r=1;r<n.riverPath.length;r+=1)if(cr(e,t,n.riverPath[r-1],n.riverPath[r])<=a**2)return!0}return!1}function fr(e,t,n){if(Fn(n).edge.mode===`earth-drain`){let r=Fn(n).edge.editableHalfExtent-4;return Math.abs(e)<=r&&Math.abs(t)<=r}let r=e/Un[0],i=t/Un[1];return r*r+i*i<=1}function pr(e,t,n){let r=Fn(n);for(let n of r.villageCenters)if(or(e,t,n)<Kn**2)return!1;if(or(e,t,r.volcanoCenter)<qn**2)return!1;for(let n of r.marshes)if(or(e,t,n.center)<Jn**2)return!1;return!(ur(e,t,n,2.8)||n===`inland`&&dr(e,t,`tree`))}function mr(e,t,n){let r=Wn**2;return n.every(n=>or(e,t,n)>=r)}function hr(e,t){if(Fn(t).edge.mode===`earth-drain`)return[(e()-.5)*136,(e()-.5)*136];let n=e()*Hn,r=Math.sqrt(e())*.99;return[Math.cos(n)*r*Un[0],Math.sin(n)*r*Un[1]]}function gr(e,t){let n=nr(t),r=n[Math.floor(e()*n.length)],i=e()*Hn,a=Math.sqrt(e()),o=8+e()*7,s=7+e()*6;return[r[0]+Math.cos(i)*a*o,r[1]+Math.sin(i)*a*s]}function _r(e,t){if(t===`inland`){let n=Fn(t).forests;if(e()>.78)return[(e()-.5)*136,(e()-.5)*136];let r=n[Math.floor(e()*n.length)],i=e()*Hn,a=e()**.72;return[r.center[0]+Math.cos(i)*a*r.radius.x,r.center[1]+Math.sin(i)*a*r.radius.z]}if(e()>.82){let t=e()*Hn,n=Math.sqrt(e())*.98;return[Math.cos(t)*n*Yn[0],Math.sin(t)*n*Yn[1]]}let n=rr[Math.floor(e()*rr.length)],r=e()*Hn,i=e()**.72;return[n[0]+Math.cos(r)*i*(5.5+e()*7.5),n[1]+Math.sin(r)*i*(4.5+e()*6.5)]}function vr(e,t,n){if(Fn(n).edge.mode===`earth-drain`){let r=Fn(n).edge.editableHalfExtent-3;return Math.abs(e)<=r&&Math.abs(t)<=r}let r=e/Yn[0],i=t/Yn[1];return r*r+i*i<=1}function yr(e,t,n){let r=Fn(n);if(or(e,t,r.volcanoCenter)<Zn**2||or(e,t,tr(n))<Qn**2)return!1;for(let n of r.villageCenters)if(or(e,t,n)<7.5**2)return!1;return!(ur(e,t,n,1.15)||n===`inland`&&dr(e,t,`ground-vegetation`))}function br(e,t,n,r){let i=Math.cos(t),a=Math.sin(t);return[e[0]+n*i-r*a,e[1]+n*a+r*i]}function xr(e=Nn){let t=Fn(e),n=[],r=0,i=(e,t,i,a,o)=>{n.push({id:r,structureId:e,role:t,center:i,rotation:a,...o}),r+=1};for(let[n,r]of t.structures.forts.entries()){let t=n+1,[a,o]=lr(e,n),s={...Bn,initialHealth:1},c=Math.max(4,Math.ceil((a*2-2.7)/zn)),l=Math.max(3,Math.ceil((o*2-2.7)/zn));for(let e of[-o,o])for(let n=0;n<c;n+=1){let o=(n+.5)/c,l=-a+1.35+o*(a*2-2.7);i(t,`curtain`,br(r.center,r.rotation,l,e),r.rotation,s)}for(let e of[-a,a])for(let n=0;n<l;n+=1){let a=(n+.5)/l,c=-o+1.35+a*(o*2-2.7);i(t,`curtain`,br(r.center,r.rotation,e,c),r.rotation+Math.PI*.5,s)}let u=[[-a,-o],[a,-o],[a,o],[-a,o]],d={length:3.44,width:3.44,height:4.35,foundationDepth:1.3,initialHealth:1.35,hydraulicCrest:4.05};for(let e=0;e<Math.min(4,r.towerCount);e+=1){let n=u[e];i(t,`tower`,br(r.center,r.rotation,n[0],n[1]),r.rotation+e*.19,d)}}if(t.structures.dam){let e=t.structures.dam,n=t.structures.forts.length+1,r=Math.max(3,Math.ceil(e.length/zn)),a={length:2.23,width:1.2,height:3.3,foundationDepth:1.45,initialHealth:1.2,hydraulicCrest:3.3};for(let t=0;t<r;t+=1){let o=(t-(r-1)*.5)*zn;i(n,`dam`,br(e.center,e.rotation,o,0),e.rotation,a)}let o=r*zn*.5+.45;for(let t of[-o,o])i(n,`tower`,br(e.center,e.rotation,t,0),e.rotation,{length:3.44,width:3.44,height:4.35,foundationDepth:1.55,initialHealth:1.45,hydraulicCrest:4.05})}return Object.freeze(n.map(e=>Object.freeze(e)))}function Sr(e=Nn){let t=ar(e===`coastal`?2047989219:Fn(e).seed^827375838),n=[],r=[];for(let i=0;r.length<324&&i<162e3;i+=1){let i=t()<(e===`inland`?.7:.64)?gr(t,e):hr(t,e),[a,o]=i;if(!fr(a,o,e)||!pr(a,o,e)||!mr(a,o,r))continue;r.push(i);let s=t()*Hn,c=Gn+t()**.72*.7599999999999999;n.push(a,o,s,c)}if(r.length!==324)throw Error(`Unable to place all 324 deterministic trees.`);return new Float32Array(n)}function Cr(e=Nn){let t=ar(e===`coastal`?1738890014:Fn(e).seed^1738890014),n=[],r=[];for(let i=0;r.length<460&&i<23e4;i+=1){let i=_r(t,e),[a,o]=i;!vr(a,o,e)||!yr(a,o,e)||r.every(e=>or(a,o,e)>=Xn**2)&&(r.push(i),n.push(a,o,t()*Hn,.8+t()*.72))}if(r.length!==460)throw Error(`Unable to place all 460 deterministic ground-vegetation clusters.`);return new Float32Array(n)}function wr(e=Nn){let t=ar(e===`coastal`?1219436999:Fn(e).seed^1219436999),n=[],r=er(e);for(let e=0;e<r.length;e+=1){let i=r[e],a=e===0?.12:-.28,o=Math.cos(a),s=Math.sin(a);for(let e of ir){let r=e[0]*o-e[1]*s,a=e[0]*s+e[1]*o,c=i[0]+r+(t()-.5)*.45,l=i[1]+a+(t()-.5)*.45,u=Math.atan2(i[1]-l,i[0]-c)+(t()-.5)*.32,d=1.12+t()*.27;n.push(c,l,u,d)}}return new Float32Array(n)}function Tr(e=Nn){let t=[],n=er(e);for(let e=0;e<n.length;e+=1){let r=n[e],i=e===0?.18:-.34,a=e===0?1.04:.98;t.push(r[0],r[1],i,a)}return new Float32Array(t)}function Er(e=Nn){let t=ar(e===`coastal`?786934037:Fn(e).seed^786934037),n=new Float32Array(160),r=er(e),i=20/r.length;for(let e=0;e<20;e+=1){let a=Math.floor(e/i),o=e%i,s=r[a],c=Math.floor(o/5),l=o%5*(Hn/5)+a*.61+c*.37+(t()-.5)*.28,u=4.7+c*3.6+t()*.9,d=t()*Hn,f=e*8;n[f]=s[0]+Math.cos(l)*u*1.08,n[f+1]=s[1]+Math.sin(l)*u*.86,n[f+2]=d,n[f+3]=1,n[f+4]=d+(t()-.5)*.9,n[f+5]=Vn[0]+t()*(Vn[1]-Vn[0]),n[f+6]=t()*1e3+e*19.17,n[f+7]=0}return n}var Dr={COPY_DST:8,INDEX:16,VERTEX:32,UNIFORM:64,STORAGE:128},Or=[20,30],kr=[21,5],Ar=8,jr=8,Mr=12,Nr=4,Pr=[{angle:2.85,radius:80},{angle:-.52,radius:80}];function Fr(e,t){return Math.ceil(e/t)*t}function Ir(e,t,n,r){let i=e.createBuffer({label:r,size:Fr(t.byteLength,4),usage:n,mappedAtCreation:!0});return new Uint8Array(i.getMappedRange()).set(new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),i.unmap(),i}function Lr(e,t,n){return{vertexBuffer:Ir(e,t.vertices,Dr.VERTEX|Dr.COPY_DST,`${n} vertices`),indexBuffer:Ir(e,t.indices,Dr.INDEX|Dr.COPY_DST,`${n} indices`),indexCount:t.indices.length}}function Rr(e){let t=e>>>0;return()=>{t+=1831565813;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function zr(e){let t=Rr(e===0?99242462:2970516118),n=new Float32Array(80),r=Pr[e],i=Math.cos(r.angle),a=Math.sin(r.angle),o=-a,s=i;for(let c=0;c<10;c+=1){let l=.8+t()*4.2,u=(t()-.5)*9.5,d=i*(r.radius+l)+o*u,f=a*(r.radius+l)*.89+s*u,p=r.angle+Math.PI*.5+(t()-.5)*.7,m=Math.cos(p),h=Math.sin(p),g=2.2+t()*3.1,_=c*Ar;n[_]=d-m*g,n[_+1]=f-h*g,n[_+2]=d+m*g,n[_+3]=f+h*g,n[_+4]=t(),n[_+5]=.055+t()*.035,n[_+6]=.72+t()*.5,n[_+7]=(e===0?.78:.86)+t()*.28}return n}function Br(){let e=Cr(),t=Rr(12680821),n=new Float32Array(80),r=[7,49,86,128,171,219,267,312,371,429];for(let i=0;i<10;i+=1){let a=r[i]*4,o=i*jr;n[o]=e[a]+(t()-.5)*.8,n[o+1]=e[a+1]+(t()-.5)*.8,n[o+2]=.34+t()*.34,n[o+3]=.24+t()*.28,n[o+4]=t()*Math.PI*2,n[o+5]=1.4+t()*.8,n[o+6]=.82+t()*.28,n[o+7]=t()*1e3+i*17.3}return n}function Vr(){let e=new Float32Array(40);for(let t=0;t<10;t+=1){let n=t*Nr;e[n]=1,e[n+1]=-1e3}return e}var Hr=String.raw`
struct FrameUniforms {
  viewProjection: mat4x4f,
  inverseViewProjection: mat4x4f,
  cameraPosition: vec4f,
  cameraRight: vec4f,
  cameraUpTime: vec4f,
  world: vec4f,
  sun: vec4f,
  brushVisual: vec4f,
  fog: vec4f,
  pad: vec4f,
}

struct StateBuffer {
  values: array<vec4f>,
}

fn gridSize() -> u32 {
  return u32(frame.world.y);
}

fn gridIndex(cell: vec2u) -> u32 {
  return cell.y * gridSize() + cell.x;
}

fn stateAt(worldXZ: vec2f) -> vec4f {
  let uv = clamp(
    worldXZ / frame.world.x + vec2f(0.5),
    vec2f(0.0),
    vec2f(1.0)
  );
  let cell = vec2u(round(uv * f32(gridSize() - 1u)));
  return state.values[gridIndex(cell)];
}

fn faunaSkyColor(worldPosition: vec3f) -> vec3f {
  let heightTint = clamp((worldPosition.y + 4.0) / 34.0, 0.0, 1.0);
  let nightSky = mix(
    vec3f(0.018, 0.052, 0.105),
    vec3f(0.055, 0.105, 0.17),
    heightTint
  );
  let daySky = mix(
    vec3f(0.16, 0.55, 0.62),
    vec3f(0.39, 0.71, 0.76),
    heightTint
  );
  return mix(nightSky, daySky, frame.pad.w);
}

fn faunaLight(
  worldPosition: vec3f,
  normal: vec3f,
  albedo: vec3f
) -> vec3f {
  let diffuse = max(dot(normal, normalize(frame.sun.xyz)), 0.0);
  let horizon = clamp(normal.y * 0.5 + 0.5, 0.0, 1.0);
  let keyLight = frame.pad.xyz * diffuse * frame.sun.w;
  let nightFill = mix(
    vec3f(0.055, 0.085, 0.15),
    vec3f(0.17, 0.23, 0.33),
    horizon
  ) * 0.82;
  let dayFill = mix(
    vec3f(0.12, 0.2, 0.27),
    vec3f(0.43, 0.63, 0.64),
    horizon
  ) * 0.62;
  let lit = albedo * (keyLight + mix(nightFill, dayFill, frame.pad.w));
  let distanceToCamera = distance(frame.cameraPosition.xyz, worldPosition);
  let fogAmount = smoothstep(frame.fog.x, frame.fog.y, distanceToCamera);
  return mix(lit, faunaSkyColor(worldPosition), fogAmount * 0.82);
}

struct FaunaOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
}

@fragment
fn fragmentMain(input: FaunaOutput) -> @location(0) vec4f {
  if (input.color.a < 0.01) {
    discard;
  }
  return input.color;
}
`,Ur=Hr+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

@vertex
fn vertexMain(
  @location(0) meshPosition: vec3f,
  @location(1) meshNormal: vec3f,
  @location(2) meshColor: vec4f,
  @location(3) route: vec4f,
  @location(4) motion: vec4f
) -> FaunaOutput {
  let time = frame.cameraUpTime.w;
  let cycleAngle = (time * motion.y + motion.x) * 6.28318530718;
  let progress = 0.5 - cos(cycleAngle) * 0.5;
  let start = route.xy;
  let destination = route.zw;
  let travelSign = select(-1.0, 1.0, sin(cycleAngle) >= 0.0);
  let baseForward = normalize(destination - start);
  let forward = baseForward * travelSign;
  let right = vec2f(forward.y, -forward.x);
  let routeSeed = dot(route, vec4f(0.071, 0.113, 0.157, 0.193));
  let lateral = sin(cycleAngle * 2.0 + routeSeed * 5.1) * 0.48;
  let worldXZ = mix(start, destination, progress) + right * lateral;
  let surfaceState = stateAt(worldXZ);
  let waterDepth = max(0.0, surfaceState.z);
  let waterSurface = surfaceState.x + surfaceState.y + waterDepth;
  let visibility = smoothstep(0.88, 1.55, waterDepth);

  var local = meshPosition * motion.w;
  let tailWeight =
    step(1.5, meshColor.a) * (1.0 - step(2.5, meshColor.a));
  let finWeight =
    step(2.5, meshColor.a) * (1.0 - step(3.5, meshColor.a));
  let tailLever = smoothstep(0.18, 0.82, -meshPosition.z);
  local.x = local.x
    + sin(time * 6.4 + cycleAngle * 1.7 + routeSeed * 11.0)
      * tailWeight
      * tailLever
      * 0.13
      * motion.w;
  local.y = local.y
    + sin(time * 3.1 + routeSeed * 9.0)
      * finWeight
      * abs(meshPosition.x)
      * 0.06;

  let submerge = min(
    motion.z + 0.38,
    max(0.72, waterDepth * 0.78)
  );
  let worldPosition = vec3f(
    worldXZ.x + right.x * local.x + forward.x * local.z,
    waterSurface - submerge + local.y,
    worldXZ.y + right.y * local.x + forward.y * local.z
  );
  let normal = normalize(vec3f(
    right.x * meshNormal.x + forward.x * meshNormal.z,
    meshNormal.y,
    right.y * meshNormal.x + forward.y * meshNormal.z
  ));
  let depthHaze = smoothstep(0.5, 1.75, submerge);
  let underwaterAlbedo = mix(
    meshColor.rgb,
    meshColor.rgb * vec3f(0.24, 0.5, 0.58)
      + vec3f(0.014, 0.068, 0.09),
    0.68 + depthHaze * 0.2
  );
  var output: FaunaOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.color = vec4f(
    faunaLight(worldPosition, normal, underwaterAlbedo),
    visibility * mix(0.42, 0.2, depthHaze)
  );
  return output;
}
`,Wr=Hr+String.raw`
struct CritterStateBuffer {
  values: array<vec4f>,
}

@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;
@group(0) @binding(2) var<storage, read> critterState: CritterStateBuffer;

@vertex
fn vertexMain(
  @location(0) meshPosition: vec3f,
  @location(1) meshNormal: vec3f,
  @location(2) meshColor: vec4f,
  @location(3) anchor: vec4f,
  @location(4) motion: vec4f,
  @builtin(instance_index) instanceIndex: u32
) -> FaunaOutput {
  let time = frame.cameraUpTime.w;
  let life = critterState.values[instanceIndex];
  let alive = step(0.5, life.x);
  let motionTime = select(life.y, time, alive > 0.5);
  let angle = motionTime * motion.y + motion.x;
  let worldXZ = anchor.xy + vec2f(
    cos(angle) * anchor.z,
    sin(angle) * anchor.w
  );
  let forward = normalize(vec2f(
    -sin(angle) * anchor.z,
    cos(angle) * anchor.w
  ));
  let right = vec2f(forward.y, -forward.x);
  let surfaceState = stateAt(worldXZ);
  let groundHeight = surfaceState.x + surfaceState.y;
  let dryVisibility = 1.0 - smoothstep(0.045, 0.18, surfaceState.z);
  let deathAge = max(0.0, time - life.y);
  let deathProgress = (1.0 - alive) * clamp(deathAge / 1.15, 0.0, 1.0);
  let deathFade = 1.0 - smoothstep(0.68, 1.0, deathProgress);

  var local = meshPosition * motion.z;
  let legWeight = step(1.5, meshColor.a);
  let legSide = select(-1.0, 1.0, meshColor.a > 2.5);
  local.z = local.z
    + sin(motionTime * 12.0 + meshPosition.z * 63.0 + motion.w)
      * legWeight
      * legSide
      * 0.009;
  local.y = local.y
    + sin(motionTime * 8.0 + motion.w) * 0.0035 * alive;
  let uprightX = local.x;
  let uprightY = local.y;
  let tumbleAngle = deathProgress * 1.35;
  local.x = uprightX * cos(tumbleAngle) - uprightY * sin(tumbleAngle);
  local.y = uprightX * sin(tumbleAngle) + uprightY * cos(tumbleAngle)
    - deathProgress * 0.018;

  let worldPosition = vec3f(
    worldXZ.x + right.x * local.x + forward.x * local.z,
    groundHeight + 0.012 + local.y,
    worldXZ.y + right.y * local.x + forward.y * local.z
  );
  let normal = normalize(vec3f(
    right.x * meshNormal.x + forward.x * meshNormal.z,
    meshNormal.y,
    right.y * meshNormal.x + forward.y * meshNormal.z
  ));
  var output: FaunaOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.color = vec4f(
    faunaLight(worldPosition, normal, meshColor.rgb),
    dryVisibility * deathFade
  );
  return output;
}
`,Gr=Hr+String.raw`
@group(0) @binding(0) var<uniform> frame: FrameUniforms;
@group(0) @binding(1) var<storage, read> state: StateBuffer;

@vertex
fn vertexMain(
  @location(0) meshPosition: vec3f,
  @location(1) meshNormal: vec3f,
  @location(2) meshColor: vec4f,
  @location(3) routeStart: vec4f,
  @location(4) routeEnd: vec4f,
  @location(5) flight: vec4f
) -> FaunaOutput {
  let time = frame.cameraUpTime.w;
  let rawProgress = clamp(
    (time - routeStart.w) / max(0.1, routeEnd.w),
    0.0,
    1.0
  );
  let progress =
    rawProgress * rawProgress * (3.0 - 2.0 * rawProgress);
  let startXZ = routeStart.xy;
  let endXZ = routeEnd.xy;
  let baseForward = normalize(endXZ - startXZ);
  var right = vec2f(baseForward.y, -baseForward.x);
  let routeArch = sin(rawProgress * 3.14159265359);
  let worldXZ = mix(startXZ, endXZ, progress)
    + right * flight.x * routeArch;
  let startState = stateAt(startXZ);
  let endState = stateAt(endXZ);
  let startHeight =
    startState.x + startState.y + max(3.4, routeStart.z * 4.9);
  let endHeight =
    endState.x + endState.y + max(3.4, routeEnd.z * 4.9);
  let flightHeight =
    mix(startHeight, endHeight, progress) + routeArch * flight.y;
  let visibility =
    smoothstep(0.015, 0.095, rawProgress)
      * (1.0 - smoothstep(0.87, 0.995, rawProgress));

  var local = meshPosition * flight.z;
  let wingWeight = step(1.5, meshColor.a);
  let wingSide = select(-1.0, 1.0, meshColor.a > 2.5);
  // Gliding correction only: the rigid wing planes breathe by a few degrees;
  // there is deliberately no powered-flapping cycle.
  let glideFlex =
    sin(time * 0.82 + flight.w * 0.017) * 0.032
      + sin(rawProgress * 3.14159265359) * 0.015;
  local.y = local.y
    + abs(local.x) * glideFlex * wingWeight
    + local.x * wingSide * 0.006 * wingWeight;
  let forward = normalize(
    endXZ - startXZ
      + right * flight.x * cos(rawProgress * 3.14159265359) * 0.45
  );
  right = vec2f(forward.y, -forward.x);
  let worldPosition = vec3f(
    worldXZ.x + right.x * local.x + forward.x * local.z,
    flightHeight + local.y,
    worldXZ.y + right.y * local.x + forward.y * local.z
  );
  let normal = normalize(vec3f(
    right.x * meshNormal.x + forward.x * meshNormal.z,
    meshNormal.y,
    right.y * meshNormal.x + forward.y * meshNormal.z
  ));
  var output: FaunaOutput;
  output.position = frame.viewProjection * vec4f(worldPosition, 1.0);
  output.color = vec4f(
    faunaLight(worldPosition, normal, meshColor.rgb) * 1.08,
    visibility
  );
  return output;
}
`,Kr=String.raw`
struct SimUniforms {
  grid: vec4f,
  physics: vec4f,
  rayOriginRadius: vec4f,
  rayDirAmount: vec4f,
  brush: vec4f,
  world: vec4f,
  pad0: vec4f,
  pad1: vec4f,
}

struct HitBuffer {
  value: vec4f,
  material: vec4f,
}

struct CritterInstance {
  anchor: vec4f,
  motion: vec4f,
}

struct CritterInstanceBuffer {
  values: array<CritterInstance>,
}

struct CritterStateBuffer {
  values: array<vec4f>,
}

@group(0) @binding(0) var<uniform> uniforms: SimUniforms;
@group(0) @binding(1) var<storage, read> hit: HitBuffer;
@group(0) @binding(2) var<storage, read> critters: CritterInstanceBuffer;
@group(0) @binding(3) var<storage, read_write> critterState: CritterStateBuffer;

@compute @workgroup_size(16)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let index = gid.x;
  if (
    index >= ${10}u
      || uniforms.brush.x <= 0.5
      || hit.value.w < 0.5
  ) {
    return;
  }
  let life = critterState.values[index];
  if (life.x < 0.5) {
    return;
  }
  let critter = critters.values[index];
  let angle = uniforms.grid.w * critter.motion.y + critter.motion.x;
  let worldXZ = critter.anchor.xy + vec2f(
    cos(angle) * critter.anchor.z,
    sin(angle) * critter.anchor.w
  );
  if (
    distance(worldXZ, hit.value.xy)
      <= uniforms.rayOriginRadius.w + 0.12
  ) {
    critterState.values[index] = vec4f(
      0.0,
      uniforms.grid.w,
      uniforms.brush.x,
      0.0
    );
  }
}
`,qr=class e{constructor(e){this.random=Rr(2977782289),this.wasMoonlight=!1,this.lastElapsed=0,this.lastTimeOfDay=7,this.nextBirdSpawnAt=1/0,this.activeBirds=[],this.fishBindGroups=[[],[]],this.critterBindGroups=[],this.birdBindGroups=[],this.device=e.device,this.treeInstances=e.treeInstances,this.stateBuffers=e.stateBuffers,this.frameUniformBuffer=e.frameUniformBuffer,this.simUniformBuffer=e.simUniformBuffer,this.hitBuffer=e.hitBuffer,this.enabled=e.enabled??!1,this.previewBirdsPending=e.previewBirds??!1}static async create(t){let n=new e(t);return n.createBuffers(),await n.createPipelines(t.format),n.createBindGroups(),n.scheduleNextBird(0),n}createBuffers(){this.reefFishMesh=Lr(this.device,kn(),`reef butterflyfish`),this.blueTangMesh=Lr(this.device,An(),`blue tang`),this.critterMesh=Lr(this.device,jn(),`tiny tropical critter`),this.birdMesh=Lr(this.device,Mn(),`white palm glider`),this.reefFishInstanceBuffer=Ir(this.device,zr(0),Dr.VERTEX|Dr.COPY_DST,`reef butterflyfish routes`),this.blueTangInstanceBuffer=Ir(this.device,zr(1),Dr.VERTEX|Dr.COPY_DST,`blue tang routes`),this.critterInstanceBuffer=Ir(this.device,Br(),Dr.VERTEX|Dr.STORAGE|Dr.COPY_DST,`tiny critter routes`),this.critterStateBuffer=Ir(this.device,Vr(),Dr.STORAGE|Dr.COPY_DST,`tiny critter life state`),this.birdInstanceBuffer=this.device.createBuffer({label:`intermittent white bird flights`,size:120*Float32Array.BYTES_PER_ELEMENT,usage:Dr.VERTEX|Dr.COPY_DST})}async checkedShader(e,t){let n=this.device.createShaderModule({label:e,code:t});if(typeof n.getCompilationInfo==`function`){let t=(await n.getCompilationInfo()).messages?.filter(e=>e.type===`error`)??[];if(t.length>0){let n=t.slice(0,8).map(e=>`${e.lineNum}:${e.linePos} ${e.message}`).join(`
`);throw Error(`${e} failed to compile:\n${n}`)}}return n}async createPipelines(e){let t={arrayStride:d,stepMode:`vertex`,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x3`},{shaderLocation:2,offset:24,format:`float32x4`}]},n={arrayStride:32,stepMode:`instance`,attributes:[{shaderLocation:3,offset:0,format:`float32x4`},{shaderLocation:4,offset:16,format:`float32x4`}]},r={arrayStride:48,stepMode:`instance`,attributes:[{shaderLocation:3,offset:0,format:`float32x4`},{shaderLocation:4,offset:16,format:`float32x4`},{shaderLocation:5,offset:32,format:`float32x4`}]},i={color:{srcFactor:`src-alpha`,dstFactor:`one-minus-src-alpha`,operation:`add`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`}},a=async(n,r,a,o)=>{let s=await this.checkedShader(n,r),c={label:n,layout:`auto`,vertex:{module:s,entryPoint:`vertexMain`,buffers:[t,a]},fragment:{module:s,entryPoint:`fragmentMain`,targets:[{format:e,blend:i,writeMask:15}]},primitive:{topology:`triangle-list`,frontFace:`ccw`,cullMode:`none`},depthStencil:{format:`depth24plus`,depthWriteEnabled:o,depthCompare:`less`},multisample:{count:1}};return typeof this.device.createRenderPipelineAsync==`function`?this.device.createRenderPipelineAsync(c):this.device.createRenderPipeline(c)};[this.fishPipeline,this.critterPipeline,this.birdPipeline]=await Promise.all([a(`animated tropical fish`,Ur,n,!1),a(`animated tiny tropical critters`,Wr,n,!0),a(`intermittent white palm gliders`,Gr,r,!0)]);let o={label:`critter dump interaction`,layout:`auto`,compute:{module:await this.checkedShader(`critter dump interaction`,Kr),entryPoint:`main`}};this.critterInteractionPipeline=typeof this.device.createComputePipelineAsync==`function`?await this.device.createComputePipelineAsync(o):this.device.createComputePipeline(o)}createBindGroups(){let e=(e,t)=>({binding:e,resource:{buffer:t}});for(let t=0;t<2;t+=1)this.fishBindGroups[t]=[this.device.createBindGroup({layout:this.fishPipeline.getBindGroupLayout(0),entries:[e(0,this.frameUniformBuffer),e(1,this.stateBuffers[t])]})],this.critterBindGroups[t]=this.device.createBindGroup({layout:this.critterPipeline.getBindGroupLayout(0),entries:[e(0,this.frameUniformBuffer),e(1,this.stateBuffers[t]),e(2,this.critterStateBuffer)]}),this.birdBindGroups[t]=this.device.createBindGroup({layout:this.birdPipeline.getBindGroupLayout(0),entries:[e(0,this.frameUniformBuffer),e(1,this.stateBuffers[t])]});this.critterInteractionBindGroup=this.device.createBindGroup({layout:this.critterInteractionPipeline.getBindGroupLayout(0),entries:[e(0,this.simUniformBuffer),e(1,this.hitBuffer),e(2,this.critterInstanceBuffer),e(3,this.critterStateBuffer)]})}setEnabled(e){this.enabled!==e&&(this.enabled=e,e?this.scheduleNextBird(this.lastElapsed):(this.activeBirds=[],this.uploadBirdFlights(),this.nextBirdSpawnAt=1/0))}get isEnabled(){return this.enabled}update(e,t,n){if(this.lastElapsed=e,this.lastTimeOfDay=t,!this.enabled||n)return;let r=!1,i=this.activeBirds.filter(t=>e<t.spawnTime+t.duration);if(i.length!==this.activeBirds.length&&(this.activeBirds=i,r=!0),this.isMoonlight(t))this.wasMoonlight||(this.nextBirdSpawnAt=1/0),this.wasMoonlight=!0;else if((this.wasMoonlight||!Number.isFinite(this.nextBirdSpawnAt))&&this.scheduleNextBird(e),this.wasMoonlight=!1,this.previewBirdsPending){this.previewBirdsPending=!1;for(let t=0;t<3;t+=1)r=this.spawnBird(e+t*.45)||r}else e>=this.nextBirdSpawnAt&&(r=this.spawnBird(e)||r,this.scheduleNextBird(e));r&&this.uploadBirdFlights()}encodeInteraction(e){if(!this.enabled)return;let t=e.beginComputePass({label:`kill tiny critters beneath dumped material`});t.setPipeline(this.critterInteractionPipeline),t.setBindGroup(0,this.critterInteractionBindGroup),t.dispatchWorkgroups(1),t.end()}renderAquatic(e,t){this.enabled&&(e.setPipeline(this.fishPipeline),e.setBindGroup(0,this.fishBindGroups[t][0]),e.setVertexBuffer(0,this.reefFishMesh.vertexBuffer),e.setVertexBuffer(1,this.reefFishInstanceBuffer),e.setIndexBuffer(this.reefFishMesh.indexBuffer,`uint32`),e.drawIndexed(this.reefFishMesh.indexCount,10),e.setVertexBuffer(0,this.blueTangMesh.vertexBuffer),e.setVertexBuffer(1,this.blueTangInstanceBuffer),e.setIndexBuffer(this.blueTangMesh.indexBuffer,`uint32`),e.drawIndexed(this.blueTangMesh.indexCount,10))}renderTerrestrial(e,t){this.enabled&&(e.setPipeline(this.critterPipeline),e.setBindGroup(0,this.critterBindGroups[t]),e.setVertexBuffer(0,this.critterMesh.vertexBuffer),e.setVertexBuffer(1,this.critterInstanceBuffer),e.setIndexBuffer(this.critterMesh.indexBuffer,`uint32`),e.drawIndexed(this.critterMesh.indexCount,10),this.activeBirds.length>0&&(e.setPipeline(this.birdPipeline),e.setBindGroup(0,this.birdBindGroups[t]),e.setVertexBuffer(0,this.birdMesh.vertexBuffer),e.setVertexBuffer(1,this.birdInstanceBuffer),e.setIndexBuffer(this.birdMesh.indexBuffer,`uint32`),e.drawIndexed(this.birdMesh.indexCount,this.activeBirds.length)))}reset(e=this.lastElapsed){this.device.queue.writeBuffer(this.critterStateBuffer,0,Vr()),this.activeBirds=[],this.uploadBirdFlights(),this.previewBirdsPending=!1,this.wasMoonlight=this.isMoonlight(this.lastTimeOfDay),this.scheduleNextBird(e)}getStatus(){let e=Number.isFinite(this.nextBirdSpawnAt)?Math.max(0,this.nextBirdSpawnAt-this.lastElapsed):null;return{enabled:this.enabled,reefButterflyfish:10,blueTangs:10,liveCritterCapacity:10,activeBirds:this.activeBirds.length,birdPoolCapacity:10,nextBirdSpawnInSeconds:e}}isMoonlight(e){return e<kr[1]||e>=kr[0]}scheduleNextBird(e){if(!this.enabled||this.isMoonlight(this.lastTimeOfDay)){this.nextBirdSpawnAt=1/0;return}let[t,n]=Or;this.nextBirdSpawnAt=e+t+this.random()*(n-t)}spawnBird(e){if(this.activeBirds.length>=10)return!1;let t=this.treeInstances.length/4;if(t<2)return!1;let n=Math.floor(this.random()*t),r=n*4,i=this.treeInstances[r],a=this.treeInstances[r+1],o=this.treeInstances[r+3],s=[];for(let e=0;e<t;e+=1){if(e===n)continue;let t=e*4,r=this.treeInstances[t]-i,o=this.treeInstances[t+1]-a,c=Math.hypot(r,o);c>=10&&c<=30&&s.push(e)}if(s.length===0)return!1;let c=s[Math.floor(this.random()*s.length)]*4,l=this.treeInstances[c],u=this.treeInstances[c+1],d=this.treeInstances[c+3],f=Math.hypot(l-i,u-a),p=Math.max(2.8,f/(5.1+this.random()*1.4));return this.activeBirds.push({startX:i,startZ:a,startScale:o,spawnTime:e,endX:l,endZ:u,endScale:d,duration:p,lateralArc:(this.random()-.5)*Math.min(6,f*.22),verticalArc:1.8+this.random()*2.4,scale:.82+this.random()*.24,seed:this.random()*1e3}),!0}uploadBirdFlights(){let e=new Float32Array(120);for(let t=0;t<this.activeBirds.length;t+=1){let n=this.activeBirds[t],r=t*Mr;e.set([n.startX,n.startZ,n.startScale,n.spawnTime,n.endX,n.endZ,n.endScale,n.duration,n.lateralArc,n.verticalArc,n.scale,n.seed],r)}this.device.queue.writeBuffer(this.birdInstanceBuffer,0,e)}destroy(){let e=[this.reefFishMesh?.vertexBuffer,this.reefFishMesh?.indexBuffer,this.blueTangMesh?.vertexBuffer,this.blueTangMesh?.indexBuffer,this.critterMesh?.vertexBuffer,this.critterMesh?.indexBuffer,this.birdMesh?.vertexBuffer,this.birdMesh?.indexBuffer,this.reefFishInstanceBuffer,this.blueTangInstanceBuffer,this.critterInstanceBuffer,this.critterStateBuffer,this.birdInstanceBuffer];for(let t of e)t?.destroy?.()}},z={MAP_READ:1,COPY_SRC:4,COPY_DST:8,INDEX:16,VERTEX:32,UNIFORM:64,STORAGE:128},Jr={TEXTURE_BINDING:4,RENDER_ATTACHMENT:16},Yr={READ:1},B=288,Xr=1296,Zr=96,Qr=12,$r=4,ei=2,ti=3,ni=6,ri=15,ii=30,ai=Xr,oi=.02,si=1024,ci=8,li=64,ui=.2,di=B*B,fi=90,pi=64,mi=2.2,hi=1/30,gi=18,_i=8,vi=4096,yi=1,bi=.65,xi=.018,Si=14,Ci=8,wi=Ci*Float32Array.BYTES_PER_ELEMENT,Ti=8,Ei=Ti*Float32Array.BYTES_PER_ELEMENT,Di=.075,Oi=72,ki=6,Ai=15552,ji=76,V=260,H=88,Mi=7,Ni=12,Pi=720,Fi=[`natural`,`oil`,`monet`,`watercolor`],Ii={natural:0,oil:1,monet:2,watercolor:3};function Li(e){let t=e?.trim().toLowerCase();return t?t===`natural`||t===`none`||t===`off`?`natural`:t===`oil`||t===`impasto`?`oil`:t===`monet`||t===`impressionist`?`monet`:t===`watercolor`||t===`watercolour`?`watercolor`:null:null}function Ri(e){return Array.from({length:e},()=>({phase:`safe`,burnExposure:0,burnStartedAt:-1}))}function zi(e,t){return Math.ceil(e/t)*t}function Bi(e,t,n){let r=Math.max(0,Math.min(1,(n-e)/Math.max(1e-6,t-e)));return r*r*(3-2*r)}function Vi(e,t,n,r){let i=zi(t.byteLength,4),a=e.createBuffer({label:r,size:i,usage:n,mappedAtCreation:!0});return new Uint8Array(a.getMappedRange()).set(new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),a.unmap(),a}function Hi(e,t,n){return{vertexBuffer:Vi(e,t.vertices,z.VERTEX|z.COPY_DST,`${n} vertices`),indexBuffer:Vi(e,t.indices,z.INDEX|z.COPY_DST,`${n} indices`),indexCount:t.indices.length}}function Ui(e,t,n,r=0){return Vi(e,t,z.VERTEX|z.COPY_DST|r,n)}function Wi(...e){let t=new Float32Array(B*B);t.fill(-2);for(let n of e)for(let e=0;e<n.length;e+=4){let r=n[e],i=n[e+1],a=Math.max(0,Math.min(287,Math.round((r/224+.5)*287))),o=Math.max(0,Math.min(287,Math.round((i/224+.5)*287)));t[o*B+a]=1}return t}function Gi(e){return Math.max(0,Math.min(287,Math.round((e/224+.5)*287)))}function Ki(e){if(e.length>si)throw Error(`Wall layout requires ${e.length} blocks; capacity is ${si}.`);let t=new Float32Array(si*ci);for(let n=0;n<e.length;n+=1){let r=e[n],i=n*ci;t[i]=Gi(r.center[0]),t[i+1]=Gi(r.center[1]),t[i+2]=-1e3,t[i+3]=10+r.rotation,t[i+4]=Math.min(1,r.initialHealth),t[i+5]=-5,t[i+6]=0,t[i+7]=r.height}return t}function U(e,t){return{binding:t,resource:{buffer:e}}}var qi=class e{constructor(e,t,n,r,i,a){this.format=`bgra8unorm`,this.resizeObserver=null,this.animationFrame=0,this.destroyed=!1,this.failed=!1,this.paused=!0,this.started=!1,this.resetRequested=!1,this.debugWaterRemoved=!1,this.brushRadius=3.3,this.brushAmount=xi*20,this.manipulationRate=20,this.timeOfDay=Mi,this.springOutputMultiplier=Ni,this.erosionStrength=1,this.localLightVisibility=0,this.visualStyle=`natural`,this.painterlyStrength=1,this.painterlyStrokeScale=1,this.stateBuffers=[],this.soilStateBuffers=[],this.erosionMemoryBuffers=[],this.elementBuffers=[],this.vegetationBuffers=[],this.waterTileStateBuffers=[],this.waterConnectivityBuffers=[],this.waterTopologyConvergenceReadPending=!1,this.waterTopologyConvergenceCopyQueued=!1,this.waterDiagnosticsReadPending=!1,this.wallDiagnosticsReadPending=!1,this.wallSeedCount=0,this.wallRenderModeBuffers=[],this.reservoirReadPending=!1,this.hutDynamicsReadPending=!1,this.eventReadPending=!1,this.flowAudioReadPending=!1,this.hitReadPending=!1,this.sceneColorTexture=null,this.sceneColorView=null,this.painterlyBindGroup=null,this.fauna=null,this.stateIndex=0,this.soilStateIndex=0,this.erosionMemoryIndex=0,this.soilTick=0,this.elementIndex=0,this.vegetationIndex=0,this.sandTick=0,this.waterOpennessTicksSinceUpdate=0,this.waterTileStateIndex=0,this.waterConnectivityWorkIndex=0,this.waterTopologyDirty=!0,this.waterTopologyIterationsRemaining=0,this.waterTopologyIterationsThisFrame=0,this.waterTopologyConverged=!1,this.waterTopologyGeneration=0,this.waterTopologyRefreshTicks=fi,this.localLightTicksSinceUpdate=ki,this.localLightDirty=!0,this.vegetationAccumulator=0,this.wallMaintenanceAccumulator=0,this.accumulator=0,this.lastTime=0,this.startTime=0,this.fpsAccumulator=0,this.fpsFrames=0,this.fps=0,this.frameTimeMs=0,this.lastStatsTime=0,this.lastReservoirReadTime=0,this.lastHutDynamicsReadTime=0,this.lastEventReadTime=0,this.lastFlowAudioReadTime=0,this.lastWaterDiagnosticsReadTime=0,this.lastWallDiagnosticsReadTime=0,this.lastHitReadTime=0,this.sandReservoir=0,this.dirtReservoir=0,this.waterReservoir=0,this.lavaReservoir=0,this.oilReservoir=0,this.springSourceDepth=0,this.lavaSourceDepth=0,this.lavaSourceReach=0,this.lavaSourceSolidHeight=0,this.activeWaterTileCount=0,this.sleepingFiniteTileCount=Xr,this.oceanConnectedTileCount=0,this.newlyWokenWaterTiles=0,this.pendingWaterWakeQueueLength=0,this.waterQueueWorkThisFrame=0,this.finiteWaterVolumeError=0,this.oceanBoundaryInflow=0,this.oceanBoundaryOutflow=0,this.maximumWaterFlux=0,this.maximumSpongeSurfaceResidual=0,this.activeErosionTileCount=0,this.activeSedimentTileCount=0,this.externalSedimentSink=0,this.inlandEdgeWaterSink=0,this.cumulativeThinFilmInfiltration=0,this.wallBuildMode=!1,this.wallBuildRequested=!1,this.intactWallBlocks=0,this.damagedWallBlocks=0,this.rubbleWallBlocks=0,this.successfulWallBuilds=0,this.rejectedWallBuilds=0,this.maximumWallDamageStep=0,this.wallDiagnosticsGeneration=0,this.npcDeaths=0,this.hutCollapses=0,this.gpuHutCollapseEvents=0,this.explosions=0,this.hutLifecycle=[],this.hutLifecycleGeneration=0,this.handLock=0,this.latestHitFresh=!1,this.latestHitVisible=!1,this.latestHitInsideEditableArea=!1,this.latestHitMaterial=0,this.latestHitDepth=0,this.pendingDumpSound=null,this.audio=new $t({ambient:!0,volume:.58,seed:1414087749}),this.music=new sn({volume:.12,seed:1297437513}),this.ambientClips=new gn({volume:.09,seed:1095582281}),this.musicVolume=.12,this.lastMusicOutputVolume=-1,this.lastAmbientClipVolume=-1,this.manipulationSoundActive=!1,this.msaaTexture=null,this.depthTexture=null,this.treeInstanceCount=0,this.groundVegetationInstanceCount=0,this.hutInstanceCount=0,this.campfireInstanceCount=0,this.pipelines={},this.bindGroups={},this.rayBindGroups=[],this.brushBindGroups=[],this.dumpBindGroups=[],this.waterFluxBindGroups=[],this.waterUpdateBindGroups=[],this.waterTopologySeedBindGroups=[],this.waterTopologyPropagateBindGroups=[],this.waterTileMetricsBindGroups=[],this.waterTileScheduleBindGroups=[],this.waterOpennessBindGroups=[],this.thinFilmInfiltrationBindGroups=[],this.elementFluxBindGroups=[],this.elementUpdateBindGroups=[],this.sandFluxBindGroups=[],this.sandApplyBindGroups=[],this.soilTransportBindGroups=[],this.erosionDepositionBindGroups=[],this.dirtFluxBindGroups=[],this.dirtApplyBindGroups=[],this.vegetationBindGroups=[],this.terrainBindGroups=[],this.plantContactShadowBindGroups=[],this.groundContactShadowBindGroups=[],this.hutContactShadowBindGroups=[],this.treeShadowBindGroups=[],this.hutShadowBindGroups=[],this.npcShadowBindGroups=[],this.waterBindGroups=[],this.elementBindGroups=[],this.localLightBindGroups=[],this.localLightSeedBindGroups=[],this.fireBindGroups=[],this.smokeBindGroups=[],this.hutBindGroups=[],this.campfireBindGroups=[],this.campfireFlameBindGroups=[],this.npcUpdateBindGroups=[],this.npcBindGroups=[],this.hutMonitorBindGroups=[],this.campfireUpdateBindGroups=[],this.flowAudioBindGroups=[],this.hutDebrisBindGroups=[],this.treeBindGroups=[],this.wallInitializeBindGroups=[],this.wallBuildBindGroups=[],this.wallUpdateBindGroups=[],this.wallCollapseDepositBindGroups=[],this.wallEdgeRasterizeBindGroups=[],this.wallRenderBindGroups=[],this.pressedKeys=new Set,this.pointerReleaseTimer=null,this.dumpLatch=!1,this.camera={yaw:-.8,pitch:.59,distance:146,target:[0,5.3,2],position:[0,0,0],right:[1,0,0],up:[0,1,0],viewProjection:new Float32Array(16),inverseViewProjection:new Float32Array(16)},this.pointer={ndcX:0,ndcY:0,lastX:0,lastY:0,action:0,orbiting:!1,pointerId:null},this.frame=e=>{if(this.destroyed)return;let t=Math.max(0,(e-this.lastTime)/1e3),n=Math.min(t,.08);this.lastTime=e;let r=(e-this.startTime)/1e3;this.frameTimeMs=t*1e3,this.resetRequested&&(this.resetRequested=!1,this.resetSimulation()),this.paused||(this.accumulator+=n,this.vegetationAccumulator+=n,this.wallMaintenanceAccumulator+=n,this.timeOfDay=(this.timeOfDay+n*24/Pi)%24),this.updateCameraPan(n),this.updateCamera(),this.writeUniforms(hi,r),this.fauna?.update(r,this.timeOfDay,this.paused),this.syncManipulationSound();let i=this.device.createCommandEncoder({label:`simulation and render frame`});this.encodeComputePass(i,`terrain raycast`,this.pipelines.raycast,this.rayBindGroups[this.stateIndex][this.elementIndex][this.soilStateIndex],1,1),this.fauna?.encodeInteraction(i);let a=!1;!this.hitReadPending&&e-this.lastHitReadTime>(this.pointer.action===0?90:24)&&(i.copyBufferToBuffer(this.hitBuffer,0,this.hitReadbackBuffer,0,32),this.lastHitReadTime=e,a=!0,this.hitReadPending=!0);let o=this.wallBuildMode&&this.wallBuildRequested;this.wallBuildRequested=!1,o&&(this.encodeComputePass(i,`build one discrete wall block`,this.pipelines.wallBuild,this.wallBuildBindGroups[this.stateIndex],1,1),this.encodeComputePass(i,`clear hydraulic edges after wall build`,this.pipelines.wallEdgeClear,this.bindGroups.wallEdgeClear),this.encodeComputePass(i,`rasterize hydraulic edges after wall build`,this.pipelines.wallEdgeRasterize,this.wallEdgeRasterizeBindGroups[this.stateIndex],Math.ceil(si/64),1),this.waterTopologyDirty=!0,this.pointer.action=0);let s=this.wallBuildMode?0:this.pointer.action;!this.wallBuildMode&&this.pointer.action===2?(this.encodeComputePass(i,`empty material hand`,this.pipelines.dump,this.dumpBindGroups[this.stateIndex][this.elementIndex][this.soilStateIndex],1,1),this.pointer.action=0):!this.wallBuildMode&&this.pointer.action!==0&&this.encodeComputePass(i,`material hand`,this.pipelines.brush,this.brushBindGroups[this.stateIndex][this.elementIndex][this.soilStateIndex]),s!==0&&(this.waterTopologyDirty=!0);let c=!this.paused&&this.wallMaintenanceAccumulator>=ui;c&&(i.clearBuffer(this.wallDiagnosticsBuffer,Uint32Array.BYTES_PER_ELEMENT,Uint32Array.BYTES_PER_ELEMENT*4),this.encodeComputePass(i,`update destructible wall support`,this.pipelines.wallUpdate,this.wallUpdateBindGroups[this.stateIndex][this.soilStateIndex][this.elementIndex],Math.ceil(si/64),1),this.encodeComputePass(i,`apply collapsed walls as loose sand`,this.pipelines.wallCollapseDeposit,this.wallCollapseDepositBindGroups[this.stateIndex][this.soilStateIndex]),this.encodeComputePass(i,`clear hydraulic wall edges`,this.pipelines.wallEdgeClear,this.bindGroups.wallEdgeClear),this.encodeComputePass(i,`rasterize intact hydraulic wall edges`,this.pipelines.wallEdgeRasterize,this.wallEdgeRasterizeBindGroups[this.stateIndex],Math.ceil(si/64),1),this.wallMaintenanceAccumulator%=ui),this.encodeWaterTopology(i),!this.paused&&this.accumulator>=hi&&(this.encodeComputePass(i,`measure localized water tiles`,this.pipelines.waterTileMetrics,this.waterTileMetricsBindGroups[this.stateIndex][this.soilStateIndex][this.erosionMemoryIndex],Xr,1),this.encodeComputePass(i,`schedule bounded localized water work`,this.pipelines.waterTileSchedule,this.waterTileScheduleBindGroups[this.waterTileStateIndex],1,1),this.waterTileStateIndex=1-this.waterTileStateIndex);let l=0;for(;!this.paused&&this.accumulator>=hi&&l<ei;){if(this.encodeComputePass(i,`water flux`,this.pipelines.waterFlux,this.waterFluxBindGroups[this.stateIndex][this.waterTileStateIndex]),this.encodeComputePass(i,`water update`,this.pipelines.waterUpdate,this.waterUpdateBindGroups[this.stateIndex][this.elementIndex][this.waterTileStateIndex]),this.encodeComputePass(i,`conservative soil sediment transport`,this.pipelines.soilTransport,this.soilTransportBindGroups[this.stateIndex][this.soilStateIndex][this.waterTileStateIndex]),this.stateIndex=1-this.stateIndex,this.soilStateIndex=1-this.soilStateIndex,this.soilTick+=1,this.activeSedimentTileCount=Math.min(Xr,this.activeWaterTileCount),this.soilTick%ti===0&&(this.encodeComputePass(i,`sustained hydraulic erosion and deposition`,this.pipelines.erosionDeposition,this.erosionDepositionBindGroups[this.stateIndex][this.soilStateIndex][this.erosionMemoryIndex][this.vegetationIndex][this.waterTileStateIndex]),this.stateIndex=1-this.stateIndex,this.soilStateIndex=1-this.soilStateIndex,this.erosionMemoryIndex=1-this.erosionMemoryIndex,this.activeErosionTileCount=Math.min(Xr,this.activeWaterTileCount)),this.soilTick%ni===0){let e=this.dirtFluxBindGroups[this.stateIndex][this.soilStateIndex][this.erosionMemoryIndex][this.vegetationIndex][this.waterTileStateIndex];this.encodeComputePass(i,`cohesive dirt collapse flux`,this.pipelines.dirtFlux,e),this.encodeComputePass(i,`cohesive dirt collapse apply`,this.pipelines.dirtApply,this.dirtApplyBindGroups[this.stateIndex][this.soilStateIndex][this.erosionMemoryIndex][this.vegetationIndex][this.waterTileStateIndex]),this.stateIndex=1-this.stateIndex,this.soilStateIndex=1-this.soilStateIndex}this.activeWaterTileCount>0&&this.soilTick%ii===0&&(this.waterTopologyDirty=!0),this.encodeComputePass(i,`lava and oil flux`,this.pipelines.elementFlux,this.elementFluxBindGroups[this.stateIndex][this.elementIndex]),this.encodeComputePass(i,`elemental reactions`,this.pipelines.elementUpdate,this.elementUpdateBindGroups[this.stateIndex][this.elementIndex][this.vegetationIndex]),this.stateIndex=1-this.stateIndex,this.elementIndex=1-this.elementIndex,this.soilTick%ri===0&&this.encodeComputePass(i,`delayed stagnant thin-film infiltration`,this.pipelines.thinFilmInfiltration,this.thinFilmInfiltrationBindGroups[this.stateIndex]),this.sandTick+=1,--this.waterTopologyRefreshTicks,this.waterTopologyRefreshTicks<=0&&(this.waterTopologyDirty=!0,this.waterTopologyRefreshTicks=fi),this.waterOpennessTicksSinceUpdate+=1,this.localLightTicksSinceUpdate+=1,this.sandTick%2==0&&(this.encodeComputePass(i,`sand slippage flux`,this.pipelines.sandFlux,this.sandFluxBindGroups[this.stateIndex][this.soilStateIndex]),this.encodeComputePass(i,`sand slippage apply`,this.pipelines.sandApply,this.sandApplyBindGroups[this.stateIndex][this.soilStateIndex]),this.stateIndex=1-this.stateIndex),this.encodeComputePass(i,`wandering NPC update`,this.pipelines.npcUpdate,this.npcUpdateBindGroups[this.stateIndex][this.elementIndex],1,1),this.accumulator-=hi,l+=1}if(!this.paused&&this.waterOpennessTicksSinceUpdate>=gi&&(this.encodeComputePass(i,`refresh cached water openness`,this.pipelines.waterOpenness,this.waterOpennessBindGroups[this.stateIndex]),this.waterOpennessTicksSinceUpdate=0),l===ei&&this.accumulator>hi*ei&&(this.accumulator=hi),!this.paused&&this.vegetationAccumulator>=.35&&(this.encodeComputePass(i,`vegetation growth`,this.pipelines.vegetation,this.vegetationBindGroups[this.stateIndex][this.vegetationIndex][this.soilStateIndex]),this.vegetationIndex=1-this.vegetationIndex,this.vegetationAccumulator=0),this.paused||(this.encodeComputePass(i,`hut stability monitor`,this.pipelines.hutMonitor,this.hutMonitorBindGroups[this.stateIndex][this.elementIndex],1,1),this.encodeComputePass(i,`village campfire update`,this.pipelines.campfireUpdate,this.campfireUpdateBindGroups[this.stateIndex][this.elementIndex],1,1)),this.localLightVisibility>.008&&(this.localLightDirty||this.localLightTicksSinceUpdate>=ki)){let e=Math.ceil(Oi/_i);this.encodeComputePass(i,`seed cached local lights`,this.pipelines.localLightSeed,this.localLightSeedBindGroups[this.elementIndex],e,e),this.encodeComputePass(i,`blur local lights horizontally`,this.pipelines.localLightBlurHorizontal,this.localLightBlurHorizontalBindGroup,e,e),this.encodeComputePass(i,`blur local lights vertically`,this.pipelines.localLightBlurVertical,this.localLightBlurVerticalBindGroup,e,e),this.localLightTicksSinceUpdate=0,this.localLightDirty=!1}let u=!1;!this.reservoirReadPending&&e-this.lastReservoirReadTime>(this.pointer.action>0?24:100)&&(i.copyBufferToBuffer(this.reservoirBuffer,0,this.reservoirReadbackBuffer,0,32),this.lastReservoirReadTime=e,u=!0,this.reservoirReadPending=!0);let d=!1,f=this.hutLifecycleGeneration;!this.hutDynamicsReadPending&&e-this.lastHutDynamicsReadTime>160&&(i.copyBufferToBuffer(this.hutDynamicsBuffer,0,this.hutDynamicsReadbackBuffer,0,this.hutInstanceCount*wi),this.lastHutDynamicsReadTime=e,d=!0,this.hutDynamicsReadPending=!0);let p=!1;!this.eventReadPending&&e-this.lastEventReadTime>180&&(i.copyBufferToBuffer(this.eventCounterBuffer,0,this.eventReadbackBuffer,0,16),this.lastEventReadTime=e,p=!0,this.eventReadPending=!0);let m=!1;!this.flowAudioReadPending&&e-this.lastFlowAudioReadTime>220&&(this.device.queue.writeBuffer(this.flowAudioBuffer,0,new Uint32Array(8)),this.encodeComputePass(i,`local liquid flow audio`,this.pipelines.flowAudioProbe,this.flowAudioBindGroups[this.stateIndex][this.elementIndex]),i.copyBufferToBuffer(this.flowAudioBuffer,0,this.flowAudioReadbackBuffer,0,32),this.lastFlowAudioReadTime=e,m=!0,this.flowAudioReadPending=!0);let h=!1,g=this.waterTopologyGeneration;l>0&&!this.waterDiagnosticsReadPending&&e-this.lastWaterDiagnosticsReadTime>320&&(i.copyBufferToBuffer(this.waterDiagnosticsBuffer,0,this.waterDiagnosticsReadbackBuffer,0,pi),this.lastWaterDiagnosticsReadTime=e,h=!0,this.waterDiagnosticsReadPending=!0);let _=!1,v=this.wallDiagnosticsGeneration;(c||o)&&!this.wallDiagnosticsReadPending&&e-this.lastWallDiagnosticsReadTime>180&&(i.copyBufferToBuffer(this.wallDiagnosticsBuffer,0,this.wallDiagnosticsReadbackBuffer,0,li),this.lastWallDiagnosticsReadTime=e,_=!0,this.wallDiagnosticsReadPending=!0),this.encodeRender(i),this.device.queue.submit([i.finish()]),this.waterTopologyConvergenceCopyQueued&&this.readWaterTopologyConvergence(this.waterTopologyGeneration),u&&this.readReservoirs(),a&&this.readManipulationHit(),d&&this.readHutDynamics(f),p&&this.readWorldEvents(),m&&this.readFlowAudio(),h&&this.readWaterDiagnostics(g),_&&this.readWallDiagnostics(v),this.fpsAccumulator+=t,this.fpsFrames+=1,this.fpsAccumulator>=.5&&(this.fps=Math.round(this.fpsFrames/this.fpsAccumulator),this.fpsAccumulator=0,this.fpsFrames=0),e-this.lastStatsTime>=220&&(this.lastStatsTime=e,this.publishStats()),this.animationFrame=requestAnimationFrame(this.frame)},this.onPointerDown=e=>{this.pointerReleaseTimer!==null&&(window.clearTimeout(this.pointerReleaseTimer),this.pointerReleaseTimer=null),this.updatePointerCoordinates(e),this.pointer.lastX=e.clientX,this.pointer.lastY=e.clientY,this.pointer.pointerId=e.pointerId,this.canvas.setPointerCapture(e.pointerId);let t=this.carriedMaterialVolume()>.001,n=(e.buttons&3)==3;this.wallBuildMode&&e.button===0&&!e.altKey&&!n?(this.wallBuildRequested=!0,this.pointer.action=3,this.pointer.orbiting=!1):n?(!this.dumpLatch&&t?(this.pointer.action=2,this.playWholeHandDumpSound()):t||(this.pointer.action=0),this.dumpLatch=!0,this.pointer.orbiting=!1):this.dumpLatch?this.pointer.action=0:e.button===1||e.button===0&&e.altKey?(this.pointer.orbiting=!0,this.pointer.action=0):e.button===0?this.pointer.action=-1:e.button===2&&!this.wallBuildMode?this.pointer.action=+!!t:this.pointer.action=0,e.preventDefault()},this.onPointerMove=e=>{if(this.updatePointerCoordinates(e),!this.wallBuildMode&&(e.buttons&3)==3&&!this.dumpLatch){this.dumpLatch=!0,this.pointer.orbiting=!1;let e=this.carriedMaterialVolume()>.001;this.pointer.action=e?2:0,e&&this.playWholeHandDumpSound()}else this.dumpLatch&&e.buttons!==0&&(this.pointer.orbiting=!1,this.pointer.action=0);if(this.pointer.orbiting&&this.pointer.pointerId===e.pointerId){let t=e.clientX-this.pointer.lastX,n=e.clientY-this.pointer.lastY;this.camera.yaw-=t*.0054,this.camera.pitch=Math.max(.25,Math.min(1.18,this.camera.pitch+n*.0048))}this.pointer.lastX=e.clientX,this.pointer.lastY=e.clientY},this.onPointerUp=e=>{if(this.pointer.pointerId===e.pointerId){if(e.buttons!==0){this.pointer.action=0;return}this.dumpLatch=!1,this.pointer.orbiting=!1,this.pointer.pointerId=null,this.canvas.hasPointerCapture(e.pointerId)&&this.canvas.releasePointerCapture(e.pointerId),this.schedulePointerRelease()}},this.onWheel=e=>{this.camera.distance=Math.max(ji,Math.min(V,this.camera.distance*Math.exp(e.deltaY*.0011))),e.preventDefault()},this.onContextMenu=e=>{e.preventDefault(),this.updatePointerCoordinates(e)},this.onKeyDown=e=>{let t=e.key.toLowerCase(),n=e.target;if(n instanceof HTMLElement&&n.getAttribute(`role`)===`slider`)return;if(t===`[`||t===`]`){this.setManipulationRate(this.manipulationRate+(t===`]`?1:-1)),e.preventDefault();return}let r=e.target;if(r instanceof HTMLInputElement&&(r.id===`manipulation-rate`||r.id===`music-volume`)&&(t===`arrowleft`||t===`arrowright`||t===`arrowup`||t===`arrowdown`))e.preventDefault(),r.blur();else if(r instanceof HTMLInputElement||r instanceof HTMLTextAreaElement||r instanceof HTMLSelectElement||r instanceof HTMLButtonElement)return;if(t===`w`||t===`a`||t===`s`||t===`d`){this.pressedKeys.add(t),e.repeat||this.panCamera(t===`w`?1:t===`s`?-1:0,t===`d`?1:t===`a`?-1:0,1.75*Math.max(.7,Math.min(1.45,this.camera.distance/146))),e.preventDefault();return}if(!e.repeat){if(t===`0`||t===`1`||t===`2`||t===`3`){let n=Number(t);this.setVisualStyle(Fi[n]??`natural`),e.preventDefault();return}if(t===`p`){this.cycleVisualStyle(),e.preventDefault();return}t===`r`?this.reset():e.key===` `?(this.setPaused(!this.paused),e.preventDefault()):t===`arrowleft`?(this.camera.yaw-=.13,e.preventDefault()):t===`arrowright`?(this.camera.yaw+=.13,e.preventDefault()):t===`arrowup`?(this.camera.distance=Math.max(ji,this.camera.distance-10),e.preventDefault()):t===`arrowdown`&&(this.camera.distance=Math.min(V,this.camera.distance+10),e.preventDefault())}},this.onKeyUp=e=>{this.pressedKeys.delete(e.key.toLowerCase())},this.onWindowBlur=()=>{this.pressedKeys.clear(),this.dumpLatch=!1,this.pointer.action=0,this.stopManipulationSound()},this.canvas=e,this.options=t,this.mapKind=t.mapKind??`coastal`,this.mapProfile=Fn(this.mapKind),this.simulationMargin=this.mapKind===`inland`?Math.max(0,112-this.mapProfile.edge.editableHalfExtent):22,this.navigatorGpu=n,this.device=r,this.context=i,this.format=a,this.visualStyle=t.visualStyle??`natural`,this.painterlyStrength=Math.max(0,Math.min(1.25,t.painterlyStrength??1)),this.painterlyStrokeScale=Math.max(.55,Math.min(1.8,t.painterlyStrokeScale??1))}static async create(t,n={}){let r=navigator.gpu;if(!r)throw Error(`This demo needs WebGPU. Open it in an up-to-date Chrome, Edge, or another WebGPU-capable browser.`);let i=await r.requestAdapter();if(!i)throw Error(`A WebGPU graphics adapter was not available. Check browser hardware acceleration and try again.`);if((i.limits?.maxStorageBuffersPerShaderStage??8)<10)throw Error(`This simulation needs a WebGPU adapter with at least 10 storage buffers per shader stage.`);let a=await i.requestDevice({requiredLimits:{maxStorageBuffersPerShaderStage:10}}),o=t.getContext(`webgpu`);if(!o)throw Error(`The browser could not create a WebGPU canvas.`);let s=r.getPreferredCanvasFormat();o.configure({device:a,format:s,alphaMode:`opaque`});let c=new e(t,n,r,a,o,s);return await c.initialize(),c}async initialize(){this.device.lost.then(e=>{this.destroyed||this.fail(`The graphics device was lost${e?.message?`: ${e.message}`:`.`}`)}),this.device.addEventListener?.(`uncapturederror`,e=>{let t=e?.error?.message??`Unknown WebGPU validation error`;this.fail(t)});let e=new URLSearchParams(this.canvas.ownerDocument.defaultView?.location.search??``),t=Li(e.get(`style`));t&&(this.visualStyle=t);let n=e.get(`paintStrength`);if(n!==null){let e=Number(n);Number.isFinite(e)&&(this.painterlyStrength=Math.max(0,Math.min(1.25,e)))}let r=e.get(`strokeScale`);if(r!==null){let e=Number(r);Number.isFinite(e)&&(this.painterlyStrokeScale=Math.max(.55,Math.min(1.8,e)))}this.createBuffersAndMeshes(),await this.createPipelines(),this.createBindGroups(),await Promise.all([this.music.prepare(),this.ambientClips.prepare()]),this.installInput(),this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(this.canvas),this.resize(),this.updateCamera(),this.writeUniforms(hi,0),this.resetSimulation(),this.fauna=await qr.create({device:this.device,format:this.format,frameUniformBuffer:this.frameUniformBuffer,simUniformBuffer:this.simUniformBuffer,hitBuffer:this.hitBuffer,stateBuffers:this.stateBuffers,treeInstances:this.treeInstancesSeed,enabled:this.options.faunaEnabled??e.get(`fauna`)===`1`,previewBirds:e.get(`faunaPreview`)===`1`}),this.startTime=performance.now(),this.lastTime=this.startTime,this.lastStatsTime=this.startTime,this.options.onReady?.(),this.animationFrame=requestAnimationFrame(this.frame)}createBuffersAndMeshes(){let e=B*B,t=e*4*Float32Array.BYTES_PER_ELEMENT,n=e*Float32Array.BYTES_PER_ELEMENT,r=20736*Float32Array.BYTES_PER_ELEMENT,i=z.STORAGE|z.COPY_SRC|z.COPY_DST,a=xr(this.mapKind);this.wallBlockSeed=Ki(a),this.wallSeedCount=a.length,this.intactWallBlocks=this.wallSeedCount,this.stateBuffers=[this.device.createBuffer({label:`state A`,size:t,usage:i}),this.device.createBuffer({label:`state B`,size:t,usage:i})],this.soilStateBuffers=[this.device.createBuffer({label:`soil state A`,size:t,usage:i}),this.device.createBuffer({label:`soil state B`,size:t,usage:i})],this.erosionMemoryBuffers=[this.device.createBuffer({label:`erosion memory A`,size:n,usage:i}),this.device.createBuffer({label:`erosion memory B`,size:n,usage:i})],this.dirtFluxBuffer=this.device.createBuffer({label:`cohesive dirt collapse flux`,size:t,usage:i}),this.elementBuffers=[this.device.createBuffer({label:`elements A`,size:t,usage:i}),this.device.createBuffer({label:`elements B`,size:t,usage:i})],this.vegetationBuffers=[this.device.createBuffer({label:`vegetation A`,size:n,usage:i}),this.device.createBuffer({label:`vegetation B`,size:n,usage:i})],this.groundwaterBuffer=this.device.createBuffer({label:`optional mission aquifer field`,size:n,usage:i}),this.waterFluxBuffer=this.device.createBuffer({label:`water directional flux`,size:t,usage:i}),this.externalBoundaryFluxBuffer=this.device.createBuffer({label:`actual external water boundary exchange`,size:n,usage:i}),this.thinFilmAgeBuffer=this.device.createBuffer({label:`persistent stagnant thin-film age`,size:n,usage:i});let o=Xr*4*Uint32Array.BYTES_PER_ELEMENT,s=Xr*8*Float32Array.BYTES_PER_ELEMENT,c=e*4*Uint32Array.BYTES_PER_ELEMENT;this.waterTileStateBuffers=[this.device.createBuffer({label:`water tile state A`,size:o,usage:i}),this.device.createBuffer({label:`water tile state B`,size:o,usage:i})],this.waterTileMetricsBuffer=this.device.createBuffer({label:`water tile metrics`,size:s,usage:i}),this.waterWorkBuffer=this.device.createBuffer({label:`bounded water wake queue work`,size:64,usage:i}),this.waterConnectivityBuffers=[0,1,2].map(e=>this.device.createBuffer({label:e===2?`confirmed water connectivity`:`water connectivity work ${e===0?`A`:`B`}`,size:c,usage:i})),this.waterTopologyConvergenceBuffer=this.device.createBuffer({label:`water topology convergence flag`,size:16,usage:i}),this.waterTopologyConvergenceReadbackBuffer=this.device.createBuffer({label:`water topology convergence readback`,size:16,usage:z.COPY_DST|z.MAP_READ}),this.waterDiagnosticsBuffer=this.device.createBuffer({label:`localized water diagnostics`,size:pi,usage:i}),this.waterDiagnosticsReadbackBuffer=this.device.createBuffer({label:`localized water diagnostics readback`,size:pi,usage:z.COPY_DST|z.MAP_READ}),this.wallBlockBuffer=Vi(this.device,this.wallBlockSeed,i,`compact destructible wall blocks`),this.wallEdgeBuffer=this.device.createBuffer({label:`hydraulic wall edge crests`,size:e*4*Uint32Array.BYTES_PER_ELEMENT,usage:i}),this.wallCollapseDepositBuffer=this.device.createBuffer({label:`pending wall collapse loose sand`,size:e*Uint32Array.BYTES_PER_ELEMENT,usage:i});let l=new Uint32Array(li/Uint32Array.BYTES_PER_ELEMENT);l[0]=this.wallSeedCount,this.wallDiagnosticsBuffer=Vi(this.device,l,i,`bounded wall diagnostics`),this.wallDiagnosticsReadbackBuffer=this.device.createBuffer({label:`bounded wall diagnostics readback`,size:li,usage:z.COPY_DST|z.MAP_READ}),this.wallRenderModeBuffers=[0,1,2,3].map(e=>Vi(this.device,new Uint32Array([e,0,0,0]),z.UNIFORM|z.COPY_DST,`wall render mode ${e}`)),this.sandFluxBuffer=this.device.createBuffer({label:`sand directional flux`,size:t,usage:i}),this.elementFluxBuffer=this.device.createBuffer({label:`lava and oil directional flux`,size:t,usage:i}),this.localLightFieldBuffer=this.device.createBuffer({label:`cached local light field`,size:r,usage:i}),this.localLightScratchBuffer=this.device.createBuffer({label:`local light blur scratch`,size:r,usage:i}),this.reservoirBuffer=this.device.createBuffer({label:`material reservoir`,size:32,usage:i}),this.reservoirReadbackBuffer=this.device.createBuffer({label:`material reservoir readback`,size:32,usage:z.COPY_DST|z.MAP_READ}),this.npcBuffer=Vi(this.device,Er(this.mapKind),i,`wandering NPC state`);let u=wr(this.mapKind).length/4*wi;this.hutDynamicsBuffer=this.device.createBuffer({label:`hut burn and collapse state`,size:u,usage:i}),this.hutDynamicsReadbackBuffer=this.device.createBuffer({label:`hut lifecycle readback`,size:u,usage:z.COPY_DST|z.MAP_READ}),this.campfireDynamicsBuffer=this.device.createBuffer({label:`campfire light and collapse state`,size:Rn*Ei,usage:i}),this.eventCounterBuffer=this.device.createBuffer({label:`world event counters`,size:16,usage:i}),this.eventReadbackBuffer=this.device.createBuffer({label:`world event readback`,size:16,usage:z.COPY_DST|z.MAP_READ}),this.flowAudioBuffer=this.device.createBuffer({label:`local liquid flow audio probe`,size:32,usage:i}),this.flowAudioReadbackBuffer=this.device.createBuffer({label:`local liquid flow audio readback`,size:32,usage:z.COPY_DST|z.MAP_READ}),this.hitBuffer=this.device.createBuffer({label:`terrain ray hit`,size:32,usage:i}),this.hitReadbackBuffer=this.device.createBuffer({label:`terrain ray hit readback`,size:32,usage:z.COPY_DST|z.MAP_READ}),this.simUniformBuffer=this.device.createBuffer({label:`simulation uniforms`,size:128,usage:z.UNIFORM|z.COPY_DST}),this.frameUniformBuffer=this.device.createBuffer({label:`frame uniforms`,size:256,usage:z.UNIFORM|z.COPY_DST}),this.painterlyUniformBuffer=this.device.createBuffer({label:`procedural painterly uniforms`,size:32,usage:z.UNIFORM|z.COPY_DST}),this.painterlySampler=this.device.createSampler({label:`procedural painterly scene sampler`,addressModeU:`clamp-to-edge`,addressModeV:`clamp-to-edge`,magFilter:`linear`,minFilter:`linear`}),this.gridMesh=Hi(this.device,de({width:224,depth:224,columns:159,rows:159}),`render LOD terrain grid`),this.skyMesh=Hi(this.device,de({width:224,depth:224,columns:1,rows:1}),`fullscreen sky quad`),this.oceanMesh=Hi(this.device,de({width:3584,depth:3584,columns:128,rows:128}),`far ocean continuation`),this.localLightMesh=Hi(this.device,de({width:224,depth:224,columns:71,rows:71}),`coarse local light grid`),this.palmMesh=Hi(this.device,fe({height:5.5,frondCount:12,variation:7.4}),`palm`),this.groundVegetationMesh=Hi(this.device,pe(),`low ground vegetation`),this.hutMesh=Hi(this.device,he({width:2.55,height:3.65,variation:2.8,flag:!1}),`hut`),this.campfireMesh=Hi(this.device,ge({radius:.82,variation:6.4}),`communal campfire`),this.villagerMesh=Hi(this.device,_e({height:1.76,variation:4.8}),`villager`),this.hutDebrisMesh=Hi(this.device,ve(),`hut debris`),this.wallBlockMesh=Hi(this.device,ye(),`destructible curtain wall block`),this.wallTowerMesh=Hi(this.device,be(),`destructible wall tower`),this.ringMesh=Hi(this.device,xe({radius:1,thickness:.105,height:.032}),`brush ring`),this.particleMesh=Hi(this.device,Se({width:1,height:1,doubleSided:!0}),`hand particles`);let d=Sr(this.mapKind);this.treeInstancesSeed=d;let f=Cr(this.mapKind),p=wr(this.mapKind),m=Tr(this.mapKind);this.treeInstanceCount=d.length/4,this.groundVegetationInstanceCount=f.length/4,this.hutInstanceCount=p.length/4,this.campfireInstanceCount=m.length/4,this.hutLifecycle=Ri(this.hutInstanceCount),this.treeFuelMaskSeed=Wi(d,f),this.treeFuelMaskBuffer=Vi(this.device,this.treeFuelMaskSeed,z.STORAGE|z.COPY_DST,`exact tree fuel mask`),this.treeInstanceBuffer=Ui(this.device,d,`tree instances`,z.STORAGE),this.groundVegetationInstanceBuffer=Ui(this.device,f,`low ground vegetation instances`,z.STORAGE),this.hutInstanceBuffer=Ui(this.device,p,`hut instances`,z.STORAGE),this.campfireInstanceBuffer=Ui(this.device,m,`campfire instances`,z.STORAGE)}async checkedShader(e,t){let n=this.device.createShaderModule({label:e,code:t});if(typeof n.getCompilationInfo==`function`){let t=(await n.getCompilationInfo()).messages?.filter(e=>e.type===`error`)??[];if(t.length>0){let n=t.slice(0,8).map(e=>`${e.lineNum}:${e.linePos} ${e.message}`).join(`
`);throw Error(`${e} failed to compile:\n${n}`)}}return n}async createComputePipeline(e,t){let n={label:e,layout:`auto`,compute:{module:await this.checkedShader(e,t),entryPoint:`main`}};return typeof this.device.createComputePipelineAsync==`function`?this.device.createComputePipelineAsync(n):this.device.createComputePipeline(n)}async createRenderPipeline(e,t,n={}){let r=await this.checkedShader(e,t),i={label:e,layout:`auto`,vertex:{module:r,entryPoint:`vertexMain`,buffers:n.vertexBuffers??[]},fragment:{module:r,entryPoint:`fragmentMain`,targets:[{format:this.format,blend:n.blend,writeMask:15}]},primitive:{topology:`triangle-list`,frontFace:`ccw`,cullMode:n.cullMode??`none`},depthStencil:n.depthWrite===void 0?void 0:{format:`depth24plus`,depthWriteEnabled:n.depthWrite,depthCompare:n.depthCompare??`less`},multisample:{count:yi}};return typeof this.device.createRenderPipelineAsync==`function`?this.device.createRenderPipelineAsync(i):this.device.createRenderPipeline(i)}async createPipelines(){let e={arrayStride:d,stepMode:`vertex`,attributes:[{shaderLocation:0,offset:0,format:`float32x3`}]},t={arrayStride:d,stepMode:`vertex`,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x3`},{shaderLocation:2,offset:24,format:`float32x4`}]},n={arrayStride:16,stepMode:`instance`,attributes:[{shaderLocation:3,offset:0,format:`float32x4`}]},r={color:{srcFactor:`src-alpha`,dstFactor:`one-minus-src-alpha`,operation:`add`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`}},i={color:{srcFactor:`src-alpha`,dstFactor:`one`,operation:`add`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`}},a=await Promise.all([this.createComputePipeline(`Initialize landscape`,Pe),this.createComputePipeline(`Initialize soil composition`,Bt),this.createComputePipeline(`GPU terrain raycast`,Fe),this.createComputePipeline(`Material hand brush`,Ie),this.createComputePipeline(`Empty material hand`,Le),this.createComputePipeline(`Debug drain all water`,Ue),this.createComputePipeline(`Water flux`,He),this.createComputePipeline(`Water update`,We),this.createComputePipeline(`Conservative sediment transport`,Vt),this.createComputePipeline(`Hydraulic erosion and deposition`,Ht),this.createComputePipeline(`Cohesive dirt collapse flux`,Wt),this.createComputePipeline(`Cohesive dirt collapse apply`,Gt),this.createComputePipeline(`Seed water topology`,Re),this.createComputePipeline(`Propagate water topology`,ze),this.createComputePipeline(`Measure water tiles`,Be),this.createComputePipeline(`Schedule water tiles`,Ve),this.createComputePipeline(`Cached water openness`,Qe),this.createComputePipeline(`Thin-film infiltration`,Ze),this.createComputePipeline(`Elemental liquid flux`,$e),this.createComputePipeline(`Elemental reactions`,et),this.createComputePipeline(`Sand slippage flux`,nt),this.createComputePipeline(`Sand slippage apply`,rt),this.createComputePipeline(`Vegetation growth`,it),this.createComputePipeline(`Wandering NPC update`,at),this.createComputePipeline(`Hut stability monitor`,ot),this.createComputePipeline(`Village campfire update`,st),this.createComputePipeline(`Seed local light field`,pt),this.createComputePipeline(`Blur local lights horizontally`,mt),this.createComputePipeline(`Blur local lights vertically`,ht),this.createComputePipeline(`Local flow audio probe`,tt),this.createComputePipeline(`Initialize wall foundations`,Ge),this.createComputePipeline(`Build one wall block`,Ke),this.createComputePipeline(`Update wall support`,qe),this.createComputePipeline(`Deposit collapsed wall sand`,Xe),this.createComputePipeline(`Clear wall hydraulic edges`,Je),this.createComputePipeline(`Rasterize wall hydraulic edges`,Ye)]);[this.pipelines.init,this.pipelines.soilInitialization,this.pipelines.raycast,this.pipelines.brush,this.pipelines.dump,this.pipelines.waterDrain,this.pipelines.waterFlux,this.pipelines.waterUpdate,this.pipelines.soilTransport,this.pipelines.erosionDeposition,this.pipelines.dirtFlux,this.pipelines.dirtApply,this.pipelines.waterTopologySeed,this.pipelines.waterTopologyPropagate,this.pipelines.waterTileMetrics,this.pipelines.waterTileSchedule,this.pipelines.waterOpenness,this.pipelines.thinFilmInfiltration,this.pipelines.elementFlux,this.pipelines.elementUpdate,this.pipelines.sandFlux,this.pipelines.sandApply,this.pipelines.vegetation,this.pipelines.npcUpdate,this.pipelines.hutMonitor,this.pipelines.campfireUpdate,this.pipelines.localLightSeed,this.pipelines.localLightBlurHorizontal,this.pipelines.localLightBlurVertical,this.pipelines.flowAudioProbe,this.pipelines.wallInitialize,this.pipelines.wallBuild,this.pipelines.wallUpdate,this.pipelines.wallCollapseDeposit,this.pipelines.wallEdgeClear,this.pipelines.wallEdgeRasterize]=a;let o=await Promise.all([this.createRenderPipeline(`Atmospheric sky`,ct,{vertexBuffers:[e],depthWrite:!1,depthCompare:`always`}),this.createRenderPipeline(`Far ocean continuation`,lt,{vertexBuffers:[e],depthWrite:!1,depthCompare:`always`}),this.createRenderPipeline(`Terrain surface`,ut,{vertexBuffers:[e],depthWrite:!0,cullMode:`back`,blend:r}),this.createRenderPipeline(`Plant contact shadows`,xt,{vertexBuffers:[e,n],depthWrite:!1,blend:r}),this.createRenderPipeline(`Low-cover contact shadows`,St,{vertexBuffers:[e,n],depthWrite:!1,blend:r}),this.createRenderPipeline(`Hut contact shadows`,Ct,{vertexBuffers:[e,n],depthWrite:!1,blend:r}),this.createRenderPipeline(`Palm soft shadows`,wt,{vertexBuffers:[e,n],depthWrite:!1,blend:r}),this.createRenderPipeline(`Hut soft shadows`,Tt,{vertexBuffers:[e,n],depthWrite:!1,blend:r}),this.createRenderPipeline(`Islander soft shadows`,Et,{vertexBuffers:[e],depthWrite:!1,blend:r}),this.createRenderPipeline(`Water surface`,dt,{vertexBuffers:[e],depthWrite:!1,blend:r}),this.createRenderPipeline(`Lava and oil surfaces`,ft,{vertexBuffers:[e],depthWrite:!1,blend:r}),this.createRenderPipeline(`Night local light pools`,gt,{vertexBuffers:[e],depthWrite:!1,depthCompare:`less-equal`,blend:i}),this.createRenderPipeline(`Spreading fire`,_t,{vertexBuffers:[e],depthWrite:!1,depthCompare:`always`,blend:i}),this.createRenderPipeline(`Procedural combustion smoke`,vt,{vertexBuffers:[e],depthWrite:!1,blend:r}),this.createRenderPipeline(`Growing palm trees`,Mt,{vertexBuffers:[t,n],depthWrite:!0,cullMode:`back`}),this.createRenderPipeline(`Static huts`,Nt,{vertexBuffers:[t,n],depthWrite:!0,cullMode:`none`}),this.createRenderPipeline(`Village campfires`,At,{vertexBuffers:[t,n],depthWrite:!0,cullMode:`none`}),this.createRenderPipeline(`Village campfire flames`,jt,{vertexBuffers:[e],depthWrite:!1,blend:i}),this.createRenderPipeline(`Hut collapse debris`,Pt,{vertexBuffers:[t],depthWrite:!0,cullMode:`none`}),this.createRenderPipeline(`Wandering islanders`,Ft,{vertexBuffers:[t],depthWrite:!0,cullMode:`none`}),this.createRenderPipeline(`Destructible wall structures`,kt,{vertexBuffers:[t],depthWrite:!0,cullMode:`none`}),this.createRenderPipeline(`Brush cursor`,It,{vertexBuffers:[e],depthWrite:!1,depthCompare:`always`,blend:r}),this.createRenderPipeline(`Hand particles`,Lt,{vertexBuffers:[e],depthWrite:!1,depthCompare:`always`,blend:r}),this.createRenderPipeline(`Procedural painterly post-process`,Rt)]);[this.pipelines.sky,this.pipelines.ocean,this.pipelines.terrain,this.pipelines.plantContactShadow,this.pipelines.groundContactShadow,this.pipelines.hutContactShadow,this.pipelines.treeShadow,this.pipelines.hutShadow,this.pipelines.npcShadow,this.pipelines.water,this.pipelines.element,this.pipelines.localLight,this.pipelines.fire,this.pipelines.smoke,this.pipelines.tree,this.pipelines.hut,this.pipelines.campfire,this.pipelines.campfireFlame,this.pipelines.hutDebris,this.pipelines.npc,this.pipelines.wall,this.pipelines.cursor,this.pipelines.particle,this.pipelines.painterly]=o}createBindGroups(){this.bindGroups.init=this.device.createBindGroup({label:`initialize bindings`,layout:this.pipelines.init.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[0],1),U(this.stateBuffers[1],2),U(this.waterFluxBuffer,3),U(this.sandFluxBuffer,4),U(this.vegetationBuffers[0],5),U(this.vegetationBuffers[1],6),U(this.groundwaterBuffer,7),U(this.elementBuffers[0],8),U(this.elementBuffers[1],9),U(this.elementFluxBuffer,10)]}),this.waterDrainBindGroup=this.device.createBindGroup({label:`debug water drain bindings`,layout:this.pipelines.waterDrain.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[0],1),U(this.stateBuffers[1],2)]});for(let e=0;e<2;e+=1)this.localLightSeedBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.localLightSeed.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.elementBuffers[e],1),U(this.hutInstanceBuffer,2),U(this.hutDynamicsBuffer,3),U(this.localLightFieldBuffer,4)]});this.localLightBlurHorizontalBindGroup=this.device.createBindGroup({layout:this.pipelines.localLightBlurHorizontal.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.localLightFieldBuffer,1),U(this.localLightScratchBuffer,2)]}),this.localLightBlurVerticalBindGroup=this.device.createBindGroup({layout:this.pipelines.localLightBlurVertical.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.localLightScratchBuffer,1),U(this.localLightFieldBuffer,2)]}),this.bindGroups.soilInitialization=[0,1].map(e=>this.device.createBindGroup({label:`initialize soil ${e===0?`A`:`B`} bindings`,layout:this.pipelines.soilInitialization.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[0],1),U(this.soilStateBuffers[e],2),U(this.erosionMemoryBuffers[e],3),U(this.dirtFluxBuffer,4)]})),this.bindGroups.wallEdgeClear=this.device.createBindGroup({label:`clear hydraulic wall edges`,layout:this.pipelines.wallEdgeClear.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.wallEdgeBuffer,1)]});for(let e=0;e<2;e+=1){this.waterTopologyPropagateBindGroups[e]=[];for(let t=0;t<2;t+=1)this.waterTopologyPropagateBindGroups[e][t]=this.device.createBindGroup({layout:this.pipelines.waterTopologyPropagate.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.waterConnectivityBuffers[t],1),U(this.waterConnectivityBuffers[1-t],2),U(this.waterTopologyConvergenceBuffer,3),U(this.stateBuffers[e],4),U(this.wallEdgeBuffer,5)]})}for(let e=0;e<2;e+=1)this.waterTileScheduleBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.waterTileSchedule.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.waterTileMetricsBuffer,1),U(this.waterTileStateBuffers[e],2),U(this.waterTileStateBuffers[1-e],3),U(this.waterWorkBuffer,4),U(this.waterDiagnosticsBuffer,5),U(this.hitBuffer,6)]});for(let e=0;e<2;e+=1){let t=1-e;this.waterTopologySeedBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.waterTopologySeed.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.waterConnectivityBuffers[0],2),U(this.wallEdgeBuffer,3)]}),this.waterTileMetricsBindGroups[e]=[];for(let t=0;t<2;t+=1){this.waterTileMetricsBindGroups[e][t]=[];for(let n=0;n<2;n+=1)this.waterTileMetricsBindGroups[e][t][n]=this.device.createBindGroup({layout:this.pipelines.waterTileMetrics.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.waterFluxBuffer,2),U(this.waterConnectivityBuffers[2],3),U(this.waterTileMetricsBuffer,4),U(this.soilStateBuffers[t],5),U(this.erosionMemoryBuffers[n],6)]})}this.waterFluxBindGroups[e]=[];for(let t=0;t<2;t+=1)this.waterFluxBindGroups[e][t]=this.device.createBindGroup({layout:this.pipelines.waterFlux.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.waterFluxBuffer,2),U(this.waterTileStateBuffers[t],3),U(this.waterDiagnosticsBuffer,4),U(this.wallEdgeBuffer,5)]});this.waterUpdateBindGroups[e]=[],this.waterOpennessBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.waterOpenness.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.waterFluxBuffer,2),U(this.sandFluxBuffer,3)]}),this.thinFilmInfiltrationBindGroups[e]=this.device.createBindGroup({label:`delayed finite thin-film infiltration`,layout:this.pipelines.thinFilmInfiltration.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.waterFluxBuffer,2),U(this.thinFilmAgeBuffer,3),U(this.waterConnectivityBuffers[2],4),U(this.waterDiagnosticsBuffer,5)]}),this.sandFluxBindGroups[e]=[],this.sandApplyBindGroups[e]=[],this.terrainBindGroups[e]=[];for(let n=0;n<2;n+=1)this.sandFluxBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.sandFlux.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.sandFluxBuffer,2),U(this.soilStateBuffers[n],3)]}),this.sandApplyBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.sandApply.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.sandFluxBuffer,2),U(this.stateBuffers[t],3),U(this.soilStateBuffers[n],4)]}),this.terrainBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.terrain.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.hitBuffer,2),U(this.sandFluxBuffer,3),U(this.soilStateBuffers[n],4)]});this.waterBindGroups[e]=[];for(let t=0;t<2;t+=1)this.waterBindGroups[e][t]=this.device.createBindGroup({layout:this.pipelines.water.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.waterFluxBuffer,2),U(this.sandFluxBuffer,3),U(this.soilStateBuffers[t],4),U(this.waterConnectivityBuffers[2],5)]});this.hutBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.hut.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.hutDynamicsBuffer,2)]}),this.campfireBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.campfire.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.campfireDynamicsBuffer,2)]}),this.campfireFlameBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.campfireFlame.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.campfireInstanceBuffer,2),U(this.campfireDynamicsBuffer,3)]}),this.hutShadowBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.hutShadow.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.hutDynamicsBuffer,2)]}),this.hutContactShadowBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.hutContactShadow.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.hutDynamicsBuffer,2)]}),this.npcBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.npc.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.npcBuffer,2)]}),this.npcShadowBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.npcShadow.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.npcBuffer,2)]}),this.hutDebrisBindGroups[e]=this.device.createBindGroup({layout:this.pipelines.hutDebris.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.hutInstanceBuffer,2),U(this.hutDynamicsBuffer,3)]}),this.rayBindGroups[e]=[],this.brushBindGroups[e]=[],this.dumpBindGroups[e]=[],this.elementFluxBindGroups[e]=[],this.elementUpdateBindGroups[e]=[],this.elementBindGroups[e]=[],this.localLightBindGroups[e]=[],this.fireBindGroups[e]=[],this.smokeBindGroups[e]=[],this.npcUpdateBindGroups[e]=[],this.hutMonitorBindGroups[e]=[],this.campfireUpdateBindGroups[e]=[],this.flowAudioBindGroups[e]=[];for(let n=0;n<2;n+=1){let r=1-n;this.waterUpdateBindGroups[e][n]=[];for(let r=0;r<2;r+=1)this.waterUpdateBindGroups[e][n][r]=this.device.createBindGroup({layout:this.pipelines.waterUpdate.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.waterFluxBuffer,2),U(this.stateBuffers[t],3),U(this.groundwaterBuffer,4),U(this.elementBuffers[n],5),U(this.waterTileStateBuffers[r],6),U(this.waterConnectivityBuffers[2],7),U(this.waterDiagnosticsBuffer,8),U(this.externalBoundaryFluxBuffer,9),U(this.wallEdgeBuffer,10)]});this.rayBindGroups[e][n]=[],this.brushBindGroups[e][n]=[],this.dumpBindGroups[e][n]=[];for(let t=0;t<2;t+=1)this.rayBindGroups[e][n][t]=this.device.createBindGroup({layout:this.pipelines.raycast.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.hitBuffer,2),U(this.elementBuffers[n],3),U(this.soilStateBuffers[t],4)]}),this.brushBindGroups[e][n][t]=this.device.createBindGroup({layout:this.pipelines.brush.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.reservoirBuffer,2),U(this.hitBuffer,3),U(this.groundwaterBuffer,4),U(this.elementBuffers[n],5),U(this.soilStateBuffers[t],6)]}),this.dumpBindGroups[e][n][t]=this.device.createBindGroup({layout:this.pipelines.dump.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.reservoirBuffer,2),U(this.hitBuffer,3),U(this.elementBuffers[n],4),U(this.soilStateBuffers[t],5)]});this.elementFluxBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.elementFlux.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.elementBuffers[n],2),U(this.elementFluxBuffer,3),U(this.wallEdgeBuffer,4)]}),this.elementUpdateBindGroups[e][n]=[];for(let i=0;i<2;i+=1)this.elementUpdateBindGroups[e][n][i]=this.device.createBindGroup({layout:this.pipelines.elementUpdate.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.elementBuffers[n],2),U(this.elementFluxBuffer,3),U(this.elementBuffers[r],4),U(this.vegetationBuffers[i],5),U(this.eventCounterBuffer,6),U(this.stateBuffers[t],7),U(this.treeFuelMaskBuffer,8),U(this.wallEdgeBuffer,9)]});this.elementBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.element.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.elementBuffers[n],2)]}),this.localLightBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.localLight.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.elementBuffers[n],2),U(this.localLightFieldBuffer,3)]}),this.fireBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.fire.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.elementBuffers[n],2)]}),this.smokeBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.smoke.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.elementBuffers[n],2),U(this.treeFuelMaskBuffer,3)]}),this.npcUpdateBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.npcUpdate.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.npcBuffer,2),U(this.eventCounterBuffer,3),U(this.elementBuffers[n],4),U(this.hutInstanceBuffer,5),U(this.hutDynamicsBuffer,6)]}),this.hutMonitorBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.hutMonitor.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.hutInstanceBuffer,2),U(this.hutDynamicsBuffer,3),U(this.eventCounterBuffer,4),U(this.elementBuffers[n],5)]}),this.campfireUpdateBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.campfireUpdate.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.campfireInstanceBuffer,2),U(this.campfireDynamicsBuffer,3),U(this.elementBuffers[n],4),U(this.npcBuffer,5)]}),this.flowAudioBindGroups[e][n]=this.device.createBindGroup({layout:this.pipelines.flowAudioProbe.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.elementBuffers[n],2),U(this.waterFluxBuffer,3),U(this.elementFluxBuffer,4),U(this.flowAudioBuffer,5)]})}this.vegetationBindGroups[e]=[],this.treeBindGroups[e]=[],this.plantContactShadowBindGroups[e]=[],this.groundContactShadowBindGroups[e]=[],this.treeShadowBindGroups[e]=[];for(let t=0;t<2;t+=1){let n=1-t;this.vegetationBindGroups[e][t]=[];for(let r=0;r<2;r+=1)this.vegetationBindGroups[e][t][r]=this.device.createBindGroup({layout:this.pipelines.vegetation.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.vegetationBuffers[t],2),U(this.vegetationBuffers[n],3),U(this.treeFuelMaskBuffer,4),U(this.soilStateBuffers[r],5)]});this.treeBindGroups[e][t]=[],this.plantContactShadowBindGroups[e][t]=[],this.groundContactShadowBindGroups[e][t]=[],this.treeShadowBindGroups[e][t]=[];for(let n=0;n<2;n+=1)this.treeBindGroups[e][t][n]=this.device.createBindGroup({layout:this.pipelines.tree.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.vegetationBuffers[t],2),U(this.elementBuffers[n],3),U(this.treeFuelMaskBuffer,4)]}),this.treeShadowBindGroups[e][t][n]=this.device.createBindGroup({layout:this.pipelines.treeShadow.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.vegetationBuffers[t],2),U(this.elementBuffers[n],3)]}),this.plantContactShadowBindGroups[e][t][n]=this.device.createBindGroup({layout:this.pipelines.plantContactShadow.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.vegetationBuffers[t],2),U(this.elementBuffers[n],3)]}),this.groundContactShadowBindGroups[e][t][n]=this.device.createBindGroup({layout:this.pipelines.groundContactShadow.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.vegetationBuffers[t],2),U(this.elementBuffers[n],3)]})}}for(let e=0;e<2;e+=1){let t=1-e;this.soilTransportBindGroups[e]=[],this.erosionDepositionBindGroups[e]=[],this.dirtFluxBindGroups[e]=[],this.dirtApplyBindGroups[e]=[];for(let n=0;n<2;n+=1){let r=1-n;this.soilTransportBindGroups[e][n]=[],this.erosionDepositionBindGroups[e][n]=[],this.dirtFluxBindGroups[e][n]=[],this.dirtApplyBindGroups[e][n]=[];for(let t=0;t<2;t+=1)this.soilTransportBindGroups[e][n][t]=this.device.createBindGroup({label:`bounded sediment transport bindings`,layout:this.pipelines.soilTransport.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.waterFluxBuffer,2),U(this.soilStateBuffers[n],3),U(this.soilStateBuffers[r],4),U(this.waterTileStateBuffers[t],5),U(this.waterConnectivityBuffers[2],6),U(this.waterDiagnosticsBuffer,7),U(this.externalBoundaryFluxBuffer,8),U(this.wallEdgeBuffer,9)]});for(let i=0;i<2;i+=1){let a=1-i;this.erosionDepositionBindGroups[e][n][i]=[],this.dirtFluxBindGroups[e][n][i]=[],this.dirtApplyBindGroups[e][n][i]=[];for(let o=0;o<2;o+=1){this.erosionDepositionBindGroups[e][n][i][o]=[],this.dirtFluxBindGroups[e][n][i][o]=[],this.dirtApplyBindGroups[e][n][i][o]=[];for(let s=0;s<2;s+=1)this.erosionDepositionBindGroups[e][n][i][o][s]=this.device.createBindGroup({label:`active-tile erosion bindings`,layout:this.pipelines.erosionDeposition.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.waterFluxBuffer,2),U(this.soilStateBuffers[n],3),U(this.erosionMemoryBuffers[i],4),U(this.vegetationBuffers[o],5),U(this.waterTileStateBuffers[s],6),U(this.stateBuffers[t],7),U(this.soilStateBuffers[r],8),U(this.erosionMemoryBuffers[a],9),U(this.wallEdgeBuffer,10)]}),this.dirtFluxBindGroups[e][n][i][o][s]=this.device.createBindGroup({label:`bounded dirt collapse flux bindings`,layout:this.pipelines.dirtFlux.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.soilStateBuffers[n],2),U(this.vegetationBuffers[o],3),U(this.erosionMemoryBuffers[i],4),U(this.waterTileStateBuffers[s],5),U(this.waterConnectivityBuffers[2],6),U(this.dirtFluxBuffer,7)]}),this.dirtApplyBindGroups[e][n][i][o][s]=this.device.createBindGroup({label:`bounded dirt collapse apply bindings`,layout:this.pipelines.dirtApply.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.soilStateBuffers[n],2),U(this.dirtFluxBuffer,3),U(this.vegetationBuffers[o],4),U(this.erosionMemoryBuffers[i],5),U(this.waterTileStateBuffers[s],6),U(this.waterConnectivityBuffers[2],7),U(this.stateBuffers[t],8),U(this.soilStateBuffers[r],9)]})}}}}for(let e=0;e<2;e+=1){this.wallInitializeBindGroups[e]=this.device.createBindGroup({label:`initialize authored wall foundations`,layout:this.pipelines.wallInitialize.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.wallBlockBuffer,2),U(this.wallDiagnosticsBuffer,3)]}),this.wallBuildBindGroups[e]=this.device.createBindGroup({label:`build a discrete wall block`,layout:this.pipelines.wallBuild.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.hitBuffer,2),U(this.wallBlockBuffer,3),U(this.wallDiagnosticsBuffer,4)]}),this.wallEdgeRasterizeBindGroups[e]=this.device.createBindGroup({label:`rasterize intact wall hydraulic crests`,layout:this.pipelines.wallEdgeRasterize.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.wallBlockBuffer,2),U(this.wallEdgeBuffer,3)]}),this.wallRenderBindGroups[e]=this.wallRenderModeBuffers.map((t,n)=>this.device.createBindGroup({label:`wall render mode ${n}`,layout:this.pipelines.wall.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.stateBuffers[e],1),U(this.wallBlockBuffer,2),U(t,3)]})),this.wallUpdateBindGroups[e]=[],this.wallCollapseDepositBindGroups[e]=[];for(let t=0;t<2;t+=1){this.wallUpdateBindGroups[e][t]=[],this.wallCollapseDepositBindGroups[e][t]=this.device.createBindGroup({label:`apply collapsed wall sand`,layout:this.pipelines.wallCollapseDeposit.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.soilStateBuffers[t],2),U(this.wallCollapseDepositBuffer,3)]});for(let n=0;n<2;n+=1)this.wallUpdateBindGroups[e][t][n]=this.device.createBindGroup({label:`bounded wall foundation stability`,layout:this.pipelines.wallUpdate.getBindGroupLayout(0),entries:[U(this.simUniformBuffer,0),U(this.stateBuffers[e],1),U(this.soilStateBuffers[t],2),U(this.wallBlockBuffer,4),U(this.wallDiagnosticsBuffer,5),U(this.wallCollapseDepositBuffer,6)]})}}this.bindGroups.cursor=this.device.createBindGroup({layout:this.pipelines.cursor.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.hitBuffer,1)]}),this.bindGroups.particle=this.device.createBindGroup({layout:this.pipelines.particle.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0),U(this.hitBuffer,1),U(this.reservoirBuffer,2)]}),this.bindGroups.sky=this.device.createBindGroup({layout:this.pipelines.sky.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0)]}),this.bindGroups.ocean=this.device.createBindGroup({layout:this.pipelines.ocean.getBindGroupLayout(0),entries:[U(this.frameUniformBuffer,0)]})}resize(){let e=Math.min(window.devicePixelRatio||1,1)*bi,t=Math.max(1,Math.floor(this.canvas.clientWidth*e)),n=Math.max(1,Math.floor(this.canvas.clientHeight*e));this.canvas.width===t&&this.canvas.height===n&&this.msaaTexture&&this.sceneColorTexture||(this.canvas.width=t,this.canvas.height=n,this.msaaTexture?.destroy(),this.depthTexture?.destroy(),this.sceneColorTexture?.destroy(),this.msaaTexture=this.device.createTexture({label:`MSAA color`,size:[t,n],sampleCount:yi,format:this.format,usage:Jr.RENDER_ATTACHMENT}),this.sceneColorTexture=this.device.createTexture({label:`painterly offscreen scene color`,size:[t,n],sampleCount:1,format:this.format,usage:Jr.RENDER_ATTACHMENT|Jr.TEXTURE_BINDING}),this.sceneColorView=this.sceneColorTexture.createView(),this.painterlyBindGroup=this.device.createBindGroup({label:`procedural painterly post-process bindings`,layout:this.pipelines.painterly.getBindGroupLayout(0),entries:[{binding:0,resource:this.sceneColorView},{binding:1,resource:this.painterlySampler},U(this.painterlyUniformBuffer,2)]}),this.depthTexture=this.device.createTexture({label:`depth`,size:[t,n],sampleCount:yi,format:`depth24plus`,usage:Jr.RENDER_ATTACHMENT}),this.updateCamera())}updateCamera(){let e=Math.max(.25,this.canvas.width/Math.max(1,this.canvas.height)),t=Math.cos(this.camera.pitch)*this.camera.distance,n=[Math.sin(this.camera.yaw)*t,Math.sin(this.camera.pitch)*this.camera.distance,Math.cos(this.camera.yaw)*t];this.camera.position=[this.camera.target[0]+n[0],this.camera.target[1]+n[1],this.camera.target[2]+n[2]];let r=Ee(Ce(this.camera.target,this.camera.position));this.camera.right=Ee(Te(r,[0,1,0])),this.camera.up=Ee(Te(this.camera.right,r));let i=Oe(this.camera.position,this.camera.target,[0,1,0]),a=De(43*Math.PI/180,e,.2,1500);this.camera.viewProjection=ke(a,i),this.camera.inverseViewProjection=Ae(this.camera.viewProjection),this.updateAmbientClipMix()}updateAmbientClipMix(){let e=this.timeOfDay<5||this.timeOfDay>=21;this.ambientClips.setQuietHours(e);let t=Bi(5,7,this.timeOfDay),n=1-Bi(19,21,this.timeOfDay),r=this.musicVolume*t*n;Math.abs(r-this.lastMusicOutputVolume)>=5e-4&&(this.lastMusicOutputVolume=r,this.music.setVolume(r));let i=1-Math.max(0,Math.min(1,(this.camera.distance-ji)/184)),a=.024+i*i*(3-2*i)*.086;Math.abs(a-this.lastAmbientClipVolume)<.0015||(this.lastAmbientClipVolume=a,this.ambientClips.setVolume(a))}updateCameraPan(e){let t=!!this.pressedKeys.has(`w`)-+!!this.pressedKeys.has(`s`),n=!!this.pressedKeys.has(`d`)-+!!this.pressedKeys.has(`a`);(t!==0||n!==0)&&this.panCamera(t,n,23*Math.max(.62,Math.min(1.55,this.camera.distance/146))*Math.min(e,.05))}panCamera(e,t,n){let r=[-Math.sin(this.camera.yaw),0,-Math.cos(this.camera.yaw)],i=[Math.cos(this.camera.yaw),0,-Math.sin(this.camera.yaw)],a=n/Math.max(1,Math.hypot(e,t)),o=this.camera.target[0]+(r[0]*e+i[0]*t)*a,s=this.camera.target[2]+(r[2]*e+i[2]*t)*a;this.camera.target=[Math.max(-H,Math.min(H,o)),this.camera.target[1],Math.max(-H,Math.min(H,s))]}pointerRay(){let e=this.camera.inverseViewProjection,t=je(e,[this.pointer.ndcX,this.pointer.ndcY,0,1]),n=je(e,[this.pointer.ndcX,this.pointer.ndcY,1,1]),r=[t[0]/t[3],t[1]/t[3],t[2]/t[3]];return{origin:r,direction:Ee(Ce([n[0]/n[3],n[1]/n[3],n[2]/n[3]],r))}}lightingState(){let e=(this.timeOfDay-6)/24*Math.PI*2,t=Ee([Math.cos(e),Math.sin(e),Math.cos(e+.85)*.36]),n=t[1],r=n>=0,i=r?t:[-t[0],-t[1],-t[2]],a=(e,t,n)=>{let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)},o=a(-.08,.14,n);if(!r){let e=-n;return{direction:i,color:[.43,.58,.88],intensity:a(.01,.2,e)*(.36+e*.12),dayFactor:o}}let s=1-a(.08,.52,n);return{direction:i,color:[1.1,.97-s*.29,.76-s*.49],intensity:a(.01,.18,n)*(.78+n*.24),dayFactor:o}}writeUniforms(e,t){let n=this.pointerRay(),r=this.lightingState();this.localLightVisibility=Math.max(0,1-r.dayFactor)**1.18;let i=new Float32Array(32);i.set([B,224/287,e,t],0),i.set([9.2,.91,.62,mi],4),i.set([n.origin[0],n.origin[1],n.origin[2],this.brushRadius],8),i.set([n.direction[0],n.direction[1],n.direction[2],this.brushAmount],12),i.set([this.pointer.action,-1,this.pointer.action===0?0:1,.35],16),i.set([224,vi,0,this.simulationMargin],20),i.set([this.camera.target[0],this.camera.target[2],this.camera.distance,this.timeOfDay/24],24),i[28]=+!!this.debugWaterRemoved,i[29]=this.springOutputMultiplier,i[30]=+(this.mapKind===`inland`),i[31]=this.erosionStrength,this.device.queue.writeBuffer(this.simUniformBuffer,0,i);let a=new Float32Array(64);a.set(this.camera.viewProjection,0),a.set(this.camera.inverseViewProjection,16),a.set([...this.camera.position,this.canvas.width/Math.max(1,this.canvas.height)],32),a.set([...this.camera.right,0],36),a.set([...this.camera.up,t],40),a.set([224,B,mi,this.timeOfDay/24],44),a.set([...r.direction,r.intensity],48),a.set([this.handLock,this.pointer.action,this.pointer.action===0?0:1,+(this.mapKind===`inland`)],52),a.set([150,330,this.manipulationRate,this.brushRadius],56),a.set([...r.color,r.dayFactor],60),this.device.queue.writeBuffer(this.frameUniformBuffer,0,a);let o=new Float32Array(8);o.set([this.canvas.width,this.canvas.height,t,Ii[this.visualStyle],this.painterlyStrength,this.painterlyStrokeScale,0,0],0),this.device.queue.writeBuffer(this.painterlyUniformBuffer,0,o)}resetSimulation(){this.debugWaterRemoved=!1,this.stateIndex=0,this.soilStateIndex=0,this.erosionMemoryIndex=0,this.soilTick=0,this.elementIndex=0,this.vegetationIndex=0,this.sandTick=0,this.waterOpennessTicksSinceUpdate=0,this.waterTileStateIndex=0,this.waterConnectivityWorkIndex=0,this.waterTopologyDirty=!0,this.waterTopologyIterationsRemaining=0,this.waterTopologyIterationsThisFrame=0,this.waterTopologyConverged=!1,this.waterTopologyGeneration+=1,this.waterTopologyConvergenceCopyQueued=!1,this.waterTopologyRefreshTicks=fi,this.activeWaterTileCount=0,this.sleepingFiniteTileCount=Xr,this.oceanConnectedTileCount=0,this.newlyWokenWaterTiles=0,this.pendingWaterWakeQueueLength=0,this.waterQueueWorkThisFrame=0,this.finiteWaterVolumeError=0,this.oceanBoundaryInflow=0,this.oceanBoundaryOutflow=0,this.maximumWaterFlux=0,this.maximumSpongeSurfaceResidual=0,this.activeErosionTileCount=0,this.activeSedimentTileCount=0,this.externalSedimentSink=0,this.inlandEdgeWaterSink=0,this.cumulativeThinFilmInfiltration=0,this.wallBuildMode=!1,this.wallBuildRequested=!1,this.wallMaintenanceAccumulator=0,this.intactWallBlocks=this.wallSeedCount,this.damagedWallBlocks=0,this.rubbleWallBlocks=0,this.successfulWallBuilds=0,this.rejectedWallBuilds=0,this.maximumWallDamageStep=0,this.wallDiagnosticsGeneration+=1,this.localLightTicksSinceUpdate=ki,this.localLightDirty=!0,this.accumulator=0,this.vegetationAccumulator=0,this.sandReservoir=0,this.dirtReservoir=0,this.waterReservoir=0,this.lavaReservoir=0,this.oilReservoir=0,this.handLock=0,this.timeOfDay=Mi,this.npcDeaths=0,this.hutCollapses=0,this.gpuHutCollapseEvents=0,this.explosions=0,this.hutLifecycleGeneration+=1,this.hutLifecycle=Ri(this.hutInstanceCount),this.pointer.action=0,this.dumpLatch=!1,this.stopManipulationSound(),this.device.queue.writeBuffer(this.reservoirBuffer,0,new Int32Array(8)),this.device.queue.writeBuffer(this.npcBuffer,0,Er(this.mapKind)),this.device.queue.writeBuffer(this.hutDynamicsBuffer,0,new Float32Array(this.hutInstanceCount*Ci)),this.device.queue.writeBuffer(this.campfireDynamicsBuffer,0,new Float32Array(this.campfireInstanceCount*Ti)),this.device.queue.writeBuffer(this.eventCounterBuffer,0,new Uint32Array(4)),this.device.queue.writeBuffer(this.flowAudioBuffer,0,new Uint32Array(8)),this.device.queue.writeBuffer(this.wallBlockBuffer,0,this.wallBlockSeed);let e=new Uint32Array(li/Uint32Array.BYTES_PER_ELEMENT);e[0]=this.wallSeedCount,this.device.queue.writeBuffer(this.wallDiagnosticsBuffer,0,e),this.device.queue.writeBuffer(this.treeFuelMaskBuffer,0,this.treeFuelMaskSeed),this.fauna?.reset(),this.audio.stopFlow();let t=this.device.createCommandEncoder({label:`reset landscape`});for(let e of this.waterTileStateBuffers)t.clearBuffer(e);t.clearBuffer(this.waterTileMetricsBuffer),t.clearBuffer(this.waterWorkBuffer);for(let e of this.waterConnectivityBuffers)t.clearBuffer(e);t.clearBuffer(this.waterTopologyConvergenceBuffer),t.clearBuffer(this.waterDiagnosticsBuffer),t.clearBuffer(this.externalBoundaryFluxBuffer),t.clearBuffer(this.thinFilmAgeBuffer),t.clearBuffer(this.wallEdgeBuffer),t.clearBuffer(this.wallCollapseDepositBuffer);for(let e of this.erosionMemoryBuffers)t.clearBuffer(e);t.clearBuffer(this.dirtFluxBuffer);let n=t.beginComputePass({label:`initialize terrain and materials`});n.setPipeline(this.pipelines.init),n.setBindGroup(0,this.bindGroups.init),n.dispatchWorkgroups(Math.ceil(B/_i),Math.ceil(B/_i)),n.end();for(let e=0;e<2;e+=1)this.encodeComputePass(t,`initialize soil composition ${e===0?`A`:`B`}`,this.pipelines.soilInitialization,this.bindGroups.soilInitialization[e]);this.encodeComputePass(t,`sample authored wall foundations`,this.pipelines.wallInitialize,this.wallInitializeBindGroups[0],Math.ceil(si/64),1),this.encodeComputePass(t,`clear initial hydraulic wall edges`,this.pipelines.wallEdgeClear,this.bindGroups.wallEdgeClear),this.encodeComputePass(t,`rasterize initial hydraulic wall edges`,this.pipelines.wallEdgeRasterize,this.wallEdgeRasterizeBindGroups[0],Math.ceil(si/64),1),this.encodeComputePass(t,`initialize cached water openness`,this.pipelines.waterOpenness,this.waterOpennessBindGroups[0]),this.device.queue.submit([t.finish()])}encodeComputePass(e,t,n,r,i=Math.ceil(B/_i),a=Math.ceil(B/_i)){let o=e.beginComputePass({label:t});o.setPipeline(n),o.setBindGroup(0,r),o.dispatchWorkgroups(i,a),o.end()}encodeWaterTopology(e){if(this.waterTopologyIterationsThisFrame=0,this.waterTopologyConvergenceCopyQueued=!1,this.waterTopologyConverged&&this.waterTopologyIterationsRemaining>0&&(e.copyBufferToBuffer(this.waterConnectivityBuffers[this.waterConnectivityWorkIndex],0,this.waterConnectivityBuffers[2],0,B*B*4*Uint32Array.BYTES_PER_ELEMENT),this.waterTopologyIterationsRemaining=0,this.waterTopologyConverged=!1),this.waterTopologyDirty&&this.waterTopologyIterationsRemaining===0&&(this.encodeComputePass(e,`seed dynamic water connectivity`,this.pipelines.waterTopologySeed,this.waterTopologySeedBindGroups[this.stateIndex]),this.waterConnectivityWorkIndex=0,this.waterTopologyIterationsRemaining=di,this.waterTopologyDirty=!1),this.waterTopologyIterationsRemaining===0||this.waterTopologyConvergenceReadPending)return;e.clearBuffer(this.waterTopologyConvergenceBuffer);let t=Math.min($r,this.waterTopologyIterationsRemaining);for(let n=0;n<t;n+=1)this.encodeComputePass(e,`bounded water connectivity propagation`,this.pipelines.waterTopologyPropagate,this.waterTopologyPropagateBindGroups[this.stateIndex][this.waterConnectivityWorkIndex]),this.waterConnectivityWorkIndex=1-this.waterConnectivityWorkIndex,--this.waterTopologyIterationsRemaining,this.waterTopologyIterationsThisFrame+=1;t>0&&(e.copyBufferToBuffer(this.waterTopologyConvergenceBuffer,0,this.waterTopologyConvergenceReadbackBuffer,0,16),this.waterTopologyConvergenceReadPending=!0,this.waterTopologyConvergenceCopyQueued=!0),this.waterTopologyIterationsRemaining===0&&(this.waterTopologyConverged=!0)}encodeRender(e){let t=this.context.getCurrentTexture().createView(),n=this.visualStyle!==`natural`,r=n?this.sceneColorView:t,i=e.beginRenderPass({label:`Terrain render`,colorAttachments:[{view:r,resolveTarget:void 0,clearValue:{r:.08,g:.43,b:.55,a:1},loadOp:`clear`,storeOp:`store`}],depthStencilAttachment:{view:this.depthTexture.createView(),depthClearValue:1,depthLoadOp:`clear`,depthStoreOp:`store`}});i.setPipeline(this.pipelines.sky),i.setBindGroup(0,this.bindGroups.sky),i.setVertexBuffer(0,this.skyMesh.vertexBuffer),i.setIndexBuffer(this.skyMesh.indexBuffer,`uint32`),i.drawIndexed(this.skyMesh.indexCount),i.setPipeline(this.pipelines.ocean),i.setBindGroup(0,this.bindGroups.ocean),i.setVertexBuffer(0,this.oceanMesh.vertexBuffer),i.setIndexBuffer(this.oceanMesh.indexBuffer,`uint32`),i.drawIndexed(this.oceanMesh.indexCount),i.setPipeline(this.pipelines.terrain),i.setBindGroup(0,this.terrainBindGroups[this.stateIndex][this.soilStateIndex]),i.setVertexBuffer(0,this.gridMesh.vertexBuffer),i.setIndexBuffer(this.gridMesh.indexBuffer,`uint32`),i.drawIndexed(this.gridMesh.indexCount),i.setPipeline(this.pipelines.plantContactShadow),i.setBindGroup(0,this.plantContactShadowBindGroups[this.stateIndex][this.vegetationIndex][this.elementIndex]),i.setVertexBuffer(0,this.particleMesh.vertexBuffer),i.setVertexBuffer(1,this.treeInstanceBuffer),i.setIndexBuffer(this.particleMesh.indexBuffer,`uint32`),i.drawIndexed(this.particleMesh.indexCount,this.treeInstanceCount),i.setPipeline(this.pipelines.groundContactShadow),i.setBindGroup(0,this.groundContactShadowBindGroups[this.stateIndex][this.vegetationIndex][this.elementIndex]),i.setVertexBuffer(1,this.groundVegetationInstanceBuffer),i.drawIndexed(this.particleMesh.indexCount,this.groundVegetationInstanceCount),i.setPipeline(this.pipelines.hutContactShadow),i.setBindGroup(0,this.hutContactShadowBindGroups[this.stateIndex]),i.setVertexBuffer(0,this.particleMesh.vertexBuffer),i.setVertexBuffer(1,this.hutInstanceBuffer),i.setIndexBuffer(this.particleMesh.indexBuffer,`uint32`),i.drawIndexed(this.particleMesh.indexCount,this.hutInstanceCount),i.setPipeline(this.pipelines.treeShadow),i.setBindGroup(0,this.treeShadowBindGroups[this.stateIndex][this.vegetationIndex][this.elementIndex]),i.setVertexBuffer(0,this.particleMesh.vertexBuffer),i.setVertexBuffer(1,this.treeInstanceBuffer),i.setIndexBuffer(this.particleMesh.indexBuffer,`uint32`),i.drawIndexed(this.particleMesh.indexCount,this.treeInstanceCount),i.setPipeline(this.pipelines.hutShadow),i.setBindGroup(0,this.hutShadowBindGroups[this.stateIndex]),i.setVertexBuffer(0,this.particleMesh.vertexBuffer),i.setVertexBuffer(1,this.hutInstanceBuffer),i.setIndexBuffer(this.particleMesh.indexBuffer,`uint32`),i.drawIndexed(this.particleMesh.indexCount,this.hutInstanceCount),i.setPipeline(this.pipelines.npcShadow),i.setBindGroup(0,this.npcShadowBindGroups[this.stateIndex]),i.setVertexBuffer(0,this.particleMesh.vertexBuffer),i.setIndexBuffer(this.particleMesh.indexBuffer,`uint32`),i.drawIndexed(this.particleMesh.indexCount,20),this.fauna?.renderAquatic(i,this.stateIndex),i.setPipeline(this.pipelines.water),i.setBindGroup(0,this.waterBindGroups[this.stateIndex][this.soilStateIndex]),i.setVertexBuffer(0,this.gridMesh.vertexBuffer),i.setIndexBuffer(this.gridMesh.indexBuffer,`uint32`),i.drawIndexed(this.gridMesh.indexCount),i.setPipeline(this.pipelines.element),i.setBindGroup(0,this.elementBindGroups[this.stateIndex][this.elementIndex]),i.setVertexBuffer(0,this.gridMesh.vertexBuffer),i.setIndexBuffer(this.gridMesh.indexBuffer,`uint32`),i.drawIndexed(this.gridMesh.indexCount),this.localLightVisibility>.008&&(i.setPipeline(this.pipelines.localLight),i.setBindGroup(0,this.localLightBindGroups[this.stateIndex][this.elementIndex]),i.setVertexBuffer(0,this.localLightMesh.vertexBuffer),i.setIndexBuffer(this.localLightMesh.indexBuffer,`uint32`),i.drawIndexed(this.localLightMesh.indexCount)),i.setPipeline(this.pipelines.wall);let a=[this.wallBlockMesh,this.wallTowerMesh,this.wallBlockMesh,this.wallTowerMesh];for(let e=0;e<a.length;e+=1){let t=a[e];i.setBindGroup(0,this.wallRenderBindGroups[this.stateIndex][e]),i.setVertexBuffer(0,t.vertexBuffer),i.setIndexBuffer(t.indexBuffer,`uint32`),i.drawIndexed(t.indexCount,si)}if(i.setPipeline(this.pipelines.hut),i.setBindGroup(0,this.hutBindGroups[this.stateIndex]),i.setVertexBuffer(0,this.hutMesh.vertexBuffer),i.setVertexBuffer(1,this.hutInstanceBuffer),i.setIndexBuffer(this.hutMesh.indexBuffer,`uint32`),i.drawIndexed(this.hutMesh.indexCount,this.hutInstanceCount),i.setPipeline(this.pipelines.campfire),i.setBindGroup(0,this.campfireBindGroups[this.stateIndex]),i.setVertexBuffer(0,this.campfireMesh.vertexBuffer),i.setVertexBuffer(1,this.campfireInstanceBuffer),i.setIndexBuffer(this.campfireMesh.indexBuffer,`uint32`),i.drawIndexed(this.campfireMesh.indexCount,this.campfireInstanceCount),i.setPipeline(this.pipelines.hutDebris),i.setBindGroup(0,this.hutDebrisBindGroups[this.stateIndex]),i.setVertexBuffer(0,this.hutDebrisMesh.vertexBuffer),i.setIndexBuffer(this.hutDebrisMesh.indexBuffer,`uint32`),i.drawIndexed(this.hutDebrisMesh.indexCount,this.hutInstanceCount*Si),i.setPipeline(this.pipelines.npc),i.setBindGroup(0,this.npcBindGroups[this.stateIndex]),i.setVertexBuffer(0,this.villagerMesh.vertexBuffer),i.setIndexBuffer(this.villagerMesh.indexBuffer,`uint32`),i.drawIndexed(this.villagerMesh.indexCount,20),i.setPipeline(this.pipelines.tree),i.setBindGroup(0,this.treeBindGroups[this.stateIndex][this.vegetationIndex][this.elementIndex]),i.setVertexBuffer(0,this.palmMesh.vertexBuffer),i.setVertexBuffer(1,this.treeInstanceBuffer),i.setIndexBuffer(this.palmMesh.indexBuffer,`uint32`),i.drawIndexed(this.palmMesh.indexCount,this.treeInstanceCount),i.setVertexBuffer(0,this.groundVegetationMesh.vertexBuffer),i.setVertexBuffer(1,this.groundVegetationInstanceBuffer),i.setIndexBuffer(this.groundVegetationMesh.indexBuffer,`uint32`),i.drawIndexed(this.groundVegetationMesh.indexCount,this.groundVegetationInstanceCount),this.fauna?.renderTerrestrial(i,this.stateIndex),i.setPipeline(this.pipelines.fire),i.setBindGroup(0,this.fireBindGroups[this.stateIndex][this.elementIndex]),i.setVertexBuffer(0,this.gridMesh.vertexBuffer),i.setIndexBuffer(this.gridMesh.indexBuffer,`uint32`),i.drawIndexed(this.gridMesh.indexCount),i.setPipeline(this.pipelines.campfireFlame),i.setBindGroup(0,this.campfireFlameBindGroups[this.stateIndex]),i.setVertexBuffer(0,this.particleMesh.vertexBuffer),i.setIndexBuffer(this.particleMesh.indexBuffer,`uint32`),i.drawIndexed(this.particleMesh.indexCount,this.campfireInstanceCount*3),i.setPipeline(this.pipelines.smoke),i.setBindGroup(0,this.smokeBindGroups[this.stateIndex][this.elementIndex]),i.setVertexBuffer(0,this.particleMesh.vertexBuffer),i.setIndexBuffer(this.particleMesh.indexBuffer,`uint32`),i.drawIndexed(this.particleMesh.indexCount,Ai),i.setPipeline(this.pipelines.cursor),i.setBindGroup(0,this.bindGroups.cursor),i.setVertexBuffer(0,this.ringMesh.vertexBuffer),i.setIndexBuffer(this.ringMesh.indexBuffer,`uint32`),i.drawIndexed(this.ringMesh.indexCount),i.setPipeline(this.pipelines.particle),i.setBindGroup(0,this.bindGroups.particle),i.setVertexBuffer(0,this.particleMesh.vertexBuffer),i.setIndexBuffer(this.particleMesh.indexBuffer,`uint32`),i.drawIndexed(this.particleMesh.indexCount,112),i.end(),n&&this.painterlyBindGroup){let n=e.beginRenderPass({label:`Procedural ${this.visualStyle} post-process`,colorAttachments:[{view:t,clearValue:{r:.08,g:.43,b:.55,a:1},loadOp:`clear`,storeOp:`store`}]});n.setPipeline(this.pipelines.painterly),n.setBindGroup(0,this.painterlyBindGroup),n.draw(3),n.end()}}async readWaterTopologyConvergence(e){try{await this.waterTopologyConvergenceReadbackBuffer.mapAsync(Yr.READ);let t=this.waterTopologyConvergenceReadbackBuffer.getMappedRange(),n=new Uint32Array(t.slice(0));if(this.waterTopologyConvergenceReadbackBuffer.unmap(),this.destroyed||e!==this.waterTopologyGeneration)return;(n[0]??0)===0&&(this.waterTopologyConverged=!0)}catch{try{this.waterTopologyConvergenceReadbackBuffer.unmap()}catch{}}finally{this.waterTopologyConvergenceReadPending=!1}}async readWaterDiagnostics(e){try{await this.waterDiagnosticsReadbackBuffer.mapAsync(Yr.READ);let t=this.waterDiagnosticsReadbackBuffer.getMappedRange(),n=new Uint32Array(t.slice(0));if(this.waterDiagnosticsReadbackBuffer.unmap(),this.destroyed||e!==this.waterTopologyGeneration)return;let r=(224/287)**2;this.activeWaterTileCount=Math.min(Xr,n[0]??0),this.sleepingFiniteTileCount=Math.min(Xr,n[1]??0),this.oceanConnectedTileCount=Math.min(Xr,n[2]??0),this.newlyWokenWaterTiles=Math.min(Qr,n[3]??0),this.pendingWaterWakeQueueLength=n[4]??0,this.waterQueueWorkThisFrame=Math.min(Zr,n[5]??0),this.maximumWaterFlux=(n[6]??0)/1e6,this.oceanBoundaryInflow=(n[7]??0)/1e6*r,this.oceanBoundaryOutflow=(n[8]??0)/1e6*r,this.maximumSpongeSurfaceResidual=(n[9]??0)/1e6,this.finiteWaterVolumeError=(n[10]??0)/1e9*r,this.inlandEdgeWaterSink=(n[13]??0)/1e6*r,this.externalSedimentSink=(n[14]??0)/1e6*r,this.cumulativeThinFilmInfiltration=(n[15]??0)/1e6*r}catch{try{this.waterDiagnosticsReadbackBuffer.unmap()}catch{}}finally{this.waterDiagnosticsReadPending=!1}}async readWallDiagnostics(e){try{await this.wallDiagnosticsReadbackBuffer.mapAsync(Yr.READ);let t=this.wallDiagnosticsReadbackBuffer.getMappedRange(),n=new Uint32Array(t.slice(0));if(this.wallDiagnosticsReadbackBuffer.unmap(),this.destroyed||e!==this.wallDiagnosticsGeneration)return;let r=this.intactWallBlocks,i=Math.min(si,n[1]??0);this.damagedWallBlocks=Math.min(si,n[2]??0),this.rubbleWallBlocks=0,this.intactWallBlocks=i,i<r&&this.started&&this.audio.playHutCollapse(),i!==r&&(this.waterTopologyDirty=!0),this.maximumWallDamageStep=(n[4]??0)/1e6,this.successfulWallBuilds=n[5]??0,this.rejectedWallBuilds=n[6]??0}catch{try{this.wallDiagnosticsReadbackBuffer.unmap()}catch{}}finally{this.wallDiagnosticsReadPending=!1}}async readReservoirs(){try{await this.reservoirReadbackBuffer.mapAsync(Yr.READ);let e=this.reservoirReadbackBuffer.getMappedRange(),t=new Int32Array(e.slice(0)),n=(224/287)**2;this.sandReservoir=Math.max(0,t[0]/vi*n),this.dirtReservoir=Math.max(0,t[1]/vi*n),this.waterReservoir=Math.max(0,t[2]/vi*n),this.lavaReservoir=Math.max(0,t[3]/vi*n),this.oilReservoir=Math.max(0,t[4]/vi*n);let r=t[5]??0;this.handLock=r===1||r===2||r===3||r===4||r===5?r:0;let i=Math.max(0,t[0]??0)+Math.max(0,t[1]??0)+Math.max(0,t[2]??0)+Math.max(0,t[3]??0)+Math.max(0,t[4]??0);this.pointer.action>0&&(this.handLock===0||i===0)&&(this.pointer.action=0,this.dumpLatch=!1,this.stopManipulationSound()),this.reservoirReadbackBuffer.unmap()}catch{try{this.reservoirReadbackBuffer.unmap()}catch{}}finally{this.reservoirReadPending=!1}}async readManipulationHit(){try{await this.hitReadbackBuffer.mapAsync(Yr.READ);let e=this.hitReadbackBuffer.getMappedRange(),t=new Float32Array(e.slice(0));if(this.hitReadbackBuffer.unmap(),this.destroyed)return;let n=t[0]??0,r=t[1]??0,i=112-this.simulationMargin;this.latestHitVisible=(t[3]??0)>=.5,this.latestHitInsideEditableArea=Math.abs(n)<=i&&Math.abs(r)<=i,this.latestHitMaterial=Math.round(t[4]??2),this.latestHitDepth=Math.max(0,t[6]??0),this.latestHitFresh=!0,this.syncManipulationSound(),this.pendingDumpSound&&(this.isManipulationTargetValid(1)?this.flushPendingDumpSound():this.pendingDumpSound=null)}catch{try{this.hitReadbackBuffer.unmap()}catch{}}finally{this.hitReadPending=!1}}async readHutDynamics(e){try{await this.hutDynamicsReadbackBuffer.mapAsync(Yr.READ);let t=this.hutDynamicsReadbackBuffer.getMappedRange(),n=new Float32Array(t.slice(0));if(this.hutDynamicsReadbackBuffer.unmap(),this.destroyed||e!==this.hutLifecycleGeneration)return;let r=Math.max(0,(this.lastTime-this.startTime)/1e3),i=[],a=0;for(let e=0;e<this.hutInstanceCount;e+=1){let t=e*Ci,o=(n[t+4]??0)>=.5,s=Math.max(0,n[t+7]??0),c=this.hutLifecycle[e];c&&(c.burnExposure=s,o?c.phase=`collapsed`:c.phase===`safe`&&s>=Di&&(c.phase=`burning`,c.burnStartedAt=r,i.push(s)),c.phase===`collapsed`&&(a+=1))}if(this.hutCollapses=Math.max(this.gpuHutCollapseEvents,a),i.length>0){let e=Math.max(...i);this.audio.playHutIgnite(Math.min(1.35,.52+e*.72+Math.min(3,i.length)*.09))}}catch{try{this.hutDynamicsReadbackBuffer.unmap()}catch{}}finally{this.hutDynamicsReadPending=!1}}async readWorldEvents(){try{await this.eventReadbackBuffer.mapAsync(Yr.READ);let e=this.eventReadbackBuffer.getMappedRange(),t=new Uint32Array(e.slice(0)),n=Math.min(20,t[0]??0),r=Math.min(this.hutInstanceCount,t[1]??0),i=t[2]??0,a=Math.max(0,n-this.npcDeaths),o=Math.max(0,r-this.gpuHutCollapseEvents),s=Math.max(0,i-this.explosions);this.npcDeaths=n,this.gpuHutCollapseEvents=r;let c=this.hutLifecycle.reduce((e,t)=>e+ +(t.phase===`collapsed`),0);this.hutCollapses=Math.max(r,c),this.explosions=i,this.eventReadbackBuffer.unmap();for(let e=0;e<Math.min(3,a);e+=1)this.audio.playNpcDeath();for(let e=0;e<Math.min(2,o);e+=1)this.audio.playHutCollapse();for(let e=0;e<Math.min(2,s);e+=1)this.audio.playExplosion()}catch{try{this.eventReadbackBuffer.unmap()}catch{}}finally{this.eventReadPending=!1}}async readFlowAudio(){try{await this.flowAudioReadbackBuffer.mapAsync(Yr.READ);let e=this.flowAudioReadbackBuffer.getMappedRange(),t=new Uint32Array(e.slice(0)),n=Math.max(.12,Math.min(1,176/Math.max(90,this.camera.distance)));this.audio.updateFlow({water:Math.min(1,(t[0]??0)/22e3),lava:Math.min(1,(t[1]??0)/16e3),oil:Math.min(1,(t[2]??0)/16e3),fire:Math.min(1,(t[3]??0)/6500),proximity:n}),this.springSourceDepth=(t[4]??0)/4096,this.lavaSourceDepth=(t[5]??0)/4096,this.lavaSourceReach=(t[6]??0)/256,this.lavaSourceSolidHeight=(t[7]??0)/4096,this.flowAudioReadbackBuffer.unmap()}catch{try{this.flowAudioReadbackBuffer.unmap()}catch{}}finally{this.flowAudioReadPending=!1}}publishStats(){let e=this.handLock===1?`sand`:this.handLock===2?`dirt`:this.handLock===3?`water`:this.handLock===4?`lava`:this.handLock===5?`oil`:`empty`,t={fps:this.fps,sandReservoir:this.sandReservoir,dirtReservoir:this.dirtReservoir,waterReservoir:this.waterReservoir,lavaReservoir:this.lavaReservoir,oilReservoir:this.oilReservoir,sandFill:Math.min(1,this.sandReservoir/180),dirtFill:Math.min(1,this.dirtReservoir/180),waterFill:Math.min(1,this.waterReservoir/180),lavaFill:Math.min(1,this.lavaReservoir/180),oilFill:Math.min(1,this.oilReservoir/180),paused:this.paused,handMaterial:e,manipulationRate:this.manipulationRate,timeOfDay:this.timeOfDay,musicVolume:this.musicVolume,proceduralAudioUnlocked:this.audio.isUnlocked,ambientBedActive:this.audio.isAmbientActive,ambientBedLevel:this.audio.ambientLevel,audioMuted:this.audio.isMuted,status:this.paused?`paused`:`running`,gridSize:B,frameTimeMs:this.frameTimeMs,livingNpcs:Math.max(0,20-this.npcDeaths),intactHuts:Math.max(0,this.hutInstanceCount-this.hutCollapses),explosions:this.explosions,waterDebugRemoved:this.debugWaterRemoved,springOutputMultiplier:this.springOutputMultiplier,erosionStrength:this.erosionStrength,springSourceDepth:this.springSourceDepth,lavaSourceDepth:this.lavaSourceDepth,lavaSourceReach:this.lavaSourceReach,lavaSourceSolidHeight:this.lavaSourceSolidHeight,activeWaterTileCount:this.activeWaterTileCount,sleepingFiniteTileCount:this.sleepingFiniteTileCount,oceanConnectedTileCount:this.oceanConnectedTileCount,newlyWokenWaterTiles:this.newlyWokenWaterTiles,pendingWaterWakeQueueLength:this.pendingWaterWakeQueueLength,waterQueueWorkThisFrame:this.waterQueueWorkThisFrame,maximumWaterQueueWorkPerFrame:Zr,maximumNewWaterTilesPerFrame:Qr,waterTopologyDirty:this.waterTopologyDirty||this.waterTopologyIterationsRemaining>0,waterTopologyIterationsThisFrame:this.waterTopologyIterationsThisFrame,finiteWaterVolumeError:this.finiteWaterVolumeError,oceanBoundaryInflow:this.oceanBoundaryInflow,oceanBoundaryOutflow:this.oceanBoundaryOutflow,maximumWaterFlux:this.maximumWaterFlux,maximumSpongeSurfaceResidual:this.maximumSpongeSurfaceResidual,activeErosionTileCount:this.activeErosionTileCount,activeSedimentTileCount:this.activeSedimentTileCount,maximumSoilQueueWorkPerFrame:ai,externalSedimentSink:this.externalSedimentSink,oceanSedimentSink:this.externalSedimentSink,cumulativeOceanSedimentSink:this.externalSedimentSink,cumulativeExternalSedimentSink:this.externalSedimentSink,maximumEdgeSedimentFlux:oi,inlandEdgeWaterSink:this.inlandEdgeWaterSink,cumulativeInlandEdgeWaterSink:this.inlandEdgeWaterSink,cumulativeThinFilmInfiltration:this.cumulativeThinFilmInfiltration,wallBuildMode:this.wallBuildMode,intactWallBlocks:this.intactWallBlocks,rubbleWallBlocks:this.rubbleWallBlocks,mapKind:this.mapKind};this.options.onStats?.(t);let n={active:this.activeWaterTileCount,"sleeping-finite":this.sleepingFiniteTileCount,"ocean-exterior":this.oceanConnectedTileCount},r={ready:!0,webgpu:!0,...t,burningHuts:this.hutLifecycle.reduce((e,t)=>e+ +(t.phase===`burning`),0),materialStateGpuResident:!0,mapKind:this.mapKind,mapProfile:this.mapProfile,rockMutable:!1,lavaEnabled:!0,oilEnabled:!0,fireEnabled:!0,visualStyle:this.visualStyle,painterlyStrength:Number(this.painterlyStrength.toFixed(2)),painterlyStrokeScale:Number(this.painterlyStrokeScale.toFixed(2)),sourceDiagnostics:{springDepth:Number(this.springSourceDepth.toFixed(3)),lavaDepth:Number(this.lavaSourceDepth.toFixed(3)),lavaReach:Number(this.lavaSourceReach.toFixed(2)),lavaSolidHeight:Number(this.lavaSourceSolidHeight.toFixed(3))},waterRuntimeStates:n,waterDiagnostics:{activeWaterTileCount:this.activeWaterTileCount,sleepingFiniteTileCount:this.sleepingFiniteTileCount,oceanConnectedTileCount:this.oceanConnectedTileCount,newlyWokenWaterTiles:this.newlyWokenWaterTiles,pendingWaterWakeQueueLength:this.pendingWaterWakeQueueLength,waterQueueWorkThisFrame:this.waterQueueWorkThisFrame,maximumWaterQueueWorkPerFrame:Zr,maximumNewWaterTilesPerFrame:Qr,waterTopologyDirty:this.waterTopologyDirty||this.waterTopologyIterationsRemaining>0,waterTopologyIterationsThisFrame:this.waterTopologyIterationsThisFrame,finiteWaterVolumeError:this.finiteWaterVolumeError,oceanBoundaryInflow:this.oceanBoundaryInflow,oceanBoundaryOutflow:this.oceanBoundaryOutflow,maximumWaterFlux:this.maximumWaterFlux,maximumSpongeSurfaceResidual:this.maximumSpongeSurfaceResidual},soilDiagnostics:{activeErosionTileCount:this.activeErosionTileCount,activeSedimentTileCount:this.activeSedimentTileCount,maximumSoilQueueWorkPerFrame:ai,externalSedimentSink:this.externalSedimentSink,oceanSedimentSink:this.externalSedimentSink,cumulativeOceanSedimentSink:this.externalSedimentSink,cumulativeExternalSedimentSink:this.externalSedimentSink,maximumEdgeSedimentFlux:oi,inlandEdgeWaterSink:this.inlandEdgeWaterSink,cumulativeInlandEdgeWaterSink:this.inlandEdgeWaterSink,cumulativeThinFilmInfiltration:this.cumulativeThinFilmInfiltration},wallDiagnostics:{compactCapacity:si,seededBlocks:this.wallSeedCount,intactWallBlocks:this.intactWallBlocks,damagedWallBlocks:this.damagedWallBlocks,rubbleWallBlocks:this.rubbleWallBlocks,successfulWallBuilds:this.successfulWallBuilds,rejectedWallBuilds:this.rejectedWallBuilds,maximumWallDamageStep:this.maximumWallDamageStep,wallBuildMode:this.wallBuildMode}};window.__TERRAIN__=r}installInput(){this.canvas.addEventListener(`pointerdown`,this.onPointerDown),this.canvas.addEventListener(`pointermove`,this.onPointerMove),this.canvas.addEventListener(`pointerup`,this.onPointerUp),this.canvas.addEventListener(`pointercancel`,this.onPointerUp),this.canvas.addEventListener(`wheel`,this.onWheel,{passive:!1}),this.canvas.addEventListener(`contextmenu`,this.onContextMenu),window.addEventListener(`keydown`,this.onKeyDown),window.addEventListener(`keyup`,this.onKeyUp),window.addEventListener(`blur`,this.onWindowBlur)}startAllAudio(){if(this.destroyed)return;let e=this.audio.unlock();this.music.unlock(),this.ambientClips.unlock(),e.then(e=>{!e||this.destroyed||(this.syncManipulationSound(),this.publishStats())})}updatePointerCoordinates(e){let t=this.canvas.getBoundingClientRect(),n=(e.clientX-t.left)/Math.max(1,t.width),r=(e.clientY-t.top)/Math.max(1,t.height);this.pointer.ndcX=n*2-1,this.pointer.ndcY=1-r*2,this.latestHitFresh=!1,this.syncManipulationSound()}schedulePointerRelease(e=34){this.pointerReleaseTimer!==null&&window.clearTimeout(this.pointerReleaseTimer),this.pointerReleaseTimer=window.setTimeout(()=>{this.pointer.action=0,this.pointerReleaseTimer=null},e)}carriedMaterialVolume(){return this.sandReservoir+this.dirtReservoir+this.waterReservoir+this.lavaReservoir+this.oilReservoir}currentAudioMaterial(){return this.handLock===4?`lava`:this.handLock===5?`oil`:this.handLock===3||this.handLock===0&&this.waterReservoir>Math.max(this.sandReservoir,this.dirtReservoir,this.lavaReservoir,this.oilReservoir)?`water`:`sand`}playWholeHandDumpSound(){let e=this.currentAudioMaterial(),t=this.carriedMaterialVolume();t<=0||(this.stopManipulationSound(),this.pendingDumpSound={material:e,volume:t})}materialLockForHit(e){return e===1||e===2||e===3||e===4||e===5?e:0}isManipulationTargetValid(e=this.pointer.action){if(!this.latestHitFresh||!this.latestHitVisible||!this.latestHitInsideEditableArea)return!1;if(e<0){let e=this.materialLockForHit(this.latestHitMaterial);return e!==0&&this.latestHitDepth>.001&&(this.handLock===0||this.handLock===e)}return e>0&&this.carriedMaterialVolume()>.001}flushPendingDumpSound(){let e=this.pendingDumpSound;!e||!this.isManipulationTargetValid(1)||(this.pendingDumpSound=null,this.audio.unlock().then(t=>{t&&!this.destroyed&&this.audio.playHandDump(e.material,e.volume)}))}syncManipulationSound(){let e=this.pointer.action>0&&this.handLock===0&&this.sandReservoir+this.dirtReservoir+this.waterReservoir+this.lavaReservoir+this.oilReservoir<=0;if(this.paused||this.wallBuildMode||this.pointer.action===0||this.pointer.action===2||e||!this.isManipulationTargetValid()){this.stopManipulationSound();return}if(!this.audio.isUnlocked)return;let t={material:this.currentAudioMaterial(),action:this.pointer.action<0?`gather`:`pour`,intensity:this.manipulationRate};this.manipulationSoundActive?this.audio.updateManipulation(t):(this.audio.startManipulation(t.material,t.action,t.intensity),this.manipulationSoundActive=!0)}stopManipulationSound(){this.manipulationSoundActive&&=(this.audio.stopManipulation(),!1)}setManipulationRate(e){this.manipulationRate=Math.max(1,Math.min(60,Math.round(e))),this.brushAmount=xi*this.manipulationRate,this.publishStats()}setBuildMode(e){this.wallBuildMode=!!e,this.wallBuildRequested=!1,this.pointer.action=0,this.dumpLatch=!1,this.stopManipulationSound(),this.publishStats()}isBuildMode(){return this.wallBuildMode}setMusicVolume(e){this.musicVolume=Math.max(0,Math.min(1,e)),this.lastMusicOutputVolume=-1,this.updateAmbientClipMix(),this.publishStats()}setFaunaEnabled(e){this.fauna?.setEnabled(e)}setVisualStyle(e){let t=Li(e);if(!t||t===this.visualStyle)return;this.visualStyle=t;let n=this.canvas.ownerDocument.defaultView;if(n){let e=new URL(n.location.href);t===`natural`?e.searchParams.delete(`style`):e.searchParams.set(`style`,t),n.history.replaceState(n.history.state,``,e)}this.publishStats()}cycleVisualStyle(){let e=Fi[(Fi.indexOf(this.visualStyle)+1)%Fi.length]??`natural`;return this.setVisualStyle(e),e}setPainterlyStrength(e){Number.isFinite(e)&&(this.painterlyStrength=Math.max(0,Math.min(1.25,e)),this.publishStats())}setPainterlyStrokeScale(e){Number.isFinite(e)&&(this.painterlyStrokeScale=Math.max(.55,Math.min(1.8,e)),this.publishStats())}getFaunaStatus(){return this.fauna?.getStatus()??null}setSpringOutputMultiplier(e){Number.isFinite(e)&&(this.springOutputMultiplier=Math.round(Math.max(0,Math.min(60,e))),this.publishStats())}setErosionStrength(e){Number.isFinite(e)&&(this.erosionStrength=Math.max(0,Math.min(20,Math.round(e))),this.publishStats())}setTimeOfDay(e){Number.isFinite(e)&&(this.timeOfDay=(e%24+24)%24,this.localLightDirty=!0,this.updateAmbientClipMix(),this.publishStats())}startFromUserGesture(){this.destroyed||this.started||(this.started=!0,this.paused=!1,this.pointer.action=0,this.pointer.orbiting=!1,this.pointer.pointerId=-1,this.dumpLatch=!1,this.accumulator=0,this.vegetationAccumulator=0,this.lastTime=performance.now(),this.startAllAudio(),this.publishStats())}setPaused(e){!this.started&&!e||(this.paused=e,e?(this.stopManipulationSound(),this.audio.pause(),this.music.pause(),this.ambientClips.pause()):(this.audio.resume(),this.music.resume(),this.ambientClips.resume()),this.publishStats())}setAudioMuted(e){this.audio.setMuted(e),this.music.setMuted(e),this.ambientClips.setMuted(e),e||(this.audio.unlock(),this.music.unlock(),this.ambientClips.unlock()),this.publishStats()}isAudioMuted(){return this.audio.isMuted}isPaused(){return this.paused}reset(){this.resetRequested=!0}removeAllWater(){if(this.destroyed)return;this.debugWaterRemoved=!0,this.stopManipulationSound(),this.writeUniforms(hi,Math.max(0,(performance.now()-this.startTime)/1e3));let e=this.device.createCommandEncoder({label:`immediate debug water drain`});this.encodeComputePass(e,`debug drain all world water`,this.pipelines.waterDrain,this.waterDrainBindGroup),this.device.queue.submit([e.finish()]),this.waterOpennessTicksSinceUpdate=gi,this.publishStats()}fail(e){this.failed||(this.failed=!0,console.error(`[Terrain WebGPU]`,e),this.options.onError?.(e),window.__TERRAIN__={ready:!1,webgpu:!0,status:`error`,message:e})}destroy(){if(this.destroyed)return;this.destroyed=!0,cancelAnimationFrame(this.animationFrame),this.resizeObserver?.disconnect(),this.canvas.removeEventListener(`pointerdown`,this.onPointerDown),this.canvas.removeEventListener(`pointermove`,this.onPointerMove),this.canvas.removeEventListener(`pointerup`,this.onPointerUp),this.canvas.removeEventListener(`pointercancel`,this.onPointerUp),this.canvas.removeEventListener(`wheel`,this.onWheel),this.canvas.removeEventListener(`contextmenu`,this.onContextMenu),window.removeEventListener(`keydown`,this.onKeyDown),window.removeEventListener(`keyup`,this.onKeyUp),window.removeEventListener(`blur`,this.onWindowBlur),this.pointerReleaseTimer!==null&&(window.clearTimeout(this.pointerReleaseTimer),this.pointerReleaseTimer=null),this.pressedKeys.clear(),this.dumpLatch=!1,this.pointer.action=0,this.pendingDumpSound=null,this.audio.destroy(),this.music.destroy(),this.ambientClips.destroy(),this.fauna?.destroy(),this.fauna=null,this.msaaTexture?.destroy(),this.depthTexture?.destroy(),this.sceneColorTexture?.destroy(),this.sceneColorTexture=null,this.sceneColorView=null,this.painterlyBindGroup=null;let e=[...this.stateBuffers,...this.soilStateBuffers,...this.erosionMemoryBuffers,this.dirtFluxBuffer,...this.elementBuffers,...this.vegetationBuffers,this.treeFuelMaskBuffer,this.groundwaterBuffer,this.waterFluxBuffer,this.externalBoundaryFluxBuffer,this.thinFilmAgeBuffer,...this.waterTileStateBuffers,this.waterTileMetricsBuffer,this.waterWorkBuffer,...this.waterConnectivityBuffers,this.waterTopologyConvergenceBuffer,this.waterTopologyConvergenceReadbackBuffer,this.waterDiagnosticsBuffer,this.waterDiagnosticsReadbackBuffer,this.wallBlockBuffer,this.wallEdgeBuffer,this.wallCollapseDepositBuffer,this.wallDiagnosticsBuffer,this.wallDiagnosticsReadbackBuffer,...this.wallRenderModeBuffers,this.sandFluxBuffer,this.elementFluxBuffer,this.localLightFieldBuffer,this.localLightScratchBuffer,this.reservoirBuffer,this.reservoirReadbackBuffer,this.npcBuffer,this.hutDynamicsBuffer,this.campfireDynamicsBuffer,this.hutDynamicsReadbackBuffer,this.eventCounterBuffer,this.eventReadbackBuffer,this.flowAudioBuffer,this.flowAudioReadbackBuffer,this.hitBuffer,this.hitReadbackBuffer,this.simUniformBuffer,this.frameUniformBuffer,this.painterlyUniformBuffer,this.treeInstanceBuffer,this.groundVegetationInstanceBuffer,this.hutInstanceBuffer,this.campfireInstanceBuffer,this.gridMesh?.vertexBuffer,this.gridMesh?.indexBuffer,this.skyMesh?.vertexBuffer,this.skyMesh?.indexBuffer,this.oceanMesh?.vertexBuffer,this.oceanMesh?.indexBuffer,this.localLightMesh?.vertexBuffer,this.localLightMesh?.indexBuffer,this.palmMesh?.vertexBuffer,this.palmMesh?.indexBuffer,this.groundVegetationMesh?.vertexBuffer,this.groundVegetationMesh?.indexBuffer,this.hutMesh?.vertexBuffer,this.hutMesh?.indexBuffer,this.campfireMesh?.vertexBuffer,this.campfireMesh?.indexBuffer,this.villagerMesh?.vertexBuffer,this.villagerMesh?.indexBuffer,this.hutDebrisMesh?.vertexBuffer,this.hutDebrisMesh?.indexBuffer,this.wallBlockMesh?.vertexBuffer,this.wallBlockMesh?.indexBuffer,this.wallTowerMesh?.vertexBuffer,this.wallTowerMesh?.indexBuffer,this.ringMesh?.vertexBuffer,this.ringMesh?.indexBuffer,this.particleMesh?.vertexBuffer,this.particleMesh?.indexBuffer];for(let t of e)t?.destroy?.()}},Ji=e((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),W=e(((e,t)=>{t.exports=Ji()}))(),Yi={fps:0,sandReservoir:0,dirtReservoir:0,waterReservoir:0,lavaReservoir:0,oilReservoir:0,sandFill:0,dirtFill:0,waterFill:0,lavaFill:0,oilFill:0,paused:!0,handMaterial:`empty`,manipulationRate:20,timeOfDay:7,musicVolume:.12,proceduralAudioUnlocked:!1,ambientBedActive:!1,ambientBedLevel:0,audioMuted:!1,status:`loading`,gridSize:288,frameTimeMs:0,livingNpcs:20,intactHuts:8,wallBuildMode:!1,intactWallBlocks:0,rubbleWallBlocks:0,explosions:0,waterDebugRemoved:!1,springOutputMultiplier:12,erosionStrength:1,springSourceDepth:0,lavaSourceDepth:0,lavaSourceReach:0,lavaSourceSolidHeight:0,activeWaterTileCount:0,sleepingFiniteTileCount:1296,oceanConnectedTileCount:0,newlyWokenWaterTiles:0,pendingWaterWakeQueueLength:0,waterQueueWorkThisFrame:0,maximumWaterQueueWorkPerFrame:96,maximumNewWaterTilesPerFrame:12,waterTopologyDirty:!0,waterTopologyIterationsThisFrame:0,finiteWaterVolumeError:0,oceanBoundaryInflow:0,oceanBoundaryOutflow:0,maximumWaterFlux:0,maximumSpongeSurfaceResidual:0,activeErosionTileCount:0,activeSedimentTileCount:0,maximumSoilQueueWorkPerFrame:0,oceanSedimentSink:0,mapKind:Nn};function Xi(e){return e<.05?`empty`:e<10?`${e.toFixed(1)} m³`:`${Math.round(e)} m³`}function Zi(e){let t=(e%24+24)%24,n=Math.floor(t),r=Math.floor((t-n)*60);return`${String(n).padStart(2,`0`)}:${String(r).padStart(2,`0`)}`}function Qi(e){return e<5||e>=21?`Moonlight`:e<8?`Sunrise`:e<17?`Daylight`:e<20?`Sunset`:`Twilight`}function $i(e){return e.startsWith(`Arrow`)||e===`Home`||e===`End`||e===`PageUp`||e===`PageDown`}function ea(e){requestAnimationFrame(()=>e.blur())}function ta(){let e=(0,l.useRef)(null),t=(0,l.useRef)(null),[n,r]=(0,l.useState)(Yi),[i,a]=(0,l.useState)(!1),[o,s]=(0,l.useState)(!1),[c,u]=(0,l.useState)(null),[d,f]=(0,l.useState)(!0),[p,m]=(0,l.useState)(Nn);(0,l.useEffect)(()=>{let n=e.current;if(!n)return;let i=!1,o=null;a(!1),u(null);let s={faunaEnabled:!0,mapKind:p,onStats:e=>{i||r(e)},onError:e=>{i||u(e)}};return qi.create(n,s).then(e=>{if(i){e.destroy();return}o=e,t.current=e,a(!0)}).catch(e=>{if(!i){let t=e instanceof Error?e.message:`The world could not be created.`;u(t)}}),()=>{i=!0,o?.destroy(),t.current===o&&(t.current=null)}},[p]);let h=(0,l.useCallback)(e=>{t.current?.setManipulationRate(e)},[]),g=(0,l.useCallback)(e=>{t.current?.setMusicVolume(e)},[]),_=(0,l.useCallback)(e=>{t.current?.setSpringOutputMultiplier(e)},[]),v=(0,l.useCallback)(e=>{t.current?.setErosionStrength(e)},[]),y=(0,l.useCallback)(e=>{t.current?.setTimeOfDay(e)},[]),b=(0,l.useCallback)((e,t,n)=>{let r=e.getBoundingClientRect(),i=t-(r.left+r.width*.5),a=n-(r.top+r.height*.5),o=Math.atan2(i,-a);o<0&&(o+=Math.PI*2),y(o/(Math.PI*2)*24)},[y]),x=(0,l.useCallback)(()=>{let e=t.current;e&&e.setPaused(!e.isPaused())},[]),S=(0,l.useCallback)(()=>{let e=t.current;e&&(e.startFromUserGesture(),e.setPaused(!1),s(!0),window.setTimeout(()=>f(!1),6500))},[]),C=(0,l.useCallback)(()=>{let e=t.current;e?.setPaused(!0),e?.setBuildMode(!1),e?.reset(),s(!1),f(!0)},[]),w=(0,l.useCallback)(()=>{t.current?.removeAllWater()},[]),ee=(0,l.useCallback)(()=>{let e=t.current;e&&e.setAudioMuted(!e.isAudioMuted())},[]),te=(0,l.useCallback)(()=>{let e=t.current;e&&e.setBuildMode(!e.isBuildMode())},[]),ne=n.dirtReservoir,T=n.dirtFill,E=n.sandReservoir+ne+n.waterReservoir+n.lavaReservoir+n.oilReservoir,D={"--sand-fill":`${n.sandFill*100}%`,"--dirt-fill":`${T*100}%`,"--water-fill":`${n.waterFill*100}%`,"--lava-fill":`${n.lavaFill*100}%`,"--oil-fill":`${n.oilFill*100}%`},O=n.handMaterial,re=O===`sand`?`Sand`:O===`dirt`?`Dirt`:O===`water`?`Water`:O===`lava`?`Lava`:O===`oil`?`Natural oil`:null,ie={"--time-angle":`${n.timeOfDay/24*360}deg`};return(0,W.jsxs)(`main`,{className:`demo-shell`,children:[(0,W.jsx)(`canvas`,{ref:e,className:`world-canvas`,"data-testid":`world-canvas`,"aria-label":`Interactive living terrain simulation`}),(0,W.jsx)(`div`,{className:`vignette`,"aria-hidden":`true`}),(0,W.jsxs)(`aside`,{className:`world-status`,"aria-label":`Simulation status`,children:[(0,W.jsx)(`span`,{className:`live-dot ${n.paused?`is-paused`:``}`}),(0,W.jsx)(`span`,{children:n.paused?`Time held`:`World alive`}),(0,W.jsx)(`span`,{className:`status-separator`}),(0,W.jsxs)(`span`,{children:[n.gridSize,`² field`]}),(0,W.jsx)(`span`,{className:`status-separator`}),(0,W.jsxs)(`span`,{children:[n.fps||`—`,` fps`]}),(0,W.jsx)(`span`,{className:`status-separator`}),(0,W.jsxs)(`span`,{children:[n.livingNpcs,` islanders · `,n.intactHuts,` huts · `,n.intactWallBlocks,` wall blocks`]})]}),(0,W.jsxs)(`div`,{className:`time-dial`,style:ie,role:`slider`,tabIndex:0,"data-testid":`time-of-day`,"aria-label":`Time of day`,"aria-valuemin":0,"aria-valuemax":24,"aria-valuenow":Number(n.timeOfDay.toFixed(2)),"aria-valuetext":Zi(n.timeOfDay),onPointerDown:e=>{e.currentTarget.setPointerCapture(e.pointerId),b(e.currentTarget,e.clientX,e.clientY),e.preventDefault()},onPointerMove:e=>{e.currentTarget.hasPointerCapture(e.pointerId)&&b(e.currentTarget,e.clientX,e.clientY)},onPointerUp:e=>{e.currentTarget.hasPointerCapture(e.pointerId)&&e.currentTarget.releasePointerCapture(e.pointerId),e.currentTarget.blur()},onPointerCancel:e=>{e.currentTarget.hasPointerCapture(e.pointerId)&&e.currentTarget.releasePointerCapture(e.pointerId),e.currentTarget.blur()},onClick:e=>e.currentTarget.blur(),onKeyDown:e=>{let t=e.shiftKey?1:.25;e.key===`ArrowLeft`||e.key===`ArrowDown`?(y(n.timeOfDay-t),e.preventDefault()):e.key===`ArrowRight`||e.key===`ArrowUp`?(y(n.timeOfDay+t),e.preventDefault()):e.key===`Home`?(y(0),e.preventDefault()):e.key===`End`&&(y(23.999),e.preventDefault())},onKeyUp:e=>{$i(e.key)&&e.currentTarget.blur()},children:[(0,W.jsx)(`span`,{className:`time-dial-sun`,"aria-hidden":`true`,children:`✦`}),(0,W.jsx)(`span`,{className:`time-dial-moon`,"aria-hidden":`true`,children:`●`}),(0,W.jsx)(`span`,{className:`time-dial-hand`,"aria-hidden":`true`,children:(0,W.jsx)(`i`,{})}),(0,W.jsxs)(`span`,{className:`time-dial-center`,children:[(0,W.jsx)(`strong`,{children:Zi(n.timeOfDay)}),(0,W.jsx)(`small`,{children:Qi(n.timeOfDay)})]})]}),(0,W.jsxs)(`section`,{className:`material-legend`,"aria-label":`World materials`,children:[(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`i`,{className:`swatch water`}),(0,W.jsx)(`span`,{children:`Water flows`})]}),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`i`,{className:`swatch sand`}),(0,W.jsx)(`span`,{children:`Sand yields`})]}),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`i`,{className:`swatch dirt`}),(0,W.jsx)(`span`,{children:`Dirt holds`})]}),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`i`,{className:`swatch lava`}),(0,W.jsx)(`span`,{children:`Lava lithifies`})]}),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`i`,{className:`swatch oil`}),(0,W.jsx)(`span`,{children:`Oil ignites`})]}),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`i`,{className:`swatch fire`}),(0,W.jsx)(`span`,{children:`Fire spreads`})]}),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`i`,{className:`swatch rock`}),(0,W.jsx)(`span`,{children:`Rock endures`})]}),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`i`,{className:`swatch masonry`}),(0,W.jsx)(`span`,{children:`Walls hold water`})]}),(0,W.jsxs)(`div`,{children:[(0,W.jsx)(`i`,{className:`swatch grove`}),(0,W.jsx)(`span`,{children:`Groves return`})]})]}),(0,W.jsxs)(`section`,{className:`tool-deck`,"aria-label":`Hand controls`,children:[(0,W.jsx)(`div`,{className:`hand-readout is-${O}`,"aria-label":`Material hand: ${re??`Empty`}`,children:(0,W.jsxs)(`div`,{className:`hand-materials`,children:[(0,W.jsxs)(`span`,{className:`hand-material sand`,children:[(0,W.jsx)(`i`,{"aria-hidden":`true`}),(0,W.jsx)(`b`,{children:`Sand`}),(0,W.jsx)(`small`,{"data-testid":`sand-reservoir`,children:Xi(n.sandReservoir)})]}),(0,W.jsxs)(`span`,{className:`hand-material dirt`,children:[(0,W.jsx)(`i`,{"aria-hidden":`true`}),(0,W.jsx)(`b`,{children:`Dirt`}),(0,W.jsx)(`small`,{"data-testid":`dirt-reservoir`,children:Xi(ne)})]}),(0,W.jsxs)(`span`,{className:`hand-material water`,children:[(0,W.jsx)(`i`,{"aria-hidden":`true`}),(0,W.jsx)(`b`,{children:`Water`}),(0,W.jsx)(`small`,{"data-testid":`water-reservoir`,children:Xi(n.waterReservoir)})]}),(0,W.jsxs)(`span`,{className:`hand-material lava`,children:[(0,W.jsx)(`i`,{"aria-hidden":`true`}),(0,W.jsx)(`b`,{children:`Lava`}),(0,W.jsx)(`small`,{"data-testid":`lava-reservoir`,children:Xi(n.lavaReservoir)})]}),(0,W.jsxs)(`span`,{className:`hand-material oil`,children:[(0,W.jsx)(`i`,{"aria-hidden":`true`}),(0,W.jsx)(`b`,{children:`Oil`}),(0,W.jsx)(`small`,{"data-testid":`oil-reservoir`,children:Xi(n.oilReservoir)})]})]})}),(0,W.jsxs)(`div`,{className:`reservoir`,style:D,children:[(0,W.jsxs)(`div`,{className:`reservoir-copy`,children:[(0,W.jsx)(`span`,{children:`Total carried`}),(0,W.jsx)(`strong`,{"data-testid":`reservoir-value`,children:Xi(E)})]}),(0,W.jsxs)(`div`,{className:`reservoir-track`,"aria-hidden":`true`,children:[(0,W.jsx)(`span`,{className:`sand-fill`}),(0,W.jsx)(`span`,{className:`dirt-fill`}),(0,W.jsx)(`span`,{className:`water-fill`}),(0,W.jsx)(`span`,{className:`lava-fill`}),(0,W.jsx)(`span`,{className:`oil-fill`})]})]}),(0,W.jsxs)(`label`,{className:`rate-control`,htmlFor:`manipulation-rate`,children:[(0,W.jsxs)(`span`,{children:[(0,W.jsx)(`small`,{children:`Gather / pour`}),(0,W.jsxs)(`strong`,{children:[n.manipulationRate,`×`]})]}),(0,W.jsx)(`input`,{id:`manipulation-rate`,"data-testid":`manipulation-rate`,type:`range`,min:`1`,max:`60`,step:`1`,value:n.manipulationRate,onInput:e=>h(Number(e.currentTarget.value)),onPointerUp:e=>ea(e.currentTarget),onPointerCancel:e=>ea(e.currentTarget),onKeyUp:e=>{$i(e.key)&&e.currentTarget.blur()},"aria-label":`Gather and pour speed multiplier`})]}),(0,W.jsxs)(`div`,{className:`world-actions`,children:[(0,W.jsxs)(`button`,{type:`button`,className:n.wallBuildMode?`is-active`:void 0,onClick:e=>{te(),e.currentTarget.blur()},"data-testid":`wall-build-button`,"aria-pressed":n.wallBuildMode,"aria-label":n.wallBuildMode?`Stop building wall blocks`:`Build wall blocks`,children:[(0,W.jsxs)(`span`,{className:`build-icon`,"aria-hidden":`true`,children:[(0,W.jsx)(`i`,{}),(0,W.jsx)(`i`,{}),(0,W.jsx)(`i`,{})]}),n.wallBuildMode?`Building`:`Build wall`]}),(0,W.jsxs)(`button`,{type:`button`,onClick:e=>{x(),e.currentTarget.blur()},"data-testid":`pause-button`,"aria-label":n.paused?`Resume simulation`:`Pause simulation`,children:[(0,W.jsx)(`span`,{className:n.paused?`play-icon`:`pause-icon`,"aria-hidden":`true`}),n.paused?`Resume`:`Hold`]}),(0,W.jsxs)(`button`,{type:`button`,onClick:e=>{C(),e.currentTarget.blur()},"data-testid":`reset-button`,"aria-label":`Reset the procedural world`,children:[(0,W.jsx)(`span`,{className:`reset-icon`,"aria-hidden":`true`,children:`↺`}),`Reset`]}),(0,W.jsxs)(`button`,{type:`button`,onClick:e=>{ee(),e.currentTarget.blur()},"data-testid":`audio-button`,"aria-label":n.audioMuted?`Enable procedural sound`:`Mute procedural sound`,children:[(0,W.jsx)(`span`,{className:`audio-icon`,"aria-hidden":`true`,children:n.audioMuted?`×`:`♪`}),n.audioMuted?`Sound off`:`Sound on`]})]})]}),(0,W.jsx)(`button`,{type:`button`,className:`help-toggle`,onClick:e=>{f(e=>!e),e.currentTarget.blur()},"aria-expanded":d,"aria-controls":`control-guide`,children:d?`Hide controls & settings`:`Controls & settings`}),(0,W.jsxs)(`section`,{id:`control-guide`,className:`control-guide ${d?`is-open`:``}`,"aria-label":`Controls and settings`,children:[(0,W.jsx)(`p`,{className:`eyebrow`,children:`Controls & settings`}),(0,W.jsxs)(`div`,{className:`gesture-row`,children:[(0,W.jsx)(`span`,{className:`mouse left`,"aria-hidden":`true`}),(0,W.jsxs)(`p`,{children:[(0,W.jsx)(`strong`,{children:`Gather what you touch`}),(0,W.jsx)(`small`,{children:`Hold left mouse · color follows material`})]})]}),(0,W.jsxs)(`div`,{className:`gesture-row`,children:[(0,W.jsx)(`span`,{className:`mouse right`,"aria-hidden":`true`}),(0,W.jsxs)(`p`,{children:[(0,W.jsx)(`strong`,{children:`Pour locked material`}),(0,W.jsx)(`small`,{children:`Hold right mouse`})]})]}),(0,W.jsxs)(`div`,{className:`gesture-row`,children:[(0,W.jsxs)(`span`,{className:`mouse-chord`,"aria-hidden":`true`,children:[(0,W.jsx)(`span`,{className:`mouse left`}),(0,W.jsx)(`span`,{className:`chord-plus`,children:`+`}),(0,W.jsx)(`span`,{className:`mouse right`})]}),(0,W.jsxs)(`p`,{children:[(0,W.jsx)(`strong`,{children:`Empty hand at once`}),(0,W.jsx)(`small`,{children:`Press left + right mouse together`})]})]}),(0,W.jsxs)(`div`,{className:`gesture-row`,children:[(0,W.jsxs)(`span`,{className:`build-gesture`,"aria-hidden":`true`,children:[(0,W.jsx)(`i`,{}),(0,W.jsx)(`i`,{}),(0,W.jsx)(`i`,{})]}),(0,W.jsxs)(`p`,{children:[(0,W.jsx)(`strong`,{children:`Place stone blocks`}),(0,W.jsx)(`small`,{children:`Toggle Build wall · click terrain`})]})]}),(0,W.jsxs)(`div`,{className:`gesture-row`,children:[(0,W.jsxs)(`span`,{className:`key-cluster`,"aria-hidden":`true`,children:[(0,W.jsx)(`kbd`,{children:`W`}),(0,W.jsx)(`kbd`,{children:`A`}),(0,W.jsx)(`kbd`,{children:`S`}),(0,W.jsx)(`kbd`,{children:`D`})]}),(0,W.jsxs)(`p`,{children:[(0,W.jsx)(`strong`,{children:`Pan`}),(0,W.jsx)(`small`,{children:`Move across the island`})]})]}),(0,W.jsxs)(`div`,{className:`gesture-row`,children:[(0,W.jsx)(`span`,{className:`mouse middle`,"aria-hidden":`true`}),(0,W.jsxs)(`p`,{children:[(0,W.jsx)(`strong`,{children:`Orbit + zoom`}),(0,W.jsx)(`small`,{children:`Middle-drag · wheel`})]})]}),(0,W.jsxs)(`label`,{className:`settings-range`,htmlFor:`music-volume`,children:[(0,W.jsxs)(`span`,{children:[(0,W.jsx)(`strong`,{children:`Music volume`}),(0,W.jsxs)(`small`,{children:[Math.round(n.musicVolume*100),`%`]})]}),(0,W.jsx)(`input`,{id:`music-volume`,"data-testid":`music-volume`,type:`range`,min:`0`,max:`100`,step:`1`,value:Math.round(n.musicVolume*100),onInput:e=>g(Number(e.currentTarget.value)/100),onPointerUp:e=>ea(e.currentTarget),onPointerCancel:e=>ea(e.currentTarget),onKeyUp:e=>{$i(e.key)&&e.currentTarget.blur()},"aria-label":`Background music volume`})]}),(0,W.jsxs)(`label`,{className:`settings-range`,htmlFor:`spring-output`,children:[(0,W.jsxs)(`span`,{children:[(0,W.jsx)(`strong`,{children:`Source output`}),(0,W.jsx)(`small`,{children:n.springOutputMultiplier===0?`Off`:`${n.springOutputMultiplier}×`})]}),(0,W.jsx)(`input`,{id:`spring-output`,"data-testid":`spring-output`,type:`range`,min:`0`,max:`60`,step:`1`,value:n.springOutputMultiplier,onInput:e=>_(Number(e.currentTarget.value)),onPointerUp:e=>ea(e.currentTarget),onPointerCancel:e=>ea(e.currentTarget),onKeyUp:e=>{$i(e.key)&&e.currentTarget.blur()},"aria-label":`Water and lava source output multiplier`})]}),(0,W.jsxs)(`label`,{className:`settings-range`,htmlFor:`erosion-strength`,children:[(0,W.jsxs)(`span`,{children:[(0,W.jsx)(`strong`,{children:`Erosion strength`}),(0,W.jsx)(`small`,{children:n.erosionStrength===0?`Off`:n.erosionStrength===1?`Natural`:`${n.erosionStrength}× debug`})]}),(0,W.jsx)(`input`,{id:`erosion-strength`,"data-testid":`erosion-strength`,type:`range`,min:`0`,max:`20`,step:`1`,value:n.erosionStrength,onInput:e=>v(Number(e.currentTarget.value)),onPointerUp:e=>ea(e.currentTarget),onPointerCancel:e=>ea(e.currentTarget),onKeyUp:e=>{$i(e.key)&&e.currentTarget.blur()},"aria-label":`Hydraulic erosion strength multiplier`})]}),(0,W.jsxs)(`button`,{type:`button`,className:`debug-action`,"data-testid":`remove-water-debug`,onClick:e=>{w(),e.currentTarget.blur()},children:[n.waterDebugRemoved?`Water removed (debug)`:`Remove water (debug)`,(0,W.jsx)(`small`,{children:n.waterDebugRemoved?`Dry inspection active · Reset restores water`:`Inspect the seabed · Reset restores sources`})]}),(0,W.jsx)(`p`,{className:`growth-note`,children:`Water quenches fire, lava makes stone, and burning oil reshapes even rock.`})]}),!o&&!c&&(0,W.jsx)(`div`,{className:`loading-gate`,children:(0,W.jsxs)(`div`,{className:`loading-card`,role:i?`dialog`:`status`,"aria-live":`polite`,"aria-modal":i?`true`:void 0,"aria-label":i?`Start terrain simulation`:void 0,children:[(0,W.jsx)(`div`,{className:`loading-orbit`,"aria-hidden":`true`,children:(0,W.jsx)(`span`,{})}),(0,W.jsx)(`p`,{className:`eyebrow`,children:`Terrain`}),(0,W.jsx)(`h2`,{children:i?`Choose a landscape`:`Loading`}),i&&(0,W.jsxs)(W.Fragment,{children:[(0,W.jsxs)(`fieldset`,{className:`map-selector`,"aria-label":`Choose a map`,children:[(0,W.jsx)(`legend`,{children:`Map`}),Object.keys(Pn).map(e=>{let t=Pn[e];return(0,W.jsxs)(`label`,{className:p===e?`is-selected`:``,children:[(0,W.jsx)(`input`,{type:`radio`,name:`terrain-map`,value:e,checked:p===e,onChange:()=>m(e)}),(0,W.jsxs)(`span`,{children:[(0,W.jsx)(`strong`,{children:t.label}),(0,W.jsx)(`small`,{children:t.menuDescription})]})]},e)})]}),(0,W.jsxs)(`button`,{type:`button`,className:`start-button`,"data-testid":`start-demo`,onClick:S,children:[`Start `,Pn[p].label]})]})]})}),c&&(0,W.jsxs)(`div`,{className:`error-card`,role:`alert`,"data-testid":`webgpu-error`,children:[(0,W.jsx)(`p`,{className:`eyebrow`,children:`WebGPU unavailable`}),(0,W.jsx)(`h2`,{children:`The world is waiting for a graphics device.`}),(0,W.jsx)(`p`,{children:c}),(0,W.jsx)(`p`,{className:`error-footnote`,children:`Hardware acceleration must be enabled. The demo intentionally keeps its simulation on the GPU and does not substitute a slower CPU version.`})]}),(0,W.jsx)(`output`,{className:`diagnostics`,"data-testid":`simulation-diagnostics`,children:JSON.stringify({ready:o,loaded:i,mapKind:p,status:c?`error`:n.status,handMaterial:n.handMaterial,manipulationRate:n.manipulationRate,timeOfDay:Number(n.timeOfDay.toFixed(2)),proceduralAudioUnlocked:n.proceduralAudioUnlocked,ambientBedActive:n.ambientBedActive,ambientBedLevel:Number(n.ambientBedLevel.toFixed(3)),audioMuted:n.audioMuted,livingNpcs:n.livingNpcs,intactHuts:n.intactHuts,wallBuildMode:n.wallBuildMode,intactWallBlocks:n.intactWallBlocks,rubbleWallBlocks:n.rubbleWallBlocks,fps:n.fps,sandReservoir:Number(n.sandReservoir.toFixed(2)),dirtReservoir:Number(ne.toFixed(2)),waterReservoir:Number(n.waterReservoir.toFixed(2)),lavaReservoir:Number(n.lavaReservoir.toFixed(2)),oilReservoir:Number(n.oilReservoir.toFixed(2)),explosions:n.explosions,waterDebugRemoved:n.waterDebugRemoved,springOutputMultiplier:n.springOutputMultiplier,erosionStrength:n.erosionStrength,springSourceDepth:Number((n.springSourceDepth??0).toFixed(3)),lavaSourceDepth:Number((n.lavaSourceDepth??0).toFixed(3)),lavaSourceReach:Number((n.lavaSourceReach??0).toFixed(2)),lavaSourceSolidHeight:Number((n.lavaSourceSolidHeight??0).toFixed(3)),activeWaterTileCount:n.activeWaterTileCount,sleepingFiniteTileCount:n.sleepingFiniteTileCount,oceanConnectedTileCount:n.oceanConnectedTileCount,newlyWokenWaterTiles:n.newlyWokenWaterTiles,pendingWaterWakeQueueLength:n.pendingWaterWakeQueueLength,waterQueueWorkThisFrame:n.waterQueueWorkThisFrame,maximumWaterQueueWorkPerFrame:n.maximumWaterQueueWorkPerFrame,maximumNewWaterTilesPerFrame:n.maximumNewWaterTilesPerFrame,waterTopologyDirty:n.waterTopologyDirty,waterTopologyIterationsThisFrame:n.waterTopologyIterationsThisFrame,finiteWaterVolumeError:Number(n.finiteWaterVolumeError.toExponential(2)),oceanBoundaryInflow:Number(n.oceanBoundaryInflow.toFixed(4)),oceanBoundaryOutflow:Number(n.oceanBoundaryOutflow.toFixed(4)),maximumWaterFlux:Number(n.maximumWaterFlux.toFixed(5)),maximumSpongeSurfaceResidual:Number(n.maximumSpongeSurfaceResidual.toFixed(5)),activeErosionTileCount:n.activeErosionTileCount,activeSedimentTileCount:n.activeSedimentTileCount,maximumSoilQueueWorkPerFrame:n.maximumSoilQueueWorkPerFrame,oceanSedimentSink:Number(n.oceanSedimentSink.toFixed(4)),cumulativeThinFilmInfiltration:Number((n.cumulativeThinFilmInfiltration??0).toFixed(4)),rockMutable:!1,lavaEnabled:!0,oilEnabled:!0,fireEnabled:!0})})]})}var na=document.getElementById(`root`);if(!na)throw Error(`Missing #root mount point.`);(0,u.createRoot)(na).render((0,W.jsx)(ta,{}));