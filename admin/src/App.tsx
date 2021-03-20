import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/styles';

import { setUser } from './store/user/actions';
import { appState } from './store/index';
import { IUser } from './store/user/types';

import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';

import Header from './Header';
import Dashboard from './Dashboard';
import Login from './Login';
import User from './User';
import Club from './Club';
import Post from './Post';
import Category from './Category';
import Report from './Report';
import Moderator from './Moderator';

const mapStateToProps = (state: appState) => ({ user: state });

const mapDispatchToProps = {
    setUser,
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
}));

interface IProps {
    user: appState;
    setUser: typeof setUser;
}

interface IRespondGetUser {
    success: boolean;
    user: IUser;
}

function App({ user, setUser }: IProps) {
    const classes = useStyles();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getUser() {
            setLoading(true);
            const response = await axios
                .get<IRespondGetUser>('/api/user')
                .then((response) => response.data)
                .catch((err) => null);
            setLoading(false);
            if (response === null) {
                return;
            }

            const { user } = response;

            if (
                user.Role === undefined ||
                (user.Role.toLowerCase() !== 'admin' &&
                    user.Role.toLowerCase() !== 'moderator')
            ) {
                return;
            }

            setUser(user);
        }

        if (user === null) getUser();
    }, []);

    if (loading) {
        return (
            <Box>
                <p>Loading...</p>
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Router>
            <Switch>
                <Route path='/login'>
                    <Login />
                </Route>
            </Switch>

            {user === null ? (
                <>
                    <p>Please login first</p>
                    <Link to='/login'>Click here to login</Link>
                </>
            ) : (
                <div className={classes.root}>
                    <Header />

                    <Switch>
                        <Route path='/user'>
                            <User />
                        </Route>

                        <Route path='/club'>
                            <Club />
                        </Route>

                        <Route path='/post'>
                            <Post />
                        </Route>

                        <Route path='/report'>
                            <Report />
                        </Route>

                        <Route path='/moderator'>
                            <Moderator />
                        </Route>

                        <Route path='/category'>
                            <Category />
                        </Route>

                        <Route path='/'>
                            <Dashboard />
                        </Route>
                    </Switch>
                    
                </div>
            )}
        </Router>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
