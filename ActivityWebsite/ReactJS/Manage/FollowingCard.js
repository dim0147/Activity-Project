import React, { useState } from 'react'
import moment from 'moment'

import { HandleUserFollowClub } from '../API/Club';

export default function FollowingCard({ follow }) {
    const [isFollow, setFollow] = useState(follow.isFollow);

    const clubFollowHandle = (e) => {
        e.preventDefault();
        const clubId = follow.Club.Id;
        const userId = follow.Owner;

        HandleUserFollowClub(userId, clubId, !isFollow, (err, res) => {
            if (err) return console.log(err);
            if (res.data.success) setFollow(!isFollow);
        });
    }

    return (
        <div className="col-lg-6 col-sm-6">
            <div className="blog__item">
                <div className="blog__item__pic">
                    <img src={follow.Club.Image} alt={`${follow.Club.Name} Image`} />
                </div>
                <div className="blog__item__text">
                    <ul>
                        <li><i className="fa fa-calendar-o" />Follow {moment(follow.CreatedAt).fromNow()}</li>
                    </ul>
                    <h5><a href={`/club/${follow.Club.Slug}`}>{follow.Club.Name}</a></h5>
                    <p>Establish at {moment(follow.Club.EstablishedAt).format("MMM Do, YYYY")}</p>
                    {isFollow ? <a href="#" onClick={clubFollowHandle} className="primary-btn">UNFOLLOW</a> : <a href="#" onClick={clubFollowHandle} className="primary-btn">FOLLOW</a>}
                </div>
            </div>
        </div>    
    )
}