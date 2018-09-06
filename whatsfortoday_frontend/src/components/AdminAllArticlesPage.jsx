import React, { Component } from "react";
import Article from "../requests/article";
import PublishedArticleList from "./PublishedArticleList";

class AdminAllArticlesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      articles: undefined
    };
  }

  componentDidMount() {
    console.log("Fetching all article list!");     
    Article.adminAll()
    .then(articles => {
      if(articles && articles.length>=1) {
        this.setState({ loading: false, articles: articles});
      } else {
        this.setState({ loading: false });
      }
    })
    .catch(() => {
      this.setState({ loading: false });
    });  
  }

  render() {
    
    const { loading, articles } = this.state;

    if (loading) {
      return (
        <main>
          <h2>Loading...</h2>
        </main>
      );
    }

    if(!articles) {
        return (
            <main>
              <h2>Sorry! System is having trouble getting requested articles! Please try later. </h2>
            </main>
        );
    }

    return (
      <main>
        <h1>Here are your all articles!</h1>
        <PublishedArticleList adminArticles={articles}/> 
      </main>
    );
  }
}

export default AdminAllArticlesPage;