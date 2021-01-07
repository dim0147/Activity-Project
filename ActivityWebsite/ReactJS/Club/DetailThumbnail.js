import React from 'react';

const DetailThumbnail = ({thumbnails}) => {
    return (
        <section className="gallery">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title normal-title">
                            <h2>Our Gallery</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    {thumbnails.map(img =>
                        <div className="col-lg-3 col-md-4 col-6 p-0" key={img.Id}>
                            <div className="gallery__pic">
                                <img src={img.image} alt="" />
                            </div>
                        </div>  
                    )}
                </div>
            </div>
        </section>
    )
}

export default DetailThumbnail;