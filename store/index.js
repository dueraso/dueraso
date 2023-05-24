export const state = () => ({
  counter: 0,
  faqCategory: ""
});

export const mutations = {
  increment(state) {
    state.counter++;
  },
  setFaqCatagory(state, payload) {
    state.faqCategory = payload;
  }
};

export const getters = {
  isAuthenticated(state){
    return state.auth.loggedIn
  },

  loggedUser(state){
    return state.auth.user
  }
};
