import React, { Component } from "react";
import User from "../requests/user";
import Category from "../requests/category";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
  size: {
    width: 40,
    height: 40,
  },
  sizeIcon: {
    fontSize: 20,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '800px',
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

class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            errorMessage: undefined,
            categories: undefined,
            selectedCategories: [],
            fName: "",
            lName: "",
            dob: "",
            addressL1: "",
            addressL2: "",
            password: "",
            email: "",
            city: "",
            state: "",
            country: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createUserWithSession = this.createUserWithSession.bind(this);
    }

    handleChange = name => event => {
      const { selectedCategories} = this.state;
      if(event.target.checked) {
        selectedCategories.push(name);
      } else {
        const index = selectedCategories.indexOf(name);
        selectedCategories.splice(index, 1);
      }
      this.setState({ selectedCategories: selectedCategories });
    };

    handleInputChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
    };
  
    componentDidMount() {
      console.log("Getting Category list.");
      Category.all()
      .then(categories => {
          this.setState({ loading: false, categories: categories});
      });
    }

    

    createUserWithSession(event) {
        event.preventDefault();
        const { selectedCategories} = this.state;
        const param = {};
        param.first_name = this.state.fName;
        param.last_name = this.state.lName;
        param.email = this.state.email;
        param.date_of_birth = this.state.dob;
        param.password = this.state.password;
        param.address_line1 = this.state.addressL1;
        param.address_line2 = this.state.addressL2;
        param.city = this.state.city;
        param.state = this.state.state;
        param.country = this.state.country;
        param.categories = selectedCategories;
        console.log("Submitted params:"+JSON.stringify(param));
        User.createUser(param).then(data => {
            console.log(data);
            if (data.status === 409) {
                this.setState({
                errorMessage: "Could not create this user..try with different email!"
                });
            } else {
                const { onSignUp = () => {} } = this.props;
                onSignUp();
                this.props.history.push("/");
            }
        });
    }

  render() {
    const { loading, errorMessage, categories, selectedCategories} = this.state;
    const { classes } = this.props;
    if (loading) {
        return (
          <main>
            <h2>Sign Up</h2>
            <h5>Loading...</h5>
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
        <h2>Sign Up</h2>
        <form className={classes.container}>
          {errorMessage ? <p>{errorMessage}</p> : null}
          <div>
          <TextField
            required
            id="fName"
            label="First Name"
            autoComplete="off"
            className={classes.textField}
            value={this.state.fName}
            onChange={this.handleInputChange('fName')}
            margin="normal"
          />
          <TextField
            required
            id="lName"
            label="Last Name"
            className={classes.textField}
            value={this.state.lName}
            onChange={this.handleInputChange('lName')}
            margin="normal"
          />
          <TextField
            required
            id="date"
            label="Date of Birth"
            type="date"
            className={classes.textField}
            onChange={this.handleInputChange('dob')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            required
            id="email"
            label="Email"
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleInputChange('email')}
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
          <TextField
            required
            id="addressL1"
            label="Address Line1"
            className={classes.textField}
            value={this.state.addressL1}
            onChange={this.handleInputChange('addressL1')}
            margin="normal"
          />
          <TextField
            id="addressL2"
            label="Address Line2"
            className={classes.textField}
            value={this.state.addressL2}
            onChange={this.handleInputChange('addressL2')}
            margin="normal"
          />
          <TextField
            required
            id="city"
            label="City"
            className={classes.textField}
            value={this.state.city}
            onChange={this.handleInputChange('city')}
            margin="normal"
          />
          <TextField
            required
            id="state"
            label="State"
            className={classes.textField}
            value={this.state.state}
            onChange={this.handleInputChange('state')}
            margin="normal"
          />
          <TextField
            required
            id="country"
            label="Country"
            className={classes.textField}
            value={this.state.country}
            onChange={this.handleInputChange('country')}
            margin="normal"
          />
          <br/>
          <br/>
          </div>
          
          <div>
          <label>Select your preferred categories from below:</label> <br />
          <FormGroup row>
            {categories.map((category) => (
              <FormControlLabel
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={this.handleChange(category.id)}
                  value={category.id}
                  color="primary"
                />
              }
              label={category.name}
            />
            ))}
          </FormGroup>
          </div>
          <div>
            <Button onClick={this.createUserWithSession} variant="contained" color="primary" className={classes.button}>
              Sign Up
            </Button>
          </div>
        </form>
      </main>
    );
  }
}

SignUpPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpPage);