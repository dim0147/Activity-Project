import React, { useContext, useState } from 'react';

import Comment from './DetailComment';

import { getCommentPostDetail } from '../API/Post';
import { PostDetailContext } from './Context';

const CommentList = ({ comments, totalLeft, continueTime, loadParentComments, parentCommentLike, submitReplyComment, setParentCommentReplies, replyCommentLike }) => {

    const postId = useContext(PostDetailContext);
    const [isLoading, setLoading] = useState(false);

    const loadMoreParentComment = (e) => {
        setLoading(true);
        getCommentPostDetail(postId, continueTime, (err, res) => {
            setLoading(false);
            if (err) return console.log(err);
            const { comments, continueTime, totalLeft } = res.data;
            loadParentComments(comments, totalLeft, continueTime);
        })
    } 

    return (
        <>
            {comments.map(comment => <Comment replyCommentLike={replyCommentLike} setParentCommentReplies={setParentCommentReplies} submitReplyComment={submitReplyComment} parentCommentLike={parentCommentLike} comment={comment} key={comment.Id} />)}
            {totalLeft > 0 && !isLoading &&
                <button onClick={loadMoreParentComment} className="btn btn-large btn-block btn-primary" type="button"><i className="fas fa-comments"></i>   Load more {totalLeft} comments</button>
            }
            {isLoading && <div className="text-center"><i className="fas fa-spinner fa-spin"></i>   Loading comment...</div>}
        </>
    );
}

export default CommentList;