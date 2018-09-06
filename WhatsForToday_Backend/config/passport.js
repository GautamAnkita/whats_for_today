 
const User    = require("../models/v1/user");
const bcrypt  = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const setup = (passport) => {
    passport.use(new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password'
        },
        function (username, password, done) {
            console.log("Login process:"+username);
            User.findBy('email', username).then((user) => {
                if(user) {
                    User.checkPassword(password, user)
                    .then((res, err)=>{
                        if (!res) {
                            return done(null, false, { message: 'Incorrect password.' });
                        } else {
                            console.log("Login process completed successfully!");
                            return done(null, user);
                        }
                    }).catch(function(rej) {
                        return done(null, false, { message: 'Incorrect password.' });
                    });;
                } else {
                    return done(null, false, { message: 'Incorrect username.' });
                }
            });          
        }
    ));
        
    passport.serializeUser(
        function(user, done) {
            console.log("serialize "+ user);
            done(null, user.id);
        }
    );
    
    passport.deserializeUser(
        function(id, done){
            User.findBy('id', id)
            .then(function(user){
                console.log("deserialized user:"+user.first_name);
                done(null, user);
            });
        }
    );
}


module.exports = {
    setup
}