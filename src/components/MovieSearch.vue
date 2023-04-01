<template>
    <div class="container">
        <h2>Pesquisar Filmes</h2>
        <form @submit.prevent="searchMovies(true)">
            <input type="text" v-model="searchTerm" placeholder="Digite um nome de filme...">
            <button type="submit">Pesquisar</button>
        </form>
        <MovieResults v-if="movies.length > 0" :movies="movies" :view-mode="viewMode" @toggle-layout="toggleLayout" @prev-page="prevPage" @next-page="nextPage" :current-page="currentPage" :total-pages="totalPages" :search-term="searchTerm" :searched="searched"/>
        <p v-else-if="searched && !findSearchResults">Nenhum filme foi encontrado.</p>
    </div>
</template>

<script>
import axios from "axios";
import MovieResults from './Movie/MovieResults.vue';

export default {
    name: 'MovieSearch',
    components: {
        MovieResults
    },
    data() {
        return {
            searchTerm: '',
            movies: [],
            findSearchResults: false,
            selectedMovie: {},
            showModal: false,
            viewMode: 'list',
            searched: false,
            currentPage: 1,
            totalPages: null,
        };
    },
    methods: {
        async searchMovies(reset = false) {
            if (reset) this.currentPage = 1;
            try {
                this.searched = true;
                this.findSearchResults = false;
                const params = {
                    query: this.searchTerm,
                    page: this.currentPage
                };
                await axios.get(
                    `http://${process.env.API_HOST}:${process.env.API_PORT}/movies`, { params }
                ).then(response => {
                    this.movies = response.data.results;
                    this.totalPages = response.data.total_pages;
                    this.findSearchResults = response.data.total_results > 0;
                });
            } catch (error) {
                console.log(error);
            }
        },
        nextPage() {
            if (this.movies.length === 0) return;
            this.currentPage++;
            this.searchMovies();
        },
        prevPage() {
            if (this.currentPage === 1) return;
            this.currentPage--;
            this.searchMovies();
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
}

</style>

