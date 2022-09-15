// Setup global variable store
// eslint-disable-next-line no-var, @typescript-eslint/no-unused-vars
declare var variables: Record<string, unknown>;
self.variables = {};

// copy global functions in this scope
const cnsl = console.log;
const pm = self.postMessage;

// stringify helper for self-ref objects
const jsonStringify = (obj: unknown) => {
	const cache: unknown[] = [];
	return JSON.stringify(
		obj,
		(key, value) => {
			if (typeof value === 'object' && value !== null) {
				// Duplicate reference found, discard key
				if (cache.includes(value)) return 'CURCULAR @' + key;
				// Store value in our collection
				cache.push(value);
			}
			return value;
		},
		'\t',
	);
};

// redirect console.log to postMessage
console.log = (...args) => {
	args.forEach(arg => {
		const data = ['object', 'function'].includes(typeof arg) ? jsonStringify(arg) : arg;
		pm({ type: 'log', data });
	});
};

// make postMessage use the same interface as console.log
self.postMessage = args => {
	console.log(args); // redirect to console.log
};

// add exception handler to postMessage
self.addEventListener('unhandledrejection', function (event) {
	throw event.reason;
});

// accept variables from main thread
onmessage = async e => {
	pm({ type: 'init', data: null });
	self.variables = e.data.variables;
	await import(e.data.scriptUrl);
	pm({ type: 'done', data: null });
};
