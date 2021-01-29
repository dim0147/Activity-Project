import axios from 'axios';
  
export const getDefaultUser = cb => {
    axios({
        method: 'GET',
        url: '/api/user'
    })
        .then(res => cb(null, res))
        .catch(err => cb(err))
}