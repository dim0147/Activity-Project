import React from 'react';
import Rating from 'react-rating-stars-component';
import moment from 'moment';

const style = {
    background: '#e8e8e8',
    padding: '1em',
    margin: '10px'
}

const CommentParent = ({ comment, parentCommentLike }) => {

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
                </div>
            </div>

        </div>
    );
}

export default CommentParent;