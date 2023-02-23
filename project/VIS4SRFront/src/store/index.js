import Vue from 'vue';
import Vuex from 'vuex';
import test from './module/test';
import SR from './module/SR';
Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    test, SR
  },
  // strict: debug,
  strict: false,
})
