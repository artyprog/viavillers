// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/mithril/mithril.js":[function(require,module,exports) {
var global = arguments[3];
;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
	return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i])
	}
	return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
	var hasAttrs = false, childList, text
	var className = attrs.className || attrs.class
	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}
		for(var key in attrs) {
			if (hasOwn.call(attrs, key)) {
				newAttrs[key] = attrs[key]
			}
		}
		attrs = newAttrs
	}
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key)) {
			attrs[key] = state.attrs[key]
		}
	}
	if (className !== undefined) {
		if (attrs.class !== undefined) {
			attrs.class = undefined
			attrs.className = className
		}
		if (state.attrs.className != null) {
			attrs.className = state.attrs.className + " " + className
		}
	}
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			hasAttrs = true
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		text = children[0].children
	} else {
		childList = children
	}
	return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
	// Because sloppy mode sucks
	var attrs = arguments[1], start = 2, children
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	if (typeof selector === "string") {
		var cached = selectorCache[selector] || compileSelector(selector)
	}
	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = 1
	}
	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}
	var normalized = Vnode.normalizeChildren(children)
	if (typeof selector === "string") {
		return execSelector(cached, attrs, normalized)
	} else {
		return Vnode(selector, attrs.key, attrs, normalized)
	}
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
	var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key0 in object) {
		destructure(key0, object[key0])
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
	var callbackCount = 0
	var oncompletion
	function setCompletionCallback(callback) {oncompletion = callback}
	function finalizer() {
		var count = 0
		function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
		return function finalize(promise0) {
			var then0 = promise0.then
			promise0.then = function() {
				count++
				var next = then0.apply(promise0, arguments)
				next.then(complete, function(e) {
					complete()
					if (count === 0) throw e
				})
				return finalize(next)
			}
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args
			args = extra || {}
			if (args.url == null) args.url = url
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) args.method = "GET"
			args.method = args.method.toUpperCase()
			var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
			if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
			if (typeof args.deserialize !== "function") args.deserialize = deserialize
			if (typeof args.extract !== "function") args.extract = extract
			args.url = interpolate(args.url, args.data)
			if (useBody) args.data = args.serialize(args.data)
			else args.url = assemble(args.url, args.data)
			var xhr = new $window.XMLHttpRequest(),
				aborted = false,
				_abort = xhr.abort
			xhr.abort = function abort() {
				aborted = true
				_abort.call(xhr)
			}
			xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (args.serialize === JSON.stringify && useBody && !(args.headers && args.headers.hasOwnProperty("Content-Type"))) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (args.deserialize === deserialize && !(args.headers && args.headers.hasOwnProperty("Accept"))) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key])
			}
			if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort().
				if(aborted) return
				if (xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
							resolve(cast(args.type, response))
						}
						else {
							var error = new Error(xhr.responseText)
							for (var key in response) error[key] = response[key]
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (useBody && (args.data != null)) xhr.send(args.data)
			else xhr.send()
		})
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script)
				resolve(cast(args.type, data))
				delete $window[callbackName]
			}
			script.onerror = function() {
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
				delete $window[callbackName]
			}
			if (args.data == null) args.data = {}
			args.url = interpolate(args.url, args.data)
			args.data[args.callbackKey || "callback"] = callbackName
			script.src = assemble(args.url, args.data)
			$window.document.documentElement.appendChild(script)
		})
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) return url
		var tokens = url.match(/:[^\/]+/gi) || []
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1)
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key])
			}
		}
		return url
	}
	function assemble(url, data) {
		var querystring = buildQueryString(data)
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&"
			url += prefix + querystring
		}
		return url
	}
	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}
	function extract(xhr) {return xhr.responseText}
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i])
				}
			}
			else return new type0(data)
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
	var $doc = $window.document
	var $emptyFragment = $doc.createDocumentFragment()
	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}
	var onevent
	function setEventCallback(callback) {return onevent = callback}
	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else return createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
		var temp = $doc.createElement(parent1)
		temp.innerHTML = vnode.children
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs2 = vnode.attrs
		var is = attrs2 && attrs2.is
		ns = getNameSpace(vnode) || ns
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				setLateAttrs(vnode)
			}
		}
		return element
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		vnode._state = vnode.state
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		initLifecycle(vnode._state, vnode, hooks)
		vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
			insertNode(parent, element, nextSibling)
			return element
		}
		else {
			vnode.domSize = 0
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) continue
						else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
						else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
						else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes)
			if (recycling) {
				var pool = old.pool
				old = old.concat(old.pool)
			}
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start]
				if (o === v && !recycling) oldStart++, start++
				else if (o == null) oldStart++
				else if (v == null) start++
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
					oldStart++, start++
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
				}
				else {
					var o = old[oldEnd]
					if (o === v && !recycling) oldEnd--, start++
					else if (o == null) oldEnd--
					else if (v == null) start++
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
						if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
						oldEnd--, start++
					}
					else break
				}
			}
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldEnd], v = vnodes[end]
				if (o === v && !recycling) oldEnd--, end--
				else if (o == null) oldEnd--
				else if (v == null) end--
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
					updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
					if (o.dom != null) nextSibling = o.dom
					oldEnd--, end--
				}
				else {
					if (!map) map = getKeyMap(old, oldEnd)
					if (v != null) {
						var oldIndex = map[v.key]
						if (oldIndex != null) {
							var movable = old[oldIndex]
							var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
							updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
							insertNode(parent, toFragment(movable), nextSibling)
							old[oldIndex].skip = true
							if (movable.dom != null) nextSibling = movable.dom
						}
						else {
							var dom = createNode(parent, v, hooks, ns, nextSibling)
							nextSibling = dom
						}
					}
					end--
				}
				if (end < start) break
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
			removeNodes(old, oldStart, oldEnd + 1, vnodes)
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode._state = old._state
			vnode.events = old.events
			if (!recycling && shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					if (recycling) {
						vnode.state = {}
						initLifecycle(vnode.attrs, vnode, hooks)
					}
					else updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
		}
		else {
			removeNode(old, null)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old)
			createHTML(parent, vnode, nextSibling)
		}
		else vnode.dom = old.dom, vnode.domSize = old.domSize
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle0 multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
		}
		else {
			if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
			if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		if (recycling) {
			initComponent(vnode, hooks)
		} else {
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
			updateLifecycle(vnode._state, vnode, hooks)
		}
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(old.instance, null)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0
		for (var i = 0; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				var key2 = vnode.key
				if (key2 != null) map[key2] = i
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment()
			if (count0 > 0) {
				var dom = vnode.dom
				while (--count0) fragment.appendChild(dom.nextSibling)
				fragment.insertBefore(dom, fragment.firstChild)
			}
			return fragment
		}
		else return vnode.dom
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function setContentEditable(vnode) {
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				if (vnode.skip) vnode.skip = false
				else removeNode(vnode, context)
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
			var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		continuation()
		function continuation() {
			if (++called === expected) {
				onremove(vnode)
				if (vnode.dom) {
					var count0 = vnode.domSize || 1
					if (count0 > 1) {
						var dom = vnode.dom
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling)
						}
					}
					removeNodeFromDOM(vnode.dom)
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) context.pool = [vnode]
						else context.pool.push(vnode)
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode
		if (parent != null) parent.removeChild(node)
	}
	function onremove(vnode) {
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
		if (typeof vnode.tag !== "string") {
			if (typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns)
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
		var nsLastIndex = key2.indexOf(":")
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
		else if (key2 === "style") updateStyle(element, old, value)
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			if (key2 === "value") {
				var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select") {
					if (value === null) {
						if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
					} else {
						if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					}
				}
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
			}
			// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
			if (vnode.tag === "input" && key2 === "type") {
				element.setAttribute(key2, value)
				return
			}
			element[key2] = value
		}
		else {
			if (typeof value === "boolean") {
				if (value) element.setAttribute(key2, "")
				else element.removeAttribute(key2)
			}
			else element.setAttribute(key2 === "className" ? "class" : key2, value)
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
			if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") key2 = "class"
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
					else if (key2 !== "key") vnode.dom.removeAttribute(key2)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}
	//style
	function updateStyle(element, old, style) {
		if (old === style) element.style.cssText = "", old = null
		if (style == null) element.style.cssText = ""
		else if (typeof style === "string") element.style.cssText = style
		else {
			if (typeof old === "string") element.style.cssText = ""
			for (var key2 in style) {
				element.style[key2] = style[key2]
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) element.style[key2] = ""
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e)
			onevent.call(element, e)
			return result
		}
		if (key2 in element) element[key2] = typeof value === "function" ? callback : null
		else {
			var eventName = key2.slice(2)
			if (vnode.events === undefined) vnode.events = {}
			if (vnode.events[key2] === callback) return
			if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
			if (typeof value === "function") {
				vnode.events[key2] = callback
				element.addEventListener(eventName, vnode.events[key2], false)
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
		if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = $doc.activeElement
		var namespace = dom.namespaceURI
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		if (!Array.isArray(vnodes)) vnodes = [vnodes]
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		dom.vnodes = vnodes
		// document.activeElement can return null in IE https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
		if (active != null && $doc.activeElement !== active) active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
	return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16
	var last = 0, pending = null
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
	return function() {
		var now = Date.now()
		if (last === 0 || now - last >= time) {
			last = now
			callback()
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null
				callback()
				last = Date.now()
			}, time - (now - last))
		}
	}
}
var _11 = function($window) {
	var renderService = coreRenderer($window)
	renderService.setEventCallback(function(e) {
		if (e.redraw === false) e.redraw = undefined
		else redraw()
	})
	var callbacks = []
	function subscribe(key1, callback) {
		unsubscribe(key1)
		callbacks.push(key1, throttle(callback))
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1)
		if (index > -1) callbacks.splice(index, 2)
	}
	function redraw() {
		for (var i = 1; i < callbacks.length; i += 2) {
			callbacks[i]()
		}
	}
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, [])
			redrawService0.unsubscribe(root)
			return
		}
		
		if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component))
		}
		redrawService0.subscribe(root, run0)
		redrawService0.redraw()
	}
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), data0 = {}, counters = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value === "true") value = true
		else if (value === "false") value = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			var isValue = j === levels.length - 1
			if (level === "") {
				var key5 = levels.slice(0, j).join()
				if (counters[key5] == null) counters[key5] = 0
				level = counters[key5]++
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {}
			}
			cursor = cursor[level]
		}
	}
	return data0
}
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function"
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
		if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
		return data
	}
	var asyncId
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) return
			asyncId = callAsync0(function() {
				asyncId = null
				callback0()
			})
		}
	}
	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?")
		var hashIndex = path.indexOf("#")
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
			for (var key4 in queryParams) queryData[key4] = queryParams[key4]
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1))
			for (var key4 in hashParams) hashData[key4] = hashParams[key4]
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"}
	router.getPath = function() {
		var type2 = router.prefix.charAt(0)
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	}
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {}
		path = parsePath(path, queryData, hashData)
		if (data != null) {
			for (var key4 in data) queryData[key4] = data[key4]
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token]
				return data[token]
			})
		}
		var query = buildQueryString(queryData)
		if (query) path += "?" + query
		var hash = buildQueryString(hashData)
		if (hash) path += "#" + hash
		if (supportsPushState) {
			var state = options ? options.state : null
			var title = options ? options.title : null
			$window.onpopstate()
			if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
			else $window.history.pushState(state, title, router.prefix + path)
		}
		else $window.location.href = router.prefix + path
	}
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath()
			var params = {}
			var pathname = parsePath(path, params, params)
			var state = $window.history.state
			if (state != null) {
				for (var k in state) params[k] = state[k]
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						}
						resolve(routes[route0], params, path, route0)
					})
					return
				}
			}
			reject(path, params)
		}
		if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
		else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
		resolveRoute()
	}
	return router
}
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window)
	var identity = function(v) {return v}
	var render1, component, attrs3, currentPath, lastUpdate
	var route = function(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		var run1 = function() {
			if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
		}
		var bail = function(path) {
			if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
			else throw new Error("Could not resolve default route " + defaultRoute)
		}
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) return
				component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
				attrs3 = params, currentPath = path, lastUpdate = null
				render1 = (routeResolver.render || identity).bind(routeResolver)
				run1()
			}
			if (payload.view || typeof payload === "function") update({}, payload)
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved)
					}, bail)
				}
				else update(payload, "div")
			}
		}, bail)
		redrawService0.subscribe(root, run1)
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		routeService.setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = function(prefix0) {routeService.prefix = prefix0}
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
			e.preventDefault()
			e.redraw = false
			var href = this.getAttribute("href")
			if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
			route.set(href, undefined, undefined)
		}
	}
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
		return attrs3
	}
	return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.6"
m.vnode = Vnode
if (typeof module !== "undefined") module["exports"] = m
else window.m = m
}());
},{}],"node_modules/bss/bss.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var pseudos = [':active', ':any', ':checked', ':default', ':disabled', ':empty', ':enabled', ':first', ':first-child', ':first-of-type', ':fullscreen', ':focus', ':hover', ':indeterminate', ':in-range', ':invalid', ':last-child', ':last-of-type', ':left', ':link', ':only-child', ':only-of-type', ':optional', ':out-of-range', ':read-only', ':read-write', ':required', ':right', ':root', ':scope', ':target', ':valid', ':visited', // With value
':dir', ':lang', ':not', ':nth-child', ':nth-last-child', ':nth-last-of-type', ':nth-of-type', // Elements
'::after', '::before', '::first-letter', '::first-line', '::selection', '::backdrop', '::placeholder', '::marker', '::spelling-error', '::grammar-error'];
var popular = {
  ai: 'alignItems',
  b: 'bottom',
  bc: 'backgroundColor',
  br: 'borderRadius',
  bs: 'boxShadow',
  bi: 'backgroundImage',
  c: 'color',
  d: 'display',
  f: 'float',
  fd: 'flexDirection',
  ff: 'fontFamily',
  fs: 'fontSize',
  h: 'height',
  jc: 'justifyContent',
  l: 'left',
  lh: 'lineHeight',
  ls: 'letterSpacing',
  m: 'margin',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',
  mt: 'marginTop',
  o: 'opacity',
  p: 'padding',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  pt: 'paddingTop',
  r: 'right',
  t: 'top',
  ta: 'textAlign',
  td: 'textDecoration',
  tt: 'textTransform',
  w: 'width'
};
var cssProperties = ['float'].concat(Object.keys(typeof document === 'undefined' ? {} : findWidth(document.documentElement.style)).filter(function (p) {
  return p.indexOf('-') === -1 && p !== 'length';
}));

function findWidth(obj) {
  return obj ? obj.hasOwnProperty('width') ? obj : findWidth(Object.getPrototypeOf(obj)) : {};
}

var isProp = /^-?-?[a-z][a-z-_0-9]*$/i;

var memoize = function (fn, cache) {
  if (cache === void 0) cache = {};
  return function (item) {
    return item in cache ? cache[item] : cache[item] = fn(item);
  };
};

function add(style, prop, values) {
  if (prop in style) // Recursively increase specificity
    {
      add(style, '!' + prop, values);
    } else {
    style[prop] = formatValues(prop, values);
  }
}

var vendorMap = Object.create(null, {});
var vendorValuePrefix = Object.create(null, {});
var vendorRegex = /^(o|O|ms|MS|Ms|moz|Moz|webkit|Webkit|WebKit)([A-Z])/;
var appendPx = memoize(function (prop) {
  var el = document.createElement('div');

  try {
    el.style[prop] = '1px';
    el.style.setProperty(prop, '1px');
    return el.style[prop].slice(-3) === '1px' ? 'px' : '';
  } catch (err) {
    return '';
  }
}, {
  flex: '',
  boxShadow: 'px',
  border: 'px',
  borderTop: 'px',
  borderRight: 'px',
  borderBottom: 'px',
  borderLeft: 'px'
});

function lowercaseFirst(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function assign(obj, obj2) {
  for (var key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj[key] = obj2[key];
    }
  }

  return obj;
}

function hyphenToCamelCase(hyphen) {
  return hyphen.slice(hyphen.charAt(0) === '-' ? 1 : 0).replace(/-([a-z])/g, function (match) {
    return match[1].toUpperCase();
  });
}

function camelCaseToHyphen(camelCase) {
  return camelCase.replace(/(\B[A-Z])/g, '-$1').toLowerCase();
}

function initials(camelCase) {
  return camelCase.charAt(0) + (camelCase.match(/([A-Z])/g) || []).join('').toLowerCase();
}

function objectToRules(style, selector, suffix, single) {
  if (suffix === void 0) suffix = '';
  var base = {};
  var extra = suffix.indexOf('&') > -1 && suffix.indexOf(',') === -1 ? '' : '&';
  var rules = [];
  Object.keys(style).forEach(function (prop) {
    if (prop.charAt(0) === '@') {
      rules.push(prop + '{' + objectToRules(style[prop], selector, suffix, single) + '}');
    } else if (typeof style[prop] === 'object') {
      rules = rules.concat(objectToRules(style[prop], selector, suffix + prop, single));
    } else {
      base[prop] = style[prop];
    }
  });

  if (Object.keys(base).length) {
    rules.unshift(((single || suffix.charAt(0) === ' ' ? '' : '&') + extra + suffix).replace(/&/g, selector).trim() + '{' + stylesToCss(base) + '}');
  }

  return rules;
}

var selectorSplit = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

function stylesToCss(style) {
  return Object.keys(style).reduce(function (acc, prop) {
    return acc + propToString(prop.replace(/!/g, ''), style[prop]);
  }, '');
}

function propToString(prop, value) {
  prop = prop in vendorMap ? vendorMap[prop] : prop;
  return (vendorRegex.test(prop) ? '-' : '') + (cssVar(prop) ? prop : camelCaseToHyphen(prop)) + ':' + value + ';';
}

function formatValues(prop, value) {
  return Array.isArray(value) ? value.map(function (v) {
    return formatValue(prop, v);
  }).join(' ') : typeof value === 'string' ? formatValues(prop, value.split(' ')) : formatValue(prop, value);
}

function formatValue(prop, value) {
  return value in vendorValuePrefix ? vendorValuePrefix[value] : value + (isNaN(value) || value === null || typeof value === 'boolean' || cssVar(prop) ? '' : appendPx(prop));
}

function cssVar(prop) {
  return prop.charAt(0) === '-' && prop.charAt(1) === '-';
}

var styleSheet = typeof document === 'object' && document.createElement('style');
styleSheet && document.head && document.head.appendChild(styleSheet);
var sheet = styleSheet && styleSheet.sheet;
var debug = false;
var classes = Object.create(null, {});
var rules = [];
var count = 0;
var classPrefix = 'b' + ('000' + (Math.random() * 46656 | 0).toString(36)).slice(-3) + ('000' + (Math.random() * 46656 | 0).toString(36)).slice(-3);

function setDebug(d) {
  debug = d;
}

function getSheet() {
  var content = rules.join('');
  rules = [];
  classes = Object.create(null, {});
  count = 0;
  return content;
}

function getRules() {
  return rules;
}

function insert(rule, index) {
  rules.push(rule);

  if (debug) {
    return styleSheet.textContent = rules.join('\n');
  }

  try {
    sheet && sheet.insertRule(rule, arguments.length > 1 ? index : sheet.cssRules.length);
  } catch (e) {// Ignore thrown errors in eg. firefox for unsupported strings (::-webkit-inner-spin-button)
  }
}

function createClass(style) {
  var json = JSON.stringify(style);

  if (json in classes) {
    return classes[json];
  }

  var className = classPrefix + ++count,
      rules = objectToRules(style, '.' + className);

  for (var i = 0; i < rules.length; i++) {
    insert(rules[i]);
  }

  classes[json] = className;
  return className;
}
/* eslint no-invalid-this: 0 */


var shorts = Object.create(null);

function bss(input, value) {
  var b = chain(bss);
  input && assign(b.__style, parse.apply(null, arguments));
  return b;
}

function setProp(prop, value) {
  Object.defineProperty(bss, prop, {
    configurable: true,
    value: value
  });
}

Object.defineProperties(bss, {
  __style: {
    configurable: true,
    writable: true,
    value: {}
  },
  valueOf: {
    configurable: true,
    writable: true,
    value: function () {
      return '.' + this.class;
    }
  },
  toString: {
    configurable: true,
    writable: true,
    value: function () {
      return this.class;
    }
  }
});
setProp('setDebug', setDebug);
setProp('$keyframes', keyframes);
setProp('$media', $media);
setProp('$import', $import);
setProp('$nest', $nest);
setProp('getSheet', getSheet);
setProp('getRules', getRules);
setProp('helper', helper);
setProp('css', css);
setProp('classPrefix', classPrefix);

function chain(instance) {
  var newInstance = Object.create(bss, {
    __style: {
      value: assign({}, instance.__style)
    },
    style: {
      enumerable: true,
      get: function () {
        var this$1 = this;
        return Object.keys(this.__style).reduce(function (acc, key) {
          if (typeof this$1.__style[key] === 'number' || typeof this$1.__style[key] === 'string') {
            acc[key.replace(/^!/, '')] = this$1.__style[key];
          }

          return acc;
        }, {});
      }
    }
  });

  if (instance === bss) {
    bss.__style = {};
  }

  return newInstance;
}

cssProperties.forEach(function (prop) {
  var vendor = prop.match(vendorRegex);

  if (vendor) {
    var unprefixed = lowercaseFirst(prop.replace(vendorRegex, '$2'));

    if (cssProperties.indexOf(unprefixed) === -1) {
      if (unprefixed === 'flexDirection') {
        vendorValuePrefix.flex = '-' + vendor[1].toLowerCase() + '-flex';
      }

      vendorMap[unprefixed] = prop;
      setProp(unprefixed, setter(prop));
      setProp(short(unprefixed), bss[unprefixed]);
      return;
    }
  }

  setProp(prop, setter(prop));
  setProp(short(prop), bss[prop]);
});
setProp('content', function Content(arg) {
  var b = chain(this);
  arg === null || arg === undefined || arg === false ? delete b.__style.content : b.__style.content = '"' + arg + '"';
  return b;
});
Object.defineProperty(bss, 'class', {
  set: function (value) {
    this.__class = value;
  },
  get: function () {
    return this.__class || createClass(this.__style);
  }
});

function $media(value, style) {
  var b = chain(this);

  if (value) {
    b.__style['@media ' + value] = parse(style);
  }

  return b;
}

function $import(value) {
  if (value) {
    insert('@import ' + value + ';', 0);
  }

  return chain(this);
}

function $nest(selector, properties) {
  var b = chain(this);

  if (arguments.length === 1) {
    Object.keys(selector).forEach(function (x) {
      return addNest(b.__style, x, selector[x]);
    });
  } else if (selector) {
    addNest(b.__style, selector, properties);
  }

  return b;
}

function addNest(style, selector, properties) {
  style[selector.split(selectorSplit).map(function (x) {
    x = x.trim();
    return (x.charAt(0) === ':' || x.charAt(0) === '[' ? '' : ' ') + x;
  }).join(',&')] = parse(properties);
}

pseudos.forEach(function (name) {
  return setProp('$' + hyphenToCamelCase(name.replace(/:/g, '')), function Pseudo(value, style) {
    var b = chain(this);

    if (isTagged(value)) {
      b.__style[name] = parse.apply(null, arguments);
    } else if (value || style) {
      b.__style[name + (style ? '(' + value + ')' : '')] = parse(style || value);
    }

    return b;
  });
});

function setter(prop) {
  return function CssProperty(value) {
    var b = chain(this);

    if (!value && value !== 0) {
      delete b.__style[prop];
    } else if (arguments.length > 0) {
      add(b.__style, prop, Array.prototype.slice.call(arguments));
    }

    return b;
  };
}

function css(selector, style) {
  if (arguments.length === 1) {
    Object.keys(selector).forEach(function (key) {
      return addCss(key, selector[key]);
    });
  } else {
    addCss(selector, style);
  }

  return chain(this);
}

function addCss(selector, style) {
  objectToRules(parse(style), selector, '', true).forEach(insert);
}

function helper(name, styling) {
  if (arguments.length === 1) {
    return Object.keys(name).forEach(function (key) {
      return helper(key, name[key]);
    });
  }

  delete bss[name]; // Needed to avoid weird get calls in chrome

  if (typeof styling === 'function') {
    helper[name] = styling;
    Object.defineProperty(bss, name, {
      configurable: true,
      value: function Helper(input) {
        var b = chain(this);
        var result = isTagged(input) ? styling(raw(input, arguments)) : styling.apply(null, arguments);
        assign(b.__style, result.__style);
        return b;
      }
    });
  } else {
    helper[name] = parse(styling);
    Object.defineProperty(bss, name, {
      configurable: true,
      get: function () {
        var b = chain(this);
        assign(b.__style, parse(styling));
        return b;
      }
    });
  }
}

bss.helper('$animate', function (value, props) {
  return bss.animation(bss.$keyframes(props) + ' ' + value);
});

function short(prop) {
  var acronym = initials(prop),
      short = popular[acronym] && popular[acronym] !== prop ? prop : acronym;
  shorts[short] = prop;
  return short;
}

var stringToObject = memoize(function (string) {
  var last = '',
      prev;
  return string.trim().replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*/g, '').split(/;|\n/).reduce(function (acc, line) {
    if (!line) {
      return acc;
    }

    line = last + line.trim();
    var ref = line.replace(/[ :]+/, ' ').split(' ');
    var key = ref[0];
    var tokens = ref.slice(1);
    last = line.charAt(line.length - 1) === ',' ? line : '';

    if (last) {
      return acc;
    }

    if (line.charAt(0) === ',' || !isProp.test(key)) {
      acc[prev] += ' ' + line;
      return acc;
    }

    if (!key) {
      return acc;
    }

    var prop = key.charAt(0) === '-' && key.charAt(1) === '-' ? key : hyphenToCamelCase(key);
    prev = shorts[prop] || prop;

    if (prop in helper) {
      typeof helper[prop] === 'function' ? assign(acc, helper[prop].apply(helper, tokens).__style) : assign(acc, helper[prop]);
    } else if (tokens.length > 0) {
      add(acc, prev, tokens);
    }

    return acc;
  }, {});
});
var count$1 = 0;
var keyframeCache = {};

function keyframes(props) {
  var content = Object.keys(props).reduce(function (acc, key) {
    return acc + key + '{' + stylesToCss(parse(props[key])) + '}';
  }, '');

  if (content in keyframeCache) {
    return keyframeCache[content];
  }

  var name = classPrefix + count$1++;
  keyframeCache[content] = name;
  insert('@keyframes ' + name + '{' + content + '}');
  return name;
}

function parse(input, value) {
  var obj;

  if (typeof input === 'string') {
    if (typeof value === 'string' || typeof value === 'number') {
      return obj = {}, obj[input] = value, obj;
    }

    return stringToObject(input);
  } else if (isTagged(input)) {
    return stringToObject(raw(input, arguments));
  }

  return input.__style || sanitize(input);
}

function isTagged(input) {
  return Array.isArray(input) && typeof input[0] === 'string';
}

function raw(input, args) {
  var str = '';

  for (var i = 0; i < input.length; i++) {
    str += input[i] + (args[i + 1] || '');
  }

  return str;
}

function sanitize(styles) {
  return Object.keys(styles).reduce(function (acc, key) {
    var value = styles[key];
    key = shorts[key] || key;

    if (!value && value !== 0 && value !== '') {
      return acc;
    }

    if (key === 'content' && value.charAt(0) !== '"') {
      acc[key] = '"' + value + '"';
    } else if (typeof value === 'object') {
      acc[key] = sanitize(value);
    } else {
      add(acc, key, value);
    }

    return acc;
  }, {});
}

var _default = bss;
exports.default = _default;
},{}],"js/svg/trash.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mithril = _interopRequireDefault(require("mithril"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TrashSVG = (0, _mithril.default)("svg[viewBox='0 0 1000 1000'][x='0px'][y='0px']", [(0, _mithril.default)("metadata", "Svg Vector Icons : http://www.onlinewebfonts.com/icon"), (0, _mithril.default)("g", (0, _mithril.default)("g[transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)']", [(0, _mithril.default)("path[d='M3849.4,4987.5c-398.2-105.3-687.3-480.5-687.3-896v-120.6l-884.5-5.8c-855.7-5.7-890.2-7.7-987.8-47.9c-155.1-63.2-260.4-160.8-333.1-306.3l-63.2-128.3l-5.7-407.8l-5.7-407.8H5000h4117.9l-5.7,407.8l-5.8,407.8l-63.2,128.3c-72.8,145.5-178.1,243.1-333.1,306.3c-97.6,40.2-132.1,42.1-985.9,47.9l-886.4,5.8v101.5c0,434.6-281.4,807.9-687.3,915.1c-111,28.7-243.1,32.5-1150.6,32.5S3960.5,5016.2,3849.4,4987.5z M6074,4365.3c107.2-70.8,151.2-155.1,151.2-283.3V3969H5000H3774.8v107.2c0,134,51.7,235.5,151.2,291c67,40.2,86.2,42.1,1075.9,42.1h1007L6074,4365.3z']"), (0, _mithril.default)("path[d='M1247.7,2196.2c0-28.7,47.9-384.8,105.3-790.7c57.4-405.9,273.8-1939.3,478.6-3407.7c206.8-1468.4,382.9-2684.1,394.4-2703.2c9.6-19.2,34.5-44.1,55.5-55.5c23-13.4,930.4-19.2,2728.1-19.2h2691.7l46,47.9c26.8,24.9,47.9,53.6,47.9,63.2c0,7.7,216.3,1548.8,478.6,3421.1c264.2,1872.3,478.6,3424.9,478.6,3449.8v44H5000H1247.7V2196.2z M3206.2,1089.7c72.8-30.6,137.8-97.6,164.6-170.4c11.5-28.7,93.8-894,183.8-1924c235.5-2684.1,216.3-2387.3,164.6-2483c-70.8-135.9-266.1-204.8-390.5-141.7c-72.8,36.4-145.5,116.8-164.6,178.1c-11.5,32.5-90,851.9-174.2,1820.6c-84.2,968.7-166.6,1914.5-183.8,2104c-17.2,187.6-24.9,371.4-17.2,405.9C2821.4,1057.1,3033.9,1164.3,3206.2,1089.7z M5176.2,1068.6c28.7-21.1,68.9-68.9,90-109.1c40.2-68.9,40.2-72.7,36.4-2249.4l-5.8-2182.5l-51.7-67c-135.9-180-409.7-157-515,42.1c-34.5,63.2-36.4,160.8-36.4,2230.3V896.3l40.2,67c40.2,65.1,88.1,109.1,151.2,137.8C4940.7,1128,5124.4,1106.9,5176.2,1068.6z M7037,1089.7c78.5-32.5,162.7-139.8,176.1-225.9c11.5-78.5-350.3-4232.8-375.2-4315.1c-38.3-113-160.8-199.1-287.2-199.1c-158.9,0-306.3,139.8-306.3,291c0,97.6,363.8,4230.9,375.2,4271.1c17.2,55.5,107.2,151.3,170.4,178.1C6864.7,1122.2,6958.5,1122.2,7037,1089.7z']")]))]);
var _default = TrashSVG;
exports.default = _default;
},{"mithril":"node_modules/mithril/mithril.js"}],"js/components/trashes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GreyT = exports.YellowT = exports.GreenT = void 0;

var _mithril = _interopRequireDefault(require("mithril"));

var _trash = _interopRequireDefault(require("../svg/trash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GreenT = {
  view: function view() {
    return (0, _mithril.default)("", {
      style: {
        fill: "green"
      }
    }, _trash.default);
  }
};
exports.GreenT = GreenT;
var YellowT = {
  view: function view() {
    return (0, _mithril.default)("", {
      style: {
        fill: "yellow"
      }
    }, _trash.default);
  }
};
exports.YellowT = YellowT;
var GreyT = {
  view: function view() {
    return (0, _mithril.default)("", {
      style: {
        fill: "grey"
      }
    }, _trash.default);
  }
};
exports.GreyT = GreyT;
},{"mithril":"node_modules/mithril/mithril.js","../svg/trash":"js/svg/trash.js"}],"js/bss/styles.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css_navbar_li_active = exports.css_navbar_li = exports.css_navbar_wrap_li = exports.css_navbar_ul = exports.cssAnnonce = exports.cssSVG = void 0;

var _bss = _interopRequireDefault(require("bss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var css_navbar_ul = "ul" + (0, _bss.default)({
  margin: 0,
  padding: 0,
  textAlign: "center",
  lineHeight: "32px",
  fontSize: "24px"
});
exports.css_navbar_ul = css_navbar_ul;
var css_navbar_wrap_li = "div" + (0, _bss.default)({
  display: "flex",
  justifyContent: "space-around",
  width: "300px",
  margin: "0 auto"
});
exports.css_navbar_wrap_li = css_navbar_wrap_li;
var css_navbar_li = "li" + (0, _bss.default)({
  display: "inline",
  color: "blue",
  marginLeft: "0px",
  ":hover": {
    cursor: "pointer"
  }
});
exports.css_navbar_li = css_navbar_li;
var css_navbar_li_active = (0, _bss.default)({
  background: "blue",
  color: "white"
});
exports.css_navbar_li_active = css_navbar_li_active;
var cssSVG = "." + (0, _bss.default)({
  width: "250px",
  marginTop: "70px !important",
  margin: "0 auto"
});
exports.cssSVG = cssSVG;
var cssAnnonce = "." + (0, _bss.default)({
  textAlign: "center"
});
exports.cssAnnonce = cssAnnonce;
},{"bss":"node_modules/bss/bss.esm.js"}],"js/main.js":[function(require,module,exports) {
"use strict";

var _mithril = _interopRequireDefault(require("mithril"));

var _bss = _interopRequireDefault(require("bss"));

var _trashes = require("./components/trashes");

var css = _interopRequireWildcard(require("./bss/styles"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = document.getElementById("app");
var content = document.getElementById("content");
var _Accueil = {
  view: function view() {
    return (0, _mithril.default)("", [(0, _mithril.default)("p", "What is the colour of the trash that must be taken out today ? "), (0, _mithril.default)("p", "Click on 'Collecte'")]);
  }
};
var _Contact = {
  view: function view() {
    return "Contact";
  }
};

var _Trash = function Trash(props) {
  var currentTrash = CurrentDayTrash[now];
  var view = currentTrash !== undefined ? (0, _mithril.default)(css.cssSVG, (0, _mithril.default)(currentTrash)) : (0, _mithril.default)(css.cssAnnonce, "Pas de collecte aujourd'hui");

  var _view = function _view() {
    return (0, _mithril.default)("", view);
  };

  return {
    view: _view
  };
};
/************ Navbar handling *****************************/


var handleClick = function handleClick(e, choice) {
  var map = {
    "Accueil": function Accueil() {
      return _mithril.default.mount(content, _Accueil);
    },
    "Trash": function Trash() {
      return _mithril.default.mount(content, _Trash);
    },
    "Contact": function Contact() {
      return _mithril.default.mount(content, _Contact);
    }
  };
  var items = document.getElementsByTagName("li");
  Object.keys(items).map(function (k) {
    return items[k].classList.remove(css.css_navbar_li_active);
  });
  e.target.classList.toggle(css.css_navbar_li_active);
  map[choice]();
};

var NavBar = {
  view: function view() {
    return (0, _mithril.default)(css.css_navbar_ul, (0, _mithril.default)(css.css_navbar_wrap_li, [(0, _mithril.default)(css.css_navbar_li, {
      id: "accueil",
      onclick: function onclick(e) {
        return handleClick(e, "Accueil");
      }
    }, "Accueil"), (0, _mithril.default)(css.css_navbar_li, {
      id: "trash",
      onclick: function onclick(e) {
        return handleClick(e, "Trash");
      }
    }, "Collecte"), (0, _mithril.default)(css.css_navbar_li, {
      onclick: function onclick(e) {
        return handleClick(e, "Contact");
      }
    }, "Contact")]));
  }
};
var CurrentDayTrash = {};
var date = new Date();
var now = date.toLocaleDateString("fr-FR");
var url = "https://raw.githubusercontent.com/artyprog/viavillers/master/cuvergnon.json";
var util = {};

util.bust = function () {
  return "?bust=" + new Date().getTime();
};

util.compareDate = function (start, end) {
  var _start = new Date(start).setHours(0, 0, 0, 0);

  var _end = new Date(end).setHours(0, 0, 0, 0);

  return _end.valueOf() - _start.valueOf();
};

function fillCalendar(result) {
  var Info = {
    view: function view(props) {
      return (0, _mithril.default)("h3." + (0, _bss.default)({
        color: "blue",
        border: "1px solid grey",
        textAlign: "center"
      }), props.attrs.info);
    }
  };
  Object.values(result).map(function (v) {
    var key = Object.keys(v)[0];
    var value = v[key];

    if (value.indexOf("info") >= 0) {
      CurrentDayTrash[key] = {
        view: function view() {
          return (0, _mithril.default)(Info, {
            info: value
          });
        }
      };
    } else {
      CurrentDayTrash[key] = {
        "GreenT": _trashes.GreenT,
        "YellowT": _trashes.YellowT,
        "GreyT": _trashes.GreyT
      }[value];
    }
  });
}

function main() {
  _mithril.default.request({
    method: "GET",
    url: url + util.bust(),
    config: util.xhrConfig
  }).then(function (result) {
    fillCalendar(result);

    _mithril.default.mount(root, {
      view: function view() {
        return [(0, _mithril.default)(NavBar), "Date"];
      }
    });

    _mithril.default.mount(content, _Accueil);

    document.getElementById("accueil").classList.add(css.css_navbar_li_active);
  });
}

main();
},{"mithril":"node_modules/mithril/mithril.js","bss":"node_modules/bss/bss.esm.js","./components/trashes":"js/components/trashes.js","./bss/styles":"js/bss/styles.js"}],"../../AppData/Roaming/npm-cache/_npx/2668/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50456" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../AppData/Roaming/npm-cache/_npx/2668/node_modules/parcel/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.map