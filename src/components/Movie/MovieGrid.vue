<template>
    <div v-for="movie in movies" :key="movie.id">
        <div @click="$emit('show-movie-details', movie)">
            <img :src="getImageUrl(movie)" alt="Movie poster">
            <div>{{ movie.title }}</div>
        </div>
    </div>
</template>

<script>
import placeholder from '@/assets/placeholder.jpeg';
export default {
    name: "MovieGrid",
    props: {
        movies: {
            type: Array,
            required: true,
        },
    },
    methods: {
        showMovieDetails(movie) {
            this.$emit("show-movie-details", movie);
        },
        getImageUrl(movie) {
            if (movie.poster_path) {
                return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            }
            return placeholder;
        },
    },
}
</script>

<style>
.grid > div {
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
</style>