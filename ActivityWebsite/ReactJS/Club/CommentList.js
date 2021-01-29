import React, { useContext, useState } from 'react';

import Comment from './Comment';

import { getCommentClubDetail } from '../API/Club';

const CommentList = ({ clubId, comments, totalLeft, continueTime, loadParentComments, parentCommentLike }) => {

    const [isLoading, setLoading] = useState(false);

    const loadMoreParentComment = (e) => {
        setLoading(true);
        getCommentClubDetail(clubId, continueTime, (err, res) => {
            setLoading(false);
            if (err) return console.log(err);
            const { comments, continueTime, totalLeft } = res.data;
            loadParentComments(comments, totalLeft, continueTime);
        })
    }

    return (
        <>
            {comments.map(comment => <Comment parentCommentLike={parentCommentLike} comment={comment} key={comment.Id} />)}
            {totalLeft > 0 && !isLoading &&
                <button onClick={loadMoreParentComment} className="btn btn-large btn-block btn-primary" type="button"><i className="fas fa-comments"></i>   Load more {totalLeft} comments</button>
            }
            {isLoading && <div className="text-center"><i className="fas fa-spinner fa-spin"></i>   Loading comment...</div>}
        </>
    );
}

export default CommentList;