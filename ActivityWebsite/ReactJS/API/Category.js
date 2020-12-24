import axios from 'axios';

export const getAllCategory = () => {
    return new Promise((resolve, reject) => {
        axios.get('/api/category')
            .then(response => {
                if (!response.data || !response.data.categories)
                    return resolve([]);
                resolve(response.data.categories);
            })
            .catch(err => {
                reject(err);
            })
    })
}