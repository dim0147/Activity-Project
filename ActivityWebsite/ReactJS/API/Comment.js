import axios from 'axios';

export const loadReplyComment = (commentId, continueTime = null, cb) => {
    axios({
        method: 'GET',
        url: `/api/comment/${commentId}/replies`,
        params: {
            timeContinue: continueTime ? continueTime : null
        }
    })
        .then(res => cb(null, res))
        .catch(err => cb(err, null))
}