import axios from 'axios';

export const getPostDetail = (postId) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: `/api/post/${postId}`
        })
            .then(res => res.data ? resolve(res.data) : reject('Not found post'))
            .catch(err => reject(err))
    })
}

export const getCommentPostDetail = (postId, continueTime, callback) => {
    axios({
        method: 'GET',
        url: `/api/post/${postId}/comments`,
        params: {
            continueTime
        }
    })
        .then(res => callback(null, res))
        .catch(err => callback(err))
}