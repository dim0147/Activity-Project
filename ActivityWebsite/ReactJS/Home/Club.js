import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

export default function Club() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {

        axios('/api/post/top-post')
            .then(res => res.data)
            .then(data => setPosts(data.posts))
            .catch()

    }, []);


    return (
        <section className="upcoming-classes spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title normal-title">
                            <h2>Top Posts</h2>
                            <p>
                                Latest post with some information and nicely<br /> provide beautiful of life.
          </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {posts.map(post => (
                        <div key={post.Id} className="col-lg-4 col-md-6 col-sm-6">
                            <div className="classes__item">
                                <div className="classes__item__pic set-bg" data-setbg="/Content/Media/Images/templates/classes/classes-1.jpg">
                                    <img src={post.HeaderImg} />
                                    <span>{moment(post.CreatedAt).format('ll')}</span>
                                </div>

                                <div className="classes__item__text" style={{ marginTop: 10 }}>
                                  
                                    <h4><a href={`/post/${post.Slug}`}>{post.Title}</a></h4>
                                    <h6>{post.Owner.Name}<span>- Owner Post</span></h6>
                                    <a href={`/post/${post.Slug}`} className="class-btn">READ NOW</a>
                                </div>
                              
                            </div>
                        </div>

                    ))}

                </div>
            </div>
        </section>




    )
}