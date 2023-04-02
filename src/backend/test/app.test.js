const { describe, it, expect, test} = require('@jest/globals');
const request = require('supertest');
const app = require('../src/app');
const axios = require("../src/axios");
require('dotenv').config();

describe('GET /movies', () => {
    it('É experado que retorne uma lista de filmes encontrados', async () => {
        const response = await request(app).get('/movies?query=Harry&page=1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('results', expect.any(Array));
        expect(response.body).toHaveProperty('total_results', expect.any(Number));
        expect(response.body).toHaveProperty('total_pages', expect.any(Number));
        expect(response.body).toHaveProperty('page', expect.any(Number));
    });

    it('É experado que retorne o erro 400 por não conter a váriavel `query`', async () => {
        const response = await request(app).get('/movies?page=1');
        expect(response.status).toBe(400);
    });

    it('É experado que retorne o erro 400 por não conter a váriavel `page`', async () => {
        const response = await request(app).get('/movies?query=Harry');
        expect(response.status).toBe(400);
    });

    test('É experado que retorne o erro 429 após atingir o limite de requisições', async () => {
        for (let i = 0; i < process.env.API_LIMITER_MAX_REQUESTS; i++) {
            await request(app).get('/movies?query=Harry&page=1');
        }
        const response = await request(app).get('/movies?query=Harry&page=1');
        expect(response.status).toBe(429);
    });
});

