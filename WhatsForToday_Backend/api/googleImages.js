'use strict';

const config = require('../config/config');
const axios = require('axios');

/**
 * Retrieves a list of image search results from Google
 * @param (String) searchTerm
 * @param (Function) callback (function to call once results are processed)
 * @param (Number) -optional- start (starting from what result)
 * @param (Number) -optional- num (how many results to return, 1 - 10)
 *
 * @return (Object)
 *
 */
module.exports = {
  getImageSearchResults (searchTerm, start, num) {
    start = start < 0 || start > 90 || typeof(start) === 'undefined' ? 0 : start;
    num = num < 1 || num > 10 || typeof(num) === 'undefined' ? 10 : num;
  
    if (!searchTerm) {
      console.error('No search term');
    }
  
    let parameters = '&q=' + encodeURIComponent(searchTerm);
    parameters += '&searchType=image';
    parameters += start ? '&start=' + start : '';
    parameters += '&num=' + num;
  
    const host = 'https://www.googleapis.com';
    const path = '/customsearch/v1?key=' + config.CSE_API_KEY + '&cx=' + config.CSE_ID + parameters;
    const url = host+path;
    console.log(url);
    
    return axios.get(url);
  }
};
