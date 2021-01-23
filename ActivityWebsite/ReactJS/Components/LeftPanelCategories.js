import React from 'react';

const LeftPanelCategories = () => {
    return (
        <div className="blog__sidebar__categories">
            <h4>Categories</h4>
            <ul>
                <li><a href="#">All</a></li>
                <li><a href="#">Fuel (20)</a></li>
                <li><a href="#">Sweat (5)</a></li>
                <li><a href="#">Play (9)</a></li>
                <li><a href="#">Live (10)</a></li>
            </ul>
        </div>
    );
}

export default LeftPanelCategories;