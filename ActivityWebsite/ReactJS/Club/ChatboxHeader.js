import React from 'react';

const Header = ({club}) => {
    return (
        <header className="text-center">
            <p className="lead">Welcome to <a href={`/club/${club.Slug}`}>{club.Name}</a> Chatbox   <i className="far fa-comment-alt"></i></p>
        </header>

    );
}

export default Header;