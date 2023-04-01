const express = require('express');
const helmet = require('helmet');
const redisClient = require('./redis');
const axios = require('./axios');
const limiter = require('./rateLimit');

const app = express();

// Middleware de segurança do Helmet.js
app.use(helmet());


// Middleware para aplicar os limites de acesso, caso ativo
app.use((req, res, next) => {
    if (process.env.API_LIMITER_ENABLED) {
        limiter(req, res, next);
    } else {
        next();
    }
});

// Rota para buscar filmes na API do The Movies DB com base no termo de pesquisa fornecido
app.get('/movies', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Content-Type', 'application/json');

    const { query, page } = req.query;
    const identifier = query+page;
    const cachedData = await redisClient.get(identifier);

    // Retorna dados do cache se existir
    if (cachedData) {
        return res.json(JSON.parse(cachedData));
    }

    try {
        const params = {
            query: query,
            page: page
        };

        // Faz chamada à API do The Movies DB
        const response = await axios.get(`/search/movie`, { params });

        // Armazena dados no cache
        await redisClient.set(identifier, JSON.stringify(response.data));

        // Retorna dados da API
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar filmes' });
    }
});

// Inicia o servidor
app.listen(process.env.API_PORT, async () => {
    console.log(`Servidor iniciado na porta ${process.env.API_PORT}`);
    await redisClient.connect();
});
