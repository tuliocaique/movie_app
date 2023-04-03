const express = require('express');
const helmet = require('helmet');
const redisClient = require('./redis');
const axios = require('./axios');
const limiter = require('./rateLimit');

const app = express();

// Middleware de segurança
app.use(helmet());


// Middleware para aplicar os limites de acesso, caso ativo
app.use(limiter);

// Rota para buscar filmes na API do The Movies DB com base no termo de pesquisa fornecido
app.get('/movies', async (req, res) => {

    if (!req.query.query) {
        return res.status(400).json({ error: 'O parâmetro "query" é obrigatório', status: 400 });
    }
    if (!req.query.page) {
        return res.status(400).json({ error: 'O parâmetro "page" é obrigatório', status: 400 });
    }

    const { query, page } = req.query;
    const identifier = query+page;
    const cachedData = await redisClient.get(identifier);

    res.header("Access-Control-Allow-Origin", "*");
    res.header('Content-Type', 'application/json');

    // Retorna dados do cache se existir
    if (cachedData) {
        console.log('Retornando dados do cache');
        return res.json(JSON.parse(cachedData));
    }

    try {
        const params = {
            query: query,
            page: page
        };

        // Faz chamada à API do The Movies DB
        const response = await axios.get(`/search/movie`, { params });
        let data = response.data;

        let movies = [];
        if (data.total_results > 0) {
            data.results.forEach(movie => {
                let releaseDate = null;
                if (movie.release_date) {
                    const [year, month, day] = movie.release_date.split('-');
                    releaseDate = `${day}/${month}/${year}`;
                }

                movies.push({
                    poster_path: movie.poster_path,
                    original_title: movie.original_title,
                    title: movie.title,
                    overview: movie.overview,
                    vote_average: movie.vote_average,
                    release_date: releaseDate,
                });
            });
        }

        let content = {
            total_results: data.total_results,
            total_pages: data.total_pages,
            page: data.page,
            results: movies
        }

        // Armazena dados no cache
        await redisClient.set(identifier, JSON.stringify(content));

        // Retorna dados da API
        console.log('Retornando dados da API');
        return res.json(content);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar filmes', status: 500 });
    }
});

// Inicia o servidor
let server = app.listen(process.env.API_PORT, async () => {
    console.log(`Servidor iniciado na porta ${process.env.API_PORT}`);
    try {
        console.log('Conectando ao Redis');
        await redisClient.connect();
    } catch (error) {
        console.log('Erro ao conectar ao Redis');
        process.exit(0);
    }
});

process.on('SIGINT', () => {
    console.log('Encerrando servidor');
    server.close(() => {
        console.log('Servidor encerrado');
        process.exit(0);
    });
});

module.exports = app;