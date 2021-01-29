import React, { useState, useContext } from 'react';
import Rating from 'react-rating-stars-component';


const CommentInput = ({ submitComment, messages, setErrorInput }) => {

    const [rate, setRate] = useState();
    const [comment, setComment] = useState('');

    const ratingChanged = (rateValue) => {
        setRate(rateValue);
    }

    const submitNewComment = (e) => {
        if (!rate || !comment) return setErrorInput(["Please rate the club and comment must  not empty!"]);
        submitComment(comment, rate);
    }

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
                                                onChange={ratingChanged}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12 text-center">
                                        <textarea placeholder="Your Comment" defaultValue={""} onChange={(e) => setComment(e.target.value)} />
                                        {messages.type === 'success' && (<div className="alert alert-primary" role="alert">{messages.messages.join("\n")}</div>)}
                                        {messages.type === 'error' && (<div className="alert alert-danger" role="alert">{messages.messages.join("\n")}</div>)}

                                        {messages.type === 'loading' ? <div><i className="fas fa-spinner fa-spin"></i>   {messages.messages.join("\n")}</div> : <button type="button" className="site-btn" onClick={submitNewComment}>Post</button>}
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