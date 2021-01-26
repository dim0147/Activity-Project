import axios from 'axios';
import qs from 'qs';

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

export const getTopPost = (cb) => {
    axios({
        method: 'GET',
        url: `/api/post/top-post`
    })
        .then(res => cb(null, res))
        .catch(err => cb(err))
}

export const searchPost = (title, tags, size, cb) => {
    axios({
        url: "/api/post/search",
        method: 'GET',
        params: {
            title,
            tags,
            size
        },
        paramsSerializer: params => {
            return qs.stringify(params)
        }
    })
        .then(res => cb(null, res))
        .catch(err => cb(err))
}