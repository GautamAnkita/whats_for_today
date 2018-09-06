import {BASE_URL} from "./config";

const Article = {
  allPublished() {
    return fetch(`${BASE_URL}/articles`, { credentials: "include" }).then(
      res => res.json()
    );
  },
  adminAll() {
    return fetch(`${BASE_URL}/articles/adminall`, { credentials: "include" }).then(
      res => res.json()
    );
  },
  adminPending() {
    return fetch(`${BASE_URL}/articles/pending`, { credentials: "include" }).then(
      res => res.json()
    );
  },
  adminUnpublished() {
    return fetch(`${BASE_URL}/articles/notpublished`, { credentials: "include" }).then(
      res => res.json()
    );
  },
  adminPopulate() {
    return fetch(`${BASE_URL}/articles/populate`, { credentials: "include" }).then(
      res => res.json()
    );
  },
  adminGetArticleInfo(params){
    return fetch(`${BASE_URL}/articles/fillArticleInfo`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
  },
  topviewed() {
    return fetch(`${BASE_URL}/articles/orderbyview`, { credentials: "include" }).then(
      res => res.json()
    );
  },
  topliked() {
    return fetch(`${BASE_URL}/articles/orderbylike`, { credentials: "include" }).then(
      res => res.json()
    );
  },
  topbookmarked() {
    return fetch(`${BASE_URL}/articles/orderbybookmark`, { credentials: "include" }).then(
      res => res.json()
    );
  },
  one(id) {
    return fetch(`${BASE_URL}/articles/${id}`, {
      credentials: "include"
    }).then(res => res.json());
  },
  deleteArticle(id) {
    return fetch(`${BASE_URL}/articles/${id}`, {
      method: "DELETE",
      credentials: "include"
    }).then(res => res.json());
  },
  approveArticle(id) {
    return fetch(`${BASE_URL}/articles/approve/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    }).then(res => {return res});
  },
  articleOfTheDay() {
    return fetch(`${BASE_URL}/articles/fortoday`, {
      credentials: "include"
    }).then(res => res.json());
  }
};

export default Article;