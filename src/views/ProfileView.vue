<template>
  <v-container>
    <h1>Profile</h1>
    <p>Hello {{ username }}</p>

    <v-btn color="primary" @click="openCreateTopListDialog">Create Top List</v-btn>

    <!-- Loading Spinner -->
    <div v-if="isLoadingTopLists" class="loading-message">
      <LoadingRadar />
      <p>Loading your top lists...</p>
    </div>

    <!-- Top Lists -->
    <div v-else>
      <p v-if="topLists.length === 0">You have no top lists yet.</p>
      <TopLists 
        v-else 
        :topLists="topLists" 
        @remove="removeTopList" 
        @edit="editTopList" 
      />
    </div>

    <!-- Dialog for Creating Top List -->
    <v-dialog v-model="createTopListDialog" max-width="500">
      <v-card>
        <v-card-title>Create New Top List</v-card-title>
        <v-card-text>
          <v-text-field 
            v-model="newTopListName" 
            label="Top List Name" 
            outlined 
            clearable 
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="createTopList">Create</v-btn>
          <v-btn text color="error" @click="closeCreateTopListDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import TopLists from "@/components/TopLists.vue";
import LoadingRadar from "@/components/LoadingRadar.vue";
import axios from "axios";

export default {
  name: "ProfileView",
  components: {
    TopLists,
    LoadingRadar,
  },
  data() {
    return {
      username: "User", 
      topLists: [],
      isLoadingTopLists: true, 
      createTopListDialog: false, // Controls the dialog visibility
      newTopListName: "", // Stores the name for the new top list
    };
  },
  async mounted() {
    // Fetch username from the JWT token
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); 
        console.log(decodedToken)
        this.username = decodedToken.sub || "User"; 
      } catch (error) {
        console.error("Error decoding JWT token:", error);
        this.username = "User"; 
      }
    }

    // Fetch existing top lists
    try {
      const response = await axios.get("http://localhost:5205/api/toplist/my-toplists", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      this.topLists = response.data;
    } catch (error) {
      console.error("Error fetching top lists:", error);
    } finally {
      this.isLoadingTopLists = false; 
    }
  },
  methods: {
    removeTopList(index) {
      this.topLists.splice(index, 1);
    },
    editTopList(topListName) {
      console.log(`Editing top list: ${topListName}`);
    },
    openCreateTopListDialog() {
      this.createTopListDialog = true;
    },
    closeCreateTopListDialog() {
      this.createTopListDialog = false;
      this.newTopListName = ""; // Reset input field
    },
    async createTopList() {
    if (!this.newTopListName) {
      alert("Top List name cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5205/api/toplist/create",
        {
          name: this.newTopListName,
          movieIds: [], // Ensure the API receives an empty movieIds array
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      // Add the new top list with initialized properties to avoid runtime errors
      this.topLists.push({
        ...response.data,
        movieIds: response.data.movieIds || [], // Ensure movieIds is an array
        movies: [], // Prepare for fetched movie details if necessary
      });

      alert("Top List created successfully!");
      this.closeCreateTopListDialog();
    } catch (error) {
      console.error("Error creating top list:", error);
      alert("Failed to create Top List. Please try again.");
    }
  },
  },
};
</script>

<style scoped>
.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.loading-message p {
  margin-top: 10px;
  font-size: 1.2rem;
  color: gray;
}

.v-btn {
  margin-bottom: 20px;
}
</style>
