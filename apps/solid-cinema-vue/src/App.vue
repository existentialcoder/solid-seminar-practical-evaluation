<script setup lang="ts">
import { ref, onMounted } from "vue";

import { solidLogin, solidLogout, handleRedirect, loadMovies } from "./utils/solid";
import type { Movie } from "./utils/types";
import config from "./utils/config";
import MoviesList from "./views/MoviesList.vue";

const loggedIn = ref(false);
const podUrl = ref("");
const movies = ref<Movie[]>([]);
const newMovie = ref("");
const isLoading = ref(false);
const dataInitiallyLoaded = ref(false)


onMounted(async () => {
  loggedIn.value = await handleRedirect();
});

async function loadAndSetMovies() {
  isLoading.value = true;
  const allMovies = await loadMovies(podUrl.value);
  debugger;
  isLoading.value = false;
  dataInitiallyLoaded.value = true
  movies.value = allMovies;
}

</script>

<template>
  <div class="app-container">
    <div class="logout-btn" v-if="loggedIn">
      <button @click="solidLogout()">Logout</button>
    </div>
    <h1>🎦 Solid Cinema</h1>
    <div>
      <div v-if="!loggedIn">
        <button @click="solidLogin(config.SOLID_AUTH_URL)">Login with Solid</button>
      </div>

      <div v-else>
        <template v-if="dataInitiallyLoaded">
          <MoviesList :movies="movies" />
        </template>

        <template v-else>
          <input v-model="podUrl" placeholder="Enter POD root (e.g., https://solidcommunity.net/user123)"
            style="width:100%;margin-top:10px;" />
          <button @click="loadAndSetMovies" style="margin-top:10px;">
            Load Movies
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="css">
.app-container .logout-btn {
  position: absolute;
  right: 5px;
  top: 5px;
}
</style>
