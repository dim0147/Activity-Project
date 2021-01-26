import React, { useState, useRef } from 'react';
import Rating from 'react-rating-stars-component';
import moment from 'moment';

import ReplyComment from './DetailReplyComment';

import { loadReplyComment } from '../API/Comment';

const style = {
    background: '#e8e8e8',
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

const CommentParent = ({ comment, parentCommentLike, setParentCommentReplies, submitReplyComment, replyCommentLike }) => {

    const [isReply, setReply] = useState(false);
    const refReplyTextarea = useRef();

    const replyCommentHandle = (e) => {
        loadReplyComment(comment.Id, comment.continueTime, (err, res) => {
            if (err) return;
            if (!res.data.success) return;
            const { data, continueTime, totalLeft } = res.data.replies;
            setParentCommentReplies(comment.Id, data, totalLeft, continueTime);
        })
    }

    return (
        <div>
            <div className="comment-single comment-parent mt-4 text-justify" style={style}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png" className="rounded-circle" width={40} height={40} />
                <h4 style={{ fontWeight: 'bold' }}>{comment.Owner.Name} <span style={{ color: '#6E7580', fontSize: '15px' }}>{moment(comment.CreatedAt).fromNow()}</span></h4>
                <Rating
                    value={comment.Rate}
                    edit={false}
                    size={20}
                />
                <p>{comment.Text}</p>
                <div>
                    {comment.isLiked ?
                        <button type="button" className="btn btn-danger m-3" onClick={() => parentCommentLike(comment.Id, comment.isLiked)}>{comment.likes}   <i className="far fa-thumbs-up"></i>   Unlike</button>
                        : <button type="button" className="btn btn-outline-danger m-3" onClick={() => parentCommentLike(comment.Id, comment.isLiked)}>{comment.likes}  <i className="far fa-thumbs-up"></i>   Like</button>}
                    <button className="btn btn-outline-primary" onClick={() => setReply(true)}><i className="fas fa-reply-all"></i>   Reply</button>
                </div>
            </div>

            {isReply &&
                (
                    <div className="comment-single comment-parent mt-4 text-justify" style={style}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png" className="rounded-circle" width={40} height={40} />
                        <p><i className="fa fa-reply" aria-hidden="true" />   Reply To Jhon Doe</p>
                        <textarea ref={refReplyTextarea} style={editorReplyStyle}></textarea>
                        <div>
                        <button className="btn btn-outline-primary m-3" onClick={() => { submitReplyComment(comment.Id, refReplyTextarea.current.value, comment.Owner); setReply(false); }}><i className="fas fa-reply-all"></i>   Reply</button>
                            <button className="btn btn-outline-danger" onClick={() => setReply(false)}>   Cancel</button>
                        </div>
                    </div>
                )
            }

            {}
            <div className="list-reply-comment">
                {
                    comment.repliesComment.map(replyComment => <ReplyComment key={replyComment.Id} submitReplyComment={submitReplyComment} replyCommentLike={replyCommentLike} comment={replyComment} commentParent={comment} />)
                }
            </div>

            { comment.replies > 0 &&
                <div className="load-more m-3 text-center">
                    <button className="btn btn-info" onClick={replyCommentHandle} type="button"><i className="fas fa-reply-all"></i>   Load more {comment.replies} replies for this comment</button>
                </div>
            }
        </div>
    );
}

export default CommentParent;