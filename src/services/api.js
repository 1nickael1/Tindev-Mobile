import axios from 'axios';

const api = axios.create({
    baseURL: 'https://tindevback.herokuapp.com/'
});

export default api;