import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";


const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class ButtonAppBar extends Component{
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: undefined
    };

    this.handleSignOutClick = this.handleSignOutClick.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleSignupClick = this.handleSignupClick.bind(this);

  }

  handleSignOutClick = event => {
    const {onSignOut = () => {} } = this.props;
    event.preventDefault();
    console.log("Clicked Sign out!");
    onSignOut();
    this.props.history.push("/");
  };

  handleLoginClick = event => {
    event.preventDefault();
    console.log("Clicked Login!");
    // this.props.history.push("/sign_in");
    this.props.history.push('/sign_in');
  };
  
  handleSignupClick = event => {
    event.preventDefault();
    console.log("Clicked Sign out!");
    this.props.history.push("/sign_up");
  };

  render() {
    const {classes, currentUser} = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton> */}
           
            <Typography variant="title" color="inherit" className={classes.flex}>
              What's For Today?
            </Typography>
            
            <Link className={classes.flex} to={`/articles/fortoday`}><font color="white">TODAY'S ARTICLE!</font></Link>
    
            {currentUser && (
              <React.Fragment>
                <span>Hi {currentUser.first_name}</span>
                <Button onClick={this.handleSignOutClick} color="inherit"></Button>
              </React.Fragment>
            )}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

// function ButtonAppBar(props) {

//   //const { classes } = props;
//   const {classes, currentUser, onSignOut = () => {} } = props;

//   const handleSignOutClick = event => {
//     event.preventDefault();
//     console.log("Clicked Sign out!");
//     onSignOut();
//     props.history.push("/");
//   };

//   const handleLoginClick = event => {
//     event.preventDefault();
//     console.log("Clicked Login!");
//     props.history.push("/sign_in");
//   };
  
//   const handleSignupClick = event => {
//     event.preventDefault();
//     console.log("Clicked Sign out!");
//     props.history.push("/sign_up");
//   };

  

  // return (
  //   <div className={classes.root}>
  //     <AppBar position="static">
  //       <Toolbar>
  //         {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
  //           <MenuIcon />
  //         </IconButton> */}
         
  //         <Typography variant="title" color="inherit" className={classes.flex}>
  //           What's For Today?
  //         </Typography>
         
  
  //         {currentUser ? (
  //           <React.Fragment>
  //             <span>Hi {currentUser.first_name}</span>
  //             <Button onClick={handleSignOutClick} color="inherit">Logout</Button>
  //           </React.Fragment>
  //         ) : (
  //           <React.Fragment>
  //             <Button onClick={handleLoginClick} color="inherit">Login</Button>
  //             <Button onClick={handleSignupClick} color="inherit">Sign Up</Button>
  //           </React.Fragment>
  //         )}
  //       </Toolbar>
  //     </AppBar>
  //   </div>
  // );

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);