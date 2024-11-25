<template>
  <v-card class="movie-card" outlined>
    <!-- Poster Image -->
    <v-img
      class="movie-poster"
      :src="isValidPoster(poster) ? poster : defaultPoster"
      alt="Movie Poster"
      contain
    ></v-img>

    <!-- Movie Details -->
    <v-card-title class="movie-title">{{ title }}</v-card-title>
    <v-card-subtitle v-if="genre" class="movie-genre">Genre: {{ genre }}</v-card-subtitle>
    <v-card-text>
      <p v-if="year"><strong>Year:</strong> {{ year }}</p>
      <p v-if="rating"><strong>Rating:</strong> {{ rating }}</p>
    </v-card-text>

    <!-- Add to Top List Button -->
    <v-card-actions>
      <v-btn color="success" block @click="$emit('add-to-toplist')">
        Add to Top List
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "MovieCard",
  props: {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      default: null,
    },
    year: {
      type: Number,
      default: null,
    },
    rating: {
      type: String,
      default: null,
    },
    poster: {
      type: String,
      default: null, // Allows handling missing poster URLs
    },
  },
  computed: {
    defaultPoster() {
      return "/images/noPoserAvailable.png";
    },
  },
  methods: {
    isValidPoster(poster) {
      return poster && poster !== "N/A";
    },
  },
};
</script>

<style scoped>
.movie-card {
  width: 300px; 
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
}

.movie-poster {
  width: 100%;
  height: 200px; 
  background-color: #f5f5f5;
  object-fit: cover; 
  border-bottom: 1px solid #ddd;
}

.movie-title {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0 5px;
  text-align: center;
}

.movie-genre {
  font-size: 14px;
  color: gray;
  text-align: center;
  margin-bottom: 10px;
}

.movie-card p {
  margin: 4px 0;
  font-size: 14px;
}

v-card-actions {
  margin-top: auto;
  padding: 10px 0;
}

v-btn {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
