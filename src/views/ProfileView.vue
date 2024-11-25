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
        @delete-toplist="fetchTopLists" 
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
      createTopListDialog: false, 
      newTopListName: "", 
    };
  },
  async mounted() {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); 
        this.username = decodedToken.sub || "User"; 
      } catch (error) {
        console.error("Error decoding JWT token:", error);
        this.username = "User"; 
      }
    }

    await this.fetchTopLists();
  },
  methods: {
    async fetchTopLists() {
      try {
        this.isLoadingTopLists = true;
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
    openCreateTopListDialog() {
      this.createTopListDialog = true;
    },
    closeCreateTopListDialog() {
      this.createTopListDialog = false;
      this.newTopListName = ""; 
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
            movieIds: [], 
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        this.topLists.push({
          ...response.data,
          movieIds: response.data.movieIds || [], 
          movies: [], 
        });

        alert("Top List created successfully!");
        this.closeCreateTopListDialog();
      } catch (error) {
        console.error("Error creating top list:", error);
        alert("Failed to create Top List. Please try again.");
      }
    },
    async removeTopList(index) {
      try {
        const topList = this.topLists[index];
        const confirmDelete = confirm(`Are you sure you want to delete "${topList.name}"?`);
        if (confirmDelete) {
          await axios.delete(`http://localhost:5205/api/toplist/${topList.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          });
          this.fetchTopLists(); 
          alert("Top List deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting top list:", error);
        alert("Failed to delete Top List. Please try again.");
      }
    },
    editTopList(topListId) {
      this.$router.push({ name: "TopListEdit", params: { id: topListId } });
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
