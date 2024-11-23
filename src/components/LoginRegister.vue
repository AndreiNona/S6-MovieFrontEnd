<template>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="title-container">
          <span class="title-text">{{ isLogin ? 'Login' : 'Register' }}</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            class="close-button"
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Username" v-model="username" />
          <v-text-field v-if="!isLogin" label="Email" v-model="email" />
          <v-text-field label="Password" v-model="password" type="password" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="isLogin ? login() : register()">
            {{ isLogin ? 'Login' : 'Register' }}
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="toggleForm">
            {{ isLogin ? 'Register?' : 'Login?' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  
  
  <script>
  import { ref, watch } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'LoginRegister',
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['update:modelValue', 'authenticated'],
    setup(props, { emit }) {
      const dialog = ref(props.modelValue);
      const isLogin = ref(true);
      const username = ref('');
      const email = ref('');
      const password = ref('');
  
      const baseUrl = 'http://localhost:5205/api/Auth';
  
      const toggleForm = () => {
        isLogin.value = !isLogin.value;
      };
  
      const login = async () => {
        try {
          const credentials = {
            username: username.value,
            password: password.value,
          };
          const response = await axios.post(`${baseUrl}/login`, credentials);
          if (response.data && response.data.token) {
            emit('authenticated', response.data.token);
          }
        } catch (error) {
          console.error('Login failed:', error);
          alert('Login failed. Please check your credentials.');
        }
      };
  
      const register = async () => {
        try {
          const registrationData = {
            username: username.value,
            email: email.value,
            password: password.value,
          };
          const response = await axios.post(`${baseUrl}/register`, registrationData);
          if (response.status === 200) {
            alert('Registration successful! You can now log in.');
            isLogin.value = true;
          }
        } catch (error) {
          console.error('Registration failed:', error);
          alert('Registration failed. Please check your inputs.');
        }
      };
  
      const closeDialog = () => {
        emit('update:modelValue', false);
      };
  
      // Watch for changes in the parent modelValue and sync dialog state
      watch(
        () => props.modelValue,
        (newVal) => {
          dialog.value = newVal;
        }
      );
  
      // Watch for changes in dialog state and emit updates to the parent
      watch(
        dialog,
        (newVal) => {
          emit('update:modelValue', newVal);
        }
      );
  
      return {
        dialog,
        isLogin,
        username,
        email,
        password,
        toggleForm,
        login,
        register,
        closeDialog,
      };
    },
  };
  </script>
  
  <style scoped>
  .title-container {
    display: flex;
    align-items: center; /* Centers the text and button vertically */
    justify-content: space-between; /* Ensures space between text and close button */
  }
  
  .title-text {
    font-size: 20px; /* Adjust font size as needed */
    font-weight: bold; /* Optional: Make the text stand out */
  }
  
  .close-button {
    background-color: gray;
    border-radius: 0; /* Square by default */
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s, border-radius 0.3s;
  }
  
  .close-button:hover {
    background-color: red;
    border-radius: 50%; /* Turn into a circle on hover */
    cursor: pointer;
  }
  </style>  