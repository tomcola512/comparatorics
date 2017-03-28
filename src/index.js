const chain = comparators => (a, b) => {
	for (comparator of comparators) {
		const retVal = comparator(a, b);
		if (retVal != 0) {
			return retVal;
		}
	}
	return 0;
};

const pathed = (comparator, path) => (a, b) =>
	comparator(delve(a, path), delve(b, path));

const delve = (obj, ...keyOids) => {
	let key;
	while (typeof obj !== 'undefined' && typeof (key = keyOids.shift()) !== 'undefined') {
		if (Array.isArray(obj)) {
			obj = obj.map(o => delve(o, key)).filter(r => typeof r !== 'undefined');
			if (!obj.length) {
				obj = obj[0];
			}
		} else {
			if (typeof key === 'function') {
				obj = Object.keys(obj).map(k => obj[k]).find(key);
			} else if (obj.hasOwnProperty(key)) {
				obj = obj[key];
			} else {
				obj = undefined;
			}
		}
	}
	return obj;
};

const reverse = (comparator, asc) =>
	(a, b) =>
		asc ? -comparator(a, b) : comparator(a, b);

const exports = {
	chain,
    pathed,
	reverse,
    utils: {
        delve
    }
};

export default exports;