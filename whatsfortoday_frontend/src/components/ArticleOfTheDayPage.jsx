import React, { Component } from "react";
import Article from "../requests/article";
import User from "../requests/user";
import ArticleShowPage from "./ArticleShowPage";

class ArticleOfTheDayPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      article: undefined,
      user: undefined
    };
  }

  componentDidMount() {
    if(this.props.match && this.props.match.params.id){
        const currentUser = this.props.currentUser;
        const userId = this.props.match.params.id;
        console.log("Fetching Article of the day for userId:"+userId);
        console.log("Fetching Article of the day for User!"+JSON.stringify(this.props));          
        User.articleOfTheDay(userId)
        .then(dayArticle => {
            if(dayArticle) {
              console.log("Article of the day returned from server is:"+dayArticle);
              this.setState({ loading: false, article: dayArticle, user: currentUser });
            } else {
              console.log("Could not get the Article of the day from server.");
              this.setState({ loading: false, user: currentUser});
            }
        })
        .catch(() => {
          console.log("Could not get the Article of the day from server.");
          this.setState({ loading: false, user: currentUser });
        });
    } else {
        console.log("Fetching Article of the day for public!"+JSON.stringify(this.props));
        const currentUser = this.props.currentUser;     
        Article.articleOfTheDay()
        .then(dayArticle => {
            if(dayArticle) {
              console.log("Article of the day returned from server is:"+dayArticle.title);
              this.setState({ loading: false, article: dayArticle, user: currentUser });
            } else {
              this.setState({ loading: false });
            }
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    }
   
  }

  render() {
    
    const { loading, article, user } = this.state;

    if (loading) {
      return (
        <main>
          <h2>Loading...</h2>
        </main>
      );
    }

    if(!article) {
        return (
            <main>
              {user ? (
                <h5>Sorry {user.first_name}! System could not find the article of the day for you! Please try later. </h5>
              ) : (
                <h5>Sorry! System could not fine the article of the day! Please try later. </h5>
              )}
            </main>
        );
    }

    return (
      <main>
        <h1>Here is your article of the day!</h1>
        <ArticleShowPage articleOfTheDay={article} currentUser={user} /> 
      </main>
    );
  }
}

export default ArticleOfTheDayPage;