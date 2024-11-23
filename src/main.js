import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Vuetify's core styles
import '@mdi/font/css/materialdesignicons.css'; // Material Design Icons
import * as components from 'vuetify/components'; // Import all Vuetify components
import * as directives from 'vuetify/directives'; // Import all Vuetify directives

import router from './router'; // Vue Router setup

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
});

// Create Vue app instance
const app = createApp(App);

app.use(vuetify); // Use Vuetify
app.use(router);  // Use Vue Router
app.mount('#app'); // Mount app