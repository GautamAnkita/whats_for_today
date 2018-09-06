const knex    = require("../../db/client");

const insertInfo = (userId, catId) => {
    return knex
        .insert({
            user_id: userId,
            category_id: catId,
            preference: 1,
            created_at: new Date(),
            updated_at: new Date()
        })
        .into("users_categories")
        .returning("*")
        .then(([data]) => {
            return data;
        }).catch((err) => console.error(err));
}

const getPreferredCatIdsForUser = (userId) => {
    return knex
          .select("*")
          .from("users_categories")
          .where('user_id', userId)
          .pluck('category_id')
          .then((data) => {
              return data;
          }).catch((err) => console.error(err)); 
}

module.exports = {
    insertInfo, getPreferredCatIdsForUser
}