const knex    = require("../../db/client");
const User    = require("./user");

const all = () => {
    return knex
    .select("*")
    .from("comments")
    .then(function(comments){
        return comments;
    });
}

const postComment = (userId, artId, request, response) => {
    const comment = request.body;
    return knex
          .insert({
            body: comment.body,
            user_id: userId,
            article_id: artId
          })
          .into("comments")
          .returning("*")
          .then(([data]) => {
              return data;
          }).catch((err) => console.error(err)); 
}

const findByArticle = (articleId) => {
    return knex
          .select("*")
          .from("comments")
          .where('article_id', articleId)
          .then((data) => {
              if(data && data.length >=1){
                  console.log("Came here to fill user name in the comment!");
                  return Promise.all(data.map(comment => {
                            const user_id = comment.user_id;
                            return User.findBy("id", user_id)
                            .then((user) => {
                                comment.user_first_name = user.first_name;
                                return comment;
                            });
                        })).then((result) => {
                            return result;
                        });
              } else {
                return data;
              }
             
          }).catch((err) => console.error(err)); 
}

const deleteAllComments = (artId) => {
    return knex('comments')
    .where('article_id', artId)
    .del()
    .then((data) => {
        return data;
    }).catch((err) => console.error(err));  
}

module.exports = {
    all, postComment, findByArticle, deleteAllComments
}