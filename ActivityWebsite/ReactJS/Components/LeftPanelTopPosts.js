import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Rating from 'react-rating-stars-component';

import { getTopPost } from '../API/Post';

const LeftPanelCategories = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getTopPost((err, res) => {
            if (err) return console.log(err);
            if (!res.data.success) return;
            setPosts(res.data.posts);

        })
    }, [])

    return (
        <div className="blog__sidebar__recent">
            <h4>Top Posts</h4>
            {posts.map(post =>
                <div className="blog__recent__item" key={post.Id}>
                    <div className="blog__recent__item__pic">
                        <a href={`/post/detail/${post.Id}`}>
                            <img src={post.HeaderImg} width="100px" height="100px" alt="Post Header Image" />
                        </a>
                    </div>
                    <div className="blog__recent__item__text">
                        <a href={`/post/detail/${post.Id}`}><h6>{post.Title}</h6></a>
                        <Rating
                            value={post.AverageRate ? post.AverageRate : 0}
                            edit={false}
                            size={20}
                        />
                        <span>({post.TotalRate} Rating)</span>
                        <br />
                        <h6>By <a href={`/club/detail/${post.Club.Id}`}>{post.Club.Name}</a></h6>
                        <em>Tags: {post.Tags.map(tag => tag.Name).join(', ')}</em>
                        <br />
                        <span>{moment(post.CreatedAt).format("ddd MMMM, YYYY")}</span>
                    </div>
                </div>
            )}

        </div>
    );
}

export default LeftPanelCategories;