<template>
  <v-card class="movie-card" outlined>
    <!-- Poster Image (Clickable for Movie Details) -->
    <router-link
      :to="{ name: 'MovieDetails', params: { id: movieId } }"
      class="movie-poster-link"
    >
      <v-img
        class="movie-poster"
        :src="isValidPoster(poster) ? poster : defaultPoster"
        alt="Movie Poster"
        contain
      ></v-img>
    </router-link>

    <!-- Movie Details -->
    <v-card-title class="movie-title">{{ title }}</v-card-title>
    <v-card-subtitle v-if="genre" class="movie-genre">Genre: {{ genre }}</v-card-subtitle>
    <v-card-text>
      <p v-if="year"><strong>Year:</strong> {{ year }}</p>
      <p v-if="rating"><strong>Rating:</strong> {{ rating }}</p>
    </v-card-text>

    <!-- Add to Top List Button -->
    <v-card-actions>
      <v-btn
        color="success"
        block
        @click.stop="fetchUserTopLists"
      >
        Add to Top List
      </v-btn>
    </v-card-actions>

    <!-- Dialog for Selecting Top List -->
    <v-dialog v-model="topListDialog" max-width="400">
      <v-card>
        <v-card-title>Select a Top List</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="topList in userTopLists"
              :key="topList.id"
              @click.stop="addMovieToTopList(topList)"
              class="top-list-item"
            >
              {{ topList.name }}
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="error" @click="topListDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";

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
      default: null,
    },
    movieId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      topListDialog: false,
      userTopLists: [],
    };
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
    async fetchUserTopLists() {
      try {
        const response = await axios.get("http://localhost:5205/api/toplist/my-toplists", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        this.userTopLists = response.data;
        this.topListDialog = true; // Open the dialog
      } catch (error) {
        console.error("Error fetching user top lists:", error);
        alert("Failed to load top lists. Please try again.");
      }
    },
    async addMovieToTopList(topList) {
     
      if (topList.movieIds.includes(this.movieId)) {
        alert(`"${this.title}" is already in "${topList.name}"`);
        return;
      }

      try {
        await axios.put(
          `http://localhost:5205/api/toplist/${topList.id}/update`,
          {
            movieIds: [...topList.movieIds, this.movieId],
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        alert(`"${this.title}" added to "${topList.name}" successfully!`);
        this.topListDialog = false;
      } catch (error) {
        console.error("Error adding movie to top list:", error);
        alert("Failed to add movie to top list. Please try again.");
      }
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

.movie-poster-link {
  text-decoration: none;
  display: block;
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
  white-space: normal; 
}

.movie-genre {
  font-size: 14px;
  color: gray;
  text-align: center;
  margin-bottom: 10px;
}

.card-actions {
  margin-top: auto;
}

v-btn {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
