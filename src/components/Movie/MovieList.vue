<template>
    <ul>
        <li v-for="movie in movies" :key="movie.id">
            <a href="#" @click.prevent="$emit('show-movie-details', movie)">
                {{ movie.title }}
            </a>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'MovieList',
    props: {
        movies: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style scoped>

</style>