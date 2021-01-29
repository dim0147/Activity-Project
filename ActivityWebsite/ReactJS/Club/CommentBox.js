import React, { Component } from 'react';
import axios from 'axios';


import CommentList from './CommentList';
import CommentInput from './CommentInput';

import { getCommentClubDetail } from '../API/Club';


class CommentBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            totalLeft: null,
            continueTime: null,

            messageCreateComment: {
                type: null,
                messages: null
            }
        }
    }

    submitNewComment = (comment, rate) => {
        this.setState({
            messageCreateComment: {
                type: 'loading',
                messages: ['Creating comment...']
            }
        });
        axios({
            url: `/api/club/${this.props.clubId}/comment`,
            method: 'POST',
            data: {
                text: comment,
                rate
            }
        }).then(res => {
            this.setState({
                messageCreateComment: {
                    type: 'success',
                    messages: res.data.messages
                }
            });
        })
            .catch(err => this.setState({
                messageCreateComment: {
                    type: 'error',
                    messages: err.response.data.errors ? err.response.data.errors : ["Unexpected errors from server!"]
                }
            }))
    }

    setErrorInput = (errors) => {
        this.setState({
            messageCreateComment: {
                type: 'error',
                messages: errors
            }
        })
    }

    loadParentComments = (comments, totalLeft, continueTime) => {
        this.setState({
            comments: [...this.state.comments, ...comments.map(comment => {
                return comment;
            })],
            totalLeft,
            continueTime
        })
    }

    parentCommentLike = (commentId, isLiked) => {
        this.setState({
            comments: this.state.comments.map(comment => {
                if (comment.Id !== commentId) return comment;
                comment.isLiked = !isLiked;
                isLiked ? comment.likes -= 1 : comment.likes += 1;
                return comment;
            })
        })

        axios({
            method: 'POST',
            url: `/api/comment/${commentId}/like`,
            data: {
                isLike: !isLiked
            }
        })
            //.then(res => console.log(res))
            .catch(err => console.log(err));
    }

    componentDidMount() {
        getCommentClubDetail(this.props.clubId, null, (err, res) => {
            if (err) return err;
            this.setState({
                comments: res.data.comments.map(comment => {
                    return comment;
                }),
                totalLeft: res.data.totalLeft,
                continueTime: res.data.continueTime
            });
        });
    }

    render() {
        return (
            <div className="leave-comment spad">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-10 col-md-11 col-12 pb-4">
                            <h1>Comments</h1>

                            <CommentList
                                clubId={this.props.clubId}
                                comments={this.state.comments}
                                totalLeft={this.state.totalLeft}
                                continueTime={this.state.continueTime}
                                loadParentComments={this.loadParentComments}
                                parentCommentLike={this.parentCommentLike}
                            />

                            <CommentInput
                                messages={this.state.messageCreateComment}
                                setErrorInput={this.setErrorInput}
                                submitComment={this.submitNewComment}
                            />
                        </div>
                    </div>
                </div>
            </div>

        );

    };

}

export default CommentBox