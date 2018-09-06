import React, { Component } from "react";
import ArticleDetails from "./ArticleDetails";
import CommentList from "./CommentList";
import Article from "../requests/article";
import User from "../requests/user";
import { isError } from "util";


class ArticleShowPage extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        loading: true,
        article: undefined,
        viewer: undefined,
        user: undefined
      };

      this.deleteComment = this.deleteComment.bind(this);
    //   this.newAnswer = this.newAnswer.bind(this);
    }
  
    componentDidMount() {
        if(this.props.match) {
            if(this.props.match.params.id){
                let viewer = "public";
                const {currentUser} = this.props;
                const articleId = this.props.match.params.id;
                Article.one(articleId)
                .then(article => {
                    if(!article) {
                        this.setState({ loading: false });
                    } else {
                        console.log(article);
                        if(currentUser) {
                          if(currentUser.is_admin) {
                            viewer = "admin";
                          } else if(currentUser.id === article.author_id ) {
                            viewer = "author";
                          } else {
                            viewer = "user";
                          }
                        }
                        console.log("The article being shown is:"+article.title+" for the viewer:"+ viewer);
                        this.setState({ loading: false, article: article, viewer: viewer, user: currentUser });
                    }
                })
                .catch(() => {
                this.setState({ loading: false });
                });
            } else {
                  const userId = this.props.match.params.userId;
                  const artId = this.props.match.params.artId;
                  const {currentUser} = this.props;
                  console.log("User Id:"+userId);
                  console.log("Art Id:"+artId);
                  //console.log("User name:"+user.first_name);
                  User.publishedArticle(userId, artId)
                  .then(article => {
                      if(!article) {
                          this.setState({ loading: false });
                      } else {
                          console.log(article);
                          let viewer = "user";
                          if(currentUser.is_admin) {
                            viewer = "admin";
                          } else if(currentUser.id === article.author_id ) {
                            viewer = "author";
                          } else {
                            viewer = "user";
                          } 
                          console.log("The article being shown is:"+article.title+" for the viewer:"+ viewer);
                          this.setState({ loading: false, article: article, viewer: viewer, user: currentUser });
                      }
                  })
                  .catch(() => {
                  this.setState({ loading: false });
                  });
            }
            
        }

        if(this.props.articleOfTheDay) {
            const article = this.props.articleOfTheDay;
            const currentUser = this.props.currentUser;
            console.log("Got the article from props "+article);
            this.setState({ loading: false, article: article, user: currentUser });
        }
    }
  
    deleteComment(id) {
      const { article } = this.state;
      const { comments = [] } = article;
      const articleId = article.id;
      Article.deleteComment(articleId, id)
      .then(data => {
        this.setState({
          article: {
            ...article,
            comments: comments.filter(comment => comment.id !== id)
          }
        });
      });
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
  
      if (!article) {
        return (
          <main>
            <h2>Article doesn't exist</h2>
          </main>
        );
      }
  
      return (
        <main>
          <ArticleDetails article={article} currentUser={user} />
        </main>
      );
    }
}
  
export default ArticleShowPage;