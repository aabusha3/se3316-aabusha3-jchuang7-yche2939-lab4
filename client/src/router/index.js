import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "about" */ '../views/SearchTrackView.vue')
  },
  {
    path: '/privacypolicy',
    name: 'privacypolicy',
    component: () => import(/* webpackChunkName: "about" */ '../views/PrivacyPolicyView.vue')
  },
  {
    path: '/aup',
    name: 'aup',
    component: () => import(/* webpackChunkName: "about" */ '../views/AUPView.vue')
  },
  {
    path: '/dmca',
    name: 'dmca',
    component: () => import(/* webpackChunkName: "about" */ '../views/DMCAView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
