var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../../models/v1/user');
const Article = require('../../models/v1/articles');
const UserArticle = require('../../models/v1/users_articles');
const Comment = require('../../models/v1/comments');
const UserCategory = require('../../models/v1/users_categories');


/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.user && req.user.is_admin) {
    User.all()
    .then(function(users){
      if(users) {
        res.status(200).json(users);
      } else {
        res.status(200).json();
      }
    });
  } else {
    res.status(401).json();
  }
});

/* Sign-up/Create a new user. */
router.post('/', function(req, res, next) {
  console.log("Came here to create a user!");
  User.signup(req, res)
  .then((user) => {
    if(user) {
      req.login(user, function(err) {
        if (err) { return next(err); }
      });
      res.status(201).json({ user });
    } else {
      res.status(409).json({ "msg": "User Already Exists!"});
    }
  });
});

/* Sign-in an existing user. */
router.post('/signin', passport.authenticate('local'), function(req, res, next) {
  if(req.user) {
    console.log("Successfully Logged In!");
    User.updateUserLastLogin(req.user);
    res.status(200).json(req.user);
  } else {
    res.status(401).json();
  }
});

/* Sign-out a logged in user. */
router.get('/signout', function(req, res, next) {
  console.log("Signing-out the current user!");
  res.cookie('connect.sid', '');
  req.logOut();
  res.clearCookie('connect.sid');
  res.status(200).json({});
});

/* Get the current logged in user */
router.get('/current', function(req, res, next) {
  console.log("came here to get the current user");
  if(req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(200).json({});
  }
});

/* Get the specific user */
router.get('/:id', function(req, res, next) {
  const user_id = req.params.id;
  if(req.user && ((parseInt(user_id) === req.user.id) || req.user.is_admin)) {
    User.findBy('id', user_id)
    .then(function(user){
      if(user) {
        res.status(200).json(user);
      } else {
        res.status(200).json();
      }
    }); 
  } else {
    res.status(401).json({});
  }
});

/* Submit a article */
router.post('/:id/articles', function(req, res, next) {
  const user_id = parseInt(req.params.id);
  console.log("Given user id:"+ typeof user_id);
  console.log("Logged in user id:"+ typeof req.user.id);
  if(req.user && (user_id === req.user.id)) {
    console.log("Came Here");
    Article.postArticle(req, res)
      .then((article) => {
        if(article) {
          res.status(200).json({ article });
        } else {
          res.status(409).json({ "msg": "Article with this title already exists!"});
        }
      });
  } else {
    res.status(401).json({});
  }
});

/* Post a comment */
router.post('/:userId/articles/:articleId/', function(req, res, next) {
  const user_id = parseInt(req.params.userId);
  const article_id = parseInt(req.params.articleId);
  console.log("Given user id:"+ typeof user_id);
  console.log("Given article id:"+ typeof article_id);
  console.log("Logged in user id:"+ typeof req.user.id);
  if(req.user && (user_id === req.user.id)) {
    console.log("Came Here");
    Comment.postComment(user_id, article_id, req, res)
      .then((comment) => {
        if(comment) {
          res.status(200).json({ comment });
        } else {
          res.status(409).json({ "msg": "Could not post comment!"});
        }
      });
  } else {
    res.status(401).json({});
  }
});

/* GET THE ARTICLE FOR THE DAY FOR THE USER */
router.get('/:id/articles/fortoday', function(req, res, next) {
  const user_id = parseInt(req.params.id);
  if(req.user && (user_id === req.user.id) && !req.user.is_admin) {
    UserArticle.getActiveArticleOfTheDayForUser(user_id)
    .then((userArticlesId) => {
        if(userArticlesId) {
          console.log("Got active article of the day for the user..returning it!");
          Article.findBy("id", userArticlesId)
              .then((articles) => {
              res.status(200).json(articles[0]);
              });
        } else {
          console.log("Fetching a new  article of the day for the user!");
          getArticleOfTheDay(user_id)
          .then((article) => {
            if(article) {
              UserArticle.addArticle(user_id, article.id)
              .then(() => {
                Article.findBy("id", article.id)
                .then((articles) => {
                res.status(200).json(articles[0]);
                });
              });
            } else {
              res.status(200).json();
            }
          });
        }
    });
  } else {
    res.status(401).json({});
  }
});

/* Get the list of articles authored by the user */
router.get('/:id/articles/authored', function(req, res, next) {
  const user_id = req.params.id;
  if(req.user && ((parseInt(user_id) === req.user.id) || req.user.is_admin)) {
    Article.findBy('author_id', user_id)
    .then(function(articles){
      if(articles) {
        res.status(200).json(articles);
      } else {
        res.status(200).json();
      }
    }); 
  } else {
    res.status(401).json();
  }
});

/* Get the specific article already published for the user */
router.get('/:userId/articles/:articleId', function(req, res, next) {
  const user_id = req.params.userId;
  const art_id = req.params.articleId;
  console.log("Getting article:"+art_id+" for user:"+user_id);
  if(req.user && parseInt(user_id) === req.user.id) {
    getUserPublishedArticle(user_id, art_id)
    .then((article)=> {
      if(article) {
        res.status(200).json(article);
      } else {
        res.status(200).json();
      }
    });
  } else {
    res.status(401).json();
  }
});

/* Get the list of articles already published for the user */
router.get('/:id/articles', function(req, res, next) {
  const user_id = req.params.id;
  if(req.user && ((parseInt(user_id) === req.user.id) || req.user.is_admin)) {
    getUserPublishedArticles(user_id)
    .then((articles)=> {
      res.status(200).json(articles);
    });
  } else {
    res.status(401).json();
  }
});

function getArticleOfTheDay(user_id) {
//async function getArticleOfTheDay(user_id) {
  let finalArticle = null;
  return UserCategory.getPreferredCatIdsForUser(user_id)
  .then((catIds) =>{
  // const catIds = await UserCategory.getPreferredCatIdsForUser(user_id)
      console.log("Received preferred categories:"+catIds);
      return Article.getNotPublishedButApprovedArticles()
      .then((articles) => {
        return UserArticle.getPublishedArticlesIdsForUser(user_id)
        .then((userArticlesIds) => {
          if(userArticlesIds && userArticlesIds.length >=1) {
            console.log("User archive is present:");
            if(catIds && catIds.length >= 1) {
              finalArticle = articles.find(function(article) {
                return !userArticlesIds.includes(article.id) && catIds.includes(article.category_id) && article.author_id != user_id;
              });
            } else {
              finalArticle = articles.find(function(article) {
                return !userArticlesIds.includes(article.id) && article.author_id != user_id;
              });
            }
            return finalArticle;
          } else {
            console.log("User archive is absent:");
            if(catIds && catIds.length >= 1) {
              finalArticle = articles.find(function(article) {
                return article.author_id != user_id && catIds.includes(article.category_id);
              });
            } else {
              finalArticle = articles.find(function(article) {
                return article.author_id != user_id;
              });
            }
            if(finalArticle) {
              console.log("Found final article!"+finalArticle.title+" with cat:"+finalArticle.category_id);
            }
            return finalArticle;
          }
        });
      }).then((result) => {
        console.log("1Returning final article here!");
        return result;
      });
  });
}

function getUserPublishedArticle(user_id, art_id) {
  return UserArticle.getPublishedArticleForUser(user_id, art_id)
  .then((userArticle) => {
    if(userArticle) {
      return Article.findBy('id', userArticle.article_id)
        .then((articles) => {
          article = articles[0];
          article.is_liked = userArticle.is_liked;
          article.is_bookmarked = userArticle.is_bookmarked;
          article.is_commented_on = userArticle.is_commented_on;
          article.user_view_count = userArticle.view_count;
          article.user_published_at = userArticle.published_at;
          article.user_updated_at = userArticle.updated_at;
          return article;
        }).catch(err => console.error(err));
    } else {
      return null;
    }
  });
}

function getUserPublishedArticles(user_id) {
  return UserArticle.getAllPublishedArticlesForUser(user_id)
  .then((userArticles) => {
    if(userArticles && userArticles.length >=1) {
      let finalArticleList = [];
      return Promise.all(userArticles.map(userArticle => {
        return Article.findBy('id', userArticle.article_id)
          .then((articles) => {
            article = articles[0];
            article.is_liked = userArticle.is_liked;
            article.is_bookmarked = userArticle.is_bookmarked;
            article.is_commented_on = userArticle.is_commented_on;
            article.user_view_count = userArticle.view_count;
            article.user_published_at = userArticle.published_at;
            article.user_updated_at = userArticle.updated_at;
            finalArticleList.push(article);
            return article;
          });
      })).then(answerList => {
        return answerList;
      }).catch(err => console.error(err));
    } else {
      return [];
    }
  });
}

module.exports = router;
