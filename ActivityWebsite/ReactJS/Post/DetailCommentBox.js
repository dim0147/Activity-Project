import React, { Component } from 'react';

import CommentList from './DetailCommentList';
import CommentInput from './DetailCommentInput';

class CommentBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="leave-comment spad">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-10 col-md-11 col-12 pb-4">
                            <h1>Comments</h1>

                            <CommentList

                            />

                            <CommentInput 

                            />
                        </div>
                    </div>
                </div>
            </div>

        );

    };
}

export default CommentBox;