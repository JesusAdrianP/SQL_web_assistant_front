import Vue from 'vue'
import Vuex from 'vuex'
const { url } = require('../config/config.js')
const axios = require('axios')
axios.defaults.baseURL = url

Vue.use(Vuex)

const store = new Vuex.Store({
    
})