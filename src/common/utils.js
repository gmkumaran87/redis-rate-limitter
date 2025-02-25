const processHrToSeconds = (hrTime) => {
	return (hrTime[0] + hrTime[1] / 10e9).toFixed(9);
};

module.exports = { processHrToSeconds };
