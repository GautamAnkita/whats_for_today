const knex    = require("../../db/client");

const findBy = (column, val) => {
  return knex
        .select("*")
        .from("images")
        .where(column, val)
        .then((data) => {
            return data;
        }).catch((err) => console.error(err)); 
}

const populateImageInDB = (articleId, image) => {
    return knex
        .insert({
            article_id: articleId,
            title: image.title,
            url: image.url,
            height: image.height,
            width: image.width,
            updated_at: new Date(),
            created_at: new Date()
          })
          .into("images")
          .returning("*")
          .then(([data]) => {
              return data;
          }).catch((err) => console.error(err));
}

const insertImageUrl = (articleId, imageUrl) => {
    if(imageUrl) {
        return knex
        .insert({
            article_id: articleId,
            title: "Test",
            url: imageUrl,
            height: 300,
            width: 500,
            updated_at: new Date(),
            created_at: new Date()
          })
          .into("images")
          .returning("*")
          .then(([data]) => {
              return data;
          }).catch((err) => console.error(err));
    } else {
        return {};
    }
}

const deleteAllImages = (artId) => {
    return knex('images')
    .where('article_id', artId)
    .del()
    .then((data) => {
        return data;
    }).catch((err) => console.error(err));  
}

module.exports = {
 findBy, populateImageInDB, deleteAllImages, insertImageUrl
}