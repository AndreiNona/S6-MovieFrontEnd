import { createRouter, createWebHistory } from 'vue-router';
//import MovieList from '@/components/MovieList.vue';
import LoginRegister from '@/components/LoginRegister.vue';
import ActorView from '@/views/ActorView.vue';
import DirectorView from '@/views/DirectorView.vue';
import MovieView from '@/views/MovieView.vue';



const routes = [
  {
    path: '/',
    name: 'Home',
    component: LoginRegister,  // Add the Login/Register view as the home page
  },
  {
    path: '/movies',
    name: 'Movies',
    component: MovieView,
  },
  {
    path: '/actors',
    name: 'Actors',
    component: ActorView,
  },
  {
    path: '/directors',
    name: 'Directors',
    component: DirectorView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
