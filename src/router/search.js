const express = require('express');
const { SearchRepos } = require('../controller/SearchRepos');
const { SearchIssues } = require('../controller/SearchIssues');
const { SearchUsers } = require('../controller/SearchUsers');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

console.log('Search router');
router.get('/search-repos', rateLimiter, SearchRepos);
router.get('/search-issues', rateLimiter, SearchIssues);
router.get('/search-users', rateLimiter(4, 1, 'search-users'), SearchUsers);

module.exports = router;
