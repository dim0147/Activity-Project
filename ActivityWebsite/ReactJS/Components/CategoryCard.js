import React from 'react';

const CategoryCard = ({imgSource, name, description}) => {
    return (
        <div className="col-xl-2 col-md-4 col-sm-6">
            <div className="services__item">
                <img src={imgSource} alt="" />
                <h5>{name}</h5>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default CategoryCard;