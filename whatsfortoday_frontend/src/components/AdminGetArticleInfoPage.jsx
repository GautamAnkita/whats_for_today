import React, { Component } from "react";
import Article from "../requests/article";
import ArticleShowPage from "./ArticleShowPage";

class AdminGetArticleInfoPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
        loading: false,
        article: undefined
    };

    this.submitArticle = this.submitArticle.bind(this);
  }

  submitArticle(event) {
    event.preventDefault();
    const { currentTarget } = event;
    const {currentUser} = this.props;
    const formData = new FormData(currentTarget);
    //console.log("Submitting the article"+currentUser.first_name);
    Article.adminGetArticleInfo({
      search_keyword: formData.get("search_keyword")
    }).then(data => {
      if (data.status === 422) {
        this.setState({
          validationErrors: data.errors
        });
      } else {
        console.log("Received Article data:"+JSON.stringify(data));
        this.setState({ loading: false, article: data});
      }
    });
  }

  componentDidMount() {
  }

  onChange(value) {
    console.log(value);
    this.state.selectedCat = value;
  }

  render() {
    const { loading, article} = this.state;

    if (loading) {
        return (
          <main>
            <h1>Submit New Article!</h1>
            <h2>Loading...</h2>
          </main>
        );
      }
  
    if(!article) {
        return (
            <main>
              <h2>Get Article Info!</h2>
              <form onSubmit={this.submitArticle}>
                <div>
                  <label htmlFor="search_keyword">Search Keyword:</label> <br />
                  {/* <FormErrors forField="title" errors={validationErrors} /> */}
                  <input name="search_keyword" id="search_keyword" />
                </div>
                <div>
                  <input type="submit" value="Submit" />
                </div>
              </form>
            </main>
          );
    }

    return (
        <main>
          <h1>Here is your article!</h1>
          <ArticleShowPage articleOfTheDay={article}/> 
        </main>
    );
    
  }
}

export default AdminGetArticleInfoPage;