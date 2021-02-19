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