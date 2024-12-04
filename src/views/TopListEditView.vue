<template>
    <v-container>
      <h2>Edit Top List: {{ topListName }}</h2>
  
      <!-- Search Bar -->
      <v-row class="search-bar">
        <v-col cols="12" sm="8">
          <v-text-field
            v-model="searchQuery"
            label="Search Movies by Name"
            outlined
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn color="primary" block @click="searchMovies">Search</v-btn>
        </v-col>
      </v-row>
  
      <!-- Search Results -->
      <v-row>
        <v-col
          v-for="movie in searchResults"
          :key="movie.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card outlined class="movie-card">
            <v-img
              class="movie-poster"
              :src="getMoviePoster(movie)"
              alt="Movie Poster"
              contain
            ></v-img>
            <v-card-title class="movie-title">{{ movie.title }}</v-card-title>
            <v-card-subtitle>
              <strong>Year:</strong> {{ movie.year }}
            </v-card-subtitle>
            <v-card-text>
              <p v-if="movie.genre"><strong>Genre:</strong> {{ movie.genre }}</p>
              <p v-if="movie.plot"><strong>Plot:</strong> {{ movie.plot }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="success"
                block
                @click="addMovieToList(movie)"
                :disabled="movieIds.includes(movie.id)"
              >
                Add to Top List
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Top List -->
      <v-card outlined class="top-list-edit-card">
        <v-card-text>
          <ol>
            <li v-for="(movie, index) in movies" :key="index" class="movie-item">
              <!-- Movie Details -->
              <div class="movie-details">
                <!-- Movie Poster -->
                <img
                  :src="getMoviePoster(movie)"
                  alt="Movie Poster"
                  class="movie-poster"
                />
                <div class="movie-info">
                  <h3>{{ movie.title }}</h3>
                  <p v-if="movie.year"><strong>Year:</strong> {{ movie.year }}</p>
                  <p v-if="movie.genre"><strong>Genre:</strong> {{ movie.genre }}</p>
                  <p v-if="getMovieRating(movie)">
                    <strong>Rating:</strong> {{ getMovieRating(movie) }}
                  </p>
                  <p v-if="movie.plot && movie.plot !== 'N/A'">
                    <strong>Plot:</strong> {{ movie.plot }}
                  </p>
                  <p v-else>
                    <strong>Plot:</strong> We seem to be unable to find any information on this.
                  </p>
                </div>
              </div>
              <!-- Remove Button -->
              <v-btn icon color="error" @click="removeMovie(index)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </li>
          </ol>
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="confirmChanges">Confirm Changes</v-btn>
          <v-btn color="error" @click="discardChanges">Discard Changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import axios from "axios";
  import config from "@/config.js"; 
  
  export default {
    name: "TopListEditView",
    data() {
      return {
        topListName: "Unnamed List",
        movieIds: [],
        movies: [],
        searchQuery: "",
        searchResults: [],
      };
    },
    async mounted() {
      try {
        const { id } = this.$route.params;
        const baseUrl = config.apiBaseUrl;
        // Fetch top list details
        const response = await axios.get(`${baseUrl}/api/toplist/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
  
        const topList = response.data;
        this.topListName = topList.name;
        this.movieIds = topList.movieIds;
  
        // Fetch details for movies in the list
        await this.fetchMovieDetails();
      } catch (error) {
        console.error("Error fetching top list details:", error);
      }
    },
    methods: {
      async fetchMovieDetails() {
        try {
          const baseUrl = config.apiBaseUrl;
          this.movies = await Promise.all(
            this.movieIds.map(async (movieId) => {
              const response = await axios.get(`${baseUrl}/api/movies/omdb/${movieId}`);
              return response.data;
            })
          );
        } catch (error) {
          console.error("Error fetching movie details:", error);
        }
      },
      async searchMovies() {
        try {
          const baseUrl = config.apiBaseUrl;
          const response = await axios.get(
            `${baseUrl}/api/movies/name/${this.searchQuery}?smartSearch=true&wordComplete=true&limit=10&includeOmdbDetails=true`
          );
          this.searchResults = response.data;
        } catch (error) {
          console.error("Error searching movies:", error);
        }
      },
      addMovieToList(movie) {
        if (!this.movieIds.includes(movie.id)) {
          this.movies.push(movie);
          this.movieIds.push(movie.id);
        }
      },
      getMoviePoster(movie) {
        return movie.poster && movie.poster !== "N/A"
          ? movie.poster
          : "/images/noPoserAvailable.png";
      },
      getMovieRating(movie) {
        if (movie.ratings && movie.ratings.length > 0) {
          return movie.ratings[0].value;
        }
        return null;
      },
      removeMovie(index) {
        this.movies.splice(index, 1);
        this.movieIds.splice(index, 1);
      },
      async confirmChanges() {
        try {
          const { id } = this.$route.params;
          const baseUrl = config.apiBaseUrl;
          await axios.put(
            `${baseUrl}/api/toplist/${id}/update`,
            { movieIds: this.movieIds },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );
          alert("Changes saved successfully!");
          this.$router.push("/profile");
        } catch (error) {
          console.error("Error saving changes:", error);
          alert("Failed to save changes. Please try again.");
        }
      },
      discardChanges() {
        this.$router.push("/profile");
      },
    },
  };
  </script>
  
  <style scoped>
  .movie-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px;
    border-bottom: 1px solid #ccc;
    flex-wrap: wrap;
  }
  
  .movie-details {
    display: flex;
    align-items: flex-start;
    width: 80%;
  }
  
  .movie-poster {
    width: 80px;
    height: 120px;
    margin-right: 15px;
    object-fit: cover;
    border-radius: 5px;
  }
  
  .movie-info h3 {
    margin: 0;
    font-size: 1.2em;
    font-weight: bold;
  }
  
  .movie-info p {
    margin: 5px 0;
    font-size: 0.9em;
    color: #555;
  }
  
  v-btn {
    margin-left: auto;
  }
  
  .top-list-edit-card {
    padding: 15px;
  }
  
  .search-bar {
    margin-bottom: 20px;
  }
  
  .movie-card {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  .movie-card .movie-poster {
    height: 180px;
    object-fit: cover;
  }
  </style>
  