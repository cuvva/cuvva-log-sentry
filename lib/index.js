module.exports = function (client) {
	return function (level, err) {
		if (level === 'info' || level === 'debug')
			return;

		if (level === 'warn')
			level = 'warning';

		const formattedError = toJsonSerializable(err);

		client.captureError(err, {
			level: level,
			extra: formattedError,
		});
	};
};

function toJsonSerializable(err) {
	const output = {};

	if (err.reasons)
		output.reasons = err.reasons.map(function (e) { return toJsonSerializable(e); });

	return extractGetters(err, output, 'reasons');
}

function extractGetters(err, cur, excluding) {
	const output = cur || {};
	const props = Object.getOwnPropertyNames(err);

	for (var a in props) {
		if (excluding && excluding.includes(props[a]))
			continue;

		output[props[a]] = err[props[a]];
	}

	return output;
}
