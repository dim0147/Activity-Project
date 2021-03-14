import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Dashboard from './Dashboard'
import Users from './Users'


class App extends React.Component {
    render() {
        return (
            <Router>
                <div>

                    <Switch>
                        <Route path="/admin/users">
                            <Users />
                        </Route>
                        <Route path="/">
                            <Dashboard />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}


ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
