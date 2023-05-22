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
