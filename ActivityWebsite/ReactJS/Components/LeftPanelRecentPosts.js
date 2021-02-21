import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import Rating from 'react-rating-stars-component';

import { PostContext } from '../Post/Context';

import { searchPost } from '../API/Post';
const LeftPanelRecentPosts = () => {

    const { Tags } = useContext(PostContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        searchPost(null, Tags.map(tag => tag.Name), 4, (err, res) => {
            if (err) return console.log(err);
            if (!res.data.success) return;
            setPosts(res.data.posts);
        })
    }, [])

    return (
        <div className="blog__sidebar__recent">
            <h4>Relevant Posts</h4>
            {posts.map(post =>
                <div className="blog__recent__item" key={post.Id}>
                    <div className="blog__recent__item__pic">
                        <a href={`/post/${post.Slug}`}>
                            <img src={post.HeaderImg} width="100px" height="100px" alt="Post Header Image" />
                        </a>
                    </div>
                    <div className="blog__recent__item__text">
                        <a href={`/post/${post.Slug}`}><h6>{post.Title}</h6></a>
                        <Rating
                            value={post.AverageRate ? post.AverageRate : 0}
                            edit={false}
                            size={20}
                        />
                        <span>({post.TotalRate} Rating)</span>
                        <br />
                        <h6>By <a href={`/club/${post.Club.Slug}`}>{post.Club.Name}</a></h6>
                        <em>Tags: {post.Tags.map(tag => tag.Name).join(', ')}</em>
                        <br />
                        <span>{moment(post.CreatedAt).format("ll")}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LeftPanelRecentPosts;