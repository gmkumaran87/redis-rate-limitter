const express = require('express');
const RedisHandler = require('./common/RedisHandler');
const githubRouter = require('./router/search');
const cors = require('cors');
const app = express();

// app.use(cors());

//Middlewares
app.use((req, res, next) => {
	const { method, path } = req;

	console.log(`Method: ${method} Path: ${path} at ${new Date().toISOString()}`);

	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Or, enable CORS for specific origins
app.use(
	cors({
		origin: 'http://localhost:5173', // Replace with your frontend URL
	})
);
app.get('/', (req, res) => {
	res.redirect('/api/v1/github');
});
app.use('/api/v1/github', githubRouter);
const port = 8000;

app.listen(port, async () => {
	await RedisHandler.init();
	console.log('App listening on', port);
});
