<template>
  <v-container>
    <h1>Profile</h1>
    <p>Hello {{ username }}</p>
    
    
    
    <div v-if="isLoadingTopLists" class="loading-message">
      <LoadingRadar />
      <p>Loading your top lists...</p>
    </div>

    <div v-else>
      <p v-if="topLists.length === 0">You have no top lists yet.</p>
      <TopLists 
        v-else 
        :topLists="topLists" 
        @remove="removeTopList" 
        @edit="editTopList" 
      />
    </div>
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
    removeTopList(topListName) {
      this.topLists = this.topLists.filter((list) => list.name !== topListName);
    },
    editTopList(topListName) {
      console.log(`Editing top list: ${topListName}`);
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
</style>