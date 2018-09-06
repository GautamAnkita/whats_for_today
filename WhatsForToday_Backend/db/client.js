const environment     = process.env.NODE_ENV || 'development';    // set environment
const configuration   = require('../knexfile')[environment];   // pull in correct db with env configs
const knex        = require('knex')(configuration);  
module.exports = knex;
