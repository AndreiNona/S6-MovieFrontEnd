<template>
    <v-container>
      <h2 class="text-h4">Movie List</h2>
      <v-list v-if="movies.length > 0">
        <v-list-item
          v-for="movie in movies"
          :key="movie.id"
        >
          <v-list-item-content>
            <v-list-item-title>{{ movie.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ movie.release_date }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
      <!-- Show placeholders if no movies are fetched -->
      <div v-else class="placeholder-container">
        <div v-for="i in 5" :key="i" class="placeholder-box"></div>
      </div>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios'; // Import axios for API requests
  
  export default {
    name: "MovieList",
    data() {
      return {
        movies: [], // The movies will be loaded here
      };
    },
    created() {
      this.fetchMovies();
    },
    methods: {
      async fetchMovies() {
        try {
          const response = await axios.get('https://api.example.com/movies'); // Replace with your API URL
          this.movies = response.data.length ? response.data : [];
        } catch (error) {
          console.error('Failed to fetch movies', error);
          this.movies = []; // Set to empty if error occurs
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .placeholder-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .placeholder-box {
    width: 100px;
    height: 150px;
    background-color: blue;
  }
  </style>
  