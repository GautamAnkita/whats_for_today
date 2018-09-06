import React, { Component } from "react";
import Article from "../requests/article";
import PublishedArticleList from "./PublishedArticleList";
import ArticleDetails from "./ArticleDetails";

class AdminPopulateArticlesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      articles: undefined
    };
  }

  componentDidMount() {
    console.log("Sending requests to populate articles!");     
    Article.adminPopulate()
    .then(articles => {
      if(articles && articles.length>=1) {
        //console.log("Received Articles!"+JSON.stringify(articles));
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
        <h1>Here are your populated articles!</h1>
        <PublishedArticleList adminArticles={articles}/>
      </main>
    );
  }
}

export default AdminPopulateArticlesPage;