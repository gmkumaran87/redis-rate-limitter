const axios = require('axios');
const Constant = require('../common/Constants');
const { processHrToSeconds } = require('../common/utils');
const RedisHandler = require('../common/RedisHandler');

const SearchUsers = async (req, res) => {
	try {
		console.log('Search USER');
		const searchQuery = req.query.query;

		if (!searchQuery || searchQuery.trim() === '') {
			res.status(400).json({ msg: 'Please provide query params' });
		}

		const redisClient = RedisHandler.getRedisClient();
		const time = process.hrtime();

		const redisData = await redisClient.get(searchQuery + '_users');

		if (redisData) {
			res.status(200).json({
				msg: 'Success',
				data: { total_count: redisData, source: 'REDIS', seconds: processHrToSeconds(process.hrtime(time)) },
			});
		} else {
			const response = await axios.get(Constant.GITHUB_USERS_URL + searchQuery);

			console.log('After fetching data', { total: response.data.total_count, query: searchQuery + '_issues' });
			await redisClient.set(searchQuery + '_issues', response.data.total_count, { EX: 30 });
			// Returning the response
			res.status(200).json({
				msg: 'Success',
				data: {
					total_count: response.data.total_count,
					seconds: processHrToSeconds(process.hrtime(time)),
					source: 'GitHub API',
				},
			});
		}
	} catch (error) {}
};

module.exports = { SearchUsers };
