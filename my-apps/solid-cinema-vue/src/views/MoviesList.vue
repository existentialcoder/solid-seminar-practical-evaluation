<script setup lang="ts">
import { Movie } from '../utils/types';

const props = defineProps<{
    movies: Movie[]
}>();

</script>

<template>
    <div class="movies-list-container">
        <div class="movie-item" v-for="(movie, idx) in props.movies">
            {{idx + 1}}. {{ movie.name }}
        </div>
    </div>
</template>

<style lang="css" module>
.movies-list-container {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.movies-list-container .movie-item {
    text-align: left !important;
}
</style>
