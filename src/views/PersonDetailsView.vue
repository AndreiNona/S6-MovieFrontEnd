<template>
    <v-container>
      <h1>{{ personDetails.name }}</h1>
  
      <p v-if="personDetails.birthYear">
        <strong>Birth Year:</strong> {{ personDetails.birthYear }}
      </p>
  
      <!-- Directed Section -->
      <div v-if="directedMovies.length > 0" class="section">
        <h2>Directed Movies</h2>
        <p v-if="averageRatings.averageRatingDirected && averageRatings.averageRatingDirected !== 'N/A'">
          <strong>Average Rating (Directed):</strong> {{ averageRatings.averageRatingDirected }}
        </p>
        <v-row>
          <v-col
            v-for="movie in visibleDirectedMovies"
            :key="movie.databaseId"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <MovieCard
              :title="movie.title"
              :genre="movie.genre || 'N/A'"
              :year="movie.year"
              :rating="getMovieRating(movie)"
              :poster="movie.poster || ''"
              :movieId="movie.databaseId"
            />
          </v-col>
        </v-row>
        <v-btn
          v-if="directedMovies.length > visibleDirectedMovies.length"
          text
          color="primary"
          @click="loadMoreDirectedMovies"
        >
          Load More
        </v-btn>
      </div>
  
      <!-- Starred Section -->
      <div v-if="starredMovies.length > 0" class="section">
        <h2>Starred Movies</h2>
        <p v-if="averageRatings.averageRatingStarred && averageRatings.averageRatingStarred !== 'N/A'">
          <strong>Average Rating (Starred):</strong> {{ averageRatings.averageRatingStarred }}
        </p>
        <v-row>
          <v-col
            v-for="movie in visibleStarredMovies"
            :key="movie.databaseId"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <MovieCard
              :title="movie.title"
              :genre="movie.genre || 'N/A'"
              :year="movie.year"
              :rating="getMovieRating(movie)"
              :poster="movie.poster || ''"
              :movieId="movie.databaseId"
            />
          </v-col>
        </v-row>
        <v-btn
          v-if="starredMovies.length > visibleStarredMovies.length"
          text
          color="primary"
          @click="loadMoreStarredMovies"
        >
          Load More
        </v-btn>
      </div>
    </v-container>
  </template>
  
  <script>
  import axios from "axios";
  import MovieCard from "@/components/MovieCard.vue";
  
  export default {
    name: "PersonDetailsView",
    components: { MovieCard },
    data() {
      return {
        personDetails: {},
        directedMovies: [],
        starredMovies: [],
        averageRatings: {},
        visibleDirectedMoviesCount: 4,
        visibleStarredMoviesCount: 4,
        moviesPerPage: 4,
      };
    },
    computed: {
      visibleDirectedMovies() {
        return this.directedMovies.slice(0, this.visibleDirectedMoviesCount);
      },
      visibleStarredMovies() {
        return this.starredMovies.slice(0, this.visibleStarredMoviesCount);
      },
    },
    async mounted() {
      try {
        const { id } = this.$route.params;
  
        const personResponse = await axios.get(`http://localhost:5205/api/People/${id}/role`);
        this.personDetails = personResponse.data;
  
        if (personResponse.data.directedMovies) {
          this.directedMovies = await this.fetchMovieDetails(personResponse.data.directedMovies);
        }
  
        if (personResponse.data.starredMovies) {
          this.starredMovies = await this.fetchMovieDetails(personResponse.data.starredMovies);
        }
  
        const ratingsResponse = await axios.get(`http://localhost:5205/api/People/${id}/average-ratings`);
        this.averageRatings = ratingsResponse.data;
      } catch (error) {
        console.error("Error fetching person details or movies:", error);
        alert("Failed to load person details. Please try again.");
      }
    },
    methods: {
      async fetchMovieDetails(movies) {
        try {
          const detailedMovies = await Promise.all(
            movies.map(async (movie) => {
              const response = await axios.get(`http://localhost:5205/api/movies/omdb/${movie.id}`);
              return response.data;
            })
          );
          return detailedMovies;
        } catch (error) {
          console.error("Error fetching detailed movie information:", error);
          return [];
        }
      },
      loadMoreDirectedMovies() {
        this.visibleDirectedMoviesCount += this.moviesPerPage;
      },
      loadMoreStarredMovies() {
        this.visibleStarredMoviesCount += this.moviesPerPage;
      },
      getMovieRating(movie) {
        if (movie.ratings && movie.ratings.length > 0) {
          return movie.ratings[0].value || "N/A";
        }
        return "N/A";
      },
    },
  };
  </script>
  