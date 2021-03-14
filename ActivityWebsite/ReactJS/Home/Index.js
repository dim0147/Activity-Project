import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';

import Category from './Category';
import Information from './Information';
import Club from './Club';

class App extends Component {

    render() {
        return (
            <>
                <Category />
                <Information />
                <Club />
            </>
        )
    }

}

ReactDOM.render(<App />, document.getElementById('root'));