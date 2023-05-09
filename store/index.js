export const state = () => ({
  myState: 0,
  places: {},
  readOnly: true,
  editedIndex: -1,
  placeId: null,
  login: true,
  urlImgTopic: '',
})

export const mutations = {
  increment(state) {
    state.counter++
  },
  setPlaces(state, payload) {
    state.places = payload
  },
  setReadOnly(state, payload) {
    state.readOnly = payload
  },
  setEditedIndex(state, payload) {
    state.editedIndex = payload
  },
  setPlaceId(state, payload) {
    state.placeId = payload
  },
  setUrlImgTopic(state, payload) {
    state.urlImgTopic = payload
  },
  setLogin(state, payload) {
    state.login = payload
  },
}
