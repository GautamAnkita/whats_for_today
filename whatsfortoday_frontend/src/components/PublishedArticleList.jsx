import React, { Component } from "react";
import Article from "../requests/article";
import User from "../requests/user";
import Category from "../requests/category";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});


class PublishedArticleList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      articles: undefined,
      viewArticles: undefined,
      categoryList: undefined,
      page: 0,
      rowsPerPage: 3
    };

    this.findCategoryList = this.findCategoryList.bind(this);
    this.updateViewArticles = this.updateViewArticles.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);

  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  componentDidMount() {
    Category.all()
    .then(categories => {
      if(this.props.match && this.props.match.params.id){
        const currentUser = this.props.currentUser;
        const userId = this.props.match.params.id;
        console.log("Fetching published article list for user:"+currentUser.first_name); 
        User.publishedArticlesList(userId)
        .then(articles => {
          if(articles && articles.length>=1) {
            let catList = this.findCategoryList(articles, categories)
            this.setState({ loading: false, articles: articles, viewArticles: articles, categoryList: catList});
          } else {
            this.setState({ loading: false });
          }
        })
        .catch(() => {
          this.setState({ loading: false });
        });

      } else if (this.props.adminArticles) {
        console.log("Received Adming article list from props!"+JSON.stringify(this.props));
        const articles = this.props.adminArticles;
        let catList = this.findCategoryList(articles, categories);
        this.setState({ loading: false, articles: articles, viewArticles: articles, categoryList: catList});

      } else if (this.props.authorArticles) {
        console.log("Received authored article list from props!");
        const articles = this.props.authorArticles;
        let catList = this.findCategoryList(articles, categories);
        this.setState({ loading: false, articles: articles, viewArticles: articles, categoryList: catList});

      } else if (this.props.topArticles) {
        console.log("Received top article list from props!");
        const articles = this.props.topArticles;
        let catList = this.findCategoryList(articles, categories);
        this.setState({ loading: false, articles: articles, viewArticles: articles, categoryList: catList});

      } else {
        console.log("Fetching published article list!");     
        Article.allPublished()
          .then(articles => {
            if(articles && articles.length>=1) {
              let catList = this.findCategoryList(articles, categories);
              this.setState({ loading: false, articles: articles, viewArticles: articles, categoryList: catList});
            } else {
              this.setState({ loading: false });
            }
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      }
    });
  }

  findCategoryList(articles, categories){
    let categoryNameList = {};
    let catArtList = {};
    articles.forEach(article => {
      const category_id = article.category_id;
      if(!Object.keys(catArtList).includes(category_id.toString())) {
        let articleList = [];
        articleList.push(article);
        catArtList[category_id] = articleList;
      } else {
        catArtList[category_id].push(article);
      }
    });
    let keyArr = Object.keys(catArtList);
    keyArr.forEach(artCatId => {
      let matchedCategory = categories.find(function(category) {
        return category.id === parseInt(artCatId,10);
      });
      categoryNameList[artCatId] = matchedCategory.name;
    });
    catArtList['idName'] = categoryNameList;
    return catArtList;
  }

  updateViewArticles(id) {
    console.log("Listing articles for cat:"+id);
    const {articles, categoryList} = this.state;
    let filteredArticles = [];
    if(id === 0) {
      filteredArticles = articles;
    } else {
      filteredArticles = categoryList[id];
    } 
    this.setState({viewArticles: filteredArticles}); 
  }

  render() {
    
    const { loading, viewArticles, categoryList, rowsPerPage, page} = this.state;
    const { classes } = this.props;

    if (loading) {
      return (
        <main>
          <h1>Articles</h1>
          <h2>Loading...</h2>
        </main>
      );
    }

    if(!viewArticles) {
      return (
        <main>
          <h5>Sorry! Could not find any published article!</h5>
        </main>
      );
    }

    const {currentUser} = this.props;
    const catIdNameMap = categoryList['idName'];
    const catIds = Object.keys(catIdNameMap);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, viewArticles.length - page * rowsPerPage);


    return (
      <main>
        <div style={{ padding: 0, listStyle: "none" }}>
          <a onClick={() => this.updateViewArticles(0)} href="#not-used">
            All
          </a>
          {catIds.map((catId) => (
            <span key={catId}>
              {" • "}
              <a key={catId} onClick={() => this.updateViewArticles(catId)} href="#not-used">
                {catIdNameMap[catId]}
              </a>
            </span>
          ))}
        </div>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableBody>
                {viewArticles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(article => {
                  return (
                    <TableRow key={article.id}>
                      {currentUser ? 
                          (
                            <TableCell component="a" href={`/users/${currentUser.id}/articles/${article.id}`}>
                              {article.title}
                            </TableCell>
                          )

                        : 
                          ( 
                            <TableCell component="a" href={`/articles/${article.id}`}>
                              {article.title}
                            </TableCell>
                          )
                      }
                      <TableCell numeric>Published on: {new Date(article.published_in_public_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
                    count={viewArticles.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActionsWrapped}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </Paper>
      </main>



      // <main>
      //   <div style={{ padding: 0, listStyle: "none" }}>
      //     <a onClick={() => this.updateViewArticles(0)} href="#not-used">
      //       All
      //     </a>
      //     {catIds.map((catId) => (
      //       <span key={catId}>
      //         {" • "}
      //         <a key={catId} onClick={() => this.updateViewArticles(catId)} href="#not-used">
      //           {catIdNameMap[catId]}
      //         </a>
      //       </span>
      //     ))}
      //   </div>
      //   <div className={classes.root}>
      //     <List component="nav">
      //       {/* <ListItem button>
      //         <ListItemIcon>
      //           <InboxIcon />
      //         </ListItemIcon>
      //         <ListItemText primary="Inbox" />
      //       </ListItem>
      //       <ListItem button>
      //         <ListItemIcon>
      //           <DraftsIcon />
      //         </ListItemIcon>
      //         <ListItemText primary="Drafts" />
      //       </ListItem>
      //     </List>
      //     <Divider />
      //     <List component="nav">
      //       <ListItem button>
      //         <ListItemText primary="Trash" />
      //       </ListItem> */}
      //       {viewArticles.map((article, index) => (
      //         <main>
      //           <span>{new Date(article.published_in_public_at).toLocaleDateString()}</span>
      //           {" • "}
      //           {currentUser ? 
      //               (
      //                 <ListItem button component="a" href={`/users/${currentUser.id}/articles/${article.id}`}>
      //                   <ListItemText primary={article.title} />
      //                 </ListItem>) 
      //               : 
      //               ( <ListItem button component="a" href={`/articles/${article.id}`}>
      //                   <ListItemText primary={article.title} />
      //                 </ListItem>
      //               )
      //           }
      //         </main>
      //         ))}
      //     </List>
      //   </div>
      // </main>
      // <main>
      //   <div style={{ padding: 0, listStyle: "none" }}>
      //     <a onClick={() => this.updateViewArticles(0)} href="#not-used">
      //       All
      //     </a>
      //     {catIds.map((catId) => (
      //       <span key={catId}>
      //         {" • "}
      //         <a key={catId} onClick={() => this.updateViewArticles(catId)} href="#not-used">
      //           {catIdNameMap[catId]}
      //         </a>
      //       </span>
      //     ))}
      //   </div>
      //   <h1>Articles</h1>
      //   <ul style={{ padding: 0, listStyle: "none" }}>
      //     {viewArticles.map((article, index) => (
      //       <li style={{ marginBottom: "1rem" }} key={article.id}>
      //         <span>{new Date(article.published_in_public_at).toLocaleDateString()}</span>
      //         {" • "}
      //         {currentUser ? (
      //             <Link to={`/users/${currentUser.id}/articles/${article.id}`}>{article.title}</Link>
      //         ) : (
      //             <Link to={`/articles/${article.id}`}>{article.title}</Link>
      //         )}
      //         <br />
      //       </li>
      //     ))}
      //   </ul>
      // </main>
    );
  }
}

PublishedArticleList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PublishedArticleList);