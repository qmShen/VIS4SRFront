import {dataService} from '@/service';

// initial state
const state = () => ({
  dataLoading: false,
})

// getters
const getters = {}

// actions
const actions = {
  loadSRModels({ state, commit }, ) {
    let st = new Date();
    dataService.loadSRModels({ commit }, resp => {
      console.log("fetchRoute use time: ", new Date() - st)
      console.log('load first data', resp)
      state.dataLoading = true
    })
  },
  loadSRMetrics({ commit }, ) {
    let st = new Date();
    console.log('1111')
    dataService.loadSRMetrics({ commit }, resp => {
      console.log("fetchRoute use time: ", new Date() - st)
      console.log('fff', resp)
    })
  }
}

// mutations
const mutations = {
  updateModelPerformance(state, data) {
    data.results.forEach(d=>{
      d.renderConfig = {}
      // for(let model_id in state.modelId2Label){
      //   let label = state.modelId2Label[model_id]
      //   let labelName = data.label2Name[label]
      // }
    })
    state.modelPerformance = data.results//把data数据丢到state里定义的
    state.label2Name = data.label2Name
  },
  updateGroupSelected(state, data){
    state.groupSelected = data;
  },
  updateMouseoverSelected(state, data){
    state.mouseoverSelected = data;
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
