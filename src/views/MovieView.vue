
<template>
  <v-app>
    <v-container>
      <h1>Movies</h1>
      <p>This is the Movies page.</p>

      <!-- Search Form -->
      <v-row class="align-start">
        <!-- Name Search -->
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="searchQuery"
            label="Search by Name"
            outlined
            clearable
          ></v-text-field>
        </v-col>

        <!-- Year Range Picker with Button -->
        <v-col cols="12" sm="6" md="4">
          <div class="text-field-wrapper">
            <!-- Calendar Icon Button -->
            <v-btn
              icon
              class="calendar-button"
              @click="menu = true"
              aria-label="Open year picker"
            >
              <v-icon>mdi-calendar</v-icon>
            </v-btn>

            <!-- Text Field -->
            <v-text-field
              v-model="formattedYearRange"
              label="Select Year Range"
              readonly
              outlined
              clearable
              hide-details
              class="year-picker-field"
            ></v-text-field>
          </div>
        </v-col>

        <!-- Results Per Page -->
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="limit"
            label="Results Per Page"
            outlined
            clearable
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Year Picker Dialog -->
      <v-dialog v-model="menu" persistent max-width="90%">
        <template #default>
          <div class="year-picker">
            <div class="year-picker-header">
              <v-btn icon @click="scrollYears(1)">
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
              <span class="year-picker-title">
                {{ displayYearRange }}
              </span>
              <v-btn icon @click="scrollYears(-1)">
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </div>
            <div class="year-picker-body">
              <v-list>
                <v-list-item
                  v-for="year in years"
                  :key="year"
                  :class="{
                    selected: selectedYearRange.includes(year),
                    inRange: isYearInRange(year),
                  }"
                  @click="toggleYear(year)"
                >
                  {{ year }}
                </v-list-item>
              </v-list>
            </div>
            <div class="year-picker-actions">
              <v-btn text class="clear-button" @click="clearYearSelection">Clear</v-btn>
              <v-btn text class="transparent-button" @click="menu = false">Cancel</v-btn>
              <v-btn text class="transparent-button" @click="confirmYearSelection">OK</v-btn>
            </div>
          </div>
        </template>
      </v-dialog>

      <v-row>
        <v-btn color="primary" block @click="searchMovies">Search</v-btn>
      </v-row>
            <!-- Loading Indicator -->
            <LoadingRadar :loading="isLoading" />
                  <!-- Movie Cards -->
                  <v-row>
                    <v-col
                      v-for="(movie, index) in movies"
                      :key="index"
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
                    :movieId="movie.id" 
                  />
                    </v-col>
                  </v-row>
    </v-container>
  </v-app>
</template>

<script>
import LoadingRadar from "@/components/LoadingRadar.vue";
import MovieCard from "@/components/MovieCard.vue";
import axios from "axios";

export default {
  name: "MovieView",
  components: {
    LoadingRadar,
    MovieCard,
  },
  data() {
    return {
      menu: false, // Controls dialog visibility
      years: Array.from({ length: 2024 - 1900 + 1 }, (_, i) => 2024 - i), // List of years in descending order
      displayYearRange: "2024 - 1900", // Shown year range
      selectedYearRange: [], // Array for selected year range
      formattedYearRange: "", // Display formatted year range in the text field
      searchQuery: "", // Search term for movie names
      limit: 5, // Number of results per page
      isLoading: false, // Loading state
      movies: [], // Array to store returned movies
    };
  },
  methods: {
    /**
     * Fetches the first rating of a movie.
     * @param {Object} movie - The movie object.
     * @returns {String} - The movie rating or "N/A" if not available.
     */
    getMovieRating(movie) {
      if (movie.ratings && movie.ratings.length > 0) {
        return movie.ratings[0].value || "N/A"; // Use the first rating
      }
      return "N/A";
    },
    scrollYears(direction) {
      
      const offset = 10 * direction; 
      this.years = this.years.map((year) => year - offset);
      this.displayYearRange = `${this.years[0]} - ${this.years[this.years.length - 1]}`;
    },
    toggleYear(year) {
      
      if (this.selectedYearRange.includes(year)) {
        this.selectedYearRange = this.selectedYearRange.filter((y) => y !== year);
      } else {
        this.selectedYearRange = [...this.selectedYearRange, year].sort((a, b) => a - b);
      }
    },
    isYearInRange(year) {
      
      if (this.selectedYearRange.length === 2) {
        const [start, end] = this.selectedYearRange;
        return year > start && year < end;
      }
      return false;
    },
    confirmYearSelection() {
      
      if (this.selectedYearRange.length === 2) {
        this.formattedYearRange = `${this.selectedYearRange[0]} - ${this.selectedYearRange[1]}`;
      } else if (this.selectedYearRange.length === 1) {
        this.formattedYearRange = `${this.selectedYearRange[0]}`;
      } else {
        this.formattedYearRange = "";
      }
      this.menu = false; // Close the menu
    },
    clearYearSelection() {
      // Clear the selected year range
      this.selectedYearRange = [];
      this.formattedYearRange = "";
    },
    async searchMovies() {
      const baseUrl = "http://localhost:5205/api/movies";
      const includeOmdbDetails = true;
      let response;

      try {
        this.isLoading = true;

        if (this.searchQuery && this.selectedYearRange.length > 0) {
          const expandedLimit = 50;
          response = await axios.get(
            `${baseUrl}/name/${this.searchQuery}?smartSearch=true&wordComplete=true&limit=${expandedLimit}&includeOmdbDetails=${includeOmdbDetails}`
          );
          const filteredResults = this.filterMoviesByYear(response.data, this.selectedYearRange);
          this.movies = filteredResults.slice(0, this.limit).map(this.cleanMovieData);
        } else if (this.searchQuery) {
          response = await axios.get(
            `${baseUrl}/name/${this.searchQuery}?smartSearch=true&wordComplete=true&limit=${this.limit}&includeOmdbDetails=${includeOmdbDetails}`
          );
          this.movies = response.data.map(this.cleanMovieData);
        } else if (this.selectedYearRange.length > 0) {
          if (this.selectedYearRange.length === 1) {
            response = await axios.get(
              `${baseUrl}/year/${this.selectedYearRange[0]}?limit=${this.limit}&includeOmdbDetails=${includeOmdbDetails}`
            );
          } else if (this.selectedYearRange.length === 2) {
            const [start, end] = this.selectedYearRange;
            response = await axios.get(
              `${baseUrl}/range?start=${start}&end=${end}&limit=${this.limit}&includeOmdbDetails=${includeOmdbDetails}`
            );
          }
          this.movies = response.data.map(this.cleanMovieData);
        } else {
          console.log("No search criteria provided.");
        }

        if (response) {
          console.log("API Response:", response.data);
          console.log("Displayed Movies:", this.movies);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * Cleans movie data to handle missing posters and other defaults.
     * @param {Object} movie - Movie object from API.
     * @returns {Object} - Cleaned movie object.
     */
    cleanMovieData(movie) {
      return {
        ...movie,
        poster: movie.poster === "N/A" ? null : movie.poster, // Replace "N/A" with null
      };
    },
    /**
     * Filters movies by year or year range.
     * @param {Array} movies - The list of movies to filter.
     * @param {Array} selectedYearRange - The selected year(s) for filtering.
     * @returns {Array} - The filtered list of movies.
     */
    filterMoviesByYear(movies, selectedYearRange) {
      if (selectedYearRange.length === 1) {
        // Single Year
        return movies.filter((movie) => movie.year === selectedYearRange[0]);
      } else if (selectedYearRange.length === 2) {
        // Year Range
        const [start, end] = selectedYearRange;
        return movies.filter((movie) => movie.year >= start && movie.year <= end);
      }
      return movies;
    },
  },
};
</script>

<style scoped>
/* Explicitly center the dialog */
.v-overlay__content {
  position: fixed !important; /* Ensure it's fixed to the viewport */
  top: 50% !important; /* Center vertically */
  left: 50% !important; /* Center horizontally */
  transform: translate(-50%, -50%) !important; /* Perfect centering */
  margin: 0 !important; /* Remove unwanted margins */
  max-height: 80vh !important; /* Ensure it doesn't overflow vertically */
  width: 90% !important; /* Adjust width for mobile responsiveness */
  max-width: 400px !important; /* Constrain maximum width */
}

/* Wrapper to group the button and text field */
.text-field-wrapper {
  display: flex;
  align-items: center; /* Align button and text field */
}

/* Calendar Button Styling */
.calendar-button {
  border: 1px solid rgba(0, 0, 0, 0.12); /* Match the text field's outline */
  background-color: white; /* Make the button white */
  border-radius: 8px; /* Rounded edges */
  padding: 8px; /* Adjust padding */
  margin-right: 8px; /* Spacing between button and field */
  height: 56px; /* Match the height of the text field */
  width: 56px; /* Square button */
  box-shadow: none; /* Remove raised button effect */
}

/* Text Field Styling */
.year-picker-field {
  flex-grow: 1; /* Take the remaining width */
}

/* Custom Year Picker Dialog */
.year-picker {
  background-color: #f5f5f5; /* Light gray background */
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.year-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
}

.year-picker-body {
  max-height: 60vh; /* Dynamic height for mobile */
  overflow-y: scroll; /* Make scrollbar always visible */
  scrollbar-width: thin; /* Thin scrollbar for modern browsers */
}

.year-picker-body::-webkit-scrollbar {
  width: 12px; /* Wider scrollbar */
}

.year-picker-body::-webkit-scrollbar-thumb {
  background-color: #d3d3d3; /* Gray color for scrollbar */
  border-radius: 6px;
}

.year-picker-body .v-list-item {
  width: 100%; /* Make year items span the dialog width */
  padding: 12px; /* Add padding for better spacing */
  text-align: center;
  cursor: pointer;
}

.year-picker-body .v-list-item.selected {
  background-color: lightgreen; /* Light green for selected year */
  color: black;
  border-radius: 4px;
}

.year-picker-body .v-list-item.inRange {
  background-color: #d3d3d3; /* Darker gray for items in range */
}

.year-picker-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/* Clear Button */
.clear-button {
  background-color: rgba(255, 0, 0, 0.2); /* Semi-transparent red */
  color: red;
}

/* Transparent Buttons for OK and Cancel */
.transparent-button {
  background-color: transparent;
  color: blue;
}
</style>

