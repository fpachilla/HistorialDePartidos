import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/modules/Home/views/HomeView.vue'; 
import HistorialView from '@/modules/Historial/views/HistorialView.vue';
import EquiposView from '@/modules/Equipos/views/EquiposView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView //Alternativa: component: () => import('../views/AboutView.vue')
    },
    { path: '/equipos', 
      name: 'Equipos',
      component: EquiposView 
    },
    { path: '/historial', 
      name: 'Historial',
      component: HistorialView 
    }
  ]
})

export default router
