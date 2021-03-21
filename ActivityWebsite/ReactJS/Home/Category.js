import React, { useState, useEffect } from 'react';
import axios from 'axios'

export default function Category() {

    const [categories, setCate] = useState([]);

    useEffect(() => {
        axios.get('/api/category')
            .then(res => res.data)
            .then(data => {
                if (!data.categories) return;
                setCate(data.categories);
            })
            .catch();
    }, [])


    return (
        <section className="services spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <img src="/Content/Media/Images/templates/icon.png" alt="" />
                            <h2>Enjoy All Categories</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="services__list">
                    <div className="row">
                        {categories.map(cate => (
                            <div key={cate.Id} className="col-xl-2 col-md-4 col-sm-6">
                                <div className="services__item">
                                    <img src={cate.image} alt="" />
                                    <a href={`/club/search?category=${cate.name}`}><h5>{cate.name}</h5></a>

                                    <div>
                                        <button className="btn btn-danger" type="button" data-toggle="collapse" data-target={`#collapse_${cate.Id}`} aria-expanded="false" aria-controls="collapseExample">
                                            About
  </button>
                                        <div className="collapse mt-3" id={`collapse_${cate.Id}`}>
                                            <div className="card card-body">
                                                {cate.description}
    </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </section>


    )
}