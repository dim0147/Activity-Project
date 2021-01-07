import React from 'react';

const DetailPost = () => {
    return (
        <section className="upcoming-classes spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title normal-title">
                            <h2>Our post</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="classes__item">
                            <div className="classes__item__pic set-bg" style={{ backgroundImage: 'url("/Content/Media/Images/templates/classes/classes-1.jpg")' }} data-setbg="/Content/Media/Images/templates/classes/classes-1.jpg">
                                <span>20 Jun 2019</span>
                            </div>
                            <div className="classes__item__text">
                                <p>14 Days | Start on 10th Every Month</p>
                                <h4><a href="#">100 Hour Yoga Course Rishikesh</a></h4>
                                <h6>Jordan Lawson <span>- Yoga Teacher</span></h6>
                                <a href="#" className="class-btn">JOIN NOW</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DetailPost;