import React from 'react';

const Header = ({club}) => {
    return (
        <header className="text-center">
            <h1 className="display-4 text-white">{`${club.Name} Chatbox`}</h1>
            <p className="text-white lead mb-0">Welcome to {club.Name} chatbox</p>
        </header>

    );
}

export default Header;