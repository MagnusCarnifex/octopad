/*
 * ~/src/store/index.js
 * Vuex store index
 */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    errors: {},
    selectedLabel: null,
    selectedTokenId: null,
    analyseMode: false,
    mockData: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              marks: [
                {
                  type: 'token',
                  attrs: {
                    'data-label-name': 'Timekeeping',
                    'data-label-color': 'pink',
                    'data-token-id': 1,
                  },
                },
              ],
              text: 'I always managed to get there on time. ',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'token',
                  attrs: {
                    'data-label-name': 'Improving Knowledge',
                    'data-label-color': 'orange',
                    'data-token-id': 2,
                  },
                },
              ],
              text: 'I discovered how to do functions inside an Excel file. ',
            },
          ],
        },
      ],
    },
  },

  getters: {
    errors(state) {
      return state.errors;
    },
    selectedLabel(state) {
      return state.selectedLabel;
    },
    selectedTokenId(state) {
      return state.selectedTokenId;
    },
    mockData(state) {
      return state.mockData;
    },
    analyseMode(state) {
      return state.analyseMode;
    },
  },

  mutations: {
    SET_ERRORS(state, data) {
      state.errors = data;
    },
    SET_SELECTED_LABEL(state, data) {
      state.selectedLabel = data;
    },
    SET_SELECTED_TOKEN_ID(state, data) {
      state.selectedTokenId = data;
    },
    TOGGLE_ANALYSE_MODE(state) {
      state.analyseMode = !state.analyseMode;
    },
  },

  actions: {
    setErrors({ commit }, errors) {
      commit('SET_ERRORS', errors);
    },
  },
  modules: {},
});
