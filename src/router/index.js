import { createRouter, createWebHistory } from 'vue-router';
import MovieList from '@/components/MovieList.vue';
import ActorView from '@/views/ActorView.vue';
import DirectorView from '@/views/DirectorView.vue';

const routes = [
  {
    path: '/movies',
    name: 'Movies',
    component: MovieList,
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
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
