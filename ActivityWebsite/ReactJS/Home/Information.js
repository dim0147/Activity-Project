import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Information() {

    const [info, setInfo] = useState(null);

    useEffect(() => {
        axios.get('/api/info/homepage')
            .then(res => res.data)
            .then(data => data ? setInfo(data) : null)
            .catch();
    }, [])


    return (
        <section className="chooseus spad" id="why_choose_us">
            <div className="container">
                <div className="row">
                    {info !== null
                        ?
                        <>
                            <div className="col-lg-6">
                                <div className="chooseus__text">
                                    <h2>Why Choose Us</h2>
                                    <p>
                                        We are supplying internationally certified Design Clubs in many places and proven. Join us for such life-changing experiences in the Club's World Capital.
          </p>
                                </div>
                                <div className="chooseus__item">
                                    <div className="chooseus__item__icon">
                                        <img src="/Content/Media/Images/templates/chooseus/choose-1.png" alt="" />
                                    </div>
                                    <div className="chooseus__item__text">
                                        <h2 className="choose-counter">{info.totalUser}</h2>
                                        <p>Users</p>
                                    </div>
                                </div>
                                <div className="chooseus__item">
                                    <div className="chooseus__item__icon">
                                        <img src="/Content/Media/Images/templates/chooseus/choose-2.png" alt="" />
                                    </div>
                                    <div className="chooseus__item__text">
                                        <h2 className="choose-counter">{info.totalClub}</h2>
                                        <p>Clubs</p>
                                    </div>
                                </div>
                                <div className="chooseus__item">
                                    <div className="chooseus__item__icon">
                                        <img src="/Content/Media/Images/templates/chooseus/choose-3.png" alt="" />
                                    </div>
                                    <div className="chooseus__item__text">
                                        <h2 className="choose-counter">{info.totalPost}</h2>
                                        <p>Posts</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="chooseus__pic">
                                    <img src="/Content/Media/Images/templates/chooseus/choose-pic.jpg" alt="" />
                                </div>
                            </div>
                        </>
                        :
                        <div class="text-center">
                            Loading
                        </div>
                    }
                </div>
            </div>
        </section>



    )
}