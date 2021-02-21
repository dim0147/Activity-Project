import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { getCurrentUserFollowing } from '../API/User'

import Card from './FollowingCard'

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            followers: [],

            isLoading: true,
            errors: null
        }
    }

    componentDidMount() {
        getCurrentUserFollowing((err, response) => {
            this.setState({ isLoading: false });

            if (err) {
                return this.setState({
                    errors: 'Unexpected errors !'
                });
            }

            if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
                return this.setState({
                    errors: 'Invalid response from server !'
                });
            }

            this.setState({
                followers: response.data.data.map(f => {
                    return {
                        ...f,
                        isFollow: true
                    };
                })
            });
        });
    }

    render() {

        const { followers, isLoading, errors } = this.state;

        if (isLoading) {
            return (
                <div className="text-center" style={{ maxWidth: "100%" }}>
                    <i className="fas fa-spinner fa-spin"></i>   Loading Followings....
                </div>
            )
        }
        else if (!isLoading && errors !== null) {
            return (
                <div className="text-center" style={{ maxWidth: "100%" }}>
                    <div className="alert alert-danger" role="alert">
                        {errors}
                    </div>
                </div>
            )
        }
        else if (!isLoading && errors === null) {

            if (followers.length === 0)
                return (
                    <div className="text-center" style={{ maxWidth: "100%" }}>
                        <p>Don't follow any club yet</p>
                    </div>
                )
            else 
                return (
                    <>
                        <div className="row">
                            <div className="text-center col-md-12 mb-2">
                                <h1>Followings</h1>
                            </div>
                            {followers.map(follow => <Card key={follow.Id} follow={follow} />)}
                            
                        </div>
                    </>
                )
        }


        
    }
}

ReactDOM.render(<App />, document.getElementById('root'));