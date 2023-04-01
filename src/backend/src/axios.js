const axios = require('axios');
require('dotenv').config();

const instance = axios.create({
    baseURL: process.env.THE_MOVIE_DB_BASE_URL,
    params: {
        api_key: process.env.THE_MOVIE_DB_API_KEY,
        language: process.env.THE_MOVIE_DB_LANG
    }
});

module.exports = instance;
