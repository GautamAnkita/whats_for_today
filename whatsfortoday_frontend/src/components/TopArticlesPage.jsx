import React, { Component } from "react";
import Article from "../requests/article";
import PublishedArticleList from "./PublishedArticleList";

class TopArticlesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      articles: undefined,
      message: undefined
    };
  }

  componentDidMount() {
    const sortMode = this.props.sortMode;
    console.log("Fetching top article list for sort mode:"+sortMode+"!");
    if(sortMode === "viewed") {
        Article.topviewed()
        .then(articles => {
          if(articles && articles.length>=1) {
            this.setState({ loading: false, articles: articles, message: "most viewed"});
          } else {
            this.setState({ loading: false });
          }
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    } else if(sortMode === "liked") {
        Article.topliked()
        .then(articles => {
        if(articles && articles.length>=1) {
            this.setState({ loading: false, articles: articles, message: "most liked"});
        } else {
            this.setState({ loading: false });
        }
        })
        .catch(() => {
        this.setState({ loading: false });
        });
    } else if(sortMode === "bookmarked") {
        Article.topbookmarked()
        .then(articles => {
        if(articles && articles.length>=1) {
            this.setState({ loading: false, articles: articles, message: "most bookmarked"});
        } else {
            this.setState({ loading: false });
        }
        })
        .catch(() => {
        this.setState({ loading: false });
        });
    } else {
        this.setState({ loading: false });
    }
      
  }

  render() {
    
    const { loading, articles, message } = this.state;

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
        <h1>Here are 5 {message} articles!</h1>
        <PublishedArticleList topArticles={articles}/> 
      </main>
    );
  }
}

export default TopArticlesPage;