import { BASE_URL } from "./config";

const User = {
  current() {
    return fetch(`${BASE_URL}/users/current`, {
      credentials: "include",
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }).then(res => res.json())
  },
  createUser(params) {
    return fetch(`${BASE_URL}/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
  },
  submitArticle(id, params) {
    return fetch(`${BASE_URL}/users/${id}/articles`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
  },
  articleOfTheDay(id) {
    return fetch(`${BASE_URL}/users/${id}/articles/fortoday`, {
      credentials: "include"
    }).then(res => res.json());
  },
  publishedArticlesList(id) {
    return fetch(`${BASE_URL}/users/${id}/articles`, {
      credentials: "include"
    }).then(res => res.json());
  },
  publishedArticle(userId, artId) {
    return fetch(`${BASE_URL}/users/${userId}/articles/${artId}`, {
      credentials: "include"
    }).then(res => res.json());
  },
  authoredArticles(userId){
    return fetch(`${BASE_URL}/users/${userId}/articles/authored`, {
      credentials: "include"
    }).then(res => res.json());
  },
  testUser() {
    return fetch(`${BASE_URL}/users/abcd`, {
      credentials: "include"
    }).then(res => res.json());
  },
};

export default User;