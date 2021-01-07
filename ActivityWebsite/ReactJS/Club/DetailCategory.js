import React from 'react';
import CategoryCard from '../Components/CategoryCard';

const DetailCategory = ({ listCategories }) => {

    return (
        <section className="services spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <img src="/Content/Media/Images/templates/icon.png" alt="" />
                            <h2>Category</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="services__list">
                    <div className="row">

                        {listCategories.map(category =>
                            <CategoryCard
                                imgSource={category.image}
                                name={category.Name}
                                description={category.Description}
                                key={category.Id}
                            />
                        )}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default DetailCategory;