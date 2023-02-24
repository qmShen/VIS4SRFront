import {dataService} from '@/service';

// initial state
const state = () => ({
  dataLoading: false,
  imageMetrics: null,
  metricNames: [],
  datasetIds: []
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
  loadSRMetrics({ state, commit }, ) {
    let st = new Date();
    dataService.loadSRMetrics({ commit }, resp => {
      console.log("fetchRoute use time: ", new Date() - st)
      console.log('load metrics data', resp)
      state.imageMetrics = resp
    })
  },
  loadMetricNames({state, commit}, ){
    let st = new Date();
    dataService.loadMertricNames({commit}, resp =>{
      console.log("fetchRoute use time: ", new Date() - st)
      console.log('load metrics name', resp)
      state.metricNames = resp
    })
  },
  loadDatasetIds({state, commit}, ){
    let st = new Date();
    dataService.loadSRDatasetIds({commit}, resp =>{
      console.log("fetchRoute use time: ", new Date() - st)
      console.log('load datasetids name', resp)
      state.datasetIds = resp
    })
  }
}

// mutations
const mutations = {

}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
