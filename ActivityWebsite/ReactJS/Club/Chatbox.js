import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hubConnection } from 'signalr-no-jquery';

import Header from './ChatboxHeader';
import LeftPanel from './ChatboxLeftPanel';
import RightPanel from './ChatboxRightPanel';
import './Chatbox.css';

import { getUserRoleClub, getClubDetail } from '../API/Club';


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {

            role: null,
            club: null,

            status: 'loading'
        }


    }

    async componentDidMount() {
        var clubId = document.getElementsByName("__ClubId")[0].value;

        await new Promise(resolve => {
            getUserRoleClub(clubId, (err, res) => {
                if (err) {
                    this.setState({ status: 'error' });
                    console.log(err);
                    return resolve();
                }
                if (!res.data.success) {
                    this.setState({ status: 'error' });
                    return resolve();
                }
                if (!res.data.role) {
                    this.setState({ status: 'error' })
                    return resolve();
                }
                this.setState({ role: res.data.role }, () => {
                    return resolve();
                })
            })
        });

        if (this.state.role) {
            getClubDetail(clubId)
                .then(club => this.setState({
                    status: 'success',
                    club
                }));
        }
    }

    render() {
        if (this.state.status === 'loading') {
            return (
                <div className="text-center"><i className="fas fa-spinner fa-spin"></i>   Loading Chatbox...</div>
            )
        }
        else if (this.state.status === 'error') {
            return (
                <div className="text-center alert alert-danger">Unexpected error from server</div>
            )
        }
        else if (this.state.status === 'success') {
            return (
                <div className="container py-5 px-4">
                    <Header
                        club={this.state.club}
                    />
                    <div className="row rounded-lg overflow-hidden shadow">

                        <LeftPanel
                            club={this.state.club}
                        />

                        <RightPanel
                            club={this.state.club}
                        />
                    </div>
                </div>

            )
        }
    }

}

ReactDOM.render(<App />, document.getElementById('root'));