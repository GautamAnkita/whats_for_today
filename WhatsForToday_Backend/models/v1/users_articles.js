const knex    = require("../../db/client");

const addArticle = (userId, artId) => {
    return knex
        .insert({
            user_id: userId,
            article_id: artId,
            view_count: 1,
            is_topic_of_the_day_for_user: true,
            published_at: new Date(),
            updated_at: new Date()
        })
        .into("users_articles")
        .returning("*")
        .then(([data]) => {
            return data;
        }).catch((err) => console.error(err));
}

const getPublishedArticlesIdsForUser = (userId) => {
    return knex
          .select("*")
          .from("users_articles")
          .where('user_id', userId)
          .pluck('article_id')
          .then((data) => {
              return data;
          }).catch((err) => console.error(err)); 
}

const getActiveArticleOfTheDayForUser = (userId) => {
    return knex
          .select("*")
          .from("users_articles")
          .where({
              user_id: userId,
              is_topic_of_the_day_for_user: true
            })
          .pluck('article_id')
          .then((data) => {
              if(data && data.length === 1) {
                return data[0];
              } else {
                  return null;
              }
          }).catch((err) => console.error(err)); 
}

const getAllPublishedArticlesForUser = (userId) => {
    return knex
          .select("*")
          .from("users_articles")
          .where('user_id', userId)
          .then((data) => {
              return data;
          }).catch((err) => console.error(err)); 
}

const getPublishedArticleForUser = (userId, artId) => {
    return knex
            .select("*")
            .from("users_articles")
            .where(
                {   user_id: userId,
                    article_id: artId
                }
            ).then((data) => {
                return data[0];
            }).catch((err) => console.error(err)); 
}

module.exports = {
    addArticle, getPublishedArticlesIdsForUser, getAllPublishedArticlesForUser,
    getPublishedArticleForUser, getActiveArticleOfTheDayForUser
}