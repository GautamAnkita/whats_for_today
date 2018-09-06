
const axios = require('axios');
const googleImages = require('./googleImages');
const youTubeVideos = require('./youTube');

const callAPIs = (article) => {
    console.log("Going to call apis for keyword:"+article.search_keyword);
    let queryStr = encodeURIComponent(article.search_keyword.trim());
    return axios.all([getWikiPage(queryStr), getGoogleImages(queryStr), getYouTubeVideos(queryStr)])
        .then(axios.spread(function (wikiRes, imageRes, youTubeRes) {
        
            let resultArr = imageRes.data.items;
            let imgArr = [];
            
            
            resultArr.forEach(img => {
                let imgObj = {};
                imgObj.url = img.link;
                imgObj.title = img.title;
                imgObj.height = img.image.height;
                imgObj.width = img.image.width;
                console.log("Received Images:"+JSON.stringify(imgObj));
                imgArr.push(imgObj);
            });
            
    
            let page = wikiRes.data.query.pages;
            let wiki_res = Object.values(page)[0].extract;
            let videos = youTubeRes.data.items;
            let videoIdArr = [];
            
            let i = 0;
            videos.forEach((val, i) => {
                if(i<=1) {
                    let videoObj = {};
                    videoObj.title = val.snippet.title;
                    videoObj.video_id = val.id.videoId;
                    console.log("Received Video:"+JSON.stringify(videoObj));
                    videoIdArr.push(videoObj);
                }
            });

            
            console.log("Received Wiki and Google image Result for Article:"+article.title);
            
            article.body = wiki_res;
            article.images = imgArr;
            article.videos = videoIdArr;
            
            return article;

        })).then((article) => {
            return article;
        }).catch(error => {
            console.log(error);
        });
}

function getWikiPage(queryStr) {
  let query = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles='+queryStr;
  return axios.get(query);
}

function getGoogleImages(queryStr) {
  return googleImages.getImageSearchResults(queryStr, 0, 5);
}

function getYouTubeVideos(queryStr) {
  queryStr = queryStr.split(" ").join("+")+"+documentary+in+English";
  return youTubeVideos.getYouTubeSearchResult(queryStr);
}

module.exports = {
    callAPIs
}