const express = require('express');
const router = express.Router();


router.use('/users', require('./users'));
router.use('/categories', require('./categories'));
router.use('/articles', require('./articles'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
