import React, {Component} from 'react';
import { Link } from "react-router-dom";

class HomePage extends Component{
    render(){
        const {currentUser} = this.props;
        return(
            <div>
                <main>
                    <h2>Welcome to What's For Today!</h2>
                </main>
                <Link to={`/articles/fortoday`}>Article of the Day is right here!</Link>
                {currentUser && (
                    <div>
                        <h2> Hi {currentUser.first_name}!</h2>
                        <Link to={`/users/${currentUser.id}/articles/fortoday`}>Article of the Day is published only for you is right here!</Link>
                        <br/>
                        <Link to={`/articles/new`}>Click here to submit a new article!</Link>
                        <br />
                        <Link to={`/users/${currentUser.id}/articles/authored`}>Authored Articles</Link>

                        {currentUser.is_admin && (
                            <div>
                                <h2> Hi Admin! Here are your links!</h2>
                                <Link to={`/articles/adminall`}>Get All Articles In the System!</Link>
                                <br/>
                                <Link to={`/articles/adminpending`}>Get All Pending Articles!</Link>
                                <br/>
                                <Link to={`/articles/adminunpublished`}>Get All Unpublished Articles!</Link>
                                <br/>
                                <Link to={`/articles/adminpopulate`}>Populate applicable Articles!</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }
}

export default HomePage;