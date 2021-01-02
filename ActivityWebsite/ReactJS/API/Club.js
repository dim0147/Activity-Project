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