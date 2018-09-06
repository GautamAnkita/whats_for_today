const knex    = require("../../db/client");
const Comment    = require("./comments");
const Image    = require("./images");
const Video    = require("./videos");

const all = () => {
    return knex
    .select("*")
    .from("articles")
    .then(function(articles){
        return articles;
    });
}

const postArticle = (request, response) => {
    const article = request.body;
    const is_populated = !request.user.is_admin;
    // if(request.user.is_admin) {
    //     is_populated = article.is_populated;
    // }
    return knex
          .insert({
            title: article.title,
            search_keyword: article.title,
            body: article.body,
            author_id: request.user.id,
            category_id: article.category_id,
            is_approved: false,
            is_populated: is_populated
          })
          .into("articles")
          .returning("*")
          .then(([data]) => {
            return data;
                // Video.insertVideoID(data.id, article.video0)
                // .then(() => {
                //     Video.insertVideoID(data.id, article.video1)
                // }).then(()=>{
                //     Image.insertImageUrl(article.id, article.image)
                //     .then((image) => {
                //         return data;
                //     });
                // }).then(() => {
                //     return data;
                // });
          }).catch((err) => console.error(err)); 
}

const findBy = (column, val) => {
    return knex
          .select("*")
          .from("articles")
          .where(column, val)
          .then((data) => {
              if(data && data.length ==1 && column === 'id') {
                  let article = data[0];
                  console.log("Filling Comments!");
                  return Comment.findByArticle(article.id)
                  .then((comments) => {
                    article.comments = comments;
                    console.log("Filling Images!");
                    return Image.findBy('article_id', article.id)
                    .then((images) => {
                        article.images = images;
                        console.log("Filling Videos!");
                        return Video.findBy('article_id', article.id)
                        .then((videos) => {
                            article.videos = videos;
                            console.log("Returning the complete article!");
                            data[0] = article;
                            return data;
                        });
                    });
                  });
              } else {
                return data;
              }
          }).catch((err) => console.error(err)); 
}

const getNotPublishedButApprovedArticles = () => {
    return knex
        .select("*")
        .from("articles")
        .where(
            {
              is_published_in_public: false,
              is_approved: true
            }
        ).then((data) => {
              return data;
        }).catch((err) => console.error(err)); 
}

const getNotApprovedArticles = () => {
    return knex
        .select("*")
        .from("articles")
        .where(
            {
              is_approved: false
            }
        ).then((data) => {
              return data;
        }).catch((err) => console.error(err)); 
}

const getNotPolulatedArticles = () => {
    return knex
        .select("*")
        .from("articles")
        .where(
            {
                is_populated: false
            }
        ).then((data) => {
              return data;
        }).catch((err) => console.error(err)); 
}

const updateViewInfo = (id, newCount) => {
    console.log("Came here with new view count:"+newCount);
    return knex("articles")
        .update({
            view_count: newCount,
            last_viewed_at: new Date(),
            updated_at: new Date()
        }).where('id', id)
        .then((data) => {
            return data;
        }).catch((err) => console.error(err));
}

const updatePublicationStatus = (id) => {
    return knex("articles")
        .update({
            view_count: 1,
            last_viewed_at: new Date(),
            is_published_in_public: true,
            published_in_public_at: new Date(),
            is_topic_of_the_day_in_public: true,
            updated_at: new Date()
        }).where('id', id)
        .then((data) => {
            return data;
        }).catch((err) => console.error(err));
}

const findMostViewed = (limit_count) => {
    console.log("Came here to find top:"+limit_count+" articles by view_count");
    return knex
          .select("*")
          .from("articles")
          .where('is_published_in_public', true)
          .orderBy('view_count', 'desc')
          .limit(limit_count)
          .then((data) => {
              return data;
          }).catch((err) => console.error(err)); 
}

const findMostLiked = (limit_count) => {
    console.log("Came here to find top:"+limit_count+" articles by like_count");
    return knex
          .select("*")
          .from("articles")
          .where('is_published_in_public', true)
          .orderBy('like_count', 'desc')
          .limit(limit_count)
          .then((data) => {
              return data;
          }).catch((err) => console.error(err)); 
}

const findMostBookmarked = (limit_count) => {
    console.log("Came here to find top:"+limit_count+" articles by bookmark_count");
    return knex
          .select("*")
          .from("articles")
          .where('is_published_in_public', true)
          .orderBy('bookmark_count', 'desc')
          .limit(limit_count)
          .then((data) => {
              return data;
          }).catch((err) => console.error(err)); 
}

const populateInDB = (article) => {
    return knex("articles")
        .update({
            body: article.body,
            is_populated: true,
            updated_at: new Date()
        }).where('id', article.id)
        .then((data) => {
            console.log("Came Here to pupulate images and videos!");
            console.log("Came here to populate images for this article!"+article.title);
                let images = article.images;
                return Promise.all(images.map(image => {
                          return Image.populateImageInDB(article.id, image)
                          .then((image) => {
                              return image;
                          });
                      })).then((result) => {
                          return result;
                      });
        }).then((data) => {
            console.log("Came here to populate videoes for this article!"+article.title);
                let videos = article.videos;
                return Promise.all(videos.map(video => {
                          return Video.populateVideoInDB(article.id, video)
                          .then((video) => {
                              return video;
                          });
                      })).then((result) => {
                          return result;
                      });
        }).catch((err) => console.error(err));
}

const deleteArticle = (id) => {
    return Comment.deleteAllComments(id)
    .then((data) => {
        return Image.deleteAllImages(id)
        .then((data) => {
            return Video.deleteAllVideos(id)
            .then((data) => {
                return knex('articles')
                .where('id', id)
                .del()
                .then((data) => {
                    return data;
                }).catch((err) => console.error(err));
            }).catch((err) => console.error(err));;
        }).catch((err) => console.error(err));;
    }).catch((err) => console.error(err));;
}

const approve = (id) => {
    return knex("articles")
        .update({
            is_approved: true,
            updated_at: new Date()
        }).where('id', id)
        .then((data) => {
            return data;
        }).catch((err) => console.error(err));
}

module.exports = {
    all, postArticle, findBy, updateViewInfo, findMostViewed, 
    getNotPublishedButApprovedArticles, getNotApprovedArticles, 
    updatePublicationStatus, findMostLiked, findMostBookmarked,
    getNotPolulatedArticles, populateInDB, deleteArticle, approve
}