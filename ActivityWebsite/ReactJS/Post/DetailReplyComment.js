import React, { useState, useRef } from 'react';
import moment from 'moment';


const style = {
    margin: '10px',
    marginLeft: '100px',
    background: '#dedcdc',
    padding: '1em',
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

const ReplyComment = ({ comment, commentParent, replyCommentLike, submitReplyComment }) => {

    const [isReply, setReply] = useState(false);
    const refReplyTextarea = useRef();

    return (
        <div className="comment-single comment-reply mt-4 text-justify" style={style}>
            <div className="mb-3">
                <p><i className="fa fa-reply" aria-hidden="true" />   Reply To {commentParent.Owner.Name}</p>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png" className="rounded-circle" width={40} height={40} />
            <h4 style={{ fontWeight: 'bold' }}>{comment.Owner.Name} <span style={{ color: '#6E7580', fontSize: '15px' }}>{moment(comment.CreatedAt).fromNow()}</span></h4>
            <p>{comment.Text}</p>
            <div>
                {comment.isLiked ?
                    <button type="button" className="btn btn-danger m-3" onClick={() => replyCommentLike(commentParent.Id, comment.Id, comment.isLiked)}>{comment.likes}   <i className="far fa-thumbs-up"></i>   Unlike</button>
                    : <button type="button" className="btn btn-outline-danger m-3" onClick={() => replyCommentLike(commentParent.Id, comment.Id, comment.isLiked)}>{comment.likes}  <i className="far fa-thumbs-up"></i>   Like</button>}
                <button className="btn btn-outline-primary" onClick={() => setReply(true)}><i className="fas fa-reply-all"></i>   Reply</button>
            </div>

            {isReply &&
                (
                    <div className="comment-single comment-parent mt-4 text-justify" style={style}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png" className="rounded-circle" width={40} height={40} />
                    <p><i className="fa fa-reply" aria-hidden="true" />   Reply To {comment.Owner.Name}</p>
                    <textarea ref={refReplyTextarea} style={editorReplyStyle}></textarea>
                    <div>
                        <button className="btn btn-outline-primary m-3" onClick={() => { submitReplyComment(commentParent.Id, refReplyTextarea.current.value, comment.Owner); setReply(false); }}><i className="fas fa-reply-all"></i>   Reply</button>
                            <button className="btn btn-outline-danger" onClick={() => setReply(false)}>   Cancel</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default ReplyComment;