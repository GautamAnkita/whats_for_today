import React from "react";
import { NavLink } from "react-router-dom";
import {withRouter} from "react-router-dom";

const NavBar = props =>{
    const {currentUser, onSignOut = () => {} } = props;

    const handleClick = event => {
        event.preventDefault();
        console.log("Clicked Sign out!");
        onSignOut();
        props.history.push("/");
      };

return(
    <nav className="NavBar">
        <NavLink exact to="/">
            Home
        </NavLink>

        <NavLink exact to="/articles/topviewed">
            Top 5 viewed!
        </NavLink>

         <NavLink exact to="/articles/topliked">
            Top 5 liked!
        </NavLink>

         <NavLink exact to="/articles/topbookmarked">
            Top 5 bookmarked!
        </NavLink>

         <NavLink exact to="/articles">
             Public Archive
        </NavLink>

        {currentUser ? (
            <React.Fragment>
            <a onClick={handleClick} href="#not-used">
                Sign Out
            </a>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <NavLink className="supports-classname" exact to="/sign_in">
                Sign In
                </NavLink>
                
                <NavLink className="supports-classname" exact to="/sign_up">
                Sign Up
                </NavLink>
            </React.Fragment>
        )}

    </nav>
    );
};

export default withRouter(NavBar);