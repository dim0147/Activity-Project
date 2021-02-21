import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Rating from 'react-rating-stars-component';

import { getDefaultUser } from '../API/User';
import { getUserFollowingClub, HandleUserFollowClub } from '../API/Club';

const DetailAbout = ({ clubId, clubSlug, clubRate, clubOwner, clubHeaderImg, clubName, clubOperationHours, clubEstablishAt }) => {

    const [user, setUser] = useState(null);
    const [isFollow, setFollow] = useState(false);

    useEffect(() => {
        getDefaultUser((err, res) => {
            if (err) return console.log(err);
            if (!res.data.success) return;
            setUser(res.data.user);
        })
    }, [])

    useEffect(() => {
        if (!user || !user.Id) return;
        getUserFollowingClub(user.Id, clubId, (err, res) => {
            if (err) return console.log(err);
            if (!res.data.success) return;
            if (res.data.follow)
                setFollow(true);
            else
                setFollow(false);
        })

    }, [user])

    const clubFollowHandle = (e) => {
        e.preventDefault();

        HandleUserFollowClub(user.Id, clubId, !isFollow, (err, res) => {
            if (err) return console.log(err);
            if (res.data.success) setFollow(!isFollow);
        });
    }

    const Edit = () => {
        return (
            <>
                <a href={`/club/${clubSlug}/edit`} className="primary-btn mr-3">Edit Club</a>
                <a href={`/club/${clubSlug}/chatbox`} className="primary-btn">Go to chat box</a>
            </>
        )
    }

    const User = () => {
        return (
            <>
                {/* Not club owner but login*/}
                <a href="#" className="primary-btn mr-3" onClick={clubFollowHandle}>{isFollow ? "Unfollow" : "Follow"}</a>
                {isFollow && <a href={`/club/${clubSlug}/chatbox`} className="primary-btn">Join our chat box</a>}
                
            </>
        )
    }

    const loginSection = () => {
        let buttonSection;

        if (user.Id === clubOwner.Id || user.Role == 'Admin')
            buttonSection = <Edit />
        else if (user.Id !== clubOwner.Id)
            buttonSection = <User />
        return buttonSection;
    }

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
                            <Rating
                                value={clubRate}
                                edit={false}
                                size={20}
                            />
                            <p>Operation hours: {clubOperationHours}</p>
                            <p className="para-2">Establish at: {moment(clubEstablishAt).format('LL')}.</p>
                            {user ?
                                loginSection()
                                :
                                (
                                    <>
                                        {/* Not Login */}
                                        <a href="/Account/Login" className="primary-btn mr-3">Login to follow</a>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DetailAbout;