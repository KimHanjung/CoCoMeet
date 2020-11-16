import React, { Component } from 'react';
import { Link, Route, BrowserRouter as Router } from "react-router-dom";
import './enter.css'

class Start extends Component {

    render() {
        return (
            <body>
            <div className="page-container">
            <div className="login-form-container shadow">
                <div className="login-form-right-side">
                    <div className="top-logo-wrap">
                        
                    </div>
                    <h1>Welcome to COCOMEET!</h1>
                    <p>Convenient Co-work!<br/>COCOMEET is the best web meeting flatform. Discuss through chatting and organize the content easily. 'We are smarter than me.'</p>
                </div>
                <div className="login-form-left-side-main">
                    <div className="login-btn-wrap">
                        <Link to="/create_room">
                            <button className="login-btn-main">CREATE</button>
                        </Link>
                        <Link to="/enter">
                            <button className="login-btn">JOIN</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        </body>
        );
    }
}

export default Start;