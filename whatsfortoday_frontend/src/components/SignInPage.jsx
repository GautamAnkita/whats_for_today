import React, { Component } from "react";
import Session from "../requests/session";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '400px',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class SignInPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: undefined,
      username:'',
      password:''
    };

    this.createSession = this.createSession.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  }

  handleInputChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  createSession(event) {
    event.preventDefault();
    const email = this.state.username;
    const password = this.state.password;
    console.log("submitted username:"+email);
    console.log("submitted password:"+password);

    Session.create({
      email: email,
      password: password
    }).then(data => {
        console.log("Received:"+data);
        if (data.status === 401) {
            this.setState({
            errorMessage: "Invalid Email or Password!"
            });
        } else {
            const { onSignIn = () => {} } = this.props;
            onSignIn();
            console.log(this.props);
            this.props.history.push("/");
        }
    });
  }

  render() {
    const { errorMessage } = this.state;
    const { classes } = this.props;
    return (
      <main>
        { errorMessage && (
          <h5><font color='red'> {errorMessage} </font></h5>
        )}
        <form className={classes.container}>
          <TextField
            required
            id="email"
            label="Email"
            className={classes.textField}
            value={this.state.username}
            onChange={this.handleInputChange('username')}
            margin="normal"
          />
          <TextField
            required
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            className={classes.textField}
            value={this.state.password}
            onChange={this.handleInputChange('password')}
            margin="normal"
          />
        </form>
        <br/>
        <div>
            <Button onClick={this.createSession} variant="contained" color="primary">
              Sign In
            </Button>
          </div>
      </main>
    );
  }
}

SignInPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignInPage);