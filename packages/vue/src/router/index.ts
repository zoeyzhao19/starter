import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@src/views/Home/index.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@src/views/About/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
