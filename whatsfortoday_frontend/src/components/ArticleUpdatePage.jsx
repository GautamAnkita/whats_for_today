import React, { Component } from "react";
import User from "../requests/user";
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import Category from "../requests/category";
//import FormErrors from "./FormErrors";

class ArticleUpdatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
        loading: true,
        categories: undefined,
        selectedCat: undefined,
        currentUser: undefined,
        article: undefined
    };

    this.updateArticle = this.updateArticle.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const currentUser = this.props.currentUser;
    const article = this.props.article;
    if(currentUser) {
        console.log("Updating the article for user:"+currentUser.first_name);
    }
    
    Category.all()
    .then(categories => {
        this.setState({ loading: false, categories: categories, currentUser: currentUser, article: article});
    });
  }

  updateArticle(event) {
    // event.preventDefault();
    // const { currentTarget } = event;
    // const currentUser = this.state;
    // const article = this.state;

    // const formData = new FormData(currentTarget);
    // console.log("Updating the article for user:"+currentUser.first_name);
    // Article.updateArticle(article.id, {
    //   title: formData.get("title"),
    //   body: formData.get("body"),
    //   category_id: this.state.selectedCat
    // }).then(data => {
    //   if (data.status === 422) {
    //     this.setState({
    //       validationErrors: data.errors
    //     });
    //   } else {
    //     console.log("Updated Article Info:"+article.id);
    //     const articleId = article.id;
    //     this.props.history.push(`/articles/${articleId}`);
    //   }
    // });
  }

  onChange(value) {
    console.log(value);
    this.state.selectedCat = value;
  }

  render() {
    const { loading, categories, currentUser, article} = this.state;
    if (loading) {
        return (
          <main>
            <h1>Submit New Article!</h1>
            <h2>Loading...</h2>
          </main>
        );
      }
    if(!categories) {
        return (
          <main>
            <h2>Sorry..System is having some trouble! Please try again later!</h2>
          </main>
        );
    }
    return (
      <main>
        <h2>Update Article</h2>
        <form onSubmit={this.updateArticle}>
          <div>
            <label htmlFor="title">Title</label> <br />
            {/* <FormErrors forField="title" errors={validationErrors} /> */}
            <input name="title" id="title" />
          </div>

          <div>
            <label htmlFor="body">Body</label> <br />
            {/* <FormErrors forField="body" errors={validationErrors} /> */}
            <textarea name="body" id="body" cols="100" rows="18" />
          </div>

          <RadioGroup id = "category_id" onChange={ this.onChange } horizontal>
            {categories.map((category) => (
                <RadioButton key = {category.id} rootColor = {'black'} value={category.id.toString()}>
                    {category.name}
                </RadioButton>
            ))}
          </RadioGroup>

          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </main>
    );
  }
}

export default ArticleUpdatePage;