// import Vue from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/Inicio.vue'
import ChatView from '../views/ChatView.vue'
import DatabaseConnection from '../views/DatabaseConnection.vue'
import SelectModel from '../views/SelectModel.vue'

const routes = [
  {
    path: '/',
    name: 'InicioView',
    component: InicioView
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
