<template>
    <div class="container">
        <h2>Pesquisar Filmes</h2>
        <form @submit.prevent="searchMovies">
            <input type="text" v-model="searchTerm" placeholder="Digite um nome de filme...">
            <button type="submit">Pesquisar</button>
        </form>
        <div class="layout-buttons">
            <button @click="toggleLayout">
                {{ viewMode === 'list' ? 'Grid' : 'List' }}
            </button>
        </div>
        <div class="results-container">
            <div v-if="movies.length > 0">
                <h3>Resultados</h3>
                <div class="results-container">
                    <div v-if="viewMode === 'list'">
                        <ul>
                            <li v-for="movie in movies" :key="movie.id">
                                <a href="#" @click.prevent="showMovieDetails(movie)">
                                    {{ movie.title }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div v-else-if="viewMode === 'grid'" class="grid">
                        <div v-for="movie in movies" :key="movie.id">
                            <div @click.prevent="showMovieDetails(movie)">
                                <img :src="getImageUrl(movie)" alt="Movie poster" @error="setPlaceholderImage($event)">
                                <div>{{ movie.title }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="pagination">
                        <button class="prev-btn custom-btn" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
                        <button class="next-btn custom-btn" :disabled="currentPage === totalPages" @click="nextPage">Próxima</button>
                    </div>
                </div>
            </div>
            <div v-else-if="searched">
                <p>Nenhum filme foi encontrado.</p>
            </div>
            <div v-if="showModal" class="modal-container">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">{{ selectedMovie.title }}</h3>
                    <button class="modal-close-btn" @click="showModal = false">&times;</button>
                </div>
                <div class="modal-body">
                    <img :src="getImageUrl(selectedMovie)" alt="Movie poster">
                    <p class="modal-overview">{{ selectedMovie.overview }}</p>
                    <div class="modal-info">
                        <p>Lançamento: {{ selectedMovie.release_date }}</p>
                        <p class="modal-rating">Nota: {{ selectedMovie.vote_average }}</p>
                    </div>
                    <button class="modal-close-btn" @click="showModal = false">Fechar</button>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>

import axios from "axios";
export default {
    name: 'MovieSearch',
    data() {
        return {
            searchTerm: '',
            movies: [],
            selectedMovie: {},
            showModal: false,
            viewMode: 'grid',
            searched: false,
            currentPage: 1,
            totalPages: null,
        };
    },
    methods: {
        nextPage() {
            if (this.movies.length === 0) return;
            this.currentPage++;
            this.searchMovies(false);
        },
        prevPage() {
            if (this.currentPage === 1) return;
            this.currentPage--;
            this.searchMovies(false);
        },
        async searchMovies(reset = true) {
            if (reset) this.currentPage = 1;
            try {
                this.searched = true;
                const response = await axios.get(
                    `http://localhost:3000/movies?query=${this.searchTerm}&page=${this.currentPage}`
                );

                this.movies = response.data.results;
                this.totalPages = response.data.total_pages;
            } catch (error) {
                console.log(error);
            }
        },
        getImageUrl(movie) {
            return `https://image.tmdb.org/t/p/w185/${movie.poster_path}`;
        },
        showMovieDetails(movie) {
            this.selectedMovie = movie;
            this.showModal = true;
        },
        setPlaceholderImage(event) {
            event.target.src = "../assets/placeholder.png";
        },
        toggleLayout() {
            this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
        }
    },
};
</script>
<style>
/* Fontes e cores */
@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap');

:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --light-color: #f8f9fa;
    --dark-color: #343a40;
    --border-color: #dee2e6;
}

/* Estilos gerais */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    background-color: var(--light-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

h2 {
    margin: 20px 0;
    font-size: 24px;
    font-weight: 700;
    color: var(--dark-color);
    text-align: center;
}

form {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 2px solid var(--border-color);
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
    color: var(--secondary-color);
}

button[type="submit"] {
    margin-left: 10px;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    background-color: var(--primary-color);
    cursor: pointer;
    transition: background-color 0.2s ease;
}

button[type="submit"]:hover {
    background-color: #0069d9;
}

.results-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

h3 {
    margin: 20px 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--dark-color);
}

ul {
    list-style: none;
}

li {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 500;
    color: var(--secondary-color);
}

a {
    color: var(--primary-color);
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    margin-top: 20px;
}

.grid > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #fff;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
    cursor: pointer;
}

.grid > div:hover {
    transform: translateY(-5px);
}

.grid > div > img {
    width: 100%;
    height: auto;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.grid > div > div {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    cursor: pointer;
}

.grid > div > div:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.grid > div > div img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.grid > div > div div {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 10px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    transition: bottom 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

.grid > div > div:hover div {
    bottom: -50px;
    background-color: rgba(0, 0, 0, 0.9);
}

/* CSS for pagination */
.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pagination button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    border: none;
    background-color: #eee;
    color: #333;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.pagination button:hover {
    background-color: #333;
    color: #fff;
}

.pagination button.custom-btn {
    background-color: #e91e63;
    color: #fff;
}

.pagination button.custom-btn:hover {
    background-color: #fff;
    color: #e91e63;
}

.pagination button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Modal */
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    width: 90%;
    max-width: 600px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
}

.modal-close-btn {
    background-color: transparent;
    border: none;
    font-size: 28px;
    color: #333;
    cursor: pointer;
}

.modal-close-btn:hover {
    color: #666;
}

.modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-body img {
    width: 200px;
    margin-bottom: 20px;
}

.modal-overview {
    font-size: 18px;
    line-height: 1.5;
    text-align: justify;
    margin-bottom: 20px;
}

.modal-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-info p {
    margin: 0;
}

.modal-rating {
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
}

.modal-close-btn {
    background-color: #3f51b5;
    border: none;
    color: #fff;
    font-size: 18px;
    padding: 10px 20px;
    border-radius: 4px;
    margin-top: 20px;
    cursor: pointer;
}

.modal-close-btn:hover {
    background-color: #303f9f;
}

@media only screen and (max-width: 767px) {
    body {
        padding-bottom: 70px; /* ajuste a altura de acordo com a altura do seu rodapé */
    }
    .container {
        padding: 0 10px;
    }
    h2 {
        font-size: 20px;
        margin: 10px 0;
    }
    form {
        flex-direction: column;
        align-items: stretch;
    }
    input[type="text"] {
        margin-bottom: 10px;
    }
    button[type="submit"] {
        margin-left: 0;
        margin-top: 10px;
    }
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

</style>

