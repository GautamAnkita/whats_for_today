import React, { Component }  from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import HomePageNew from "./HomePageNew";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import Session from "../requests/session";
import PublishedArticleList from "./PublishedArticleList";
import ArticleShowPage from "./ArticleShowPage";
import ArticleOfTheDayPage from "./ArticleOfTheDayPage";
import AdminAllArticlesPage from "./AdminAllArticlesPage";
import AdminPendingArticlesPage from "./AdminPendingArticlesPage";
import AdminUnpublishedArticlesPage from "./AdminUnpublishedArticlesPage";
import TopArticlesPage from "./TopArticlesPage";
import SubmitNewArticlePage from "./SubmitNewArticlePage";
import AdminPopulateArticlesPage from "./AdminPopulateArticlesPage";
import ArticleAuthoredList from "./ArticleAuthoredList";
import ButtonAppBar from "./ButtonAppBar";
import AdminGetArticleInfoPage from "./AdminGetArticleInfoPage";

import User from "../requests/user";

class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            currentUser: undefined
        };

        this.destroySession = this.destroySession.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    destroySession() {
        console.log("Calling destroy session!");
        Session.destroy().then(() => {
          this.setState({ currentUser: undefined });
        });
    }

    getUser() {
        console.log("Getting current user");
        return User.current().then(data => {
          console.log("Current User:"+data);
          if (data.id) {
              console.log("Setting the current user!");
            this.setState({
              currentUser: data
            });
          }
        });
    }

    componentDidMount(){
        console.log("Initiating the call current user");
        this.getUser().then(()=>{
          this.setState({loading: false});
        })
    }

    render(){
        const { loading, currentUser } = this.state;
        if (loading) {
            return (
              <main>
              </main>
            );
        }
        
        console.log("Current User is:"+JSON.stringify(currentUser));
        return(
            <Router>
            <div>
                <ButtonAppBar
                    onSignOut={this.destroySession}
                    currentUser={currentUser}
                />
                <NavBar 
                    onSignOut={this.destroySession}
                    currentUser={currentUser} 
                />
                <Switch>

                    <Route exact path="/" render={props => <HomePageNew {...props} currentUser={currentUser} />}
                    />
                    
                    <Route exact path="/users/:id/articles/authored" 
                        render={props => <ArticleAuthoredList {...props} currentUser={currentUser} />}
                    />

                    <Route exact path="/users/:id/articles/fortoday" 
                        render={props => <ArticleOfTheDayPage {...props} key = {11} currentUser={currentUser} />}
                    />
                    <Route exact path="/users/:userId/articles/:artId" 
                        render={props => <ArticleShowPage {...props} currentUser={currentUser} />}
                    />
                    <Route exact path="/users/:id/articles"
                        render={props => <PublishedArticleList {...props} currentUser={currentUser} />}
                    />

                    <Route exact path="/articles/new"
                        render={props => <SubmitNewArticlePage {...props} key={10} currentUser={currentUser} />}
                    />
                    
                    <Route exact path="/articles/adminall" component={AdminAllArticlesPage} />

                    <Route exact path="/articles/adminpending" component={AdminPendingArticlesPage} />

                    <Route exact path="/articles/adminunpublished" component={AdminUnpublishedArticlesPage} />

                    <Route exact path="/articles/adminpopulate" component={AdminPopulateArticlesPage} />

                    <Route exact path="/articles/admin_getarticleinfo" component={AdminGetArticleInfoPage} />

                    {/* <Route exact path="/articles/fortoday" component={ArticleOfTheDayPage} /> */}

                    <Route exact path="/articles/fortoday" 
                        render={props => <ArticleOfTheDayPage {...props} key = {12} currentUser={currentUser} />}
                    />

                    <Route exact path="/articles/topviewed" render={props => <TopArticlesPage key = {1} sortMode={"viewed"} />}
                    />

                    <Route exact path="/articles/topliked" render={props => <TopArticlesPage key = {2} sortMode={"liked"} />}
                    />

                    <Route exact path="/articles/topbookmarked" render={props => <TopArticlesPage key = {3} sortMode={"bookmarked"} />}
                    />

                    <Route exact path="/articles/:id" 
                        render={props => <ArticleShowPage {...props} currentUser={currentUser} />}
                    />
                   
                    <Route exact path="/articles" key = {5} component={PublishedArticleList} />
                    
                    <Route path="/sign_in"
                        render={props => <SignInPage {...props} onSignIn={this.getUser} />}
                    />
                    <Route path="/sign_up"
                        render={props => <SignUpPage {...props} onSignUp={this.getUser} />}
                    />
                </Switch>
            </div>
        </Router>
        );
    }
};

export default App;