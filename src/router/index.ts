import { createRouter, createWebHistory } from 'vue-router';
import PreviewPlatform from '../views/previewPlatform.vue';

const BASE_URL = '/';
const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PreviewPlatform,
    },
  ],
});

export default router;
