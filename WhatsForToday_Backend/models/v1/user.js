const knex    = require("../../db/client");
const bcrypt  = require('bcrypt')          // bcrypt will encrypt passwords to be saved in db
const crypto  = require('crypto')          // built-in encryption node module
const UserCategory = require('./users_categories');


const signup = (request, response) => {
    const user = request.body;
    const inUser = user;

    return hashPassword(user.password)
      .then((hashedPassword) => {
        delete user.password
        user.password_digest = hashedPassword
      })
      .then(() => createUser(user))
      .then(user => {
          if(!user) {
              return null;
          } else {
            delete user.password_digest
            return user;
          }
      }).then((user) => {
        if(user) {
          if(inUser.categories && inUser.categories.length >=1){
            console.log("Inserting user preferred categories!");
            const categories = inUser.categories;
            return Promise.all(categories.map(categoryId => {
                      console.log("Cat:"+categoryId);
                      return UserCategory.insertInfo(user.id, categoryId)
                      .then(() => {
                          return;
                      });
                  })).then(() => {
                      console.log("Returning the user:"+JSON.stringify(user));
                      return user;
                  });
          } else {
            console.log("Finally returning the user:"+JSON.stringify(user));
            return user;
          }
        } else {
          console.log("Could not create user!");
          return user;
        }
      }).catch((err) => console.error(err))
  }

  
  
  const hashPassword = (password) => {
    return new Promise((resolve, reject) =>
      bcrypt.hash(password, 10, (err, hash) => {
        err ? reject(err) : resolve(hash)
      })
    )
  }

  const createUser = (user) => {
    return knex
        .insert({
            first_name: user.first_name,
            last_name: user.last_name,
            date_of_birth: new Date(user.date_of_birth),
            email: user.email,
            password_digest: user.password_digest,
            address_line1: user.address_line1,
            address_line2: user.address_line2,
            city: user.city,
            state:  user.state,
            country: user.country
        })
        .into("users")
        .returning(["id", "first_name"])
        .then(([data]) => {
            return data;
        });
  }
  

const findBy = (column, val) => {
    return knex
    .select("*")
    .from("users")
    .where(column, val)
    .then(function(users){
        user = users[0];
        console.log(user);
        return user;
    });
}
  
const checkPassword = (reqPassword, foundUser) => {
    return new Promise((resolve, reject) =>
      bcrypt.compare(reqPassword, foundUser.password_digest, (err, response) => {
          if (err) {
            reject(err)
          }
          else if (response) {
            resolve(response)
          } else {
            reject(new Error('Passwords do not match.'));
          }
      })
    )
  }
  
  const updateUserLastLogin = (user) => {
    return knex("users")
        .update({
            last_login: new Date()
        })
        .where('id', user.id);
  }

  const all = () => {
    return knex
    .select("*")
    .from("users")
    .then(function(users){
        return users;
    });
  }
  
  module.exports = {
    signup, updateUserLastLogin, findBy, checkPassword, all
  }
