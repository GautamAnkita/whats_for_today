const express = require('express');
const router = express.Router();
const Category = require('../../models/v1/categories');
const Article = require('../../models/v1/articles');

/* GET categories listing. */
router.get('/', function(req, res, next) {
  Category.all()
    .then(function(categories){
      if(categories) {
        res.status(200).json(categories);
      } else {
        res.status(200).json({});
      }
    });
});

/* GET articles in the given category */
router.get('/:id/articles', function(req, res, next) {
  const cat_id = req.params.id;
  if(req.user && req.user.is_admin) {
    Article.findBy('category_id', cat_id)
    .then(function(articles){
      if(articles) {
        res.status(200).json(articles);
      } else {
        res.status(200).json({});
      }
    });
  } else {
    res.status(401).json({});
  }
});

/* GET categories listing. */
router.get('/:id', function(req, res, next) {
  const cat_id = req.params.id;
  if(req.user && req.user.is_admin) {
    Category.findBy('id', cat_id)
    .then(function(categories){
      if(categories.length >= 1) {
        category = categories[0];
        res.status(200).json(category);
      } else {
        res.status(200).json({'msg': 'This Category does not exist!'});
      }
    });
  } else {
    res.status(401).json({});
  }
  
});

module.exports = router;
