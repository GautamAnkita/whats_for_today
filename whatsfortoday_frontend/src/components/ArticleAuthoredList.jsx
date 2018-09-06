import React, { Component } from "react";
import Article from "../requests/article";
import User from "../requests/user";
import PublishedArticleList from "./PublishedArticleList";

class ArticleAuthoredList extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        loading: true,
        article: undefined
      };
    }

    componentDidMount() {
        console.log("Fetching all article list authored by a particular User.");  

        const userId = this.props.match.params.id;
        if(userId){
            User.authoredArticles(userId)
            .then(articles =>{
                if(articles && articles.length>=1){
                    this.setState({ loading: false, articles: articles});
                } else{
                    this.setState({ loading: false });
                }
            })
            .catch(() => {
                this.setState({ loading: false });
            });  
        }
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
    
        if (!articles) {
          return (
            <main>
              <h5>Sorry! You dont have authored any article yet!</h5>
            </main>
          );
        }
    
        return (
            <main>
                <h2>Here are the articles written by you!</h2>
                <PublishedArticleList authorArticles={articles} />
            </main>
        );
      }
}

export default ArticleAuthoredList;