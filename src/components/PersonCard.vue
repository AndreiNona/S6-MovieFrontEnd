<template>
    <v-card
      class="person-card"
      outlined
      @click="flipCard"
      :class="{ flipped: flipped }"
    >
      <!-- Front Side -->
      <div class="front-side">
        <v-card-text>
          <h3 class="person-name">{{ name }}</h3>
          <p class="person-birth">Birth Year: {{ birth || "Unknown" }}</p>
        </v-card-text>
      </div>
  
      <!-- Back Side -->
      <div class="back-side">
        <v-card-text>
          <h3 class="back-title">{{ primaryRoleText }}</h3>
          <ul>
            <li v-for="(movie, index) in primaryMovies.slice(0, 3)" :key="index">
              {{ movie.title }} ({{ movie.year }})
            </li>
          </ul>
          <p v-if="secondaryMovies.length > 0" class="secondary-role-text">
            {{ secondaryRoleText }} {{ secondaryMovies[0].title }}
          </p>
        </v-card-text>
      </div>
    </v-card>
  </template>
  
  <script>
  export default {
    name: "PersonCard",
    props: {
      name: {
        type: String,
        required: true,
      },
      birth: {
        type: [Number, String],
        default: "Unknown",
      },
      personId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        flipped: false, 
        primaryRoleText: "", 
        secondaryRoleText: "", 
        primaryMovies: [], 
        secondaryMovies: [], 
      };
    },
    methods: {
      async flipCard() {
        this.flipped = !this.flipped;
        if (this.flipped && this.primaryMovies.length === 0) {
          // Fetch data only when the card flips for the first time
          await this.fetchRoleAndMovies();
        }
      },
      async fetchRoleAndMovies() {
        const baseUrl = "http://localhost:5205/api/people";
        try {
          const response = await fetch(`${baseUrl}/${this.personId}/role`);
          const data = await response.json();
  
          console.log("Role and Movies Response:", data); // Debugging
  
          // Set primary and secondary roles 
          if (data.role === "Director" && data.directedMovies.length > 0) {
            this.primaryRoleText = "Directed";
            this.primaryMovies = data.directedMovies; // Set primary movies
            if (data.starredMovies && data.starredMovies.length > 0) {
              this.secondaryRoleText = "They also starred in";
              this.secondaryMovies = data.starredMovies;
            }
          } else if (data.role === "Star" && data.starredMovies.length > 0) {
            this.primaryRoleText = "Starred in";
            this.primaryMovies = data.starredMovies; // Set primary movies
            if (data.directedMovies && data.directedMovies.length > 0) {
              this.secondaryRoleText = "They also directed";
              this.secondaryMovies = data.directedMovies;
            }
          } else {
            // No movies found 
            this.primaryRoleText = "No recent works found";
            this.primaryMovies = [];
            this.secondaryMovies = [];
          }
  
          console.log("Primary Movies:", this.primaryMovies);
          console.log("Secondary Movies:", this.secondaryMovies);
        } catch (error) {
          console.error("Error fetching role and movies:", error);
          this.primaryRoleText = "Error fetching works";
          this.primaryMovies = [];
          this.secondaryMovies = [];
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .person-card {
    margin: 10px;
    padding: 10px;
    text-align: center;
    max-width: 300px;
    height: 200px;
    cursor: pointer;
    perspective: 1000px; /* Enable 3D effect */
    transition: transform 0.6s;
  }
  
  .person-card .front-side,
  .person-card .back-side {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: transform 0.6s;
  }
  
  .person-card .front-side {
    transform: rotateY(0deg);
  }
  
  .person-card .back-side {
    transform: rotateY(180deg);
  }
  
  .person-card.flipped .front-side {
    transform: rotateY(180deg);
  }
  
  .person-card.flipped .back-side {
    transform: rotateY(0deg);
  }
  
  .back-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .secondary-role-text {
    margin-top: 10px;
    font-style: italic;
    color: gray;
  }
  </style>