import React from 'react';
import moment from 'moment';

const DetailAbout = ({ clubHeaderImg, clubName, clubOperationHours, clubEstablishAt }) => {
    return (
        <section className="home-about spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7">
                        <div className="home__about__pic__item large-item set-bg" style={{ backgroundImage: `url("${clubHeaderImg}")`, width: '100%' }} data-setbg="/Content/Media/Images/templates/about/about-1.jpg" />
                    </div>
                    <div className="col-lg-5">
                        <div className="home__about__text">
                            <div className="section-title">
                                <h2>Welcome to {clubName}</h2>
                            </div>
                            <p>Operation hours: {clubOperationHours}</p>
                            <p className="para-2">Establish at: {moment(clubEstablishAt).format('LL')}.</p>
                            <a href="#" className="primary-btn mr-3">Follow</a>
                            <a href="#" className="primary-btn">Join our chat box</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DetailAbout;