<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app>
      <!-- Hamburger Icon for Navigation Drawer -->
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none" />

      <!-- Clickable Title -->
      <router-link to="/" class="title-link">
        <v-toolbar-title>Movie Enthusiast</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>

      <!-- Top Bar Buttons (Visible on Larger Screens) -->
      <v-btn class="d-none d-sm-flex" text to="/movies" v-bind="$router-link">Movies</v-btn>
      <v-btn class="d-none d-sm-flex" text to="/people" v-bind="$router-link">Talents</v-btn>
      <v-btn
        v-if="isAuthenticated"
        class="d-none d-sm-flex"
        text
        to="/profile"
        v-bind="$router-link"
      >Profile</v-btn>
      <v-btn
        v-if="!isAuthenticated"
        class="d-none d-sm-flex"
        text
        @click="dialog = true"
      >Login</v-btn>
      <v-btn
        v-else
        class="d-none d-sm-flex"
        text
        @click="logout"
      >Logout</v-btn>
    </v-app-bar>

    <!-- Navigation Drawer for Small Screens -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
    >
      <v-list>
        <v-list-item>
          <v-list-item-title>Navigation</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(item, index) in filteredMenuItems"
          :key="index"
          :to="item.route"
          v-bind="$router-link"
          @click="drawer = false"
        >
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-if="!isAuthenticated"
          @click="openLogin()"
        >
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-else
          @click="logout"
        >
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

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

    <!-- Alert Dialog -->
    <AlertDialog
      :modelValue="alertDialogVisible"
      :title="alertTitle"
      :message="alertMessage"
      @update:modelValue="alertDialogVisible = $event"
    />
  </v-app>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import LoginRegister from "./components/LoginRegister.vue";
import AlertDialog from "./components/AlertDialog.vue";

export default {
  name: "App",
  components: {
    LoginRegister,
    AlertDialog,
  },
  setup() {
    const isAuthenticated = ref(false);
    const dialog = ref(false);
    const drawer = ref(false);

  
    const alertDialogVisible = ref(false);
    const alertTitle = ref("");
    const alertMessage = ref("");

    const menuItems = [
      { label: "Movies", route: "/movies" },
      { label: "Talents", route: "/people" },
      { label: "Profile", route: "/profile", requiresAuth: true },
    ];

    // Filter menu items
    const filteredMenuItems = computed(() =>
      menuItems.filter((item) => !(item.requiresAuth && !isAuthenticated.value))
    );

    // API Base URL
    const apiBaseUrl = "http://localhost:5205/api/Auth";

    const showAlert = (title, message) => {
      alertTitle.value = title;
      alertMessage.value = message;
      alertDialogVisible.value = true;
    };

    const logout = () => {
      localStorage.removeItem("jwtToken");
      isAuthenticated.value = false;
      showAlert("Logout", "Logged out successfully!");
    };

    const handleAuthenticated = (token) => {
      if (token) {
        localStorage.setItem("jwtToken", token);
        isAuthenticated.value = true;
        dialog.value = false;
        showAlert("Login", "Logged in successfully!");
      }
    };

    const testProtectedEndpoint = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${apiBaseUrl}/protected-endpoint`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showAlert("Protected Endpoint", `Response: ${response.data}`);
      } catch (error) {
        console.error("Error accessing protected endpoint:", error);
        showAlert("Error", "Failed to access the protected endpoint.");
      }
    };

    const openLogin = () => {
      dialog.value = true;
      drawer.value = false;
    };

    onMounted(() => {
      const token = localStorage.getItem("jwtToken");
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
      alertDialogVisible,
      alertTitle,
      alertMessage,
      drawer,
      filteredMenuItems,
      openLogin,
    };
  },
};
</script>

<style scoped>
.title-link {
  text-decoration: none;
  color: inherit;
}

.v-navigation-drawer {
  background-color: #ffffff; 
}
</style>
