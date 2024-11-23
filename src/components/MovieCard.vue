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
      <v-card-subtitle class="movie-genre">Genre: {{ genre }}</v-card-subtitle>
      <v-card-text>
        <p><strong>Year:</strong> {{ year }}</p>
        <p><strong>Rating:</strong> {{ rating }}</p>
      </v-card-text>
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
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      rating: {
        type: String,
        required: true,
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
    width: 250px; /* Fixed card width */
    margin: 10px;
    display: flex;
    flex-direction: column;
  }
  
  .movie-poster {
    width: 100%;
    height: 150px; 
    background-color: #f5f5f5; 
    object-fit: cover; 
  }
  
  .movie-title {
    font-size: 16px;
    font-weight: bold;
    white-space: normal; 
    word-wrap: break-word; 
    margin-top: 10px;
  }
  
  .movie-genre {
    font-size: 14px;
    color: gray;
    white-space: normal; 
    word-wrap: break-word; 
  }
  
  .movie-card p {
    margin: 4px 0;
    font-size: 14px;
    white-space: normal; 
    word-wrap: break-word; 
  }
  </style>
  