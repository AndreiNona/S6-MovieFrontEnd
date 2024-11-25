<template>
    <v-container>
      <h2>Your Top Lists</h2>
      <p v-if="topLists.length === 0">You have no top lists yet.</p>
      <v-row v-else>
        <v-col
          v-for="(topList, index) in topLists"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card outlined class="top-list-card">
            <!-- Top Left X Button -->
            <v-btn
              icon
              class="delete-button"
              @click="deleteTopList(index)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
  
            <!-- Top List Name -->
            <v-card-title>{{ topList.name }}</v-card-title>
  
            <!-- Movie Posters -->
            <div class="poster-container" v-if="topList.movies && topList.movies.length > 0">
              <img
                v-for="(movie, idx) in topList.movies.slice(0, 3)"
                :key="idx"
                :src="getMoviePoster(movie)"
                alt="Movie Poster"
                class="movie-poster"
              />
            </div>
            <div v-else class="loading-placeholder">Loading posters...</div>
  
            <!-- Movie Titles -->
            <v-card-text>
              <ol>
                <li v-for="(title, idx) in topList.movieTitles" :key="idx">
                  {{ title }}
                </li>
              </ol>
              <p class="total-movies">Total Movies: {{ topList.movieIds.length }}</p>
            </v-card-text>
  
            <!-- Bottom Actions -->
            <v-card-actions class="bottom-actions">
              <v-btn text @click="navigateToEditTopList(topList)">Edit</v-btn>
              <v-btn icon @click="navigateToMovies">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    props: {
      topLists: {
        type: Array,
        required: true,
      },
    },
    methods: {
      async fetchMovieTitlesForTopLists() {
        for (const topList of this.topLists) {
          // Ensure initialization of movies and movieTitles arrays
          topList.movieTitles = [];
          topList.movies = [];
  
          for (const movieId of topList.movieIds.slice(0, 3)) {
            try {
              const response = await fetch(`http://localhost:5205/api/movies/omdb/${movieId}`);
              const data = await response.json();
              topList.movieTitles.push(data.title);
  
              
              if (data.poster && data.poster !== "N/A") {
                topList.movies.push(data);
              }
            } catch (error) {
              console.error(`Error fetching movie for ID ${movieId}:`, error);
            }
          }
  
          
          if (topList.movies.length === 0) {
            topList.movies.push({ poster: "/images/noPoserAvailable.png" });
          }
        }
        console.log("Updated Top Lists with Movie Titles:", this.topLists);
      },
      getMoviePoster(movie) {
        return movie.poster || "/images/noPoserAvailable.png";
      },
      deleteTopList(index) {
        this.$emit("delete-toplist", index);
      },
      navigateToMovies() {
        this.$router.push("/movies");
      },
      navigateToEditTopList(topList) {
        this.$router.push({
          name: "TopListEdit",
          params: {
            id: topList.id, 
          },
        });
      },
    },
    async mounted() {
      console.log("Fetching movie titles and posters for top lists...");
      await this.fetchMovieTitlesForTopLists();
    },
  };
  </script>
  
  <style scoped>
  .top-list-card {
    position: relative;
    padding: 10px;
    margin: 10px;
    max-width: 350px;
    min-height: 450px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .poster-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
    height: 200px; 
    width: 100%; 
  }
  
  .movie-poster {
    width: 100%;
    height: 100%;
    object-fit: contain; 
    position: absolute;
    animation: slide-in 0.5s ease-out forwards;
  }
  
  @keyframes slide-in {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .delete-button {
    position: absolute;
    top: 10px;
    right: 10px; 
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 10; 
  }
  
  .bottom-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .bottom-actions .v-btn:last-child {
    margin-left: auto; 
  }
  
  .total-movies {
    text-align: right;
    font-weight: bold;
  }
  
  .loading-placeholder {
    text-align: center;
    font-style: italic;
    color: gray;
  }
  </style>