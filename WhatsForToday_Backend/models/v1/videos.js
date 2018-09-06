const knex    = require("../../db/client");

const findBy = (column, val) => {
  return knex
        .select("*")
        .from("videos")
        .where(column, val)
        .then((data) => {
            return data;
        }).catch((err) => console.error(err)); 
}

const populateVideoInDB = (articleId, video) => {
    return knex
        .insert({
            article_id: articleId,
            title: video.title,
            video_id: video.video_id,
            updated_at: new Date(),
            created_at: new Date()
          })
          .into("videos")
          .returning("*")
          .then(([data]) => {
              return data;
          }).catch((err) => console.error(err));
}

const insertVideoID = (articleId, videoId) => {
    if(videoId) {
        return knex
        .insert({
            article_id: articleId,
            title: "Test",
            video_id: videoId,
            updated_at: new Date(),
            created_at: new Date()
          })
          .into("videos")
          .returning("*")
          .then(([data]) => {
              return data;
          }).catch((err) => console.error(err));
    } else {
        return new Promise();
    }
}

const deleteAllVideos = (artId) => {
    return knex('videos')
    .where('article_id', artId)
    .del()
    .then((data) => {
        return data;
    }).catch((err) => console.error(err));  
}

module.exports = {
 findBy, populateVideoInDB, deleteAllVideos, insertVideoID
}