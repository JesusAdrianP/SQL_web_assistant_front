import {createStore} from 'vuex'

const store = createStore({
    state:{
        SelectModel: null,
        SelectDb: null,
    },
    mutations:{
        setSelectModel(state, model) {
            state.SelectModel = model
        },
        setSelectDb(state, db) {
            state.SelectDb = db
        }
    },
    actions: {
        updateSelectModel({ commit }, model) {
            commit('setSelectModel', model)
        },
        updateSelectDb({ commit }, db) {
            commit('setSelectDb', db)
        }
    },
    getters: {
        getSelectedModel: (state) => state.SelectModel,
        getSelectedDb: (state) => state.SelectDb,
    }
})

export default store;