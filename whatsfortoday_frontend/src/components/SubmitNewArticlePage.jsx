import React, { Component } from "react";
import User from "../requests/user";
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import Category from "../requests/category";
//import FormErrors from "./FormErrors";

class SubmitNewArticlePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
        loading: true,
        categories: undefined,
        selectedCat: undefined
    };

    this.submitArticle = this.submitArticle.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  submitArticle(event) {
    event.preventDefault();
    const { currentTarget } = event;
    const {currentUser} = this.props;
    const formData = new FormData(currentTarget);
    console.log("Props:"+JSON.stringify(this.props));
    console.log("Submitting the article for user:"+currentUser.first_name);
    const videos = {};
    User.submitArticle(currentUser.id, {
      title: formData.get("title"),
      body: formData.get("body"),
      image: formData.get("image"),
      video0: formData.get("video0"),
      video1: formData.get("video1"),
      category_id: this.state.selectedCat
    }).then(data => {
      if (data.status === 422) {
        this.setState({
          validationErrors: data.errors
        });
      } else {
        console.log("Submitted Article Info:"+JSON.stringify(data.article.id));
        const articleId = data.article.id;
        this.props.history.push(`/articles/${articleId}`);
      }
    });
  }

  componentDidMount() {
    const currentUser = this.props.currentUser;
    console.log("Submitting the article for user:"+currentUser.first_name);
    Category.all()
    .then(categories => {
        this.setState({ loading: false, categories: categories});
    });
  }

  onChange(value) {
    console.log(value);
    this.state.selectedCat = value;
  }

  render() {
    const { loading, categories} = this.state;
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
        <h2>New Article</h2>
        <form onSubmit={this.submitArticle}>
          <div>
            <label htmlFor="title">Title</label> <br />
            {/* <FormErrors forField="title" errors={validationErrors} /> */}
            <input name="title" id="title" />
          </div>
          <br/>
          <div>
            <label htmlFor="body">Body</label> <br />
            {/* <FormErrors forField="body" errors={validationErrors} /> */}
            <textarea name="body" id="body" cols="100" rows="10" />
          </div>
          <br/>
          <div>
            <label htmlFor="image">Image URL</label> <br />
            {/* <FormErrors forField="body" errors={validationErrors} /> */}
            <textarea name="image" id="image" cols="100" rows="1" />
          </div>
          <br/>
          <div>
            <label htmlFor="video0">YouTube Video ID 1</label> <br />
            {/* <FormErrors forField="body" errors={validationErrors} /> */}
            <input name="video0" id="video0"/>
          </div>
          <br/>
          <div>
            <label htmlFor="video1">YouTube Video ID 2</label> <br />
            {/* <FormErrors forField="body" errors={validationErrors} /> */}
            <input name="video1" id="video1"/>
          </div>
          <br/>
          <RadioGroup id = "category_id" onChange={ this.onChange } horizontal>
            {categories.map((category) => (
                <RadioButton key = {category.id} rootColor = {'black'} value={category.id.toString()}>
                    {category.name}
                </RadioButton>
            ))}
          </RadioGroup>
          <br/>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </main>
    );
  }
}

export default SubmitNewArticlePage;