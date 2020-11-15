import React, { Component } from 'react';
import { Link, Route, BrowserRouter as Router } from "react-router-dom";

class Start extends Component {

    render() {
        return (
            <div>
                <Link to="/enter">
                    <button>입 장</button>
                </Link>
                <Link to="/create_room">
                    <button>방 생성</button>
                </Link>

            </div>
        );
    }
}

export default Start;