import React from 'react';
import ReactDOM from 'react-dom';
import ButtonDg from './button.js';


const App = () => {
    return (
        <div>
            Hello world, here is React!
            <ButtonDg />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
