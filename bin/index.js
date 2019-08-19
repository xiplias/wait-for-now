#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var url = _interopDefault(require('url'));
var http = _interopDefault(require('http'));
var stream = _interopDefault(require('stream'));
var fs = _interopDefault(require('fs'));
var events = _interopDefault(require('events'));
var net = _interopDefault(require('net'));
var util = _interopDefault(require('util'));
var zlib = _interopDefault(require('zlib'));
var https = _interopDefault(require('https'));
var Octokit = _interopDefault(require('@octokit/rest'));

var name = "got";
var version = "9.3.1";
var description = "Simplified HTTP requests";
var license = "MIT";
var repository = "sindresorhus/got";
var main = "source";
var engines = {
	node: ">=8.6"
};
var scripts = {
	test: "xo && nyc ava",
	release: "np"
};
var files = [
	"source"
];
var keywords = [
	"http",
	"https",
	"get",
	"got",
	"url",
	"uri",
	"request",
	"util",
	"utility",
	"simple",
	"curl",
	"wget",
	"fetch",
	"net",
	"network",
	"electron"
];
var dependencies = {
	"@sindresorhus/is": "^0.12.0",
	"@szmarczak/http-timer": "^1.1.0",
	"cacheable-request": "^5.1.0",
	"decompress-response": "^3.3.0",
	duplexer3: "^0.1.4",
	"get-stream": "^4.1.0",
	"lowercase-keys": "^1.0.1",
	"mimic-response": "^1.0.1",
	"p-cancelable": "^1.0.0",
	"to-readable-stream": "^1.0.0",
	"url-parse-lax": "^3.0.0"
};
var devDependencies = {
	ava: "1.0.0-rc.1",
	coveralls: "^3.0.0",
	delay: "^4.1.0",
	"form-data": "^2.3.3",
	"get-port": "^4.0.0",
	np: "^3.0.4",
	nyc: "^13.1.0",
	"p-event": "^2.1.0",
	pem: "^1.13.2",
	proxyquire: "^2.0.1",
	sinon: "^7.1.0",
	"slow-stream": "0.0.4",
	tempfile: "^2.0.0",
	tempy: "^0.2.1",
	"tough-cookie": "^2.4.3",
	xo: "^0.23.0"
};
var ava = {
	concurrency: 4
};
var browser = {
	"decompress-response": false,
	electron: false
};
var _package = {
	name: name,
	version: version,
	description: description,
	license: license,
	repository: repository,
	main: main,
	engines: engines,
	scripts: scripts,
	files: files,
	keywords: keywords,
	dependencies: dependencies,
	devDependencies: devDependencies,
	ava: ava,
	browser: browser
};

var _package$1 = /*#__PURE__*/Object.freeze({
	name: name,
	version: version,
	description: description,
	license: license,
	repository: repository,
	main: main,
	engines: engines,
	scripts: scripts,
	files: files,
	keywords: keywords,
	dependencies: dependencies,
	devDependencies: devDependencies,
	ava: ava,
	browser: browser,
	default: _package
});

class CancelError extends Error {
	constructor(reason) {
		super(reason || 'Promise was canceled');
		this.name = 'CancelError';
	}

	get isCanceled() {
		return true;
	}
}

class PCancelable {
	static fn(userFn) {
		return (...args) => {
			return new PCancelable((resolve, reject, onCancel) => {
				args.push(onCancel);
				userFn(...args).then(resolve, reject);
			});
		};
	}

	constructor(executor) {
		this._cancelHandlers = [];
		this._isPending = true;
		this._isCanceled = false;
		this._rejectOnCancel = true;

		this._promise = new Promise((resolve, reject) => {
			this._reject = reject;

			const onResolve = value => {
				this._isPending = false;
				resolve(value);
			};

			const onReject = error => {
				this._isPending = false;
				reject(error);
			};

			const onCancel = handler => {
				this._cancelHandlers.push(handler);
			};

			Object.defineProperties(onCancel, {
				shouldReject: {
					get: () => this._rejectOnCancel,
					set: bool => {
						this._rejectOnCancel = bool;
					}
				}
			});

			return executor(onResolve, onReject, onCancel);
		});
	}

	then(onFulfilled, onRejected) {
		return this._promise.then(onFulfilled, onRejected);
	}

	catch(onRejected) {
		return this._promise.catch(onRejected);
	}

	finally(onFinally) {
		return this._promise.finally(onFinally);
	}

	cancel(reason) {
		if (!this._isPending || this._isCanceled) {
			return;
		}

		if (this._cancelHandlers.length > 0) {
			try {
				for (const handler of this._cancelHandlers) {
					handler();
				}
			} catch (error) {
				this._reject(error);
			}
		}

		this._isCanceled = true;
		if (this._rejectOnCancel) {
			this._reject(new CancelError(reason));
		}
	}

	get isCanceled() {
		return this._isCanceled;
	}
}

Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);

var pCancelable = PCancelable;
var CancelError_1 = CancelError;
pCancelable.CancelError = CancelError_1;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n.default || n;
}

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */

var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = symbolObservablePonyfill(root);

var dist = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference lib="es2016"/>
/// <reference lib="es2017.sharedmemory"/>
/// <reference lib="esnext.asynciterable"/>
/// <reference lib="dom"/>
const symbol_observable_1 = __importDefault(result);
const toString = Object.prototype.toString;
const isOfType = (type) => (value) => typeof value === type;
const isBuffer = (input) => !is.nullOrUndefined(input) && !is.nullOrUndefined(input.constructor) && is.function_(input.constructor.isBuffer) && input.constructor.isBuffer(input);
const getObjectType = (value) => {
    const objectName = toString.call(value).slice(8, -1);
    if (objectName) {
        return objectName;
    }
    return null;
};
const isObjectOfType = (type) => (value) => getObjectType(value) === type;
function is(value) {
    switch (value) {
        case null:
            return "null" /* null */;
        case true:
        case false:
            return "boolean" /* boolean */;
        default:
    }
    switch (typeof value) {
        case 'undefined':
            return "undefined" /* undefined */;
        case 'string':
            return "string" /* string */;
        case 'number':
            return "number" /* number */;
        case 'symbol':
            return "symbol" /* symbol */;
        default:
    }
    if (is.function_(value)) {
        return "Function" /* Function */;
    }
    if (is.observable(value)) {
        return "Observable" /* Observable */;
    }
    if (Array.isArray(value)) {
        return "Array" /* Array */;
    }
    if (isBuffer(value)) {
        return "Buffer" /* Buffer */;
    }
    const tagType = getObjectType(value);
    if (tagType) {
        return tagType;
    }
    if (value instanceof String || value instanceof Boolean || value instanceof Number) {
        throw new TypeError('Please don\'t use object wrappers for primitive types');
    }
    return "Object" /* Object */;
}
(function (is) {
    const isObject = (value) => typeof value === 'object';
    // tslint:disable:variable-name
    is.undefined = isOfType('undefined');
    is.string = isOfType('string');
    is.number = isOfType('number');
    is.function_ = isOfType('function');
    is.null_ = (value) => value === null;
    is.class_ = (value) => is.function_(value) && value.toString().startsWith('class ');
    is.boolean = (value) => value === true || value === false;
    is.symbol = isOfType('symbol');
    // tslint:enable:variable-name
    is.array = Array.isArray;
    is.buffer = isBuffer;
    is.nullOrUndefined = (value) => is.null_(value) || is.undefined(value);
    is.object = (value) => !is.nullOrUndefined(value) && (is.function_(value) || isObject(value));
    is.iterable = (value) => !is.nullOrUndefined(value) && is.function_(value[Symbol.iterator]);
    is.asyncIterable = (value) => !is.nullOrUndefined(value) && is.function_(value[Symbol.asyncIterator]);
    is.generator = (value) => is.iterable(value) && is.function_(value.next) && is.function_(value.throw);
    is.nativePromise = (value) => isObjectOfType("Promise" /* Promise */)(value);
    const hasPromiseAPI = (value) => !is.null_(value) &&
        isObject(value) &&
        is.function_(value.then) &&
        is.function_(value.catch);
    is.promise = (value) => is.nativePromise(value) || hasPromiseAPI(value);
    is.generatorFunction = isObjectOfType("GeneratorFunction" /* GeneratorFunction */);
    is.asyncFunction = isObjectOfType("AsyncFunction" /* AsyncFunction */);
    is.boundFunction = (value) => is.function_(value) && !value.hasOwnProperty('prototype');
    is.regExp = isObjectOfType("RegExp" /* RegExp */);
    is.date = isObjectOfType("Date" /* Date */);
    is.error = isObjectOfType("Error" /* Error */);
    is.map = (value) => isObjectOfType("Map" /* Map */)(value);
    is.set = (value) => isObjectOfType("Set" /* Set */)(value);
    is.weakMap = (value) => isObjectOfType("WeakMap" /* WeakMap */)(value);
    is.weakSet = (value) => isObjectOfType("WeakSet" /* WeakSet */)(value);
    is.int8Array = isObjectOfType("Int8Array" /* Int8Array */);
    is.uint8Array = isObjectOfType("Uint8Array" /* Uint8Array */);
    is.uint8ClampedArray = isObjectOfType("Uint8ClampedArray" /* Uint8ClampedArray */);
    is.int16Array = isObjectOfType("Int16Array" /* Int16Array */);
    is.uint16Array = isObjectOfType("Uint16Array" /* Uint16Array */);
    is.int32Array = isObjectOfType("Int32Array" /* Int32Array */);
    is.uint32Array = isObjectOfType("Uint32Array" /* Uint32Array */);
    is.float32Array = isObjectOfType("Float32Array" /* Float32Array */);
    is.float64Array = isObjectOfType("Float64Array" /* Float64Array */);
    is.arrayBuffer = isObjectOfType("ArrayBuffer" /* ArrayBuffer */);
    is.sharedArrayBuffer = isObjectOfType("SharedArrayBuffer" /* SharedArrayBuffer */);
    is.dataView = isObjectOfType("DataView" /* DataView */);
    is.directInstanceOf = (instance, klass) => Object.getPrototypeOf(instance) === klass.prototype;
    is.urlInstance = (value) => isObjectOfType("URL" /* URL */)(value);
    is.truthy = (value) => Boolean(value);
    is.falsy = (value) => !value;
    is.nan = (value) => Number.isNaN(value);
    const primitiveTypes = new Set([
        'undefined',
        'string',
        'number',
        'boolean',
        'symbol'
    ]);
    is.primitive = (value) => is.null_(value) || primitiveTypes.has(typeof value);
    is.integer = (value) => Number.isInteger(value);
    is.safeInteger = (value) => Number.isSafeInteger(value);
    is.plainObject = (value) => {
        // From: https://github.com/sindresorhus/is-plain-obj/blob/master/index.js
        let prototype;
        return getObjectType(value) === "Object" /* Object */ &&
            (prototype = Object.getPrototypeOf(value), prototype === null || // tslint:disable-line:ban-comma-operator
                prototype === Object.getPrototypeOf({}));
    };
    const typedArrayTypes = new Set([
        "Int8Array" /* Int8Array */,
        "Uint8Array" /* Uint8Array */,
        "Uint8ClampedArray" /* Uint8ClampedArray */,
        "Int16Array" /* Int16Array */,
        "Uint16Array" /* Uint16Array */,
        "Int32Array" /* Int32Array */,
        "Uint32Array" /* Uint32Array */,
        "Float32Array" /* Float32Array */,
        "Float64Array" /* Float64Array */
    ]);
    is.typedArray = (value) => {
        const objectType = getObjectType(value);
        if (objectType === null) {
            return false;
        }
        return typedArrayTypes.has(objectType);
    };
    const isValidLength = (value) => is.safeInteger(value) && value > -1;
    is.arrayLike = (value) => !is.nullOrUndefined(value) && !is.function_(value) && isValidLength(value.length);
    is.inRange = (value, range) => {
        if (is.number(range)) {
            return value >= Math.min(0, range) && value <= Math.max(range, 0);
        }
        if (is.array(range) && range.length === 2) {
            return value >= Math.min(...range) && value <= Math.max(...range);
        }
        throw new TypeError(`Invalid range: ${JSON.stringify(range)}`);
    };
    const NODE_TYPE_ELEMENT = 1;
    const DOM_PROPERTIES_TO_CHECK = [
        'innerHTML',
        'ownerDocument',
        'style',
        'attributes',
        'nodeValue'
    ];
    is.domElement = (value) => is.object(value) && value.nodeType === NODE_TYPE_ELEMENT && is.string(value.nodeName) &&
        !is.plainObject(value) && DOM_PROPERTIES_TO_CHECK.every(property => property in value);
    is.observable = (value) => Boolean(value && value[symbol_observable_1.default] && value === value[symbol_observable_1.default]());
    is.nodeStream = (value) => !is.nullOrUndefined(value) && isObject(value) && is.function_(value.pipe) && !is.observable(value);
    is.infinite = (value) => value === Infinity || value === -Infinity;
    const isAbsoluteMod2 = (rem) => (value) => is.integer(value) && Math.abs(value % 2) === rem;
    is.even = isAbsoluteMod2(0);
    is.odd = isAbsoluteMod2(1);
    const isWhiteSpaceString = (value) => is.string(value) && /\S/.test(value) === false;
    is.emptyArray = (value) => is.array(value) && value.length === 0;
    is.nonEmptyArray = (value) => is.array(value) && value.length > 0;
    is.emptyString = (value) => is.string(value) && value.length === 0;
    is.nonEmptyString = (value) => is.string(value) && value.length > 0;
    is.emptyStringOrWhitespace = (value) => is.emptyString(value) || isWhiteSpaceString(value);
    is.emptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0;
    is.nonEmptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length > 0;
    is.emptySet = (value) => is.set(value) && value.size === 0;
    is.nonEmptySet = (value) => is.set(value) && value.size > 0;
    is.emptyMap = (value) => is.map(value) && value.size === 0;
    is.nonEmptyMap = (value) => is.map(value) && value.size > 0;
    const predicateOnArray = (method, predicate, values) => {
        if (is.function_(predicate) === false) {
            throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
        }
        if (values.length === 0) {
            throw new TypeError('Invalid number of values');
        }
        return method.call(values, predicate);
    };
    // tslint:disable variable-name
    is.any = (predicate, ...values) => predicateOnArray(Array.prototype.some, predicate, values);
    is.all = (predicate, ...values) => predicateOnArray(Array.prototype.every, predicate, values);
    // tslint:enable variable-name
})(is || (is = {}));
// Some few keywords are reserved, but we'll populate them for Node.js users
// See https://github.com/Microsoft/TypeScript/issues/2536
Object.defineProperties(is, {
    class: {
        value: is.class_
    },
    function: {
        value: is.function_
    },
    null: {
        value: is.null_
    }
});
exports.default = is;
// For CommonJS default export support
module.exports = is;
module.exports.default = is;

});

unwrapExports(dist);

class GotError extends Error {
	constructor(message, error, opts) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = 'GotError';

		if (!dist.undefined(error.code)) {
			this.code = error.code;
		}

		Object.assign(this, {
			host: opts.host,
			hostname: opts.hostname,
			method: opts.method,
			path: opts.path,
			socketPath: opts.socketPath,
			protocol: opts.protocol,
			url: opts.href
		});
	}
}

var GotError_1 = GotError;

var CacheError = class extends GotError {
	constructor(error, opts) {
		super(error.message, error, opts);
		this.name = 'CacheError';
	}
};

var RequestError = class extends GotError {
	constructor(error, opts) {
		super(error.message, error, opts);
		this.name = 'RequestError';
	}
};

var ReadError = class extends GotError {
	constructor(error, opts) {
		super(error.message, error, opts);
		this.name = 'ReadError';
	}
};

var ParseError = class extends GotError {
	constructor(error, statusCode, opts, data) {
		super(`${error.message} in "${url.format(opts)}": \n${data.slice(0, 77)}...`, error, opts);
		this.name = 'ParseError';
		this.statusCode = statusCode;
		this.statusMessage = http.STATUS_CODES[this.statusCode];
	}
};

var HTTPError = class extends GotError {
	constructor(response, opts) {
		const {statusCode} = response;
		let {statusMessage} = response;

		if (statusMessage) {
			statusMessage = statusMessage.replace(/\r?\n/g, ' ').trim();
		} else {
			statusMessage = http.STATUS_CODES[statusCode];
		}
		super(`Response code ${statusCode} (${statusMessage})`, {}, opts);
		this.name = 'HTTPError';
		this.statusCode = statusCode;
		this.statusMessage = statusMessage;
		this.headers = response.headers;
		this.body = response.body;
	}
};

var MaxRedirectsError = class extends GotError {
	constructor(statusCode, redirectUrls, opts) {
		super('Redirected 10 times. Aborting.', {}, opts);
		this.name = 'MaxRedirectsError';
		this.statusCode = statusCode;
		this.statusMessage = http.STATUS_CODES[this.statusCode];
		this.redirectUrls = redirectUrls;
	}
};

var UnsupportedProtocolError = class extends GotError {
	constructor(opts) {
		super(`Unsupported protocol "${opts.protocol}"`, {}, opts);
		this.name = 'UnsupportedProtocolError';
	}
};

var TimeoutError = class extends GotError {
	constructor(error, opts) {
		super(error.message, {code: 'ETIMEDOUT'}, opts);
		this.name = 'TimeoutError';
		this.event = error.event;
	}
};

var CancelError$1 = pCancelable.CancelError;

var errors = {
	GotError: GotError_1,
	CacheError: CacheError,
	RequestError: RequestError,
	ReadError: ReadError,
	ParseError: ParseError,
	HTTPError: HTTPError,
	MaxRedirectsError: MaxRedirectsError,
	UnsupportedProtocolError: UnsupportedProtocolError,
	TimeoutError: TimeoutError,
	CancelError: CancelError$1
};

function DuplexWrapper(options, writable, readable) {
  if (typeof readable === "undefined") {
    readable = writable;
    writable = options;
    options = null;
  }

  stream.Duplex.call(this, options);

  if (typeof readable.read !== "function") {
    readable = (new stream.Readable(options)).wrap(readable);
  }

  this._writable = writable;
  this._readable = readable;
  this._waiting = false;

  var self = this;

  writable.once("finish", function() {
    self.end();
  });

  this.once("finish", function() {
    writable.end();
  });

  readable.on("readable", function() {
    if (self._waiting) {
      self._waiting = false;
      self._read();
    }
  });

  readable.once("end", function() {
    self.push(null);
  });

  if (!options || typeof options.bubbleErrors === "undefined" || options.bubbleErrors) {
    writable.on("error", function(err) {
      self.emit("error", err);
    });

    readable.on("error", function(err) {
      self.emit("error", err);
    });
  }
}

DuplexWrapper.prototype = Object.create(stream.Duplex.prototype, {constructor: {value: DuplexWrapper}});

DuplexWrapper.prototype._write = function _write(input, encoding, done) {
  this._writable.write(input, encoding, done);
};

DuplexWrapper.prototype._read = function _read() {
  var buf;
  var reads = 0;
  while ((buf = this._readable.read()) !== null) {
    this.push(buf);
    reads++;
  }
  if (reads === 0) {
    this._waiting = true;
  }
};

var duplexer3 = function duplex2(options, writable, readable) {
  return new DuplexWrapper(options, writable, readable);
};

var DuplexWrapper_1 = DuplexWrapper;
duplexer3.DuplexWrapper = DuplexWrapper_1;

// TODO: Use the `URL` global when targeting Node.js 10
const URLParser = typeof URL === 'undefined' ? url.URL : URL;

const testParameter = (name, filters) => {
	return filters.some(filter => filter instanceof RegExp ? filter.test(name) : filter === name);
};

var normalizeUrl = (urlString, opts) => {
	opts = Object.assign({
		defaultProtocol: 'http:',
		normalizeProtocol: true,
		forceHttp: false,
		forceHttps: false,
		stripHash: true,
		stripWWW: true,
		removeQueryParameters: [/^utm_\w+/i],
		removeTrailingSlash: true,
		removeDirectoryIndex: false,
		sortQueryParameters: true
	}, opts);

	// Backwards compatibility
	if (Reflect.has(opts, 'normalizeHttps')) {
		opts.forceHttp = opts.normalizeHttps;
	}

	if (Reflect.has(opts, 'normalizeHttp')) {
		opts.forceHttps = opts.normalizeHttp;
	}

	if (Reflect.has(opts, 'stripFragment')) {
		opts.stripHash = opts.stripFragment;
	}

	urlString = urlString.trim();

	const hasRelativeProtocol = urlString.startsWith('//');
	const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);

	// Prepend protocol
	if (!isRelativeUrl) {
		urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, opts.defaultProtocol);
	}

	const urlObj = new URLParser(urlString);

	if (opts.forceHttp && opts.forceHttps) {
		throw new Error('The `forceHttp` and `forceHttps` options cannot be used together');
	}

	if (opts.forceHttp && urlObj.protocol === 'https:') {
		urlObj.protocol = 'http:';
	}

	if (opts.forceHttps && urlObj.protocol === 'http:') {
		urlObj.protocol = 'https:';
	}

	// Remove hash
	if (opts.stripHash) {
		urlObj.hash = '';
	}

	// Remove duplicate slashes if not preceded by a protocol
	if (urlObj.pathname) {
		// TODO: Use the following instead when targeting Node.js 10
		// `urlObj.pathname = urlObj.pathname.replace(/(?<!https?:)\/{2,}/g, '/');`
		urlObj.pathname = urlObj.pathname.replace(/((?![https?:]).)\/{2,}/g, (_, p1) => {
			if (/^(?!\/)/g.test(p1)) {
				return `${p1}/`;
			}
			return '/';
		});
	}

	// Decode URI octets
	if (urlObj.pathname) {
		urlObj.pathname = decodeURI(urlObj.pathname);
	}

	// Remove directory index
	if (opts.removeDirectoryIndex === true) {
		opts.removeDirectoryIndex = [/^index\.[a-z]+$/];
	}

	if (Array.isArray(opts.removeDirectoryIndex) && opts.removeDirectoryIndex.length > 0) {
		let pathComponents = urlObj.pathname.split('/');
		const lastComponent = pathComponents[pathComponents.length - 1];

		if (testParameter(lastComponent, opts.removeDirectoryIndex)) {
			pathComponents = pathComponents.slice(0, pathComponents.length - 1);
			urlObj.pathname = pathComponents.slice(1).join('/') + '/';
		}
	}

	if (urlObj.hostname) {
		// Remove trailing dot
		urlObj.hostname = urlObj.hostname.replace(/\.$/, '');

		// Remove `www.`
		// eslint-disable-next-line no-useless-escape
		if (opts.stripWWW && /^www\.([a-z\-\d]{2,63})\.([a-z\.]{2,5})$/.test(urlObj.hostname)) {
			// Each label should be max 63 at length (min: 2).
			// The extension should be max 5 at length (min: 2).
			// Source: https://en.wikipedia.org/wiki/Hostname#Restrictions_on_valid_host_names
			urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
		}
	}

	// Remove query unwanted parameters
	if (Array.isArray(opts.removeQueryParameters)) {
		for (const key of [...urlObj.searchParams.keys()]) {
			if (testParameter(key, opts.removeQueryParameters)) {
				urlObj.searchParams.delete(key);
			}
		}
	}

	// Sort query parameters
	if (opts.sortQueryParameters) {
		urlObj.searchParams.sort();
	}

	// Take advantage of many of the Node `url` normalizations
	urlString = urlObj.toString();

	// Remove ending `/`
	if (opts.removeTrailingSlash || urlObj.pathname === '/') {
		urlString = urlString.replace(/\/$/, '');
	}

	// Restore relative protocol, if applicable
	if (hasRelativeProtocol && !opts.normalizeProtocol) {
		urlString = urlString.replace(/^http:\/\//, '//');
	}

	return urlString;
};

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy;
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k];
  });

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    var ret = fn.apply(this, args);
    var cb = args[args.length-1];
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k];
      });
    }
    return ret
  }
}

var once_1 = wrappy_1(once);
var strict = wrappy_1(onceStrict);

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  });

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  });
});

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  f.called = false;
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  var name = fn.name || 'Function wrapped with `once`';
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f
}
once_1.strict = strict;

var noop = function() {};

var isRequest = function(stream$$1) {
	return stream$$1.setHeader && typeof stream$$1.abort === 'function';
};

var isChildProcess = function(stream$$1) {
	return stream$$1.stdio && Array.isArray(stream$$1.stdio) && stream$$1.stdio.length === 3
};

var eos = function(stream$$1, opts, callback) {
	if (typeof opts === 'function') return eos(stream$$1, null, opts);
	if (!opts) opts = {};

	callback = once_1(callback || noop);

	var ws = stream$$1._writableState;
	var rs = stream$$1._readableState;
	var readable = opts.readable || (opts.readable !== false && stream$$1.readable);
	var writable = opts.writable || (opts.writable !== false && stream$$1.writable);

	var onlegacyfinish = function() {
		if (!stream$$1.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream$$1);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream$$1);
	};

	var onexit = function(exitCode) {
		callback.call(stream$$1, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream$$1, err);
	};

	var onclose = function() {
		if (readable && !(rs && rs.ended)) return callback.call(stream$$1, new Error('premature close'));
		if (writable && !(ws && ws.ended)) return callback.call(stream$$1, new Error('premature close'));
	};

	var onrequest = function() {
		stream$$1.req.on('finish', onfinish);
	};

	if (isRequest(stream$$1)) {
		stream$$1.on('complete', onfinish);
		stream$$1.on('abort', onclose);
		if (stream$$1.req) onrequest();
		else stream$$1.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream$$1.on('end', onlegacyfinish);
		stream$$1.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream$$1)) stream$$1.on('exit', onexit);

	stream$$1.on('end', onend);
	stream$$1.on('finish', onfinish);
	if (opts.error !== false) stream$$1.on('error', onerror);
	stream$$1.on('close', onclose);

	return function() {
		stream$$1.removeListener('complete', onfinish);
		stream$$1.removeListener('abort', onclose);
		stream$$1.removeListener('request', onrequest);
		if (stream$$1.req) stream$$1.req.removeListener('finish', onfinish);
		stream$$1.removeListener('end', onlegacyfinish);
		stream$$1.removeListener('close', onlegacyfinish);
		stream$$1.removeListener('finish', onfinish);
		stream$$1.removeListener('exit', onexit);
		stream$$1.removeListener('end', onend);
		stream$$1.removeListener('error', onerror);
		stream$$1.removeListener('close', onclose);
	};
};

var endOfStream = eos;

// we only need fs to get the ReadStream and WriteStream prototypes

var noop$1 = function () {};
var ancient = /^v?\.0/.test(process.version);

var isFn = function (fn) {
  return typeof fn === 'function'
};

var isFS = function (stream$$1) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream$$1 instanceof (fs.ReadStream || noop$1) || stream$$1 instanceof (fs.WriteStream || noop$1)) && isFn(stream$$1.close)
};

var isRequest$1 = function (stream$$1) {
  return stream$$1.setHeader && isFn(stream$$1.abort)
};

var destroyer = function (stream$$1, reading, writing, callback) {
  callback = once_1(callback);

  var closed = false;
  stream$$1.on('close', function () {
    closed = true;
  });

  endOfStream(stream$$1, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true;
    callback();
  });

  var destroyed = false;
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true;

    if (isFS(stream$$1)) return stream$$1.close(noop$1) // use close for fs streams to avoid fd leaks
    if (isRequest$1(stream$$1)) return stream$$1.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream$$1.destroy)) return stream$$1.destroy()

    callback(err || new Error('stream was destroyed'));
  }
};

var call = function (fn) {
  fn();
};

var pipe = function (from, to) {
  return from.pipe(to)
};

var pump = function () {
  var streams = Array.prototype.slice.call(arguments);
  var callback = isFn(streams[streams.length - 1] || noop$1) && streams.pop() || noop$1;

  if (Array.isArray(streams[0])) streams = streams[0];
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error;
  var destroys = streams.map(function (stream$$1, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream$$1, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return
      destroys.forEach(call);
      callback(error);
    })
  });

  return streams.reduce(pipe)
};

var pump_1 = pump;

const {PassThrough} = stream;

var bufferStream = options => {
	options = Object.assign({}, options);

	const {array} = options;
	let {encoding} = options;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream$$1 = new PassThrough({objectMode});

	if (encoding) {
		stream$$1.setEncoding(encoding);
	}

	stream$$1.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream$$1.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream$$1.getBufferedLength = () => len;

	return stream$$1;
};

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = Object.assign({maxBuffer: Infinity}, options);

	const {maxBuffer} = options;

	let stream$$1;
	return new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream$$1.getBufferedValue();
			}
			reject(error);
		};

		stream$$1 = pump_1(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream$$1.on('data', () => {
			if (stream$$1.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	}).then(() => stream$$1.getBufferedValue());
}

var getStream_1 = getStream;
var buffer = (stream$$1, options) => getStream(stream$$1, Object.assign({}, options, {encoding: 'buffer'}));
var array = (stream$$1, options) => getStream(stream$$1, Object.assign({}, options, {array: true}));
var MaxBufferError_1 = MaxBufferError;
getStream_1.buffer = buffer;
getStream_1.array = array;
getStream_1.MaxBufferError = MaxBufferError_1;

// rfc7231 6.1
const statusCodeCacheableByDefault = [200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501];

// This implementation does not understand partial responses (206)
const understoodStatuses = [200, 203, 204, 300, 301, 302, 303, 307, 308, 404, 405, 410, 414, 501];

const hopByHopHeaders = {
    'date': true, // included, because we add Age update Date
    'connection':true, 'keep-alive':true, 'proxy-authenticate':true, 'proxy-authorization':true, 'te':true, 'trailer':true, 'transfer-encoding':true, 'upgrade':true
};
const excludedFromRevalidationUpdate = {
    // Since the old body is reused, it doesn't make sense to change properties of the body
    'content-length': true, 'content-encoding': true, 'transfer-encoding': true,
    'content-range': true,
};

function parseCacheControl(header) {
    const cc = {};
    if (!header) return cc;

    // TODO: When there is more than one value present for a given directive (e.g., two Expires header fields, multiple Cache-Control: max-age directives),
    // the directive's value is considered invalid. Caches are encouraged to consider responses that have invalid freshness information to be stale
    const parts = header.trim().split(/\s*,\s*/); // TODO: lame parsing
    for(const part of parts) {
        const [k,v] = part.split(/\s*=\s*/, 2);
        cc[k] = (v === undefined) ? true : v.replace(/^"|"$/g, ''); // TODO: lame unquoting
    }

    return cc;
}

function formatCacheControl(cc) {
    let parts = [];
    for(const k in cc) {
        const v = cc[k];
        parts.push(v === true ? k : k + '=' + v);
    }
    if (!parts.length) {
        return undefined;
    }
    return parts.join(', ');
}

var httpCacheSemantics = class CachePolicy {
    constructor(req, res, {shared, cacheHeuristic, immutableMinTimeToLive, ignoreCargoCult, trustServerDate, _fromObject} = {}) {
        if (_fromObject) {
            this._fromObject(_fromObject);
            return;
        }

        if (!res || !res.headers) {
            throw Error("Response headers missing");
        }
        this._assertRequestHasHeaders(req);

        this._responseTime = this.now();
        this._isShared = shared !== false;
        this._trustServerDate = undefined !== trustServerDate ? trustServerDate : true;
        this._cacheHeuristic = undefined !== cacheHeuristic ? cacheHeuristic : 0.1; // 10% matches IE
        this._immutableMinTtl = undefined !== immutableMinTimeToLive ? immutableMinTimeToLive : 24*3600*1000;

        this._status = 'status' in res ? res.status : 200;
        this._resHeaders = res.headers;
        this._rescc = parseCacheControl(res.headers['cache-control']);
        this._method = 'method' in req ? req.method : 'GET';
        this._url = req.url;
        this._host = req.headers.host;
        this._noAuthorization = !req.headers.authorization;
        this._reqHeaders = res.headers.vary ? req.headers : null; // Don't keep all request headers if they won't be used
        this._reqcc = parseCacheControl(req.headers['cache-control']);

        // Assume that if someone uses legacy, non-standard uncecessary options they don't understand caching,
        // so there's no point stricly adhering to the blindly copy&pasted directives.
        if (ignoreCargoCult && "pre-check" in this._rescc && "post-check" in this._rescc) {
            delete this._rescc['pre-check'];
            delete this._rescc['post-check'];
            delete this._rescc['no-cache'];
            delete this._rescc['no-store'];
            delete this._rescc['must-revalidate'];
            this._resHeaders = Object.assign({}, this._resHeaders, {'cache-control': formatCacheControl(this._rescc)});
            delete this._resHeaders.expires;
            delete this._resHeaders.pragma;
        }

        // When the Cache-Control header field is not present in a request, caches MUST consider the no-cache request pragma-directive
        // as having the same effect as if "Cache-Control: no-cache" were present (see Section 5.2.1).
        if (!res.headers['cache-control'] && /no-cache/.test(res.headers.pragma)) {
            this._rescc['no-cache'] = true;
        }
    }

    now() {
        return Date.now();
    }

    storable() {
        // The "no-store" request directive indicates that a cache MUST NOT store any part of either this request or any response to it.
        return !!(!this._reqcc['no-store'] &&
            // A cache MUST NOT store a response to any request, unless:
            // The request method is understood by the cache and defined as being cacheable, and
            ('GET' === this._method || 'HEAD' === this._method || ('POST' === this._method && this._hasExplicitExpiration())) &&
            // the response status code is understood by the cache, and
            understoodStatuses.indexOf(this._status) !== -1 &&
            // the "no-store" cache directive does not appear in request or response header fields, and
            !this._rescc['no-store'] &&
            // the "private" response directive does not appear in the response, if the cache is shared, and
            (!this._isShared || !this._rescc.private) &&
            // the Authorization header field does not appear in the request, if the cache is shared,
            (!this._isShared || this._noAuthorization || this._allowsStoringAuthenticated()) &&
            // the response either:
            (
                // contains an Expires header field, or
                this._resHeaders.expires ||
                // contains a max-age response directive, or
                // contains a s-maxage response directive and the cache is shared, or
                // contains a public response directive.
                this._rescc.public || this._rescc['max-age'] || this._rescc['s-maxage'] ||
                // has a status code that is defined as cacheable by default
                statusCodeCacheableByDefault.indexOf(this._status) !== -1
            ));
    }

    _hasExplicitExpiration() {
        // 4.2.1 Calculating Freshness Lifetime
        return (this._isShared && this._rescc['s-maxage']) ||
            this._rescc['max-age'] ||
            this._resHeaders.expires;
    }

    _assertRequestHasHeaders(req) {
        if (!req || !req.headers) {
            throw Error("Request headers missing");
        }
    }

    satisfiesWithoutRevalidation(req) {
        this._assertRequestHasHeaders(req);

        // When presented with a request, a cache MUST NOT reuse a stored response, unless:
        // the presented request does not contain the no-cache pragma (Section 5.4), nor the no-cache cache directive,
        // unless the stored response is successfully validated (Section 4.3), and
        const requestCC = parseCacheControl(req.headers['cache-control']);
        if (requestCC['no-cache'] || /no-cache/.test(req.headers.pragma)) {
            return false;
        }

        if (requestCC['max-age'] && this.age() > requestCC['max-age']) {
            return false;
        }

        if (requestCC['min-fresh'] && this.timeToLive() < 1000*requestCC['min-fresh']) {
            return false;
        }

        // the stored response is either:
        // fresh, or allowed to be served stale
        if (this.stale()) {
            const allowsStale = requestCC['max-stale'] && !this._rescc['must-revalidate'] && (true === requestCC['max-stale'] || requestCC['max-stale'] > this.age() - this.maxAge());
            if (!allowsStale) {
                return false;
            }
        }

        return this._requestMatches(req, false);
    }

    _requestMatches(req, allowHeadMethod) {
        // The presented effective request URI and that of the stored response match, and
        return (!this._url || this._url === req.url) &&
            (this._host === req.headers.host) &&
            // the request method associated with the stored response allows it to be used for the presented request, and
            (!req.method || this._method === req.method || (allowHeadMethod && 'HEAD' === req.method)) &&
            // selecting header fields nominated by the stored response (if any) match those presented, and
            this._varyMatches(req);
    }

    _allowsStoringAuthenticated() {
        //  following Cache-Control response directives (Section 5.2.2) have such an effect: must-revalidate, public, and s-maxage.
        return this._rescc['must-revalidate'] || this._rescc.public || this._rescc['s-maxage'];
    }

    _varyMatches(req) {
        if (!this._resHeaders.vary) {
            return true;
        }

        // A Vary header field-value of "*" always fails to match
        if (this._resHeaders.vary === '*') {
            return false;
        }

        const fields = this._resHeaders.vary.trim().toLowerCase().split(/\s*,\s*/);
        for(const name of fields) {
            if (req.headers[name] !== this._reqHeaders[name]) return false;
        }
        return true;
    }

    _copyWithoutHopByHopHeaders(inHeaders) {
        const headers = {};
        for(const name in inHeaders) {
            if (hopByHopHeaders[name]) continue;
            headers[name] = inHeaders[name];
        }
        // 9.1.  Connection
        if (inHeaders.connection) {
            const tokens = inHeaders.connection.trim().split(/\s*,\s*/);
            for(const name of tokens) {
                delete headers[name];
            }
        }
        if (headers.warning) {
            const warnings = headers.warning.split(/,/).filter(warning => {
                return !/^\s*1[0-9][0-9]/.test(warning);
            });
            if (!warnings.length) {
                delete headers.warning;
            } else {
                headers.warning = warnings.join(',').trim();
            }
        }
        return headers;
    }

    responseHeaders() {
        const headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
        const age = this.age();

        // A cache SHOULD generate 113 warning if it heuristically chose a freshness
        // lifetime greater than 24 hours and the response's age is greater than 24 hours.
        if (age > 3600*24 && !this._hasExplicitExpiration() && this.maxAge() > 3600*24) {
            headers.warning = (headers.warning ? `${headers.warning}, ` : '') + '113 - "rfc7234 5.5.4"';
        }
        headers.age = `${Math.round(age)}`;
        headers.date = new Date(this.now()).toUTCString();
        return headers;
    }

    /**
     * Value of the Date response header or current time if Date was demed invalid
     * @return timestamp
     */
    date() {
        if (this._trustServerDate) {
            return this._serverDate();
        }
        return this._responseTime;
    }

    _serverDate() {
        const dateValue = Date.parse(this._resHeaders.date);
        if (isFinite(dateValue)) {
            const maxClockDrift = 8*3600*1000;
            const clockDrift = Math.abs(this._responseTime - dateValue);
            if (clockDrift < maxClockDrift) {
                return dateValue;
            }
        }
        return this._responseTime;
    }

    /**
     * Value of the Age header, in seconds, updated for the current time.
     * May be fractional.
     *
     * @return Number
     */
    age() {
        let age = Math.max(0, (this._responseTime - this.date())/1000);
        if (this._resHeaders.age) {
            let ageValue = this._ageValue();
            if (ageValue > age) age = ageValue;
        }

        const residentTime = (this.now() - this._responseTime)/1000;
        return age + residentTime;
    }

    _ageValue() {
        const ageValue = parseInt(this._resHeaders.age);
        return isFinite(ageValue) ? ageValue : 0;
    }

    /**
     * Value of applicable max-age (or heuristic equivalent) in seconds. This counts since response's `Date`.
     *
     * For an up-to-date value, see `timeToLive()`.
     *
     * @return Number
     */
    maxAge() {
        if (!this.storable() || this._rescc['no-cache']) {
            return 0;
        }

        // Shared responses with cookies are cacheable according to the RFC, but IMHO it'd be unwise to do so by default
        // so this implementation requires explicit opt-in via public header
        if (this._isShared && (this._resHeaders['set-cookie'] && !this._rescc.public && !this._rescc.immutable)) {
            return 0;
        }

        if (this._resHeaders.vary === '*') {
            return 0;
        }

        if (this._isShared) {
            if (this._rescc['proxy-revalidate']) {
                return 0;
            }
            // if a response includes the s-maxage directive, a shared cache recipient MUST ignore the Expires field.
            if (this._rescc['s-maxage']) {
                return parseInt(this._rescc['s-maxage'], 10);
            }
        }

        // If a response includes a Cache-Control field with the max-age directive, a recipient MUST ignore the Expires field.
        if (this._rescc['max-age']) {
            return parseInt(this._rescc['max-age'], 10);
        }

        const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;

        const dateValue = this._serverDate();
        if (this._resHeaders.expires) {
            const expires = Date.parse(this._resHeaders.expires);
            // A cache recipient MUST interpret invalid date formats, especially the value "0", as representing a time in the past (i.e., "already expired").
            if (Number.isNaN(expires) || expires < dateValue) {
                return 0;
            }
            return Math.max(defaultMinTtl, (expires - dateValue)/1000);
        }

        if (this._resHeaders['last-modified']) {
            const lastModified = Date.parse(this._resHeaders['last-modified']);
            if (isFinite(lastModified) && dateValue > lastModified) {
                return Math.max(defaultMinTtl, (dateValue - lastModified)/1000 * this._cacheHeuristic);
            }
        }

        return defaultMinTtl;
    }

    timeToLive() {
        return Math.max(0, this.maxAge() - this.age())*1000;
    }

    stale() {
        return this.maxAge() <= this.age();
    }

    static fromObject(obj) {
        return new this(undefined, undefined, {_fromObject:obj});
    }

    _fromObject(obj) {
        if (this._responseTime) throw Error("Reinitialized");
        if (!obj || obj.v !== 1) throw Error("Invalid serialization");

        this._responseTime = obj.t;
        this._isShared = obj.sh;
        this._cacheHeuristic = obj.ch;
        this._immutableMinTtl = obj.imm !== undefined ? obj.imm : 24*3600*1000;
        this._status = obj.st;
        this._resHeaders = obj.resh;
        this._rescc = obj.rescc;
        this._method = obj.m;
        this._url = obj.u;
        this._host = obj.h;
        this._noAuthorization = obj.a;
        this._reqHeaders = obj.reqh;
        this._reqcc = obj.reqcc;
    }

    toObject() {
        return {
            v:1,
            t: this._responseTime,
            sh: this._isShared,
            ch: this._cacheHeuristic,
            imm: this._immutableMinTtl,
            st: this._status,
            resh: this._resHeaders,
            rescc: this._rescc,
            m: this._method,
            u: this._url,
            h: this._host,
            a: this._noAuthorization,
            reqh: this._reqHeaders,
            reqcc: this._reqcc,
        };
    }

    /**
     * Headers for sending to the origin server to revalidate stale response.
     * Allows server to return 304 to allow reuse of the previous response.
     *
     * Hop by hop headers are always stripped.
     * Revalidation headers may be added or removed, depending on request.
     */
    revalidationHeaders(incomingReq) {
        this._assertRequestHasHeaders(incomingReq);
        const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);

        // This implementation does not understand range requests
        delete headers['if-range'];

        if (!this._requestMatches(incomingReq, true) || !this.storable()) { // revalidation allowed via HEAD
            // not for the same resource, or wasn't allowed to be cached anyway
            delete headers['if-none-match'];
            delete headers['if-modified-since'];
            return headers;
        }

        /* MUST send that entity-tag in any cache validation request (using If-Match or If-None-Match) if an entity-tag has been provided by the origin server. */
        if (this._resHeaders.etag) {
            headers['if-none-match'] = headers['if-none-match'] ? `${headers['if-none-match']}, ${this._resHeaders.etag}` : this._resHeaders.etag;
        }

        // Clients MAY issue simple (non-subrange) GET requests with either weak validators or strong validators. Clients MUST NOT use weak validators in other forms of request.
        const forbidsWeakValidators = headers['accept-ranges'] || headers['if-match'] || headers['if-unmodified-since'] || (this._method && this._method != 'GET');

        /* SHOULD send the Last-Modified value in non-subrange cache validation requests (using If-Modified-Since) if only a Last-Modified value has been provided by the origin server.
        Note: This implementation does not understand partial responses (206) */
        if (forbidsWeakValidators) {
            delete headers['if-modified-since'];

            if (headers['if-none-match']) {
                const etags = headers['if-none-match'].split(/,/).filter(etag => {
                    return !/^\s*W\//.test(etag);
                });
                if (!etags.length) {
                    delete headers['if-none-match'];
                } else {
                    headers['if-none-match'] = etags.join(',').trim();
                }
            }
        } else if (this._resHeaders['last-modified'] && !headers['if-modified-since']) {
            headers['if-modified-since'] = this._resHeaders['last-modified'];
        }

        return headers;
    }

    /**
     * Creates new CachePolicy with information combined from the previews response,
     * and the new revalidation response.
     *
     * Returns {policy, modified} where modified is a boolean indicating
     * whether the response body has been modified, and old cached body can't be used.
     *
     * @return {Object} {policy: CachePolicy, modified: Boolean}
     */
    revalidatedPolicy(request, response) {
        this._assertRequestHasHeaders(request);
        if (!response || !response.headers) {
            throw Error("Response headers missing");
        }

        // These aren't going to be supported exactly, since one CachePolicy object
        // doesn't know about all the other cached objects.
        let matches = false;
        if (response.status !== undefined && response.status != 304) {
            matches = false;
        } else if (response.headers.etag && !/^\s*W\//.test(response.headers.etag)) {
            // "All of the stored responses with the same strong validator are selected.
            // If none of the stored responses contain the same strong validator,
            // then the cache MUST NOT use the new response to update any stored responses."
            matches = this._resHeaders.etag && this._resHeaders.etag.replace(/^\s*W\//,'') === response.headers.etag;
        } else if (this._resHeaders.etag && response.headers.etag) {
            // "If the new response contains a weak validator and that validator corresponds
            // to one of the cache's stored responses,
            // then the most recent of those matching stored responses is selected for update."
            matches = this._resHeaders.etag.replace(/^\s*W\//,'') === response.headers.etag.replace(/^\s*W\//,'');
        } else if (this._resHeaders['last-modified']) {
            matches = this._resHeaders['last-modified'] === response.headers['last-modified'];
        } else {
            // If the new response does not include any form of validator (such as in the case where
            // a client generates an If-Modified-Since request from a source other than the Last-Modified
            // response header field), and there is only one stored response, and that stored response also
            // lacks a validator, then that stored response is selected for update.
            if (!this._resHeaders.etag && !this._resHeaders['last-modified'] &&
                !response.headers.etag && !response.headers['last-modified']) {
                matches = true;
            }
        }

        if (!matches) {
            return {
                policy: new this.constructor(request, response),
                modified: true,
            }
        }

        // use other header fields provided in the 304 (Not Modified) response to replace all instances
        // of the corresponding header fields in the stored response.
        const headers = {};
        for(const k in this._resHeaders) {
            headers[k] = k in response.headers && !excludedFromRevalidationUpdate[k] ? response.headers[k] : this._resHeaders[k];
        }

        const newResponse = Object.assign({}, response, {
            status: this._status,
            method: this._method,
            headers,
        });
        return {
            policy: new this.constructor(request, newResponse),
            modified: false,
        };
    }
};

var lowercaseKeys = function (obj) {
	var ret = {};
	var keys = Object.keys(Object(obj));

	for (var i = 0; i < keys.length; i++) {
		ret[keys[i].toLowerCase()] = obj[keys[i]];
	}

	return ret;
};

const Readable = stream.Readable;


class Response extends Readable {
	constructor(statusCode, headers, body, url$$1) {
		if (typeof statusCode !== 'number') {
			throw new TypeError('Argument `statusCode` should be a number');
		}
		if (typeof headers !== 'object') {
			throw new TypeError('Argument `headers` should be an object');
		}
		if (!(body instanceof Buffer)) {
			throw new TypeError('Argument `body` should be a buffer');
		}
		if (typeof url$$1 !== 'string') {
			throw new TypeError('Argument `url` should be a string');
		}

		super();
		this.statusCode = statusCode;
		this.headers = lowercaseKeys(headers);
		this.body = body;
		this.url = url$$1;
	}

	_read() {
		this.push(this.body);
		this.push(null);
	}
}

var src = Response;

// We define these manually to ensure they're always copied
// even if they would move up the prototype chain
// https://nodejs.org/api/http.html#http_class_http_incomingmessage
const knownProps = [
	'destroy',
	'setTimeout',
	'socket',
	'headers',
	'trailers',
	'rawHeaders',
	'statusCode',
	'httpVersion',
	'httpVersionMinor',
	'httpVersionMajor',
	'rawTrailers',
	'statusMessage'
];

var mimicResponse = (fromStream, toStream) => {
	const fromProps = new Set(Object.keys(fromStream).concat(knownProps));

	for (const prop of fromProps) {
		// Don't overwrite existing properties
		if (prop in toStream) {
			continue;
		}

		toStream[prop] = typeof fromStream[prop] === 'function' ? fromStream[prop].bind(fromStream) : fromStream[prop];
	}
};

const PassThrough$1 = stream.PassThrough;


const cloneResponse = response => {
	if (!(response && response.pipe)) {
		throw new TypeError('Parameter `response` must be a response stream.');
	}

	const clone = new PassThrough$1();
	mimicResponse(response, clone);

	return response.pipe(clone);
};

var src$1 = cloneResponse;

//TODO: handle reviver/dehydrate function like normal
//and handle indentation, like normal.
//if anyone needs this... please send pull request.

var stringify = function stringify (o) {
  if('undefined' == typeof o) return o

  if(o && Buffer.isBuffer(o))
    return JSON.stringify(':base64:' + o.toString('base64'))

  if(o && o.toJSON)
    o =  o.toJSON();

  if(o && 'object' === typeof o) {
    var s = '';
    var array = Array.isArray(o);
    s = array ? '[' : '{';
    var first = true;

    for(var k in o) {
      var ignore = 'function' == typeof o[k] || (!array && 'undefined' === typeof o[k]);
      if(Object.hasOwnProperty.call(o, k) && !ignore) {
        if(!first)
          s += ',';
        first = false;
        if (array) {
          if(o[k] == undefined)
            s += 'null';
          else
            s += stringify(o[k]);
        } else if (o[k] !== void(0)) {
          s += stringify(k) + ':' + stringify(o[k]);
        }
      }
    }

    s += array ? ']' : '}';

    return s
  } else if ('string' === typeof o) {
    return JSON.stringify(/^:/.test(o) ? ':' + o : o)
  } else if ('undefined' === typeof o) {
    return 'null';
  } else
    return JSON.stringify(o)
};

var parse = function (s) {
  return JSON.parse(s, function (key, value) {
    if('string' === typeof value) {
      if(/^:base64:/.test(value))
        return new Buffer(value.substring(8), 'base64')
      else
        return /^:/.test(value) ? value.substring(1) : value 
    }
    return value
  })
};

var jsonBuffer = {
	stringify: stringify,
	parse: parse
};

const loadStore = opts => {
	const adapters = {
		redis: '@keyv/redis',
		mongodb: '@keyv/mongo',
		mongo: '@keyv/mongo',
		sqlite: '@keyv/sqlite',
		postgresql: '@keyv/postgres',
		postgres: '@keyv/postgres',
		mysql: '@keyv/mysql'
	};
	if (opts.adapter || opts.uri) {
		const adapter = opts.adapter || /^[^:]*/.exec(opts.uri)[0];
		return new (commonjsRequire(adapters[adapter]))(opts);
	}
	return new Map();
};

class Keyv extends events {
	constructor(uri, opts) {
		super();
		this.opts = Object.assign(
			{
				namespace: 'keyv',
				serialize: jsonBuffer.stringify,
				deserialize: jsonBuffer.parse
			},
			(typeof uri === 'string') ? { uri } : uri,
			opts
		);

		if (!this.opts.store) {
			const adapterOpts = Object.assign({}, this.opts);
			this.opts.store = loadStore(adapterOpts);
		}

		if (typeof this.opts.store.on === 'function') {
			this.opts.store.on('error', err => this.emit('error', err));
		}

		this.opts.store.namespace = this.opts.namespace;
	}

	_getKeyPrefix(key) {
		return `${this.opts.namespace}:${key}`;
	}

	get(key) {
		key = this._getKeyPrefix(key);
		const store = this.opts.store;
		return Promise.resolve()
			.then(() => store.get(key))
			.then(data => {
				data = (typeof data === 'string') ? this.opts.deserialize(data) : data;
				if (data === undefined) {
					return undefined;
				}
				if (typeof data.expires === 'number' && Date.now() > data.expires) {
					this.delete(key);
					return undefined;
				}
				return data.value;
			});
	}

	set(key, value, ttl) {
		key = this._getKeyPrefix(key);
		if (typeof ttl === 'undefined') {
			ttl = this.opts.ttl;
		}
		if (ttl === 0) {
			ttl = undefined;
		}
		const store = this.opts.store;

		return Promise.resolve()
			.then(() => {
				const expires = (typeof ttl === 'number') ? (Date.now() + ttl) : null;
				value = { value, expires };
				return store.set(key, this.opts.serialize(value), ttl);
			})
			.then(() => true);
	}

	delete(key) {
		key = this._getKeyPrefix(key);
		const store = this.opts.store;
		return Promise.resolve()
			.then(() => store.delete(key));
	}

	clear() {
		const store = this.opts.store;
		return Promise.resolve()
			.then(() => store.clear());
	}
}

var src$2 = Keyv;

class CacheableRequest {
	constructor(request, cacheAdapter) {
		if (typeof request !== 'function') {
			throw new TypeError('Parameter `request` must be a function');
		}

		this.cache = new src$2({
			uri: typeof cacheAdapter === 'string' && cacheAdapter,
			store: typeof cacheAdapter !== 'string' && cacheAdapter,
			namespace: 'cacheable-request'
		});

		return this.createCacheableRequest(request);
	}

	createCacheableRequest(request) {
		return (opts, cb) => {
			let url$$1;
			if (typeof opts === 'string') {
				url$$1 = normalizeUrlObject(url.parse(opts));
				opts = {};
			} else if (opts instanceof url.URL) {
				url$$1 = normalizeUrlObject(url.parse(opts.toString()));
				opts = {};
			} else {
				const [pathname, ...searchParts] = (opts.path || '').split('?');
				const search = searchParts.length > 0 ?
					`?${searchParts.join('?')}` :
					'';
				url$$1 = normalizeUrlObject({ ...opts, pathname, search });
			}
			opts = {
				headers: {},
				method: 'GET',
				cache: true,
				strictTtl: false,
				automaticFailover: false,
				...opts,
				...urlObjectToRequestOptions(url$$1)
			};
			opts.headers = lowercaseKeys(opts.headers);

			const ee = new events();
			const normalizedUrlString = normalizeUrl(
				url.format(url$$1),
				{
					stripWWW: false,
					removeTrailingSlash: false
				}
			);
			const key = `${opts.method}:${normalizedUrlString}`;
			let revalidate = false;
			let madeRequest = false;

			const makeRequest = opts => {
				madeRequest = true;
				const handler = response => {
					if (revalidate && !opts.forceRefresh) {
						response.status = response.statusCode;
						const revalidatedPolicy = httpCacheSemantics.fromObject(revalidate.cachePolicy).revalidatedPolicy(opts, response);
						if (!revalidatedPolicy.modified) {
							const headers = revalidatedPolicy.policy.responseHeaders();
							response = new src(response.statusCode, headers, revalidate.body, revalidate.url);
							response.cachePolicy = revalidatedPolicy.policy;
							response.fromCache = true;
						}
					}

					if (!response.fromCache) {
						response.cachePolicy = new httpCacheSemantics(opts, response);
						response.fromCache = false;
					}

					let clonedResponse;
					if (opts.cache && response.cachePolicy.storable()) {
						clonedResponse = src$1(response);

						(async () => {
							try {
								const body = await getStream_1.buffer(response);

								const value = {
									cachePolicy: response.cachePolicy.toObject(),
									url: response.url,
									statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
									body
								};

								let ttl = opts.strictTtl ? response.cachePolicy.timeToLive() : undefined;
								if (opts.maxTtl) {
									ttl = ttl ? Math.min(ttl, opts.maxTtl) : opts.maxTtl;
								}

								await this.cache.set(key, value, ttl);
							} catch (err) {
								ee.emit('error', new CacheableRequest.CacheError(err));
							}
						})();
					} else if (opts.cache && revalidate) {
						(async () => {
							try {
								await this.cache.delete(key);
							} catch (err) {
								ee.emit('error', new CacheableRequest.CacheError(err));
							}
						})();
					}

					ee.emit('response', clonedResponse || response);
					if (typeof cb === 'function') {
						cb(clonedResponse || response);
					}
				};

				try {
					const req = request(opts, handler);
					ee.emit('request', req);
				} catch (err) {
					ee.emit('error', new CacheableRequest.RequestError(err));
				}
			};

			(async () => {
				const get = async opts => {
					await Promise.resolve();

					const cacheEntry = opts.cache ? await this.cache.get(key) : undefined;
					if (typeof cacheEntry === 'undefined') {
						return makeRequest(opts);
					}

					const policy = httpCacheSemantics.fromObject(cacheEntry.cachePolicy);
					if (policy.satisfiesWithoutRevalidation(opts) && !opts.forceRefresh) {
						const headers = policy.responseHeaders();
						const response = new src(cacheEntry.statusCode, headers, cacheEntry.body, cacheEntry.url);
						response.cachePolicy = policy;
						response.fromCache = true;

						ee.emit('response', response);
						if (typeof cb === 'function') {
							cb(response);
						}
					} else {
						revalidate = cacheEntry;
						opts.headers = policy.revalidationHeaders(opts);
						makeRequest(opts);
					}
				};

				this.cache.on('error', err => ee.emit('error', new CacheableRequest.CacheError(err)));

				try {
					await get(opts);
				} catch (err) {
					if (opts.automaticFailover && !madeRequest) {
						makeRequest(opts);
					}
					ee.emit('error', new CacheableRequest.CacheError(err));
				}
			})();

			return ee;
		};
	}
}

function urlObjectToRequestOptions(url$$1) {
	const options = { ...url$$1 };
	options.path = `${url$$1.pathname || '/'}${url$$1.search || ''}`;
	delete options.pathname;
	delete options.search;
	return options;
}

function normalizeUrlObject(url$$1) {
	// If url was parsed by url.parse or new URL:
	// - hostname will be set
	// - host will be hostname[:port]
	// - port will be set if it was explicit in the parsed string
	// Otherwise, url was from request options:
	// - hostname or host may be set
	// - host shall not have port encoded
	return {
		protocol: url$$1.protocol,
		auth: url$$1.auth,
		hostname: url$$1.hostname || url$$1.host || 'localhost',
		port: url$$1.port,
		pathname: url$$1.pathname,
		search: url$$1.search
	};
}

CacheableRequest.RequestError = class extends Error {
	constructor(err) {
		super(err.message);
		this.name = 'RequestError';
		Object.assign(this, err);
	}
};

CacheableRequest.CacheError = class extends Error {
	constructor(err) {
		super(err.message);
		this.name = 'CacheError';
		Object.assign(this, err);
	}
};

var src$3 = CacheableRequest;

const {Readable: Readable$1} = stream;

var toReadableStream = input => (
	new Readable$1({
		read() {
			this.push(input);
			this.push(null);
		}
	})
);

// Inspired by https://github.com/nodejs/node/blob/949e8851484c016c07f6cc9e5889f0f2e56baf2a/lib/_http_client.js#L706
var deferToConnect = (socket, method, ...args) => {
	let call;
	if (typeof method === 'function') {
		call = method;
	} else {
		call = () => socket[method](...args);
	}

	if (socket.writable && !socket.connecting) {
		call();
	} else {
		socket.once('connect', call);
	}
};

var source = request => {
	const timings = {
		start: Date.now(),
		socket: null,
		lookup: null,
		connect: null,
		upload: null,
		response: null,
		end: null,
		error: null,
		phases: {
			wait: null,
			dns: null,
			tcp: null,
			request: null,
			firstByte: null,
			download: null,
			total: null
		}
	};

	const handleError = origin => {
		const emit = origin.emit.bind(origin);
		origin.emit = (event, ...args) => {
			// Catches the `error` event
			if (event === 'error') {
				timings.error = Date.now();
				timings.phases.total = timings.error - timings.start;
			}

			// Saves the original behavior
			return emit(event, ...args);
		};
	};

	handleError(request);

	request.once('socket', socket => {
		timings.socket = Date.now();
		timings.phases.wait = timings.socket - timings.start;

		const lookupListener = () => {
			timings.lookup = Date.now();
			timings.phases.dns = timings.lookup - timings.socket;
		};

		socket.once('lookup', lookupListener);

		deferToConnect(socket, () => {
			timings.connect = Date.now();

			if (timings.lookup === null) {
				socket.removeListener('lookup', lookupListener);
				timings.lookup = timings.connect;
				timings.phases.dns = timings.lookup - timings.socket;
			}

			timings.phases.tcp = timings.connect - timings.lookup;
		});
	});

	request.once('finish', () => {
		timings.upload = Date.now();
		timings.phases.request = timings.upload - timings.connect;
	});

	request.once('response', response => {
		timings.response = Date.now();
		timings.phases.firstByte = timings.response - timings.upload;

		handleError(response);

		response.once('end', () => {
			timings.end = Date.now();
			timings.phases.download = timings.end - timings.response;
			timings.phases.total = timings.end - timings.start;
		});
	});

	return timings;
};

class TimeoutError$1 extends Error {
	constructor(threshold, event) {
		super(`Timeout awaiting '${event}' for ${threshold}ms`);
		this.name = 'TimeoutError';
		this.code = 'ETIMEDOUT';
		this.event = event;
	}
}

const reentry = Symbol('reentry');

function addTimeout(delay, callback, ...args) {
	// Event loop order is timers, poll, immediates.
	// The timed event may emit during the current tick poll phase, so
	// defer calling the handler until the poll phase completes.
	let immediate;
	const timeout = setTimeout(() => {
		immediate = setImmediate(callback, delay, ...args);
		/* istanbul ignore next: added in node v9.7.0 */
		if (immediate.unref) {
			immediate.unref();
		}
	}, delay);

	/* istanbul ignore next: in order to support electron renderer */
	if (timeout.unref) {
		timeout.unref();
	}

	const cancel = () => {
		clearTimeout(timeout);
		clearImmediate(immediate);
	};

	return cancel;
}

var timedOut = (request, delays, options) => {
	/* istanbul ignore next: this makes sure timed-out isn't called twice */
	if (request[reentry]) {
		return;
	}

	request[reentry] = true;
	const {host, hostname} = options;
	const timeoutHandler = (delay, event) => {
		request.emit('error', new TimeoutError$1(delay, event));
		request.once('error', () => {}); // Ignore the `socket hung up` error made by request.abort()

		request.abort();
	};

	const cancelers = [];
	const cancelTimeouts = () => {
		cancelers.forEach(cancelTimeout => cancelTimeout());
	};

	request.once('error', cancelTimeouts);
	request.once('response', response => {
		response.once('end', cancelTimeouts);
	});

	if (delays.request !== undefined) {
		const cancelTimeout = addTimeout(delays.request, timeoutHandler, 'request');
		cancelers.push(cancelTimeout);
	}

	if (delays.socket !== undefined) {
		request.setTimeout(delays.socket, () => {
			timeoutHandler(delays.socket, 'socket');
		});
	}

	if (delays.lookup !== undefined && !request.socketPath && !net.isIP(hostname || host)) {
		request.once('socket', socket => {
			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, 'lookup');
				cancelers.push(cancelTimeout);
				socket.once('lookup', cancelTimeout);
			}
		});
	}

	if (delays.connect !== undefined) {
		request.once('socket', socket => {
			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				const timeConnect = () => {
					const cancelTimeout = addTimeout(delays.connect, timeoutHandler, 'connect');
					cancelers.push(cancelTimeout);
					return cancelTimeout;
				};

				if (request.socketPath || net.isIP(hostname || host)) {
					socket.once('connect', timeConnect());
				} else {
					socket.once('lookup', () => {
						socket.once('connect', timeConnect());
					});
				}
			}
		});
	}

	if (delays.secureConnect !== undefined && options.protocol === 'https:') {
		request.once('socket', socket => {
			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				socket.once('connect', () => {
					const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, 'secureConnect');
					cancelers.push(cancelTimeout);
					socket.once('secureConnect', cancelTimeout);
				});
			}
		});
	}

	if (delays.send !== undefined) {
		request.once('socket', socket => {
			const timeRequest = () => {
				const cancelTimeout = addTimeout(delays.send, timeoutHandler, 'send');
				cancelers.push(cancelTimeout);
				return cancelTimeout;
			};
			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				socket.once('connect', () => {
					request.once('upload-complete', timeRequest());
				});
			} else {
				request.once('upload-complete', timeRequest());
			}
		});
	}

	if (delays.response !== undefined) {
		request.once('upload-complete', () => {
			const cancelTimeout = addTimeout(delays.response, timeoutHandler, 'response');
			cancelers.push(cancelTimeout);
			request.once('response', cancelTimeout);
		});
	}
};

var TimeoutError_1 = TimeoutError$1;
timedOut.TimeoutError = TimeoutError_1;

var isFormData = body => dist.nodeStream(body) && dist.function(body.getBoundary);

var getBodySize = async options => {
	const {body} = options;

	if (options.headers['content-length']) {
		return Number(options.headers['content-length']);
	}

	if (!body && !options.stream) {
		return 0;
	}

	if (dist.string(body)) {
		return Buffer.byteLength(body);
	}

	if (isFormData(body)) {
		return util.promisify(body.getLength.bind(body))();
	}

	if (body instanceof fs.ReadStream) {
		const {size} = await util.promisify(fs.stat)(body.path);
		return size;
	}

	return null;
};

const PassThrough$2 = stream.PassThrough;



var decompressResponse = response => {
	// TODO: Use Array#includes when targeting Node.js 6
	if (['gzip', 'deflate'].indexOf(response.headers['content-encoding']) === -1) {
		return response;
	}

	const unzip = zlib.createUnzip();
	const stream$$1 = new PassThrough$2();

	mimicResponse(response, stream$$1);

	unzip.on('error', err => {
		if (err.code === 'Z_BUF_ERROR') {
			stream$$1.end();
			return;
		}

		stream$$1.emit('error', err);
	});

	response.pipe(unzip).pipe(stream$$1);

	return stream$$1;
};

const {Transform} = stream;

var progress = {
	download(response, emitter, downloadBodySize) {
		let downloaded = 0;

		return new Transform({
			transform(chunk, encoding, callback) {
				downloaded += chunk.length;

				const percent = downloadBodySize ? downloaded / downloadBodySize : 0;

				// Let `flush()` be responsible for emitting the last event
				if (percent < 1) {
					emitter.emit('downloadProgress', {
						percent,
						transferred: downloaded,
						total: downloadBodySize
					});
				}

				callback(null, chunk);
			},

			flush(callback) {
				emitter.emit('downloadProgress', {
					percent: 1,
					transferred: downloaded,
					total: downloadBodySize
				});

				callback();
			}
		});
	},

	upload(request, emitter, uploadBodySize) {
		const uploadEventFrequency = 150;
		let uploaded = 0;
		let progressInterval;

		emitter.emit('uploadProgress', {
			percent: 0,
			transferred: 0,
			total: uploadBodySize
		});

		request.once('error', () => {
			clearInterval(progressInterval);
		});

		request.once('response', () => {
			clearInterval(progressInterval);

			emitter.emit('uploadProgress', {
				percent: 1,
				transferred: uploaded,
				total: uploadBodySize
			});
		});

		request.once('socket', socket => {
			const onSocketConnect = () => {
				progressInterval = setInterval(() => {
					const lastUploaded = uploaded;
					/* istanbul ignore next: see #490 (occurs randomly!) */
					const headersSize = request._header ? Buffer.byteLength(request._header) : 0;
					uploaded = socket.bytesWritten - headersSize;

					// Don't emit events with unchanged progress and
					// prevent last event from being emitted, because
					// it's emitted when `response` is emitted
					if (uploaded === lastUploaded || uploaded === uploadBodySize) {
						return;
					}

					emitter.emit('uploadProgress', {
						percent: uploadBodySize ? uploaded / uploadBodySize : 0,
						transferred: uploaded,
						total: uploadBodySize
					});
				}, uploadEventFrequency);
			};

			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				socket.once('connect', onSocketConnect);
			} else if (socket.writable) {
				// The socket is being reused from pool,
				// so the connect event will not be emitted
				onSocketConnect();
			}
		});
	}
};

var getResponse = (response, options, emitter) => {
	const downloadBodySize = Number(response.headers['content-length']) || null;

	const progressStream = progress.download(response, emitter, downloadBodySize);

	mimicResponse(response, progressStream);

	const newResponse = options.decompress === true &&
		dist.function(decompressResponse) &&
		options.method !== 'HEAD' ? decompressResponse(progressStream) : progressStream;

	if (!options.decompress && ['gzip', 'deflate'].includes(response.headers['content-encoding'])) {
		options.encoding = null;
	}

	emitter.emit('response', newResponse);

	emitter.emit('downloadProgress', {
		percent: 0,
		transferred: 0,
		total: downloadBodySize
	});

	response.pipe(progressStream);
};

var urlToOptions = url$$1 => {
	const options = {
		protocol: url$$1.protocol,
		hostname: url$$1.hostname.startsWith('[') ? url$$1.hostname.slice(1, -1) : url$$1.hostname,
		hash: url$$1.hash,
		search: url$$1.search,
		pathname: url$$1.pathname,
		href: url$$1.href
	};

	if (dist.string(url$$1.port) && url$$1.port.length > 0) {
		options.port = Number(url$$1.port);
	}

	if (url$$1.username || url$$1.password) {
		options.auth = `${url$$1.username}:${url$$1.password}`;
	}

	options.path = dist.null(url$$1.search) ? url$$1.pathname : `${url$$1.pathname}${url$$1.search}`;

	return options;
};

const {URL: URL$1} = url; // TODO: Use the `URL` global when targeting Node.js 10




const urlLib = url;








const {CacheError: CacheError$1, UnsupportedProtocolError: UnsupportedProtocolError$1, MaxRedirectsError: MaxRedirectsError$1, RequestError: RequestError$1, TimeoutError: TimeoutError$2} = errors;


const getMethodRedirectCodes = new Set([300, 301, 302, 303, 304, 305, 307, 308]);
const allMethodRedirectCodes = new Set([300, 303, 307, 308]);

var requestAsEventEmitter = (options, input) => {
	const emitter = new events();
	const redirects = [];
	let currentRequest;
	let requestUrl;
	let redirectString;
	let uploadBodySize;
	let retryCount = 0;
	let retryTries = 0;
	let shouldAbort = false;

	const setCookie = options.cookieJar ? util.promisify(options.cookieJar.setCookie.bind(options.cookieJar)) : null;
	const getCookieString = options.cookieJar ? util.promisify(options.cookieJar.getCookieString.bind(options.cookieJar)) : null;
	const agents = dist.object(options.agent) ? options.agent : null;

	const get = async options => {
		const currentUrl = redirectString || requestUrl;

		if (options.protocol !== 'http:' && options.protocol !== 'https:') {
			throw new UnsupportedProtocolError$1(options);
		}

		let fn;
		if (dist.function(options.request)) {
			fn = {request: options.request};
		} else {
			fn = options.protocol === 'https:' ? https : http;
		}

		if (agents) {
			const protocolName = options.protocol === 'https:' ? 'https' : 'http';
			options.agent = agents[protocolName] || options.agent;
		}

		/* istanbul ignore next: electron.net is broken */
		if (options.useElectronNet && process.versions.electron) {
			const r = ({x: commonjsRequire})['yx'.slice(1)]; // Trick webpack
			const electron = r('electron');
			fn = electron.net || electron.remote.net;
		}

		if (options.cookieJar) {
			const cookieString = await getCookieString(currentUrl, {});

			if (dist.nonEmptyString(cookieString)) {
				options.headers.cookie = cookieString;
			}
		}

		let timings;
		const handleResponse = async response => {
			try {
				/* istanbul ignore next: fixes https://github.com/electron/electron/blob/cbb460d47628a7a146adf4419ed48550a98b2923/lib/browser/api/net.js#L59-L65 */
				if (options.useElectronNet) {
					response = new Proxy(response, {
						get: (target, name) => {
							if (name === 'trailers' || name === 'rawTrailers') {
								return [];
							}

							const value = target[name];
							return dist.function(value) ? value.bind(target) : value;
						}
					});
				}

				const {statusCode} = response;
				response.url = currentUrl;
				response.requestUrl = requestUrl;
				response.retryCount = retryCount;
				response.timings = timings;
				response.redirectUrls = redirects;

				const rawCookies = response.headers['set-cookie'];
				if (options.cookieJar && rawCookies) {
					await Promise.all(rawCookies.map(rawCookie => setCookie(rawCookie, response.url)));
				}

				if (options.followRedirect && 'location' in response.headers) {
					if (allMethodRedirectCodes.has(statusCode) || (getMethodRedirectCodes.has(statusCode) && (options.method === 'GET' || options.method === 'HEAD'))) {
						response.resume(); // We're being redirected, we don't care about the response.

						if (statusCode === 303) {
							// Server responded with "see other", indicating that the resource exists at another location,
							// and the client should request it from that location via GET or HEAD.
							options.method = 'GET';
						}

						if (redirects.length >= 10) {
							throw new MaxRedirectsError$1(statusCode, redirects, options);
						}

						// Handles invalid URLs. See https://github.com/sindresorhus/got/issues/604
						const redirectBuffer = Buffer.from(response.headers.location, 'binary').toString();
						const redirectURL = new URL$1(redirectBuffer, currentUrl);
						redirectString = redirectURL.toString();

						redirects.push(redirectString);

						const redirectOpts = {
							...options,
							...urlToOptions(redirectURL)
						};

						for (const hook of options.hooks.beforeRedirect) {
							// eslint-disable-next-line no-await-in-loop
							await hook(redirectOpts);
						}

						emitter.emit('redirect', response, redirectOpts);

						await get(redirectOpts);
						return;
					}
				}

				getResponse(response, options, emitter);
			} catch (error) {
				emitter.emit('error', error);
			}
		};

		const handleRequest = request => {
			if (shouldAbort) {
				request.once('error', () => {});
				request.abort();
				return;
			}

			currentRequest = request;

			request.once('error', error => {
				if (request.aborted) {
					return;
				}

				if (error instanceof timedOut.TimeoutError) {
					error = new TimeoutError$2(error, options);
				} else {
					error = new RequestError$1(error, options);
				}

				if (emitter.retry(error) === false) {
					emitter.emit('error', error);
				}
			});

			timings = source(request);

			progress.upload(request, emitter, uploadBodySize);

			if (options.gotTimeout) {
				timedOut(request, options.gotTimeout, options);
			}

			emitter.emit('request', request);

			const uploadComplete = () => {
				request.emit('upload-complete');
			};

			try {
				if (dist.nodeStream(options.body)) {
					options.body.once('end', uploadComplete);
					options.body.pipe(request);
					options.body = undefined;
				} else if (options.body) {
					request.end(options.body, uploadComplete);
				} else if (input && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
					input.once('end', uploadComplete);
					input.pipe(request);
				} else {
					request.end(uploadComplete);
				}
			} catch (error) {
				emitter.emit('error', new RequestError$1(error, options));
			}
		};

		if (options.cache) {
			const cacheableRequest = new src$3(fn.request, options.cache);
			const cacheReq = cacheableRequest(options, handleResponse);

			cacheReq.once('error', error => {
				if (error instanceof src$3.RequestError) {
					emitter.emit('error', new RequestError$1(error, options));
				} else {
					emitter.emit('error', new CacheError$1(error, options));
				}
			});

			cacheReq.once('request', handleRequest);
		} else {
			// Catches errors thrown by calling fn.request(...)
			try {
				handleRequest(fn.request(options, handleResponse));
			} catch (error) {
				emitter.emit('error', new RequestError$1(error, options));
			}
		}
	};

	emitter.retry = error => {
		let backoff;

		try {
			backoff = options.retry.retries(++retryTries, error);
		} catch (error2) {
			emitter.emit('error', error2);
			return;
		}

		if (backoff) {
			const retry = async options => {
				try {
					for (const hook of options.hooks.beforeRetry) {
						// eslint-disable-next-line no-await-in-loop
						await hook(options, error, retryCount);
					}

					retryCount++;
					await get(options);
				} catch (error) {
					emitter.emit('error', error);
				}
			};

			setTimeout(retry, backoff, {...options, forceRefresh: true});
			return true;
		}

		return false;
	};

	emitter.abort = () => {
		if (currentRequest) {
			currentRequest.once('error', () => {});
			currentRequest.abort();
		} else {
			shouldAbort = true;
		}
	};

	setImmediate(async () => {
		try {
			// Convert buffer to stream to receive upload progress events (#322)
			const {body} = options;
			if (dist.buffer(body)) {
				options.body = toReadableStream(body);
				uploadBodySize = body.length;
			} else {
				uploadBodySize = await getBodySize(options);
			}

			if (dist.undefined(options.headers['content-length']) && dist.undefined(options.headers['transfer-encoding'])) {
				if ((uploadBodySize > 0 || options.method === 'PUT') && !dist.null(uploadBodySize)) {
					options.headers['content-length'] = uploadBodySize;
				}
			}

			for (const hook of options.hooks.beforeRequest) {
				// eslint-disable-next-line no-await-in-loop
				await hook(options);
			}

			requestUrl = options.href || (new URL$1(options.path, urlLib.format(options))).toString();

			await get(options);
		} catch (error) {
			emitter.emit('error', error);
		}
	});

	return emitter;
};

const {PassThrough: PassThrough$3} = stream;


const {HTTPError: HTTPError$1, ReadError: ReadError$1} = errors;

var asStream = options => {
	const input = new PassThrough$3();
	const output = new PassThrough$3();
	const proxy = duplexer3(input, output);
	const piped = new Set();
	let isFinished = false;

	options.retry.retries = () => 0;

	if (options.body) {
		proxy.write = () => {
			throw new Error('Got\'s stream is not writable when the `body` option is used');
		};
	}

	const emitter = requestAsEventEmitter(options, input);

	// Cancels the request
	proxy._destroy = emitter.abort;

	emitter.on('response', response => {
		const {statusCode} = response;

		response.on('error', error => {
			proxy.emit('error', new ReadError$1(error, options));
		});

		if (options.throwHttpErrors && statusCode !== 304 && (statusCode < 200 || statusCode > 299)) {
			proxy.emit('error', new HTTPError$1(response, options), null, response);
			return;
		}

		isFinished = true;

		response.pipe(output);

		for (const destination of piped) {
			if (destination.headersSent) {
				continue;
			}

			for (const [key, value] of Object.entries(response.headers)) {
				// Got gives *decompressed* data. Overriding `content-encoding` header would result in an error.
				// It's not possible to decompress already decompressed data, is it?
				const allowed = options.decompress ? key !== 'content-encoding' : true;
				if (allowed) {
					destination.setHeader(key, value);
				}
			}

			destination.statusCode = response.statusCode;
		}

		proxy.emit('response', response);
	});

	[
		'error',
		'request',
		'redirect',
		'uploadProgress',
		'downloadProgress'
	].forEach(event => emitter.on(event, (...args) => proxy.emit(event, ...args)));

	const pipe = proxy.pipe.bind(proxy);
	const unpipe = proxy.unpipe.bind(proxy);
	proxy.pipe = (destination, options) => {
		if (isFinished) {
			throw new Error('Failed to pipe. The response has been emitted already.');
		}

		const result = pipe(destination, options);

		if (Reflect.has(destination, 'setHeader')) {
			piped.add(destination);
		}

		return result;
	};
	proxy.unpipe = stream$$1 => {
		piped.delete(stream$$1);
		return unpipe(stream$$1);
	};

	return proxy;
};

var knownHookEvents = [
	'beforeRequest',
	'beforeRedirect',
	'beforeRetry',
	'afterResponse'
];

const {URL: URL$2} = url;



const merge = (target, ...sources) => {
	for (const source of sources) {
		for (const [key, sourceValue] of Object.entries(source)) {
			if (dist.undefined(sourceValue)) {
				continue;
			}

			const targetValue = target[key];
			if (dist.urlInstance(targetValue) && (dist.urlInstance(sourceValue) || dist.string(sourceValue))) {
				target[key] = new URL$2(sourceValue, targetValue);
			} else if (dist.plainObject(sourceValue)) {
				if (dist.plainObject(targetValue)) {
					target[key] = merge({}, targetValue, sourceValue);
				} else {
					target[key] = merge({}, sourceValue);
				}
			} else if (dist.array(sourceValue)) {
				target[key] = merge([], sourceValue);
			} else {
				target[key] = sourceValue;
			}
		}
	}

	return target;
};

const mergeOptions = (...sources) => {
	sources = sources.map(source => source || {});
	const merged = merge({}, ...sources);

	const hooks = {};
	for (const hook of knownHookEvents) {
		hooks[hook] = [];
	}

	for (const source of sources) {
		if (source.hooks) {
			for (const hook of knownHookEvents) {
				hooks[hook] = hooks[hook].concat(source.hooks[hook]);
			}
		}
	}

	merged.hooks = hooks;

	return merged;
};

const mergeInstances = (instances, methods) => {
	const handlers = instances.map(instance => instance.defaults.handler);
	const size = instances.length - 1;

	return {
		methods,
		options: mergeOptions(...instances.map(instance => instance.defaults.options)),
		handler: (options, next) => {
			let iteration = -1;
			const iterate = options => handlers[++iteration](options, iteration === size ? next : iterate);

			return iterate(options);
		}
	};
};

var merge_1 = merge;
var options = mergeOptions;
var instances = mergeInstances;
merge_1.options = options;
merge_1.instances = instances;

var prependHttp = (url$$1, opts) => {
	if (typeof url$$1 !== 'string') {
		throw new TypeError(`Expected \`url\` to be of type \`string\`, got \`${typeof url$$1}\``);
	}

	url$$1 = url$$1.trim();
	opts = Object.assign({https: false}, opts);

	if (/^\.*\/|^(?!localhost)\w+:/.test(url$$1)) {
		return url$$1;
	}

	return url$$1.replace(/^(?!(?:\w+:)?\/\/)/, opts.https ? 'https://' : 'http://');
};

var urlParseLax = (input, options) => {
	if (typeof input !== 'string') {
		throw new TypeError(`Expected \`url\` to be of type \`string\`, got \`${typeof input}\` instead.`);
	}

	const finalUrl = prependHttp(input, Object.assign({https: true}, options));
	return url.parse(finalUrl);
};

const WHITELIST = new Set([
	'ETIMEDOUT',
	'ECONNRESET',
	'EADDRINUSE',
	'ECONNREFUSED',
	'EPIPE',
	'ENOTFOUND',
	'ENETUNREACH',
	'EAI_AGAIN'
]);

var isRetryOnNetworkErrorAllowed = error => {
	if (error && WHITELIST.has(error.code)) {
		return true;
	}

	return false;
};

const {URL: URL$3, URLSearchParams} = url; // TODO: Use the `URL` global when targeting Node.js 10
const urlLib$1 = url;









const retryAfterStatusCodes = new Set([413, 429, 503]);

// `preNormalize` handles static things (lowercasing headers; normalizing baseUrl, timeout, retry)
// While `normalize` does `preNormalize` + handles things which need to be reworked when user changes them
const preNormalize = (options, defaults) => {
	if (dist.nullOrUndefined(options.headers)) {
		options.headers = {};
	} else {
		options.headers = lowercaseKeys(options.headers);
	}

	if (options.baseUrl && !options.baseUrl.toString().endsWith('/')) {
		options.baseUrl += '/';
	}

	if (options.stream) {
		options.json = false;
	}

	if (dist.nullOrUndefined(options.hooks)) {
		options.hooks = {};
	} else if (!dist.object(options.hooks)) {
		throw new TypeError(`Parameter \`hooks\` must be an object, not ${dist(options.hooks)}`);
	}

	for (const event of knownHookEvents) {
		if (dist.nullOrUndefined(options.hooks[event])) {
			if (defaults) {
				options.hooks[event] = [...defaults.hooks[event]];
			} else {
				options.hooks[event] = [];
			}
		}
	}

	if (dist.number(options.timeout)) {
		options.gotTimeout = {request: options.timeout};
	} else if (dist.object(options.timeout)) {
		options.gotTimeout = options.timeout;
	}
	delete options.timeout;

	const {retry} = options;
	options.retry = {
		retries: 0,
		methods: [],
		statusCodes: []
	};

	if (dist.nonEmptyObject(defaults) && retry !== false) {
		options.retry = {...defaults.retry};
	}

	if (retry !== false) {
		if (dist.number(retry)) {
			options.retry.retries = retry;
		} else {
			options.retry = {...options.retry, ...retry};
		}
	}

	if (options.gotTimeout) {
		options.retry.maxRetryAfter = Math.min(...[options.gotTimeout.request, options.gotTimeout.connection].filter(n => !dist.nullOrUndefined(n)));
	}

	if (dist.array(options.retry.methods)) {
		options.retry.methods = new Set(options.retry.methods.map(method => method.toUpperCase()));
	}

	if (dist.array(options.retry.statusCodes)) {
		options.retry.statusCodes = new Set(options.retry.statusCodes);
	}

	return options;
};

const normalize = (url$$1, options, defaults) => {
	if (dist.plainObject(url$$1)) {
		options = {...url$$1, ...options};
		url$$1 = options.url || {};
		delete options.url;
	}

	if (defaults) {
		options = merge_1({}, defaults.options, options ? preNormalize(options, defaults.options) : {});
	} else {
		options = merge_1({}, options ? preNormalize(options) : {});
	}

	if (!dist.string(url$$1) && !dist.object(url$$1)) {
		throw new TypeError(`Parameter \`url\` must be a string or object, not ${dist(url$$1)}`);
	}

	if (dist.string(url$$1)) {
		if (options.baseUrl) {
			if (url$$1.toString().startsWith('/')) {
				url$$1 = url$$1.toString().slice(1);
			}

			url$$1 = urlToOptions(new URL$3(url$$1, options.baseUrl));
		} else {
			url$$1 = url$$1.replace(/^unix:/, 'http://$&');

			url$$1 = urlParseLax(url$$1);
			if (url$$1.auth) {
				throw new Error('Basic authentication must be done with the `auth` option');
			}
		}
	} else if (dist(url$$1) === 'URL') {
		url$$1 = urlToOptions(url$$1);
	}

	// Override both null/undefined with default protocol
	options = merge_1({path: ''}, url$$1, {protocol: url$$1.protocol || 'https:'}, options);

	const {baseUrl} = options;
	Object.defineProperty(options, 'baseUrl', {
		set: () => {
			throw new Error('Failed to set baseUrl. Options are normalized already.');
		},
		get: () => baseUrl
	});

	const {query} = options;
	if (dist.nonEmptyString(query) || dist.nonEmptyObject(query) || query instanceof URLSearchParams) {
		if (!dist.string(query)) {
			options.query = (new URLSearchParams(query)).toString();
		}
		options.path = `${options.path.split('?')[0]}?${options.query}`;
		delete options.query;
	}

	if (options.hostname === 'unix') {
		const matches = /(.+?):(.+)/.exec(options.path);

		if (matches) {
			const [, socketPath, path] = matches;
			options = {
				...options,
				socketPath,
				path,
				host: null
			};
		}
	}

	const {headers} = options;
	for (const [key, value] of Object.entries(headers)) {
		if (dist.nullOrUndefined(value)) {
			delete headers[key];
		}
	}

	if (options.json && dist.undefined(headers.accept)) {
		headers.accept = 'application/json';
	}

	if (options.decompress && dist.undefined(headers['accept-encoding'])) {
		headers['accept-encoding'] = 'gzip, deflate';
	}

	const {body} = options;
	if (dist.nullOrUndefined(body)) {
		options.method = options.method ? options.method.toUpperCase() : 'GET';
	} else {
		const isObject = dist.object(body) && !dist.buffer(body) && !dist.nodeStream(body);
		if (!dist.nodeStream(body) && !dist.string(body) && !dist.buffer(body) && !(options.form || options.json)) {
			throw new TypeError('The `body` option must be a stream.Readable, string or Buffer');
		}

		if (options.json && !(isObject || dist.array(body))) {
			throw new TypeError('The `body` option must be an Object or Array when the `json` option is used');
		}

		if (options.form && !isObject) {
			throw new TypeError('The `body` option must be an Object when the `form` option is used');
		}

		if (isFormData(body)) {
			// Special case for https://github.com/form-data/form-data
			headers['content-type'] = headers['content-type'] || `multipart/form-data; boundary=${body.getBoundary()}`;
		} else if (options.form) {
			headers['content-type'] = headers['content-type'] || 'application/x-www-form-urlencoded';
			options.body = (new URLSearchParams(body)).toString();
		} else if (options.json) {
			headers['content-type'] = headers['content-type'] || 'application/json';
			options.body = JSON.stringify(body);
		}

		options.method = options.method ? options.method.toUpperCase() : 'POST';
	}

	if (!dist.function(options.retry.retries)) {
		const {retries} = options.retry;

		options.retry.retries = (iteration, error) => {
			if (iteration > retries) {
				return 0;
			}

			if (error !== null) {
				if (!isRetryOnNetworkErrorAllowed(error) && (!options.retry.methods.has(error.method) || !options.retry.statusCodes.has(error.statusCode))) {
					return 0;
				}

				if (Reflect.has(error, 'headers') && Reflect.has(error.headers, 'retry-after') && retryAfterStatusCodes.has(error.statusCode)) {
					let after = Number(error.headers['retry-after']);
					if (dist.nan(after)) {
						after = Date.parse(error.headers['retry-after']) - Date.now();
					} else {
						after *= 1000;
					}

					if (after > options.retry.maxRetryAfter) {
						return 0;
					}

					return after;
				}

				if (error.statusCode === 413) {
					return 0;
				}
			}

			const noise = Math.random() * 100;
			return ((1 << iteration) * 1000) + noise;
		};
	}

	return options;
};

const reNormalize = options => normalize(urlLib$1.format(options), options);

var normalizeArguments = normalize;
var preNormalize_1 = preNormalize;
var reNormalize_1 = reNormalize;
normalizeArguments.preNormalize = preNormalize_1;
normalizeArguments.reNormalize = reNormalize_1;

const {HTTPError: HTTPError$2, ParseError: ParseError$1, ReadError: ReadError$2} = errors;
const {options: mergeOptions$1} = merge_1;
const {reNormalize: reNormalize$1} = normalizeArguments;

const asPromise = options => {
	const proxy = new events();

	const promise = new pCancelable((resolve, reject, onCancel) => {
		const emitter = requestAsEventEmitter(options);

		onCancel(emitter.abort);

		emitter.on('response', async response => {
			proxy.emit('response', response);

			const stream$$1 = dist.null(options.encoding) ? getStream_1.buffer(response) : getStream_1(response, options);

			let data;
			try {
				data = await stream$$1;
			} catch (error) {
				reject(new ReadError$2(error, options));
				return;
			}

			const limitStatusCode = options.followRedirect ? 299 : 399;

			response.body = data;

			try {
				for (const [index, hook] of Object.entries(options.hooks.afterResponse)) {
					// eslint-disable-next-line no-await-in-loop
					response = await hook(response, updatedOptions => {
						updatedOptions = reNormalize$1(mergeOptions$1(options, {
							...updatedOptions,
							retry: 0,
							throwHttpErrors: false
						}));

						// Remove any further hooks for that request, because we we'll call them anyway.
						// The loop continues. We don't want duplicates (asPromise recursion).
						updatedOptions.hooks.afterResponse = options.hooks.afterResponse.slice(0, index);

						return asPromise(updatedOptions);
					});
				}
			} catch (error) {
				reject(error);
				return;
			}

			const {statusCode} = response;

			if (options.json && response.body) {
				try {
					response.body = JSON.parse(response.body);
				} catch (error) {
					if (statusCode >= 200 && statusCode < 300) {
						const parseError = new ParseError$1(error, statusCode, options, data);
						Object.defineProperty(parseError, 'response', {value: response});
						reject(parseError);
						return;
					}
				}
			}

			if (statusCode !== 304 && (statusCode < 200 || statusCode > limitStatusCode)) {
				const error = new HTTPError$2(response, options);
				Object.defineProperty(error, 'response', {value: response});
				if (emitter.retry(error) === false) {
					if (options.throwHttpErrors) {
						reject(error);
						return;
					}

					resolve(response);
				}
				return;
			}

			resolve(response);
		});

		emitter.once('error', reject);
		[
			'request',
			'redirect',
			'uploadProgress',
			'downloadProgress'
		].forEach(event => emitter.on(event, (...args) => proxy.emit(event, ...args)));
	});

	promise.on = (name, fn) => {
		proxy.on(name, fn);
		return promise;
	};

	return promise;
};

var asPromise_1 = asPromise;

var deepFreeze = function deepFreeze(object) {
	for (const [key, value] of Object.entries(object)) {
		if (dist.plainObject(value) || dist.array(value)) {
			deepFreeze(object[key]);
		}
	}

	return Object.freeze(object);
};

const getPromiseOrStream = options => options.stream ? asStream(options) : asPromise_1(options);

const aliases = [
	'get',
	'post',
	'put',
	'patch',
	'head',
	'delete'
];

const create = defaults => {
	defaults = merge_1({}, defaults);
	normalizeArguments.preNormalize(defaults.options);

	if (!defaults.handler) {
		// This can't be getPromiseOrStream, because when merging
		// the chain would stop at this point and no further handlers would be called.
		defaults.handler = (options, next) => next(options);
	}

	function got(url$$1, options) {
		try {
			return defaults.handler(normalizeArguments(url$$1, options, defaults), getPromiseOrStream);
		} catch (error) {
			if (options && options.stream) {
				throw error;
			} else {
				return Promise.reject(error);
			}
		}
	}

	got.create = create;
	got.extend = options => {
		let mutableDefaults;
		if (options && Reflect.has(options, 'mutableDefaults')) {
			mutableDefaults = options.mutableDefaults;
			delete options.mutableDefaults;
		} else {
			mutableDefaults = defaults.mutableDefaults;
		}

		return create({
			options: merge_1.options(defaults.options, options),
			handler: defaults.handler,
			mutableDefaults
		});
	};

	got.mergeInstances = (...args) => create(merge_1.instances(args));

	got.stream = (url$$1, options) => got(url$$1, {...options, stream: true});

	for (const method of aliases) {
		got[method] = (url$$1, options) => got(url$$1, {...options, method});
		got.stream[method] = (url$$1, options) => got.stream(url$$1, {...options, method});
	}

	Object.assign(got, {...errors, mergeOptions: merge_1.options});
	Object.defineProperty(got, 'defaults', {
		value: defaults.mutableDefaults ? defaults : deepFreeze(defaults),
		writable: defaults.mutableDefaults,
		configurable: defaults.mutableDefaults,
		enumerable: true
	});

	return got;
};

var create_1 = create;

var pkg = getCjsExportFromNamespace(_package$1);

const defaults = {
	options: {
		retry: {
			retries: 2,
			methods: [
				'GET',
				'PUT',
				'HEAD',
				'DELETE',
				'OPTIONS',
				'TRACE'
			],
			statusCodes: [
				408,
				413,
				429,
				500,
				502,
				503,
				504
			]
		},
		headers: {
			'user-agent': `${pkg.name}/${pkg.version} (https://github.com/sindresorhus/got)`
		},
		hooks: {
			beforeRequest: [],
			beforeRedirect: [],
			beforeRetry: [],
			afterResponse: []
		},
		decompress: true,
		throwHttpErrors: true,
		followRedirect: true,
		stream: false,
		form: false,
		json: false,
		cache: false,
		useElectronNet: false
	},
	mutableDefaults: false
};

const got = create_1(defaults);

var source$1 = got;

var pFinally = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};

class TimeoutError$3 extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

var pTimeout = (promise, ms, fallback) => new Promise((resolve, reject) => {
	if (typeof ms !== 'number' || ms < 0) {
		throw new TypeError('Expected `ms` to be a positive number');
	}

	const timer = setTimeout(() => {
		if (typeof fallback === 'function') {
			try {
				resolve(fallback());
			} catch (err) {
				reject(err);
			}
			return;
		}

		const message = typeof fallback === 'string' ? fallback : `Promise timed out after ${ms} milliseconds`;
		const err = fallback instanceof Error ? fallback : new TimeoutError$3(message);

		if (typeof promise.cancel === 'function') {
			promise.cancel();
		}

		reject(err);
	}, ms);

	pFinally(
		promise.then(resolve, reject),
		() => {
			clearTimeout(timer);
		}
	);
});

var TimeoutError_1$1 = TimeoutError$3;
pTimeout.TimeoutError = TimeoutError_1$1;

var pWaitFor = (condition, options) => {
	options = Object.assign({
		interval: 20,
		timeout: Infinity
	}, options);

	let retryTimeout;

	const promise = new Promise((resolve, reject) => {
		const check = () => {
			Promise.resolve()
				.then(condition)
				.then(value => {
					if (typeof value !== 'boolean') {
						throw new TypeError('Expected condition to return a boolean');
					}

					if (value === true) {
						resolve();
					} else {
						retryTimeout = setTimeout(check, options.interval);
					}
				})
				.catch(reject);
		};

		check();
	});

	if (options.timeout !== Infinity) {
		return pTimeout(promise, options.timeout)
			.catch(error => {
				if (retryTimeout) {
					clearTimeout(retryTimeout);
				}
				throw error;
			});
	}

	return promise;
};

/**
 * Parses a git URL, extracting the org and repo name.
 * 
 * Older versions of drone (< v4.0) do not export `DRONE_REPO` or `CI_REPO`.
 * They do export `DRONE_REMOTE` and / or `CI_REMOTE` with the git URL.
 * 
 * e.g., `DRONE_REMOTE=git://github.com/siddharthkp/ci-env.git`
 * 
 * @param {Object} env object in shape of `process.env`
 * @param {String} env.DRONE_REMOTE git URL of remote repository
 * @param {String} env.CI_REMOTE git URL of remote repository
 * @returns {String} org/repo (without .git extension)
 */
function getLegacyRepo(env) {
  // default to process.env if no argument provided
  if (!env) { env = process.env; }

  // bail if neither variable exists
  let remote = env.DRONE_REMOTE || env.CI_REMOTE;
  if (!remote) { return '' }

  // parse out the org and repo name from the git URL
  let parts = remote.split('/').slice(-2);
  let org = parts[0];
  let reponame = parts[1].replace(/\.git$/, '');
  let repo = '' + org + '/' + reponame;
  return repo
}

var getLegacyRepo_1 = getLegacyRepo;

var drone = {
	getLegacyRepo: getLegacyRepo_1
};

let repo, sha, event, commit_message, pull_request_number, branch, ci, jobUrl, buildUrl;

if (process.env.TRAVIS) {
  // Reference: https://docs.travis-ci.com/user/environment-variables

  repo = process.env.TRAVIS_REPO_SLUG;
  sha = process.env.TRAVIS_PULL_REQUEST_SHA || process.env.TRAVIS_COMMIT;
  event = process.env.TRAVIS_EVENT_TYPE;
  commit_message = process.env.TRAVIS_COMMIT_MESSAGE;
  pull_request_number = process.env.TRAVIS_PULL_REQUEST;
  jobUrl = `https://travis-ci.org/${repo}/jobs/${process.env.TRAVIS_JOB_ID}`;
  buildUrl = `https://travis-ci.org/${repo}/builds/${process.env.TRAVIS_JOB_ID}`;

  branch =
    process.env.TRAVIS_EVENT_TYPE === 'push'
      ? process.env.TRAVIS_BRANCH
      : process.env.TRAVIS_PULL_REQUEST_BRANCH;

  ci = 'travis';
} else if (process.env.CIRCLECI) {
  // Reference: https://circleci.com/docs/1.0/environment-variables

  repo = process.env.CIRCLE_PROJECT_USERNAME + '/' + process.env.CIRCLE_PROJECT_REPONAME;

  sha = process.env.CIRCLE_SHA1;
  event = 'push';
  commit_message = ''; // circle does not expose commit message
  if (process.env.CI_PULL_REQUEST) {
    pull_request_number = process.env.CI_PULL_REQUEST.split('/').pop(); // take number from returns url
    event = 'pull_request';
  } else pull_request_number = '';
  branch = process.env.CIRCLE_BRANCH;
  ci = 'circle';
} else if (process.env.WERCKER) {
  // Reference: https://devcenter.wercker.com/docs/environment-variables/available-env-vars

  repo = process.env.WERCKER_GIT_OWNER + '/' + process.env.WERCKER_GIT_REPOSITORY;

  sha = process.env.WERCKER_GIT_COMMIT;
  event = 'push';
  commit_message = ''; // wercker does not expose commit message
  pull_request_number = ''; // wercker does not expose pull request number
  branch = process.env.WERCKER_GIT_BRANCH;
  ci = 'wercker';
} else if (process.env.DRONE) {
  // Reference: http://readme.drone.io/usage/environment-reference

  repo = process.env.DRONE_REPO || process.env.CI_REPO || drone.getLegacyRepo(process.env);
  sha = process.env.DRONE_COMMIT || process.env.CI_COMMIT;
  // DRONE_BUILD_EVENT available in drone > v0.5
  // DRONE_EVENT, CI_EVENT available in drone < v0.5
  // no EVENT available in drone < v0.4
  event = process.env.DRONE_BUILD_EVENT || process.env.DRONE_EVENT || process.env.CI_EVENT || 'push';
  commit_message = ''; // drone does not expose commit message
  pull_request_number = process.env.DRONE_PULL_REQUEST;
  branch = process.env.DRONE_BRANCH || process.env.CI_BRANCH;
  ci = 'drone';
} else if (process.env.CI_NAME === 'codeship') {
  // Reference: https://documentation.codeship.com/basic/builds-and-configuration/set-environment-variables/#default-environment-variables

  repo = process.env.CI_REPO_NAME;
  branch = process.env.CI_BRANCH;
  commit_message = process.env.CI_COMMIT_MESSAGE || process.env.CI_MESSAGE;

  event = 'push';
  pull_request_number = process.env.CI_PR_NUMBER;
  sha=process.env.CI_COMMIT_ID, 
  buildUrl=process.env.CI_BUILD_URL;
  
  ci = 'codeship';
} else if (process.env.GITHUB_ACTION) {
  // GitHub Actions
  // Reference: https://developer.github.com/actions/creating-github-actions/accessing-the-runtime-environment/

  repo = process.env.GITHUB_REPOSITORY;

  sha = process.env.GITHUB_SHA;
  event = process.env.GITHUB_EVENT_NAME;
  commit_message = '';
  pull_request_number = '';
  branch = process.env.GITHUB_REF;
  ci = 'github_actions';
} else if (process.env.CI) {
  // Generic variables for docker images, custom CI builds, etc.

  repo = process.env.CI_REPO_OWNER + '/' + process.env.CI_REPO_NAME;

  sha = process.env.CI_COMMIT_SHA;
  event = process.env.CI_EVENT || 'push';
  commit_message = process.env.CI_COMMIT_MESSAGE;
  pull_request_number = process.env.CI_PULL_REQUEST_NUMBER;
  branch = process.env.CI_BRANCH;
  ci = 'custom';
}

var ciEnv = { repo, sha, event, commit_message, branch, pull_request_number, ci, jobUrl, buildUrl };
var ciEnv_1 = ciEnv.repo;
var ciEnv_2 = ciEnv.sha;

const octokit = new Octokit();

const [owner, repo$1] = ciEnv_1.split('/');

const getSuccessfulDeployment = async () => {
  octokit.authenticate({ token: process.env.GITHUB_API_TOKEN, type: 'oauth' });

  const { data } = await octokit.repos.getStatuses({ owner, ref: ciEnv_2, repo: repo$1 });
  const deployments = data.filter((item) =>
    /^(deployment\/)?now$/.test(item.context)
  );

  return deployments.find((item) => item.state === 'success')
};

const deployed = async () => (await getSuccessfulDeployment()) !== undefined

  // Run the checker
;(async () => {
  await pWaitFor(deployed, { interval: 15000 });

  const { target_url: url$$1 } = await getSuccessfulDeployment();
  const deploymentId = url$$1.split('=').pop();
  const {
    body: { host },
  } = await source$1(`https://api.zeit.co/v2/now/deployments/${deploymentId}`, {
    headers: {
      authorization: `Bearer ${process.env.ZEIT_API_TOKEN}`,
    },
    json: true,
  });

  console.log(`https://${host}`);
})();
