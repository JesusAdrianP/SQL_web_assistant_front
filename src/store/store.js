import {createStore} from 'vuex'

const store = createStore({
    state:{
        SelectModel: null,
    },
    mutations:{
        setSelectModel(state, model) {
            state.SelectModel = model
        },
    },
    actions: {
        updateSelectModel({ commit }, model) {
            commit('setSelectModel', model)
        }
    },
    getters: {
        getSelectedModel: (state) => state.SelectModel,
    }
})

export default store;