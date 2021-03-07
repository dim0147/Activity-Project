import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import LeftPanel from './SearchLeftPanel';
import RightPanel from './SearchRightPanel';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: null,

            appLoaded: false,
            errorLoading: null
        }
    }

    async componentDidMount() {

    }

    render() {
        return (
            <section className="blog spad">
                <div className="container">
                    <div className="row">
                        <LeftPanel />
                        <RightPanel />
                    </div>
                </div>
            </section>

        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
