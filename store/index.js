export const state = () => ({
  myState: 0,
  places: {},
  readOnly: true,
  drawer: true,
  editedIndex: -1,
  placeId: null,
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
  setDrawer(state, payload) {
    state.drawer = payload
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
}
