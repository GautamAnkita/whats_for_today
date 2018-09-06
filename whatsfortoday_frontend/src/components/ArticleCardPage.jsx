import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import renderHTML from 'react-render-html';


const styles = {
  card: {
    maxWidth: 700,
  },
  media: {
    // ⚠️ object-fit is not supported by IE11.
    objectFit: 'cover',
  },
};

function ArticleCardPage(props) {
  const { classes, article } = props;
  return (
    <Card className={classes.card}>
      {article.images[0] && (<CardMedia
        component="img"
        className={classes.media}
        height="300"
        image={article.images[0].url}
        title="Contemplative Reptile"
      />)}
      <CardContent>
        <Typography gutterBottom variant="headline" component="h2">
          {article.title}
        </Typography>
        <Typography component="p">
            {renderHTML(article.body)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

ArticleCardPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ArticleCardPage);
