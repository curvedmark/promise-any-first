var Promise = require('promise-now');

module.exports = anyFirst;

function anyFirst(promises) {
	var p = new Promise();
	var length = promises.length;
	var rejects = [];
	var minFulfilled = length;
	var minValue, firstReason;

	promises.forEach(function (promise, i) {
		promise.then(function (value) {
			if (i > minFulfilled) return;

			minFulfilled = i;
			minValue = value;

			if (allPrecedingRejected(i, rejects)) p.fulfill(value, this);
		}, function (reason) {
			if (i > minFulfilled) return;

			if (i === 0) firstReason = reason;
			rejects[i] = true;
			if (allPrecedingRejected(minFulfilled, rejects)) {
				if (minFulfilled === length) p.reject(firstReason, this);
				else p.fulfill(minValue, this);
			}
		});
	});

	return p;
}

function allPrecedingRejected(index, rejects) {
	if (index > rejects.length) return false;

	for (var i = 0; i < index; ++i) {
		if (!rejects[i]) return false;
	}
	return true;
}