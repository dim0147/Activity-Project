import React, { Component } from 'react';
import axios from 'axios';

import CommentList from './DetailCommentList';
import CommentInput from './DetailCommentInput';

import { getCommentPostDetail } from '../API/Post';
import { PostDetailContext } from './Context';

class CommentBox extends Component {

    static contextType = PostDetailContext;

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

    loadParentComments = (comments, totalLeft, continueTime) => {
        this.setState({
            comments: [...this.state.comments, ...comments.map(comment => {
                comment.repliesComment = [];
                comment.continueTime = null;
                return comment;
            })],
            totalLeft,
            continueTime
        })
    }

    submitNewComment = (comment, rate) => {
        this.setState({
            messageCreateComment: {
                type: 'loading',
                messages: ['Creating comment...']
            }
        });
        axios({
            url: `/api/post/${this.context}/comment`,
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
                    messages: err.response.data.errors
                }
            }))
    }

    submitReplyComment = (parentCommentId, commentText, owner) => {
        axios({
            url: `/api/post/${this.context}/comment`,
            method: 'POST',
            data: {
                text: commentText,
                parentComment: parentCommentId
            }
        }).then(res => {
            if (!res.data.success) return;
            const { comment } = res.data;
            const newComment = {
                Id: comment.Id,
                CreatedAt: comment.CreatedAt,
                Owner: owner,
                Rate: comment.Rate,
                Text: comment.Text,
                continueTime: null,
                likes: 0,
                replies: 0,
                repliesComment: []
            }
            this.setState({
                comments: this.state.comments.map(comment => {
                    if (comment.Id != parentCommentId) return comment;
                    comment.repliesComment = [...comment.repliesComment, newComment]
                    return comment;
                })
            })
        })
        .catch(err => console.log(err))
    }

    setErrorInput = (errors) => {
        this.setState({
            messageCreateComment: {
                type: 'error',
                messages: errors
            }
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

    setParentCommentReplies = (commentId, replies, totalLeft, continueTime) => {
        this.setState({
            comments: this.state.comments.map(comment => {
                if (comment.Id != commentId) return comment;
                comment.repliesComment = [...comment.repliesComment, ...replies];
                comment.replies = totalLeft;
                comment.continueTime = continueTime;
                return comment;
            })
        })
    }

    replyCommentLike = (parentCommentId, replyCommentId, isLiked) => {
        this.setState({
            comments: this.state.comments.map(comment => {
                // Find parent comment
                if (comment.Id !== parentCommentId) return comment;
                // Find reply comment
                comment.repliesComment = comment.repliesComment.map(reply => {
                    if (reply.Id != replyCommentId) return reply;

                    reply.isLiked = !isLiked;
                    isLiked ? reply.likes -= 1 : reply.likes += 1;
                    return reply;
                });
                return comment;
            })
        })

        axios({
            method: 'POST',
            url: `/api/comment/${replyCommentId}/like`,
            data: {
                isLike: !isLiked
            }
        })
            //.then(res => console.log(res))
            .catch(err => console.log(err));
    }

    componentDidMount() {
        getCommentPostDetail(this.context, null, (err, res) => {
            if (err) return err;
            this.setState({
                comments: res.data.comments.map(comment => {
                    comment.repliesComment = [];
                    comment.continueTime = null;
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
                                comments={this.state.comments}
                                totalLeft={this.state.totalLeft}
                                continueTime={this.state.continueTime}
                                loadParentComments={this.loadParentComments}
                                parentCommentLike={this.parentCommentLike}
                                submitReplyComment={this.submitReplyComment}
                                setParentCommentReplies={this.setParentCommentReplies}
                                replyCommentLike={this.replyCommentLike}
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

export default CommentBox;