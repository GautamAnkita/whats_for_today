var querystring = require('querystring');
var config = require('../config/config');
var axios = require('axios');

const params= {
    key: config.CSE_API_KEY,
    maxResults: 10,
    order: 'relevance',
    type: 'video',
    part: 'snippet'
};

module.exports = {
    getYouTubeSearchResult (searchTerm) {
      let paramsStr = querystring.stringify(params);
      
      var url = 'https://www.googleapis.com/youtube/v3/search?'+paramsStr+'&q='+searchTerm;
      console.log(url)
      return axios.get(url);

    }
};