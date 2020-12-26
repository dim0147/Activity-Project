﻿import React from 'react';
import ReactTooltip from 'react-tooltip';

const ListCategory = ({ handleCheckElement, categories }) => {
    const tooltipCategory = (category) => {
        return `
            <div class="text-center">
                <p>${category.name}</p>
                <hr />
                <p>${category.description ? category.description : ''}</p>
                <img width="600px" height="400px" src="${category.image }" />
            </div>
        `
    }
    return (
        <div className="col-lg-12 col-md-12">
            <label className="label-for">Category:</label>
            <p>Tips: Hover category too see detail</p>
            <br />
            <ul className="l-checkbox">
                {
                    categories.map(category =>
                        <li key={category.Id}>
                            <div className="custom-control custom-checkbox d-inline" data-tip={tooltipCategory(category)}>
                                <input type="checkbox" className="custom-control-input" id={category.Id} name={category.name} onChange={handleCheckElement} />
                                <label className="custom-control-label" htmlFor={category.Id} checked={category.isChecked}>{category.name}</label>
                            </div>
                            <ReactTooltip type="light" effect="float" html={true} delayShow={700} />
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default ListCategory;