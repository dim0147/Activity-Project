import React from 'react';

const ListCategory = ({ handleCheckElement, categories }) => {
    return (
        <div className="col-lg-12 col-md-12">
            <label className="label-for">Category:</label>
            <br />
            {
                categories.map(category =>
                    <div className="custom-control custom-checkbox d-inline" key={category.Id}>
                        <input type="checkbox" className="custom-control-input" id={category.Id} name={category.name} onChange={handleCheckElement} />
                        <label className="custom-control-label" htmlFor={category.Id} checked={category.isChecked}>{category.name}</label>
                    </div>
                )
            }
        </div>
    )
}

export default ListCategory;