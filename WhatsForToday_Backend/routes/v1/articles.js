const express = require('express');
const router = express.Router();
const Article = require('../../models/v1/articles');
const Comment = require('../../models/v1/comments');
const API = require('../../api/api_calls');


/* Delete the given article. */
router.delete('/:id', function(req, res, next) {
  const article_id = req.params.id;
  console.log("Deleting the given article!"+article_id);
  Article.deleteArticle(article_id)
    .then(() => {
      res.status(200).json({});
    }).catch((err) => {
      console.error(err);
    });
});

/* Approve the given article. */
router.put('/approve/:id', function(req, res, next) {
  const article_id = req.params.id;
  if(req.user && req.user.is_admin) {
    console.log("Approving the given article!"+article_id);
    Article.approve(article_id)
    .then(function(){
      res.status(200).json();
    });
} else {
    res.status(401).json({});
}
});

/* GET articles listing. */
router.get('/adminall', function(req, res, next) {
    if(req.user && req.user.is_admin) {
        Article.all()
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

/* GET published articles listing. */
router.get('/', function(req, res, next) {
  Article.findBy('is_published_in_public', true)
    .then(function(articles){
      if(articles) {
        res.status(200).json(articles);
      } else {
        res.status(200).json({});
      }
  });
});

/* GET ARTICLE OF THE DAY FOR THE PUBLIC */
router.get('/fortoday', function(req, res, next) {
  Article.findBy("is_topic_of_the_day_in_public", true)
  .then((articles) => {
    if(articles && articles && articles.length == 1) {
      article = articles[0];
      console.log("Got already published article of the day:"+article.title);
      Article.findBy("id", article.id)
      .then((articles) => {
        console.log("sending article:"+articles[0].title);
        res.status(200).json(articles[0]);
      });       
    } else {
      console.log("Fetching a new article of the day!");
      Article.getNotPublishedButApprovedArticles()
      .then(function(articles){
        if(articles && articles.length >= 1) {
          article = articles[0];
          console.log("got article:"+article.title);
          Article.updatePublicationStatus(article.id)
          .then(() => {
            console.log("filling article:"+article.title);
            Article.findBy("id", article.id)
            .then((articles) => {
              console.log("sending article:"+articles[0].title);
              console.log("sending article images:"+JSON.stringify(articles[0].images));
              res.status(200).json(articles[0]);
            });
          });
        } else {
          res.status(200).json();
        }
      });
    } 
  });    
});


/* GET not published articles listing. */
router.get('/notpublished', function(req, res, next) {
  if(req.user && req.user.is_admin) {
    Article.getNotPublishedButApprovedArticles()
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

/* GET not published articles listing. */
router.get('/pending', function(req, res, next) {
  if(req.user && req.user.is_admin) {
    Article.getNotApprovedArticles()
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

/* GET top 5 articles by view_count. */
router.get('/orderbyview', function(req, res, next) {
  console.log("Came here to get the top articles");
  Article.findMostViewed(5)
    .then(function(articles){
      if(articles) {
        res.status(200).json(articles);
      } else {
        res.status(200).json({});
      }
    });
});

/* GET top 5 articles by like_count. */
router.get('/orderbylike', function(req, res, next) {
  console.log("Came here to get the top articles");
  Article.findMostLiked(5)
    .then(function(articles){
      if(articles) {
        res.status(200).json(articles);
      } else {
        res.status(200).json({});
      }
    });
});

/* Polulate applicable articles in the table. */
router.get('/populate', function(req, res, next) {
  if(req.user && req.user.is_admin) {
    console.log("Going to populate the list of articles!");
    Article.getNotPolulatedArticles()
    .then(function(articles){
      return Promise.all(articles.map(article => {
        return API.callAPIs(article)
        .then((article) => {
          console.log("Came here to populate article in DB:"+article.title);
          return Article.populateInDB(article)
          .then(() => {
            return article;
          })
        });
      })).then(articles => {
        console.log("Resolved all articles!");
        return articles;
      });
    }).then((articles) => {
      console.log("Returning articles!");
      res.status(200).json(articles);
    });
  } else {
    console.log("Returning empty result!");
    res.status(401).json();
  }       
});

/* Polulate applicable articles in the table. */
router.post('/fillArticleInfo', function(req, res, next) {
  if(req.user && req.user.is_admin) {
    const search_keyword = req.body.search_keyword;
    console.log("Going to fill the given article with search keyword:"+search_keyword);
    let article = {};
    article.search_keyword = search_keyword;
    article.title = search_keyword;
    article.created_at = new Date();
    article.updated_at = new Date();
    article.view_count = 0;
    API.callAPIs(article)
    .then((article) => {
      console.log("returning article!"+JSON.stringify(article));
      res.status(200).json(article);
    });
  } else {
    console.log("Returning empty result!");
    res.status(401).json();
  }       
});

/* GET top 5 articles by bookmark_count. */
router.get('/orderbybookmark', function(req, res, next) {
  console.log("Came here to get the top articles");
  Article.findMostBookmarked(5)
    .then(function(articles){
      if(articles) {
        res.status(200).json(articles);
      } else {
        res.status(200).json({});
      }
    });
});

/* GET list of comments for an Article (ADMIN only) */
router.get('/:id/comments', function(req, res, next) {
  const article_id = req.params.id;
  if(req.user && req.user.is_admin) {
    Comment.findByArticle(article_id)
    .then(function(comments){
      if(comments) {
        res.status(200).json(comments);
      } else {
        res.status(200).json({});
      }
    });
  } else {
    res.status(401).json({});
  }
});

/* GET a specific article. */
router.get('/:id', function(req, res, next) {
  const article_id = req.params.id;
  Article.findBy('id', article_id)
    .then(function(articles){
      if(articles) {
        console.log("Found Article!");
        article = articles[0];
        console.log("Found Article!"+article.title);
        if(article.is_published_in_public || (req.user && (req.user.is_admin || req.user.id === article.author_id))) {
          if(!req.user || (req.user && !req.user.is_admin && req.user.id != article.author_id)) {
            article.view_count  = article.view_count + 1;
            Article.updateViewInfo(article.id, article.view_count)
            .then(() => {
              res.status(200).json(article);
            });
          } else {
            res.status(200).json(article);
          }
        } else {
          res.status(401).json();
        }
      } else {
        res.status(200).json();
      }
  });
});

module.exports = router;
