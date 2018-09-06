import React, { Component } from "react";
import YouTube from 'react-youtube';
import ArticleCardPage from './ArticleCardPage';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import Article from '../requests/article';
import CommentList from './CommentList';
import ArticleUpdatePage from './ArticleUpdatePage';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

class ArticleDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      player1: undefined,
      player2: undefined,
      article: undefined,
      currentUser: undefined,
      msg: undefined
    };

    this._onReady1 = this._onReady1.bind(this);
    this._onReady2 = this._onReady2.bind(this);
    this._onPlayerStateChange1 = this._onPlayerStateChange1.bind(this);
    this._onPlayerStateChange2 = this._onPlayerStateChange2.bind(this);
    this._onPlayerStateChange2 = this._onPlayerStateChange2.bind(this);
    this.onClickApprove = this.onClickApprove.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const currentUser = this.props.currentUser;
    if(currentUser) {
      console.log("Displaying the article for user:"+currentUser.first_name);
    }
    const article = this.props.article;
    this.setState({ loading: false, article: article, currentUser: currentUser});
  }

  _onReady1(event) {
    this.state.player1 = event.target;
  }

  _onReady2(event) {
    this.state.player2 = event.target;
  }

  _onPlayerStateChange1(event) {
    if (event.data === YouTube.PlayerState.PLAYING) {
      this.state.player2.pauseVideo();
    }
  }

  _onPlayerStateChange2(event) {
    if (event.data === YouTube.PlayerState.PLAYING) {
      this.state.player1.pauseVideo();
    }
  }

  onClickApprove(event) {
    event.preventDefault();
    const { article } = this.state;
    console.log("Going to approve article!"+article.title);
    Article.approveArticle(article.id)
    .then(() => {
        article.is_approved = true;
        this.setState({ loading: false, article: article, msg: "The Article has been approved!"});
    });
    
  }

  onClickEdit(event) {
    event.preventDefault();
    const { article } = this.state;
    console.log("Going to edit article!"+article.title);
    this.setState({ loading: false, article: article, msg: "edit"});
  }

  onClickDelete(event) {
    const { article } = this.state;
    console.log("Going to delete article!"+article.title);
    event.preventDefault();
    Article.deleteArticle(article.id)
    .then(() => {
        this.setState({ loading: false, article: undefined, msg: "The Article has been deleted!"});
    });
  }

  render() {
    const opts = {
      height: '300',
      width: '450',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        //autoplay: 1
      }
    };

    const { classes } = this.props;
    const { loading, article, currentUser, msg } = this.state;

    const spacing = '16';
    
    if (loading) {
      return (
        <main>
          <h2>Loading...</h2>
        </main>
      );
    }

    if(!article) {
        let message = "The requested article does not exist! Please go back to home page!";
        if (msg) {
          message = msg;
        }
        return (
            <main>
              <h5> {message} </h5>
            </main>
        );
    }

    if(msg && msg === "edit") {
      return (
        <main>
          <ArticleUpdatePage article={article} currentUser={currentUser} />
        </main>
    );
    }

    let viewer = "Public";
    if(currentUser) {
      if(currentUser.is_admin) {
        viewer = "Admin";
      } else if(article.author_id === currentUser.id) {
        viewer = "Author";
      } else {
        viewer = "User";
      }
    }

    let showApprove = viewer === "Admin" && !article.is_approved;
    let showDelete = viewer === "Admin" || viewer === "Author" && !article.is_approved;
    let showEdit = viewer === "Admin" || viewer === "Author" && !article.is_approved;
    
    

      return (
        <div className={classes.root}>
          { msg && (
            <h5> {msg} </h5>
          )}
          <div align='center'>
          {showApprove && (
            <Button onClick={this.onClickApprove} variant="extendedFab" color="primary" aria-label="Delete" className={classes.button}>
              <DoneIcon className={classes.extendedIcon} />
              Approve
            </Button>
          )}
          {showEdit && (
            <Button onClick={this.onClickEdit} variant="extendedFab" color="secondary" aria-label="Edit" className={classes.button}>
              <EditIcon className={classes.extendedIcon} />
              Edit
          </Button>
          )}
          {showDelete && (
            <Button onClick={this.onClickDelete} variant="extendedFab" aria-label="Delete" className={classes.button}>
              <DeleteIcon className={classes.extendedIcon} />
              Delete
            </Button>
          )}
          
          </div>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={7}>
              <ArticleCardPage className={classes.paper} article = {article}/>
            </Grid>
            <Grid item xs={12} sm={5}>
              {article.videos[0] && (
                    <React.Fragment>
                      <YouTube
                        videoId={article.videos[0].video_id}
                        opts={opts}
                        onReady={this._onReady1}
                        onStateChange={this._onPlayerStateChange1}
                      />
                      <YouTube
                        videoId={article.videos[1].video_id}
                        opts={opts}
                        onReady={this._onReady2}
                        onStateChange={this._onPlayerStateChange2}
                      />
                    </React.Fragment>
                  )}
              </Grid>
          </Grid>
          <p>viewed:{article.view_count} times</p>
          <p>created at: {new Date (article.created_at).toLocaleString()}</p>
          <p>updated at: {new Date (article.updated_at).toLocaleString()}</p>
          <h2>Comments</h2>
          <CommentList
            onCommentDeleteClick={this.deleteComment}
            comments={article.comments}
          /> 
        </div>
      )
  }
}

ArticleDetails.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ArticleDetails);