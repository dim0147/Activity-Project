import React, { useState } from 'react';
import Rating from 'react-rating-stars-component';

import ReplyComment from './DetailReplyComment';

const style = {
    background: '#c0c1c4',
    padding: '1em',
    margin: '10px'
}

const editorReplyStyle = {
    width: '100%',
    height: '100px',
    fontSize: '16px',
    color: '#6E7580',
    paddingLeft: '28px',
    paddingTop: '15px',
    borderradius: '2px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    marginBottom: '34px'
}

const CommentParent = () => {

    const [isReply, setReply] = useState(false);

    return (
        <div>
            <div className="comment-single comment-parent mt-4 text-justify" style={style}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1024px-Crystal_Clear_kdm_user_female.svg.png" className="rounded-circle" width={40} height={40} />
                <h4 style={{ fontWeight: 'bold' }}>Jhon Doe <span style={{ color: '#6E7580', fontSize: '15px' }}>20 October, 2018</span></h4>
                <Rating
                    value={3}
                    edit={false}
                    size={20}
                />
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus numquam assumenda hic aliquam vero sequi velit molestias doloremque molestiae dicta?</p>
                <div>
                    <button className="btn btn-outline-danger m-3">23   <i className="far fa-thumbs-up"></i>   Like</button>
                    <button className="btn btn-outline-primary" onClick={() => setReply(true)}><i className="fas fa-reply-all"></i>   Reply</button>
                </div>
            </div>

            {isReply &&
                (
                    <div className="comment-single comment-parent mt-4 text-justify" style={style}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Crystal_Clear_kdm_user_female.svg/1024px-Crystal_Clear_kdm_user_female.svg.png" className="rounded-circle" width={40} height={40} />
                        <p><i className="fa fa-reply" aria-hidden="true" />   Reply To Jhon Doe</p>
                        <textarea style={editorReplyStyle}></textarea>
                        <div>
                        <button className="btn btn-outline-primary m-3"><i className="fas fa-reply-all"></i>   Reply</button>
                        <button className="btn btn-outline-danger" onClick={() => setReply(false)}>   Cancel</button>
                        </div>
                    </div>
                )
            }

            <div className="list-reply-comment">
                <ReplyComment />
                <ReplyComment />
            </div>

            <div className="load-more m-3 text-center">
                <button className="btn btn-info" type="button"><i className="fas fa-reply-all"></i>   Load more for this reply</button>
            </div>
        </div>
    );
}

export default CommentParent;