import axios from 'axios';
  
export const getDefaultUser = cb => {
    axios({
        method: 'GET',
        url: '/api/user'
    })
        .then(res => cb(null, res))
        .catch(err => cb(err))
}


export const getCurrentUserClubs = (callback) => {
    axios({
        method: 'GET',
        url: `/api/user/clubs`
    })
        .then(res => callback(null, res))
        .catch(err => callback(err))
}

export const getCurrentUserPosts = (callback) => {
    axios({
        method: 'GET',
        url: `/api/user/posts`
    })
        .then(res => callback(null, res))
        .catch(err => callback(err))
}

export const getCurrentUserFollowing = (callback) => {
    axios({
        method: 'GET',
        url: `/api/user/following`
    })
        .then(res => callback(null, res))
        .catch(err => callback(err))
}

export const getCurrentUserReports = (callback) => {
    axios({
        method: 'GET',
        url: `/api/user/reports`
    })
        .then(res => callback(null, res))
        .catch(err => callback(err))
}