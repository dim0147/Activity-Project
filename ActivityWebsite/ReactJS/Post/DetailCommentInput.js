import React from 'react';
import Rating from 'react-rating-stars-component';

const CommentInput = () => {
    return (
        <div className="leave-comment spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="leave__comment__text">
                            <h2>Leave A Comment</h2>
                            <form action="#">
                                <div className="row">

                                    <div className="col-lg-12">
                                        <div className="leave__comment__rating">
                                            <h5>Your Rating:</h5>
                                            <Rating
                                                value={0}
                                                edit={true}
                                                size={30}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12 text-center">
                                        <textarea placeholder="Your Comment" defaultValue={""} />
                                        <button type="submit" className="site-btn">Submit</button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default CommentInput;