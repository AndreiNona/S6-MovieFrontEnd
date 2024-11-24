<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app>
      <v-toolbar-title>Movie Enthusiast</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/movies" v-bind="$router-link">Movies</v-btn>
      <v-btn text to="/people" v-bind="$router-link">Talents</v-btn>
      <v-btn text to="/directors" v-bind="$router-link">Directors</v-btn>

      <!-- Login/Logout Button -->
      <v-btn v-if="!isAuthenticated" text @click="dialog = true">Login</v-btn>
      <v-btn v-else text @click="logout">Logout</v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view /> <!-- This is where the routed components will render -->
    </v-main>

    <!-- Test Protected Endpoint -->
    <v-container class="mt-5" v-if="isAuthenticated">
      <v-btn color="primary" @click="testProtectedEndpoint">
        Test Protected Endpoint
      </v-btn>
    </v-container>

    <!-- Login/Register Dialog -->
    <LoginRegister v-model="dialog" v-if="dialog" @authenticated="handleAuthenticated" />
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LoginRegister from './components/LoginRegister.vue';

export default {
  name: 'App',
  components: {
    LoginRegister,
  },
  setup() {
    // Reactive references for the app
    const isAuthenticated = ref(false);
    const dialog = ref(false);

    // API Base URL
    const apiBaseUrl = 'http://localhost:5205/api/Auth';

    // Function to handle logout
    const logout = () => {
      localStorage.removeItem('jwtToken');
      isAuthenticated.value = false;
      alert('Logged out successfully!');
    };

    // Function to handle authentication status change
    const handleAuthenticated = (token) => {
      if (token) {
        localStorage.setItem('jwtToken', token);
        isAuthenticated.value = true;
        dialog.value = false; // Close dialog after successful login/register
        alert('Logged in successfully!');
      }
    };

    // Function to test protected endpoint
    const testProtectedEndpoint = async () => {
      try {
        const token = localStorage.getItem('jwtToken'); // Retrieve token from localStorage
        const response = await axios.get(`${apiBaseUrl}/protected-endpoint`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        });
        alert(`Response: ${response.data}`); // Display response from the server
      } catch (error) {
        console.error('Error accessing protected endpoint:', error);
        alert('Failed to access the protected endpoint. Check the console for details.');
      }
    };

    // Check if the user is authenticated when the app is mounted
    onMounted(() => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        isAuthenticated.value = true;
      }
    });

    return {
      isAuthenticated,
      dialog,
      logout,
      handleAuthenticated,
      testProtectedEndpoint,
    };
  },
};
</script>

<style scoped>
/* Add styles if needed */
</style>