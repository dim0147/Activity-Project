import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { getCurrentUserClubs } from '../API/User'

import { ConfirmProvider } from 'material-ui-confirm';
import Table from './ClubTable';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            clubs: [],

            isLoading: true,
            errors: null
        }
    }

    componentDidMount() {
        getCurrentUserClubs((err, result) => {
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
                clubs: result.data.data
            });
            return;
        })
    }

    render() {
        const { isLoading, clubs, errors } = this.state;
        if (isLoading) {
            return (
                <div className="text-center" style={{ maxWidth: "100%" }}>
                    <i className="fas fa-spinner fa-spin"></i>   Loading clubs....
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
                            clubs={clubs}
                        />
                    </div>
                </ConfirmProvider>
            )
        }
    }
}

ReactDOM.render(<App />, document.getElementById('root'));