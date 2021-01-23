import React from 'react';

const SearchBar = () => {
    return (
        <div className="blog__sidebar__search">
            <form action="#">
                <input type="text" placeholder="Search" />
                <button><span className="icon_search" /></button>
            </form>
        </div>
    );
}

export default SearchBar;