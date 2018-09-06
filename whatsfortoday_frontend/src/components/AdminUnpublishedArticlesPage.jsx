import React, { Component } from "react";
import Article from "../requests/article";
import PublishedArticleList from "./PublishedArticleList";

class AdminUnpublishedArticlesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      articles: undefined
    };
  }

  componentDidMount() {
    console.log("Fetching unpublished article list!");     
    Article.adminUnpublished()
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
              <h5>Sorry Admin! I do not any unpublished article left! Give me more articles! </h5>
            </main>
        );
    }

    return (
      <main>
        <h1>Here are your all unpublished articles!</h1>
        <PublishedArticleList adminArticles={articles}/> 
      </main>
    );
  }
}

export default AdminUnpublishedArticlesPage;