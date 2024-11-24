import { createRouter, createWebHistory } from 'vue-router';
import LoginRegister from '@/components/LoginRegister.vue';
import PeopleView from '@/views/PeopleView.vue';
import DirectorView from '@/views/DirectorView.vue';
import MovieView from '@/views/MovieView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LoginRegister, // Home page for login/register
  },
  {
    path: '/movies',
    name: 'Movies',
    component: MovieView, // Movie search and list
  },
  {
    path: '/people',
    name: 'People',
    component: PeopleView, // People search and list (was ActorView)
  },
  {
    path: '/directors',
    name: 'Directors',
    component: DirectorView, // Director-related features
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
