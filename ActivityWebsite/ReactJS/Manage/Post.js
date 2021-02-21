import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { getCurrentUserPosts } from '../API/User'

import { ConfirmProvider } from 'material-ui-confirm';
import Table from './PostTable';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            posts: [],

            isLoading: true,
            errors: null
        }
    }

    componentDidMount() {
        getCurrentUserPosts((err, result) => {
            this.setState({
                isLoading: false
            });

            if (err) {
                this.setState({
                    errors: 'Error while getting data!'
                });
                return;
            }

            if (!result.data || !result.data.success || !result.data.data) {
                this.setState({
                    errors: 'Invalid response data!'
                });
                return;
            }

            this.setState({
                posts: result.data.data
            });
        })
    }

    render() {
        const { isLoading, posts, errors } = this.state;
        if (isLoading) {
            return (
                <div className="text-center" style={{ maxWidth: "100%" }}>
                    <i className="fas fa-spinner fa-spin"></i>   Loading posts....
                </div>
            )
        }
        else if (!isLoading && errors !== null) {
            return (
                <div className="text-center" style={{ maxWidth: "100%" }}>
                    <div class="alert alert-danger" role="alert">
                        {errors}
                    </div>
                </div>
            )
        }
        else if (!isLoading && errors === null) {
            return (
                <ConfirmProvider>
                    <div style={{ maxWidth: "100%" }}>
                        <Table
                            posts={posts}
                        />
                    </div>
                </ConfirmProvider>
            )
        }
    }
}

ReactDOM.render(<App />, document.getElementById('root'));