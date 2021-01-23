import React from 'react';

import Comment from './DetailComment';

const CommentList = () => {
    return (
        <>
            <Comment />  
            <button className="btn btn-large btn-block btn-primary" type="button"><i class="fas fa-comments"></i>   Load more...</button>
        </>
    );
}

export default CommentList;