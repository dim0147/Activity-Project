import React from 'react';
import moment from 'moment';

const DetailPost = ({ posts }) => {
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

                    {posts.map(post => {
                        return (<div className="col-lg-4 col-md-6 col-sm-6" key={post.Id}>
                            <div className="classes__item">
                                <div className="classes__item__pic set-bg" style={{ backgroundImage: `url("${post.HeaderImg}")` }} data-setbg={post.HeaderImg}>
                                    <span>{moment(post.CreatedAt).format("MMM DD, YYYY")}</span>
                                </div>
                                <div className="classes__item__text">
                                    <p>{post.Tags.map(tag => tag.Name).join(', ')}</p>
                                    <h4><a href={`/post/${post.Slug}`}>{post.Title}</a></h4>
                                    <h6>Author: <span> {post.Owner.Name}</span></h6>
                                    <a href={`/post/${post.Slug}`} className="class-btn">Read More</a>
                                </div>
                            </div>
                        </div>)
                    })}
                 


                </div>
            </div>
        </section>
    )
}

export default DetailPost;