<template>
    <div class="layout-container">
        <div class="layout-info-search">
            <h4>Mostrando resultados para "{{ searchTerm }}"</h4>
            <h6>Página {{currentPage}} de {{totalPages}}</h6>
        </div>
        <div class="layout-buttons">
            <button @click="$emit('toggle-layout')">
                <font-awesome-icon :icon="['fas', 'grip']" v-if="viewMode === 'list'"/>
                <font-awesome-icon :icon="['fas', 'list']" v-if="viewMode === 'grid'"/>
            </button>
        </div>
    </div>
    <div class="results-container">
        <div v-if="viewMode === 'list'">
            <MovieList :movies="movies" @show-movie-details="showMovieDetails" />
        </div>
        <div v-else-if="viewMode === 'grid'" class="grid">
            <MovieGrid :movies="movies" @show-movie-details="showMovieDetails" />
        </div>
        <div class="pagination">
            <button class="prev-btn custom-btn" :disabled="currentPage === 1" @click="$emit('prev-page')"><font-awesome-icon :icon="['fas', 'angle-left']" /> Anterior</button>
            <button class="next-btn custom-btn" :disabled="currentPage === totalPages" @click="$emit('next-page')">Próxima <font-awesome-icon :icon="['fas', 'angle-right']" /></button>
        </div>
        <MovieModal v-if="showModal" :selected-movie="selectedMovie" :movie="selectedMovie" @close-modal="showModal = false" />
    </div>
</template>

<script>
import MovieList from './MovieList.vue';
import MovieGrid from './MovieGrid.vue';
import MovieModal from './MovieModal.vue';

export default {
    name: 'MovieResults',
    components: {
        MovieList,
        MovieGrid,
        MovieModal,
    },
    props: {
        movies: {
            type: Array,
            required: true,
        },
        viewMode: {
            type: String,
            required: true,
        },
        currentPage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
        searched: {
            type: Boolean,
            required: true,
        },
        searchTerm: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            selectedMovie: {},
            showModal: false,
        };
    },
    methods: {
        showMovieDetails(movie) {
            this.selectedMovie = movie;
            this.showModal = true;
        },
    },
};
</script>

<style>
.results-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.layout-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    margin-top: 20px;
}

@media only screen and (max-width: 767px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

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
</style>