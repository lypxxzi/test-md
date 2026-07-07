import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Auction from '../views/Auction.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/auction',
    name: 'Auction',
    component: Auction
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
