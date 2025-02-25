const axios = require('axios');
const Constant = require('../common/Constants');
const { processHrToSeconds } = require('../common/utils');
const RedisHandler = require('../common/RedisHandler');

const SearchRepos = async (req, res, next) => {
	console.log('Repoooos');
	// let data;
	try {
		const searchQuery = req.query.query;

		console.log('Data', searchQuery);

		if (!searchQuery || !searchQuery.trim()) {
			res.status(400).json({ msg: 'please send the query parameter' });
		}

		const redisClient = RedisHandler.getRedisClient();

		const time = process.hrtime();
		// console.log('After IF', searchQuery, redisClient, time);

		const data = await redisClient.get(searchQuery + '_repos');
		console.log('Before IFF', { data, searchQuery, time });
		if (data) {
			res.status(200).json({
				msg: 'Success',
				data: { total_count: data, seconds: processHrToSeconds(process.hrtime(time)), source: 'REDIS' },
			});
		} else {
			console.log('ELSE Statement');
			const response = await axios.get(Constant.GITHUB_SEARCH_URL + searchQuery);

			console.log('After receiving data', response?.data);
			await redisClient.set(searchQuery + '_repos', response.data.total_count, { EX: 30 });

			res.status(200).json({
				msg: 'Received data',
				data: {
					total_count: response?.data?.total_count,
					seconds: processHrToSeconds(process.hrtime(time)),
					source: 'GITHUB',
				},
			});
		}
	} catch (error) {
		console.log('Error received', error);
	}
};

module.exports = { SearchRepos };
