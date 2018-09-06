import React, {Component} from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 440,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawerPaper: {
      position: 'relative',
      width: drawerWidth,
      background: 'rgb(204,	255, 204)'
      
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
      minWidth: 0, // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar,
});

const drawerWidth = 240;


class HomePageNew extends Component{
    render(){
        const {classes, currentUser} = this.props;
        return(
            <div className={classes.root}>
                {currentUser && (<Drawer
                    variant="permanent"
                    classes={{
                    paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.toolbar} />
                    {currentUser.is_admin ? (
                            <div>
                                <ListItem><b>Admin's view!</b></ListItem>

                                <Divider />             
                                <ListItem button component="a" href={`/articles/new`}>
                                    <ListItemText primary="Submit a new Article!" />
                                </ListItem>
                                <Divider />
                                <ListItem button component="a" href={`/articles/adminall`}>
                                    <ListItemText primary="All Articles!" />
                                </ListItem>
                                <Divider />
                                <ListItem button component="a" href={`/articles/adminpending`}>
                                    <ListItemText primary="Pending Articles!" />
                                </ListItem>
                                <Divider />
                                <ListItem button component="a" href={`/articles/adminunpublished`}>
                                    <ListItemText primary="Unpublished Articles!" />
                                </ListItem>
                                <Divider />
                                <ListItem button component="a" href={`/articles/adminpopulate`}>
                                    <ListItemText primary="Populate Applicable Articles!" />
                                </ListItem>
                                <Divider />
                                <ListItem button component="a" href={`/articles/admin_getarticleinfo`}>
                                    <ListItemText primary="Fetch an Article from APIs!" />
                                </ListItem>
                            </div>
                        ) : (
                            <div>
                                <Divider />
                                <ListItem button component="a" href={`/users/${currentUser.id}/articles/fortoday`}>
                                    {/* <ListItemText primary={`${currentUser.first_name}'s Today's Article! Click Here.} /> */}
                                    <b>{currentUser.first_name}'s Today's Article! </b>
                                </ListItem>
                                <Divider />
                                <ListItem button component="a" href={`/articles/new`}>
                                    <ListItemText primary="Submit Article!" />
                                </ListItem>
                                <Divider />
                                <ListItem button component="a" href={`/users/${currentUser.id}/articles/authored`}>
                                    <ListItemText primary={`Authored Articles`} />
                                </ListItem>
                                <Divider />
                                <ListItem button component="a" href={`/users/${currentUser.id}/articles`}>
                                    <ListItemText primary={`${currentUser.first_name}'s Archive`} />
                                </ListItem>
                                <Divider />
                            </div>
                        )}
                </Drawer>
                )}
                <Grid container spacing={0} justify = "center">
                    <img src={require('./../assets/img/home_page.png')} width='70%'/>
                </Grid>
            </div>
        )
    }
}

HomePageNew.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(HomePageNew);