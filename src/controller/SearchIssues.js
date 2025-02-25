const { processHrToSeconds } = require('../common/utils');
const RedisHandler = require('../common/RedisHandler');
const axios = require('axios');
const Constant = require('../common/Constants');

const SearchIssues = async (req, res) => {
	try {
		const searchQuery = req.query.query;

		if (!searchQuery || !searchQuery.trim()) {
			res.status(400).json({ msg: 'Kindly send the query params' });
		}

		const redisClient = RedisHandler.getRedisClient();
		const time = process.hrtime();

		const redisData = await redisClient.get(searchQuery + '_issues');
		// const data = await redisClient.get(searchQuery + '_repos');

		console.log('REDIS data', redisData);
		if (redisData) {
			res.status(200).json({
				msg: 'Success',
				data: { total_count: redisData, source: 'REDIS', seconds: processHrToSeconds(process.hrtime(time)) },
			});
		} else {
			const response = await axios.get(Constant.GITHUB_ISSUES_URL + searchQuery);

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
	} catch (error) {
		console.log(error);
		res.json({ error: JSON.stringify(error) }).status(400);
	}
};

module.exports = { SearchIssues };
