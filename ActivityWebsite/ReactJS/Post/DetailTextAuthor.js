import React from 'react';
import moment from 'moment';


const DetailTextTags = ({ author }) => {
    return (
        <div className="blog__details__author">
            <div className="blog__details__author__pic">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png" alt="" />
            </div>
            <div className="blog__details__author__text">
                <h4>{author.Name}</h4>
                <p>Joined {moment(author.CreatedAt).startOf('day').fromNow()}</p>
            </div>
        </div>
    );
}

export default DetailTextTags;