import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReportCard from './ReportCard';

import { getCurrentUserReports } from '../API/User'

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,

            reports: [],
            error: ''
        }
    }

    componentDidMount() {
        getCurrentUserReports((err, response) => {
            this.setState({ loading: false });
            if (err) {
                return this.setState({ error: 'Error while getting reports' });
            }

            if (response.data.success && Array.isArray(response.data.data)) {
                return this.setState({ reports: response.data.data });
            }


        })
    }

    render() {
        const { loading, reports, error } = this.state;

        if (loading) {
            return <div className="text-center"><i className="fas fa-spinner fa-spin"></i>   Loading reports</div>
        }

        if (!loading && error) {
            return <div className="text-center alert alert-danger">{error}</div>
        }

        if (reports.length === 0) {
            return <div className="text-center">Don't report any club yet!</div>
        }

        return (
            <div className="row">
                {reports.map(report => <ReportCard key={report.Id} report={report} />)}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));