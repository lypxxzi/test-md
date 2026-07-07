import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/views/Login.vue'
import Layout from '@/views/Layout.vue'
import AuctionManage from '@/views/AuctionManage.vue'
import UserManage from '@/views/UserManage.vue'
import BidRecord from '@/views/BidRecord.vue'
import SystemConfig from '@/views/SystemConfig.vue'

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
    path: '/admin',
    component: Layout,
    redirect: '/admin/auction',
    children: [
      {
        path: 'auction',
        name: 'AuctionManage',
        component: AuctionManage,
        meta: { title: '商品管理' }
      },
      {
        path: 'user',
        name: 'UserManage',
        component: UserManage,
        meta: { title: '用户管理' }
      },
      {
        path: 'record',
        name: 'BidRecord',
        component: BidRecord,
        meta: { title: '竞拍记录' }
      },
      {
        path: 'config',
        name: 'SystemConfig',
        component: SystemConfig,
        meta: { title: '系统配置' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.path !== '/login' && !authStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
