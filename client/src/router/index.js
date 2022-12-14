import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../components/Login.vue'
import Create from '../components/Create.vue'
import Confirm from '../components/Confirm.vue'
import Confirmed from '../components/Confirmed.vue'
import UpdatePass from '../components/UpdatePass.vue'
import ChangeAccess from '../components/ChangeAccess.vue'

//routes name explains route
const routes = [
  {
    path: '/', //main
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
    name: 'search', //search
    component: () => import(/* webpackChunkName: "about" */ '../views/SearchTrackView.vue')
  },
  {
    path: '/privacypolicy',
    name: 'privacypolicy', //privacy
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
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/create',
    name: 'create',
    component: Create
  },
  {
    path: '/confirm',
    name: 'confirm',
    component: Confirm
  },
  {
    path: '/confirmed',
    name: 'confirmed',
    component: Confirmed
  },
  {
    path: '/password',
    name: 'password',
    component: UpdatePass
  },
  {
    path: '/changeAccess',
    name: 'changeAccess',
    component: ChangeAccess
  }
  ,
  {
    path: '/createdmca',
    name: 'createdmca',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateDMCAView.vue')
  }
  ,
  {
    path: '/createaup',
    name: 'createaup',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateAUPView.vue')
  }
  ,
  {
    path: '/createpp',
    name: 'createpp',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreatePPView.vue')
  },
  {
    path: '/userHomePage',
    name: 'userHomePage',
    component: () => import( '../views/UserHomePage.vue')
  },
  {
    path: '/createNewList',
    name: 'createNewList',
    component: () => import( '../views/CreateNewList.vue')
  },
  {
    path: '/publicPlaylists',
    name: 'publicPlaylists',
    component: () => import( '../views/PublicPlaylistView.vue')
  },
  {
    path: '/takedownprocedure',
    name: 'takedownprocedure',
    component: () => import( '../views/TakedownProcedureView.vue')
},
{
    path: '/review',
    name: 'reveiw',
    component: () => import( '../views/Reviews.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
