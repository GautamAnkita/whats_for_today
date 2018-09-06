const knex    = require("../../db/client");

const all = () => {
    return knex
    .select("*")
    .from("categories")
    .then(function(categories){
        return categories;
    });
}

const findBy = (column, val) => {
  return knex
        .select("*")
        .from("categories")
        .where(column, val)
        .then((data) => {
            return data;
        }).catch((err) => console.error(err)); 
}

module.exports = {
  all, findBy
}