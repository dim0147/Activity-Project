import axios from 'axios';

export const getClubDetail = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/club/${id}`)
            .then(response => {
                if (!response.data || !response.data.club)
                    return reject(null);
                resolve(response.data.club);
            })
            .catch(error => {
                reject(error);
            })
    });
}

export const getClubOwner = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/club/${id}/owner`)
            .then(response => {
                if (!response.data || !response.data.club)
                    return reject(null);
                resolve(response.data.club);
            })
            .catch(error => {
                reject(error);
            })
    });
}

export const getUserFollowingClub = (userId, clubId, cb) => {
    axios({
        method: 'GET',
        url: `/api/club/${clubId}/following`
    })
        .then(res => cb(null, res))
        .catch(err => cb(err))
}

export const HandleUserFollowClub = (userId, clubId, isFollow, cb) => {
    axios({
        method: 'POST',
        url: `/api/club/${clubId}/following`,
        data: {
            isFollow
        }
    })
        .then(res => cb(null, res))
        .catch(err => cb(err))
}

export const getCommentClubDetail = (clubId, continueTime, callback) => {
    axios({
        method: 'GET',
        url: `/api/club/${clubId}/comments`,
        params: {
            continueTime
        }
    })
        .then(res => callback(null, res))
        .catch(err => callback(err))
}

export const getUserRoleClub = (clubId, callback) => {
    axios({
        method: 'GET',
        url: `/api/club/${clubId}/user`
    })
        .then(res => callback(null, res))
        .catch(err => callback(err))
}

export const createMessageChatbox = (clubId, message, callback) => {
    axios({
        method: 'POST',
        url: `/api/club/${clubId}/chatbox/message`,
        data: {
            message
        }
    })
    .then(res => callback(null, res))
    .catch(err => callback(err))
}

export const getClubMember = (clubId, callback) => {
    axios({
        method: 'GET',
        url: `/api/club/${clubId}/members`
    })
        .then(res => callback(null, res))
        .catch(err => callback(err))
}

export const getClubMessages = (clubId, continueTime, callback) => {
    axios({
        method: 'GET',
        url: `/api/club/${clubId}/chatbox/message`,
        params: {
            continueTime
        }
    })
        .then(res => callback(null, res))
        .catch(err => callback(err))
}