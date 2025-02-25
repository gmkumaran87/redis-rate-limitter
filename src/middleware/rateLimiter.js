const RedisHandler = require('../common/RedisHandler');

function rateLimiter(secondsWindow, allowedAPIs, apiMessage) {
	return async function (req, res, next) {
		const redisClinet = RedisHandler.getRedisClient();

		// Get the IP address of the client using the request object
		let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		console.log('Ip address', { head: req.headers, conn: req.connection, ipAddress });

		// Clean the IP
		if (ipAddress.substr(0, 7) === '::ffff:') {
			ipAddress = ipAddress.substr(7);
		}

		const requestCount = await redisClinet.incr(ipAddress + apiMessage);
		let ttl = secondsWindow;
		// if this is the first req
		if (requestCount === 1) {
			await redisClinet.expire(ipAddress + apiMessage, secondsWindow);
		} else {
			ttl = await redisClinet.ttl(ipAddress + apiMessage);
		}
		if (requestCount > allowedAPIs) {
			return res.status(503).json({
				status: 'Failure',
				apiMessage: apiMessage,
				callsMadeInAWindow: requestCount,
				timeLeft: ttl,
			});
		} else {
			req.timeLeft = ttl;
			req.numRequest = requestCount;
			next();
		}
		// next();
	};
}

module.exports = rateLimiter;
