<template>
    <v-container>
      <h1>{{ movieDetails.title }}</h1>
  
      <!-- Poster Section -->
      <div class="movie-poster-container">
        <img 
          v-if="movieDetails.poster && movieDetails.poster !== 'N/A'" 
          :src="movieDetails.poster" 
          alt="Movie Poster" 
          class="movie-poster"
        />
        <p v-else class="no-poster">No Poster Available</p>
      </div>
  
      <!-- General Information Section -->
      <v-card outlined class="movie-details-card">
        <v-card-title>General</v-card-title>
        <v-card-text>
          <ul class="movie-details-list">
            <li v-for="(value, key) in generalFields" :key="key">
              <strong>{{ formatFieldName(key) }}:</strong> {{ value }}
            </li>
          </ul>
        </v-card-text>
      </v-card>
  
      <!-- Production Information Section -->
      <v-card outlined class="movie-details-card">
        <v-card-title>Production</v-card-title>
        <v-card-text>
          <ul class="movie-details-list">
            <li v-for="(value, key) in productionFields" :key="key">
              <strong>{{ formatFieldName(key) }}:</strong> {{ value }}
            </li>
          </ul>
        </v-card-text>
      </v-card>
  
      <!-- Performance Information Section -->
      <v-card outlined class="movie-details-card">
        <v-card-title>Performance</v-card-title>
        <v-card-text>
          <ul class="movie-details-list">
            <li v-for="(value, key) in performanceFields" :key="key">
              <strong>{{ formatFieldName(key) }}:</strong> {{ value }}
            </li>
          </ul>
          <!-- Ratings Section -->
          <div v-if="movieDetails.ratings && movieDetails.ratings.length > 0" class="ratings-section">
            <p><strong>Ratings:</strong> {{ displayRatings }}</p>
            <p><strong>Average Rating:</strong> {{ averageRating || "N/A" }}/100</p>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
import axios from "axios";

export default {
  name: "MovieDetailsView",
  data() {
    return {
      movieDetails: {},
    };
  },
  computed: {
    generalFields() {

      const keys = ["runtime", "genre", "plot", "language", "country", "released"];
      return this.filterFields(keys);
    },
    productionFields() {
   
      const keys = ["director", "writer", "actors"];
      return this.filterFields(keys);
    },
    performanceFields() {
  
      const keys = ["boxOffice", "awards"];
      return this.filterFields(keys);
    },
    displayRatings() {
      // Format the ratings array 
      if (this.movieDetails.ratings && this.movieDetails.ratings.length > 0) {
        return this.movieDetails.ratings
          .map((rating) => `${rating.source}: ${rating.value}`)
          .join(" || ");
      }
      return null; 
    },
    averageRating() {
      // Calculate average rating if ratings are available
      if (this.movieDetails.ratings && this.movieDetails.ratings.length > 0) {
        const normalizedRatings = this.movieDetails.ratings.map((rating) => {
          const value = rating.value;
          if (value.includes("/10")) {
            return (parseFloat(value.split("/")[0]) / 10) * 100; 
          } else if (value.includes("%")) {
            return parseFloat(value); 
          } else if (value.includes("/100")) {
            return parseFloat(value); 
          }
          return 0; // Fallback for unrecognized formats
        });

        const total = normalizedRatings.reduce((sum, rating) => sum + rating, 0);
        const average = total / normalizedRatings.length;
        return average.toFixed(1); // Format to 1 decimal place
      }
      return null; // Return null if no ratings are available
    },
  },
  methods: {
    filterFields(keys) {
   
      return keys.reduce((result, key) => {
        if (this.movieDetails[key] && this.movieDetails[key] !== "N/A") {
          result[key] = this.movieDetails[key];
        }
        return result;
      }, {});
    },
    formatFieldName(fieldName) {
      // Converts field names for user view
      return fieldName
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    },
  },
  async mounted() {
    try {
      const { id } = this.$route.params;
      console.log("Fetching movie details for ID:", id);

      const response = await axios.get(`http://localhost:5205/api/movies/omdb/${id}`);
      console.log("Movie details fetched:", response.data);
      this.movieDetails = response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error.response || error);
      alert("Failed to load movie details. Please try again.");
    }
  },
};
</script>
  
  <style scoped>
  .movie-poster-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .movie-poster {
    object-fit: contain;
    max-width: 100%;
    max-height: 500px;
  }
  
  .no-poster {
    font-style: italic;
    color: gray;
    text-align: center;
  }
  
  .movie-details-card {
    padding: 15px;
  }
  
  .movie-details-list {
    list-style: none;
    padding: 0;
  }
  
  .movie-details-list li {
    margin-bottom: 10px;
  }
  
  .ratings-section p {
    margin-top: 10px;
    font-size: 1rem;
    line-height: 1.5;
  }
  </style>
  