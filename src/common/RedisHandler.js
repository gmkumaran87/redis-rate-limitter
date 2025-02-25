/*const redis = require('redis');

class RedisHandler {
	#redisClient;

	constructor() {
		if (RedisHandler.singleInstance) {
			return RedisHandler.singleInstance;
		} else {
			RedisHandler.singleInstance = this;
		}
	}

	init = async () => {
		if (this.#redisClient) return;

		this.#redisClient = redis.createClient();
		this.#redisClient.connect();
	};
	getRedisClient() {
		if (this.#redisClient) return this.#redisClient;

		// If no redis client then create, connect and return

		this.#redisClient = redis.createClient();
		this.#redisClient.connect();
		return this.#redisClient;
	}
}

const redisHandlerInstance = new RedisHandler();

module.exports = redisHandlerInstance;*/

// Importing the required package
const redis = require('redis');

// Class to handle the Redis client instance
class RedisHandler {
	// Private member that holds the Redis client instance
	#redisClient;

	// Constructor function to create only a single instance of the class
	constructor() {
		// Check if the instance is not null, then return the same instance
		if (RedisHandler.singleInstance) return RedisHandler.singleInstance;
		// Else return the current newly created instance denoted by this keyword
		else RedisHandler.singleInstance = this;
	}

	// Initialization function to create the Redis client and connect to Redis
	init = async () => {
		// Return if the Redis client instance already created
		if (this.#redisClient) return;

		// Create the Redis client and connect to Redis
		this.#redisClient = redis.createClient();
		this.#redisClient.connect();

		this.#redisClient.on('error', (err) => {
			console.log('Error in connecting REDIS' + err);
		});

		// Add an event listener on the Redis client once it is ready to accept the request,
		// log the message and disconnect with Redis client to stop execution of the code
		this.#redisClient.on('ready', async () => {
			console.log('Redis Connected...!');
			// await this.#redisClient.quit();
		}); //.then(() => console.log('Redis Connected'));
	};

	// Getter function to get the Redis client instance
	getRedisClient() {
		// Return the Redis client instance if not null
		if (this.#redisClient) return this.#redisClient;

		// If no Redis client exists, then create the Redis client,
		// connect to the Redis and then return it
		this.#redisClient = redis.createClient({
			host: 'my.redis.server.com',
			port: 6379,
			password: 'myredispassword',
		});
		this.#redisClient.connect();
		return this.#redisClient;
	}
}

// Creating an object/instance of the RedisHandler class
const redisHandlerInstance = new RedisHandler();

// Exporting the instance of this singleton class
module.exports = redisHandlerInstance;
