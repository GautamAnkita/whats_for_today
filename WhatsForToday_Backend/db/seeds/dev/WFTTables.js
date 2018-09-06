const cowsay = require('cowsay');
const usersData = require('../../../data/users');
const categoriesData = require('../../../data/categories');
const articlesData = require('../../../data/articles');
const commentsData = require('../../../data/comments');
const tagsData = require('../../../data/tags');

exports.seed = function(knex, Promise) {

  return knex('users_categories').del()
    .then(function () {
      return knex('users_articles').del()
    }).then(function () {
      return knex('articles_tags').del()
    }).then(function () {
      return knex('tags').del()
    }).then(function () {
      return knex('comments').del()
    }).then(function () {
      return knex('articles').del()
    }).then(function () {
      return knex('users').del()
    }).then(function () {
      return knex('categories').del()
    }).then(function () {
      return knex('users').insert(usersData);
    }).then(function (user) {
      return knex('categories').insert(categoriesData);
    }).then(function () {
      return knex.table('users').pluck('id').then(function(userIds) { 
        return knex.table('categories').pluck('id').then(function(catIds) {
          const userCategories = createUsersCategories(knex, userIds,  catIds);
          return Promise.all(userCategories);
        });
      });
    }).then(function () {
      return knex.table('users').pluck('id').then(function(userIds) { 
        return knex.table('categories').pluck('id').then(function(catIds) {
          const articles = createArticles(knex, userIds,  catIds);
          return Promise.all(articles);
        });
      });
    }).then(function () {
      return knex.table('users').pluck('id').then(function(userIds) { 
        return knex.table('articles').pluck('id').then(function(artIds) {
          const comments = createComments(knex, userIds, artIds);
          return Promise.all(comments);
        });
      });
    }).then(function () {
      return knex('tags').insert(tagsData);
    }).then(function () {
      return knex.table('articles').pluck('id').then(function(artIds) { 
        return knex.table('tags').pluck('id').then(function(tagIds) {
          const artTags = createArticlesTags(knex, artIds, tagIds);
          return Promise.all(artTags);
        });
      });
    }).then(() => {
      console.log(cowsay.say({
        text : "Seeding is done!",
        e : "oO",
        T : "U "
      }));
    });
};

function createUsersCategories(knex, userIds,  catIds){
  let userCategories = [];
  let pref = 1;
  userIds.forEach(userId => { 
    const catId = catIds[Math.floor(Math.random()*catIds.length)];
    userCategories.push(
      knex('users_categories').insert(
        { 
          user_id: userId,
          category_id: catId,
          preference: pref
        }
    ));
    pref = pref + 1 ;
  });
  return userCategories;
}

function createArticles(knex, userIds, catIds){
  let articles = [];
  articlesData.forEach(article => {
    const userId = userIds[Math.floor(Math.random()*userIds.length)];
    const catId = catIds[Math.floor(Math.random()*catIds.length)];
    article.author_id = userId;
    article.category_id = catId;
    articles.push(knex('articles').insert(article));
  });
  return articles;
}

function createComments(knex, userIds,  artIds){
  let comments = [];
  commentsData.forEach(comment => {
    const artId = artIds[Math.floor(Math.random()*artIds.length)];
    let userId = userIds[Math.floor(Math.random()*userIds.length)];
    comment.user_id = userId;
    comment.article_id = artId;
    comments.push(knex('comments').insert(comment));
  });
  return comments;
}

function createArticlesTags(knex, artIds,  tagIds){
  let artTags = [];
  artIds.forEach(artId => { 
    const tagId = tagIds[Math.floor(Math.random()*tagIds.length)];
    artTags.push(
      knex('articles_tags').insert(
        { 
          article_id: artId,
          tag_id: tagId
        }
    ));
  });
  return artTags;
}