const express = require('express');
const axios = require('axios');
const redis = require('redis');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

const limiter = rateLimit({
    windowMs: process.env.API_LIMITER_MINUTES * 60 * 1000, // X minuto
    max: process.env.API_LIMITER_MAX_REQUESTS, // número máximo de solicitações permitidas dentro do período definido
});

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// Middleware de segurança do Helmet.js
app.use(helmet());

// Rota para buscar filmes na API externa com base no termo de pesquisa fornecido
app.get('/movies', limiter, async (req, res) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header('Content-Type', 'application/json');

    const { query, page } = req.query;
    const identifier = query+page;
    const cachedData = await redisClient.get(identifier);

    if (cachedData) {
        // Retorna dados do cache se existir
        console.log('Retornando dados do cache');
        return res.json(JSON.parse(cachedData));
    }

    try {
        const params = {
            api_key: process.env.THE_MOVIE_DB_API_KEY,
            language: process.env.THE_MOVIE_DB_LANG,
            query: query,
            page: page
        };

        // Faz chamada à API externa
        const response = await axios.get(process.env.THE_MOVIE_DB_BASE_URL + `search/movie`, { params });


        // Armazena dados no cache
        await redisClient.set(identifier, JSON.stringify(response.data));

        // Retorna dados da API externa
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar filmes' });
    }
});

// Inicia o servidor
app.listen(process.env.API_LIMITER_PORT, async () => {
    console.log('Servidor iniciado na porta 3000');
    await redisClient.connect();
});
