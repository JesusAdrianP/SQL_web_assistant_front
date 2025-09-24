// import Vue from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/Inicio.vue'
import ChatView from '../views/ChatView.vue'
import DatabaseConnection from '../views/DatabaseConnection.vue'
import SelectModel from '../views/SelectModel.vue'
import SignUp from '../views/SignUp.vue'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import DatabasesView from '@/views/DatabasesView.vue'
import QueriesView from '@/views/QueriesView.vue'

const routes = [
  {
    path: '/',
    name: 'InicioView',
    component: InicioView
  },
  {
    path: '/home',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/chat',
    name: 'ChatView',
    component: ChatView
  },
  {
    path: '/db_connection',
    name: 'DatabaseConnection',
    component: DatabaseConnection
  },
  {
    path: '/select_model',
    name: 'SelectModel',
    component: SelectModel
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/databases',
    name: 'DatabasesView',
    component: DatabasesView
  },
  {
    path: '/queries',
    name: 'QueriesView',
    component: QueriesView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
